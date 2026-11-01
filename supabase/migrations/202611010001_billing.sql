-- Paid subscriptions (Toss Payments card billing) and mail sign-in links for readers.
-- Like beta_readers, these tables are reached only from the server with the service-role key.

-- Sign in from another browser: a one-time link mailed to a confirmed address.
alter table public.beta_readers
  add column if not exists login_token_hash text check (login_token_hash is null or length(login_token_hash) = 64),
  add column if not exists login_sent_at timestamptz;
create index if not exists beta_readers_email on public.beta_readers (lower(email)) where email_confirmed_at is not null;

create table if not exists public.billing_subscriptions (
  reader_id uuid primary key references public.beta_readers(id) on delete cascade,
  customer_key text not null unique check (length(customer_key) between 2 and 50),
  -- The billing key is stored encrypted (AES-256-GCM with BILLING_ENCRYPTION_KEY); null once the card is removed.
  billing_key_enc text,
  card_label text check (length(card_label) <= 60),
  status text not null default 'active' check (status in ('active','past_due','canceled','ended')),
  amount integer not null check (amount > 0),
  started_at timestamptz not null default now(),
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  failed_attempts smallint not null default 0 check (failed_attempts between 0 and 10),
  next_attempt_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists billing_subscriptions_due on public.billing_subscriptions (current_period_end) where status in ('active','past_due','canceled');

create table if not exists public.billing_payments (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid not null references public.beta_readers(id) on delete cascade,
  order_id text not null unique check (length(order_id) between 6 and 64),
  amount integer not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  payment_key text check (length(payment_key) <= 200),
  receipt_url text check (length(receipt_url) <= 500),
  failure text check (length(failure) <= 300),
  period_start timestamptz not null,
  period_end timestamptz not null,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);
create index if not exists billing_payments_reader on public.billing_payments (reader_id, created_at desc);

alter table public.billing_subscriptions enable row level security;
alter table public.billing_payments enable row level security;
revoke all on public.billing_subscriptions, public.billing_payments from anon, authenticated;

-- One row per signed-in browser beyond the first, so signing in on a phone does not sign the computer out.
create table if not exists public.reader_sessions (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid not null references public.beta_readers(id) on delete cascade,
  token_hash text not null unique check (length(token_hash) = 64),
  created_at timestamptz not null default now()
);
create index if not exists reader_sessions_reader on public.reader_sessions (reader_id);
alter table public.reader_sessions enable row level security;
revoke all on public.reader_sessions from anon, authenticated;
