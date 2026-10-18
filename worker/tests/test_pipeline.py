from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest

from pil_worker.cluster import choose_event, score
from pil_worker.fetch import FetchError, fetch, parse_federal_register, parse_rss, safe_get
from pil_worker.models import DataQualityError, Item, License, PolicyDenied, Source
from pil_worker.normalize import canonicalize, clean, plain_text
from pil_worker.runner import process_one
from pil_worker.store import LeaseLost, Store

NOW = datetime(2026, 10, 15, 12, tzinfo=timezone.utc)
LICENSE = License('synthetic-v1', 'approved', True, 0, NOW + timedelta(days=2000))
SOURCE = Source('demo-rss', 'fixture_rss', 'demo.xml', ('news.example.com',), LICENSE)


@pytest.mark.parametrize('raw,expected', [
    ('https://NEWS.example.com/a?utm_source=x&b=2&a=1#part', 'https://news.example.com/a?a=1&b=2'),
    ('https://news.example.com/a?q=2&q=1', 'https://news.example.com/a?q=1&q=2'),
    ('https://news.example.com/A/', 'https://news.example.com/A/'),
    ('https://news.example.com:443/a?fbclid=x&id=7', 'https://news.example.com/a?id=7'),
])
def test_canonicalization(raw, expected):
    assert canonicalize(raw, SOURCE.allowed_hosts) == expected


@pytest.mark.parametrize('url', ['javascript:alert(1)', 'http://localhost/x', 'http://127.0.0.1/x',
    'http://169.254.169.254/', 'http://[::1]/', 'https://user:pass@news.example.com/',
    'https://news.example.com:8080/', 'https://news.example.com.evil.test/', 'https://evil.test/',
    'https://news.example.com/\nattack', 'https://news.example.com\\@evil.test/'])
def test_url_denials(url):
    with pytest.raises(DataQualityError):
        canonicalize(url, SOURCE.allowed_hosts)


def test_sanitization_and_zero_excerpt():
    item = Item('guid', '<b>Atlas AI policy</b><script>bad()</script>', 'https://news.example.com/a', NOW, 'Publisher full text')
    result = clean(item, SOURCE, NOW)
    assert result.title == 'Atlas AI policy'
    assert result.excerpt == ''
    assert len(result.content_hash) == 64
    assert plain_text('<style>hidden</style>Visible') == 'Visible'


@pytest.mark.parametrize('date', [NOW + timedelta(days=2), NOW - timedelta(days=91), NOW.replace(tzinfo=None)])
def test_date_quality(date):
    with pytest.raises(DataQualityError):
        clean(Item('id', 'Atlas AI evaluation policy', 'https://news.example.com/a', date), SOURCE, NOW)


@pytest.mark.parametrize('status,metadata,due', [('pending', True, 1), ('revoked', True, 1), ('approved', False, 1), ('approved', True, -1)])
def test_license_denied_before_processing(status, metadata, due):
    license = License('x', status, metadata, 0, NOW + timedelta(days=due))
    with pytest.raises(PolicyDenied):
        license.check(NOW)


def test_rss_parse_skips_bad_dates_and_ignores_full_text():
    xml=b'<rss><channel><item><guid>1</guid><title>Atlas policy</title><link>https://news.example.com/a</link><pubDate>2026-10-15</pubDate><description>Do not copy</description></item><item><pubDate>bad</pubDate></item></channel></rss>'
    items,rejected=parse_rss(xml)
    assert len(items)==1 and rejected==1 and items[0].excerpt==''


def test_atom():
    xml=b'<feed xmlns="http://www.w3.org/2005/Atom"><entry><id>x</id><title>Atlas AI policy</title><link href="https://news.example.com/x"/><updated>2026-10-15T12:00:00Z</updated></entry></feed>'
    items,rejected=parse_rss(xml)
    assert items[0].external_id=='x' and rejected==0


def test_xxe_denied():
    with pytest.raises(FetchError,match='invalid_xml'):
        parse_rss(b'<!DOCTYPE rss [<!ENTITY x SYSTEM "file:///etc/passwd">]><rss><channel><title>&x;</title></channel></rss>')


def test_api_only_selected_fields():
    items,rejected=parse_federal_register(b'{"results":[{"document_number":"1","title":"Atlas AI policy","html_url":"https://news.example.com/x","publication_date":"2026-10-15","body":"Never persist"},{}]}')
    assert len(items)==1 and rejected==1 and items[0].excerpt==''


def test_cluster_requires_date_numbers_and_overlap():
    assert score(('atlas','ai','evaluation','policy'),(),NOW,['atlas','ai','evaluation','policy'],[],NOW)==1
    assert score(('atlas','ai','evaluation','policy'),('10',),NOW,['atlas','ai','evaluation','policy'],['20'],NOW)==0
    assert score(('atlas','ai','evaluation','policy'),(),NOW,['atlas','ai','evaluation','policy'],[],NOW-timedelta(days=4))==0
    assert score(('same','industry'),(),NOW,['same','industry'],[],NOW)==0
    item=clean(Item('1','Atlas AI evaluation policy','https://news.example.com/a',NOW),SOURCE,NOW)
    candidates=[dict(id='b',anchor_tokens=list(item.tokens),anchor_numbers=[],anchor_published_at=NOW),dict(id='a',anchor_tokens=list(item.tokens),anchor_numbers=[],anchor_published_at=NOW)]
    assert choose_event(item,candidates)==(1.0,'a')


def test_fixture_replay_has_stable_url_identity():
    one,_=fetch(SOURCE,False,'test');two,_=fetch(SOURCE,False,'test')
    assert clean(one[0],SOURCE).url_hash==clean(two[0],SOURCE).url_hash


def test_no_live_network_without_opt_in():
    live=Source('x','rss','https://news.example.com/rss',SOURCE.allowed_hosts,LICENSE)
    with patch('pil_worker.fetch.safe_get') as network:
        with pytest.raises(PolicyDenied,match='live_fetch_disabled'):
            fetch(live,False,'test')
        network.assert_not_called()


def test_dns_private_denied_before_connection():
    live=Source('x','rss','https://news.example.com/rss',SOURCE.allowed_hosts,LICENSE)
    with patch('socket.getaddrinfo',return_value=[(2,1,6,'',('127.0.0.1',443))]),patch('pil_worker.fetch.PinnedHTTPS') as connection:
        with pytest.raises(PolicyDenied,match='private_network_denied'):
            safe_get(live,'test')
        connection.assert_not_called()


class FakeStore:
    def __init__(self): self.failure=None;self.committed=None
    def claim(self,*args): return {'id':'job','tenant_id':'team','source_id':'demo-rss','attempt':1}
    def source(self,*args): return SOURCE
    def commit(self,*args): self.committed=args
    def fail(self,*args): self.failure=args


def test_runner_retries_transient_fetch_error():
    store=FakeStore()
    with patch('pil_worker.runner.fetch',side_effect=FetchError('http_transient',True)):
        assert process_one(store)
    assert store.failure[1:]==('http_transient',True,4) and store.committed is None


def test_runner_does_not_retry_policy_denial():
    store=FakeStore()
    with patch('pil_worker.runner.fetch',side_effect=PolicyDenied('license_denied')):
        process_one(store)
    assert store.failure[1:]==('license_denied',False,4)


def test_runner_reports_data_quality_without_payloads():
    store=FakeStore()
    process_one(store)
    assert len(store.committed[2])==3
    assert store.committed[3]==2
    assert store.committed[4]=={'parse_error':1,'private_host':1}


def test_lease_fence_rejects_stale_token():
    class Result:
        def fetchone(self): return {'state':'running','lease_token':'new-token','leased_until':NOW+timedelta(days=1000)}
    class Conn:
        def execute(self,*args): return Result()
    with pytest.raises(LeaseLost): Store.fence(Conn(),{'id':'j','lease_token':'old-token'})
