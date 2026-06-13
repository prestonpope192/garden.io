begin;

create extension if not exists pgcrypto;

-- blueberry
insert into catalog.plant_taxa (
  id, kingdom_name, family_name, genus_name, species_name, subspecies_name, variety_name,
  botanical_name_full, taxon_rank, native_range, origin_type
) values (
  'fa7119a1-2e0d-5473-84ce-77b2ec5d3865'::uuid, 'Plantae', null, 'blueberry', null, null, null, 'Blueberry', 'unknown', null, 'unknown'
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
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('blueberry') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Blueberry', 'common', 'en', true)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_profiles (
  id, plant_taxon_id, slug, display_name, plant_type_code, lifecycle_type,
  confidence_score, evidence_count, source_count, source_last_reviewed_at,
  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,
  is_ai_generated, generation_status, is_published, review_status
) values (
  'e40c8539-21dd-5fcb-b594-18b1f6ea3274'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('blueberry') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'blueberry', 'Blueberry', 'shrub', 'unknown', 0.2, 1, 1, '2026-06-03T16:14:32.008687+00:00', false, false, false, null, false, 'community_generated', false, 'draft'
)
on conflict (slug) where deleted_at is null do update set
  plant_taxon_id = excluded.plant_taxon_id,
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

insert into catalog.plant_profile_narratives (plant_profile_id, locale, short_description, why_plant_it, pros_summary, cons_summary, primary_use_cases, notes_for_homestead, notes_for_small_garden, notes_for_container_growing, editorial_summary)
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), 'en', 'Blueberry imported as a draft catalog plant from the March 2026 Garden.io starter workbook.', null, null, null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: plants. Candidate/actual zone: Berry Barn Bed. Candidate/actual bed: Berry Barn Bed.', null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), 'unknown', '{}'::text[], null, null, null, null)
on conflict (plant_profile_id) do update set
  evergreen_deciduous = excluded.evergreen_deciduous,
  ornamental_season_interest = excluded.ornamental_season_interest,
  visual_texture = excluded.visual_texture,
  foliage_color = excluded.foliage_color,
  evergreen_foliage = excluded.evergreen_foliage,
  winter_interest = excluded.winter_interest,
  updated_at = now();

insert into catalog.plant_climate_profiles (plant_profile_id, usda_hardiness_min, usda_hardiness_max, ahs_heat_zone_min, ahs_heat_zone_max, cold_tolerance_absolute_f, cold_tolerance_established_f, heat_tolerance_f, humidity_tolerance_code, drought_tolerance_code, flood_tolerance_code, wind_tolerance_code, salt_tolerance_code, chill_hours_min, chill_hours_max, frost_tender, reemergence_after_freeze_behavior, sun_min_hours, sun_max_hours, preferred_light, shade_tolerance_score, afternoon_sun_tolerance_score, reflected_heat_tolerance_score)
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), null, null, null, null, null, null, null, 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), null, null, null, null, null, null, 'unknown', null, null, null, null, null, null, null, null)
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

insert into catalog.plant_flowering_profiles (plant_profile_id, flowering_bool, flower_color, flower_size, bloom_start_week, bloom_end_week, bloom_duration_days, flower_abundance, flower_fragrance_strength, pollinator_value, nectar_value, pollen_value, attracts_bees, attracts_butterflies, attracts_hummingbirds, larval_host, native_pollinator_value)
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}'::text[], '{}'::text[], '{}'::text[])
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
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), null, null, 'unknown', 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', '{}'::jsonb, '{}'::text[], null)
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
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), 'medium', 'unknown', 'unknown', null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), 'unknown', null, null, null, null, null)
on conflict (plant_profile_id) do update set
  invasive_risk_code = excluded.invasive_risk_code,
  wildlife_food_value = excluded.wildlife_food_value,
  erosion_control_value = excluded.erosion_control_value,
  biomass_value = excluded.biomass_value,
  compost_value = excluded.compost_value,
  chop_drop_value = excluded.chop_drop_value,
  updated_at = now();

insert into catalog.plant_maintenance_profiles (plant_profile_id, pruning_frequency, deadheading_helpful, division_interval_years, staking_needed, suckering_management, cleanup_intensity, disease_susceptibility_level, pest_susceptibility_level, humidity_disease_risk, air_flow_importance)
values ((select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), null, null, null, null, null, null, null, null, null, null)
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

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('f40bffd5-6704-504c-ae53-cc497ebc2f19'::uuid, (select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), 'human', 'unknown', '{}'::text[], 'Safety not yet curated; draft record only.', null, 'curation_needed', 'Do not use edible, medicinal, livestock, or pet-safety assumptions until source-enriched.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('892bf8e1-561e-5eb7-a2ff-d452742afe79'::uuid, 'Garden.io March 2026 starter workbook', 'internal_curation', 'Garden.io', null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07', null, 0.3, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: plants. Candidate/actual zone: Berry Barn Bed. Candidate/actual bed: Berry Barn Bed.', '2026-06-03T16:14:32.008687+00:00')
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
values ('4e83d368-63c6-5af8-a677-7232812ffe03'::uuid, (select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), 'profile.workbook_presence', '{"bed_name":"Berry Barn Bed","catalog_slug":"blueberry","notes":null,"plant_name":"Blueberry \u2014 Brightwell","quantity":"1","sheet_name":"plants","status":"growing","zone_name":"Berry Barn Bed"}'::jsonb, 'unknown', 0.3, 1, 1, '892bf8e1-561e-5eb7-a2ff-d452742afe79'::uuid, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: plants. Candidate/actual zone: Berry Barn Bed. Candidate/actual bed: Berry Barn Bed.', null, false, 'needs_more_evidence', null, null, false, false, false, null)
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

insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)
values ('903203ee-db36-576f-9030-4648cf722cf3'::uuid, (select id from catalog.plant_profiles where slug = 'blueberry' and deleted_at is null), null, null, '/art/specimen-herbarium-sheet.svg', 'art/specimen-herbarium-sheet.svg', 'image/svg+xml', null, null, 'Garden.io placeholder specimen illustration', 'internal placeholder', true, true)
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

-- comfrey
insert into catalog.plant_taxa (
  id, kingdom_name, family_name, genus_name, species_name, subspecies_name, variety_name,
  botanical_name_full, taxon_rank, native_range, origin_type
) values (
  'e25b19fa-1e87-56bc-9d8b-097c326d28ef'::uuid, 'Plantae', null, 'comfrey', null, null, null, 'Comfrey', 'unknown', null, 'unknown'
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
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('comfrey') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Comfrey', 'common', 'en', true)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_profiles (
  id, plant_taxon_id, slug, display_name, plant_type_code, lifecycle_type,
  confidence_score, evidence_count, source_count, source_last_reviewed_at,
  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,
  is_ai_generated, generation_status, is_published, review_status
) values (
  'ab0424db-3f6c-5cb6-856d-ddcbc8af6c11'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('comfrey') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'comfrey', 'Comfrey', 'herb', 'unknown', 0.2, 1, 1, '2026-06-03T16:14:32.009027+00:00', false, false, false, null, false, 'community_generated', false, 'draft'
)
on conflict (slug) where deleted_at is null do update set
  plant_taxon_id = excluded.plant_taxon_id,
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

insert into catalog.plant_profile_narratives (plant_profile_id, locale, short_description, why_plant_it, pros_summary, cons_summary, primary_use_cases, notes_for_homestead, notes_for_small_garden, notes_for_container_growing, editorial_summary)
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), 'en', 'Comfrey imported as a draft catalog plant from the March 2026 Garden.io starter workbook.', null, null, null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Workbook notes: Planned for downhill east side of each Orchard A tree, ~3 ft out.', null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), 'unknown', '{}'::text[], null, null, null, null)
on conflict (plant_profile_id) do update set
  evergreen_deciduous = excluded.evergreen_deciduous,
  ornamental_season_interest = excluded.ornamental_season_interest,
  visual_texture = excluded.visual_texture,
  foliage_color = excluded.foliage_color,
  evergreen_foliage = excluded.evergreen_foliage,
  winter_interest = excluded.winter_interest,
  updated_at = now();

insert into catalog.plant_climate_profiles (plant_profile_id, usda_hardiness_min, usda_hardiness_max, ahs_heat_zone_min, ahs_heat_zone_max, cold_tolerance_absolute_f, cold_tolerance_established_f, heat_tolerance_f, humidity_tolerance_code, drought_tolerance_code, flood_tolerance_code, wind_tolerance_code, salt_tolerance_code, chill_hours_min, chill_hours_max, frost_tender, reemergence_after_freeze_behavior, sun_min_hours, sun_max_hours, preferred_light, shade_tolerance_score, afternoon_sun_tolerance_score, reflected_heat_tolerance_score)
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), null, null, null, null, null, null, null, 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), null, null, null, null, null, null, 'unknown', null, null, null, null, null, null, null, null)
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

insert into catalog.plant_flowering_profiles (plant_profile_id, flowering_bool, flower_color, flower_size, bloom_start_week, bloom_end_week, bloom_duration_days, flower_abundance, flower_fragrance_strength, pollinator_value, nectar_value, pollen_value, attracts_bees, attracts_butterflies, attracts_hummingbirds, larval_host, native_pollinator_value)
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}'::text[], '{}'::text[], '{}'::text[])
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
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), null, null, 'unknown', 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', '{}'::jsonb, '{}'::text[], null)
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
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), 'medium', 'unknown', 'unknown', null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), 'unknown', null, null, null, null, null)
on conflict (plant_profile_id) do update set
  invasive_risk_code = excluded.invasive_risk_code,
  wildlife_food_value = excluded.wildlife_food_value,
  erosion_control_value = excluded.erosion_control_value,
  biomass_value = excluded.biomass_value,
  compost_value = excluded.compost_value,
  chop_drop_value = excluded.chop_drop_value,
  updated_at = now();

insert into catalog.plant_maintenance_profiles (plant_profile_id, pruning_frequency, deadheading_helpful, division_interval_years, staking_needed, suckering_management, cleanup_intensity, disease_susceptibility_level, pest_susceptibility_level, humidity_disease_risk, air_flow_importance)
values ((select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), null, null, null, null, null, null, null, null, null, null)
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

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('f9afd669-c50c-5f9f-ba31-800220d381ea'::uuid, (select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), 'human', 'unknown', '{}'::text[], 'Safety not yet curated; draft record only.', null, 'curation_needed', 'Do not use edible, medicinal, livestock, or pet-safety assumptions until source-enriched.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('ec7cd73d-3699-52f6-8786-f88809ca9a1c'::uuid, 'Garden.io March 2026 starter workbook', 'internal_curation', 'Garden.io', null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07', null, 0.3, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Workbook notes: Planned for downhill east side of each Orchard A tree, ~3 ft out.', '2026-06-03T16:14:32.009027+00:00')
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
values ('a8dec7f0-21da-53b1-b9b4-fb2fe3529635'::uuid, (select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), 'profile.workbook_presence', '{"bed_name":"Orchard A Companion Guild Layer","catalog_slug":"comfrey","notes":"Planned for downhill east side of each Orchard A tree, ~3 ft out.","plant_name":"Comfrey","quantity":null,"sheet_name":"wishlist","status":null,"zone_name":"Orchard A (West Orchard)"}'::jsonb, 'unknown', 0.3, 1, 1, 'ec7cd73d-3699-52f6-8786-f88809ca9a1c'::uuid, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Workbook notes: Planned for downhill east side of each Orchard A tree, ~3 ft out.', null, false, 'needs_more_evidence', null, null, false, false, false, null)
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

insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)
values ('87c527a3-9eaa-57bd-a7e8-7103f8f5130a'::uuid, (select id from catalog.plant_profiles where slug = 'comfrey' and deleted_at is null), null, null, '/art/specimen-herbarium-sheet.svg', 'art/specimen-herbarium-sheet.svg', 'image/svg+xml', null, null, 'Garden.io placeholder specimen illustration', 'internal placeholder', true, true)
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
  '70d2e20b-a682-590d-bc17-d7395d00da0e'::uuid, 'Plantae', null, 'dill', null, null, null, 'Dill', 'unknown', null, 'unknown'
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
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('dill') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Dill', 'common', 'en', true)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_profiles (
  id, plant_taxon_id, slug, display_name, plant_type_code, lifecycle_type,
  confidence_score, evidence_count, source_count, source_last_reviewed_at,
  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,
  is_ai_generated, generation_status, is_published, review_status
) values (
  'b5d84b22-3aa8-5892-b9fc-56aeeb5594c9'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('dill') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'dill', 'Dill', 'herb', 'unknown', 0.2, 1, 1, '2026-06-03T16:14:32.009246+00:00', false, false, false, null, false, 'community_generated', false, 'draft'
)
on conflict (slug) where deleted_at is null do update set
  plant_taxon_id = excluded.plant_taxon_id,
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

insert into catalog.plant_profile_narratives (plant_profile_id, locale, short_description, why_plant_it, pros_summary, cons_summary, primary_use_cases, notes_for_homestead, notes_for_small_garden, notes_for_container_growing, editorial_summary)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'en', 'Dill imported as a draft catalog plant from the March 2026 Garden.io starter workbook.', null, null, null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Workbook notes: Planned northwest of trunk, alternating with bee balm.', null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'unknown', '{}'::text[], null, null, null, null)
on conflict (plant_profile_id) do update set
  evergreen_deciduous = excluded.evergreen_deciduous,
  ornamental_season_interest = excluded.ornamental_season_interest,
  visual_texture = excluded.visual_texture,
  foliage_color = excluded.foliage_color,
  evergreen_foliage = excluded.evergreen_foliage,
  winter_interest = excluded.winter_interest,
  updated_at = now();

insert into catalog.plant_climate_profiles (plant_profile_id, usda_hardiness_min, usda_hardiness_max, ahs_heat_zone_min, ahs_heat_zone_max, cold_tolerance_absolute_f, cold_tolerance_established_f, heat_tolerance_f, humidity_tolerance_code, drought_tolerance_code, flood_tolerance_code, wind_tolerance_code, salt_tolerance_code, chill_hours_min, chill_hours_max, frost_tender, reemergence_after_freeze_behavior, sun_min_hours, sun_max_hours, preferred_light, shade_tolerance_score, afternoon_sun_tolerance_score, reflected_heat_tolerance_score)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, null, null, null, null, null, null, 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, null, null, null, null, null, 'unknown', null, null, null, null, null, null, null, null)
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

insert into catalog.plant_flowering_profiles (plant_profile_id, flowering_bool, flower_color, flower_size, bloom_start_week, bloom_end_week, bloom_duration_days, flower_abundance, flower_fragrance_strength, pollinator_value, nectar_value, pollen_value, attracts_bees, attracts_butterflies, attracts_hummingbirds, larval_host, native_pollinator_value)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}'::text[], '{}'::text[], '{}'::text[])
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
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, null, 'unknown', 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', '{}'::jsonb, '{}'::text[], null)
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
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'medium', 'unknown', 'unknown', null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'unknown', null, null, null, null, null)
on conflict (plant_profile_id) do update set
  invasive_risk_code = excluded.invasive_risk_code,
  wildlife_food_value = excluded.wildlife_food_value,
  erosion_control_value = excluded.erosion_control_value,
  biomass_value = excluded.biomass_value,
  compost_value = excluded.compost_value,
  chop_drop_value = excluded.chop_drop_value,
  updated_at = now();

insert into catalog.plant_maintenance_profiles (plant_profile_id, pruning_frequency, deadheading_helpful, division_interval_years, staking_needed, suckering_management, cleanup_intensity, disease_susceptibility_level, pest_susceptibility_level, humidity_disease_risk, air_flow_importance)
values ((select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, null, null, null, null, null, null, null, null, null)
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

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('b6e22fda-6283-5bf3-9c4c-beeb94fe7f08'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'human', 'unknown', '{}'::text[], 'Safety not yet curated; draft record only.', null, 'curation_needed', 'Do not use edible, medicinal, livestock, or pet-safety assumptions until source-enriched.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('fdaf6227-658b-5c93-bb0c-79c9776811b5'::uuid, 'Garden.io March 2026 starter workbook', 'internal_curation', 'Garden.io', null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07', null, 0.3, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Workbook notes: Planned northwest of trunk, alternating with bee balm.', '2026-06-03T16:14:32.009246+00:00')
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
values ('aea8aefd-dccd-5809-81d8-8172747b13a2'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), 'profile.workbook_presence', '{"bed_name":"Orchard A Companion Guild Layer","catalog_slug":"dill","notes":"Planned northwest of trunk, alternating with bee balm.","plant_name":"Dill","quantity":null,"sheet_name":"wishlist","status":null,"zone_name":"Orchard A (West Orchard)"}'::jsonb, 'unknown', 0.3, 1, 1, 'fdaf6227-658b-5c93-bb0c-79c9776811b5'::uuid, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Orchard A (West Orchard). Candidate/actual bed: Orchard A Companion Guild Layer. Workbook notes: Planned northwest of trunk, alternating with bee balm.', null, false, 'needs_more_evidence', null, null, false, false, false, null)
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

insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)
values ('eac54ced-9dc1-52ba-b7f6-c2a9c686a62f'::uuid, (select id from catalog.plant_profiles where slug = 'dill' and deleted_at is null), null, null, '/art/specimen-herbarium-sheet.svg', 'art/specimen-herbarium-sheet.svg', 'image/svg+xml', null, null, 'Garden.io placeholder specimen illustration', 'internal placeholder', true, true)
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

-- meyer-lemon
insert into catalog.plant_taxa (
  id, kingdom_name, family_name, genus_name, species_name, subspecies_name, variety_name,
  botanical_name_full, taxon_rank, native_range, origin_type
) values (
  '534c5f32-9120-509c-8ee7-b101b2760124'::uuid, 'Plantae', null, 'meyer_lemon', null, null, null, 'Meyer Lemon', 'unknown', null, 'unknown'
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
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('meyer_lemon') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Meyer Lemon', 'common', 'en', true)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_profiles (
  id, plant_taxon_id, slug, display_name, plant_type_code, lifecycle_type,
  confidence_score, evidence_count, source_count, source_last_reviewed_at,
  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,
  is_ai_generated, generation_status, is_published, review_status
) values (
  '1d11b3e3-8523-525f-bf0d-af9f6eafaa6a'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('meyer_lemon') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'meyer-lemon', 'Meyer Lemon', 'tree', 'unknown', 0.2, 1, 1, '2026-06-03T16:14:32.009424+00:00', false, false, false, null, false, 'community_generated', false, 'draft'
)
on conflict (slug) where deleted_at is null do update set
  plant_taxon_id = excluded.plant_taxon_id,
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

insert into catalog.plant_profile_narratives (plant_profile_id, locale, short_description, why_plant_it, pros_summary, cons_summary, primary_use_cases, notes_for_homestead, notes_for_small_garden, notes_for_container_growing, editorial_summary)
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), 'en', 'Meyer Lemon imported as a draft catalog plant from the March 2026 Garden.io starter workbook.', null, null, null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Citrus / Subtropical Planning. Candidate/actual bed: Citrus/Subtropical TBD Holding Area. Workbook notes: TBD placement; current public catalog may include Meyer lemon, verify slug.', null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), 'unknown', '{}'::text[], null, null, null, null)
on conflict (plant_profile_id) do update set
  evergreen_deciduous = excluded.evergreen_deciduous,
  ornamental_season_interest = excluded.ornamental_season_interest,
  visual_texture = excluded.visual_texture,
  foliage_color = excluded.foliage_color,
  evergreen_foliage = excluded.evergreen_foliage,
  winter_interest = excluded.winter_interest,
  updated_at = now();

insert into catalog.plant_climate_profiles (plant_profile_id, usda_hardiness_min, usda_hardiness_max, ahs_heat_zone_min, ahs_heat_zone_max, cold_tolerance_absolute_f, cold_tolerance_established_f, heat_tolerance_f, humidity_tolerance_code, drought_tolerance_code, flood_tolerance_code, wind_tolerance_code, salt_tolerance_code, chill_hours_min, chill_hours_max, frost_tender, reemergence_after_freeze_behavior, sun_min_hours, sun_max_hours, preferred_light, shade_tolerance_score, afternoon_sun_tolerance_score, reflected_heat_tolerance_score)
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), null, null, null, null, null, null, null, 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), null, null, null, null, null, null, 'unknown', null, null, null, null, null, null, null, null)
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

insert into catalog.plant_flowering_profiles (plant_profile_id, flowering_bool, flower_color, flower_size, bloom_start_week, bloom_end_week, bloom_duration_days, flower_abundance, flower_fragrance_strength, pollinator_value, nectar_value, pollen_value, attracts_bees, attracts_butterflies, attracts_hummingbirds, larval_host, native_pollinator_value)
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}'::text[], '{}'::text[], '{}'::text[])
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
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), null, null, 'unknown', 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', '{}'::jsonb, '{}'::text[], null)
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
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), 'medium', 'unknown', 'unknown', null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), 'unknown', null, null, null, null, null)
on conflict (plant_profile_id) do update set
  invasive_risk_code = excluded.invasive_risk_code,
  wildlife_food_value = excluded.wildlife_food_value,
  erosion_control_value = excluded.erosion_control_value,
  biomass_value = excluded.biomass_value,
  compost_value = excluded.compost_value,
  chop_drop_value = excluded.chop_drop_value,
  updated_at = now();

insert into catalog.plant_maintenance_profiles (plant_profile_id, pruning_frequency, deadheading_helpful, division_interval_years, staking_needed, suckering_management, cleanup_intensity, disease_susceptibility_level, pest_susceptibility_level, humidity_disease_risk, air_flow_importance)
values ((select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), null, null, null, null, null, null, null, null, null, null)
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

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('9e15e3cf-f557-5395-91eb-c96e183effd6'::uuid, (select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), 'human', 'unknown', '{}'::text[], 'Safety not yet curated; draft record only.', null, 'curation_needed', 'Do not use edible, medicinal, livestock, or pet-safety assumptions until source-enriched.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('9a161aed-c588-5da4-8c33-0094dd2a1165'::uuid, 'Garden.io March 2026 starter workbook', 'internal_curation', 'Garden.io', null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07', null, 0.3, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Citrus / Subtropical Planning. Candidate/actual bed: Citrus/Subtropical TBD Holding Area. Workbook notes: TBD placement; current public catalog may include Meyer lemon, verify slug.', '2026-06-03T16:14:32.009424+00:00')
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
values ('c12b5f6e-d0c6-53c5-8c88-35648384ae50'::uuid, (select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), 'profile.workbook_presence', '{"bed_name":"Citrus/Subtropical TBD Holding Area","catalog_slug":"meyer-lemon","notes":"TBD placement; current public catalog may include Meyer lemon, verify slug.","plant_name":"Meyer Lemon","quantity":null,"sheet_name":"wishlist","status":null,"zone_name":"Citrus / Subtropical Planning"}'::jsonb, 'unknown', 0.3, 1, 1, '9a161aed-c588-5da4-8c33-0094dd2a1165'::uuid, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Candidate/actual zone: Citrus / Subtropical Planning. Candidate/actual bed: Citrus/Subtropical TBD Holding Area. Workbook notes: TBD placement; current public catalog may include Meyer lemon, verify slug.', null, false, 'needs_more_evidence', null, null, false, false, false, null)
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

insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)
values ('2523227e-4e5d-5361-b7d2-e6eb2e770ead'::uuid, (select id from catalog.plant_profiles where slug = 'meyer-lemon' and deleted_at is null), null, null, '/art/specimen-herbarium-sheet.svg', 'art/specimen-herbarium-sheet.svg', 'image/svg+xml', null, null, 'Garden.io placeholder specimen illustration', 'internal placeholder', true, true)
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

-- strawberry
insert into catalog.plant_taxa (
  id, kingdom_name, family_name, genus_name, species_name, subspecies_name, variety_name,
  botanical_name_full, taxon_rank, native_range, origin_type
) values (
  '6fa36d5e-acf0-53ff-96a5-02d468933a0f'::uuid, 'Plantae', null, 'strawberry', null, null, null, 'Strawberry', 'unknown', null, 'unknown'
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
values ((select id from catalog.plant_taxa where lower(genus_name) = lower('strawberry') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'Strawberry', 'common', 'en', true)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set
  is_primary = excluded.is_primary,
  updated_at = now();

insert into catalog.plant_profiles (
  id, plant_taxon_id, slug, display_name, plant_type_code, lifecycle_type,
  confidence_score, evidence_count, source_count, source_last_reviewed_at,
  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,
  is_ai_generated, generation_status, is_published, review_status
) values (
  '32e531f4-1c49-59c7-a06c-dafb74129860'::uuid, (select id from catalog.plant_taxa where lower(genus_name) = lower('strawberry') and coalesce(lower(species_name), '') = coalesce(lower(null), '') and coalesce(lower(subspecies_name), '') = coalesce(lower(null), '') and coalesce(lower(variety_name), '') = coalesce(lower(null), '') limit 1), 'strawberry', 'Strawberry', 'groundcover', 'unknown', 0.2, 1, 1, '2026-06-03T16:14:32.009592+00:00', false, false, false, null, false, 'community_generated', false, 'draft'
)
on conflict (slug) where deleted_at is null do update set
  plant_taxon_id = excluded.plant_taxon_id,
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

insert into catalog.plant_profile_narratives (plant_profile_id, locale, short_description, why_plant_it, pros_summary, cons_summary, primary_use_cases, notes_for_homestead, notes_for_small_garden, notes_for_container_growing, editorial_summary)
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), 'en', 'Strawberry imported as a draft catalog plant from the March 2026 Garden.io starter workbook.', null, null, null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Workbook notes: Original strawberries are noted as all lost; only add if replacement is desired.', null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), 'unknown', '{}'::text[], null, null, null, null)
on conflict (plant_profile_id) do update set
  evergreen_deciduous = excluded.evergreen_deciduous,
  ornamental_season_interest = excluded.ornamental_season_interest,
  visual_texture = excluded.visual_texture,
  foliage_color = excluded.foliage_color,
  evergreen_foliage = excluded.evergreen_foliage,
  winter_interest = excluded.winter_interest,
  updated_at = now();

insert into catalog.plant_climate_profiles (plant_profile_id, usda_hardiness_min, usda_hardiness_max, ahs_heat_zone_min, ahs_heat_zone_max, cold_tolerance_absolute_f, cold_tolerance_established_f, heat_tolerance_f, humidity_tolerance_code, drought_tolerance_code, flood_tolerance_code, wind_tolerance_code, salt_tolerance_code, chill_hours_min, chill_hours_max, frost_tender, reemergence_after_freeze_behavior, sun_min_hours, sun_max_hours, preferred_light, shade_tolerance_score, afternoon_sun_tolerance_score, reflected_heat_tolerance_score)
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), null, null, null, null, null, null, null, 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), null, null, null, null, null, null, 'unknown', null, null, null, null, null, null, null, null)
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

insert into catalog.plant_flowering_profiles (plant_profile_id, flowering_bool, flower_color, flower_size, bloom_start_week, bloom_end_week, bloom_duration_days, flower_abundance, flower_fragrance_strength, pollinator_value, nectar_value, pollen_value, attracts_bees, attracts_butterflies, attracts_hummingbirds, larval_host, native_pollinator_value)
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}'::text[], '{}'::text[], '{}'::text[])
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
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), null, null, 'unknown', 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', null, null, null, null, 'unknown', '{}'::jsonb, '{}'::text[], null)
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
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), 'medium', 'unknown', 'unknown', null, null, null, null, null)
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
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), 'unknown', null, null, null, null, null)
on conflict (plant_profile_id) do update set
  invasive_risk_code = excluded.invasive_risk_code,
  wildlife_food_value = excluded.wildlife_food_value,
  erosion_control_value = excluded.erosion_control_value,
  biomass_value = excluded.biomass_value,
  compost_value = excluded.compost_value,
  chop_drop_value = excluded.chop_drop_value,
  updated_at = now();

insert into catalog.plant_maintenance_profiles (plant_profile_id, pruning_frequency, deadheading_helpful, division_interval_years, staking_needed, suckering_management, cleanup_intensity, disease_susceptibility_level, pest_susceptibility_level, humidity_disease_risk, air_flow_importance)
values ((select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), null, null, null, null, null, null, null, null, null, null)
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

insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)
values ('1445f260-e306-5b60-8190-78f06096754b'::uuid, (select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), 'human', 'unknown', '{}'::text[], 'Safety not yet curated; draft record only.', null, 'curation_needed', 'Do not use edible, medicinal, livestock, or pet-safety assumptions until source-enriched.')
on conflict (plant_profile_id, subject_type_code) do update set
  safety_level_code = excluded.safety_level_code,
  toxic_parts = excluded.toxic_parts,
  condition_notes = excluded.condition_notes,
  symptoms = excluded.symptoms,
  evidence_source_type = excluded.evidence_source_type,
  safe_use_notes = excluded.safe_use_notes,
  updated_at = now();

insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)
values ('0c88d0a9-79f0-5f00-a879-f520006c0c86'::uuid, 'Garden.io March 2026 starter workbook', 'internal_curation', 'Garden.io', null, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07', null, 0.3, null, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Workbook notes: Original strawberries are noted as all lost; only add if replacement is desired.', '2026-06-03T16:14:32.009592+00:00')
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
values ('01531552-4949-57c7-9dad-5038af38eaa6'::uuid, (select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), 'profile.workbook_presence', '{"bed_name":null,"catalog_slug":"strawberry","notes":"Original strawberries are noted as all lost; only add if replacement is desired.","plant_name":"Strawberry replacement","quantity":null,"sheet_name":"wishlist","status":null,"zone_name":null}'::jsonb, 'unknown', 0.3, 1, 1, '0c88d0a9-79f0-5f00-a879-f520006c0c86'::uuid, 'Source: Plants list as of March 2026.docx; last modified 2026-03-07 Workbook sheet: wishlist. Workbook notes: Original strawberries are noted as all lost; only add if replacement is desired.', null, false, 'needs_more_evidence', null, null, false, false, false, null)
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

insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)
values ('4fb56dc2-aac8-57b5-b0e8-2068e4a94c2a'::uuid, (select id from catalog.plant_profiles where slug = 'strawberry' and deleted_at is null), null, null, '/art/specimen-herbarium-sheet.svg', 'art/specimen-herbarium-sheet.svg', 'image/svg+xml', null, null, 'Garden.io placeholder specimen illustration', 'internal placeholder', true, true)
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
