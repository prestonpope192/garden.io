-- Fully populate one canonical plant profile as a proof of concept.

begin;

-- Fully curated proof-of-concept profile: Acanthus mollis.
update catalog.plant_taxa
set
  family_name = 'Acanthaceae',
  genus_name = 'Acanthus',
  species_name = 'mollis',
  botanical_name_full = 'Acanthus mollis',
  taxon_rank = 'species',
  native_range = 'Mediterranean region',
  origin_type = 'exotic',
  updated_at = now()
where id = (select plant_taxon_id from catalog.plant_profiles where slug = 'acanthus');

insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
values
  ((select plant_taxon_id from catalog.plant_profiles where slug = 'acanthus'), 'Bear''s Breeches', 'common', 'en', true),
  ((select plant_taxon_id from catalog.plant_profiles where slug = 'acanthus'), 'Acanthus', 'common', 'en', false),
  ((select plant_taxon_id from catalog.plant_profiles where slug = 'acanthus'), 'Acanthus mollis', 'latin_variant', 'en', false)
on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update
set is_primary = excluded.is_primary,
    updated_at = now();

update catalog.plant_profiles
set
  display_name = 'Acanthus (Bear''s Breeches)',
  plant_type_code = 'forb',
  lifecycle_type = 'perennial',
  confidence_score = 0.82,
  evidence_count = 2,
  source_count = 2,
  source_last_reviewed_at = now(),
  ai_generated_summary = false,
  human_verified = true,
  conflict_flag = false,
  is_ai_generated = false,
  generation_status = 'human_curated',
  is_published = true,
  review_status = 'approved',
  updated_at = now()
where id = (select id from catalog.plant_profiles where slug = 'acanthus');

insert into catalog.plant_profile_narratives (
  plant_profile_id,
  locale,
  short_description,
  why_plant_it,
  pros_summary,
  cons_summary,
  primary_use_cases,
  notes_for_homestead,
  notes_for_small_garden,
  notes_for_container_growing
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  'en',
  'Architectural herbaceous perennial with glossy, deeply lobed foliage and upright flower spikes.',
  'Use as a bold foliage anchor in part-shade borders where a sculptural, formal, or woodland edge plant is useful.',
  'Strong visual structure, showy flower spikes, tolerates part shade, and can anchor mixed perennial plantings.',
  'Can spread from root sections and may be difficult to remove once established; avoid cramped or highly cultivated beds.',
  'Specimen planting, part-shade structure, formal border, woodland edge, Mediterranean-style perennial bed.',
  'Best treated as a placed perennial, not a casual filler. Plant where spread is acceptable or manageable.',
  'Use sparingly; root spread can be frustrating in tight beds.',
  'Container culture can help control spread but requires consistent moisture and winter protection in colder areas.'
)
on conflict (plant_profile_id, locale) do update
set short_description = excluded.short_description,
    why_plant_it = excluded.why_plant_it,
    pros_summary = excluded.pros_summary,
    cons_summary = excluded.cons_summary,
    primary_use_cases = excluded.primary_use_cases,
    notes_for_homestead = excluded.notes_for_homestead,
    notes_for_small_garden = excluded.notes_for_small_garden,
    notes_for_container_growing = excluded.notes_for_container_growing,
    updated_at = now();

insert into catalog.plant_ornamental_profiles (
  plant_profile_id,
  evergreen_deciduous,
  ornamental_season_interest,
  visual_texture,
  foliage_color,
  evergreen_foliage,
  winter_interest
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  'semi_evergreen',
  array['spring foliage', 'summer flowers', 'architectural seed heads'],
  'Bold, glossy, deeply lobed foliage with vertical flower spikes.',
  'Deep green',
  false,
  false
)
on conflict (plant_profile_id) do update
set evergreen_deciduous = excluded.evergreen_deciduous,
    ornamental_season_interest = excluded.ornamental_season_interest,
    visual_texture = excluded.visual_texture,
    foliage_color = excluded.foliage_color,
    evergreen_foliage = excluded.evergreen_foliage,
    winter_interest = excluded.winter_interest,
    updated_at = now();

insert into catalog.plant_profile_aesthetic_styles (plant_profile_id, style_code, weight_score)
values
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'formal', 8),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'woodland', 7)
on conflict (plant_profile_id, style_code) do update
set weight_score = excluded.weight_score;

insert into catalog.plant_profile_uses (
  plant_profile_id,
  use_type_code,
  evidence_strength_code,
  supports_use,
  mechanism_description,
  target_benefit,
  notes
)
values
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'pollinator_support', 'moderate', true, 'Tall flower spikes provide bloom structure and insect visitation value.', 'Seasonal floral resource', 'Ornamental perennial with pollinator-support value.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'cut_flower', 'weak', true, 'Architectural flower spikes can be cut for arrangements.', 'Cut stems', 'Use when flower spikes are clean and upright.')
on conflict (plant_profile_id, use_type_code) do update
set evidence_strength_code = excluded.evidence_strength_code,
    supports_use = excluded.supports_use,
    mechanism_description = excluded.mechanism_description,
    target_benefit = excluded.target_benefit,
    notes = excluded.notes,
    updated_at = now();

insert into catalog.plant_climate_profiles (
  plant_profile_id,
  usda_hardiness_min,
  usda_hardiness_max,
  cold_tolerance_absolute_f,
  cold_tolerance_established_f,
  heat_tolerance_f,
  humidity_tolerance_code,
  drought_tolerance_code,
  flood_tolerance_code,
  wind_tolerance_code,
  salt_tolerance_code,
  frost_tender,
  reemergence_after_freeze_behavior,
  sun_min_hours,
  sun_max_hours,
  preferred_light,
  shade_tolerance_score,
  afternoon_sun_tolerance_score,
  reflected_heat_tolerance_score
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  '7',
  '10',
  0,
  10,
  95,
  'medium',
  'medium',
  'low',
  'medium',
  'unknown',
  false,
  'May die back in colder winters and re-emerge from crown/root if protected.',
  3.0,
  8.0,
  'Full sun to part shade; afternoon shade preferred in hot sites.',
  7,
  5,
  4
)
on conflict (plant_profile_id) do update
set usda_hardiness_min = excluded.usda_hardiness_min,
    usda_hardiness_max = excluded.usda_hardiness_max,
    cold_tolerance_absolute_f = excluded.cold_tolerance_absolute_f,
    cold_tolerance_established_f = excluded.cold_tolerance_established_f,
    heat_tolerance_f = excluded.heat_tolerance_f,
    humidity_tolerance_code = excluded.humidity_tolerance_code,
    drought_tolerance_code = excluded.drought_tolerance_code,
    flood_tolerance_code = excluded.flood_tolerance_code,
    wind_tolerance_code = excluded.wind_tolerance_code,
    salt_tolerance_code = excluded.salt_tolerance_code,
    frost_tender = excluded.frost_tender,
    reemergence_after_freeze_behavior = excluded.reemergence_after_freeze_behavior,
    sun_min_hours = excluded.sun_min_hours,
    sun_max_hours = excluded.sun_max_hours,
    preferred_light = excluded.preferred_light,
    shade_tolerance_score = excluded.shade_tolerance_score,
    afternoon_sun_tolerance_score = excluded.afternoon_sun_tolerance_score,
    reflected_heat_tolerance_score = excluded.reflected_heat_tolerance_score,
    updated_at = now();

insert into catalog.plant_growth_profiles (
  plant_profile_id,
  mature_height_min_in,
  mature_height_max_in,
  mature_width_min_in,
  mature_width_max_in,
  annual_growth_height_in,
  annual_growth_width_in,
  growth_rate_code,
  growth_habit,
  root_behavior,
  spread_aggressiveness,
  pruning_response,
  transplant_tolerance,
  container_tolerance,
  trellis_needed,
  support_type
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  36,
  60,
  24,
  36,
  24,
  12,
  'medium',
  'Clump-forming herbaceous perennial with upright flower spikes.',
  'Creeping rootstocks; small root sections can resprout.',
  8,
  'Cut spent flower stalks after bloom; remove unwanted shoots promptly.',
  3,
  6,
  false,
  null
)
on conflict (plant_profile_id) do update
set mature_height_min_in = excluded.mature_height_min_in,
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

insert into catalog.plant_propagation_methods (
  plant_profile_id,
  planting_method_code,
  allowed,
  is_preferred,
  depth_min_in,
  depth_max_in,
  spacing_min_in,
  spacing_max_in,
  proliferation_behavior,
  self_seeds,
  reseeding_intensity,
  spreads_by_runners,
  spreads_by_rhizomes,
  grafted_common,
  seed_viability_duration_months,
  germination_days_min,
  germination_days_max,
  cold_stratification_required,
  scarification_required,
  rooting_hormone_helpful,
  transplant_shock_risk_code,
  establishment_difficulty,
  notes
)
values
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'division',
    true,
    true,
    null,
    null,
    24,
    36,
    'Established plants can persist and spread from root sections; division is the practical control/move method.',
    null,
    null,
    false,
    true,
    false,
    null,
    null,
    null,
    null,
    null,
    null,
    'medium',
    4,
    'Preferred practical method when controlling or moving clumps.'
  ),
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'direct_sow',
    true,
    false,
    0.25,
    0.5,
    24,
    36,
    'Slow to establish from seed; seed-grown plants may be variable and slower than divided plants.',
    true,
    3,
    false,
    false,
    false,
    null,
    null,
    null,
    false,
    false,
    false,
    'medium',
    6,
    'Seed-grown plants may be slow to establish.'
  ),
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'cutting',
    true,
    false,
    null,
    null,
    24,
    36,
    'Root cuttings may resprout because small root sections can regenerate; treat as a controlled propagation method.',
    null,
    null,
    false,
    true,
    false,
    null,
    null,
    null,
    false,
    false,
    false,
    'medium',
    5,
    'Use root sections/cuttings only where spread can be managed.'
  )
on conflict (plant_profile_id, planting_method_code) do update
set allowed = excluded.allowed,
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
    notes = excluded.notes;

insert into catalog.plant_flowering_profiles (
  plant_profile_id,
  flowering_bool,
  flower_color,
  flower_size,
  bloom_start_week,
  bloom_end_week,
  bloom_duration_days,
  flower_abundance,
  flower_fragrance_strength,
  pollinator_value,
  nectar_value,
  pollen_value,
  attracts_bees,
  attracts_butterflies,
  attracts_hummingbirds,
  larval_host,
  native_pollinator_value
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  true,
  'White to pink flowers with purple bracts',
  'Tall upright spikes',
  18,
  30,
  45,
  'Moderate to showy',
  1,
  5,
  4,
  3,
  true,
  true,
  false,
  false,
  2
)
on conflict (plant_profile_id) do update
set flowering_bool = excluded.flowering_bool,
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

insert into catalog.plant_fruiting_profiles (
  plant_profile_id,
  fruiting_bool,
  edible_parts,
  medicinal_parts,
  fodder_parts,
  wildlife_attraction,
  preservation_uses
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  false,
  array[]::text[],
  array[]::text[],
  array[]::text[],
  2,
  null
)
on conflict (plant_profile_id) do update
set fruiting_bool = excluded.fruiting_bool,
    edible_parts = excluded.edible_parts,
    medicinal_parts = excluded.medicinal_parts,
    fodder_parts = excluded.fodder_parts,
    wildlife_attraction = excluded.wildlife_attraction,
    preservation_uses = excluded.preservation_uses,
    updated_at = now();

insert into catalog.plant_soil_profiles (
  plant_profile_id,
  drainage_requirement,
  organic_matter_preference,
  compaction_tolerance_code,
  rocky_soil_tolerance_code,
  ph_min,
  ph_max,
  ph_ideal_min,
  ph_ideal_max,
  ph_sensitivity_code,
  fertility_need,
  nitrogen_need,
  phosphorus_need,
  potassium_need,
  calcium_sensitivity_code,
  soil_oxygen_need,
  mycorrhizal_association_notes,
  mulch_preference,
  mulch_depth_preference_in,
  waterlogging_sensitivity_code,
  texture_preferences,
  preferred_soil_texture_codes,
  soil_texture_summary
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  'Well-drained soil required; avoid persistently wet sites.',
  'Average to fertile soil with moderate organic matter.',
  'medium',
  'medium',
  6.0,
  7.8,
  6.5,
  7.2,
  'medium',
  'average_to_fertile',
  'medium',
  'medium',
  'medium',
  'unknown',
  'Moderate; roots resent anaerobic, waterlogged soil.',
  null,
  'Organic mulch helpful for even moisture and winter crown protection.',
  2,
  'high',
  jsonb_build_object(
    'loam', jsonb_build_object('preference_level', 8, 'description', 'Best overall texture when drainage is good.'),
    'sandy_loam', jsonb_build_object('preference_level', 7, 'description', 'Good texture if moisture is consistent.'),
    'silt_loam', jsonb_build_object('preference_level', 6, 'description', 'Acceptable with drainage and airflow.'),
    'clay', jsonb_build_object('preference_level', 4, 'description', 'Possible only if drainage is improved; avoid waterlogging.')
  ),
  array['loam', 'sandy_loam', 'silt_loam', 'clay'],
  'Prefers loam or sandy loam; accepts silt loam and improved clay only where drainage is reliable.'
)
on conflict (plant_profile_id) do update
set drainage_requirement = excluded.drainage_requirement,
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

insert into catalog.plant_water_profiles (
  plant_profile_id,
  water_need_level,
  drought_tolerance_code,
  moisture_sensitivity_code,
  preferred_irrigation_method,
  root_zone_depth_in,
  container_water_multiplier,
  mulched_water_reduction_factor,
  summer_heat_adjustment_factor
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  'medium',
  'medium',
  'high',
  'Deep, infrequent watering at soil level during establishment and summer dry spells.',
  18,
  1.25,
  0.85,
  1.2
)
on conflict (plant_profile_id) do update
set water_need_level = excluded.water_need_level,
    drought_tolerance_code = excluded.drought_tolerance_code,
    moisture_sensitivity_code = excluded.moisture_sensitivity_code,
    preferred_irrigation_method = excluded.preferred_irrigation_method,
    root_zone_depth_in = excluded.root_zone_depth_in,
    container_water_multiplier = excluded.container_water_multiplier,
    mulched_water_reduction_factor = excluded.mulched_water_reduction_factor,
    summer_heat_adjustment_factor = excluded.summer_heat_adjustment_factor,
    updated_at = now();

delete from catalog.plant_water_establishment_profiles
where plant_profile_id = (select id from catalog.plant_profiles where slug = 'acanthus');

insert into catalog.plant_water_establishment_profiles (
  plant_profile_id,
  week_from_planting_start,
  week_from_planting_end,
  gallons_per_week,
  frequency_per_week,
  deep_vs_frequent,
  notes
)
values
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 1, 8, 2.0, 2.0, 'deep', 'Keep evenly moist while establishing.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 9, 20, 1.0, 1.0, 'deep', 'Reduce once roots are active; avoid soggy soil.');

delete from catalog.plant_water_seasonal_profiles
where plant_profile_id = (select id from catalog.plant_profiles where slug = 'acanthus');

insert into catalog.plant_water_seasonal_profiles (
  plant_profile_id,
  region_type,
  region_value,
  month_no,
  lifecycle_stage_code,
  estimated_inches_per_week,
  estimated_gallons_per_week,
  preferred_method,
  stress_watchouts
)
values
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'generic', null, 5, 'maintenance', 0.75, 1.0, 'soil-level deep watering', 'Watch wilting in hot afternoon sun.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'generic', null, 6, 'flowering', 1.0, 1.5, 'soil-level deep watering', 'Consistent moisture supports bloom spikes.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'generic', null, 7, 'flowering', 1.0, 1.5, 'soil-level deep watering', 'Avoid waterlogging during humid weather.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'generic', null, 8, 'maintenance', 0.75, 1.0, 'soil-level deep watering', 'Supplement during dry spells.');

insert into catalog.plant_ecology_profiles (
  plant_profile_id,
  invasive_risk_code,
  wildlife_food_value,
  erosion_control_value,
  biomass_value,
  compost_value,
  chop_drop_value
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  'caution',
  2,
  3,
  5,
  4,
  2
)
on conflict (plant_profile_id) do update
set invasive_risk_code = excluded.invasive_risk_code,
    wildlife_food_value = excluded.wildlife_food_value,
    erosion_control_value = excluded.erosion_control_value,
    biomass_value = excluded.biomass_value,
    compost_value = excluded.compost_value,
    chop_drop_value = excluded.chop_drop_value,
    updated_at = now();

insert into catalog.plant_maintenance_profiles (
  plant_profile_id,
  pruning_frequency,
  deadheading_helpful,
  division_interval_years,
  staking_needed,
  suckering_management,
  cleanup_intensity,
  disease_susceptibility_level,
  pest_susceptibility_level,
  humidity_disease_risk,
  air_flow_importance
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  'Remove spent flower stalks after bloom; cut damaged foliage as needed.',
  true,
  4,
  false,
  'Remove unwanted shoots and root pieces promptly; consider root barriers.',
  5,
  4,
  4,
  5,
  5
)
on conflict (plant_profile_id) do update
set pruning_frequency = excluded.pruning_frequency,
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

insert into catalog.plant_safety_profiles (
  plant_profile_id,
  subject_type_code,
  safety_level_code,
  toxic_parts,
  condition_notes,
  symptoms,
  evidence_source_type,
  safe_use_notes
)
values
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'human', 'unknown', null, 'Ornamental use only in this catalog profile.', null, 'curation_needed', 'Do not treat as edible without a verified source.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'dog', 'unknown', null, 'Pet safety not verified for this profile.', null, 'curation_needed', 'Use caution until verified.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'cat', 'unknown', null, 'Pet safety not verified for this profile.', null, 'curation_needed', 'Use caution until verified.'),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'chicken', 'unknown', null, 'Livestock/poultry safety not verified for this profile.', null, 'curation_needed', 'Use caution until verified.')
on conflict (plant_profile_id, subject_type_code) do update
set safety_level_code = excluded.safety_level_code,
    toxic_parts = excluded.toxic_parts,
    condition_notes = excluded.condition_notes,
    symptoms = excluded.symptoms,
    evidence_source_type = excluded.evidence_source_type,
    safe_use_notes = excluded.safe_use_notes,
    updated_at = now();

insert into catalog.plant_relationships (
  plant_profile_id,
  related_plant_profile_id,
  relationship_type_code,
  rank_value,
  evidence_strength_code,
  rationale,
  distance_notes,
  source_notes,
  is_published
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  (select id from catalog.plant_profiles where slug = 'christmas-fern'),
  'good_companion',
  40,
  'anecdotal',
  'Compatible shade/part-shade foliage pairing for woodland-edge texture; verify in local bed context.',
  'Use as visual companions rather than tight root-zone interplanting until performance is observed.',
  'Garden.io starter property context; needs external evidence before high-confidence publication.',
  false
)
on conflict (plant_profile_id, related_plant_profile_id, relationship_type_code) do update
set rank_value = excluded.rank_value,
    evidence_strength_code = excluded.evidence_strength_code,
    rationale = excluded.rationale,
    distance_notes = excluded.distance_notes,
    source_notes = excluded.source_notes,
    is_published = excluded.is_published,
    updated_at = now();

delete from catalog.phenology_events
where phenology_template_id in (
  select id from catalog.phenology_templates
  where plant_profile_id = (select id from catalog.plant_profiles where slug = 'acanthus')
);

delete from catalog.phenology_templates
where plant_profile_id = (select id from catalog.plant_profiles where slug = 'acanthus');

with template as (
  insert into catalog.phenology_templates (
    plant_profile_id,
    region_type,
    region_value,
    is_default,
    notes
  )
  values (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'generic',
    null,
    true,
    'Generic Zone 7-10 perennial timing; adjust by local observations.'
  )
  returning id
)
insert into catalog.phenology_events (
  phenology_template_id,
  stage_code,
  stage_name,
  trigger_type,
  trigger_rule,
  timing_type,
  week_start_of_year,
  week_end_of_year,
  month_start,
  month_end,
  cues,
  recommended_action,
  recurrence,
  urgency_code,
  failure_risk_if_missed,
  priority_weight,
  repeatable
)
select id, 'reemergence', 'Spring foliage re-emergence', 'calendar', 'After hard frost risk decreases', 'calendar', 10, 16, 3, 4, 'New crown growth visible', 'Inspect crown and remove winter-damaged foliage.', 'annual', 'medium', 'Delayed cleanup can hide slug damage or crown issues.', 45, true from template
union all
select id, 'flowering', 'Flower spike emergence and bloom', 'calendar', 'Late spring to midsummer', 'calendar', 18, 30, 5, 7, 'Flower spikes elongating', 'Maintain even moisture and remove damaged foliage.', 'annual', 'medium', 'Dry stress can reduce bloom quality.', 50, true from template
union all
select id, 'trim', 'Post-bloom cleanup', 'plant_observation', 'Flower spikes spent', 'event_offset', 27, 34, 7, 8, 'Spent spikes or seed heads', 'Cut spent stalks and remove unwanted shoots.', 'annual', 'medium', 'Self-seeding/spread management may be harder later.', 55, true from template
union all
select id, 'dormant_entry', 'Winter protection check', 'calendar', 'Before sustained freezes in marginal zones', 'calendar', 42, 48, 10, 11, 'Cold weather approaching', 'Mulch crown lightly in marginal cold sites; avoid wet crowns.', 'annual', 'low', 'Winter wet and exposed crowns increase loss risk.', 35, true from template;

insert into catalog.plant_zone_profiles (
  plant_profile_id,
  region_type,
  region_value,
  usda_zone_min,
  usda_zone_max,
  planting_window_start_week,
  planting_window_end_week,
  bloom_window_start_week,
  bloom_window_end_week,
  dieback_window_start_week,
  reemergence_window_start_week,
  proliferation_behavior,
  maintenance_timing_notes,
  seasonal_risk_notes
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  'usda_zone',
  '7-10',
  '7',
  '10',
  10,
  18,
  18,
  30,
  45,
  10,
  'Clumping perennial that can spread by root sections after establishment.',
  'Clean up in spring, manage spent stalks after bloom, and remove unwanted shoots during active growth.',
  'Winter wet and marginal cold can damage crowns; hot afternoon sun can stress foliage.'
)
on conflict (plant_profile_id, region_type, (coalesce(region_value, ''))) do update
set usda_zone_min = excluded.usda_zone_min,
    usda_zone_max = excluded.usda_zone_max,
    planting_window_start_week = excluded.planting_window_start_week,
    planting_window_end_week = excluded.planting_window_end_week,
    bloom_window_start_week = excluded.bloom_window_start_week,
    bloom_window_end_week = excluded.bloom_window_end_week,
    dieback_window_start_week = excluded.dieback_window_start_week,
    reemergence_window_start_week = excluded.reemergence_window_start_week,
    proliferation_behavior = excluded.proliferation_behavior,
    maintenance_timing_notes = excluded.maintenance_timing_notes,
    seasonal_risk_notes = excluded.seasonal_risk_notes,
    updated_at = now();

delete from catalog.plant_care_events
where plant_profile_id = (select id from catalog.plant_profiles where slug = 'acanthus');

insert into catalog.plant_care_events (
  plant_profile_id,
  stage_code,
  task_type_code,
  source_type_code,
  title,
  description,
  recurrence_rule,
  lead_days,
  window_days,
  priority_code,
  requires_confirmation,
  repeatable,
  is_active
)
values
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'reemergence', 'inspect', 'lifecycle', 'Inspect Acanthus crown and new foliage', 'Check for winter damage, slugs, snails, and crown health as new growth emerges.', 'FREQ=YEARLY', 0, 14, 'medium', false, true, true),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'maintenance', 'water', 'maintenance', 'Water Acanthus during dry spells', 'Deep-water during establishment and summer dry periods while avoiding waterlogged soil.', 'FREQ=WEEKLY;INTERVAL=1', 0, 7, 'medium', true, true, true),
  ((select id from catalog.plant_profiles where slug = 'acanthus'), 'trim', 'prune', 'lifecycle', 'Cut spent Acanthus flower stalks', 'Remove spent flower stalks after bloom and watch for unwanted spread.', 'FREQ=YEARLY', 0, 21, 'medium', false, true, true);

insert into catalog.plant_sources (
  source_name,
  source_type,
  publisher,
  source_url,
  citation_text,
  credibility_score,
  notes,
  last_reviewed_at
)
select
  'Missouri Botanical Garden Plant Finder: Acanthus mollis',
  'extension',
  'Missouri Botanical Garden',
  'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338',
  'Missouri Botanical Garden Plant Finder profile for Acanthus mollis.',
  0.88,
  'Used for hardiness, soil, water, light, habit, and spread caution.',
  now()
where not exists (
  select 1 from catalog.plant_sources
  where source_url = 'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338'
);

insert into catalog.plant_sources (
  source_name,
  source_type,
  publisher,
  source_url,
  citation_text,
  credibility_score,
  notes,
  last_reviewed_at
)
select
  'NC State Extension Gardener Plant Toolbox: Acanthus mollis',
  'extension',
  'North Carolina State Extension',
  'https://plants.ces.ncsu.edu/plants/acanthus-mollis/',
  'NC State Extension Plant Toolbox profile for Acanthus mollis.',
  0.86,
  'Used for spread, maintenance, and pest/disease watchouts.',
  now()
where not exists (
  select 1 from catalog.plant_sources
  where source_url = 'https://plants.ces.ncsu.edu/plants/acanthus-mollis/'
);

delete from catalog.plant_claims
where plant_profile_id = (select id from catalog.plant_profiles where slug = 'acanthus');

insert into catalog.plant_claims (
  plant_profile_id,
  claim_type,
  value_json,
  evidence_strength_code,
  confidence_score,
  evidence_count,
  source_count,
  source_last_reviewed_at,
  source_id,
  source_quote_or_excerpt,
  source_url,
  reviewed_by_human,
  review_status,
  region_scope,
  ai_generated_summary,
  human_verified,
  conflict_flag
)
values
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'climate.usda_hardiness_range',
    jsonb_build_object('usda_hardiness_min', '7', 'usda_hardiness_max', '10'),
    'strong',
    0.88,
    1,
    1,
    now(),
    (select id from catalog.plant_sources where source_url = 'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338' limit 1),
    'Zone 7 to 10.',
    'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338',
    true,
    'approved',
    'USDA Zones 7-10',
    false,
    true,
    false
  ),
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'climate.light_requirement',
    jsonb_build_object('preferred_light', 'full sun to part shade', 'sun_min_hours', 3, 'sun_max_hours', 8),
    'strong',
    0.86,
    1,
    1,
    now(),
    (select id from catalog.plant_sources where source_url = 'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338' limit 1),
    'Full sun to part shade.',
    'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338',
    true,
    'approved',
    'USDA Zones 7-10',
    false,
    true,
    false
  ),
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'soil.drainage_requirement',
    jsonb_build_object('drainage_requirement', 'well_drained', 'waterlogging_sensitivity_code', 'high'),
    'strong',
    0.86,
    1,
    1,
    now(),
    (select id from catalog.plant_sources where source_url = 'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338' limit 1),
    'Average, fertile, medium moisture, well-drained soils.',
    'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338',
    true,
    'approved',
    'USDA Zones 7-10',
    false,
    true,
    false
  ),
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'water.water_need_level',
    jsonb_build_object('water_need_level', 'medium', 'moisture_sensitivity_code', 'high'),
    'strong',
    0.84,
    1,
    1,
    now(),
    (select id from catalog.plant_sources where source_url = 'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338' limit 1),
    'Medium moisture.',
    'https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?%22=&taxonid=275338',
    true,
    'approved',
    'USDA Zones 7-10',
    false,
    true,
    false
  ),
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'growth.spread_aggressiveness',
    jsonb_build_object('spread_mode', 'rhizomes/root sections', 'rating', 4, 'management', 'site intentionally and remove unwanted shoots'),
    'strong',
    0.84,
    2,
    2,
    now(),
    (select id from catalog.plant_sources where source_url = 'https://plants.ces.ncsu.edu/plants/acanthus-mollis/' limit 1),
    'Spreads by rhizomes and may need root barriers to prevent unwanted spread.',
    'https://plants.ces.ncsu.edu/plants/acanthus-mollis/',
    true,
    'approved',
    'North America garden context',
    false,
    true,
    false
  ),
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'maintenance.disease_susceptibility',
    jsonb_build_object('disease_susceptibility_rating', 2, 'watchouts', array['powdery mildew']),
    'moderate',
    0.74,
    1,
    1,
    now(),
    (select id from catalog.plant_sources where source_url = 'https://plants.ces.ncsu.edu/plants/acanthus-mollis/' limit 1),
    'Watch for powdery mildew.',
    'https://plants.ces.ncsu.edu/plants/acanthus-mollis/',
    true,
    'approved',
    'Humid garden context',
    false,
    true,
    false
  ),
  (
    (select id from catalog.plant_profiles where slug = 'acanthus'),
    'maintenance.pest_susceptibility',
    jsonb_build_object('pest_susceptibility_rating', 2, 'watchouts', array['slugs', 'snails']),
    'moderate',
    0.74,
    1,
    1,
    now(),
    (select id from catalog.plant_sources where source_url = 'https://plants.ces.ncsu.edu/plants/acanthus-mollis/' limit 1),
    'Watch for slugs and snails.',
    'https://plants.ces.ncsu.edu/plants/acanthus-mollis/',
    true,
    'approved',
    'Humid garden context',
    false,
    true,
    false
  );

delete from catalog.plant_images
where plant_profile_id = (select id from catalog.plant_profiles where slug = 'acanthus')
  and storage_key = 'art/specimen-herbarium-sheet.svg';

insert into catalog.plant_images (
  plant_profile_id,
  source_id,
  stage_code,
  image_url,
  storage_key,
  mime_type,
  attribution_text,
  license,
  is_primary,
  is_public
)
values (
  (select id from catalog.plant_profiles where slug = 'acanthus'),
  null,
  'flowering',
  '/art/specimen-herbarium-sheet.svg',
  'art/specimen-herbarium-sheet.svg',
  'image/svg+xml',
  'Garden.io placeholder specimen illustration',
  'internal placeholder',
  true,
  true
);

commit;
