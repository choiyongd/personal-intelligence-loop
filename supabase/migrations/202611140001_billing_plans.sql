-- Several paid plans (기본 월간, 프로 월간, 기본 연간) on top of the single monthly subscription.
-- Existing subscriptions become 'basic'. A plan change waits in next_plan_id until the next renewal.
alter table public.billing_subscriptions
  add column if not exists plan_id text not null default 'basic' check (plan_id in ('basic','pro','yearly')),
  add column if not exists next_plan_id text check (next_plan_id is null or next_plan_id in ('basic','pro','yearly'));

alter table public.billing_payments
  add column if not exists plan_id text not null default 'basic' check (plan_id in ('basic','pro','yearly'));
