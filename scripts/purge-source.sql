-- OPERATOR EXAMPLE. Destructive: review affected events and backup/retention first.
-- psql ... -v source_id=reviewed-source -f scripts/purge-source.sql
-- Run as trusted migration owner, in a maintenance window. Removes whole affected events.
begin;
create temporary table affected_sources on commit drop as
  select id from public.sources where license_id in
    (select license_id from public.sources where id=:'source_id');
update public.sources set enabled=false where id in(select id from affected_sources);
update public.license_registry set status='revoked' where id in
  (select license_id from public.sources where id=:'source_id');
create temporary table affected_events on commit drop as
  select distinct a.tenant_id,a.event_id from public.articles a
  join public.observations o on o.tenant_id=a.tenant_id and o.article_id=a.id
  where o.source_id in(select id from affected_sources);
delete from public.saved_events s using affected_events e
  where s.tenant_id=e.tenant_id and s.event_id=e.event_id;
delete from public.observations o using public.articles a,affected_events e
  where o.tenant_id=a.tenant_id and o.article_id=a.id and a.tenant_id=e.tenant_id and a.event_id=e.event_id;
delete from public.articles a using affected_events e
  where a.tenant_id=e.tenant_id and a.event_id=e.event_id;
delete from public.events v using affected_events e
  where v.tenant_id=e.tenant_id and v.id=e.event_id;
commit;
