-- Match the current newsletter builder catalog; retain tenant and profile RLS.
-- The array checks also validate the legacy scalar mirrors of their first selection.
begin;
set local lock_timeout = '5s';

alter table public.newsletter_profiles
  drop constraint newsletter_profiles_industry_check,
  drop constraint newsletter_profiles_country_check,
  drop constraint newsletter_profiles_industries_check,
  drop constraint newsletter_profiles_countries_check,
  drop constraint newsletter_profiles_subtopics_check,
  add constraint newsletter_profiles_industries_check check (
    cardinality(industries) between 1 and 16
    and industries <@ array['technology','business','science','energy','health','finance','design','policy','mobility','food','education','entertainment','sports','lifestyle','environment','career']::text[]
    and industry = industries[1]
  ),
  add constraint newsletter_profiles_countries_check check (
    cardinality(countries) between 1 and 8
    and countries <@ array[
      'EUROPE','N_AMERICA','S_AMERICA','EURASIA','ASIA_PACIFIC','MIDEAST_AFRICA','GB','DE','FR','IT','ES','NL','SE','PL','NO','CH','EE',
      'BE','IE','PT','AT','FI','DK','US','CA','MX','BR','AR','CL','CO','PE','BO','RU','KZ',
      'TR','UA','UZ','AZ','GE','JP','CN','TW','IN','SG','VN','ID','PH','TH','MY','AU','AE',
      'SA','IL','ZA','NG','EG','KE'
    ]::text[]
    and country = countries[1]
  ),
  add constraint newsletter_profiles_subtopics_check check (
    cardinality(subtopics) <= 16 and subtopics <@ (
         case when 'technology' = any(industries) then array['ai','semiconductor','robotics','software','cybersecurity','quantum','cloud'] else '{}'::text[] end
      || case when 'business' = any(industries) then array['startup','strategy','commerce','supply-chain','labor','esg'] else '{}'::text[] end
      || case when 'science' = any(industries) then array['space','materials','biology','physics','earth','neuroscience'] else '{}'::text[] end
      || case when 'energy' = any(industries) then array['battery','renewables','climate','nuclear','critical-minerals','hydrogen'] else '{}'::text[] end
      || case when 'health' = any(industries) then array['digital-health','biotech','medicine','public-health','aging','mental-health'] else '{}'::text[] end
      || case when 'finance' = any(industries) then array['economy','fintech','investment','crypto','realestate','currency'] else '{}'::text[] end
      || case when 'design' = any(industries) then array['product-design','creative','culture','architecture','media','ux'] else '{}'::text[] end
      || case when 'policy' = any(industries) then array['regulation','society','international','security','migration','democracy'] else '{}'::text[] end
      || case when 'mobility' = any(industries) then array['ev','aviation','autonomous','shipping'] else '{}'::text[] end
      || case when 'food' = any(industries) then array['agriculture','foodtech','food-prices'] else '{}'::text[] end
      || case when 'education' = any(industries) then array['edtech','higher-ed','k12'] else '{}'::text[] end
      || case when 'entertainment' = any(industries) then array['games','music','film'] else '{}'::text[] end
      || case when 'sports' = any(industries) then array['sports-business','mega-events'] else '{}'::text[] end
      || case when 'lifestyle' = any(industries) then array['travel','wellness','fashion'] else '{}'::text[] end
      || case when 'environment' = any(industries) then array['biodiversity','ocean','pollution'] else '{}'::text[] end
      || case when 'career' = any(industries) then array['skills','remote-work'] else '{}'::text[] end
    )
  );
commit;
