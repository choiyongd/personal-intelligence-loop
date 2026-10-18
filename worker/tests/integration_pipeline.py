"""Runs against the ephemeral protocol harness OR a deliberately seeded test DB.

This filename is intentionally not collected by the default unit test run.
The harness sets ROLE to pil_worker before opening its test-only socket.
It verifies production Store SQL and transactional writes, not login or concurrency.
"""
import os
from datetime import datetime, timedelta, timezone

import pytest

from pil_worker.fetch import fetch
from pil_worker.normalize import clean
from pil_worker.runner import process_one
from pil_worker.store import LeaseLost, Store

T1='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
T2='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'


@pytest.fixture
def store():
    if not os.getenv('PIL_TEST_DSN'):
        pytest.skip('run npm run test:worker-integration')
    return Store(os.environ['PIL_TEST_DSN'])


def enqueue(store,tenant,source):
    with store.connect() as conn:
        return conn.execute('insert into public.ingestion_jobs(tenant_id,source_id) values(%s,%s) returning id',
                            (tenant,source)).fetchone()['id']


def counts(store,tenant):
    with store.connect() as conn:
        return tuple(conn.execute(f'select count(*) as n from public.{table} where tenant_id=%s',(tenant,)).fetchone()['n']
                     for table in ['articles','events','observations'])


def test_pipeline_collects_clusters_and_replays_idempotently(store):
    enqueue(store,T1,'demo-rss');enqueue(store,T1,'demo-mirror');enqueue(store,T2,'demo-rss')
    assert process_one(store) and process_one(store) and process_one(store)
    assert counts(store,T1)==(4,3,5)
    assert counts(store,T2)==(3,3,3)
    enqueue(store,T1,'demo-rss');assert process_one(store)
    assert counts(store,T1)==(4,3,5)
    with store.connect() as conn:
        assert conn.execute("select count(*) as n from public.ingestion_jobs where state='succeeded'").fetchone()['n']==4
        assert conn.execute("select count(*) as n from public.ingestion_logs where code='completed'").fetchone()['n']==4


def test_retry_lease_reclaim_fences_old_writer_and_commits_atomically(store):
    enqueue(store,T1,'demo-rss')
    old=store.claim(120,4)
    source=store.source('demo-rss')
    raw,_=fetch(source,False,'test');item=clean(raw[0],source)
    with store.connect() as conn:
        conn.execute("update public.ingestion_jobs set leased_until=now()-interval '1 second' where id=%s",(old['id'],))
    new=store.claim(120,4)
    assert new['id']==old['id'] and new['lease_token']!=old['lease_token'] and new['attempt']==2
    before=counts(store,T1)
    with pytest.raises(LeaseLost):store.commit(old,source,[item],0,{})
    assert counts(store,T1)==before
    store.fail(new,'http_transient',True,4)
    with store.connect() as conn:
        j=conn.execute('select * from public.ingestion_jobs where id=%s',(new['id'],)).fetchone()
        assert j['state']=='retry' and j['lease_token'] is None and j['available_at']>datetime.now(timezone.utc)
        conn.execute("update public.ingestion_jobs set available_at=now()-interval '1 second' where id=%s",(j['id'],))
    final=store.claim(120,4);assert final['attempt']==3
    store.commit(final,source,[item],0,{})
    assert counts(store,T1)==before


def test_failed_commit_rolls_back_article_and_event_writes(store):
    enqueue(store,T1,'demo-rss');job=store.claim(120,4)
    source=store.source('demo-rss')
    from pil_worker.models import Item
    from dataclasses import replace
    item=clean(Item('rollback-test','Orion robotics completely different event','https://news.example.com/rollback',datetime.now(timezone.utc)),source)
    bad=replace(item,excerpt='Unauthorized body')
    before=counts(store,T1)
    with pytest.raises(Exception):store.commit(job,source,[bad],0,{})
    assert counts(store,T1)==before
    store.fail(job,'policy_test',False,4)


def test_scheduler_does_not_duplicate_recent_or_active_jobs(store):
    with store.connect() as conn:
        before=conn.execute('select count(*) as n from public.ingestion_jobs').fetchone()['n']
    store.schedule();store.schedule()
    with store.connect() as conn:
        assert conn.execute('select count(*) as n from public.ingestion_jobs').fetchone()['n']==before


def test_source_cooldown_applies_to_same_job_retry(store):
    with store.connect() as conn:
        conn.execute("update public.ingestion_jobs set available_at=now()-interval '1 second' where source_id='slow-rss'")
    job=store.claim(120,4)
    assert job['source_id']=='slow-rss'
    store.fail(job,'http_transient',True,4)
    with store.connect() as conn:
        conn.execute("update public.ingestion_jobs set available_at=now()-interval '1 second' where id=%s",(job['id'],))
    assert store.claim(120,4) is None
