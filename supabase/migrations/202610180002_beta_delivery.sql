-- Beta readers have no Supabase account. The app reaches these tables only from the server
-- with the service-role key; anon and authenticated clients get nothing.
create table public.beta_readers (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null check(length(token_hash)=64),
  name text not null default '베타 독자' check(length(trim(name)) between 1 and 20),
  selection jsonb not null,
  cadence text not null default 'daily' check(cadence in ('daily','weekly')),
  send_hour smallint not null default 7 check(send_hour between 0 and 23),
  send_weekday smallint not null default 1 check(send_weekday between 0 and 6),
  email text check(email is null or (length(email)<=254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')),
  email_confirmed_at timestamptz,
  confirm_token_hash text check(confirm_token_hash is null or length(confirm_token_hash)=64),
  confirm_sent_at timestamptz,
  unsubscribe_token text not null check(length(unsubscribe_token) >= 32),
  delivery_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Mail goes out only to an address that clicked its confirmation link.
  check(not delivery_enabled or (email is not null and email_confirmed_at is not null))
);
create index beta_readers_due on public.beta_readers(send_hour) where delivery_enabled;

-- One scheduled issue per reader per Korean calendar day; the unique key makes dispatch idempotent.
create table public.beta_issues (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid not null references public.beta_readers(id) on delete cascade,
  kind text not null check(kind in ('scheduled','manual')),
  issue_date date not null,
  title text not null check(length(title) between 1 and 60),
  selection jsonb not null,
  article_ids text[] not null check(cardinality(article_ids) between 1 and 20),
  delivery text not null default 'saved' check(delivery in ('saved','pending','sent','failed')),
  attempts smallint not null default 0 check(attempts between 0 and 5),
  last_error text check(length(last_error) <= 300),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique(reader_id,kind,issue_date)
);
create index beta_issues_reader on public.beta_issues(reader_id,created_at desc);

alter table public.beta_readers enable row level security;
alter table public.beta_issues enable row level security;
revoke all on public.beta_readers, public.beta_issues from anon, authenticated;
revoke all on public.beta_readers, public.beta_issues from pil_worker;
