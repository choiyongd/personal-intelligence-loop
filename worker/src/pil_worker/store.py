import json
import random
from datetime import datetime, timezone
from uuid import uuid4

import psycopg
from psycopg.rows import dict_row

from .cluster import choose_event
from .models import License, Source


class LeaseLost(Exception):
    pass


class Store:
    def __init__(self, url: str):
        self.url = url

    def connect(self):
        conn = psycopg.connect(self.url, row_factory=dict_row, connect_timeout=10)
        # Fail closed if configured with a broad administrator credential.
        with conn.cursor() as cursor:
            cursor.execute('select current_user as name')
            if cursor.fetchone()['name'] != 'pil_worker':
                conn.close()
                raise RuntimeError('DATABASE_URL must use dedicated pil_worker login')
        conn.commit()
        return conn

    def schedule(self):
        with self.connect() as conn:
            # Serialize scheduler runs; active-job partial UNIQUE still protects manual enqueue races.
            conn.execute("select pg_advisory_xact_lock(63891201)")
            conn.execute("""
              insert into public.ingestion_jobs(tenant_id,source_id)
              select sub.tenant_id,sub.source_id from public.subscriptions sub
              join public.sources s on s.id=sub.source_id
              join public.license_registry l on l.id=s.license_id
              where sub.enabled and s.enabled and l.status='approved' and l.allow_metadata and l.review_due_at>now()
                and not exists(select 1 from public.ingestion_jobs j where j.tenant_id=sub.tenant_id and j.source_id=sub.source_id
                  and (j.state in ('queued','running','retry') or j.created_at>now()-make_interval(secs=>greatest(3600,s.min_interval_seconds))))
              on conflict do nothing
            """)

    def claim(self, lease_seconds: int, max_attempts: int):
        with self.connect() as conn:
            # Serialize claim selection to enforce source-wide rate limiting across processes/tenants.
            conn.execute('select pg_advisory_xact_lock(63891202)')
            expired = conn.execute("""
              update public.ingestion_jobs set state='dead',error_code='lease_exhausted',finished_at=now(),lease_token=null
              where state='running' and leased_until<now() and attempt>=%s returning id,tenant_id
            """, (max_attempts,)).fetchall()
            for job in expired:
                self.log(conn, job, 'error', 'lease_exhausted', {})
            job = conn.execute("""
              select j.* from public.ingestion_jobs j join public.sources s on s.id=j.source_id
              where ((j.state in ('queued','retry') and j.available_at<=now()) or (j.state='running' and j.leased_until<now()))
                and j.attempt<%s
                and not exists(select 1 from public.ingestion_jobs busy where busy.source_id=j.source_id
                  and busy.id<>j.id and busy.state='running' and busy.leased_until>now())
                and not exists(select 1 from public.ingestion_jobs recent where recent.source_id=j.source_id
                  and recent.started_at>now()-make_interval(secs=>s.min_interval_seconds))
              order by j.available_at,j.id for update of j skip locked limit 1
            """, (max_attempts,)).fetchone()
            if not job:
                return None
            token = uuid4()
            job = conn.execute("""
              update public.ingestion_jobs set state='running',attempt=attempt+1,lease_token=%s,
                leased_until=now()+make_interval(secs=>%s),started_at=now()
              where id=%s returning *
            """, (token, lease_seconds, job['id'])).fetchone()
            self.log(conn, job, 'info', 'claimed', {'attempt': job['attempt']})
            return job

    def source(self, source_id: str) -> Source:
        with self.connect() as conn:
            row = conn.execute("""
              select s.*,l.status,l.allow_metadata,l.max_excerpt_chars,l.review_due_at
              from public.sources s join public.license_registry l on l.id=s.license_id where s.id=%s
            """, (source_id,)).fetchone()
            if not row:
                raise ValueError('source_missing')
            return Source(row['id'], row['kind'], row['endpoint'], tuple(row['allowed_hosts']),
                          License(row['license_id'], row['status'], row['allow_metadata'], row['max_excerpt_chars'], row['review_due_at']), row['enabled'])

    @staticmethod
    def fence(conn, job):
        current = conn.execute('select * from public.ingestion_jobs where id=%s for update', (job['id'],)).fetchone()
        if (not current or current['state'] != 'running' or current['lease_token'] != job['lease_token']
                or current['leased_until'] <= datetime.now(timezone.utc)):
            raise LeaseLost('lease_lost')
        return current

    @staticmethod
    def log(conn, job, level, code, details):
        conn.execute('insert into public.ingestion_logs(tenant_id,job_id,level,code,details) values(%s,%s,%s,%s,%s::jsonb)',
                     (job['tenant_id'], job['id'], level, code, json.dumps(details)))

    def commit(self, job, source, items, rejected, reasons):
        with self.connect() as conn:
            self.fence(conn, job)
            t = job['tenant_id']
            conn.execute('select pg_advisory_xact_lock(hashtextextended(%s,0))', (str(t),))
            # Policy/subscription rechecked AFTER fetch, under shared row locks; revocation races wait.
            active = conn.execute('select private.lock_source_policy(%s,%s) as allowed', (t, source.id)).fetchone()
            if not active['allowed']:
                from .models import PolicyDenied
                raise PolicyDenied('source_policy_changed')
            for item in items:
                # Existing observation identity preserves its original article association.
                existing = conn.execute("""
                  select a.id,a.event_id from public.articles a join public.observations o
                  on o.tenant_id=a.tenant_id and o.article_id=a.id
                  where o.tenant_id=%s and o.source_id=%s and o.external_id=%s
                """, (t, source.id, item.external_id)).fetchone()
                if not existing:
                    existing = conn.execute('select id,event_id from public.articles where tenant_id=%s and url_hash=%s', (t, item.url_hash)).fetchone()
                if existing:
                    article_id, event_id = existing['id'], existing['event_id']
                else:
                    candidates = conn.execute("""
                      select * from public.events where tenant_id=%s
                      and anchor_published_at between %s-interval '72 hours' and %s+interval '72 hours'
                      order by id
                    """, (t, item.published_at, item.published_at)).fetchall()
                    match = choose_event(item, candidates)
                    if match:
                        event_id = match[1]
                    else:
                        event_id = conn.execute("""
                          insert into public.events(tenant_id,title,anchor_tokens,anchor_numbers,anchor_published_at)
                          values(%s,%s,%s,%s,%s) returning id
                        """, (t, item.title, list(item.tokens), list(item.numbers), item.published_at)).fetchone()['id']
                    article_id = conn.execute("""
                      insert into public.articles(tenant_id,canonical_url,url_hash,title,published_at,title_tokens,event_id,country_codes)
                      values(%s,%s,%s,%s,%s,%s,%s,%s) returning id
                    """, (t, item.canonical_url, item.url_hash, item.title, item.published_at, list(item.tokens), event_id,
                           ['US'] if source.id == 'federal-register' else [])).fetchone()['id']
                changed = conn.execute("""
                  insert into public.observations(tenant_id,article_id,source_id,external_id,original_url,title,published_at,excerpt,content_hash,license_id)
                  values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                  on conflict(tenant_id,source_id,external_id) do update set original_url=excluded.original_url,
                  title=excluded.title,published_at=excluded.published_at,excerpt=excluded.excerpt,
                  content_hash=excluded.content_hash,license_id=excluded.license_id,fetched_at=now()
                  where public.observations.content_hash<>excluded.content_hash returning id
                """, (t, article_id, source.id, item.external_id, item.original_url, item.title, item.published_at,
                       item.excerpt, item.content_hash, source.license.id)).fetchone()
                if changed:
                    conn.execute('update public.events set last_seen_at=now() where tenant_id=%s and id=%s', (t, event_id))
            conn.execute("""
              update public.ingestion_jobs set state='succeeded',accepted=%s,rejected=%s,
              finished_at=now(),lease_token=null,leased_until=null,error_code=null where id=%s
            """, (len(items), rejected, job['id']))
            self.log(conn, job, 'info', 'completed', {'accepted': len(items), 'rejected': rejected, 'reasons': reasons})

    def fail(self, job, code, retryable, max_attempts):
        with self.connect() as conn:
            self.fence(conn, job)
            retry = retryable and job['attempt'] < max_attempts
            # Job retry is durable. No long blocking sleep or network call holds a DB transaction.
            delay = min(3600, 30 * 2 ** (job['attempt'] - 1)) + random.randint(0, 15)
            conn.execute("""
              update public.ingestion_jobs set state=%s,error_code=%s,
              available_at=now()+make_interval(secs=>%s),lease_token=null,leased_until=null,
              finished_at=case when %s then null else now() end where id=%s
            """, ('retry' if retry else 'dead', code, delay, retry, job['id']))
            self.log(conn, job, 'warning' if retry else 'error', code, {'attempt': job['attempt'], 'retry': retry})
