begin;

create extension if not exists pgcrypto;

-- bouquet-dill
insert into catalog.plant_taxa (
  id, kingdom_name, family_name, genus_name, species_name, subspecies_name, variety_name,
  botanical_name_full, taxon_rank, native_range, origin_type
) values (
  '5f5e57e0-7540-5082-856a-7e1331ae8c76'::uuid, 'Plantae', 'Apiaceae', 'Anethum', 'graveolens', null, null, 'Anethum graveolens', 'species', 'Asia and Mediterranean/western Asian region; exact origin varies by source framing.', 'exotic'
)
on conflict ((lower(genus_name)), (coalesce(lower(species_name), '')), (coalesce(lower(subspecies_name), '')), (coalesce(lower(variety_name), ''))) do update set
  kingdom_name = excluded.kingdom_name,
  family_name = excluded.family_name,
  genus_name = excluded.genus_name,
  species_name = excluded.species_name,
  subspecies_name = excluded.subspecies_name,
  variety_name = excluded.variety_name,
  botanical_name_full = excluded.botanical_name_full,
  taxon_rank = excluded.taxon_rank,
  native_range = excluded.native_range,
  origin_type = excluded.origin_type,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Bouquet Dill', 'common', 'en', true)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Anethum graveolens ''Bouquet''', 'latin_variant', 'en', false)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Bouquet', 'trade', 'en', false)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_cultivars (
  id, plant_taxon_id, cultivar_name, market_name, description, chill_hours_min, chill_hours_max, disease_resistance_notes, is_active
) values (
  'b9ef7059-cdf1-5c45-9fe4-ce3b3adbba2a'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Bouquet', 'Bouquet Dill', 'Earlier-flowering, more compact dill cultivar used for pickling, leaf, flower, and seed production.', null, null, null, true
)
on conflict (plant_taxon_id, cultivar_name) do update set
  market_name = excluded.market_name,
  description = excluded.description,
  chill_hours_min = excluded.chill_hours_min,
  chill_hours_max = excluded.chill_hours_max,
  disease_resistance_notes = excluded.disease_resistance_notes,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_profiles (
  id, plant_taxon_id, plant_cultivar_id, slug, display_name, plant_type_code, lifecycle_type,
  confidence_score, evidence_count, source_count, source_last_reviewed_at,
  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,
  is_ai_generated, generation_status, is_published, review_status
) values (
  '84eace99-55c9-562c-bfef-1577db76adcf'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), (select id from catalog.plant_cultivars where plant_taxon_id = (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1) and cultivar_name = 'Bouquet' limit 1), 'bouquet-dill', 'Bouquet Dill', 'herb', 'annual', 0.82, 10, 5, '2026-06-03T00:00:00+00:00', true, false, false, 'Florida/fall planting timing differs from temperate spring timing; keep phenology regionalized.', true, 'ai_reviewed', true, 'pending_review'
)
on conflict (slug) where deleted_at is null do update set
  plant_taxon_id = excluded.plant_taxon_id,
  plant_cultivar_id = excluded.plant_cultivar_id,
  slug = excluded.slug,
  display_name = excluded.display_name,
  plant_type_code = excluded.plant_type_code,
  lifecycle_type = excluded.lifecycle_type,
  confidence_score = excluded.confidence_score,
  evidence_count = excluded.evidence_count,
  source_count = excluded.source_count,
  source_last_reviewed_at = excluded.source_last_reviewed_at,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  is_ai_generated = excluded.is_ai_generated,
  generation_status = excluded.generation_status,
  is_published = excluded.is_published,
  review_status = excluded.review_status,
  updated_at = now();

insert into catalog.plant_cultivar_overrides (id, plant_cultivar_id, plant_profile_id, region_type, region_value, field_key, override_scope, override_value, evidence_strength_code, source_notes)
values ('cce65385-4d2b-58c1-8734-e76f143ab06a'::uuid, (select id from catalog.plant_cultivars where plant_taxon_id = (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1) and cultivar_name = 'Bouquet' limit 1), (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), null, null, 'growth.mature_height_in', 'trait', '{"max":36,"min":24}'::jsonb, 'weak', 'SeedStore Bouquet product profile.')
on conflict (plant_cultivar_id, field_key, (coalesce(region_type, '')), (coalesce(region_value, ''))) do update set
  plant_profile_id = excluded.plant_profile_id,
  override_scope = excluded.override_scope,
  override_value = excluded.override_value,
  evidence_strength_code = excluded.evidence_strength_code,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_cultivar_overrides (id, plant_cultivar_id, plant_profile_id, region_type, region_value, field_key, override_scope, override_value, evidence_strength_code, source_notes)
values ('f7064d23-01d0-5e41-9a8b-55cfed88b0a4'::uuid, (select id from catalog.plant_cultivars where plant_taxon_id = (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1) and cultivar_name = 'Bouquet' limit 1), (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), null, null, 'phenology.days_to_maturity', 'phenology', '{"conflict":true,"extension_days":45,"vendor_days":85}'::jsonb, 'moderate', 'University of Delaware lists 45 days; SeedStore lists 85 days.')
on conflict (plant_cultivar_id, field_key, (coalesce(region_type, '')), (coalesce(region_value, ''))) do update set
  plant_profile_id = excluded.plant_profile_id,
  override_scope = excluded.override_scope,
  override_value = excluded.override_value,
  evidence_strength_code = excluded.evidence_strength_code,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_cultivar_overrides (id, plant_cultivar_id, plant_profile_id, region_type, region_value, field_key, override_scope, override_value, evidence_strength_code, source_notes)
values ('aeda2ac4-f42f-5e3a-8b27-3fb62b4e7e43'::uuid, (select id from catalog.plant_cultivars where plant_taxon_id = (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1) and cultivar_name = 'Bouquet' limit 1), (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), null, null, 'profile.primary_use_cases', 'trait', '["pickling heads","seed","fresh leaves"]'::jsonb, 'moderate', 'Extension and vendor both emphasize pickling/seed use.')
on conflict (plant_cultivar_id, field_key, (coalesce(region_type, '')), (coalesce(region_value, ''))) do update set
  plant_profile_id = excluded.plant_profile_id,
  override_scope = excluded.override_scope,
  override_value = excluded.override_value,
  evidence_strength_code = excluded.evidence_strength_code,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_aesthetic_styles (id, plant_profile_id, style_code, weight_score)
values ('5682c29b-1867-52be-ab69-f9442259f9db'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'cottage', 6)
on conflict (plant_profile_id, style_code) do update set
  weight_score = excluded.weight_score;

insert into catalog.plant_profile_aesthetic_styles (id, plant_profile_id, style_code, weight_score)
values ('b2f5beff-4522-573f-a737-04013bfc43a5'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'edible_landscape', 8)
on conflict (plant_profile_id, style_code) do update set
  weight_score = excluded.weight_score;

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('ec579129-2305-5424-8fae-1643a78a9bb8'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'culinary', 'strong', true, 'Leaves, flowers, and seeds are edible and used fresh, dried, or in pickling.', 'Fresh herb, seed spice, pickling', null, null, 'Use leaves fresh; harvest seed heads as fruiting tops mature.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('99b7b41d-059f-5144-b68b-c2ea4437b28a'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'pollinator_support', 'moderate', true, 'Flat yellow umbels provide small-flower insect forage.', 'Beneficial insect/pollinator resource', null, null, 'Allow some plants to bloom if pollinator value is desired.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('81115871-c278-562b-85db-03fd6cb5c6f4'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'cut_flower', 'weak', true, 'Umbels and scented foliage can be cut for arrangements or pickling jars.', 'Cut scented foliage/flower heads', null, null, 'More relevant for Mammoth and Bouquet than compact leaf cultivars.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_narratives (plant_profile_id, locale, short_description, why_plant_it, pros_summary, cons_summary, primary_use_cases, notes_for_homestead, notes_for_small_garden, notes_for_container_growing, editorial_summary)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'en', 'Earlier-flowering dill cultivar with large flower heads, useful for pickling, leaves, flowers, and seed.', 'Choose Bouquet when you want a quicker, somewhat more compact dill for pickling heads, seed, and general culinary herb use.', 'Earlier flowering, large blooms, seed/leaf utility, shorter than Mammoth, and useful where the goal is pickling heads.', 'The days-to-maturity values vary by source; early flowering can shorten leaf harvest compared with slower-bolting leaf-focused cultivars.', 'Pickling flower heads, seed production, fresh leaves, culinary herb beds, compact annual insectary planting.', 'Use Bouquet where pickling heads and seed are the goal near orchard guilds; succession sow separate patches for fresh leaves.', 'Use compact or succession plantings; deadhead if self-seeding is not wanted.', 'Works in containers, but use a deep container and direct sow because the taproot dislikes transplant disturbance.', 'Dill is best modeled at species level with cultivar-specific profiles for Bouquet and Mammoth because cultivar choice affects height, days to seed/flower, and use emphasis.')
on conflict (plant_profile_id, locale) do update set
  short_description = excluded.short_description,
  why_plant_it = excluded.why_plant_it,
  pros_summary = excluded.pros_summary,
  cons_summary = excluded.cons_summary,
  primary_use_cases = excluded.primary_use_cases,
  notes_for_homestead = excluded.notes_for_homestead,
  notes_for_small_garden = excluded.notes_for_small_garden,
  notes_for_container_growing = excluded.notes_for_container_growing,
  editorial_summary = excluded.editorial_summary,
  updated_at = now();

insert into catalog.plant_ornamental_profiles (plant_profile_id, evergreen_deciduous, ornamental_season_interest, visual_texture, foliage_color, evergreen_foliage, winter_interest)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'deciduous', array['spring foliage', 'summer flowers', 'seed heads']::text[], 'Fine, feathery foliage with flat yellow umbels when flowering.', 'Green to blue-green', false, false)
on conflict (plant_profile_id) do update set
  evergreen_deciduous = excluded.evergreen_deciduous,
  ornamental_season_interest = excluded.ornamental_season_interest,
  visual_texture = excluded.visual_texture,
  foliage_color = excluded.foliage_color,
  evergreen_foliage = excluded.evergreen_foliage,
  winter_interest = excluded.winter_interest,
  updated_at = now();

insert into catalog.plant_climate_profiles (plant_profile_id, usda_hardiness_min, usda_hardiness_max, ahs_heat_zone_min, ahs_heat_zone_max, cold_tolerance_absolute_f, cold_tolerance_established_f, heat_tolerance_f, humidity_tolerance_code, drought_tolerance_code, flood_tolerance_code, wind_tolerance_code, salt_tolerance_code, chill_hours_min, chill_hours_max, frost_tender, reemergence_after_freeze_behavior, sun_min_hours, sun_max_hours, preferred_light, shade_tolerance_score, afternoon_sun_tolerance_score, reflected_heat_tolerance_score)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), null, null, null, null, null, null, null, 'medium', 'low', 'very_low', 'medium', 'unknown', null, null, true, 'Annual; replant or allow self-sown seedlings rather than expecting perennial return.', 6, 10, 'Full sun.', 3, 5, 3)
on conflict (plant_profile_id) do update set
  usda_hardiness_min = excluded.usda_hardiness_min,
  usda_hardiness_max = excluded.usda_hardiness_max,
  ahs_heat_zone_min = excluded.ahs_heat_zone_min,
  ahs_heat_zone_max = excluded.ahs_heat_zone_max,
  cold_tolerance_absolute_f = excluded.cold_tolerance_absolute_f,
  cold_tolerance_established_f = excluded.cold_tolerance_established_f,
  heat_tolerance_f = excluded.heat_tolerance_f,
  humidity_tolerance_code = excluded.humidity_tolerance_code,
  drought_tolerance_code = excluded.drought_tolerance_code,
  flood_tolerance_code = excluded.flood_tolerance_code,
  wind_tolerance_code = excluded.wind_tolerance_code,
  salt_tolerance_code = excluded.salt_tolerance_code,
  chill_hours_min = excluded.chill_hours_min,
  chill_hours_max = excluded.chill_hours_max,
  frost_tender = excluded.frost_tender,
  reemergence_after_freeze_behavior = excluded.reemergence_after_freeze_behavior,
  sun_min_hours = excluded.sun_min_hours,
  sun_max_hours = excluded.sun_max_hours,
  preferred_light = excluded.preferred_light,
  shade_tolerance_score = excluded.shade_tolerance_score,
  afternoon_sun_tolerance_score = excluded.afternoon_sun_tolerance_score,
  reflected_heat_tolerance_score = excluded.reflected_heat_tolerance_score,
  updated_at = now();

insert into catalog.plant_growth_profiles (plant_profile_id, mature_height_min_in, mature_height_max_in, mature_width_min_in, mature_width_max_in, annual_growth_height_in, annual_growth_width_in, growth_rate_code, growth_habit, root_behavior, spread_aggressiveness, pruning_response, transplant_tolerance, container_tolerance, trellis_needed, support_type)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 24, 36, 12, 18, 48, 18, 'high', 'Compact to medium upright annual dill with early flowers and large seed heads.', 'Taprooted; dislikes root disturbance and is best direct-sown.', 5, 'Harvest foliage regularly; remove flower stalks to delay bolting or leave umbels for seed.', 2, 8, false, null)
on conflict (plant_profile_id) do update set
  mature_height_min_in = excluded.mature_height_min_in,
  mature_height_max_in = excluded.mature_height_max_in,
  mature_width_min_in = excluded.mature_width_min_in,
  mature_width_max_in = excluded.mature_width_max_in,
  annual_growth_height_in = excluded.annual_growth_height_in,
  annual_growth_width_in = excluded.annual_growth_width_in,
  growth_rate_code = excluded.growth_rate_code,
  growth_habit = excluded.growth_habit,
  root_behavior = excluded.root_behavior,
  spread_aggressiveness = excluded.spread_aggressiveness,
  pruning_response = excluded.pruning_response,
  transplant_tolerance = excluded.transplant_tolerance,
  container_tolerance = excluded.container_tolerance,
  trellis_needed = excluded.trellis_needed,
  support_type = excluded.support_type,
  updated_at = now();

insert into catalog.plant_propagation_methods (id, plant_profile_id, planting_method_code, allowed, is_preferred, depth_min_in, depth_max_in, spacing_min_in, spacing_max_in, proliferation_behavior, self_seeds, reseeding_intensity, spreads_by_runners, spreads_by_rhizomes, grafted_common, seed_viability_duration_months, germination_days_min, germination_days_max, cold_stratification_required, scarification_required, rooting_hormone_helpful, transplant_shock_risk_code, establishment_difficulty, notes)
values ('8dc0324f-7ec3-53ea-8db3-f9c96b3e44ea'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'direct_sow', true, true, 0.25, 0.5, 12, 18, 'Early flowering cultivar; direct sow for pickling heads and seed.', true, 5, false, false, false, null, 7, 21, false, false, false, 'high', 2, 'Preferred method because dill taproots dislike transplanting.')
on conflict (plant_profile_id, planting_method_code) do update set
  allowed = excluded.allowed,
  is_preferred = excluded.is_preferred,
  depth_min_in = excluded.depth_min_in,
  depth_max_in = excluded.depth_max_in,
  spacing_min_in = excluded.spacing_min_in,
  spacing_max_in = excluded.spacing_max_in,
  proliferation_behavior = excluded.proliferation_behavior,
  self_seeds = excluded.self_seeds,
  reseeding_intensity = excluded.reseeding_intensity,
  spreads_by_runners = excluded.spreads_by_runners,
  spreads_by_rhizomes = excluded.spreads_by_rhizomes,
  grafted_common = excluded.grafted_common,
  seed_viability_duration_months = excluded.seed_viability_duration_months,
  germination_days_min = excluded.germination_days_min,
  germination_days_max = excluded.germination_days_max,
  cold_stratification_required = excluded.cold_stratification_required,
  scarification_required = excluded.scarification_required,
  rooting_hormone_helpful = excluded.rooting_hormone_helpful,
  transplant_shock_risk_code = excluded.transplant_shock_risk_code,
  establishment_difficulty = excluded.establishment_difficulty,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_propagation_methods (id, plant_profile_id, planting_method_code, allowed, is_preferred, depth_min_in, depth_max_in, spacing_min_in, spacing_max_in, proliferation_behavior, self_seeds, reseeding_intensity, spreads_by_runners, spreads_by_rhizomes, grafted_common, seed_viability_duration_months, germination_days_min, germination_days_max, cold_stratification_required, scarification_required, rooting_hormone_helpful, transplant_shock_risk_code, establishment_difficulty, notes)
values ('01cc6a1f-d377-50f0-b9e1-44677c3cacaa'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'transplant_seedling', true, false, null, null, 12, 18, 'Possible only with care before roots are disturbed.', null, null, false, false, false, null, null, null, false, false, false, 'high', 5, 'Use deep cells or soil blocks only if transplanting is necessary.')
on conflict (plant_profile_id, planting_method_code) do update set
  allowed = excluded.allowed,
  is_preferred = excluded.is_preferred,
  depth_min_in = excluded.depth_min_in,
  depth_max_in = excluded.depth_max_in,
  spacing_min_in = excluded.spacing_min_in,
  spacing_max_in = excluded.spacing_max_in,
  proliferation_behavior = excluded.proliferation_behavior,
  self_seeds = excluded.self_seeds,
  reseeding_intensity = excluded.reseeding_intensity,
  spreads_by_runners = excluded.spreads_by_runners,
  spreads_by_rhizomes = excluded.spreads_by_rhizomes,
  grafted_common = excluded.grafted_common,
  seed_viability_duration_months = excluded.seed_viability_duration_months,
  germination_days_min = excluded.germination_days_min,
  germination_days_max = excluded.germination_days_max,
  cold_stratification_required = excluded.cold_stratification_required,
  scarification_required = excluded.scarification_required,
  rooting_hormone_helpful = excluded.rooting_hormone_helpful,
  transplant_shock_risk_code = excluded.transplant_shock_risk_code,
  establishment_difficulty = excluded.establishment_difficulty,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_flowering_profiles (plant_profile_id, flowering_bool, flower_color, flower_size, bloom_start_week, bloom_end_week, bloom_duration_days, flower_abundance, flower_fragrance_strength, pollinator_value, nectar_value, pollen_value, attracts_bees, attracts_butterflies, attracts_hummingbirds, larval_host, native_pollinator_value)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), true, 'Yellow', 'Large, flat-topped compound umbels', 18, 34, 35, 'High for cultivar; large blooms/seed heads', 3, 7, 6, 5, true, true, false, false, 3)
on conflict (plant_profile_id) do update set
  flowering_bool = excluded.flowering_bool,
  flower_color = excluded.flower_color,
  flower_size = excluded.flower_size,
  bloom_start_week = excluded.bloom_start_week,
  bloom_end_week = excluded.bloom_end_week,
  bloom_duration_days = excluded.bloom_duration_days,
  flower_abundance = excluded.flower_abundance,
  flower_fragrance_strength = excluded.flower_fragrance_strength,
  pollinator_value = excluded.pollinator_value,
  nectar_value = excluded.nectar_value,
  pollen_value = excluded.pollen_value,
  attracts_bees = excluded.attracts_bees,
  attracts_butterflies = excluded.attracts_butterflies,
  attracts_hummingbirds = excluded.attracts_hummingbirds,
  larval_host = excluded.larval_host,
  native_pollinator_value = excluded.native_pollinator_value,
  updated_at = now();

insert into catalog.plant_fruiting_profiles (plant_profile_id, fruiting_bool, fruit_color, fruit_size, fruit_flavor, fruiting_start_age_years, yield_lb_per_plant_year_min, yield_lb_per_plant_year_max, harvest_window_start_week, harvest_window_end_week, fruit_drop_behavior, wildlife_attraction, first_harvest_time_from_planting_days, productive_years_min, productive_years_max, harvest_frequency, preservation_uses, edible_parts, medicinal_parts, fodder_parts)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), true, 'Tan to brown when mature', 'Small dry schizocarps commonly treated as dill seed', 'Aromatic dill/caraway-like seed flavor', 0.15, null, null, 24, 40, 'Seeds drop from mature umbels if not bagged or harvested promptly.', 3, 45, 1, 1, 'Leaves before flowering; flower heads and seeds as early umbels mature.', 'Fresh leaves, dried leaves, dried seed heads, pickling seed heads.', array['leaves', 'flowers', 'seeds']::text[], '{}'::text[], '{}'::text[])
on conflict (plant_profile_id) do update set
  fruiting_bool = excluded.fruiting_bool,
  fruit_color = excluded.fruit_color,
  fruit_size = excluded.fruit_size,
  fruit_flavor = excluded.fruit_flavor,
  fruiting_start_age_years = excluded.fruiting_start_age_years,
  yield_lb_per_plant_year_min = excluded.yield_lb_per_plant_year_min,
  yield_lb_per_plant_year_max = excluded.yield_lb_per_plant_year_max,
  harvest_window_start_week = excluded.harvest_window_start_week,
  harvest_window_end_week = excluded.harvest_window_end_week,
  fruit_drop_behavior = excluded.fruit_drop_behavior,
  wildlife_attraction = excluded.wildlife_attraction,
  first_harvest_time_from_planting_days = excluded.first_harvest_time_from_planting_days,
  productive_years_min = excluded.productive_years_min,
  productive_years_max = excluded.productive_years_max,
  harvest_frequency = excluded.harvest_frequency,
  preservation_uses = excluded.preservation_uses,
  edible_parts = excluded.edible_parts,
  medicinal_parts = excluded.medicinal_parts,
  fodder_parts = excluded.fodder_parts,
  updated_at = now();

insert into catalog.plant_soil_profiles (plant_profile_id, drainage_requirement, organic_matter_preference, compaction_tolerance_code, rocky_soil_tolerance_code, ph_min, ph_max, ph_ideal_min, ph_ideal_max, ph_sensitivity_code, fertility_need, nitrogen_need, phosphorus_need, potassium_need, calcium_sensitivity_code, soil_oxygen_need, mycorrhizal_association_notes, mulch_preference, mulch_depth_preference_in, waterlogging_sensitivity_code, texture_preferences, preferred_soil_texture_codes, soil_texture_summary)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'Moist, well-drained soil; avoid waterlogging.', 'Loamy, vegetable-garden soil preferred, but can tolerate poorer soil if drained.', 'low', 'medium', 5.8, 7.8, 6.0, 7.5, 'low', 'low_to_medium', 'low_to_medium', 'medium', 'medium', 'unknown', 'High enough to protect taproot from wet, anaerobic soil.', null, 'Light mulch after seedlings establish can even moisture without burying crowns.', 1, 'high', '{"loam":{"description":"Best general texture.","suitability":5},"sand":{"description":"Possible with fertility and water support.","suitability":3},"sandy_loam":{"description":"Good when watered consistently.","suitability":4},"silt_loam":{"description":"Good if drainage and airflow are adequate.","suitability":4}}'::jsonb, array['loam', 'sandy_loam', 'silt_loam']::text[], 'Loamy, well-drained garden soil is preferred; poor soils are possible but less ideal.')
on conflict (plant_profile_id) do update set
  drainage_requirement = excluded.drainage_requirement,
  organic_matter_preference = excluded.organic_matter_preference,
  compaction_tolerance_code = excluded.compaction_tolerance_code,
  rocky_soil_tolerance_code = excluded.rocky_soil_tolerance_code,
  ph_min = excluded.ph_min,
  ph_max = excluded.ph_max,
  ph_ideal_min = excluded.ph_ideal_min,
  ph_ideal_max = excluded.ph_ideal_max,
  ph_sensitivity_code = excluded.ph_sensitivity_code,
  fertility_need = excluded.fertility_need,
  nitrogen_need = excluded.nitrogen_need,
  phosphorus_need = excluded.phosphorus_need,
  potassium_need = excluded.potassium_need,
  calcium_sensitivity_code = excluded.calcium_sensitivity_code,
  soil_oxygen_need = excluded.soil_oxygen_need,
  mycorrhizal_association_notes = excluded.mycorrhizal_association_notes,
  mulch_preference = excluded.mulch_preference,
  mulch_depth_preference_in = excluded.mulch_depth_preference_in,
  waterlogging_sensitivity_code = excluded.waterlogging_sensitivity_code,
  texture_preferences = excluded.texture_preferences,
  preferred_soil_texture_codes = excluded.preferred_soil_texture_codes,
  soil_texture_summary = excluded.soil_texture_summary,
  updated_at = now();

insert into catalog.plant_water_profiles (plant_profile_id, water_need_level, drought_tolerance_code, moisture_sensitivity_code, preferred_irrigation_method, root_zone_depth_in, container_water_multiplier, mulched_water_reduction_factor, summer_heat_adjustment_factor)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'medium', 'low', 'medium', 'Water at soil level; keep evenly moist without saturating.', 12, 1.2, 0.9, 1.2)
on conflict (plant_profile_id) do update set
  water_need_level = excluded.water_need_level,
  drought_tolerance_code = excluded.drought_tolerance_code,
  moisture_sensitivity_code = excluded.moisture_sensitivity_code,
  preferred_irrigation_method = excluded.preferred_irrigation_method,
  root_zone_depth_in = excluded.root_zone_depth_in,
  container_water_multiplier = excluded.container_water_multiplier,
  mulched_water_reduction_factor = excluded.mulched_water_reduction_factor,
  summer_heat_adjustment_factor = excluded.summer_heat_adjustment_factor,
  updated_at = now();

insert into catalog.plant_ecology_profiles (plant_profile_id, invasive_risk_code, wildlife_food_value, erosion_control_value, biomass_value, compost_value, chop_drop_value)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'caution', 2, 1, 2, 3, 1)
on conflict (plant_profile_id) do update set
  invasive_risk_code = excluded.invasive_risk_code,
  wildlife_food_value = excluded.wildlife_food_value,
  erosion_control_value = excluded.erosion_control_value,
  biomass_value = excluded.biomass_value,
  compost_value = excluded.compost_value,
  chop_drop_value = excluded.chop_drop_value,
  updated_at = now();

insert into catalog.plant_maintenance_profiles (plant_profile_id, pruning_frequency, deadheading_helpful, division_interval_years, staking_needed, suckering_management, cleanup_intensity, disease_susceptibility_level, pest_susceptibility_level, humidity_disease_risk, air_flow_importance)
values ((select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'Harvest foliage regularly; remove flower stalks to extend leaf production or leave selected umbels for seed.', true, null, false, null, 3, 5, 5, 5, 7)
on conflict (plant_profile_id) do update set
  pruning_frequency = excluded.pruning_frequency,
  deadheading_helpful = excluded.deadheading_helpful,
  division_interval_years = excluded.division_interval_years,
  staking_needed = excluded.staking_needed,
  suckering_management = excluded.suckering_management,
  cleanup_intensity = excluded.cleanup_intensity,
  disease_susceptibility_level = excluded.disease_susceptibility_level,
  pest_susceptibility_level = excluded.pest_susceptibility_level,
  humidity_disease_risk = excluded.humidity_disease_risk,
  air_flow_importance = excluded.air_flow_importance,
  updated_at = now();

insert into catalog.plant_water_establishment_profiles (id, plant_profile_id, week_from_planting_start, week_from_planting_end, gallons_per_week, frequency_per_week, deep_vs_frequent, notes)
values ('cffed6d5-fd6b-508e-a3a2-a2d8a93df99e'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 0, 3, 0.5, 3, 'frequent_light', 'Keep seedbed evenly moist through germination and early seedling establishment.')
on conflict (id) do update set
  gallons_per_week = excluded.gallons_per_week,
  frequency_per_week = excluded.frequency_per_week,
  deep_vs_frequent = excluded.deep_vs_frequent,
  notes = excluded.notes;

insert into catalog.phenology_templates (id, plant_profile_id, region_type, region_value, is_default, notes)
values ('a6ca12da-29ce-53ea-b105-849fc217f38a'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'generic', null, true, 'Generic annual dill timing; use regional windows for local climates.')
on conflict (plant_profile_id, region_type, (coalesce(region_value, '')), is_default) do update set
  notes = excluded.notes,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('f45e0f0d-885c-5389-bf7a-1d445a6ebec9'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'direct_sow', 'Direct sow dill', 'calendar', 'Spring, around 1-2 weeks before last frost in temperate guidance; regional warm climates may use fall/winter windows.', 'calendar', null, null, null, 10, 18, 3, 4, null, 14, 'Soil workable and cool-season window open', 'Direct sow shallowly and thin seedlings after emergence.', 'annual', 'medium', 'Late heat can shorten leaf harvest and accelerate bolting.', 55, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('1203aa94-b08a-5cca-9f43-63187025b6f9'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'harvest', 'Harvest dill leaves', 'plant_observation', 'Plants have enough foliage to cut without stripping', 'event_offset', null, null, null, 16, 34, 4, 8, 35, 7, 'Fine foliage present before heavy flowering', 'Cut outer foliage in the morning for fresh use.', 'during active growth', 'low', 'Leaves decline after bolting.', 35, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('00116804-671a-5e00-b4cf-0cf55cdab898'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'seed_set', 'Harvest seed heads', 'plant_observation', 'Fruiting tops fully developed but not fully brown', 'event_offset', null, null, null, 24, 40, 6, 10, 65, null, 'Seed heads heavy and turning color', 'Cut heads with stem, cure in shade or bag to collect seeds.', 'annual', 'medium', 'Seed drops and self-sows.', 50, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.plant_zone_profiles (id, plant_profile_id, region_type, region_value, usda_zone_min, usda_zone_max, planting_window_start_week, planting_window_end_week, harvest_window_start_week, harvest_window_end_week, bloom_window_start_week, bloom_window_end_week, dieback_window_start_week, reemergence_window_start_week, proliferation_behavior, maintenance_timing_notes, seasonal_risk_notes)
values ('0f153598-043c-5952-968b-29430f307cb0'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'generic', null, null, null, 10, 18, 16, 40, 20, 36, 36, null, 'Annual that can self-sow from dropped seed.', 'Succession sow every two weeks for leaf continuity; leave selected plants to flower for seed and beneficial insects.', 'Heat and flowering shorten leaf-harvest quality; humid sites need airflow.')
on conflict (plant_profile_id, region_type, (coalesce(region_value, ''))) do update set
  usda_zone_min = excluded.usda_zone_min,
  usda_zone_max = excluded.usda_zone_max,
  planting_window_start_week = excluded.planting_window_start_week,
  planting_window_end_week = excluded.planting_window_end_week,
  harvest_window_start_week = excluded.harvest_window_start_week,
  harvest_window_end_week = excluded.harvest_window_end_week,
  bloom_window_start_week = excluded.bloom_window_start_week,
  bloom_window_end_week = excluded.bloom_window_end_week,
  dieback_window_start_week = excluded.dieback_window_start_week,
  reemergence_window_start_week = excluded.reemergence_window_start_week,
  proliferation_behavior = excluded.proliferation_behavior,
  maintenance_timing_notes = excluded.maintenance_timing_notes,
  seasonal_risk_notes = excluded.seasonal_risk_notes,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('6979522d-bb72-596a-be34-8e4d3d17fdb3'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'direct_sow', 'plant', 'lifecycle', 'Direct sow dill', 'Sow dill shallowly in place and thin seedlings; avoid transplanting when possible.', 'FREQ=YEARLY', 0, 14, 'medium', true, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('995d6469-ff6f-5d25-804f-357ace2ec4d6'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'maintenance', 'plant', 'maintenance', 'Succession sow dill', 'Sow another small patch every two weeks if steady leaf harvest is desired.', 'FREQ=WEEKLY;INTERVAL=2', 0, 7, 'low', false, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('9ab1ba48-da5f-5805-98e2-9223fa268292'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'harvest', 'harvest', 'lifecycle', 'Harvest dill leaves', 'Cut fresh foliage before heavy flowering for best leaf use.', 'FREQ=WEEKLY;INTERVAL=1', 0, 5, 'low', false, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('e758b0a7-6b86-587d-a6d8-245ce65210a7'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'seed_set', 'harvest', 'lifecycle', 'Harvest dill seed heads', 'Cut seed heads once fruiting tops are developed but before seed drop.', 'FREQ=YEARLY', 0, 10, 'medium', true, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('de7a32ad-6259-588c-98fa-328ed803d2ce'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'human', 'safe', '{}'::text[], 'Leaves, flowers, and seeds are treated as edible culinary parts in the sourced profile.', null, 'extension', 'Use culinary quantities; do not infer medicinal dosing from this profile.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('42c015bc-78c6-5b4b-84d0-1ca4eaaca53f'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'dog', 'unknown', '{}'::text[], 'Pet safety not curated in this pass.', null, 'curation_needed', 'Avoid pet-safety claims until a veterinary source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('c3a874b8-ae7a-53ce-8d83-2f26f515d7ac'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'cat', 'unknown', '{}'::text[], 'Pet safety not curated in this pass.', null, 'curation_needed', 'Avoid pet-safety claims until a veterinary source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('99e5d122-eadd-5e8b-a464-5a5f7411fdd1'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'chicken', 'unknown', '{}'::text[], 'Poultry safety not curated in this pass.', null, 'curation_needed', 'Avoid poultry-safety claims until a livestock source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('8cb3677e-6a74-50aa-a5e6-a89948e520d4'::uuid, 'NC State Extension Gardener Plant Toolbox: Anethum graveolens', 'extension', 'North Carolina State Extension', null, 'https://plants.ces.ncsu.edu/plants/anethum-graveolens/', 'NC State Extension Gardener Plant Toolbox profile for Anethum graveolens.', null, 0.86, null, 'Used for botanical identity, edible parts, images, and general profile context.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'University of Delaware Cooperative Extension: Dill', 'extension', 'University of Delaware Cooperative Extension', 'New Castle County Master Gardeners Rick Judd and Gail Hermenaus', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', 'University of Delaware Cooperative Extension dill fact sheet, October 2024.', '2024-10-01', 0.88, null, 'Used for sun, soil, annual lifecycle, container suitability, cultivar notes, pests, and diseases.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Illinois Extension: Dill', 'extension', 'University of Illinois Extension', null, 'https://extension.illinois.edu/herbs/dill', 'Illinois Extension herb profile for dill.', null, 0.88, null, 'Used for direct-sow guidance, taproot transplant sensitivity, self-seeding, harvesting, and popular cultivar positioning.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('2f1e9ed4-0bf3-56cf-afe4-ee1ecad16d27'::uuid, 'UF/IFAS Extension: Dill, Anethum graveolens L.', 'extension', 'University of Florida IFAS Extension', 'James M. Stephens', 'https://www.growables.org/informationVeg/documents/Dill.pdf', 'UF/IFAS Extension HS593 Dill fact sheet.', null, 0.86, null, 'Used for sowing depth, thinning, Florida planting timing, height, Long Island Mammoth maturity, and seed harvest guidance.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('fdaf6227-658b-5c93-bb0c-79c9776811b5'::uuid, 'Garden.io March 2026 starter workbook', 'internal_curation', 'Garden.io', null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07', null, 0.3, null, 'Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Notes: Planned northwest of trunk, alternating with bee balm.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('65d386b7-275d-59ca-8e87-04335a38a8dc'::uuid, 'SeedStore: Bouquet Dill Seeds', 'other', 'SeedStore.com', null, 'https://www.seedstore.com/catalog/dill-seeds/bouquet-dill-seeds-151.html', 'SeedStore Bouquet Dill Seeds product profile.', null, 0.55, null, 'Used for Bouquet height, spacing, sow depth, full sun, and seed/leaf production claims; vendor source, lower evidence strength than extension.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('56b1bd98-14ba-5036-965e-5ad7fca6494f'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'taxonomy.botanical_identity', '{"botanical_name_full":"Anethum graveolens","family_name":"Apiaceae"}'::jsonb, 'strong', 0.9, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Anethum graveolens, Dill; Apiaceae family.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('6e6033a3-fe7f-50fd-9b95-438e3d80507f'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'climate.light_requirement', '{"preferred_light":"full sun","sun_min_hours":6}'::jsonb, 'strong', 0.88, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Sunlight: full sun.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('53c58054-496e-5bac-980f-dbc38eae30a4'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'soil.drainage_requirement', '{"poor_soil_tolerance":true,"soil":"loamy, well drained"}'::jsonb, 'strong', 0.86, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Grows best in loamy, well drained soil but can grow in poor soil.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('c5f33068-f164-5679-ac22-7d17aa32a23a'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'propagation.direct_sow', '{"depth_max_in":0.5,"depth_min_in":0.25,"preferred":true,"reason":"taproot transplant sensitivity"}'::jsonb, 'strong', 0.87, 1, 1, 'e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Dill does best when it is directly sown.', 'https://extension.illinois.edu/herbs/dill', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('bee3ce06-03cf-5d5a-99d2-63a5510abc00'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'growth.self_seeding', '{"management":"deadhead or harvest seed heads to reduce self-sowing","self_seeds":true}'::jsonb, 'strong', 0.82, 1, 1, 'e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Dill reseeds readily.', 'https://extension.illinois.edu/herbs/dill', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('95c22688-f68d-5ea8-ae19-bfadc58713c7'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'maintenance.pests_diseases', '{"diseases":["downy mildew","powdery mildew"],"pests":["aphids","army worm","cut worm"]}'::jsonb, 'moderate', 0.78, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Common pests and diseases include downy mildew, powdery mildew, aphids, army worm, and cut worm.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('4963b21d-f931-52d2-a905-13acb0d00303'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'fruiting.edible_parts', '{"edible_parts":["leaves","flowers","seeds"],"seed_harvest":"fruiting tops fully developed but not brown"}'::jsonb, 'strong', 0.86, 1, 1, '2f1e9ed4-0bf3-56cf-afe4-ee1ecad16d27'::uuid, 'Dried or freshly chopped dill leaves are used... fruiting tops may be used either fresh or dried.', 'https://www.growables.org/informationVeg/documents/Dill.pdf', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('7962dbd4-8ed9-55d0-b407-69113498d6ff'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'profile.workbook_presence', '{"bed_name":"Orchard A Companion Guild Layer","catalog_slug":"dill","notes":"Planned northwest of trunk, alternating with bee balm.","plant_name":"Dill","sheet_name":"wishlist","zone_name":"Orchard A (West Orchard)"}'::jsonb, 'unknown', 0.3, 1, 1, 'fdaf6227-658b-5c93-bb0c-79c9776811b5'::uuid, 'Planned northwest of trunk, alternating with bee balm.', null, false, 'needs_more_evidence', 'Preston property plan', null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('4d46abfe-1aa0-5741-ba41-61b981359d15'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'cultivar.days_to_maturity', '{"extension_days":45,"interpretation":"Treat as source conflict; use 45 days as early-flowering signal and keep vendor 85-day full seed maturity as lower-confidence.","vendor_days":85}'::jsonb, 'moderate', 0.62, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Bouquet (45 days) Early flowering, large blooms, good for pickling.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'needs_more_evidence', null, 'Bouquet', false, false, true, 'Seed vendor lists 85 days; extension lists 45 days.')
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('8d3346c8-6da1-5bd9-ae2b-921cb8693e0b'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'cultivar.mature_size', '{"mature_height_max_in":36,"mature_height_min_in":24,"spacing_in":18}'::jsonb, 'weak', 0.68, 1, 1, '65d386b7-275d-59ca-8e87-04335a38a8dc'::uuid, 'Plant Height: 2-3 feet; Plant Spacing: 18 inches.', 'https://www.seedstore.com/catalog/dill-seeds/bouquet-dill-seeds-151.html', false, 'approved', null, 'Bouquet', false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('b926ca10-84e2-5fa4-ac46-3c7e65ba7d49'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'cultivar.use_emphasis', '{"flowering_behavior":"early flowering large blooms","primary_use":["pickling","leaf","seed"]}'::jsonb, 'moderate', 0.76, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Early flowering, large blooms, good for pickling.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, 'Bouquet', false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('2f986016-85a3-5ae3-abc1-8c430f61ace4'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'sun_need', 4, 'Full sun crop; best leaf and seed production needs strong direct light.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('6974724f-0936-542a-8a96-9627b12ecabf'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'shade_tolerance', 2, 'Can tolerate light relief in hot weather, but shade reduces performance.', 'weak', 0.58, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('d88c4138-7454-5f3e-9941-753f7077660d'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'afternoon_sun_tolerance', 3, 'Handles full sun when soil moisture is even; hot weather speeds bolting.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('0c40b0f1-5f77-5e1f-a584-195a20b4fe77'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'water_need', 3, 'Medium water need; moist, well-drained soil is preferred.', 'strong', 0.84, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('60f96aef-353b-56e9-90c4-3c4a8c363a5c'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'drought_tolerance', 2, 'Not a true drought herb; dry stress accelerates decline and bolting.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('573508b9-bb24-5002-a376-000ea2e4d1d0'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'wet_feet_tolerance', 1, 'Requires drainage and is not suited to waterlogged soil.', 'strong', 0.84, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('eeed0fa7-9d8f-50e9-aa32-94c8e551ff84'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'soil_drainage_need', 4, 'Well-drained soil is consistently recommended.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('b52231cd-84c4-5376-8cd4-a5ae25f3989f'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'soil_fertility_need', 2, 'Can grow in poor soil but performs best in loamy soil.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('4d80a418-f060-5fb9-83d4-5ca036d176ac'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'soil_compaction_tolerance', 2, 'Taproot and direct-sow preference imply low tolerance for compaction/disturbance.', 'weak', 0.58, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('8250a49e-26a6-5759-928b-905b2f24f5d9'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'soil_texture_flexibility', 4, 'Tolerates vegetable-garden soils when drainage is adequate.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('1291d870-9400-57b5-bc3d-296796162ad1'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'maintenance_need', 2, 'Easy, but choose whether to harvest or deadhead seed heads.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('f991ae39-0c6c-5297-887a-0cc5bc18ed08'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'beginner_friendliness', 4, 'Easy direct-sown herb if not transplanted and succession-sown.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('7b0d59cc-b73e-5c10-8de9-56822daa8520'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'spread_aggressiveness', 3, 'Early flowering and seed heads mean self-seeding must be managed.', 'moderate', 0.78, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('8112989a-aa31-52d4-b743-f412523410a4'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'container_suitability', 4, 'More compact than Mammoth and usable in containers if direct-sown.', 'strong', 0.82, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('19eaba3c-e6ee-53d8-bd89-43c3418331eb'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'transplant_tolerance', 1, 'Taproot makes transplanting difficult; direct sow is preferred.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('1d411d6f-9460-5a5b-af7c-62089020320b'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'pollinator_value', 4, 'Umbel flowers provide insect/pollinator value.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('1ea61f4d-27c0-5677-9501-b54848ba76b0'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'wildlife_food_value', 2, 'Not primarily grown as wildlife food; value is mostly insect floral resource.', 'weak', 0.5, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('003908dd-a663-50e8-af06-79c0cd424747'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'erosion_control_value', 1, 'Annual herb with limited soil-stabilizing role.', 'weak', 0.45, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('2be10964-d46e-5024-88cd-036aec7461f6'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'biomass_value', 2, 'Moderate annual foliage but not a major biomass plant.', 'weak', 0.5, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('4b28f521-1ad1-57dd-ba8d-81a2ece2786e'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'invasive_risk', 2, 'Self-seeds readily but is generally manageable in garden context.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('cd142359-846f-5685-8f5d-a0c0ae992a7e'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'disease_susceptibility', 3, 'Downy mildew and powdery mildew are listed concerns.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('6710e79f-3e3c-5f42-9316-9f6ec642d8dd'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'pest_susceptibility', 3, 'Aphids, army worm, and cut worm are listed concerns.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('64b71ac1-6254-5bcc-ae0c-9cc4a27bde2b'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'humidity_disease_risk', 3, 'Mildew risk makes airflow and spacing relevant in humid sites.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('cd040821-dc16-5e43-a9ae-34e7292e5e59'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'deer_resistance', 3, 'Aromatic foliage may help, but source support is cultivar/vendor-level and context dependent.', 'weak', 0.48, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('596def31-68f5-5a3c-ba61-84b18aa37823'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), 'rabbit_resistance', 2, 'No strong source-backed resistance claim; treat as vulnerable until observed.', 'unknown', 0.35, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)
values ('a17a7de9-ef9c-5016-ac95-58e697c1e282'::uuid, (select id from catalog.plant_profiles where slug = 'bouquet-dill' and deleted_at is null), null, 'flowering', '/art/specimen-herbarium-sheet.svg', 'art/specimen-herbarium-sheet.svg', 'image/svg+xml', null, null, 'Garden.io placeholder specimen illustration', 'internal placeholder', true, true)
on conflict (id) do update set
  source_id = excluded.source_id,
  stage_code = excluded.stage_code,
  image_url = excluded.image_url,
  storage_key = excluded.storage_key,
  mime_type = excluded.mime_type,
  width_px = excluded.width_px,
  height_px = excluded.height_px,
  attribution_text = excluded.attribution_text,
  license = excluded.license,
  is_primary = excluded.is_primary,
  is_public = excluded.is_public,
  updated_at = now();

-- dill
insert into catalog.plant_taxa (
  id, kingdom_name, family_name, genus_name, species_name, subspecies_name, variety_name,
  botanical_name_full, taxon_rank, native_range, origin_type
) values (
  '70d2e20b-a682-590d-bc17-d7395d00da0e'::uuid, 'Plantae', 'Apiaceae', 'Anethum', 'graveolens', null, null, 'Anethum graveolens', 'species', 'Asia and Mediterranean/western Asian region; exact origin varies by source framing.', 'exotic'
)
on conflict ((lower(genus_name)), (coalesce(lower(species_name), '')), (coalesce(lower(subspecies_name), '')), (coalesce(lower(variety_name), ''))) do update set
  kingdom_name = excluded.kingdom_name,
  family_name = excluded.family_name,
  genus_name = excluded.genus_name,
  species_name = excluded.species_name,
  subspecies_name = excluded.subspecies_name,
  variety_name = excluded.variety_name,
  botanical_name_full = excluded.botanical_name_full,
  taxon_rank = excluded.taxon_rank,
  native_range = excluded.native_range,
  origin_type = excluded.origin_type,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Dill', 'common', 'en', true)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Anethum graveolens', 'latin_variant', 'en', false)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Dillweed', 'common', 'en', false)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_profiles (
  id, plant_taxon_id, plant_cultivar_id, slug, display_name, plant_type_code, lifecycle_type,
  confidence_score, evidence_count, source_count, source_last_reviewed_at,
  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,
  is_ai_generated, generation_status, is_published, review_status
) values (
  'b5d84b22-3aa8-5892-b9fc-56aeeb5594c9'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), null, 'dill', 'Dill', 'herb', 'annual', 0.84, 8, 4, '2026-06-03T00:00:00+00:00', true, false, false, 'Florida/fall planting timing differs from temperate spring timing; keep phenology regionalized.', true, 'ai_reviewed', true, 'pending_review'
)
on conflict (slug) where deleted_at is null do update set
  plant_taxon_id = excluded.plant_taxon_id,
  plant_cultivar_id = excluded.plant_cultivar_id,
  slug = excluded.slug,
  display_name = excluded.display_name,
  plant_type_code = excluded.plant_type_code,
  lifecycle_type = excluded.lifecycle_type,
  confidence_score = excluded.confidence_score,
  evidence_count = excluded.evidence_count,
  source_count = excluded.source_count,
  source_last_reviewed_at = excluded.source_last_reviewed_at,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  is_ai_generated = excluded.is_ai_generated,
  generation_status = excluded.generation_status,
  is_published = excluded.is_published,
  review_status = excluded.review_status,
  updated_at = now();

insert into catalog.plant_profile_aesthetic_styles (id, plant_profile_id, style_code, weight_score)
values ('0c9fc98b-1076-531f-ae2e-07347328b6df'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'cottage', 6)
on conflict (plant_profile_id, style_code) do update set
  weight_score = excluded.weight_score;

insert into catalog.plant_profile_aesthetic_styles (id, plant_profile_id, style_code, weight_score)
values ('e1934fc6-ff0f-5763-951c-1225dbef1b7c'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'edible_landscape', 8)
on conflict (plant_profile_id, style_code) do update set
  weight_score = excluded.weight_score;

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('e24b07b8-694c-5968-8715-b032a211a69a'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'culinary', 'strong', true, 'Leaves, flowers, and seeds are edible and used fresh, dried, or in pickling.', 'Fresh herb, seed spice, pickling', null, null, 'Use leaves fresh; harvest seed heads as fruiting tops mature.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('d1176c5b-7999-5eb7-ab6a-6629746110ed'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'pollinator_support', 'moderate', true, 'Flat yellow umbels provide small-flower insect forage.', 'Beneficial insect/pollinator resource', null, null, 'Allow some plants to bloom if pollinator value is desired.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('a757e5de-f7ca-540a-9eae-dd3acf8c8ec0'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'cut_flower', 'weak', true, 'Umbels and scented foliage can be cut for arrangements or pickling jars.', 'Cut scented foliage/flower heads', null, null, 'More relevant for Mammoth and Bouquet than compact leaf cultivars.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_narratives (plant_profile_id, locale, short_description, why_plant_it, pros_summary, cons_summary, primary_use_cases, notes_for_homestead, notes_for_small_garden, notes_for_container_growing, editorial_summary)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'en', 'Fast-growing annual culinary herb with fine blue-green foliage, yellow umbels, edible leaves, flowers, and seeds.', 'Grow dill for fresh leaves, seed heads for pickling, beneficial insect flowers, and easy succession-sown herb production.', 'Easy from seed, useful in containers, edible leaves and seeds, attracts beneficial insects, and self-seeds if allowed.', 'Taproot resents transplanting, plants decline after flowering, can self-sow, and humid conditions may bring mildew or aphid pressure.', 'Fresh herb, pickling seed heads, culinary seed, pollinator/insectary annual, orchard-guild annual companion layer.', 'Direct-sow near orchard guild edges or herb beds and repeat sow every 2 weeks for steady leaf harvest. Let selected plants flower for seed and beneficial insects.', 'Use compact or succession plantings; deadhead if self-seeding is not wanted.', 'Works in containers, but use a deep container and direct sow because the taproot dislikes transplant disturbance.', 'Dill is best modeled at species level with cultivar-specific profiles for Bouquet and Mammoth because cultivar choice affects height, days to seed/flower, and use emphasis.')
on conflict (plant_profile_id, locale) do update set
  short_description = excluded.short_description,
  why_plant_it = excluded.why_plant_it,
  pros_summary = excluded.pros_summary,
  cons_summary = excluded.cons_summary,
  primary_use_cases = excluded.primary_use_cases,
  notes_for_homestead = excluded.notes_for_homestead,
  notes_for_small_garden = excluded.notes_for_small_garden,
  notes_for_container_growing = excluded.notes_for_container_growing,
  editorial_summary = excluded.editorial_summary,
  updated_at = now();

insert into catalog.plant_ornamental_profiles (plant_profile_id, evergreen_deciduous, ornamental_season_interest, visual_texture, foliage_color, evergreen_foliage, winter_interest)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'deciduous', array['spring foliage', 'summer flowers', 'seed heads']::text[], 'Fine, feathery foliage with flat yellow umbels when flowering.', 'Green to blue-green', false, false)
on conflict (plant_profile_id) do update set
  evergreen_deciduous = excluded.evergreen_deciduous,
  ornamental_season_interest = excluded.ornamental_season_interest,
  visual_texture = excluded.visual_texture,
  foliage_color = excluded.foliage_color,
  evergreen_foliage = excluded.evergreen_foliage,
  winter_interest = excluded.winter_interest,
  updated_at = now();

insert into catalog.plant_climate_profiles (plant_profile_id, usda_hardiness_min, usda_hardiness_max, ahs_heat_zone_min, ahs_heat_zone_max, cold_tolerance_absolute_f, cold_tolerance_established_f, heat_tolerance_f, humidity_tolerance_code, drought_tolerance_code, flood_tolerance_code, wind_tolerance_code, salt_tolerance_code, chill_hours_min, chill_hours_max, frost_tender, reemergence_after_freeze_behavior, sun_min_hours, sun_max_hours, preferred_light, shade_tolerance_score, afternoon_sun_tolerance_score, reflected_heat_tolerance_score)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, null, null, null, null, null, null, 'medium', 'low', 'very_low', 'medium', 'unknown', null, null, true, 'Annual; replant or allow self-sown seedlings rather than expecting perennial return.', 6, 10, 'Full sun.', 3, 5, 3)
on conflict (plant_profile_id) do update set
  usda_hardiness_min = excluded.usda_hardiness_min,
  usda_hardiness_max = excluded.usda_hardiness_max,
  ahs_heat_zone_min = excluded.ahs_heat_zone_min,
  ahs_heat_zone_max = excluded.ahs_heat_zone_max,
  cold_tolerance_absolute_f = excluded.cold_tolerance_absolute_f,
  cold_tolerance_established_f = excluded.cold_tolerance_established_f,
  heat_tolerance_f = excluded.heat_tolerance_f,
  humidity_tolerance_code = excluded.humidity_tolerance_code,
  drought_tolerance_code = excluded.drought_tolerance_code,
  flood_tolerance_code = excluded.flood_tolerance_code,
  wind_tolerance_code = excluded.wind_tolerance_code,
  salt_tolerance_code = excluded.salt_tolerance_code,
  chill_hours_min = excluded.chill_hours_min,
  chill_hours_max = excluded.chill_hours_max,
  frost_tender = excluded.frost_tender,
  reemergence_after_freeze_behavior = excluded.reemergence_after_freeze_behavior,
  sun_min_hours = excluded.sun_min_hours,
  sun_max_hours = excluded.sun_max_hours,
  preferred_light = excluded.preferred_light,
  shade_tolerance_score = excluded.shade_tolerance_score,
  afternoon_sun_tolerance_score = excluded.afternoon_sun_tolerance_score,
  reflected_heat_tolerance_score = excluded.reflected_heat_tolerance_score,
  updated_at = now();

insert into catalog.plant_growth_profiles (plant_profile_id, mature_height_min_in, mature_height_max_in, mature_width_min_in, mature_width_max_in, annual_growth_height_in, annual_growth_width_in, growth_rate_code, growth_habit, root_behavior, spread_aggressiveness, pruning_response, transplant_tolerance, container_tolerance, trellis_needed, support_type)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 24, 48, 12, 24, 48, 18, 'high', 'Upright annual herb with hollow stems, fine foliage, taproot, and terminal umbels.', 'Taprooted; dislikes root disturbance and is best direct-sown.', 5, 'Harvest foliage regularly; remove flower stalks to delay bolting or leave umbels for seed.', 2, 8, false, null)
on conflict (plant_profile_id) do update set
  mature_height_min_in = excluded.mature_height_min_in,
  mature_height_max_in = excluded.mature_height_max_in,
  mature_width_min_in = excluded.mature_width_min_in,
  mature_width_max_in = excluded.mature_width_max_in,
  annual_growth_height_in = excluded.annual_growth_height_in,
  annual_growth_width_in = excluded.annual_growth_width_in,
  growth_rate_code = excluded.growth_rate_code,
  growth_habit = excluded.growth_habit,
  root_behavior = excluded.root_behavior,
  spread_aggressiveness = excluded.spread_aggressiveness,
  pruning_response = excluded.pruning_response,
  transplant_tolerance = excluded.transplant_tolerance,
  container_tolerance = excluded.container_tolerance,
  trellis_needed = excluded.trellis_needed,
  support_type = excluded.support_type,
  updated_at = now();

insert into catalog.plant_propagation_methods (id, plant_profile_id, planting_method_code, allowed, is_preferred, depth_min_in, depth_max_in, spacing_min_in, spacing_max_in, proliferation_behavior, self_seeds, reseeding_intensity, spreads_by_runners, spreads_by_rhizomes, grafted_common, seed_viability_duration_months, germination_days_min, germination_days_max, cold_stratification_required, scarification_required, rooting_hormone_helpful, transplant_shock_risk_code, establishment_difficulty, notes)
values ('6bef1f06-a16f-5c34-adb5-cb08de9fed65'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'direct_sow', true, true, 0.25, 0.5, 12, 18, 'Direct sow before/around last frost in temperate spring timing or in regional cool-season windows; self-seeds if seed heads are left.', true, 5, false, false, false, null, 7, 21, false, false, false, 'high', 2, 'Preferred method because dill taproots dislike transplanting.')
on conflict (plant_profile_id, planting_method_code) do update set
  allowed = excluded.allowed,
  is_preferred = excluded.is_preferred,
  depth_min_in = excluded.depth_min_in,
  depth_max_in = excluded.depth_max_in,
  spacing_min_in = excluded.spacing_min_in,
  spacing_max_in = excluded.spacing_max_in,
  proliferation_behavior = excluded.proliferation_behavior,
  self_seeds = excluded.self_seeds,
  reseeding_intensity = excluded.reseeding_intensity,
  spreads_by_runners = excluded.spreads_by_runners,
  spreads_by_rhizomes = excluded.spreads_by_rhizomes,
  grafted_common = excluded.grafted_common,
  seed_viability_duration_months = excluded.seed_viability_duration_months,
  germination_days_min = excluded.germination_days_min,
  germination_days_max = excluded.germination_days_max,
  cold_stratification_required = excluded.cold_stratification_required,
  scarification_required = excluded.scarification_required,
  rooting_hormone_helpful = excluded.rooting_hormone_helpful,
  transplant_shock_risk_code = excluded.transplant_shock_risk_code,
  establishment_difficulty = excluded.establishment_difficulty,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_propagation_methods (id, plant_profile_id, planting_method_code, allowed, is_preferred, depth_min_in, depth_max_in, spacing_min_in, spacing_max_in, proliferation_behavior, self_seeds, reseeding_intensity, spreads_by_runners, spreads_by_rhizomes, grafted_common, seed_viability_duration_months, germination_days_min, germination_days_max, cold_stratification_required, scarification_required, rooting_hormone_helpful, transplant_shock_risk_code, establishment_difficulty, notes)
values ('3f621413-e577-5123-8fe8-016eed8d684a'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'transplant_seedling', true, false, null, null, 12, 18, 'Possible only with care before roots are disturbed.', null, null, false, false, false, null, null, null, false, false, false, 'high', 5, 'Use deep cells or soil blocks only if transplanting is necessary.')
on conflict (plant_profile_id, planting_method_code) do update set
  allowed = excluded.allowed,
  is_preferred = excluded.is_preferred,
  depth_min_in = excluded.depth_min_in,
  depth_max_in = excluded.depth_max_in,
  spacing_min_in = excluded.spacing_min_in,
  spacing_max_in = excluded.spacing_max_in,
  proliferation_behavior = excluded.proliferation_behavior,
  self_seeds = excluded.self_seeds,
  reseeding_intensity = excluded.reseeding_intensity,
  spreads_by_runners = excluded.spreads_by_runners,
  spreads_by_rhizomes = excluded.spreads_by_rhizomes,
  grafted_common = excluded.grafted_common,
  seed_viability_duration_months = excluded.seed_viability_duration_months,
  germination_days_min = excluded.germination_days_min,
  germination_days_max = excluded.germination_days_max,
  cold_stratification_required = excluded.cold_stratification_required,
  scarification_required = excluded.scarification_required,
  rooting_hormone_helpful = excluded.rooting_hormone_helpful,
  transplant_shock_risk_code = excluded.transplant_shock_risk_code,
  establishment_difficulty = excluded.establishment_difficulty,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_flowering_profiles (plant_profile_id, flowering_bool, flower_color, flower_size, bloom_start_week, bloom_end_week, bloom_duration_days, flower_abundance, flower_fragrance_strength, pollinator_value, nectar_value, pollen_value, attracts_bees, attracts_butterflies, attracts_hummingbirds, larval_host, native_pollinator_value)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), true, 'Yellow', 'Large, flat-topped compound umbels', 20, 36, 35, 'Moderate to high after bolting', 3, 7, 6, 5, true, true, false, false, 3)
on conflict (plant_profile_id) do update set
  flowering_bool = excluded.flowering_bool,
  flower_color = excluded.flower_color,
  flower_size = excluded.flower_size,
  bloom_start_week = excluded.bloom_start_week,
  bloom_end_week = excluded.bloom_end_week,
  bloom_duration_days = excluded.bloom_duration_days,
  flower_abundance = excluded.flower_abundance,
  flower_fragrance_strength = excluded.flower_fragrance_strength,
  pollinator_value = excluded.pollinator_value,
  nectar_value = excluded.nectar_value,
  pollen_value = excluded.pollen_value,
  attracts_bees = excluded.attracts_bees,
  attracts_butterflies = excluded.attracts_butterflies,
  attracts_hummingbirds = excluded.attracts_hummingbirds,
  larval_host = excluded.larval_host,
  native_pollinator_value = excluded.native_pollinator_value,
  updated_at = now();

insert into catalog.plant_fruiting_profiles (plant_profile_id, fruiting_bool, fruit_color, fruit_size, fruit_flavor, fruiting_start_age_years, yield_lb_per_plant_year_min, yield_lb_per_plant_year_max, harvest_window_start_week, harvest_window_end_week, fruit_drop_behavior, wildlife_attraction, first_harvest_time_from_planting_days, productive_years_min, productive_years_max, harvest_frequency, preservation_uses, edible_parts, medicinal_parts, fodder_parts)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), true, 'Tan to brown when mature', 'Small dry schizocarps commonly treated as dill seed', 'Aromatic dill/caraway-like seed flavor', 0.15, null, null, 24, 40, 'Seeds drop from mature umbels if not bagged or harvested promptly.', 3, 45, 1, 1, 'Leaves as needed before bolting; seed heads when fruit is developed but before fully brown.', 'Fresh leaves, dried leaves, dried seed heads, pickling seed heads.', array['leaves', 'flowers', 'seeds']::text[], '{}'::text[], '{}'::text[])
on conflict (plant_profile_id) do update set
  fruiting_bool = excluded.fruiting_bool,
  fruit_color = excluded.fruit_color,
  fruit_size = excluded.fruit_size,
  fruit_flavor = excluded.fruit_flavor,
  fruiting_start_age_years = excluded.fruiting_start_age_years,
  yield_lb_per_plant_year_min = excluded.yield_lb_per_plant_year_min,
  yield_lb_per_plant_year_max = excluded.yield_lb_per_plant_year_max,
  harvest_window_start_week = excluded.harvest_window_start_week,
  harvest_window_end_week = excluded.harvest_window_end_week,
  fruit_drop_behavior = excluded.fruit_drop_behavior,
  wildlife_attraction = excluded.wildlife_attraction,
  first_harvest_time_from_planting_days = excluded.first_harvest_time_from_planting_days,
  productive_years_min = excluded.productive_years_min,
  productive_years_max = excluded.productive_years_max,
  harvest_frequency = excluded.harvest_frequency,
  preservation_uses = excluded.preservation_uses,
  edible_parts = excluded.edible_parts,
  medicinal_parts = excluded.medicinal_parts,
  fodder_parts = excluded.fodder_parts,
  updated_at = now();

insert into catalog.plant_soil_profiles (plant_profile_id, drainage_requirement, organic_matter_preference, compaction_tolerance_code, rocky_soil_tolerance_code, ph_min, ph_max, ph_ideal_min, ph_ideal_max, ph_sensitivity_code, fertility_need, nitrogen_need, phosphorus_need, potassium_need, calcium_sensitivity_code, soil_oxygen_need, mycorrhizal_association_notes, mulch_preference, mulch_depth_preference_in, waterlogging_sensitivity_code, texture_preferences, preferred_soil_texture_codes, soil_texture_summary)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'Moist, well-drained soil; avoid waterlogging.', 'Loamy, vegetable-garden soil preferred, but can tolerate poorer soil if drained.', 'low', 'medium', 5.8, 7.8, 6.0, 7.5, 'low', 'low_to_medium', 'low_to_medium', 'medium', 'medium', 'unknown', 'High enough to protect taproot from wet, anaerobic soil.', null, 'Light mulch after seedlings establish can even moisture without burying crowns.', 1, 'high', '{"loam":{"description":"Best general texture.","suitability":5},"sand":{"description":"Possible with fertility and water support.","suitability":3},"sandy_loam":{"description":"Good when watered consistently.","suitability":4},"silt_loam":{"description":"Good if drainage and airflow are adequate.","suitability":4}}'::jsonb, array['loam', 'sandy_loam', 'silt_loam']::text[], 'Loamy, well-drained garden soil is preferred; poor soils are possible but less ideal.')
on conflict (plant_profile_id) do update set
  drainage_requirement = excluded.drainage_requirement,
  organic_matter_preference = excluded.organic_matter_preference,
  compaction_tolerance_code = excluded.compaction_tolerance_code,
  rocky_soil_tolerance_code = excluded.rocky_soil_tolerance_code,
  ph_min = excluded.ph_min,
  ph_max = excluded.ph_max,
  ph_ideal_min = excluded.ph_ideal_min,
  ph_ideal_max = excluded.ph_ideal_max,
  ph_sensitivity_code = excluded.ph_sensitivity_code,
  fertility_need = excluded.fertility_need,
  nitrogen_need = excluded.nitrogen_need,
  phosphorus_need = excluded.phosphorus_need,
  potassium_need = excluded.potassium_need,
  calcium_sensitivity_code = excluded.calcium_sensitivity_code,
  soil_oxygen_need = excluded.soil_oxygen_need,
  mycorrhizal_association_notes = excluded.mycorrhizal_association_notes,
  mulch_preference = excluded.mulch_preference,
  mulch_depth_preference_in = excluded.mulch_depth_preference_in,
  waterlogging_sensitivity_code = excluded.waterlogging_sensitivity_code,
  texture_preferences = excluded.texture_preferences,
  preferred_soil_texture_codes = excluded.preferred_soil_texture_codes,
  soil_texture_summary = excluded.soil_texture_summary,
  updated_at = now();

insert into catalog.plant_water_profiles (plant_profile_id, water_need_level, drought_tolerance_code, moisture_sensitivity_code, preferred_irrigation_method, root_zone_depth_in, container_water_multiplier, mulched_water_reduction_factor, summer_heat_adjustment_factor)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'medium', 'low', 'medium', 'Water at soil level; keep evenly moist without saturating.', 12, 1.2, 0.9, 1.2)
on conflict (plant_profile_id) do update set
  water_need_level = excluded.water_need_level,
  drought_tolerance_code = excluded.drought_tolerance_code,
  moisture_sensitivity_code = excluded.moisture_sensitivity_code,
  preferred_irrigation_method = excluded.preferred_irrigation_method,
  root_zone_depth_in = excluded.root_zone_depth_in,
  container_water_multiplier = excluded.container_water_multiplier,
  mulched_water_reduction_factor = excluded.mulched_water_reduction_factor,
  summer_heat_adjustment_factor = excluded.summer_heat_adjustment_factor,
  updated_at = now();

insert into catalog.plant_ecology_profiles (plant_profile_id, invasive_risk_code, wildlife_food_value, erosion_control_value, biomass_value, compost_value, chop_drop_value)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'caution', 2, 1, 2, 3, 1)
on conflict (plant_profile_id) do update set
  invasive_risk_code = excluded.invasive_risk_code,
  wildlife_food_value = excluded.wildlife_food_value,
  erosion_control_value = excluded.erosion_control_value,
  biomass_value = excluded.biomass_value,
  compost_value = excluded.compost_value,
  chop_drop_value = excluded.chop_drop_value,
  updated_at = now();

insert into catalog.plant_maintenance_profiles (plant_profile_id, pruning_frequency, deadheading_helpful, division_interval_years, staking_needed, suckering_management, cleanup_intensity, disease_susceptibility_level, pest_susceptibility_level, humidity_disease_risk, air_flow_importance)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'Harvest foliage regularly; remove flower stalks to extend leaf production or leave selected umbels for seed.', true, null, false, null, 3, 5, 5, 5, 7)
on conflict (plant_profile_id) do update set
  pruning_frequency = excluded.pruning_frequency,
  deadheading_helpful = excluded.deadheading_helpful,
  division_interval_years = excluded.division_interval_years,
  staking_needed = excluded.staking_needed,
  suckering_management = excluded.suckering_management,
  cleanup_intensity = excluded.cleanup_intensity,
  disease_susceptibility_level = excluded.disease_susceptibility_level,
  pest_susceptibility_level = excluded.pest_susceptibility_level,
  humidity_disease_risk = excluded.humidity_disease_risk,
  air_flow_importance = excluded.air_flow_importance,
  updated_at = now();

insert into catalog.plant_water_establishment_profiles (id, plant_profile_id, week_from_planting_start, week_from_planting_end, gallons_per_week, frequency_per_week, deep_vs_frequent, notes)
values ('4f36a56d-c29f-59e1-ad8a-de57c05d25ee'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 0, 3, 0.5, 3, 'frequent_light', 'Keep seedbed evenly moist through germination and early seedling establishment.')
on conflict (id) do update set
  gallons_per_week = excluded.gallons_per_week,
  frequency_per_week = excluded.frequency_per_week,
  deep_vs_frequent = excluded.deep_vs_frequent,
  notes = excluded.notes;

insert into catalog.phenology_templates (id, plant_profile_id, region_type, region_value, is_default, notes)
values ('16a16da8-81df-5509-847f-65889e21f7c6'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'generic', null, true, 'Generic annual dill timing; use regional windows for local climates.')
on conflict (plant_profile_id, region_type, (coalesce(region_value, '')), is_default) do update set
  notes = excluded.notes,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('f4f8bd98-fc2a-5d48-b962-ba922defb5a5'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'direct_sow', 'Direct sow dill', 'calendar', 'Spring, around 1-2 weeks before last frost in temperate guidance; regional warm climates may use fall/winter windows.', 'calendar', null, null, null, 10, 18, 3, 4, null, 14, 'Soil workable and cool-season window open', 'Direct sow shallowly and thin seedlings after emergence.', 'annual', 'medium', 'Late heat can shorten leaf harvest and accelerate bolting.', 55, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('1c437adf-13f8-537e-b6b6-fb5856829822'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'harvest', 'Harvest dill leaves', 'plant_observation', 'Plants have enough foliage to cut without stripping', 'event_offset', null, null, null, 16, 34, 4, 8, 35, 7, 'Fine foliage present before heavy flowering', 'Cut outer foliage in the morning for fresh use.', 'during active growth', 'low', 'Leaves decline after bolting.', 35, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('f09474eb-23c2-5d1a-8126-eb01ec145ead'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'seed_set', 'Harvest seed heads', 'plant_observation', 'Fruiting tops fully developed but not fully brown', 'event_offset', null, null, null, 24, 40, 6, 10, 65, null, 'Seed heads heavy and turning color', 'Cut heads with stem, cure in shade or bag to collect seeds.', 'annual', 'medium', 'Seed drops and self-sows.', 50, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.plant_zone_profiles (id, plant_profile_id, region_type, region_value, usda_zone_min, usda_zone_max, planting_window_start_week, planting_window_end_week, harvest_window_start_week, harvest_window_end_week, bloom_window_start_week, bloom_window_end_week, dieback_window_start_week, reemergence_window_start_week, proliferation_behavior, maintenance_timing_notes, seasonal_risk_notes)
values ('c9cb66b9-5c58-59d0-bae8-24266049358d'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'generic', null, null, null, 10, 18, 16, 40, 20, 36, 36, null, 'Annual that can self-sow from dropped seed.', 'Succession sow every two weeks for leaf continuity; leave selected plants to flower for seed and beneficial insects.', 'Heat and flowering shorten leaf-harvest quality; humid sites need airflow.')
on conflict (plant_profile_id, region_type, (coalesce(region_value, ''))) do update set
  usda_zone_min = excluded.usda_zone_min,
  usda_zone_max = excluded.usda_zone_max,
  planting_window_start_week = excluded.planting_window_start_week,
  planting_window_end_week = excluded.planting_window_end_week,
  harvest_window_start_week = excluded.harvest_window_start_week,
  harvest_window_end_week = excluded.harvest_window_end_week,
  bloom_window_start_week = excluded.bloom_window_start_week,
  bloom_window_end_week = excluded.bloom_window_end_week,
  dieback_window_start_week = excluded.dieback_window_start_week,
  reemergence_window_start_week = excluded.reemergence_window_start_week,
  proliferation_behavior = excluded.proliferation_behavior,
  maintenance_timing_notes = excluded.maintenance_timing_notes,
  seasonal_risk_notes = excluded.seasonal_risk_notes,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('2d811ef2-080b-55e7-ba73-84aa92a41e22'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'direct_sow', 'plant', 'lifecycle', 'Direct sow dill', 'Sow dill shallowly in place and thin seedlings; avoid transplanting when possible.', 'FREQ=YEARLY', 0, 14, 'medium', true, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('a8357992-075e-5dfa-b7af-5044849ad02f'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'maintenance', 'plant', 'maintenance', 'Succession sow dill', 'Sow another small patch every two weeks if steady leaf harvest is desired.', 'FREQ=WEEKLY;INTERVAL=2', 0, 7, 'low', false, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('0192b33e-bb75-5c1b-944c-1d036ae76264'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'harvest', 'harvest', 'lifecycle', 'Harvest dill leaves', 'Cut fresh foliage before heavy flowering for best leaf use.', 'FREQ=WEEKLY;INTERVAL=1', 0, 5, 'low', false, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('08821593-fdba-58bc-ab66-69e74b2c82b5'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'seed_set', 'harvest', 'lifecycle', 'Harvest dill seed heads', 'Cut seed heads once fruiting tops are developed but before seed drop.', 'FREQ=YEARLY', 0, 10, 'medium', true, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('b6e22fda-6283-5bf3-9c4c-beeb94fe7f08'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'human', 'safe', '{}'::text[], 'Leaves, flowers, and seeds are treated as edible culinary parts in the sourced profile.', null, 'extension', 'Use culinary quantities; do not infer medicinal dosing from this profile.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('cacb75ef-1456-591f-9c79-59e43f5c2ce3'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'dog', 'unknown', '{}'::text[], 'Pet safety not curated in this pass.', null, 'curation_needed', 'Avoid pet-safety claims until a veterinary source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('c4d4672c-7b4f-5592-b97a-8362709e88d2'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'cat', 'unknown', '{}'::text[], 'Pet safety not curated in this pass.', null, 'curation_needed', 'Avoid pet-safety claims until a veterinary source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('4885d072-f5bf-5e5b-abbc-e8a8e1f4ec11'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'chicken', 'unknown', '{}'::text[], 'Poultry safety not curated in this pass.', null, 'curation_needed', 'Avoid poultry-safety claims until a livestock source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('8cb3677e-6a74-50aa-a5e6-a89948e520d4'::uuid, 'NC State Extension Gardener Plant Toolbox: Anethum graveolens', 'extension', 'North Carolina State Extension', null, 'https://plants.ces.ncsu.edu/plants/anethum-graveolens/', 'NC State Extension Gardener Plant Toolbox profile for Anethum graveolens.', null, 0.86, null, 'Used for botanical identity, edible parts, images, and general profile context.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'University of Delaware Cooperative Extension: Dill', 'extension', 'University of Delaware Cooperative Extension', 'New Castle County Master Gardeners Rick Judd and Gail Hermenaus', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', 'University of Delaware Cooperative Extension dill fact sheet, October 2024.', '2024-10-01', 0.88, null, 'Used for sun, soil, annual lifecycle, container suitability, cultivar notes, pests, and diseases.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Illinois Extension: Dill', 'extension', 'University of Illinois Extension', null, 'https://extension.illinois.edu/herbs/dill', 'Illinois Extension herb profile for dill.', null, 0.88, null, 'Used for direct-sow guidance, taproot transplant sensitivity, self-seeding, harvesting, and popular cultivar positioning.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('2f1e9ed4-0bf3-56cf-afe4-ee1ecad16d27'::uuid, 'UF/IFAS Extension: Dill, Anethum graveolens L.', 'extension', 'University of Florida IFAS Extension', 'James M. Stephens', 'https://www.growables.org/informationVeg/documents/Dill.pdf', 'UF/IFAS Extension HS593 Dill fact sheet.', null, 0.86, null, 'Used for sowing depth, thinning, Florida planting timing, height, Long Island Mammoth maturity, and seed harvest guidance.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('fdaf6227-658b-5c93-bb0c-79c9776811b5'::uuid, 'Garden.io March 2026 starter workbook', 'internal_curation', 'Garden.io', null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07', null, 0.3, null, 'Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Notes: Planned northwest of trunk, alternating with bee balm.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('4be702d0-ae19-5d3e-a8b9-76d44b6971b7'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'taxonomy.botanical_identity', '{"botanical_name_full":"Anethum graveolens","family_name":"Apiaceae"}'::jsonb, 'strong', 0.9, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Anethum graveolens, Dill; Apiaceae family.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('6cec0a37-f408-5470-b6d6-67724b215953'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'climate.light_requirement', '{"preferred_light":"full sun","sun_min_hours":6}'::jsonb, 'strong', 0.88, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Sunlight: full sun.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('1566f4b3-16b6-5b42-bdac-fc50eec74eab'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'soil.drainage_requirement', '{"poor_soil_tolerance":true,"soil":"loamy, well drained"}'::jsonb, 'strong', 0.86, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Grows best in loamy, well drained soil but can grow in poor soil.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('0d01cf11-25ac-5434-9cf8-9c25611e3378'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'propagation.direct_sow', '{"depth_max_in":0.5,"depth_min_in":0.25,"preferred":true,"reason":"taproot transplant sensitivity"}'::jsonb, 'strong', 0.87, 1, 1, 'e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Dill does best when it is directly sown.', 'https://extension.illinois.edu/herbs/dill', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('3a7698c8-5b37-5175-b661-a8f9c8298e6b'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'growth.self_seeding', '{"management":"deadhead or harvest seed heads to reduce self-sowing","self_seeds":true}'::jsonb, 'strong', 0.82, 1, 1, 'e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Dill reseeds readily.', 'https://extension.illinois.edu/herbs/dill', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('730dacff-7ff2-5ce9-a9da-2213d7030de6'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'maintenance.pests_diseases', '{"diseases":["downy mildew","powdery mildew"],"pests":["aphids","army worm","cut worm"]}'::jsonb, 'moderate', 0.78, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Common pests and diseases include downy mildew, powdery mildew, aphids, army worm, and cut worm.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('a2dfb3cc-b7bb-5936-abd1-eb941988f265'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'fruiting.edible_parts', '{"edible_parts":["leaves","flowers","seeds"],"seed_harvest":"fruiting tops fully developed but not brown"}'::jsonb, 'strong', 0.86, 1, 1, '2f1e9ed4-0bf3-56cf-afe4-ee1ecad16d27'::uuid, 'Dried or freshly chopped dill leaves are used... fruiting tops may be used either fresh or dried.', 'https://www.growables.org/informationVeg/documents/Dill.pdf', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('c6fd5660-b8d5-5091-93af-9938018ed842'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'profile.workbook_presence', '{"bed_name":"Orchard A Companion Guild Layer","catalog_slug":"dill","notes":"Planned northwest of trunk, alternating with bee balm.","plant_name":"Dill","sheet_name":"wishlist","zone_name":"Orchard A (West Orchard)"}'::jsonb, 'unknown', 0.3, 1, 1, 'fdaf6227-658b-5c93-bb0c-79c9776811b5'::uuid, 'Planned northwest of trunk, alternating with bee balm.', null, false, 'needs_more_evidence', 'Preston property plan', null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('d8a1f05d-7bcf-5b70-91f9-822043fd8a26'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'sun_need', 4, 'Full sun crop; best leaf and seed production needs strong direct light.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('0cab0813-b7f0-5e2a-89e4-ea5d7c9fad3f'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'shade_tolerance', 2, 'Can tolerate light relief in hot weather, but shade reduces performance.', 'weak', 0.58, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('7d563b7e-fbfd-5958-9671-d883fb084fff'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'afternoon_sun_tolerance', 3, 'Handles full sun when soil moisture is even; hot weather speeds bolting.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('0f97c6cc-72de-528c-a75d-092d008a74a7'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'water_need', 3, 'Medium water need; moist, well-drained soil is preferred.', 'strong', 0.84, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('73337c93-1ad5-5e76-b525-4653fcfde7c3'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'drought_tolerance', 2, 'Not a true drought herb; dry stress accelerates decline and bolting.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('93ea6a1c-9b00-556e-940d-d260e15dc26f'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'wet_feet_tolerance', 1, 'Requires drainage and is not suited to waterlogged soil.', 'strong', 0.84, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('6280ecd2-f501-592d-8492-89efc85a6545'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'soil_drainage_need', 4, 'Well-drained soil is consistently recommended.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('d726b700-e517-52e5-b6ba-16825300f412'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'soil_fertility_need', 2, 'Can grow in poor soil but performs best in loamy soil.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('c22f4aa4-9767-5252-bec6-756166933498'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'soil_compaction_tolerance', 2, 'Taproot and direct-sow preference imply low tolerance for compaction/disturbance.', 'weak', 0.58, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('cbf5da1f-c26f-5db4-93a5-04db9c6b98c6'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'soil_texture_flexibility', 4, 'Tolerates vegetable-garden soils when drainage is adequate.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('d1e53b9e-d275-54ff-b598-9186dda84005'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'maintenance_need', 2, 'Easy annual, but succession sowing and bolting management matter.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('43885df4-0d90-5183-b823-f72c8ff7111d'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'beginner_friendliness', 4, 'Easy direct-sown herb if not transplanted and succession-sown.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('947c6aeb-f2e8-5c37-9b8a-5987fe7bf33c'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'spread_aggressiveness', 3, 'Can reseed readily if seed heads are left in place.', 'moderate', 0.78, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('c574c33e-8b54-528d-95d5-8d37df3c30d5'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'container_suitability', 4, 'Extension guidance says it grows well in containers, with taproot-aware handling.', 'strong', 0.82, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('416c2356-aa03-5ef8-bbb3-7207d1339508'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'transplant_tolerance', 1, 'Taproot makes transplanting difficult; direct sow is preferred.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('99670afe-a7d6-5756-b284-a1db5d453dc2'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'pollinator_value', 4, 'Umbel flowers provide insect/pollinator value.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('e02aa96a-ba78-5fff-b198-1ca45fae82f3'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'wildlife_food_value', 2, 'Not primarily grown as wildlife food; value is mostly insect floral resource.', 'weak', 0.5, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('d7fea3ce-4dad-5349-b4c2-0c63cd855f5d'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'erosion_control_value', 1, 'Annual herb with limited soil-stabilizing role.', 'weak', 0.45, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('3cf625c1-44f6-5d9f-beb1-b34adf59f06e'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'biomass_value', 2, 'Moderate annual foliage but not a major biomass plant.', 'weak', 0.5, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('e2deba8f-27cc-5987-ad04-350906162202'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'invasive_risk', 2, 'Self-seeds readily but is generally manageable in garden context.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('3893ba9f-535d-5d23-892b-db7685295807'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'disease_susceptibility', 3, 'Downy mildew and powdery mildew are listed concerns.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('4c34b3fb-de5b-5dc6-aa79-0d93cb1a5910'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'pest_susceptibility', 3, 'Aphids, army worm, and cut worm are listed concerns.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('a058d39e-78a6-51ec-954f-bdf4469d2c22'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'humidity_disease_risk', 3, 'Mildew risk makes airflow and spacing relevant in humid sites.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('3f573e0e-1345-58e9-8aa0-baaa5e7c8e39'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'deer_resistance', 3, 'Aromatic foliage may help, but source support is cultivar/vendor-level and context dependent.', 'weak', 0.48, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('6cf633cb-2aa5-594e-bd04-4c7224cce46b'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'rabbit_resistance', 2, 'No strong source-backed resistance claim; treat as vulnerable until observed.', 'unknown', 0.35, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)
values ('eac54ced-9dc1-52ba-b7f6-c2a9c686a62f'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, 'flowering', '/art/specimen-herbarium-sheet.svg', 'art/specimen-herbarium-sheet.svg', 'image/svg+xml', null, null, 'Garden.io placeholder specimen illustration', 'internal placeholder', true, true)
on conflict (id) do update set
  source_id = excluded.source_id,
  stage_code = excluded.stage_code,
  image_url = excluded.image_url,
  storage_key = excluded.storage_key,
  mime_type = excluded.mime_type,
  width_px = excluded.width_px,
  height_px = excluded.height_px,
  attribution_text = excluded.attribution_text,
  license = excluded.license,
  is_primary = excluded.is_primary,
  is_public = excluded.is_public,
  updated_at = now();

-- mammoth-dill
insert into catalog.plant_taxa (
  id, kingdom_name, family_name, genus_name, species_name, subspecies_name, variety_name,
  botanical_name_full, taxon_rank, native_range, origin_type
) values (
  '7ce75a0f-276b-582e-b776-7281a7b122a2'::uuid, 'Plantae', 'Apiaceae', 'Anethum', 'graveolens', null, null, 'Anethum graveolens', 'species', 'Asia and Mediterranean/western Asian region; exact origin varies by source framing.', 'exotic'
)
on conflict ((lower(genus_name)), (coalesce(lower(species_name), '')), (coalesce(lower(subspecies_name), '')), (coalesce(lower(variety_name), ''))) do update set
  kingdom_name = excluded.kingdom_name,
  family_name = excluded.family_name,
  genus_name = excluded.genus_name,
  species_name = excluded.species_name,
  subspecies_name = excluded.subspecies_name,
  variety_name = excluded.variety_name,
  botanical_name_full = excluded.botanical_name_full,
  taxon_rank = excluded.taxon_rank,
  native_range = excluded.native_range,
  origin_type = excluded.origin_type,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Mammoth Dill', 'common', 'en', true)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Anethum graveolens ''Mammoth''', 'latin_variant', 'en', false)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Long Island Mammoth', 'trade', 'en', false)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_cultivars (
  id, plant_taxon_id, cultivar_name, market_name, description, chill_hours_min, chill_hours_max, disease_resistance_notes, is_active
) values (
  'ccfb0c5c-3f79-5118-ac6f-1efb16d3ed20'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Mammoth', 'Mammoth Dill / Long Island Mammoth', 'Large, vigorous, tall dill cultivar grown for fresh leaves, seed heads, pickling, and cut scented foliage.', null, null, null, true
)
on conflict (plant_taxon_id, cultivar_name) do update set
  market_name = excluded.market_name,
  description = excluded.description,
  chill_hours_min = excluded.chill_hours_min,
  chill_hours_max = excluded.chill_hours_max,
  disease_resistance_notes = excluded.disease_resistance_notes,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_profiles (
  id, plant_taxon_id, plant_cultivar_id, slug, display_name, plant_type_code, lifecycle_type,
  confidence_score, evidence_count, source_count, source_last_reviewed_at,
  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,
  is_ai_generated, generation_status, is_published, review_status
) values (
  '0acdad98-8ece-5d0f-bcf5-b78909a38dda'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), (select id from catalog.plant_cultivars where plant_taxon_id = (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1) and cultivar_name = 'Mammoth' limit 1), 'mammoth-dill', 'Mammoth Dill', 'herb', 'annual', 0.84, 10, 5, '2026-06-03T00:00:00+00:00', true, false, false, 'Florida/fall planting timing differs from temperate spring timing; keep phenology regionalized.', true, 'ai_reviewed', true, 'pending_review'
)
on conflict (slug) where deleted_at is null do update set
  plant_taxon_id = excluded.plant_taxon_id,
  plant_cultivar_id = excluded.plant_cultivar_id,
  slug = excluded.slug,
  display_name = excluded.display_name,
  plant_type_code = excluded.plant_type_code,
  lifecycle_type = excluded.lifecycle_type,
  confidence_score = excluded.confidence_score,
  evidence_count = excluded.evidence_count,
  source_count = excluded.source_count,
  source_last_reviewed_at = excluded.source_last_reviewed_at,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  is_ai_generated = excluded.is_ai_generated,
  generation_status = excluded.generation_status,
  is_published = excluded.is_published,
  review_status = excluded.review_status,
  updated_at = now();

insert into catalog.plant_cultivar_overrides (id, plant_cultivar_id, plant_profile_id, region_type, region_value, field_key, override_scope, override_value, evidence_strength_code, source_notes)
values ('9469a245-b8c0-506a-879e-2fc55f24277d'::uuid, (select id from catalog.plant_cultivars where plant_taxon_id = (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1) and cultivar_name = 'Mammoth' limit 1), (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), null, null, 'growth.mature_height_in', 'trait', '{"max":59,"min":39}'::jsonb, 'moderate', 'RHS Mammoth profile.')
on conflict (plant_cultivar_id, field_key, (coalesce(region_type, '')), (coalesce(region_value, ''))) do update set
  plant_profile_id = excluded.plant_profile_id,
  override_scope = excluded.override_scope,
  override_value = excluded.override_value,
  evidence_strength_code = excluded.evidence_strength_code,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_cultivar_overrides (id, plant_cultivar_id, plant_profile_id, region_type, region_value, field_key, override_scope, override_value, evidence_strength_code, source_notes)
values ('c3e4abfb-c6f4-578e-9ce7-57495ffb4c6d'::uuid, (select id from catalog.plant_cultivars where plant_taxon_id = (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1) and cultivar_name = 'Mammoth' limit 1), (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), null, null, 'phenology.days_to_maturity', 'phenology', '{"max":70,"min":65}'::jsonb, 'moderate', 'University of Delaware and UF/IFAS extension sources.')
on conflict (plant_cultivar_id, field_key, (coalesce(region_type, '')), (coalesce(region_value, ''))) do update set
  plant_profile_id = excluded.plant_profile_id,
  override_scope = excluded.override_scope,
  override_value = excluded.override_value,
  evidence_strength_code = excluded.evidence_strength_code,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_cultivar_overrides (id, plant_cultivar_id, plant_profile_id, region_type, region_value, field_key, override_scope, override_value, evidence_strength_code, source_notes)
values ('99703eba-4217-59b0-9723-b6647e0caac8'::uuid, (select id from catalog.plant_cultivars where plant_taxon_id = (select id from catalog.plant_taxa where lower(genus_name) = lower('Anethum') and coalesce(lower(species_name), '') = coalesce(lower('graveolens'), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1) and cultivar_name = 'Mammoth' limit 1), (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), null, null, 'profile.primary_use_cases', 'trait', '["seed heads","pickling","fresh leaves","cut scented foliage"]'::jsonb, 'moderate', 'RHS and extension cultivar notes.')
on conflict (plant_cultivar_id, field_key, (coalesce(region_type, '')), (coalesce(region_value, ''))) do update set
  plant_profile_id = excluded.plant_profile_id,
  override_scope = excluded.override_scope,
  override_value = excluded.override_value,
  evidence_strength_code = excluded.evidence_strength_code,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_aesthetic_styles (id, plant_profile_id, style_code, weight_score)
values ('8e9daf99-1ba1-5ad0-a3d4-6ddf314d1a15'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'cottage', 6)
on conflict (plant_profile_id, style_code) do update set
  weight_score = excluded.weight_score;

insert into catalog.plant_profile_aesthetic_styles (id, plant_profile_id, style_code, weight_score)
values ('ef83e0d7-a75f-55c8-b422-182e7e1ab92f'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'edible_landscape', 8)
on conflict (plant_profile_id, style_code) do update set
  weight_score = excluded.weight_score;

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('5623a3d9-7b0c-559f-ae18-734a75edfaa5'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'culinary', 'strong', true, 'Leaves, flowers, and seeds are edible and used fresh, dried, or in pickling.', 'Fresh herb, seed spice, pickling', null, null, 'Use leaves fresh; harvest seed heads as fruiting tops mature.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('6659de67-3e49-5333-86ad-d840120d2e32'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'pollinator_support', 'moderate', true, 'Flat yellow umbels provide small-flower insect forage.', 'Beneficial insect/pollinator resource', null, null, 'Allow some plants to bloom if pollinator value is desired.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)
values ('75c0a136-4298-5dcc-8a63-2cc96019cda2'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'cut_flower', 'weak', true, 'Umbels and scented foliage can be cut for arrangements or pickling jars.', 'Cut scented foliage/flower heads', null, null, 'More relevant for Mammoth and Bouquet than compact leaf cultivars.')
on conflict (plant_profile_id, use_type_code) do update set
  evidence_strength_code = excluded.evidence_strength_code,
  supports_use = excluded.supports_use,
  mechanism_description = excluded.mechanism_description,
  target_benefit = excluded.target_benefit,
  target_pest = excluded.target_pest,
  target_soil_effect = excluded.target_soil_effect,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_profile_narratives (plant_profile_id, locale, short_description, why_plant_it, pros_summary, cons_summary, primary_use_cases, notes_for_homestead, notes_for_small_garden, notes_for_container_growing, editorial_summary)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'en', 'Tall, vigorous dill cultivar with large umbels, edible leaves, flowers, and aromatic seeds.', 'Choose Mammoth when you want a taller dill for seed heads, pickling, pollinator umbels, and dramatic annual herb structure.', 'Tall and vigorous, strong seed-head presence, useful for pickling and fresh herb use, and high pollinator/insectary value when flowering.', 'Needs more space than compact dill, is less container-friendly, can self-seed, and may shade smaller companions.', 'Pickling seed heads, seed production, fresh leaves, cut scented foliage, annual insectary planting.', 'Use Mammoth at the back or outside edge of guild beds where 4-5 ft annual height will not crowd young trees or lower herbs.', 'Use compact or succession plantings; deadhead if self-seeding is not wanted.', 'Works in containers, but use a deep container and direct sow because the taproot dislikes transplant disturbance.', 'Dill is best modeled at species level with cultivar-specific profiles for Bouquet and Mammoth because cultivar choice affects height, days to seed/flower, and use emphasis.')
on conflict (plant_profile_id, locale) do update set
  short_description = excluded.short_description,
  why_plant_it = excluded.why_plant_it,
  pros_summary = excluded.pros_summary,
  cons_summary = excluded.cons_summary,
  primary_use_cases = excluded.primary_use_cases,
  notes_for_homestead = excluded.notes_for_homestead,
  notes_for_small_garden = excluded.notes_for_small_garden,
  notes_for_container_growing = excluded.notes_for_container_growing,
  editorial_summary = excluded.editorial_summary,
  updated_at = now();

insert into catalog.plant_ornamental_profiles (plant_profile_id, evergreen_deciduous, ornamental_season_interest, visual_texture, foliage_color, evergreen_foliage, winter_interest)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'deciduous', array['spring foliage', 'summer flowers', 'seed heads']::text[], 'Fine, feathery foliage with flat yellow umbels when flowering.', 'Green to blue-green', false, false)
on conflict (plant_profile_id) do update set
  evergreen_deciduous = excluded.evergreen_deciduous,
  ornamental_season_interest = excluded.ornamental_season_interest,
  visual_texture = excluded.visual_texture,
  foliage_color = excluded.foliage_color,
  evergreen_foliage = excluded.evergreen_foliage,
  winter_interest = excluded.winter_interest,
  updated_at = now();

insert into catalog.plant_climate_profiles (plant_profile_id, usda_hardiness_min, usda_hardiness_max, ahs_heat_zone_min, ahs_heat_zone_max, cold_tolerance_absolute_f, cold_tolerance_established_f, heat_tolerance_f, humidity_tolerance_code, drought_tolerance_code, flood_tolerance_code, wind_tolerance_code, salt_tolerance_code, chill_hours_min, chill_hours_max, frost_tender, reemergence_after_freeze_behavior, sun_min_hours, sun_max_hours, preferred_light, shade_tolerance_score, afternoon_sun_tolerance_score, reflected_heat_tolerance_score)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), null, null, null, null, null, null, null, 'medium', 'low', 'very_low', 'medium', 'unknown', null, null, true, 'Annual; replant or allow self-sown seedlings rather than expecting perennial return.', 6, 10, 'Full sun.', 3, 5, 3)
on conflict (plant_profile_id) do update set
  usda_hardiness_min = excluded.usda_hardiness_min,
  usda_hardiness_max = excluded.usda_hardiness_max,
  ahs_heat_zone_min = excluded.ahs_heat_zone_min,
  ahs_heat_zone_max = excluded.ahs_heat_zone_max,
  cold_tolerance_absolute_f = excluded.cold_tolerance_absolute_f,
  cold_tolerance_established_f = excluded.cold_tolerance_established_f,
  heat_tolerance_f = excluded.heat_tolerance_f,
  humidity_tolerance_code = excluded.humidity_tolerance_code,
  drought_tolerance_code = excluded.drought_tolerance_code,
  flood_tolerance_code = excluded.flood_tolerance_code,
  wind_tolerance_code = excluded.wind_tolerance_code,
  salt_tolerance_code = excluded.salt_tolerance_code,
  chill_hours_min = excluded.chill_hours_min,
  chill_hours_max = excluded.chill_hours_max,
  frost_tender = excluded.frost_tender,
  reemergence_after_freeze_behavior = excluded.reemergence_after_freeze_behavior,
  sun_min_hours = excluded.sun_min_hours,
  sun_max_hours = excluded.sun_max_hours,
  preferred_light = excluded.preferred_light,
  shade_tolerance_score = excluded.shade_tolerance_score,
  afternoon_sun_tolerance_score = excluded.afternoon_sun_tolerance_score,
  reflected_heat_tolerance_score = excluded.reflected_heat_tolerance_score,
  updated_at = now();

insert into catalog.plant_growth_profiles (plant_profile_id, mature_height_min_in, mature_height_max_in, mature_width_min_in, mature_width_max_in, annual_growth_height_in, annual_growth_width_in, growth_rate_code, growth_habit, root_behavior, spread_aggressiveness, pruning_response, transplant_tolerance, container_tolerance, trellis_needed, support_type)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 39, 59, 20, 39, 48, 18, 'high', 'Vigorous, upright, taller dill cultivar with large flat umbels.', 'Taprooted; dislikes root disturbance and is best direct-sown.', 5, 'Harvest foliage regularly; remove flower stalks to delay bolting or leave umbels for seed.', 2, 5, false, null)
on conflict (plant_profile_id) do update set
  mature_height_min_in = excluded.mature_height_min_in,
  mature_height_max_in = excluded.mature_height_max_in,
  mature_width_min_in = excluded.mature_width_min_in,
  mature_width_max_in = excluded.mature_width_max_in,
  annual_growth_height_in = excluded.annual_growth_height_in,
  annual_growth_width_in = excluded.annual_growth_width_in,
  growth_rate_code = excluded.growth_rate_code,
  growth_habit = excluded.growth_habit,
  root_behavior = excluded.root_behavior,
  spread_aggressiveness = excluded.spread_aggressiveness,
  pruning_response = excluded.pruning_response,
  transplant_tolerance = excluded.transplant_tolerance,
  container_tolerance = excluded.container_tolerance,
  trellis_needed = excluded.trellis_needed,
  support_type = excluded.support_type,
  updated_at = now();

insert into catalog.plant_propagation_methods (id, plant_profile_id, planting_method_code, allowed, is_preferred, depth_min_in, depth_max_in, spacing_min_in, spacing_max_in, proliferation_behavior, self_seeds, reseeding_intensity, spreads_by_runners, spreads_by_rhizomes, grafted_common, seed_viability_duration_months, germination_days_min, germination_days_max, cold_stratification_required, scarification_required, rooting_hormone_helpful, transplant_shock_risk_code, establishment_difficulty, notes)
values ('616e9ca8-03f5-51d1-921a-89aa7d01b0bd'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'direct_sow', true, true, 0.25, 0.5, 12, 24, 'Tall seed-head cultivar; direct sow and thin for airflow and stem strength.', true, 5, false, false, false, null, 7, 21, false, false, false, 'high', 2, 'Preferred method because dill taproots dislike transplanting.')
on conflict (plant_profile_id, planting_method_code) do update set
  allowed = excluded.allowed,
  is_preferred = excluded.is_preferred,
  depth_min_in = excluded.depth_min_in,
  depth_max_in = excluded.depth_max_in,
  spacing_min_in = excluded.spacing_min_in,
  spacing_max_in = excluded.spacing_max_in,
  proliferation_behavior = excluded.proliferation_behavior,
  self_seeds = excluded.self_seeds,
  reseeding_intensity = excluded.reseeding_intensity,
  spreads_by_runners = excluded.spreads_by_runners,
  spreads_by_rhizomes = excluded.spreads_by_rhizomes,
  grafted_common = excluded.grafted_common,
  seed_viability_duration_months = excluded.seed_viability_duration_months,
  germination_days_min = excluded.germination_days_min,
  germination_days_max = excluded.germination_days_max,
  cold_stratification_required = excluded.cold_stratification_required,
  scarification_required = excluded.scarification_required,
  rooting_hormone_helpful = excluded.rooting_hormone_helpful,
  transplant_shock_risk_code = excluded.transplant_shock_risk_code,
  establishment_difficulty = excluded.establishment_difficulty,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_propagation_methods (id, plant_profile_id, planting_method_code, allowed, is_preferred, depth_min_in, depth_max_in, spacing_min_in, spacing_max_in, proliferation_behavior, self_seeds, reseeding_intensity, spreads_by_runners, spreads_by_rhizomes, grafted_common, seed_viability_duration_months, germination_days_min, germination_days_max, cold_stratification_required, scarification_required, rooting_hormone_helpful, transplant_shock_risk_code, establishment_difficulty, notes)
values ('7381c879-96eb-5af1-bafa-69bf4a60fe90'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'transplant_seedling', true, false, null, null, 12, 18, 'Possible only with care before roots are disturbed.', null, null, false, false, false, null, null, null, false, false, false, 'high', 5, 'Use deep cells or soil blocks only if transplanting is necessary.')
on conflict (plant_profile_id, planting_method_code) do update set
  allowed = excluded.allowed,
  is_preferred = excluded.is_preferred,
  depth_min_in = excluded.depth_min_in,
  depth_max_in = excluded.depth_max_in,
  spacing_min_in = excluded.spacing_min_in,
  spacing_max_in = excluded.spacing_max_in,
  proliferation_behavior = excluded.proliferation_behavior,
  self_seeds = excluded.self_seeds,
  reseeding_intensity = excluded.reseeding_intensity,
  spreads_by_runners = excluded.spreads_by_runners,
  spreads_by_rhizomes = excluded.spreads_by_rhizomes,
  grafted_common = excluded.grafted_common,
  seed_viability_duration_months = excluded.seed_viability_duration_months,
  germination_days_min = excluded.germination_days_min,
  germination_days_max = excluded.germination_days_max,
  cold_stratification_required = excluded.cold_stratification_required,
  scarification_required = excluded.scarification_required,
  rooting_hormone_helpful = excluded.rooting_hormone_helpful,
  transplant_shock_risk_code = excluded.transplant_shock_risk_code,
  establishment_difficulty = excluded.establishment_difficulty,
  notes = excluded.notes,
  updated_at = now();

insert into catalog.plant_flowering_profiles (plant_profile_id, flowering_bool, flower_color, flower_size, bloom_start_week, bloom_end_week, bloom_duration_days, flower_abundance, flower_fragrance_strength, pollinator_value, nectar_value, pollen_value, attracts_bees, attracts_butterflies, attracts_hummingbirds, larval_host, native_pollinator_value)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), true, 'Yellow', 'Large, flat-topped compound umbels', 20, 38, 35, 'High; large umbels on tall plants', 3, 8, 6, 5, true, true, false, false, 3)
on conflict (plant_profile_id) do update set
  flowering_bool = excluded.flowering_bool,
  flower_color = excluded.flower_color,
  flower_size = excluded.flower_size,
  bloom_start_week = excluded.bloom_start_week,
  bloom_end_week = excluded.bloom_end_week,
  bloom_duration_days = excluded.bloom_duration_days,
  flower_abundance = excluded.flower_abundance,
  flower_fragrance_strength = excluded.flower_fragrance_strength,
  pollinator_value = excluded.pollinator_value,
  nectar_value = excluded.nectar_value,
  pollen_value = excluded.pollen_value,
  attracts_bees = excluded.attracts_bees,
  attracts_butterflies = excluded.attracts_butterflies,
  attracts_hummingbirds = excluded.attracts_hummingbirds,
  larval_host = excluded.larval_host,
  native_pollinator_value = excluded.native_pollinator_value,
  updated_at = now();

insert into catalog.plant_fruiting_profiles (plant_profile_id, fruiting_bool, fruit_color, fruit_size, fruit_flavor, fruiting_start_age_years, yield_lb_per_plant_year_min, yield_lb_per_plant_year_max, harvest_window_start_week, harvest_window_end_week, fruit_drop_behavior, wildlife_attraction, first_harvest_time_from_planting_days, productive_years_min, productive_years_max, harvest_frequency, preservation_uses, edible_parts, medicinal_parts, fodder_parts)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), true, 'Tan to brown when mature', 'Small dry schizocarps commonly treated as dill seed', 'Aromatic dill/caraway-like seed flavor', 0.15, null, null, 24, 40, 'Seeds drop from mature umbels if not bagged or harvested promptly.', 3, 65, 1, 1, 'Leaves before bolting; seed heads around 65-70 days depending on source and climate.', 'Fresh leaves, dried leaves, dried seed heads, pickling seed heads.', array['leaves', 'flowers', 'seeds']::text[], '{}'::text[], '{}'::text[])
on conflict (plant_profile_id) do update set
  fruiting_bool = excluded.fruiting_bool,
  fruit_color = excluded.fruit_color,
  fruit_size = excluded.fruit_size,
  fruit_flavor = excluded.fruit_flavor,
  fruiting_start_age_years = excluded.fruiting_start_age_years,
  yield_lb_per_plant_year_min = excluded.yield_lb_per_plant_year_min,
  yield_lb_per_plant_year_max = excluded.yield_lb_per_plant_year_max,
  harvest_window_start_week = excluded.harvest_window_start_week,
  harvest_window_end_week = excluded.harvest_window_end_week,
  fruit_drop_behavior = excluded.fruit_drop_behavior,
  wildlife_attraction = excluded.wildlife_attraction,
  first_harvest_time_from_planting_days = excluded.first_harvest_time_from_planting_days,
  productive_years_min = excluded.productive_years_min,
  productive_years_max = excluded.productive_years_max,
  harvest_frequency = excluded.harvest_frequency,
  preservation_uses = excluded.preservation_uses,
  edible_parts = excluded.edible_parts,
  medicinal_parts = excluded.medicinal_parts,
  fodder_parts = excluded.fodder_parts,
  updated_at = now();

insert into catalog.plant_soil_profiles (plant_profile_id, drainage_requirement, organic_matter_preference, compaction_tolerance_code, rocky_soil_tolerance_code, ph_min, ph_max, ph_ideal_min, ph_ideal_max, ph_sensitivity_code, fertility_need, nitrogen_need, phosphorus_need, potassium_need, calcium_sensitivity_code, soil_oxygen_need, mycorrhizal_association_notes, mulch_preference, mulch_depth_preference_in, waterlogging_sensitivity_code, texture_preferences, preferred_soil_texture_codes, soil_texture_summary)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'Moist, well-drained soil; avoid waterlogging.', 'Loamy, vegetable-garden soil preferred, but can tolerate poorer soil if drained.', 'low', 'medium', 5.8, 7.8, 6.0, 7.5, 'low', 'low_to_medium', 'low_to_medium', 'medium', 'medium', 'unknown', 'High enough to protect taproot from wet, anaerobic soil.', null, 'Light mulch after seedlings establish can even moisture without burying crowns.', 1, 'high', '{"loam":{"description":"Best general texture.","suitability":5},"sand":{"description":"Possible with fertility and water support.","suitability":3},"sandy_loam":{"description":"Good when watered consistently.","suitability":4},"silt_loam":{"description":"Good if drainage and airflow are adequate.","suitability":4}}'::jsonb, array['loam', 'sandy_loam', 'silt_loam']::text[], 'Loamy, well-drained garden soil is preferred; poor soils are possible but less ideal.')
on conflict (plant_profile_id) do update set
  drainage_requirement = excluded.drainage_requirement,
  organic_matter_preference = excluded.organic_matter_preference,
  compaction_tolerance_code = excluded.compaction_tolerance_code,
  rocky_soil_tolerance_code = excluded.rocky_soil_tolerance_code,
  ph_min = excluded.ph_min,
  ph_max = excluded.ph_max,
  ph_ideal_min = excluded.ph_ideal_min,
  ph_ideal_max = excluded.ph_ideal_max,
  ph_sensitivity_code = excluded.ph_sensitivity_code,
  fertility_need = excluded.fertility_need,
  nitrogen_need = excluded.nitrogen_need,
  phosphorus_need = excluded.phosphorus_need,
  potassium_need = excluded.potassium_need,
  calcium_sensitivity_code = excluded.calcium_sensitivity_code,
  soil_oxygen_need = excluded.soil_oxygen_need,
  mycorrhizal_association_notes = excluded.mycorrhizal_association_notes,
  mulch_preference = excluded.mulch_preference,
  mulch_depth_preference_in = excluded.mulch_depth_preference_in,
  waterlogging_sensitivity_code = excluded.waterlogging_sensitivity_code,
  texture_preferences = excluded.texture_preferences,
  preferred_soil_texture_codes = excluded.preferred_soil_texture_codes,
  soil_texture_summary = excluded.soil_texture_summary,
  updated_at = now();

insert into catalog.plant_water_profiles (plant_profile_id, water_need_level, drought_tolerance_code, moisture_sensitivity_code, preferred_irrigation_method, root_zone_depth_in, container_water_multiplier, mulched_water_reduction_factor, summer_heat_adjustment_factor)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'medium', 'low', 'medium', 'Water at soil level; keep evenly moist without saturating.', 12, 1.2, 0.9, 1.2)
on conflict (plant_profile_id) do update set
  water_need_level = excluded.water_need_level,
  drought_tolerance_code = excluded.drought_tolerance_code,
  moisture_sensitivity_code = excluded.moisture_sensitivity_code,
  preferred_irrigation_method = excluded.preferred_irrigation_method,
  root_zone_depth_in = excluded.root_zone_depth_in,
  container_water_multiplier = excluded.container_water_multiplier,
  mulched_water_reduction_factor = excluded.mulched_water_reduction_factor,
  summer_heat_adjustment_factor = excluded.summer_heat_adjustment_factor,
  updated_at = now();

insert into catalog.plant_ecology_profiles (plant_profile_id, invasive_risk_code, wildlife_food_value, erosion_control_value, biomass_value, compost_value, chop_drop_value)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'caution', 2, 1, 2, 3, 1)
on conflict (plant_profile_id) do update set
  invasive_risk_code = excluded.invasive_risk_code,
  wildlife_food_value = excluded.wildlife_food_value,
  erosion_control_value = excluded.erosion_control_value,
  biomass_value = excluded.biomass_value,
  compost_value = excluded.compost_value,
  chop_drop_value = excluded.chop_drop_value,
  updated_at = now();

insert into catalog.plant_maintenance_profiles (plant_profile_id, pruning_frequency, deadheading_helpful, division_interval_years, staking_needed, suckering_management, cleanup_intensity, disease_susceptibility_level, pest_susceptibility_level, humidity_disease_risk, air_flow_importance)
values ((select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'Harvest foliage regularly; remove flower stalks to extend leaf production or leave selected umbels for seed.', true, null, false, null, 3, 5, 5, 5, 7)
on conflict (plant_profile_id) do update set
  pruning_frequency = excluded.pruning_frequency,
  deadheading_helpful = excluded.deadheading_helpful,
  division_interval_years = excluded.division_interval_years,
  staking_needed = excluded.staking_needed,
  suckering_management = excluded.suckering_management,
  cleanup_intensity = excluded.cleanup_intensity,
  disease_susceptibility_level = excluded.disease_susceptibility_level,
  pest_susceptibility_level = excluded.pest_susceptibility_level,
  humidity_disease_risk = excluded.humidity_disease_risk,
  air_flow_importance = excluded.air_flow_importance,
  updated_at = now();

insert into catalog.plant_water_establishment_profiles (id, plant_profile_id, week_from_planting_start, week_from_planting_end, gallons_per_week, frequency_per_week, deep_vs_frequent, notes)
values ('00fd2ea8-308d-5196-9b85-06cd0369a2c1'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 0, 3, 0.5, 3, 'frequent_light', 'Keep seedbed evenly moist through germination and early seedling establishment.')
on conflict (id) do update set
  gallons_per_week = excluded.gallons_per_week,
  frequency_per_week = excluded.frequency_per_week,
  deep_vs_frequent = excluded.deep_vs_frequent,
  notes = excluded.notes;

insert into catalog.phenology_templates (id, plant_profile_id, region_type, region_value, is_default, notes)
values ('aa0e1634-95ce-5a42-93fa-3439dda87288'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'generic', null, true, 'Generic annual dill timing; use regional windows for local climates.')
on conflict (plant_profile_id, region_type, (coalesce(region_value, '')), is_default) do update set
  notes = excluded.notes,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('084b8e9d-5dd8-5794-8e9e-d22587eadcd8'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'direct_sow', 'Direct sow dill', 'calendar', 'Spring, around 1-2 weeks before last frost in temperate guidance; regional warm climates may use fall/winter windows.', 'calendar', null, null, null, 10, 18, 3, 4, null, 14, 'Soil workable and cool-season window open', 'Direct sow shallowly and thin seedlings after emergence.', 'annual', 'medium', 'Late heat can shorten leaf harvest and accelerate bolting.', 55, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('d2ef8a97-c315-5f1b-965e-914a3bbfd170'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'harvest', 'Harvest dill leaves', 'plant_observation', 'Plants have enough foliage to cut without stripping', 'event_offset', null, null, null, 16, 34, 4, 8, 35, 7, 'Fine foliage present before heavy flowering', 'Cut outer foliage in the morning for fresh use.', 'during active growth', 'low', 'Leaves decline after bolting.', 35, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.phenology_events (id, phenology_template_id, stage_code, stage_name, trigger_type, trigger_rule, timing_type, earliest_date, typical_date, latest_date, week_start_of_year, week_end_of_year, month_start, month_end, offset_days_from_planting, repeat_every_days, cues, recommended_action, recurrence, urgency_code, failure_risk_if_missed, priority_weight, repeatable)
values ('08b17131-1452-5992-9882-f9df22888734'::uuid, (select id from catalog.phenology_templates where plant_profile_id = (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null) and region_type = 'generic' and coalesce(region_value, '') = coalesce(null, '') and is_default = true limit 1), 'seed_set', 'Harvest seed heads', 'plant_observation', 'Fruiting tops fully developed but not fully brown', 'event_offset', null, null, null, 24, 40, 6, 10, 65, null, 'Seed heads heavy and turning color', 'Cut heads with stem, cure in shade or bag to collect seeds.', 'annual', 'medium', 'Seed drops and self-sows.', 50, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  stage_name = excluded.stage_name,
  trigger_type = excluded.trigger_type,
  trigger_rule = excluded.trigger_rule,
  timing_type = excluded.timing_type,
  earliest_date = excluded.earliest_date,
  typical_date = excluded.typical_date,
  latest_date = excluded.latest_date,
  week_start_of_year = excluded.week_start_of_year,
  week_end_of_year = excluded.week_end_of_year,
  month_start = excluded.month_start,
  month_end = excluded.month_end,
  offset_days_from_planting = excluded.offset_days_from_planting,
  repeat_every_days = excluded.repeat_every_days,
  cues = excluded.cues,
  recommended_action = excluded.recommended_action,
  recurrence = excluded.recurrence,
  urgency_code = excluded.urgency_code,
  failure_risk_if_missed = excluded.failure_risk_if_missed,
  priority_weight = excluded.priority_weight,
  repeatable = excluded.repeatable,
  updated_at = now();

insert into catalog.plant_zone_profiles (id, plant_profile_id, region_type, region_value, usda_zone_min, usda_zone_max, planting_window_start_week, planting_window_end_week, harvest_window_start_week, harvest_window_end_week, bloom_window_start_week, bloom_window_end_week, dieback_window_start_week, reemergence_window_start_week, proliferation_behavior, maintenance_timing_notes, seasonal_risk_notes)
values ('35d45d0a-e98d-5582-90c2-0e340d42bcff'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'generic', null, null, null, 10, 18, 16, 40, 20, 36, 36, null, 'Annual that can self-sow from dropped seed.', 'Succession sow every two weeks for leaf continuity; leave selected plants to flower for seed and beneficial insects.', 'Heat and flowering shorten leaf-harvest quality; humid sites need airflow.')
on conflict (plant_profile_id, region_type, (coalesce(region_value, ''))) do update set
  usda_zone_min = excluded.usda_zone_min,
  usda_zone_max = excluded.usda_zone_max,
  planting_window_start_week = excluded.planting_window_start_week,
  planting_window_end_week = excluded.planting_window_end_week,
  harvest_window_start_week = excluded.harvest_window_start_week,
  harvest_window_end_week = excluded.harvest_window_end_week,
  bloom_window_start_week = excluded.bloom_window_start_week,
  bloom_window_end_week = excluded.bloom_window_end_week,
  dieback_window_start_week = excluded.dieback_window_start_week,
  reemergence_window_start_week = excluded.reemergence_window_start_week,
  proliferation_behavior = excluded.proliferation_behavior,
  maintenance_timing_notes = excluded.maintenance_timing_notes,
  seasonal_risk_notes = excluded.seasonal_risk_notes,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('26d95490-cd7f-515b-be0b-218b626b94fb'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'direct_sow', 'plant', 'lifecycle', 'Direct sow dill', 'Sow dill shallowly in place and thin seedlings; avoid transplanting when possible.', 'FREQ=YEARLY', 0, 14, 'medium', true, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('7f361a47-2b96-50fe-9bdb-faf17e435c30'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'maintenance', 'plant', 'maintenance', 'Succession sow dill', 'Sow another small patch every two weeks if steady leaf harvest is desired.', 'FREQ=WEEKLY;INTERVAL=2', 0, 7, 'low', false, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('3d29c702-d592-554e-be53-98b8c277d4e7'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'harvest', 'harvest', 'lifecycle', 'Harvest dill leaves', 'Cut fresh foliage before heavy flowering for best leaf use.', 'FREQ=WEEKLY;INTERVAL=1', 0, 5, 'low', false, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)
values ('f0136e07-dc67-5387-92ef-24d8241c22d0'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'seed_set', 'harvest', 'lifecycle', 'Harvest dill seed heads', 'Cut seed heads once fruiting tops are developed but before seed drop.', 'FREQ=YEARLY', 0, 10, 'medium', true, true, true)
on conflict (id) do update set
  stage_code = excluded.stage_code,
  task_type_code = excluded.task_type_code,
  source_type_code = excluded.source_type_code,
  title = excluded.title,
  description = excluded.description,
  recurrence_rule = excluded.recurrence_rule,
  lead_days = excluded.lead_days,
  window_days = excluded.window_days,
  priority_code = excluded.priority_code,
  requires_confirmation = excluded.requires_confirmation,
  repeatable = excluded.repeatable,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('b116ad2c-abf0-5885-9a21-cb2d6a459147'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'human', 'safe', '{}'::text[], 'Leaves, flowers, and seeds are treated as edible culinary parts in the sourced profile.', null, 'extension', 'Use culinary quantities; do not infer medicinal dosing from this profile.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('7c7e9ef3-53cf-54ab-bb4d-7ff2f1d77079'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'dog', 'unknown', '{}'::text[], 'Pet safety not curated in this pass.', null, 'curation_needed', 'Avoid pet-safety claims until a veterinary source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('39c7a31f-94ea-5c07-be2c-1373721b8b53'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'cat', 'unknown', '{}'::text[], 'Pet safety not curated in this pass.', null, 'curation_needed', 'Avoid pet-safety claims until a veterinary source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('4f170279-fb4e-590c-903b-e77f9ac5fee5'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'chicken', 'unknown', '{}'::text[], 'Poultry safety not curated in this pass.', null, 'curation_needed', 'Avoid poultry-safety claims until a livestock source is added.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('8cb3677e-6a74-50aa-a5e6-a89948e520d4'::uuid, 'NC State Extension Gardener Plant Toolbox: Anethum graveolens', 'extension', 'North Carolina State Extension', null, 'https://plants.ces.ncsu.edu/plants/anethum-graveolens/', 'NC State Extension Gardener Plant Toolbox profile for Anethum graveolens.', null, 0.86, null, 'Used for botanical identity, edible parts, images, and general profile context.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'University of Delaware Cooperative Extension: Dill', 'extension', 'University of Delaware Cooperative Extension', 'New Castle County Master Gardeners Rick Judd and Gail Hermenaus', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', 'University of Delaware Cooperative Extension dill fact sheet, October 2024.', '2024-10-01', 0.88, null, 'Used for sun, soil, annual lifecycle, container suitability, cultivar notes, pests, and diseases.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Illinois Extension: Dill', 'extension', 'University of Illinois Extension', null, 'https://extension.illinois.edu/herbs/dill', 'Illinois Extension herb profile for dill.', null, 0.88, null, 'Used for direct-sow guidance, taproot transplant sensitivity, self-seeding, harvesting, and popular cultivar positioning.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('2f1e9ed4-0bf3-56cf-afe4-ee1ecad16d27'::uuid, 'UF/IFAS Extension: Dill, Anethum graveolens L.', 'extension', 'University of Florida IFAS Extension', 'James M. Stephens', 'https://www.growables.org/informationVeg/documents/Dill.pdf', 'UF/IFAS Extension HS593 Dill fact sheet.', null, 0.86, null, 'Used for sowing depth, thinning, Florida planting timing, height, Long Island Mammoth maturity, and seed harvest guidance.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('fdaf6227-658b-5c93-bb0c-79c9776811b5'::uuid, 'Garden.io March 2026 starter workbook', 'internal_curation', 'Garden.io', null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07', null, 0.3, null, 'Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Notes: Planned northwest of trunk, alternating with bee balm.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('67208523-2a84-5fe5-aac8-17feb63b9fba'::uuid, 'RHS: Anethum graveolens ''Mammoth''', 'other', 'Royal Horticultural Society', null, 'https://www.rhs.org.uk/plants/172992/anethum-graveolens-mammoth-dill-mammoth/details', 'RHS plant profile for Anethum graveolens ''Mammoth''.', null, 0.78, null, 'Used for Mammoth height, spread, full sun, well-drained soil, pollinator value, edible parts, and direct-sow/transplant guidance.', '2026-06-03T00:00:00+00:00')
on conflict (id) do update set
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  publisher = excluded.publisher,
  author = excluded.author,
  source_url = excluded.source_url,
  citation_text = excluded.citation_text,
  published_on = excluded.published_on,
  credibility_score = excluded.credibility_score,
  license = excluded.license,
  notes = excluded.notes,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('a936eb56-81bc-5ede-80b0-ca689073be0a'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'taxonomy.botanical_identity', '{"botanical_name_full":"Anethum graveolens","family_name":"Apiaceae"}'::jsonb, 'strong', 0.9, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Anethum graveolens, Dill; Apiaceae family.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('e679ad3f-4c0f-52d1-a31c-6f5cc05521c0'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'climate.light_requirement', '{"preferred_light":"full sun","sun_min_hours":6}'::jsonb, 'strong', 0.88, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Sunlight: full sun.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('b8691a0b-39ae-59f8-81da-f1179eca53c6'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'soil.drainage_requirement', '{"poor_soil_tolerance":true,"soil":"loamy, well drained"}'::jsonb, 'strong', 0.86, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Grows best in loamy, well drained soil but can grow in poor soil.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('78cbd13c-b894-55f7-8f33-48c13c871426'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'propagation.direct_sow', '{"depth_max_in":0.5,"depth_min_in":0.25,"preferred":true,"reason":"taproot transplant sensitivity"}'::jsonb, 'strong', 0.87, 1, 1, 'e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Dill does best when it is directly sown.', 'https://extension.illinois.edu/herbs/dill', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('cd4a1bee-17ca-5400-973c-68ba7d8e00fe'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'growth.self_seeding', '{"management":"deadhead or harvest seed heads to reduce self-sowing","self_seeds":true}'::jsonb, 'strong', 0.82, 1, 1, 'e5453968-ac39-500a-8a16-24318c3884bf'::uuid, 'Dill reseeds readily.', 'https://extension.illinois.edu/herbs/dill', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('a1d65ea5-6fd0-569e-b7cd-5c5ffefa8653'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'maintenance.pests_diseases', '{"diseases":["downy mildew","powdery mildew"],"pests":["aphids","army worm","cut worm"]}'::jsonb, 'moderate', 0.78, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Common pests and diseases include downy mildew, powdery mildew, aphids, army worm, and cut worm.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('dc2be622-3320-569c-a8a9-cf0e87f2dd71'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'fruiting.edible_parts', '{"edible_parts":["leaves","flowers","seeds"],"seed_harvest":"fruiting tops fully developed but not brown"}'::jsonb, 'strong', 0.86, 1, 1, '2f1e9ed4-0bf3-56cf-afe4-ee1ecad16d27'::uuid, 'Dried or freshly chopped dill leaves are used... fruiting tops may be used either fresh or dried.', 'https://www.growables.org/informationVeg/documents/Dill.pdf', false, 'approved', null, null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('aa7f8f80-30bb-5ae0-b771-8b62051df095'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'profile.workbook_presence', '{"bed_name":"Orchard A Companion Guild Layer","catalog_slug":"dill","notes":"Planned northwest of trunk, alternating with bee balm.","plant_name":"Dill","sheet_name":"wishlist","zone_name":"Orchard A (West Orchard)"}'::jsonb, 'unknown', 0.3, 1, 1, 'fdaf6227-658b-5c93-bb0c-79c9776811b5'::uuid, 'Planned northwest of trunk, alternating with bee balm.', null, false, 'needs_more_evidence', 'Preston property plan', null, false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('c8660dd5-da21-58b5-9746-7c7dbd54e078'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'cultivar.days_to_maturity', '{"extension_days":70,"interpretation":"Use 65-70 days for seed-head maturity planning.","long_island_mammoth_days":65}'::jsonb, 'moderate', 0.78, 1, 1, '233be446-1d0d-58dd-b03d-16ad80239ca3'::uuid, 'Mammoth (70 days) Large vigorous plant, matures quickly.', 'https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/dill/', false, 'approved', null, 'Mammoth', false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('546fd10e-bbad-5f98-867b-1297e7768e8a'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'cultivar.mature_size', '{"mature_height_max_in":59,"mature_height_min_in":39,"mature_width_max_in":39,"mature_width_min_in":20}'::jsonb, 'moderate', 0.82, 1, 1, '67208523-2a84-5fe5-aac8-17feb63b9fba'::uuid, 'Ultimate height 1–1.5 metres; spread 0.5–1 metres.', 'https://www.rhs.org.uk/plants/172992/anethum-graveolens-mammoth-dill-mammoth/details', false, 'approved', null, 'Mammoth', false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)
values ('3f1f6a22-0fb2-5fd2-9c7d-266e0a985354'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'cultivar.use_emphasis', '{"habit":"larger robust variety","primary_use":["seed heads","pickling","fresh leaves","cut scented foliage"]}'::jsonb, 'moderate', 0.78, 1, 1, '67208523-2a84-5fe5-aac8-17feb63b9fba'::uuid, 'Popular and slightly larger robust variety... leaves, flowers and aromatic seeds are all edible.', 'https://www.rhs.org.uk/plants/172992/anethum-graveolens-mammoth-dill-mammoth/details', false, 'approved', null, 'Mammoth', false, false, false, null)
on conflict (id) do update set
  value_json = excluded.value_json,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_id = excluded.source_id,
  source_quote_or_excerpt = excluded.source_quote_or_excerpt,
  source_url = excluded.source_url,
  reviewed_by_human = excluded.reviewed_by_human,
  review_status = excluded.review_status,
  region_scope = excluded.region_scope,
  cultivar_scope = excluded.cultivar_scope,
  ai_generated_summary = excluded.ai_generated_summary,
  human_verified = excluded.human_verified,
  conflict_flag = excluded.conflict_flag,
  region_specific_conflict_notes = excluded.region_specific_conflict_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('dedb3b05-220b-5802-ad5e-9a35972aa353'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'sun_need', 4, 'Full sun crop; best leaf and seed production needs strong direct light.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('ef8abea9-2ede-54e3-ad5f-cae1be60f4a1'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'shade_tolerance', 2, 'Can tolerate light relief in hot weather, but shade reduces performance.', 'weak', 0.58, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('793fc32c-c9cc-5f07-a579-75875062b83a'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'afternoon_sun_tolerance', 3, 'Handles full sun when soil moisture is even; hot weather speeds bolting.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('c6685a16-d9ba-5969-8981-ff8a06a80137'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'water_need', 3, 'Medium water need; moist, well-drained soil is preferred.', 'strong', 0.84, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('d6e45271-9537-510d-9fc6-e5ec47321cf4'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'drought_tolerance', 2, 'Not a true drought herb; dry stress accelerates decline and bolting.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('8ccc54b2-2557-55f1-8947-f8a26206be5f'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'wet_feet_tolerance', 1, 'Requires drainage and is not suited to waterlogged soil.', 'strong', 0.84, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('b8f7a7c5-5302-549f-a874-e1d837e671a0'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'soil_drainage_need', 4, 'Well-drained soil is consistently recommended.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('f696a5be-dbe8-5e65-9540-3c289e6d1d66'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'soil_fertility_need', 2, 'Can grow in poor soil but performs best in loamy soil.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('15429deb-adfc-5b38-ad9b-1960c7b05653'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'soil_compaction_tolerance', 2, 'Taproot and direct-sow preference imply low tolerance for compaction/disturbance.', 'weak', 0.58, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('f5a868d3-7071-5183-ad1f-6b696ae23701'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'soil_texture_flexibility', 4, 'Tolerates vegetable-garden soils when drainage is adequate.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('acfb9513-eaa3-5d59-8da1-3eeb26bc75cf'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'maintenance_need', 3, 'Needs space, thinning, and seed-head/self-sowing management.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('083f0dab-5cd0-5bdc-852e-b6df804ec7ce'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'beginner_friendliness', 4, 'Easy direct-sown herb if not transplanted and succession-sown.', 'moderate', 0.76, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('d28300c8-80da-5a2e-9ba2-5f3d9678fe4e'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'spread_aggressiveness', 3, 'Can reseed readily if seed heads are left in place.', 'moderate', 0.78, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('ca3e6fe8-1426-5e40-8220-e7ff9e09ad4d'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'container_suitability', 2, 'Possible in large/deep containers but less suitable because of tall, vigorous habit.', 'strong', 0.82, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('f05419d1-b44d-5bc7-aac3-808a1724b6f5'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'transplant_tolerance', 1, 'Taproot makes transplanting difficult; direct sow is preferred.', 'strong', 0.86, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('99519a9a-a01f-520f-9351-19d0dc7e9060'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'pollinator_value', 4, 'Large umbels and RHS pollinator listing support high insectary value.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('6a88daaf-d894-53fe-b5ec-b50d2aaaa84a'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'wildlife_food_value', 2, 'Not primarily grown as wildlife food; value is mostly insect floral resource.', 'weak', 0.5, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('a2985963-0e7b-5635-af00-49890fae67a4'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'erosion_control_value', 1, 'Annual herb with limited soil-stabilizing role.', 'weak', 0.45, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('408f5d33-a2e9-5cfc-97c7-153295a069c9'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'biomass_value', 2, 'Moderate annual foliage but not a major biomass plant.', 'weak', 0.5, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('29e97064-1420-5693-bb9c-8b758d406241'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'invasive_risk', 2, 'Self-seeds readily but is generally manageable in garden context.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('2339d592-a4ff-5472-b961-61ae819119e9'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'disease_susceptibility', 3, 'Downy mildew and powdery mildew are listed concerns.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('fb4a8125-b7a5-53c8-9bb1-08d53b9c3d76'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'pest_susceptibility', 3, 'Aphids, army worm, and cut worm are listed concerns.', 'moderate', 0.72, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('3968c057-b58e-51f3-a557-d28a59712ffa'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'humidity_disease_risk', 3, 'Mildew risk makes airflow and spacing relevant in humid sites.', 'moderate', 0.68, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('3421b38c-fac8-5efd-aefa-6117f97b4c26'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'deer_resistance', 3, 'Aromatic foliage may help, but source support is cultivar/vendor-level and context dependent.', 'weak', 0.48, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)
values ('44afdc6b-2b87-516b-9667-95c48fad4dd5'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), 'rabbit_resistance', 2, 'No strong source-backed resistance claim; treat as vulnerable until observed.', 'unknown', 0.35, 'Derived from Dill extension/source-enriched profile.')
on conflict (plant_profile_id, dimension_code) do update set
  rating = excluded.rating,
  description = excluded.description,
  evidence_strength_code = excluded.evidence_strength_code,
  confidence_score = excluded.confidence_score,
  source_notes = excluded.source_notes,
  updated_at = now();

insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)
values ('32d6239e-8562-55c1-8765-c1b0b3914cfc'::uuid, (select id from catalog.plant_profiles where slug = 'mammoth-dill' and deleted_at is null), null, 'flowering', '/art/specimen-herbarium-sheet.svg', 'art/specimen-herbarium-sheet.svg', 'image/svg+xml', null, null, 'Garden.io placeholder specimen illustration', 'internal placeholder', true, true)
on conflict (id) do update set
  source_id = excluded.source_id,
  stage_code = excluded.stage_code,
  image_url = excluded.image_url,
  storage_key = excluded.storage_key,
  mime_type = excluded.mime_type,
  width_px = excluded.width_px,
  height_px = excluded.height_px,
  attribution_text = excluded.attribution_text,
  license = excluded.license,
  is_primary = excluded.is_primary,
  is_public = excluded.is_public,
  updated_at = now();

commit;
