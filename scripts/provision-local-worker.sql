-- LOCAL DEVELOPMENT ONLY. Do not apply this known password to a hosted project.
-- psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f scripts/provision-local-worker.sql
alter role pil_worker login password 'local-dev-worker-only';
