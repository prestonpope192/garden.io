-- Garden.io private beta: publish the curated 25-plant catalogue (2026-06-11).
--
-- Enriches 17 sparse profiles (climate light text, water need level, narrative
-- why/use-cases where missing), wires botanical plate SVGs as primary images
-- for all 25, and marks all 25 published. Idempotent: inserts are guarded,
-- narrative updates only fill NULLs, image demotion is scoped to the 25.

begin;

create temporary table _curated_25 (
  slug text primary key,
  preferred_light text not null,
  water_need_level text not null,
  why_plant_it text not null,
  primary_use_cases text not null
) on commit drop;

insert into _curated_25 (slug, preferred_light, water_need_level, why_plant_it, primary_use_cases) values
  ('acanthus', 'Part shade; tolerates morning sun.', 'low', 'Architectural foliage and tall flower spikes that thrive where many ornamentals struggle.', 'shade structure, dramatic foliage, low-water borders'),
  ('dill', 'Full sun.', 'medium', 'Fast culinary herb that feeds you, swallowtail caterpillars, and beneficial wasps in one season.', 'culinary herb, pollinator support, pickling'),
  ('bouquet-dill', 'Full sun.', 'medium', 'Compact dill bred for early, heavy seed umbels — ideal where space is tight.', 'pickling, container herb, cut flower'),
  ('mammoth-dill', 'Full sun.', 'medium', 'The classic tall pickling dill with broad umbels on sturdy hollow stems.', 'pickling, market herb, beneficial insect draw'),
  ('blueberry', 'Full sun; tolerates light shade at cost of yield.', 'high', 'A long-lived acid-soil shrub that pays back bed prep with decades of fruit.', 'fruit harvest, edible hedge, fall color'),
  ('comfrey', 'Full sun to part shade.', 'medium', 'The homestead workhorse: chop-and-drop mulch, compost activator, and deep-mining roots.', 'mulch crop, compost feedstock, pollinator bloom'),
  ('meyer-lemon', 'Full sun; bright south exposure.', 'medium', 'The forgiving container citrus — fragrant bloom and thin-skinned sweet lemons.', 'container citrus, patio tree, fragrant bloom'),
  ('strawberry', 'Full sun.', 'medium', 'Quick groundcover fruit that establishes fast and multiplies itself by runner.', 'edible groundcover, fresh fruit, border edging'),
  ('cherokee-purple-tomato', 'Full sun.', 'high', 'A full-flavor heirloom slicer that rewards warm beds, deep feeding, and consistent pruning.', 'slicing tomato, fresh eating, heirloom seed saving'),
  ('genovese-basil', 'Full sun; light afternoon shade in hot climates.', 'medium', 'The pesto standard — big cupped leaves all summer if you keep pinching.', 'pesto, fresh culinary herb, container herb'),
  ('scarlet-runner-bean', 'Full sun.', 'medium', 'A climbing bean with strong pollinator value and a long visual season on fences and trellises.', 'edible pods, pollinator draw, vertical screen'),
  ('calendula', 'Full sun to light shade.', 'low', 'An easy seasonal flower for edges — pollinator support and steady cut-and-come-again blooms.', 'cut flower, edible petals, companion planting'),
  ('chives', 'Full sun to part shade.', 'medium', 'A perennial kitchen ally that edges beds, blooms for bees, and shrugs off neglect.', 'perennial culinary herb, bed edging, pollinator bloom'),
  ('nasturtium', 'Full sun; flowers best in lean soil.', 'low', 'Edible flowers and leaves on a plant that doubles as a trap crop for aphids.', 'edible flowers, trap crop, trailing groundcover'),
  ('borage', 'Full sun.', 'low', 'A self-sowing bee magnet with cucumber-flavored star flowers.', 'pollinator magnet, edible flowers, tomato companion'),
  ('bee-balm', 'Full sun to part shade; best bloom in sun.', 'medium', 'Native firework blooms that hummingbirds and bees work all summer.', 'pollinator garden, cut flower, tea herb'),
  ('raspberry', 'Full sun.', 'medium', 'Reliable cane fruit — a small patch yields steady bowls of berries every year.', 'fresh berries, preserves, edible hedge'),
  ('blackberry', 'Full sun.', 'medium', 'Vigorous cane fruit that turns a fence line into a productive hedge.', 'fresh berries, preserves, wildlife hedge'),
  ('garlic-hardneck', 'Full sun.', 'medium', 'Plant in fall, harvest twice: curling scapes in spring and storage bulbs in summer.', 'storage crop, culinary staple, edible scapes'),
  ('jerusalem-artichoke-sunchoke', 'Full sun.', 'low', 'A no-care native sunflower that produces pounds of edible tubers per plant.', 'edible tubers, tall seasonal screen, late pollinator bloom'),
  ('pawpaw-mango', 'Sun to part shade; shade young trees, sun for fruiting.', 'medium', 'The largest native fruit — custard-textured, tropical-flavored, and nearly pest-free.', 'native fruit tree, understory planting, wildlife support'),
  ('pecan', 'Full sun.', 'medium', 'A legacy nut tree: decades of harvest and high shade from one well-sited planting.', 'nut harvest, shade tree, legacy planting'),
  ('japanese-maple', 'Part shade; morning sun with afternoon shade in hot climates.', 'medium', 'A sculptural specimen tree with unmatched fall color for small spaces and containers.', 'specimen tree, fall color, container patio tree'),
  ('hellebores', 'Part to full shade.', 'low', 'Evergreen winter bloom in deep shade where almost nothing else flowers — and deer skip it.', 'winter bloom, shade groundcover, deer-resistant border'),
  ('beautyberry', 'Full sun to part shade.', 'low', 'A tough native shrub whose violet fall berry clusters feed birds into winter.', 'native shrub, fall berry display, wildlife food');

-- 1. Climate profile (preferred_light) for profiles lacking one.
insert into catalog.plant_climate_profiles (id, plant_profile_id, preferred_light, created_at, updated_at, version)
select gen_random_uuid(), p.id, c.preferred_light, now(), now(), 1
from _curated_25 c
join catalog.plant_profiles p on p.slug = c.slug
where not exists (
  select 1 from catalog.plant_climate_profiles x where x.plant_profile_id = p.id
);

-- 1b. Fill preferred_light on existing climate rows where NULL.
update catalog.plant_climate_profiles x
set preferred_light = c.preferred_light, updated_at = now()
from catalog.plant_profiles p
join _curated_25 c on c.slug = p.slug
where x.plant_profile_id = p.id
  and x.preferred_light is null;

-- 2. Water profile (water_need_level) for profiles lacking one.
insert into catalog.plant_water_profiles (id, plant_profile_id, water_need_level, created_at, updated_at, version)
select gen_random_uuid(), p.id, c.water_need_level, now(), now(), 1
from _curated_25 c
join catalog.plant_profiles p on p.slug = c.slug
where not exists (
  select 1 from catalog.plant_water_profiles x where x.plant_profile_id = p.id
);

-- 3. Narratives: fill missing why/use-cases only (prefer existing narrative,
--    then profile-row text, then curated copy).
update catalog.plant_profile_narratives pn
set why_plant_it = coalesce(pn.why_plant_it, p.why_plant_it, c.why_plant_it),
    primary_use_cases = coalesce(pn.primary_use_cases, p.primary_use_cases, c.primary_use_cases),
    updated_at = now()
from catalog.plant_profiles p
join _curated_25 c on c.slug = p.slug
where pn.plant_profile_id = p.id
  and (pn.why_plant_it is null or pn.primary_use_cases is null);

-- 4a. Demote existing primary images for the 25 so the plate becomes primary.
update catalog.plant_images i
set is_primary = false, updated_at = now()
from catalog.plant_profiles p
join _curated_25 c on c.slug = p.slug
where i.plant_profile_id = p.id
  and i.is_primary
  and i.image_url <> '/art/plants/' || p.slug || '.svg';

-- 4b. Insert the botanical plate as the primary public image.
insert into catalog.plant_images (
  id, plant_profile_id, image_url, mime_type, width_px, height_px,
  attribution_text, is_primary, is_public, created_at, updated_at, version
)
select gen_random_uuid(), p.id, '/art/plants/' || p.slug || '.svg', 'image/svg+xml', 640, 800,
       'Garden.io botanical plate', true, true, now(), now(), 1
from _curated_25 c
join catalog.plant_profiles p on p.slug = c.slug
where not exists (
  select 1 from catalog.plant_images x
  where x.plant_profile_id = p.id
    and x.image_url = '/art/plants/' || p.slug || '.svg'
);

-- 5. Publish all 25.
update catalog.plant_profiles p
set is_published = true,
    generation_status = coalesce(p.generation_status, 'ai_reviewed'),
    review_status = coalesce(p.review_status, 'pending_review'),
    updated_at = now()
from _curated_25 c
where p.slug = c.slug
  and (not p.is_published or p.generation_status is null or p.review_status is null);

commit;

-- Verification (run separately if desired):
-- select count(*) from catalog.plant_profiles where is_published;            -- expect 25
-- select slug, preferred_light is not null as light, water_need_level is not null as water,
--        primary_image_url as img
-- from catalog.plant_profile_catalogue_view where slug in (select slug from _curated_25);
