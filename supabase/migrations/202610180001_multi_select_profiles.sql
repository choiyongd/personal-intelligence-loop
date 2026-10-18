-- Personal profiles may follow several fields, topics and countries, and choose a reading level.
-- Existing rows are preserved: industries/countries start from the old single values.
alter table public.newsletter_profiles add column industries text[];
alter table public.newsletter_profiles add column countries text[];
alter table public.newsletter_profiles add column level text not null default 'practitioner'
  check(level in ('intro','practitioner','expert'));
update public.newsletter_profiles set industries=array[industry], countries=array[country];
alter table public.newsletter_profiles alter column industries set not null;
alter table public.newsletter_profiles alter column countries set not null;

-- Older clients write only industry/country; newer ones write the arrays. Keep both in step.
create function private.sync_profile_lists() returns trigger language plpgsql set search_path='' as $$
begin
  if new.industries is null then new.industries := array[new.industry]; else new.industry := new.industries[1]; end if;
  if new.countries is null then new.countries := array[new.country]; else new.country := new.countries[1]; end if;
  return new;
end $$;
revoke all on function private.sync_profile_lists() from public;
create trigger sync_profile_lists before insert or update on public.newsletter_profiles
  for each row execute function private.sync_profile_lists();

alter table public.newsletter_profiles drop constraint newsletter_profiles_check;
alter table public.newsletter_profiles drop constraint newsletter_profiles_subtopics_check;
alter table public.newsletter_profiles add constraint newsletter_profiles_industries_check check(
  cardinality(industries) between 1 and 8
  and industries <@ array['technology','business','science','energy','health','finance','design','policy']::text[]
  and industry = industries[1]);
alter table public.newsletter_profiles add constraint newsletter_profiles_countries_check check(
  cardinality(countries) between 1 and 5
  and countries <@ array['US','JP','CN','GB','DE','FR','CA','AU','SG','IN','TW','VN']::text[]
  and country = countries[1]);
-- Every topic must belong to one of the selected fields.
alter table public.newsletter_profiles add constraint newsletter_profiles_subtopics_check check(
  cardinality(subtopics) <= 16 and subtopics <@
    (case when 'technology' = any(industries) then array['ai','semiconductor','robotics','software'] else '{}'::text[] end
  || case when 'business' = any(industries) then array['startup','strategy','commerce'] else '{}'::text[] end
  || case when 'science' = any(industries) then array['space','materials','biology'] else '{}'::text[] end
  || case when 'energy' = any(industries) then array['battery','renewables','climate'] else '{}'::text[] end
  || case when 'health' = any(industries) then array['digital-health','biotech','medicine'] else '{}'::text[] end
  || case when 'finance' = any(industries) then array['economy','fintech','investment'] else '{}'::text[] end
  || case when 'design' = any(industries) then array['product-design','creative','culture'] else '{}'::text[] end
  || case when 'policy' = any(industries) then array['regulation','society','international'] else '{}'::text[] end));
