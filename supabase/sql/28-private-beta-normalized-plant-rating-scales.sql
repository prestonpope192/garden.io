-- Add normalized 1-5 plant rating dimensions for scalable comparison,
-- filtering, and recommendation logic.

begin;

create table if not exists catalog.plant_rating_dimensions (
  code text primary key,
  category text not null,
  label text not null,
  description text not null,
  rating_direction text not null check (rating_direction in ('higher_more', 'higher_better', 'higher_worse')),
  unit_context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create table if not exists catalog.plant_rating_dimension_levels (
  dimension_code text not null references catalog.plant_rating_dimensions(code) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  label text not null,
  definition text not null,
  query_hint text,
  created_at timestamptz not null default now(),
  primary key (dimension_code, rating)
);

create table if not exists catalog.plant_profile_ratings (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  dimension_code text not null references catalog.plant_rating_dimensions(code) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  description text,
  evidence_strength_code text references catalog.evidence_strength_levels(code),
  confidence_score numeric(5,2),
  source_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (plant_profile_id, dimension_code)
);

create index if not exists idx_plant_profile_ratings_dimension_rating
  on catalog.plant_profile_ratings(dimension_code, rating, plant_profile_id);

create index if not exists idx_plant_profile_ratings_profile
  on catalog.plant_profile_ratings(plant_profile_id);

drop trigger if exists trg_touch_updated_at on catalog.plant_rating_dimensions;
create trigger trg_touch_updated_at
before update on catalog.plant_rating_dimensions
for each row execute function core.touch_updated_at();

drop trigger if exists trg_touch_updated_at on catalog.plant_profile_ratings;
create trigger trg_touch_updated_at
before update on catalog.plant_profile_ratings
for each row execute function core.touch_updated_at();

drop view if exists catalog.plant_profile_catalogue_view;

create or replace view catalog.plant_profile_catalogue_view as
with primary_common_names as (
  select distinct on (plant_taxon_id)
    plant_taxon_id,
    name
  from catalog.plant_names
  where name_type = 'common'
  order by plant_taxon_id, is_primary desc, created_at asc
),
rating_json as (
  select
    r.plant_profile_id,
    jsonb_object_agg(
      r.dimension_code,
      jsonb_build_object(
        'rating', r.rating,
        'description', r.description,
        'evidence_strength_code', r.evidence_strength_code,
        'confidence_score', r.confidence_score
      )
      order by r.dimension_code
    ) as ratings
  from catalog.plant_profile_ratings r
  group by r.plant_profile_id
),
propagation_method_json as (
  select
    pm.plant_profile_id,
    jsonb_agg(
      jsonb_build_object(
        'planting_method_code', pm.planting_method_code,
        'allowed', pm.allowed,
        'is_preferred', pm.is_preferred,
        'depth_min_in', pm.depth_min_in,
        'depth_max_in', pm.depth_max_in,
        'spacing_min_in', pm.spacing_min_in,
        'spacing_max_in', pm.spacing_max_in,
        'proliferation_behavior', pm.proliferation_behavior,
        'self_seeds', pm.self_seeds,
        'reseeding_intensity', pm.reseeding_intensity,
        'spreads_by_runners', pm.spreads_by_runners,
        'spreads_by_rhizomes', pm.spreads_by_rhizomes,
        'grafted_common', pm.grafted_common,
        'seed_viability_duration_months', pm.seed_viability_duration_months,
        'germination_days_min', pm.germination_days_min,
        'germination_days_max', pm.germination_days_max,
        'cold_stratification_required', pm.cold_stratification_required,
        'scarification_required', pm.scarification_required,
        'rooting_hormone_helpful', pm.rooting_hormone_helpful,
        'transplant_shock_risk_code', pm.transplant_shock_risk_code,
        'establishment_difficulty', pm.establishment_difficulty,
        'notes', pm.notes
      )
      order by pm.is_preferred desc, pm.planting_method_code
    ) as propagation_methods
  from catalog.plant_propagation_methods pm
  group by pm.plant_profile_id
)
select
  p.id as plant_profile_id,
  p.slug,
  p.plant_taxon_id,
  p.plant_cultivar_id,
  p.display_name,
  p.plant_type_code,
  p.lifecycle_type,
  p.generation_status,
  p.is_published,
  p.review_status,
  p.confidence_score,
  p.evidence_count,
  p.source_count,
  p.human_verified,
  t.family_name,
  t.genus_name,
  t.species_name,
  t.botanical_name_full,
  n.name as primary_common_name,
  pn.short_description,
  pn.why_plant_it,
  pn.pros_summary,
  pn.cons_summary,
  pn.primary_use_cases,
  pn.notes_for_homestead,
  pn.notes_for_small_garden,
  pn.notes_for_container_growing,
  op.evergreen_deciduous,
  op.ornamental_season_interest,
  op.visual_texture,
  op.foliage_color,
  op.evergreen_foliage,
  op.winter_interest,
  cp.usda_hardiness_min,
  cp.usda_hardiness_max,
  cp.sun_min_hours,
  cp.sun_max_hours,
  cp.preferred_light,
  gp.mature_height_min_in,
  gp.mature_height_max_in,
  gp.mature_width_min_in,
  gp.mature_width_max_in,
  gp.growth_rate_code,
  gp.growth_habit,
  sp.drainage_requirement,
  sp.fertility_need,
  sp.texture_preferences,
  sp.preferred_soil_texture_codes,
  sp.soil_texture_summary,
  sp.ph_min,
  sp.ph_max,
  wp.water_need_level,
  coalesce(pmj.propagation_methods, '[]'::jsonb) as propagation_methods,
  img.image_url as primary_image_url,
  coalesce(rj.ratings, '{}'::jsonb) as ratings
from catalog.plant_profiles p
join catalog.plant_taxa t on t.id = p.plant_taxon_id
left join primary_common_names n on n.plant_taxon_id = p.plant_taxon_id
left join catalog.plant_profile_narratives pn
  on pn.plant_profile_id = p.id
 and pn.locale = 'en'
left join catalog.plant_ornamental_profiles op on op.plant_profile_id = p.id
left join catalog.plant_climate_profiles cp on cp.plant_profile_id = p.id
left join catalog.plant_growth_profiles gp on gp.plant_profile_id = p.id
left join catalog.plant_soil_profiles sp on sp.plant_profile_id = p.id
left join catalog.plant_water_profiles wp on wp.plant_profile_id = p.id
left join rating_json rj on rj.plant_profile_id = p.id
left join propagation_method_json pmj on pmj.plant_profile_id = p.id
left join lateral (
  select image_url
  from catalog.plant_images
  where plant_profile_id = p.id
    and is_public = true
  order by is_primary desc, created_at asc
  limit 1
) img on true
where p.deleted_at is null;

insert into catalog.plant_rating_dimensions (code, category, label, description, rating_direction, unit_context)
values
  ('sun_need', 'light', 'Sun Need', 'How much direct sunlight the plant generally needs to perform well.', 'higher_more', '1 = shade, 5 = full sun'),
  ('shade_tolerance', 'light', 'Shade Tolerance', 'How well the plant tolerates shade while remaining useful and healthy.', 'higher_better', '1 = little tolerance, 5 = deep shade tolerant'),
  ('afternoon_sun_tolerance', 'light', 'Afternoon Sun Tolerance', 'How well the plant handles hot, direct afternoon sun.', 'higher_better', '1 = avoid afternoon sun, 5 = strong tolerance'),
  ('water_need', 'water', 'Water Need', 'Typical water requirement once established in an appropriate site.', 'higher_more', '1 = very low water, 5 = very high water'),
  ('drought_tolerance', 'water', 'Drought Tolerance', 'How well the plant tolerates dry periods after establishment.', 'higher_better', '1 = poor, 5 = excellent'),
  ('wet_feet_tolerance', 'water', 'Wet Feet Tolerance', 'How well roots tolerate saturated or poorly aerated soil.', 'higher_better', '1 = intolerant, 5 = tolerant'),
  ('soil_drainage_need', 'soil', 'Drainage Need', 'How strongly the plant requires well-drained soil.', 'higher_more', '1 = tolerates poor drainage, 5 = needs sharp drainage'),
  ('soil_fertility_need', 'soil', 'Fertility Need', 'How much fertility/nutrient availability the plant generally needs.', 'higher_more', '1 = low fertility, 5 = high fertility'),
  ('soil_compaction_tolerance', 'soil', 'Compaction Tolerance', 'How well the plant tolerates compacted soil.', 'higher_better', '1 = poor, 5 = high tolerance'),
  ('soil_texture_flexibility', 'soil', 'Soil Texture Flexibility', 'How broad the acceptable soil texture range is.', 'higher_better', '1 = narrow preference, 5 = broad tolerance'),
  ('maintenance_need', 'maintenance', 'Maintenance Need', 'Expected routine care burden for a successful planting.', 'higher_more', '1 = very low, 5 = very high'),
  ('beginner_friendliness', 'maintenance', 'Beginner Friendliness', 'How forgiving the plant is for less experienced growers.', 'higher_better', '1 = difficult, 5 = very easy'),
  ('spread_aggressiveness', 'growth', 'Spread Aggressiveness', 'How strongly the plant expands beyond the original planting area.', 'higher_more', '1 = contained, 5 = aggressive spreader'),
  ('container_suitability', 'growth', 'Container Suitability', 'How suitable the plant is for container culture.', 'higher_better', '1 = poor, 5 = excellent'),
  ('transplant_tolerance', 'growth', 'Transplant Tolerance', 'How well the plant handles moving/division/transplanting.', 'higher_better', '1 = poor, 5 = excellent'),
  ('pollinator_value', 'ecology', 'Pollinator Value', 'Relative usefulness as a pollinator-support plant.', 'higher_better', '1 = low, 5 = high'),
  ('wildlife_food_value', 'ecology', 'Wildlife Food Value', 'Relative usefulness as wildlife food.', 'higher_better', '1 = low, 5 = high'),
  ('erosion_control_value', 'ecology', 'Erosion Control Value', 'Relative usefulness for stabilizing soil.', 'higher_better', '1 = low, 5 = high'),
  ('biomass_value', 'ecology', 'Biomass Value', 'Relative value as biomass/mulch/compost material.', 'higher_better', '1 = low, 5 = high'),
  ('invasive_risk', 'risk', 'Invasive or Nuisance Spread Risk', 'Risk that the plant becomes difficult to manage or ecologically inappropriate.', 'higher_worse', '1 = low risk, 5 = high risk'),
  ('disease_susceptibility', 'risk', 'Disease Susceptibility', 'Relative disease pressure or susceptibility in normal garden conditions.', 'higher_worse', '1 = low, 5 = high'),
  ('pest_susceptibility', 'risk', 'Pest Susceptibility', 'Relative pest pressure or susceptibility in normal garden conditions.', 'higher_worse', '1 = low, 5 = high'),
  ('humidity_disease_risk', 'risk', 'Humidity Disease Risk', 'Risk that humidity or poor airflow increases disease problems.', 'higher_worse', '1 = low, 5 = high'),
  ('deer_resistance', 'animal_pressure', 'Deer Resistance', 'How resistant the plant tends to be to deer browsing.', 'higher_better', '1 = low, 5 = high'),
  ('rabbit_resistance', 'animal_pressure', 'Rabbit Resistance', 'How resistant the plant tends to be to rabbit browsing.', 'higher_better', '1 = low, 5 = high')
on conflict (code) do update
set category = excluded.category,
    label = excluded.label,
    description = excluded.description,
    rating_direction = excluded.rating_direction,
    unit_context = excluded.unit_context,
    updated_at = now();

insert into catalog.plant_rating_dimension_levels (dimension_code, rating, label, definition, query_hint)
values
  ('sun_need', 1, 'Shade', 'Performs with little direct sun; generally below 2 hours direct sun.', 'shade plants'),
  ('sun_need', 2, 'Part Shade', 'Prefers filtered light or roughly 2-4 hours direct sun.', 'part shade plants'),
  ('sun_need', 3, 'Part Sun', 'Prefers mixed light or roughly 4-6 hours direct sun.', 'part sun plants'),
  ('sun_need', 4, 'Full Sun Preferred', 'Prefers about 6-8 hours direct sun.', 'full sun preferred'),
  ('sun_need', 5, 'Full Sun Required', 'Needs long direct sun exposure, typically 8+ hours, for best performance.', 'full sun required'),

  ('shade_tolerance', 1, 'Low', 'Declines quickly in shade.', 'avoid shade'),
  ('shade_tolerance', 2, 'Some', 'Tolerates light shade but performs best brighter.', 'light shade tolerant'),
  ('shade_tolerance', 3, 'Moderate', 'Works in part shade with acceptable performance.', 'part shade tolerant'),
  ('shade_tolerance', 4, 'High', 'Performs well in shade or woodland-edge conditions.', 'shade tolerant'),
  ('shade_tolerance', 5, 'Very High', 'One of the better options for deep or persistent shade.', 'deep shade tolerant'),

  ('afternoon_sun_tolerance', 1, 'Avoid', 'Hot afternoon sun commonly causes stress or damage.', 'needs afternoon shade'),
  ('afternoon_sun_tolerance', 2, 'Low', 'Can handle brief afternoon sun only with support.', 'low afternoon sun tolerance'),
  ('afternoon_sun_tolerance', 3, 'Moderate', 'Handles some afternoon sun in suitable soil/moisture.', 'moderate afternoon sun tolerance'),
  ('afternoon_sun_tolerance', 4, 'High', 'Usually handles afternoon sun well.', 'afternoon sun tolerant'),
  ('afternoon_sun_tolerance', 5, 'Very High', 'Strong hot-sun/reflected-heat performer.', 'heat exposure tolerant'),

  ('water_need', 1, 'Very Low', 'Needs little supplemental water after establishment.', 'xeric low water'),
  ('water_need', 2, 'Low', 'Needs occasional water during dry periods.', 'low water'),
  ('water_need', 3, 'Medium', 'Needs even moisture or periodic supplemental water.', 'medium water'),
  ('water_need', 4, 'High', 'Needs regular moisture to perform well.', 'high water'),
  ('water_need', 5, 'Very High', 'Needs consistently moist/wet conditions.', 'very high water'),

  ('drought_tolerance', 1, 'Poor', 'Struggles quickly in dry soil.', 'not drought tolerant'),
  ('drought_tolerance', 2, 'Low', 'Tolerates only short dry periods.', 'low drought tolerance'),
  ('drought_tolerance', 3, 'Moderate', 'Tolerates some dryness once established.', 'moderate drought tolerance'),
  ('drought_tolerance', 4, 'High', 'Handles dry spells well after establishment.', 'drought tolerant'),
  ('drought_tolerance', 5, 'Very High', 'Strong dry-site performer.', 'very drought tolerant'),

  ('wet_feet_tolerance', 1, 'Poor', 'Avoid saturated or poorly drained soil.', 'wet feet intolerant'),
  ('wet_feet_tolerance', 2, 'Low', 'Brief saturation only.', 'low wet soil tolerance'),
  ('wet_feet_tolerance', 3, 'Moderate', 'Tolerates periodic wetness if drainage recovers.', 'moderate wet soil tolerance'),
  ('wet_feet_tolerance', 4, 'High', 'Works in moist to periodically wet sites.', 'wet tolerant'),
  ('wet_feet_tolerance', 5, 'Very High', 'Suitable for persistently wet or boggy sites.', 'bog wet tolerant'),

  ('soil_drainage_need', 1, 'Low', 'Can tolerate poor drainage or heavy wet soil.', 'poor drainage tolerant'),
  ('soil_drainage_need', 2, 'Some', 'Prefers drainage but tolerates heavier soil.', 'some drainage need'),
  ('soil_drainage_need', 3, 'Moderate', 'Needs reasonably drained soil.', 'well drained preferred'),
  ('soil_drainage_need', 4, 'High', 'Requires well-drained soil for reliable performance.', 'requires well drained soil'),
  ('soil_drainage_need', 5, 'Very High', 'Requires sharp drainage; rot risk is high otherwise.', 'sharp drainage required'),

  ('soil_fertility_need', 1, 'Low', 'Performs in lean soil.', 'low fertility'),
  ('soil_fertility_need', 2, 'Moderately Low', 'Light fertility is enough.', 'modest fertility'),
  ('soil_fertility_need', 3, 'Medium', 'Average garden fertility is appropriate.', 'medium fertility'),
  ('soil_fertility_need', 4, 'High', 'Benefits from fertile, amended soil.', 'high fertility'),
  ('soil_fertility_need', 5, 'Very High', 'Heavy feeder or strongly fertility-dependent.', 'very high fertility'),

  ('soil_compaction_tolerance', 1, 'Poor', 'Compaction strongly limits performance.', 'compaction sensitive'),
  ('soil_compaction_tolerance', 2, 'Low', 'Needs loose soil for good performance.', 'low compaction tolerance'),
  ('soil_compaction_tolerance', 3, 'Moderate', 'Handles average garden compaction.', 'moderate compaction tolerance'),
  ('soil_compaction_tolerance', 4, 'High', 'Handles compacted or walked-near soil better than most.', 'compaction tolerant'),
  ('soil_compaction_tolerance', 5, 'Very High', 'Strong performer in compacted sites.', 'very compaction tolerant'),

  ('soil_texture_flexibility', 1, 'Narrow', 'Strongly prefers a narrow soil texture range.', 'narrow soil preference'),
  ('soil_texture_flexibility', 2, 'Limited', 'Accepts a limited range of textures.', 'limited soil texture range'),
  ('soil_texture_flexibility', 3, 'Moderate', 'Works in several common garden textures.', 'moderate soil flexibility'),
  ('soil_texture_flexibility', 4, 'Broad', 'Tolerates a broad range of textures.', 'broad soil flexibility'),
  ('soil_texture_flexibility', 5, 'Very Broad', 'Highly adaptable across soil textures.', 'very adaptable soil'),

  ('maintenance_need', 1, 'Very Low', 'Little routine care beyond establishment.', 'very low maintenance'),
  ('maintenance_need', 2, 'Low', 'Occasional seasonal care.', 'low maintenance'),
  ('maintenance_need', 3, 'Medium', 'Regular but manageable care.', 'medium maintenance'),
  ('maintenance_need', 4, 'High', 'Frequent pruning, training, protection, or cleanup.', 'high maintenance'),
  ('maintenance_need', 5, 'Very High', 'Intensive care or close management required.', 'very high maintenance'),

  ('beginner_friendliness', 1, 'Difficult', 'Poor choice for beginners.', 'advanced plant'),
  ('beginner_friendliness', 2, 'Somewhat Difficult', 'Forgiving only in the right site.', 'somewhat difficult'),
  ('beginner_friendliness', 3, 'Moderate', 'Reasonable for beginners with guidance.', 'moderate beginner plant'),
  ('beginner_friendliness', 4, 'Easy', 'Generally forgiving.', 'beginner friendly'),
  ('beginner_friendliness', 5, 'Very Easy', 'Highly forgiving and reliable.', 'very beginner friendly'),

  ('spread_aggressiveness', 1, 'Contained', 'Generally stays where planted.', 'contained'),
  ('spread_aggressiveness', 2, 'Slow', 'Spreads slowly or predictably.', 'slow spread'),
  ('spread_aggressiveness', 3, 'Moderate', 'Spreads enough to need periodic attention.', 'moderate spread'),
  ('spread_aggressiveness', 4, 'Assertive', 'Can move beyond its place and needs management.', 'assertive spread'),
  ('spread_aggressiveness', 5, 'Aggressive', 'Likely to become difficult to control in favorable conditions.', 'aggressive spread'),

  ('container_suitability', 1, 'Poor', 'Not a good container candidate.', 'poor container plant'),
  ('container_suitability', 2, 'Limited', 'Possible only with extra care.', 'limited container suitability'),
  ('container_suitability', 3, 'Moderate', 'Can work in containers with normal care.', 'container possible'),
  ('container_suitability', 4, 'Good', 'Good container candidate.', 'good container plant'),
  ('container_suitability', 5, 'Excellent', 'Excellent or common container plant.', 'excellent container plant'),

  ('transplant_tolerance', 1, 'Poor', 'Strongly resents moving.', 'poor transplant tolerance'),
  ('transplant_tolerance', 2, 'Low', 'Move only with care.', 'low transplant tolerance'),
  ('transplant_tolerance', 3, 'Moderate', 'Handles transplanting with normal precautions.', 'moderate transplant tolerance'),
  ('transplant_tolerance', 4, 'Good', 'Generally moves/divides well.', 'good transplant tolerance'),
  ('transplant_tolerance', 5, 'Excellent', 'Very easy to move/divide.', 'excellent transplant tolerance'),

  ('pollinator_value', 1, 'Low', 'Little pollinator value.', 'low pollinator'),
  ('pollinator_value', 2, 'Some', 'Some seasonal visitation.', 'some pollinator value'),
  ('pollinator_value', 3, 'Moderate', 'Useful pollinator support.', 'moderate pollinator'),
  ('pollinator_value', 4, 'High', 'Strong pollinator support.', 'high pollinator'),
  ('pollinator_value', 5, 'Very High', 'Major pollinator-support plant.', 'very high pollinator'),

  ('wildlife_food_value', 1, 'Low', 'Little wildlife food value.', 'low wildlife food'),
  ('wildlife_food_value', 2, 'Some', 'Some wildlife use.', 'some wildlife food'),
  ('wildlife_food_value', 3, 'Moderate', 'Useful wildlife food value.', 'moderate wildlife food'),
  ('wildlife_food_value', 4, 'High', 'Strong wildlife food value.', 'high wildlife food'),
  ('wildlife_food_value', 5, 'Very High', 'Major wildlife food plant.', 'very high wildlife food'),

  ('erosion_control_value', 1, 'Low', 'Little erosion-control value.', 'low erosion control'),
  ('erosion_control_value', 2, 'Some', 'Some soil-holding value.', 'some erosion control'),
  ('erosion_control_value', 3, 'Moderate', 'Useful soil stabilization.', 'moderate erosion control'),
  ('erosion_control_value', 4, 'High', 'Strong erosion-control value.', 'high erosion control'),
  ('erosion_control_value', 5, 'Very High', 'Major erosion-control plant.', 'very high erosion control'),

  ('biomass_value', 1, 'Low', 'Low biomass contribution.', 'low biomass'),
  ('biomass_value', 2, 'Some', 'Some useful biomass.', 'some biomass'),
  ('biomass_value', 3, 'Moderate', 'Moderate biomass contribution.', 'moderate biomass'),
  ('biomass_value', 4, 'High', 'High biomass contribution.', 'high biomass'),
  ('biomass_value', 5, 'Very High', 'Major biomass/chop-and-drop contributor.', 'very high biomass'),

  ('invasive_risk', 1, 'Low', 'Low nuisance or invasive risk in normal garden context.', 'low invasive risk'),
  ('invasive_risk', 2, 'Mild', 'Minor spread or escape concern.', 'mild invasive risk'),
  ('invasive_risk', 3, 'Moderate', 'Needs ordinary containment or observation.', 'moderate invasive risk'),
  ('invasive_risk', 4, 'High', 'Can become difficult or inappropriate in favorable conditions.', 'high invasive risk'),
  ('invasive_risk', 5, 'Very High', 'Avoid or use only with strong containment/local verification.', 'very high invasive risk'),

  ('disease_susceptibility', 1, 'Low', 'Few disease issues expected.', 'low disease susceptibility'),
  ('disease_susceptibility', 2, 'Mild', 'Occasional disease issues.', 'mild disease susceptibility'),
  ('disease_susceptibility', 3, 'Moderate', 'Disease pressure can matter in common conditions.', 'moderate disease susceptibility'),
  ('disease_susceptibility', 4, 'High', 'Disease management is often important.', 'high disease susceptibility'),
  ('disease_susceptibility', 5, 'Very High', 'High disease risk without careful siting/management.', 'very high disease susceptibility'),

  ('pest_susceptibility', 1, 'Low', 'Few pest issues expected.', 'low pest susceptibility'),
  ('pest_susceptibility', 2, 'Mild', 'Occasional pest issues.', 'mild pest susceptibility'),
  ('pest_susceptibility', 3, 'Moderate', 'Pest pressure can matter in common conditions.', 'moderate pest susceptibility'),
  ('pest_susceptibility', 4, 'High', 'Pest management is often important.', 'high pest susceptibility'),
  ('pest_susceptibility', 5, 'Very High', 'High pest risk without careful management.', 'very high pest susceptibility'),

  ('humidity_disease_risk', 1, 'Low', 'Humidity rarely creates disease problems.', 'low humidity disease risk'),
  ('humidity_disease_risk', 2, 'Mild', 'Some risk in stagnant air.', 'mild humidity disease risk'),
  ('humidity_disease_risk', 3, 'Moderate', 'Airflow and spacing matter in humid conditions.', 'moderate humidity disease risk'),
  ('humidity_disease_risk', 4, 'High', 'Humidity commonly drives disease pressure.', 'high humidity disease risk'),
  ('humidity_disease_risk', 5, 'Very High', 'Avoid humid/stagnant sites or manage intensively.', 'very high humidity disease risk'),

  ('deer_resistance', 1, 'Low', 'Often browsed by deer.', 'low deer resistance'),
  ('deer_resistance', 2, 'Mild', 'Some browsing likely.', 'mild deer resistance'),
  ('deer_resistance', 3, 'Moderate', 'Moderate deer resistance.', 'moderate deer resistance'),
  ('deer_resistance', 4, 'High', 'Usually deer resistant.', 'high deer resistance'),
  ('deer_resistance', 5, 'Very High', 'Strong deer resistance.', 'very high deer resistance'),

  ('rabbit_resistance', 1, 'Low', 'Often browsed by rabbits.', 'low rabbit resistance'),
  ('rabbit_resistance', 2, 'Mild', 'Some browsing likely.', 'mild rabbit resistance'),
  ('rabbit_resistance', 3, 'Moderate', 'Moderate rabbit resistance.', 'moderate rabbit resistance'),
  ('rabbit_resistance', 4, 'High', 'Usually rabbit resistant.', 'high rabbit resistance'),
  ('rabbit_resistance', 5, 'Very High', 'Strong rabbit resistance.', 'very high rabbit resistance')
on conflict (dimension_code, rating) do update
set label = excluded.label,
    definition = excluded.definition,
    query_hint = excluded.query_hint;

insert into catalog.plant_profile_ratings (
  plant_profile_id,
  dimension_code,
  rating,
  description,
  evidence_strength_code,
  confidence_score,
  source_notes
)
values
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'sun_need', 3, 'Best treated as part sun/part shade: tolerates full sun, but appreciates some shade in hotter conditions.', 'moderate', 0.82, 'Derived from curated climate profile and source claims.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'shade_tolerance', 4, 'Performs well in part shade and woodland-edge conditions.', 'moderate', 0.82, 'Derived from preferred light and shade tolerance score.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'afternoon_sun_tolerance', 3, 'Handles some afternoon sun with moisture, but hotter sites benefit from shade.', 'moderate', 0.72, 'Derived from curated light notes.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'water_need', 3, 'Medium water need; keep evenly moist during establishment and dry periods.', 'moderate', 0.82, 'Derived from water profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'drought_tolerance', 3, 'Moderate drought tolerance after establishment, not a true xeric plant.', 'moderate', 0.74, 'Derived from water and climate profiles.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'wet_feet_tolerance', 1, 'Poor tolerance for saturated or poorly drained soil.', 'strong', 0.84, 'Derived from soil drainage and waterlogging sensitivity.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'soil_drainage_need', 4, 'Requires well-drained soil for reliable performance.', 'strong', 0.86, 'Derived from soil profile and source claim.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'soil_fertility_need', 3, 'Average to fertile soil is appropriate.', 'moderate', 0.78, 'Derived from soil profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'soil_compaction_tolerance', 3, 'Moderate tolerance, but better in loose, aerated soil.', 'weak', 0.62, 'Derived from compaction tolerance.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'soil_texture_flexibility', 3, 'Accepts several garden textures if drainage is adequate.', 'moderate', 0.74, 'Derived from soil texture preferences.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'maintenance_need', 3, 'Moderate management due to spent stalk cleanup and spread control.', 'moderate', 0.80, 'Derived from maintenance profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'beginner_friendliness', 3, 'Manageable for beginners with clear siting and spread expectations.', 'moderate', 0.76, 'Derived from plant profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'spread_aggressiveness', 4, 'Assertive root spread; can be hard to remove once established.', 'strong', 0.86, 'Derived from growth profile and spread claim.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'container_suitability', 3, 'Containers can work and help control spread, but need consistent care.', 'weak', 0.64, 'Derived from profile/container notes.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'transplant_tolerance', 2, 'Moving established plants can be messy because root sections resprout.', 'weak', 0.62, 'Derived from growth/propagation profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'pollinator_value', 3, 'Useful seasonal floral resource but not a primary pollinator powerhouse.', 'moderate', 0.70, 'Derived from flowering and use profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'wildlife_food_value', 1, 'Low wildlife food value in this profile.', 'weak', 0.58, 'Derived from ecology profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'erosion_control_value', 2, 'Some soil-holding value from perennial clumps, but not a primary erosion plant.', 'weak', 0.58, 'Derived from ecology profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'biomass_value', 3, 'Moderate biomass from large foliage.', 'weak', 0.60, 'Derived from ecology profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'invasive_risk', 3, 'Moderate nuisance-spread risk in garden beds; not marked as published invasive claim.', 'moderate', 0.78, 'Derived from ecology profile and spread claim.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'disease_susceptibility', 2, 'Some powdery mildew risk, especially with humidity or poor airflow.', 'moderate', 0.70, 'Derived from maintenance and claim records.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'pest_susceptibility', 2, 'Some slug and snail pressure possible.', 'moderate', 0.70, 'Derived from maintenance and claim records.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'humidity_disease_risk', 3, 'Airflow matters in humid conditions because powdery mildew can appear.', 'moderate', 0.68, 'Derived from maintenance profile.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'deer_resistance', 4, 'Usually treated as meaningfully deer resistant, but still context-dependent.', 'weak', 0.62, 'Derived from plant profile score.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'rabbit_resistance', 3, 'Moderate rabbit resistance.', 'weak', 0.58, 'Derived from plant profile score.')
on conflict (plant_profile_id, dimension_code) do update
set rating = excluded.rating,
    description = excluded.description,
    evidence_strength_code = excluded.evidence_strength_code,
    confidence_score = excluded.confidence_score,
    source_notes = excluded.source_notes,
    updated_at = now();

commit;
