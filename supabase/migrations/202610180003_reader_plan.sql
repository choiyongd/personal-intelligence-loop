-- Beta plans: only subscribers receive scheduled editions by mail. Switching plans needs no payment during the beta.
alter table public.beta_readers
  add column if not exists plan text not null default 'free' check (plan in ('free','subscriber'));
create index if not exists beta_readers_due on public.beta_readers (send_hour) where delivery_enabled and plan = 'subscriber';
