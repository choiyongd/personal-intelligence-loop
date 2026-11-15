-- Operations dashboard: what happened to each mailed issue (Resend webhooks) and which feedback the owner has handled.
-- Server (service-role key) only, like the other beta tables. Safe to run more than once.
alter table public.beta_issues
  add column if not exists mail_id text,
  add column if not exists delivered_at timestamptz,
  add column if not exists opened_at timestamptz,
  add column if not exists open_count integer not null default 0,
  add column if not exists clicked_at timestamptz,
  add column if not exists bounced_at timestamptz,
  add column if not exists complained_at timestamptz;
create unique index if not exists beta_issues_mail_id on public.beta_issues (mail_id) where mail_id is not null;
create index if not exists beta_issues_sent on public.beta_issues (sent_at desc) where sent_at is not null;

alter table public.beta_feedback add column if not exists handled_at timestamptz;

-- Every webhook event once (svix-id), so a retried delivery is not counted twice.
create table if not exists public.mail_events (
  id text primary key check (length(id) between 1 and 100),
  mail_id text not null check (length(mail_id) <= 100),
  type text not null check (length(type) <= 40),
  created_at timestamptz not null default now()
);
create index if not exists mail_events_mail on public.mail_events (mail_id);
alter table public.mail_events enable row level security;
revoke all on public.mail_events from anon, authenticated;
revoke all on public.mail_events from pil_worker;
