begin;

-- Platform staff are independent of customer workspace membership.
create table private.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now()
);

-- Each save creates an immutable revision. Only the latest revision for a
-- calendar month is shown, and all amounts are whole KRW.
create table private.monthly_finance (
  id bigint generated always as identity primary key,
  report_month date not null check (
    extract(day from report_month) = 1 and report_month >= date '2000-01-01'
    and report_month < date '2100-01-01'
  ),
  gross_krw bigint not null check (gross_krw between 0 and 1000000000000),
  refunds_krw bigint not null check (refunds_krw between 0 and 1000000000000),
  costs_krw bigint not null check (costs_krw between 0 and 1000000000000),
  recorded_by uuid not null,
  recorded_at timestamptz not null default now()
);

create index monthly_finance_latest_idx on private.monthly_finance(report_month, id desc);
alter table private.platform_admins enable row level security;
alter table private.monthly_finance enable row level security;
revoke all on private.platform_admins, private.monthly_finance from public, anon, authenticated, pil_worker;
revoke all on sequence private.monthly_finance_id_seq from public, anon, authenticated, pil_worker;

-- Used by the project database administrator, never the application or worker.
create function private.grant_platform_admin(target_user uuid) returns void
language plpgsql security invoker set search_path = '' as $$
begin
  if not exists (
    select 1 from auth.users u where u.id = target_user and not u.is_anonymous
    and u.email is not null and u.email_confirmed_at is not null
    and u.deleted_at is null and (u.banned_until is null or u.banned_until <= now())
  ) then
    raise exception 'An email-verified user is required' using errcode = '22023';
  end if;
  insert into private.platform_admins(user_id) values (target_user)
  on conflict (user_id) do nothing;
end;
$$;

create function private.require_platform_admin() returns uuid
language plpgsql stable security definer set search_path = '' as $$
declare actor uuid := auth.uid();
begin
  if actor is null or not exists (
    select 1 from private.platform_admins a
    join auth.users u on u.id = a.user_id
    where a.user_id = actor and not u.is_anonymous
      and u.email is not null and u.email_confirmed_at is not null
      and (u.banned_until is null or u.banned_until <= now())
      and u.deleted_at is null
  ) then
    raise exception 'Platform administrator required' using errcode = '42501';
  end if;
  return actor;
end;
$$;

create function private.checked_report_month(month_start date) returns date
language plpgsql stable security invoker set search_path = '' as $$
declare today_kst date := timezone('Asia/Seoul', now())::date;
begin
  month_start := coalesce(month_start, date_trunc('month', today_kst::timestamp)::date);
  if extract(day from month_start) <> 1 or month_start < date '2000-01-01'
    or month_start > today_kst or month_start >= date '2100-01-01' then
    raise exception 'Invalid reporting month' using errcode = '22023';
  end if;
  return month_start;
end;
$$;

create function private.platform_overview(month_start date) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  customer_counts jsonb;
  finance jsonb;
  as_of timestamptz := now();
begin
  perform private.require_platform_admin();
  month_start := private.checked_report_month(month_start);

  select jsonb_build_object(
    'total', count(*),
    'new30', count(*) filter (where u.created_at >= as_of - interval '720 hours'),
    'active30', count(*) filter (where u.last_sign_in_at >= as_of - interval '720 hours')
  ) into customer_counts
  from auth.users u
  where not u.is_anonymous and u.email_confirmed_at is not null and u.deleted_at is null
    and not exists (select 1 from private.platform_admins a where a.user_id = u.id);

  select jsonb_build_object(
    'gross', gross_krw, 'refunds', refunds_krw, 'costs', costs_krw,
    'recordedAt', recorded_at
  ) into finance
  from private.monthly_finance
  where report_month = month_start order by id desc limit 1;

  return jsonb_build_object('customers', customer_counts, 'finance', finance, 'month', month_start);
end;
$$;

create function private.record_monthly_finance(month_start date, gross bigint, refunds bigint, costs bigint)
returns void language plpgsql security definer set search_path = '' as $$
declare actor uuid := private.require_platform_admin();
begin
  if month_start is null then
    raise exception 'A reporting month is required' using errcode = '22023';
  end if;
  insert into private.monthly_finance(report_month, gross_krw, refunds_krw, costs_krw, recorded_by)
  values (private.checked_report_month(month_start), gross, refunds, costs, actor);
end;
$$;

-- Only these invoker wrappers are exposed to the Data API. The private
-- implementations enforce the current DB grant before reading or writing.
create function public.admin_overview(month_start date default null) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select private.platform_overview(month_start);
$$;

create function public.admin_record_finance(month_start date, gross bigint, refunds bigint, costs bigint)
returns void language sql security invoker set search_path = '' as $$
  select private.record_monthly_finance(month_start, gross, refunds, costs);
$$;

revoke all on function private.grant_platform_admin(uuid), private.require_platform_admin(),
  private.checked_report_month(date), private.platform_overview(date),
  private.record_monthly_finance(date,bigint,bigint,bigint),
  public.admin_overview(date), public.admin_record_finance(date,bigint,bigint,bigint)
from public, anon, authenticated, pil_worker;

grant execute on function private.platform_overview(date),
  private.record_monthly_finance(date,bigint,bigint,bigint),
  public.admin_overview(date), public.admin_record_finance(date,bigint,bigint,bigint)
to authenticated;

commit;
