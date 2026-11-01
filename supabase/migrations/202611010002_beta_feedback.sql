-- Beta feedback from the site and from links in mail. Server (service-role key) only, like the other beta tables.
create table if not exists public.beta_feedback (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid references public.beta_readers(id) on delete set null,
  rating smallint check (rating between 1 and 5),
  message text not null check (length(trim(message)) between 1 and 2000),
  source text not null default 'site' check (source in ('site','mail')),
  contact text check (contact is null or (length(contact) <= 254 and contact ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')),
  created_at timestamptz not null default now()
);
create index if not exists beta_feedback_created on public.beta_feedback (created_at desc);
alter table public.beta_feedback enable row level security;
revoke all on public.beta_feedback from anon, authenticated;
