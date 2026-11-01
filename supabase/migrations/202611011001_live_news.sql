-- Daily live news: items collected from approved public feeds, and the articles written from them.
-- Server-only tables (service-role key), like the beta tables: anon and authenticated clients get nothing.
create table public.live_items (
  id bigint generated always as identity primary key,
  feed_id text not null check(length(feed_id) between 1 and 40),
  url text not null unique check(length(url) <= 1000 and url ~ '^https://'),
  title text not null check(length(title) between 1 and 400),
  -- The feed's own short description, capped; article bodies from news publishers are never stored.
  summary text not null default '' check(length(summary) <= 1500),
  published_at timestamptz,
  collected_at timestamptz not null default now(),
  story_id text
);
create index live_items_recent on public.live_items(collected_at desc);
create index live_items_unused on public.live_items(collected_at desc) where story_id is null;

-- One row per story the editor picked for a day; it becomes readable once status is 'published'.
create table public.live_articles (
  id text primary key check(id ~ '^n-[0-9]{6}-[a-z0-9]{4,12}$'),
  issue_date date not null,
  industry text not null,
  topic text not null,
  regions text[] not null,
  type text not null default 'news' check(type in ('news','research')),
  angle text not null default '' check(length(angle) <= 600),
  item_ids bigint[] not null check(cardinality(item_ids) between 1 and 8),
  article jsonb,
  model text,
  status text not null default 'planned' check(status in ('planned','writing','published','failed','withdrawn')),
  attempts smallint not null default 0 check(attempts between 0 and 5),
  last_error text check(length(last_error) <= 300),
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  check(status <> 'published' or article is not null)
);
create index live_articles_day on public.live_articles(issue_date desc) where status = 'published';
create index live_articles_queue on public.live_articles(issue_date, status);

-- What each scheduled run did, for the operator (counts and short errors only).
create table public.live_runs (
  id bigint generated always as identity primary key,
  step text not null check(step in ('collect','plan','write')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  stats jsonb not null default '{}'::jsonb,
  error text check(length(error) <= 300)
);
create index live_runs_recent on public.live_runs(started_at desc);

alter table public.live_items enable row level security;
alter table public.live_articles enable row level security;
alter table public.live_runs enable row level security;
revoke all on public.live_items, public.live_articles, public.live_runs from anon, authenticated;
do $$ begin
  if exists(select 1 from pg_roles where rolname='pil_worker') then
    revoke all on public.live_items, public.live_articles, public.live_runs from pil_worker;
  end if;
end $$;
