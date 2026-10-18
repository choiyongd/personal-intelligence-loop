-- Apply with the Supabase migration owner. All app tables have RLS.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
do $$ begin
  if not exists(select 1 from pg_roles where rolname='pil_worker') then
    create role pil_worker nologin nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
  end if;
end $$;
grant usage on schema public, private to pil_worker;

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null check(length(name) between 1 and 80),
  created_at timestamptz not null default now()
);
create table public.memberships (
  tenant_id uuid references public.tenants(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check(role in ('owner','member')),
  primary key(tenant_id,user_id)
);
create index memberships_user_idx on public.memberships(user_id,tenant_id);
create table public.preferences (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  industry text not null default 'technology' check(industry in ('technology','energy','health','finance')),
  keywords text[] not null default '{}' check(cardinality(keywords)<=20),
  updated_at timestamptz not null default now()
);
create table public.license_registry (
  id text primary key,
  status text not null check(status in ('approved','pending','revoked')),
  evidence_url text not null,
  reviewed_at timestamptz not null,
  review_due_at timestamptz not null,
  attribution text not null,
  allow_metadata boolean not null default false,
  max_excerpt_chars integer not null default 0 check(max_excerpt_chars between 0 and 500),
  allow_full_text boolean not null default false check(allow_full_text=false),
  notes text not null,
  check(review_due_at>reviewed_at)
);
create table public.sources (
  id text primary key,
  name text not null,
  kind text not null check(kind in ('fixture_rss','rss','federal_register')),
  endpoint text not null,
  allowed_hosts text[] not null check(cardinality(allowed_hosts)>0),
  license_id text not null references public.license_registry(id),
  enabled boolean not null default false,
  min_interval_seconds integer not null default 3600 check(min_interval_seconds>=0)
);
create table public.subscriptions (
  tenant_id uuid references public.tenants(id) on delete cascade,
  source_id text references public.sources(id),
  enabled boolean not null default true,
  primary key(tenant_id,source_id)
);
create table public.events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null check(length(title) between 1 and 500),
  anchor_tokens text[] not null,
  anchor_numbers text[] not null,
  anchor_published_at timestamptz not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  algorithm text not null default 'title-jaccard-v1',
  unique(tenant_id,id)
);
create index events_feed_idx on public.events(tenant_id,last_seen_at desc,id);
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  canonical_url text not null check(canonical_url ~ '^https?://'),
  url_hash text not null check(length(url_hash)=64),
  title text not null check(length(title) between 8 and 500),
  published_at timestamptz not null,
  title_tokens text[] not null,
  event_id uuid not null,
  created_at timestamptz not null default now(),
  unique(tenant_id,url_hash),
  unique(tenant_id,id),
  foreign key(tenant_id,event_id) references public.events(tenant_id,id)
);
create index articles_event_idx on public.articles(tenant_id,event_id);
create table public.observations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  article_id uuid not null,
  source_id text not null references public.sources(id),
  external_id text not null check(length(external_id) between 1 and 1000),
  original_url text not null check(original_url ~ '^https?://'),
  title text not null check(length(title) between 8 and 500),
  published_at timestamptz not null,
  excerpt text not null default '',
  content_hash text not null check(length(content_hash)=64),
  fetched_at timestamptz not null default now(),
  license_id text not null references public.license_registry(id),
  unique(tenant_id,source_id,external_id),
  foreign key(tenant_id,article_id) references public.articles(tenant_id,id)
);
create index observations_article_idx on public.observations(tenant_id,article_id);
create table public.saved_events (
  tenant_id uuid not null,
  user_id uuid not null default auth.uid(),
  event_id uuid not null,
  created_at timestamptz not null default now(),
  primary key(tenant_id,user_id,event_id),
  foreign key(tenant_id,event_id) references public.events(tenant_id,id) on delete cascade,
  foreign key(tenant_id,user_id) references public.memberships(tenant_id,user_id) on delete cascade
);
create table public.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  source_id text not null,
  state text not null default 'queued' check(state in ('queued','running','retry','succeeded','dead')),
  attempt integer not null default 0 check(attempt between 0 and 4),
  lease_token uuid,
  leased_until timestamptz,
  available_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  accepted integer not null default 0,
  rejected integer not null default 0,
  error_code text,
  unique(tenant_id,id),
  foreign key(tenant_id,source_id) references public.subscriptions(tenant_id,source_id) on delete cascade
);
create unique index jobs_active_unique on public.ingestion_jobs(tenant_id,source_id) where state in ('queued','running','retry');
create index jobs_due_idx on public.ingestion_jobs(available_at) where state in ('queued','retry','running');
create table public.ingestion_logs (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  job_id uuid not null,
  level text not null check(level in ('info','warning','error')),
  code text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now(),
  foreign key(tenant_id,job_id) references public.ingestion_jobs(tenant_id,id) on delete cascade
);
create index logs_tenant_idx on public.ingestion_logs(tenant_id,created_at desc);

-- Only this fixed helper may read membership with owner privileges. No recursive policy.
create function private.is_member(t uuid, owner_only boolean default false)
returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.memberships m where m.tenant_id=t
    and m.user_id=(select auth.uid()) and (not owner_only or m.role='owner'));
$$;
revoke all on function private.is_member(uuid,boolean) from public;
grant execute on function private.is_member(uuid,boolean) to authenticated;

alter table public.tenants enable row level security;
create policy tenant_read on public.tenants for select to authenticated using(private.is_member(id));
alter table public.memberships enable row level security;
create policy membership_read on public.memberships for select to authenticated using(private.is_member(tenant_id));
-- No membership write grants: invitations/role changes are not in Sprint 1.
alter table public.license_registry enable row level security;
create policy license_read on public.license_registry for select to authenticated using(true);
alter table public.sources enable row level security;
create policy source_read on public.sources for select to authenticated using(true);
do $$ declare tab text; begin
  foreach tab in array array['preferences','subscriptions','events','articles','observations','saved_events','ingestion_jobs','ingestion_logs'] loop
    execute format('alter table public.%I enable row level security',tab);
    execute format('create policy member_read on public.%I for select to authenticated using(private.is_member(tenant_id))',tab);
  end loop;
end $$;
create policy preference_update on public.preferences for update to authenticated using(private.is_member(tenant_id,true)) with check(private.is_member(tenant_id,true));
create policy subscription_insert on public.subscriptions for insert to authenticated with check(private.is_member(tenant_id,true) and exists(select 1 from public.sources s join public.license_registry l on l.id=s.license_id where s.id=source_id and s.enabled and l.status='approved' and l.allow_metadata and l.review_due_at>now()));
create policy subscription_update on public.subscriptions for update to authenticated using(private.is_member(tenant_id,true)) with check(private.is_member(tenant_id,true) and (not enabled or exists(select 1 from public.sources s join public.license_registry l on l.id=s.license_id where s.id=source_id and s.enabled and l.status='approved' and l.allow_metadata and l.review_due_at>now())));
-- Private saves: another member cannot see personal saved items.
drop policy member_read on public.saved_events;
create policy save_read on public.saved_events for select to authenticated using(private.is_member(tenant_id) and user_id=(select auth.uid()));
create policy save_insert on public.saved_events for insert to authenticated with check(private.is_member(tenant_id) and user_id=(select auth.uid()));
create policy save_delete on public.saved_events for delete to authenticated using(private.is_member(tenant_id) and user_id=(select auth.uid()));

revoke all on all tables in schema public from anon, authenticated;
grant select on public.tenants,public.memberships,public.preferences,public.license_registry,public.sources,public.subscriptions,public.events,public.articles,public.observations,public.saved_events,public.ingestion_jobs,public.ingestion_logs to authenticated;
grant update(industry,keywords,updated_at) on public.preferences to authenticated;
grant insert(tenant_id,source_id,enabled),update(enabled) on public.subscriptions to authenticated;
grant insert(tenant_id,user_id,event_id),delete on public.saved_events to authenticated;

-- Two audited entry points; caller IDs never confer authorization.
create function public.create_workspace(workspace_name text) returns uuid
language plpgsql security definer set search_path='' as $$
declare t uuid; u uuid := auth.uid(); begin
  if u is null then raise exception 'authentication required' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(u::text,0));
  if (select count(*) from public.memberships where user_id=u)>=5 then raise exception 'workspace quota exceeded'; end if;
  insert into public.tenants(name) values(trim(workspace_name)) returning id into t;
  insert into public.memberships values(t,u,'owner');
  insert into public.preferences(tenant_id) values(t);
  return t;
end $$;
create function public.enqueue_ingestion(target_tenant uuid,target_source text) returns uuid
language plpgsql security definer set search_path='' as $$
declare j uuid; begin
  if not private.is_member(target_tenant,true) then raise exception 'owner required' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(target_tenant::text||target_source,0));
  if not exists(select 1 from public.subscriptions sub join public.sources s on s.id=sub.source_id
    join public.license_registry l on l.id=s.license_id where sub.tenant_id=target_tenant and sub.source_id=target_source
    and sub.enabled and s.enabled and l.status='approved' and l.allow_metadata and l.review_due_at>now()) then
    raise exception 'source unavailable' using errcode='42501';
  end if;
  select id into j from public.ingestion_jobs where tenant_id=target_tenant and source_id=target_source and state in ('queued','running','retry');
  if j is not null then return j; end if;
  if exists(select 1 from public.ingestion_jobs where tenant_id=target_tenant and source_id=target_source
    and created_at>now()-make_interval(secs=>greatest(60,(select min_interval_seconds from public.sources where id=target_source)))) then raise exception 'source cooldown'; end if;
  insert into public.ingestion_jobs(tenant_id,source_id) values(target_tenant,target_source) returning id into j;
  return j;
end $$;
revoke all on function public.create_workspace(text),public.enqueue_ingestion(uuid,text) from public,anon;
grant execute on function public.create_workspace(text),public.enqueue_ingestion(uuid,text) to authenticated;

-- Worker is privileged across tenants only for ingestion data; no Auth or membership access.
grant select on public.license_registry,public.sources,public.subscriptions,public.preferences to pil_worker;
grant select,insert,update on public.events,public.articles,public.observations,public.ingestion_jobs,public.ingestion_logs to pil_worker;
grant usage,select on sequence public.ingestion_logs_id_seq to pil_worker;
do $$ declare tab text; begin
  foreach tab in array array['license_registry','sources','subscriptions','preferences','events','articles','observations','ingestion_jobs','ingestion_logs'] loop
    execute format('create policy worker_access on public.%I for all to pil_worker using(true) with check(true)',tab);
  end loop;
end $$;
-- Defense in depth: deny non-approved, expired, mismatched or excessive evidence writes at DB boundary.
create function private.check_observation_license() returns trigger
language plpgsql security definer set search_path='' as $$
declare l public.license_registry; begin
  select r.* into l from public.sources s join public.license_registry r on r.id=s.license_id
  where s.id=new.source_id and s.enabled;
  if l.id is null or l.id<>new.license_id or l.status<>'approved' or not l.allow_metadata
     or l.review_due_at<=now() or length(new.excerpt)>l.max_excerpt_chars then
    raise exception 'license policy denied' using errcode='42501';
  end if;
  return new;
end $$;
revoke all on function private.check_observation_license() from public;
create trigger observation_license before insert or update on public.observations for each row execute function private.check_observation_license();

-- PostgreSQL row locks require UPDATE privilege. Keep registry read-only to the
-- worker by exposing only this fixed locking/check function, not UPDATE grants.
create function private.lock_source_policy(t uuid, s_id text) returns boolean
language plpgsql security definer set search_path='' as $$
declare allowed_id text; begin
  select l.id into allowed_id from public.subscriptions sub
  join public.sources s on s.id=sub.source_id join public.license_registry l on l.id=s.license_id
  where sub.tenant_id=t and sub.source_id=s_id and sub.enabled and s.enabled
    and l.status='approved' and l.allow_metadata and l.review_due_at>now()
  for share of sub,s,l;
  return allowed_id is not null;
end $$;
revoke all on function private.lock_source_policy(uuid,text) from public,anon,authenticated;
grant execute on function private.lock_source_policy(uuid,text) to pil_worker;
