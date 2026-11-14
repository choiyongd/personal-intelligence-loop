-- Web push: browsers (and home-screen apps) that asked for a notice when the day's new stories are out.
-- Server-only tables (service-role key), like the beta and live tables: anon and authenticated clients get nothing.
create table public.push_subscriptions (
  id bigint generated always as identity primary key,
  -- The push service address is itself the secret that lets us reach this browser; it is never shown back.
  endpoint text not null unique check(length(endpoint) between 20 and 1000 and endpoint ~ '^https://'),
  p256dh text not null check(length(p256dh) between 40 and 200),
  auth text not null check(length(auth) between 10 and 100),
  locale text not null default 'ko' check(locale in ('ko','en')),
  -- Fields the reader picked when they turned notices on; empty means every field.
  industries text[] not null default '{}' check(cardinality(industries) <= 30),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_sent_at timestamptz,
  last_test_at timestamptz,
  failures smallint not null default 0 check(failures between 0 and 100)
);
create index push_subscriptions_locale on public.push_subscriptions(locale, id);

-- One row per day once that day's notice has gone out, so a re-run never notifies twice.
create table public.push_sends (
  issue_date date primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  articles integer not null default 0,
  stats jsonb not null default '{}'::jsonb
);

alter table public.push_subscriptions enable row level security;
alter table public.push_sends enable row level security;
revoke all on public.push_subscriptions, public.push_sends from anon, authenticated;
do $$ begin
  if exists(select 1 from pg_roles where rolname='pil_worker') then
    revoke all on public.push_subscriptions, public.push_sends from pil_worker;
  end if;
end $$;
