import argparse
import json
import os
import time

from dotenv import load_dotenv

from .runner import process_one
from .store import Store


def main():
    load_dotenv()
    parser = argparse.ArgumentParser(description='PIL independent ingestion worker')
    parser.add_argument('command', choices=['once', 'run', 'schedule', 'drain', 'check'])
    parser.add_argument('--schedule', action='store_true', help='enqueue due subscriptions before work')
    args = parser.parse_args()
    url = os.getenv('DATABASE_URL')
    if not url:
        parser.error('DATABASE_URL is required; copy worker/.env.example to worker/.env')
    store = Store(url)
    options = dict(live=os.getenv('ALLOW_LIVE_FETCH', 'false').lower() == 'true',
                   user_agent=os.getenv('USER_AGENT', 'PersonalIntelligenceLoop/0.1'),
                   lease_seconds=int(os.getenv('LEASE_SECONDS', '120')),
                   max_attempts=int(os.getenv('MAX_ATTEMPTS', '4')))
    if not 1 <= options['max_attempts'] <= 4 or options['lease_seconds'] < 60:
        parser.error('MAX_ATTEMPTS must be 1..4 and LEASE_SECONDS >= 60')
    if args.command == 'check':
        with store.connect() as conn:
            conn.execute('select 1')
        print(json.dumps({'status': 'ok', 'role': 'pil_worker'}))
        return
    if args.command == 'schedule':
        store.schedule()
        return
    last_schedule = 0.0
    while True:
        if args.schedule and time.monotonic() - last_schedule >= 60:
            store.schedule()
            last_schedule = time.monotonic()
        worked = process_one(store, **options)
        if args.command == 'once' or (args.command == 'drain' and not worked):
            break
        if not worked:
            time.sleep(max(1, int(os.getenv('POLL_SECONDS', '5'))))


if __name__ == '__main__':
    main()
