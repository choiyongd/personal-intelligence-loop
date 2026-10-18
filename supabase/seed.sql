-- Synthetic test content is owned by this project; never presented as real news.
insert into public.license_registry values
('synthetic-v1','approved','local://fixtures/project-owned',now(),now()+interval '10 years','PIL synthetic test fixture',true,0,false,'Project-authored titles and links. No publisher content.'),
('fr-metadata-v1','approved','https://www.federalregister.gov/reader-aids/government-policy-and-ofr-procedures/about-this-site','2026-10-15T00:00:00Z','2027-01-15T00:00:00Z','Federal Register / issuing agency',true,0,false,'1 CFR 2.6 reproduction policy; public API. Only title/date/document-number/link requested. Informational XML is not the official legal edition.'),
('unreviewed-v1','pending','https://example.com/terms',now(),now()+interval '30 days','Unreviewed source',false,0,false,'RSS availability alone does not permit reuse. Block until reviewed.')
on conflict(id) do nothing;
insert into public.sources values
('demo-rss','합성 RSS · 원 출처','fixture_rss','demo.xml',array['news.example.com'],'synthetic-v1',true,0),
('demo-mirror','합성 RSS · 두 번째 출처','fixture_rss','mirror.xml',array['news.example.com','mirror.example.com'],'synthetic-v1',true,0),
('federal-register','Federal Register','federal_register','https://www.federalregister.gov/api/v1/documents.json?per_page=20&order=newest&fields[]=title&fields[]=html_url&fields[]=publication_date&fields[]=document_number',array['www.federalregister.gov'],'fr-metadata-v1',true,3600),
('unreviewed-rss','검토 대기 RSS','rss','https://example.com/feed.xml',array['example.com'],'unreviewed-v1',false,3600)
on conflict(id) do nothing;
