-- What each live article cost to write, summed over every attempt (tokens include cache reads and writes).
alter table public.live_articles
  add column if not exists input_tokens integer not null default 0 check(input_tokens>=0),
  add column if not exists output_tokens integer not null default 0 check(output_tokens>=0),
  add column if not exists cost_usd numeric(10,5) not null default 0 check(cost_usd>=0);

-- A daily summary for checking quality and spend after each run.
create or replace view public.live_daily_report with (security_invoker=true) as
select issue_date,
  count(*) filter (where status='published') as published,
  count(*) filter (where status='failed') as failed,
  count(*) filter (where last_error='thin-material') as thin_material,
  sum(input_tokens) as input_tokens,
  sum(output_tokens) as output_tokens,
  sum(cost_usd) as write_cost_usd,
  round(avg(cost_usd) filter (where status='published'),5) as avg_cost_per_article
from public.live_articles group by issue_date;
revoke all on public.live_daily_report from anon, authenticated;
do $$ begin
  if exists(select 1 from pg_roles where rolname='pil_worker') then
    revoke all on public.live_daily_report from pil_worker;
  end if;
end $$;
