-- Garden.io private beta: publish + curate a second batch (22 plants).
--
-- The 70 unpublished profiles are a raw homestead import: narrative-only, no
-- condition data, with duplicates / placeholders / mislabeled types. This curates
-- a clean, distinct, high-value batch — correcting plant_type_code and adding
-- climate (light + hardiness), water, and phenology — then publishes them
-- (25 -> 47). Images intentionally fall back to generic specimen art.
-- Additive + idempotent. Rollback: set is_published=false for these slugs and
-- delete their climate/water/phenology rows.

begin;

create temporary table _batch (
  slug text primary key,
  type text,
  light text,
  hmin text,
  hmax text,
  frost_tender boolean,
  sun_min numeric,
  sun_max numeric,
  water text,
  dmin integer,
  dmax integer,
  basis text,
  plant_label text,
  harvest_label text,
  first_harvest text
) on commit drop;

insert into _batch (slug, type, light, hmin, hmax, frost_tender, sun_min, sun_max, water, dmin, dmax, basis, plant_label, harvest_label, first_harvest) values
  ('apple-arkansas-black', 'tree', 'Full sun', '5', '8', false, 6, 10, 'medium', null, null, 'perennial', 'Plant dormant, late winter to early spring', null, 'Fruit in year 2–4, late fall'),
  ('apple-liberty', 'tree', 'Full sun', '4', '7', false, 6, 10, 'medium', null, null, 'perennial', 'Plant dormant, late winter to early spring', null, 'Fruit in year 2–4, early fall (disease-resistant)'),
  ('peach-harvester', 'tree', 'Full sun', '5', '8', false, 6, 10, 'medium', null, null, 'perennial', 'Plant dormant, late winter', null, 'Fruit in year 2–3, mid-summer'),
  ('pear-seckel', 'tree', 'Full sun', '5', '8', false, 6, 10, 'medium', null, null, 'perennial', 'Plant dormant, late winter', null, 'Fruit in year 3–5, early fall'),
  ('nectarine-fantasia', 'tree', 'Full sun', '6', '9', false, 6, 10, 'medium', null, null, 'perennial', 'Plant dormant, late winter', null, 'Fruit in year 2–3, mid to late summer'),
  ('jujube-li', 'tree', 'Full sun', '6', '9', false, 6, 10, 'low', null, null, 'perennial', 'Plant in spring', null, 'Fruit in year 2–3, fall'),
  ('pineapple-guava', 'shrub', 'Full sun to part shade', '8', '10', false, 4, 8, 'low', null, null, 'perennial', 'Plant in spring', null, 'Fruit in year 3–4, late fall'),
  ('loquat-big-jim', 'tree', 'Full sun', '8', '10', true, 6, 10, 'medium', null, null, 'perennial', 'Plant in spring; shelter from hard frost', null, 'Fruit late winter to spring, year 3+'),
  ('cornelian-cherry', 'shrub', 'Full sun to part shade', '4', '8', false, 4, 8, 'medium', null, null, 'perennial', 'Plant in spring or fall', null, 'Fruit in year 3–5, late summer'),
  ('black-currant', 'shrub', 'Full sun to part shade', '3', '8', false, 4, 8, 'medium', null, null, 'perennial', 'Plant dormant canes in early spring', null, 'Fruit in year 2, mid-summer'),
  ('red-currant', 'shrub', 'Part sun to part shade', '3', '8', false, 3, 6, 'medium', null, null, 'perennial', 'Plant dormant canes in early spring', null, 'Fruit in year 2, early to mid summer'),
  ('gooseberry', 'shrub', 'Full sun to part shade', '3', '8', false, 4, 8, 'medium', null, null, 'perennial', 'Plant dormant in early spring', null, 'Fruit in year 2, mid-summer'),
  ('lingonberry', 'shrub', 'Full sun to part shade', '2', '7', false, 4, 8, 'medium', null, null, 'perennial', 'Plant in spring in acidic soil', null, 'Fruit in year 2–3, late summer and fall'),
  ('goumi-sweet-scarlet', 'shrub', 'Full sun', '4', '9', false, 6, 10, 'low', null, null, 'perennial', 'Plant in spring (nitrogen-fixer)', null, 'Fruit in year 2–3, early summer'),
  ('blood-orange-moro', 'tree', 'Full sun', '9', '11', true, 6, 10, 'medium', null, null, 'perennial', 'Plant in spring (container in cold zones)', null, 'Fruit in year 2–3, winter'),
  ('satsuma-owari-satsuma-mandarin', 'tree', 'Full sun', '8', '11', true, 6, 10, 'medium', null, null, 'perennial', 'Plant in spring; protect below 25°F', null, 'Fruit in year 2–3, late fall'),
  ('yuzu', 'tree', 'Full sun', '7', '10', true, 6, 10, 'medium', null, null, 'perennial', 'Plant in spring (hardiest citrus)', null, 'Fruit in year 3–4, late fall'),
  ('red-onion', 'vegetable', 'Full sun', '3', '9', false, 6, 10, 'medium', 90, 110, 'transplant', 'Plant sets or transplants in early spring', 'Bulbs mid to late summer, ~100 days', null),
  ('yellow-onion', 'vegetable', 'Full sun', '3', '9', false, 6, 10, 'medium', 90, 110, 'transplant', 'Plant sets in early spring', 'Bulbs mid to late summer', null),
  ('heuchera', 'forb', 'Part shade', '4', '9', false, 3, 6, 'medium', null, null, 'perennial', 'Plant in spring or fall', null, null),
  ('christmas-fern', 'fern', 'Part to full shade', '3', '9', false, 1, 4, 'medium', null, null, 'perennial', 'Plant in spring or fall in shade', null, null),
  ('vinca-minor', 'forb', 'Part shade to shade', '4', '9', false, 1, 4, 'low', null, null, 'perennial', 'Plant in spring; spreads to cover', null, null);

-- 1. Correct plant_type_code.
update catalog.plant_profiles p
set plant_type_code = b.type, updated_at = now()
from _batch b
where p.slug = b.slug and b.type is not null and p.plant_type_code is distinct from b.type;

-- 2. Climate profile (light, hardiness, frost-tender, sun hours).
insert into catalog.plant_climate_profiles (id, plant_profile_id, preferred_light, usda_hardiness_min, usda_hardiness_max, frost_tender, sun_min_hours, sun_max_hours, created_at, updated_at, version)
select gen_random_uuid(), p.id, b.light, b.hmin, b.hmax, b.frost_tender, b.sun_min, b.sun_max, now(), now(), 1
from _batch b
join catalog.plant_profiles p on p.slug = b.slug
where not exists (select 1 from catalog.plant_climate_profiles x where x.plant_profile_id = p.id);

-- 3. Water profile.
insert into catalog.plant_water_profiles (id, plant_profile_id, water_need_level, created_at, updated_at, version)
select gen_random_uuid(), p.id, b.water, now(), now(), 1
from _batch b
join catalog.plant_profiles p on p.slug = b.slug
where not exists (select 1 from catalog.plant_water_profiles x where x.plant_profile_id = p.id);

-- 4. Phenology profile.
insert into catalog.plant_phenology_profiles (id, plant_profile_id, days_to_maturity_min, days_to_maturity_max, maturity_basis, planting_window_label, harvest_window_label, perennial_first_harvest_label, created_at, updated_at, version)
select gen_random_uuid(), p.id, b.dmin, b.dmax, b.basis, b.plant_label, b.harvest_label, b.first_harvest, now(), now(), 1
from _batch b
join catalog.plant_profiles p on p.slug = b.slug
on conflict (plant_profile_id) do nothing;

-- 5. Publish.
update catalog.plant_profiles p
set is_published = true,
    generation_status = coalesce(p.generation_status, 'ai_reviewed'),
    review_status = coalesce(p.review_status, 'pending_review'),
    updated_at = now()
from _batch b
where p.slug = b.slug and not p.is_published;

commit;

-- Verification:
-- select count(*) filter (where is_published) from catalog.plant_profiles;  -- expect 47
