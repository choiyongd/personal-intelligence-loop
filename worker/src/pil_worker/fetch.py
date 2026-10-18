import http.client
import ipaddress
import json
import socket
import ssl
import time
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlsplit

from defusedxml import ElementTree as ET
from defusedxml.common import DefusedXmlException

from .models import DataQualityError, Item, PolicyDenied, Source
from .normalize import canonicalize

MAX_BYTES = 2 * 1024 * 1024
MAX_ITEMS = 200
FETCH_DEADLINE_SECONDS = 30


class FetchError(Exception):
    def __init__(self, code: str, retryable: bool = False):
        self.code, self.retryable = code, retryable
        super().__init__(code)


class PinnedHTTPS(http.client.HTTPSConnection):
    """Connect to a validated IP while preserving hostname TLS verification/SNI."""
    def __init__(self, host, ip):
        super().__init__(host, timeout=15, context=ssl.create_default_context())
        self.ip = ip

    def connect(self):
        raw = socket.create_connection((self.ip, 443), self.timeout)
        self.sock = self._context.wrap_socket(raw, server_hostname=self.host)


def safe_get(source: Source, user_agent: str) -> bytes:
    canonical = canonicalize(source.endpoint, source.allowed_hosts)
    p = urlsplit(canonical)
    if p.scheme != 'https':
        raise PolicyDenied('https_required')
    try:
        deadline = time.monotonic() + FETCH_DEADLINE_SECONDS
        ips = sorted({r[4][0] for r in socket.getaddrinfo(p.hostname, 443, type=socket.SOCK_STREAM)})
        if not ips or any(not ipaddress.ip_address(ip).is_global for ip in ips):
            raise PolicyDenied('private_network_denied')
        connection = PinnedHTTPS(p.hostname, ips[0])
        try:
            connection.request('GET', p.path + ('?' + p.query if p.query else ''),
                               headers={'User-Agent': user_agent, 'Accept': 'application/json, application/rss+xml, application/atom+xml, application/xml', 'Accept-Encoding': 'identity'})
            response = connection.getresponse()
            if response.status in {408, 429} or response.status >= 500:
                raise FetchError('http_transient', retryable=True)
            if response.status != 200:
                # No redirects; no cookies/proxy inherited; no third-party full-page scraping.
                raise FetchError('http_denied')
            if response.getheader('Content-Encoding', 'identity') != 'identity':
                raise FetchError('encoding_denied')
            length = response.getheader('Content-Length')
            if length and int(length) > MAX_BYTES:
                raise FetchError('payload_too_large')
            chunks, total = [], 0
            while True:
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    raise FetchError('fetch_deadline', retryable=True)
                if connection.sock:
                    connection.sock.settimeout(min(15, remaining))
                chunk = response.read1(min(65536, MAX_BYTES + 1 - total))
                if not chunk:
                    break
                total += len(chunk)
                if total > MAX_BYTES:
                    raise FetchError('payload_too_large')
                chunks.append(chunk)
            return b''.join(chunks)
        finally:
            connection.close()
    except (socket.timeout, TimeoutError, socket.gaierror, ConnectionError, http.client.HTTPException, ssl.SSLError) as e:
        raise FetchError('network_failure', retryable=True) from e


def parse_date(value: str) -> datetime:
    try:
        result = datetime.fromisoformat(value.replace('Z', '+00:00'))
        if len(value) == 10:
            result = result.replace(tzinfo=timezone.utc)
    except ValueError:
        result = parsedate_to_datetime(value)
    if result.tzinfo is None:
        raise DataQualityError('timezone_missing')
    return result.astimezone(timezone.utc)


def parse_rss(payload: bytes) -> tuple[list[Item], int]:
    if len(payload) > MAX_BYTES:
        raise FetchError('payload_too_large')
    try:
        root = ET.fromstring(payload)
    except (ET.ParseError, DefusedXmlException) as e:
        raise FetchError('invalid_xml') from e
    atom = '{http://www.w3.org/2005/Atom}'
    nodes = root.findall('./channel/item') if root.tag == 'rss' else root.findall(f'{atom}entry')
    if root.tag not in {'rss', f'{atom}feed'}:
        raise FetchError('unsupported_feed')
    items, rejected = [], 0
    for node in nodes[:MAX_ITEMS]:
        try:
            if root.tag == 'rss':
                url = node.findtext('link', '')
                title = node.findtext('title', '')
                external_id = node.findtext('guid') or url
                date = node.findtext('pubDate', '')
                # Do not parse descriptions: baseline licenses prohibit excerpts.
            else:
                link = next((n for n in node.findall(f'{atom}link') if n.get('rel', 'alternate') == 'alternate'), None)
                url = link.get('href', '') if link is not None else ''
                title = node.findtext(f'{atom}title', '')
                external_id = node.findtext(f'{atom}id') or url
                date = node.findtext(f'{atom}published') or node.findtext(f'{atom}updated', '')
            items.append(Item(external_id, title, url, parse_date(date)))
        except (ValueError, TypeError, OverflowError):
            rejected += 1
    return items, rejected


def parse_federal_register(payload: bytes) -> tuple[list[Item], int]:
    try:
        result = json.loads(payload)
        entries = result['results']
        if not isinstance(entries, list):
            raise ValueError('results')
    except (ValueError, KeyError, TypeError) as e:
        raise FetchError('invalid_json') from e
    items, rejected = [], 0
    for row in entries[:MAX_ITEMS]:
        try:
            items.append(Item(str(row['document_number']), row['title'], row['html_url'], parse_date(row['publication_date'])))
        except (ValueError, KeyError, TypeError, OverflowError):
            rejected += 1
    return items, rejected


def fetch(source: Source, live: bool, user_agent: str) -> tuple[list[Item], int]:
    source.license.check()
    if not source.enabled:
        raise PolicyDenied('source_disabled')
    if source.kind == 'fixture_rss':
        # Fixed file allowlist, not arbitrary registry path reads.
        if source.endpoint not in {'demo.xml', 'mirror.xml'}:
            raise PolicyDenied('fixture_denied')
        payload = (Path(__file__).parent / 'fixtures' / source.endpoint).read_bytes()
        items, rejected = parse_rss(payload)
        # Relative synthetic dates keep local demos runnable long after creation.
        today = datetime.now(timezone.utc).replace(hour=8, minute=0, second=0, microsecond=0)
        from datetime import timedelta
        items = [Item(i.external_id, i.title, i.url, today - timedelta(days=n // 3)) for n, i in enumerate(items)]
        return items, rejected
    if not live:
        raise PolicyDenied('live_fetch_disabled')
    payload = safe_get(source, user_agent)
    return parse_federal_register(payload) if source.kind == 'federal_register' else parse_rss(payload)
