import json
from collections import Counter

import psycopg

from .fetch import FetchError, fetch
from .models import DataQualityError, PolicyDenied
from .normalize import clean
from .store import LeaseLost


def process_one(store, *, live=False, user_agent='PersonalIntelligenceLoop/0.1', lease_seconds=120, max_attempts=4):
    job = store.claim(lease_seconds, max_attempts)
    if not job:
        return False
    try:
        source = store.source(job['source_id'])
        raw, rejected = fetch(source, live, user_agent)
        items, reasons = [], Counter()
        if rejected:
            reasons['parse_error'] = rejected
        for item in raw:
            try:
                items.append(clean(item, source))
            except DataQualityError as e:
                rejected += 1
                reasons[str(e)] += 1
        # Empty valid feeds may succeed; all-bad feeds must be observable as terminal failure.
        if rejected and not items:
            raise FetchError('quality_all_rejected')
        store.commit(job, source, sorted(items, key=lambda i: (i.published_at, i.url_hash, i.external_id)), rejected, dict(reasons))
    except LeaseLost:
        print(json.dumps({'code': 'lease_lost', 'job_id': str(job['id'])}))
    except (PolicyDenied, DataQualityError) as e:
        record_failure(store, job, str(e), False, max_attempts)
    except FetchError as e:
        record_failure(store, job, e.code, e.retryable, max_attempts)
    except psycopg.Error as e:
        # SQL messages may contain submitted text or DSNs. Log only SQLSTATE-derived code.
        record_failure(store, job, f'database_{e.sqlstate or "unavailable"}', e.sqlstate in {'40001', '40P01', '08006', '08001'}, max_attempts)
    except Exception:
        record_failure(store, job, 'unexpected_failure', False, max_attempts)
    return True


def record_failure(store, job, code, retryable, max_attempts):
    try:
        store.fail(job, code, retryable, max_attempts)
    except (LeaseLost, psycopg.Error):
        # If DB is down, the lease expiry causes reclaim; stale writers are fenced.
        print(json.dumps({'code': 'failure_record_unavailable', 'job_id': str(job['id'])}))
