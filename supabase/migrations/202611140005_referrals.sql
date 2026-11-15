-- Friend invites. Every beta reader gets a short invite code; a reader who arrives through a friend's
-- invite (or shared article) link remembers who invited them. Server (service-role key) only, like the other beta tables.
alter table public.beta_readers
  add column if not exists referral_code text not null default substr(md5(gen_random_uuid()::text),1,10),
  add column if not exists referred_by uuid references public.beta_readers(id) on delete set null,
  add column if not exists referred_at timestamptz;

do $$ begin
  alter table public.beta_readers add constraint beta_readers_referral_code_format check (referral_code ~ '^[a-f0-9]{10}$');
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.beta_readers add constraint beta_readers_not_self_referred check (referred_by is null or referred_by <> id);
exception when duplicate_object then null; end $$;

create unique index if not exists beta_readers_referral_code on public.beta_readers(referral_code);
create index if not exists beta_readers_referred_by on public.beta_readers(referred_by) where referred_by is not null;
