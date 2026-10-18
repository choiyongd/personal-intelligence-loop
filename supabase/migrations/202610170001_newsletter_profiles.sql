-- Personal selection is isolated from team-shared preferences.
create table public.newsletter_profiles (
  tenant_id uuid not null,
  user_id uuid not null default auth.uid(),
  industry text not null check(industry in ('technology','business','science','energy','health','finance','design','policy')),
  subtopics text[] not null default '{}' check(cardinality(subtopics)<=6),
  scope text not null default 'global' check(scope in ('global','kr','country')),
  country text not null default 'US' check(country in ('US','JP','CN','GB','DE','FR','CA','AU','SG','IN','TW','VN')),
  content_types text[] not null default array['article','research','news']
    check(cardinality(content_types) between 1 and 3 and content_types <@ array['article','research','news']::text[]),
  name text not null default '나의 데일리 브리프' check(length(trim(name)) between 1 and 60),
  cadence text not null default 'daily' check(cadence in ('daily','weekly')),
  updated_at timestamptz not null default now(),
  primary key(tenant_id,user_id),
  foreign key(tenant_id,user_id) references public.memberships(tenant_id,user_id) on delete cascade,
  check(subtopics <@ case industry
    when 'technology' then array['ai','semiconductor','robotics','software']
    when 'business' then array['startup','strategy','commerce']
    when 'science' then array['space','materials','biology']
    when 'energy' then array['battery','renewables','climate']
    when 'health' then array['digital-health','biotech','medicine']
    when 'finance' then array['economy','fintech','investment']
    when 'design' then array['product-design','creative','culture']
    when 'policy' then array['regulation','society','international'] end)
);
alter table public.newsletter_profiles enable row level security;
revoke all on public.newsletter_profiles from anon,authenticated,pil_worker;
grant select,insert,update,delete on public.newsletter_profiles to authenticated;
create policy personal_profile on public.newsletter_profiles for all to authenticated
using(private.is_member(tenant_id) and user_id=(select auth.uid()))
with check(private.is_member(tenant_id) and user_id=(select auth.uid()));

-- Explicit country metadata only. Unknown country is an empty array, never guessed from language.
alter table public.articles add column country_codes text[] not null default '{}';
alter table public.articles add column content_type text not null default 'news'
  check(content_type in ('article','research','news'));
update public.articles a set country_codes=array['US'] where exists
  (select 1 from public.observations o where o.tenant_id=a.tenant_id and o.article_id=a.id and o.source_id='federal-register');
