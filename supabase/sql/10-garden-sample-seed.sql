-- Garden.io Module 10 sample dataset
-- Run after docs/product/specs/sql/10-garden-postgres-ddl.sql

begin;

-- ============================================================================
-- Stable UUIDs for deterministic starter data
-- ============================================================================

-- Accounts and users
insert into core.accounts (id, name, plan_tier, status, billing_customer_ref)
values
  ('10000000-0000-0000-0000-000000000001', 'Garden.io Demo Account', 'paid', 'active', 'cus_demo_001')
on conflict (id) do nothing;

insert into core.users (id, account_id, email, display_name, timezone, locale, is_active)
values
  ('10000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', 'prestonpope192@gmail.com', 'Preston Pope', 'America/Chicago', 'en-US', true),
  ('10000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', 'alex@garden.io', 'Alex Grower', 'America/Chicago', 'en-US', true),
  ('10000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', 'jordan@garden.io', 'Jordan Helper', 'America/Chicago', 'en-US', true)
on conflict (id) do nothing;

-- Property and memberships
insert into core.properties (
  id,
  account_id,
  name,
  property_label_code,
  custom_label,
  slug,
  description,
  country_code,
  region_code,
  postal_code,
  latitude,
  longitude,
  usda_zone,
  ahs_heat_zone,
  default_timezone,
  notes,
  created_by_user_id,
  updated_by_user_id
)
values (
  '10000000-0000-0000-0000-000000000021',
  '10000000-0000-0000-0000-000000000001',
  'Preston Homestead',
  'homestead',
  null,
  'preston-homestead',
  'Demo property for UI and scheduling workflows.',
  'US',
  'TX',
  '78701',
  30.267200,
  -97.743100,
  '8b',
  '9',
  'America/Chicago',
  'Primary testing property.',
  '10000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000011'
)
on conflict (id) do nothing;

insert into core.property_memberships (
  id,
  property_id,
  user_id,
  role_code,
  invited_by_user_id,
  invitation_email,
  accepted_at,
  is_active
)
values
  ('10000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000011', 'owner', '10000000-0000-0000-0000-000000000011', 'prestonpope192@gmail.com', now(), true),
  ('10000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000012', 'manager', '10000000-0000-0000-0000-000000000011', 'alex@garden.io', now(), true),
  ('10000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000013', 'contributor', '10000000-0000-0000-0000-000000000011', 'jordan@garden.io', now(), true)
on conflict (id) do nothing;

insert into core.property_invitations (
  id,
  property_id,
  email,
  role_code,
  invited_by_user_id,
  invitation_token,
  invitation_status,
  expires_at
)
values (
  '10000000-0000-0000-0000-000000000041',
  '10000000-0000-0000-0000-000000000021',
  'future-collaborator@garden.io',
  'viewer',
  '10000000-0000-0000-0000-000000000011',
  'inv_demo_future_001',
  'pending',
  now() + interval '7 days'
)
on conflict (id) do nothing;

insert into core.zones (
  id,
  property_id,
  name,
  slug,
  purpose,
  description,
  environment_summary,
  sun_profile,
  soil_profile,
  irrigation_profile,
  slope_profile,
  wind_profile,
  microclimate_notes,
  map_geometry,
  sort_order,
  created_by_user_id,
  updated_by_user_id
)
values
  (
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000021',
    'Garden Core',
    'garden-core',
    'Main annual production area',
    'Raised beds and intensive succession planting.',
    'High productivity zone with drip irrigation.',
    'Full sun',
    'Sandy loam',
    'Drip',
    'Flat',
    'Moderate wind exposure',
    'Hottest section in midsummer.',
    '{"type":"FeatureCollection","features":[]}'::jsonb,
    10,
    '10000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011'
  ),
  (
    '10000000-0000-0000-0000-000000000052',
    '10000000-0000-0000-0000-000000000021',
    'Orchard',
    'orchard',
    'Perennial fruit and pollinator support',
    'Mixed fruit trees with understory species.',
    'Perennial guild-style management.',
    'Full sun',
    'Sandy loam with mulch',
    'Soaker hose',
    'Gentle slope',
    'Sheltered by fence line',
    'Cooler dawn temperatures.',
    '{"type":"FeatureCollection","features":[]}'::jsonb,
    20,
    '10000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011'
  )
on conflict (id) do nothing;

insert into core.beds (
  id,
  property_id,
  zone_id,
  name,
  slug,
  bed_type,
  description,
  length_value,
  width_value,
  height_value,
  unit_system,
  sun_hours_min,
  sun_hours_max,
  preferred_light,
  soil_texture,
  drainage_class,
  organic_matter_pct,
  soil_ph_min,
  soil_ph_max,
  soil_notes,
  irrigation_method,
  watering_zone_ref,
  layout_payload,
  sort_order,
  created_by_user_id,
  updated_by_user_id
)
values
  (
    '10000000-0000-0000-0000-000000000061',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    'Tomato Bed 1',
    'tomato-bed-1',
    'raised',
    'Primary summer tomato bed.',
    12,
    4,
    1,
    'imperial',
    7,
    9,
    'full sun',
    'sandy_loam',
    'well_drained',
    4.20,
    6.2,
    6.8,
    'Compost-amended each spring.',
    'drip',
    'WZ-CORE-1',
    '{"layout":"rows","row_count":2}'::jsonb,
    10,
    '10000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011'
  ),
  (
    '10000000-0000-0000-0000-000000000062',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000052',
    'Berry Bed',
    'berry-bed',
    'in_ground',
    'Blueberries and companion flowers.',
    20,
    5,
    null,
    'imperial',
    6,
    8,
    'full sun',
    'sandy_loam',
    'well_drained',
    6.50,
    4.5,
    5.5,
    'Acidic amendments and pine mulch.',
    'soaker',
    'WZ-ORCHARD-1',
    '{"layout":"cluster"}'::jsonb,
    20,
    '10000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011'
  )
on conflict (id) do nothing;

insert into core.property_activity (
  id,
  property_id,
  actor_user_id,
  event_type,
  summary,
  payload
)
values (
  '10000000-0000-0000-0000-000000000071',
  '10000000-0000-0000-0000-000000000021',
  '10000000-0000-0000-0000-000000000012',
  'bed_updated',
  'Alex updated Tomato Bed 1 soil notes.',
  '{"bed_id":"10000000-0000-0000-0000-000000000061"}'::jsonb
)
on conflict (id) do nothing;

-- ============================================================================
-- Catalog seed graph (taxonomy, profiles, traits, relationships, evidence)
-- ============================================================================

insert into catalog.regions (
  id,
  region_type,
  country_code,
  region_code,
  display_name,
  usda_zone_min,
  usda_zone_max,
  ahs_heat_zone_min,
  ahs_heat_zone_max
)
values
  ('20000000-0000-0000-0000-000000000001', 'state', 'US', 'TX', 'Texas', '6a', '9b', '7', '10'),
  ('20000000-0000-0000-0000-000000000002', 'state', 'US', 'CA', 'California', '5a', '11a', '4', '11')
on conflict (id) do nothing;

insert into catalog.frost_dates (
  id,
  region_id,
  percentile_label,
  average_last_frost_date,
  average_first_frost_date
)
values
  ('20000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000001', 'median', '2026-03-01', '2026-11-20'),
  ('20000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000002', 'median', '2026-02-15', '2026-12-10')
on conflict (id) do nothing;

insert into catalog.weather_normals (
  id,
  region_id,
  month_no,
  avg_temp_min_f,
  avg_temp_max_f,
  avg_precip_in,
  avg_humidity_pct,
  avg_wind_mph
)
values
  ('20000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000001', 3, 52, 74, 2.8, 58, 8),
  ('20000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000001', 6, 73, 94, 3.1, 60, 9),
  ('20000000-0000-0000-0000-000000000023', '20000000-0000-0000-0000-000000000002', 3, 50, 67, 3.4, 65, 6)
on conflict (id) do nothing;

insert into catalog.plant_taxa (
  id,
  kingdom_name,
  family_name,
  genus_name,
  species_name,
  subspecies_name,
  variety_name,
  botanical_name_full,
  taxon_rank,
  native_range,
  origin_type,
  is_active
)
values
  (
    '20000000-0000-0000-0000-000000000031',
    'Plantae',
    'Solanaceae',
    'Solanum',
    'lycopersicum',
    null,
    null,
    'Solanum lycopersicum',
    'species',
    'Andean region',
    'exotic',
    true
  ),
  (
    '20000000-0000-0000-0000-000000000032',
    'Plantae',
    'Lamiaceae',
    'Ocimum',
    'basilicum',
    null,
    null,
    'Ocimum basilicum',
    'species',
    'Tropical Asia',
    'exotic',
    true
  )
on conflict (id) do nothing;

insert into catalog.plant_names (id, plant_taxon_id, name, name_type, locale, is_primary)
values
  ('20000000-0000-0000-0000-000000000041', '20000000-0000-0000-0000-000000000031', 'Tomato', 'common', 'en', true),
  ('20000000-0000-0000-0000-000000000042', '20000000-0000-0000-0000-000000000031', 'Love Apple', 'synonym', 'en', false),
  ('20000000-0000-0000-0000-000000000043', '20000000-0000-0000-0000-000000000032', 'Basil', 'common', 'en', true)
on conflict (id) do nothing;

insert into catalog.plant_cultivars (
  id,
  plant_taxon_id,
  cultivar_name,
  market_name,
  description,
  chill_hours_min,
  chill_hours_max,
  disease_resistance_notes,
  is_active
)
values
  (
    '20000000-0000-0000-0000-000000000051',
    '20000000-0000-0000-0000-000000000031',
    'Cherokee Purple',
    'Cherokee Purple Tomato',
    'Heirloom slicing tomato.',
    null,
    null,
    'Moderate resistance to cracking with consistent watering.',
    true
  )
on conflict (id) do nothing;

insert into catalog.plant_profiles (
  id,
  plant_taxon_id,
  plant_cultivar_id,
  display_name,
  plant_type_code,
  short_description,
  why_plant_it,
  pros_summary,
  cons_summary,
  primary_use_cases,
  beginner_friendliness,
  maintenance_level_code,
  notes_for_homestead,
  notes_for_small_garden,
  notes_for_container_growing,
  lifecycle_type,
  evergreen_deciduous,
  privacy_screen_value,
  deer_resistance,
  rabbit_resistance,
  armadillo_disturbance_risk,
  chicken_scratch_tolerance,
  foot_traffic_tolerance,
  mow_tolerance,
  ornamental_season_interest,
  visual_texture,
  foliage_color,
  evergreen_foliage,
  winter_interest,
  confidence_score,
  evidence_count,
  source_count,
  source_last_reviewed_at,
  ai_generated_summary,
  human_verified,
  conflict_flag,
  region_specific_conflict_notes,
  is_ai_generated,
  generation_status,
  is_published,
  review_status,
  created_by_user_id,
  updated_by_user_id
)
values
  (
    '20000000-0000-0000-0000-000000000061',
    '20000000-0000-0000-0000-000000000031',
    '20000000-0000-0000-0000-000000000051',
    'Cherokee Purple Tomato',
    'vegetable',
    'Heirloom tomato with rich flavor and long harvest window.',
    'Excellent flavor and high culinary value for summer harvest.',
    'Strong flavor, high culinary versatility.',
    'Needs staking and regular pruning in heat.',
    'Fresh eating, slicing, sauces.',
    3,
    'medium',
    'Great for kitchen abundance and preserving.',
    'Use trellis support in compact spaces.',
    'Can grow in large containers with heavy feeding.',
    'annual',
    'unknown',
    0,
    3,
    4,
    2,
    2,
    0,
    0,
    array['spring','summer'],
    'medium',
    'green',
    false,
    false,
    0.86,
    12,
    4,
    now(),
    false,
    true,
    false,
    null,
    false,
    'human_curated',
    true,
    'approved',
    '10000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011'
  ),
  (
    '20000000-0000-0000-0000-000000000062',
    '20000000-0000-0000-0000-000000000032',
    null,
    'Sweet Basil',
    'herb',
    'Warm-season aromatic herb used in mixed plantings.',
    'Fast-growing culinary herb that pairs well with tomatoes.',
    'Quick establishment and high culinary return.',
    'Sensitive to frost and prolonged cold.',
    'Culinary herb, companion support.',
    4,
    'low',
    'Useful in kitchen gardens and pollinator edges.',
    'Excellent for intensive planting.',
    'Performs well in medium containers.',
    'annual',
    'unknown',
    0,
    5,
    5,
    1,
    3,
    0,
    0,
    array['spring','summer'],
    'fine',
    'green',
    false,
    false,
    0.82,
    8,
    3,
    now(),
    false,
    true,
    false,
    null,
    false,
    'human_curated',
    true,
    'approved',
    '10000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011'
  )
on conflict (id) do nothing;

insert into catalog.plant_profile_aesthetic_styles (id, plant_profile_id, style_code, weight_score)
values
  ('20000000-0000-0000-0000-000000000071', '20000000-0000-0000-0000-000000000061', 'edible_landscape', 9),
  ('20000000-0000-0000-0000-000000000072', '20000000-0000-0000-0000-000000000062', 'cottage', 7)
on conflict (id) do nothing;

insert into catalog.plant_profile_uses (
  id,
  plant_profile_id,
  use_type_code,
  evidence_strength_code,
  supports_use,
  mechanism_description,
  target_benefit,
  target_pest,
  target_soil_effect,
  notes
)
values
  (
    '20000000-0000-0000-0000-000000000081',
    '20000000-0000-0000-0000-000000000061',
    'edible_fruit',
    'strong',
    true,
    'Fruit production in warm-season windows.',
    'Fresh food yield.',
    null,
    null,
    'Primary culinary objective crop.'
  ),
  (
    '20000000-0000-0000-0000-000000000082',
    '20000000-0000-0000-0000-000000000062',
    'pest_confusion',
    'traditional',
    true,
    'Aromatic foliage can alter insect behavior around companion crops.',
    'Potentially lower pest pressure in mixed beds.',
    'aphids',
    null,
    'Treat as contextual and monitor outcomes.'
  )
on conflict (id) do nothing;

insert into catalog.plant_climate_profiles (
  id,
  plant_profile_id,
  usda_hardiness_min,
  usda_hardiness_max,
  ahs_heat_zone_min,
  ahs_heat_zone_max,
  cold_tolerance_absolute_f,
  cold_tolerance_established_f,
  heat_tolerance_f,
  humidity_tolerance_code,
  drought_tolerance_code,
  flood_tolerance_code,
  wind_tolerance_code,
  salt_tolerance_code,
  chill_hours_min,
  chill_hours_max,
  frost_tender,
  reemergence_after_freeze_behavior,
  sun_min_hours,
  sun_max_hours,
  preferred_light,
  shade_tolerance_score,
  afternoon_sun_tolerance_score,
  reflected_heat_tolerance_score
)
values
  (
    '20000000-0000-0000-0000-000000000091',
    '20000000-0000-0000-0000-000000000061',
    '3a',
    '11a',
    '3',
    '10',
    30,
    32,
    100,
    'medium',
    'low',
    'low',
    'medium',
    'low',
    null,
    null,
    true,
    'Typically terminated after freeze as annual crop.',
    6,
    10,
    'full sun',
    2,
    7,
    6
  ),
  (
    '20000000-0000-0000-0000-000000000092',
    '20000000-0000-0000-0000-000000000062',
    '4a',
    '11a',
    '2',
    '10',
    35,
    38,
    98,
    'medium',
    'medium',
    'low',
    'low',
    'low',
    null,
    null,
    true,
    'Dies with frost in most regions.',
    5,
    9,
    'full sun',
    3,
    6,
    5
  )
on conflict (id) do nothing;

insert into catalog.plant_growth_profiles (
  id,
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
values
  (
    '20000000-0000-0000-0000-000000000101',
    '20000000-0000-0000-0000-000000000061',
    48,
    84,
    24,
    36,
    48,
    20,
    'high',
    'upright',
    'fibrous',
    3,
    'Responds well to sucker pruning.',
    7,
    7,
    true,
    'stake_or_trellis'
  ),
  (
    '20000000-0000-0000-0000-000000000102',
    '20000000-0000-0000-0000-000000000062',
    12,
    24,
    12,
    24,
    16,
    16,
    'medium',
    'mounding',
    'fibrous',
    2,
    'Pinching increases branching.',
    8,
    8,
    false,
    null
  )
on conflict (id) do nothing;

insert into catalog.plant_propagation_profiles (
  id,
  plant_profile_id,
  proliferation_behavior,
  self_seeds,
  reseeding_intensity,
  spreads_by_runners,
  spreads_by_rhizomes,
  division_possible,
  cutting_possible,
  grafted_common,
  seed_viability_duration_months,
  germination_days_min,
  germination_days_max,
  cold_stratification_required,
  scarification_required,
  rooting_hormone_helpful,
  transplant_shock_risk_code,
  establishment_difficulty
)
values
  (
    '20000000-0000-0000-0000-000000000111',
    '20000000-0000-0000-0000-000000000061',
    'Annual crop, occasional volunteer seedlings.',
    false,
    2,
    false,
    false,
    false,
    true,
    false,
    48,
    5,
    10,
    false,
    false,
    true,
    'medium',
    5
  ),
  (
    '20000000-0000-0000-0000-000000000112',
    '20000000-0000-0000-0000-000000000062',
    'Annual herb with potential self-seeding in warm climates.',
    true,
    4,
    false,
    false,
    false,
    true,
    false,
    36,
    5,
    10,
    false,
    false,
    false,
    'low',
    3
  )
on conflict (id) do nothing;

insert into catalog.plant_propagation_methods (
  id,
  plant_profile_id,
  planting_method_code,
  allowed,
  is_preferred,
  depth_min_in,
  depth_max_in,
  spacing_min_in,
  spacing_max_in,
  notes
)
values
  ('20000000-0000-0000-0000-000000000121', '20000000-0000-0000-0000-000000000061', 'transplant_seedling', true, true, 2, 4, 18, 30, 'Transplant after frost risk.'),
  ('20000000-0000-0000-0000-000000000122', '20000000-0000-0000-0000-000000000062', 'transplant_seedling', true, true, 1, 3, 8, 12, 'Plant when nights stay warm.')
on conflict (id) do nothing;

insert into catalog.plant_flowering_profiles (
  id,
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
values
  ('20000000-0000-0000-0000-000000000131', '20000000-0000-0000-0000-000000000061', true, 'yellow', 'small', 15, 35, 120, 'high', 1, 6, 5, 5, true, false, false, false, 5),
  ('20000000-0000-0000-0000-000000000132', '20000000-0000-0000-0000-000000000062', true, 'white', 'small', 16, 34, 100, 'high', 7, 8, 7, 6, true, true, false, false, 6)
on conflict (id) do nothing;

insert into catalog.plant_fruiting_profiles (
  id,
  plant_profile_id,
  fruiting_bool,
  fruit_color,
  fruit_size,
  fruit_flavor,
  fruiting_start_age_years,
  yield_lb_per_plant_year_min,
  yield_lb_per_plant_year_max,
  harvest_window_start_week,
  harvest_window_end_week,
  fruit_drop_behavior,
  wildlife_attraction,
  first_harvest_time_from_planting_days,
  productive_years_min,
  productive_years_max,
  harvest_frequency,
  preservation_uses,
  edible_parts,
  medicinal_parts,
  fodder_parts
)
values
  (
    '20000000-0000-0000-0000-000000000141',
    '20000000-0000-0000-0000-000000000061',
    true,
    'purple-red',
    'large',
    'rich sweet-acid balance',
    0.2,
    8,
    25,
    24,
    40,
    'Drops if overripe in high heat.',
    4,
    75,
    1,
    1,
    'multiple picks per week',
    'sauce, canning, drying',
    array['fruit'],
    array[]::text[],
    array[]::text[]
  ),
  (
    '20000000-0000-0000-0000-000000000142',
    '20000000-0000-0000-0000-000000000062',
    false,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    3,
    35,
    1,
    1,
    'continuous leaf harvest',
    'pesto, drying',
    array['leaf'],
    array['leaf'],
    array[]::text[]
  )
on conflict (id) do nothing;

insert into catalog.plant_soil_profiles (
  id,
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
  waterlogging_sensitivity_code
)
values
  (
    '20000000-0000-0000-0000-000000000151',
    '20000000-0000-0000-0000-000000000061',
    'well_drained',
    'high',
    'low',
    'low',
    5.8,
    7.2,
    6.2,
    6.8,
    'medium',
    'high',
    'high',
    'medium',
    'high',
    'low',
    'high',
    'Benefits from biologically active soils.',
    'organic mulch',
    2.0,
    'high'
  ),
  (
    '20000000-0000-0000-0000-000000000152',
    '20000000-0000-0000-0000-000000000062',
    'well_drained',
    'medium',
    'low',
    'low',
    5.5,
    7.5,
    6.0,
    7.0,
    'low',
    'medium',
    'medium',
    'low',
    'medium',
    'low',
    'medium',
    'Moderate biological activity preferred.',
    'light mulch',
    1.0,
    'medium'
  )
on conflict (id) do nothing;

insert into catalog.plant_soil_texture_preferences (id, plant_profile_id, soil_type_code, preference_level)
values
  ('20000000-0000-0000-0000-000000000161', '20000000-0000-0000-0000-000000000061', 'sandy_loam', 9),
  ('20000000-0000-0000-0000-000000000162', '20000000-0000-0000-0000-000000000061', 'loam', 8),
  ('20000000-0000-0000-0000-000000000163', '20000000-0000-0000-0000-000000000062', 'loam', 8)
on conflict (id) do nothing;

insert into catalog.plant_water_profiles (
  id,
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
values
  ('20000000-0000-0000-0000-000000000171', '20000000-0000-0000-0000-000000000061', 'medium', 'low', 'high', 'drip', 18, 1.35, 0.85, 1.20),
  ('20000000-0000-0000-0000-000000000172', '20000000-0000-0000-0000-000000000062', 'medium', 'medium', 'medium', 'drip', 12, 1.25, 0.90, 1.15)
on conflict (id) do nothing;

insert into catalog.plant_water_establishment_profiles (
  id,
  plant_profile_id,
  week_from_planting_start,
  week_from_planting_end,
  gallons_per_week,
  frequency_per_week,
  deep_vs_frequent,
  notes
)
values
  ('20000000-0000-0000-0000-000000000181', '20000000-0000-0000-0000-000000000061', 1, 4, 2.5, 3.0, 'consistent_moderate', 'Maintain even moisture after transplant.'),
  ('20000000-0000-0000-0000-000000000182', '20000000-0000-0000-0000-000000000061', 5, 12, 3.5, 2.0, 'deep', 'Increase volume during fruit load.'),
  ('20000000-0000-0000-0000-000000000183', '20000000-0000-0000-0000-000000000062', 1, 6, 1.2, 2.0, 'moderate', 'Avoid saturation in cool spells.')
on conflict (id) do nothing;

insert into catalog.plant_water_seasonal_profiles (
  id,
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
  ('20000000-0000-0000-0000-000000000191', '20000000-0000-0000-0000-000000000061', 'usda_zone', '8b', 6, 'fruiting', 1.4, 3.8, 'drip', 'Heat spikes can cause blossom drop.'),
  ('20000000-0000-0000-0000-000000000192', '20000000-0000-0000-0000-000000000062', 'usda_zone', '8b', 6, 'maintenance', 1.0, 1.5, 'drip', 'Watch for rapid wilting in afternoon heat.')
on conflict (id) do nothing;

insert into catalog.plant_ecology_profiles (
  id,
  plant_profile_id,
  invasive_risk_code,
  wildlife_food_value,
  erosion_control_value,
  biomass_value,
  compost_value,
  chop_drop_value
)
values
  ('20000000-0000-0000-0000-000000000201', '20000000-0000-0000-0000-000000000061', 'safe', 5, 2, 4, 6, 4),
  ('20000000-0000-0000-0000-000000000202', '20000000-0000-0000-0000-000000000062', 'safe', 4, 3, 5, 7, 5)
on conflict (id) do nothing;

insert into catalog.plant_maintenance_profiles (
  id,
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
values
  ('20000000-0000-0000-0000-000000000211', '20000000-0000-0000-0000-000000000061', 'weekly', false, null, true, 'Sucker pruning recommended for airflow.', 6, 6, 7, 8, 8),
  ('20000000-0000-0000-0000-000000000212', '20000000-0000-0000-0000-000000000062', 'biweekly', true, null, false, 'Pinch flower tips for leaf production.', 3, 3, 4, 4, 5)
on conflict (id) do nothing;

insert into catalog.plant_safety_profiles (
  id,
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
  ('20000000-0000-0000-0000-000000000221', '20000000-0000-0000-0000-000000000061', 'human', 'safe', array['fruit'], 'Green fruit/foliage are not culinary target.', 'Mild GI upset possible with foliage ingestion.', 'extension', 'Consume ripe fruit only.'),
  ('20000000-0000-0000-0000-000000000222', '20000000-0000-0000-0000-000000000061', 'dog', 'caution', array['leaf','stem'], 'Avoid large ingestion of foliage.', 'GI irritation.', 'government', 'Keep plant debris away from pets.'),
  ('20000000-0000-0000-0000-000000000223', '20000000-0000-0000-0000-000000000062', 'human', 'safe', array['leaf'], 'Culinary herb in normal use.', null, 'extension', 'Harvest before flowering for best flavor.')
on conflict (id) do nothing;

insert into catalog.plant_relationships (
  id,
  plant_profile_id,
  related_plant_profile_id,
  relationship_type_code,
  rank_value,
  evidence_strength_code,
  rationale,
  distance_notes,
  overlap_window_start_week,
  overlap_window_end_week,
  source_notes,
  is_published
)
values
  ('20000000-0000-0000-0000-000000000231', '20000000-0000-0000-0000-000000000061', '20000000-0000-0000-0000-000000000062', 'good_companion', 1, 'traditional', 'Aromatic companion often used with tomatoes.', 'Plant 10-18 inches away.', 16, 38, 'Community + extension mixed evidence.', true),
  ('20000000-0000-0000-0000-000000000232', '20000000-0000-0000-0000-000000000062', '20000000-0000-0000-0000-000000000061', 'good_companion', 1, 'traditional', 'Shared mixed-bed success pattern.', 'Interplant at row edges.', 16, 38, 'Mutual relationship record.', true)
on conflict (id) do nothing;

insert into catalog.phenology_templates (
  id,
  plant_profile_id,
  region_type,
  region_value,
  is_default,
  notes,
  created_by_user_id
)
values
  ('20000000-0000-0000-0000-000000000241', '20000000-0000-0000-0000-000000000061', 'usda_zone', '8b', true, 'Tomato schedule for warm spring climate.', '10000000-0000-0000-0000-000000000011'),
  ('20000000-0000-0000-0000-000000000242', '20000000-0000-0000-0000-000000000062', 'usda_zone', '8b', true, 'Basil schedule for warm spring climate.', '10000000-0000-0000-0000-000000000011')
on conflict (id) do nothing;

insert into catalog.phenology_events (
  id,
  phenology_template_id,
  stage_code,
  stage_name,
  trigger_type,
  trigger_rule,
  timing_type,
  earliest_date,
  typical_date,
  latest_date,
  week_start_of_year,
  week_end_of_year,
  month_start,
  month_end,
  offset_days_from_planting,
  repeat_every_days,
  cues,
  recommended_action,
  recurrence,
  urgency_code,
  failure_risk_if_missed,
  priority_weight,
  repeatable
)
values
  (
    '20000000-0000-0000-0000-000000000251',
    '20000000-0000-0000-0000-000000000241',
    'transplant',
    'Transplant Window',
    'frost',
    'After last frost and soil > 60F',
    'soil_temp',
    '2026-03-10',
    '2026-03-20',
    '2026-04-15',
    11,
    16,
    3,
    4,
    null,
    null,
    'Soil warm and overnight lows above 50F.',
    'Transplant tomato seedlings.',
    'annual',
    'high',
    'Reduced yield due to delayed establishment.',
    90,
    false
  ),
  (
    '20000000-0000-0000-0000-000000000252',
    '20000000-0000-0000-0000-000000000241',
    'harvest',
    'Harvest Window',
    'calendar',
    'Typical summer window',
    'calendar',
    '2026-06-10',
    '2026-07-05',
    '2026-09-01',
    24,
    36,
    6,
    9,
    null,
    3,
    'Color break and fruit softness.',
    'Harvest ripe fruits twice weekly.',
    'weekly',
    'medium',
    'Overripe fruit drop and pest pressure.',
    70,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000253',
    '20000000-0000-0000-0000-000000000242',
    'maintenance',
    'Pinch/Harvest Leaves',
    'calendar',
    'Post-establishment leaf harvest loop',
    'event_offset',
    '2026-04-01',
    '2026-04-15',
    '2026-09-15',
    14,
    38,
    4,
    9,
    21,
    7,
    'Pinch tips once plants branch.',
    'Harvest basil leaves and pinch flower buds.',
    'weekly',
    'medium',
    'Reduced leaf production and early bolting.',
    60,
    true
  )
on conflict (id) do nothing;

insert into catalog.plant_zone_profiles (
  id,
  plant_profile_id,
  region_type,
  region_value,
  usda_zone_min,
  usda_zone_max,
  planting_window_start_week,
  planting_window_end_week,
  harvest_window_start_week,
  harvest_window_end_week,
  bloom_window_start_week,
  bloom_window_end_week,
  dieback_window_start_week,
  reemergence_window_start_week,
  proliferation_behavior,
  maintenance_timing_notes,
  seasonal_risk_notes
)
values
  (
    '20000000-0000-0000-0000-000000000261',
    '20000000-0000-0000-0000-000000000061',
    'usda_zone',
    '8b',
    '3a',
    '11a',
    11,
    16,
    24,
    40,
    16,
    30,
    45,
    null,
    'Annual crop cycle',
    'Trellis by week 18, prune weekly from week 20.',
    'Heat spikes in July can stress fruit set.'
  ),
  (
    '20000000-0000-0000-0000-000000000262',
    '20000000-0000-0000-0000-000000000062',
    'usda_zone',
    '8b',
    '4a',
    '11a',
    12,
    18,
    20,
    38,
    16,
    34,
    45,
    null,
    'Warm-season annual herb',
    'Pinch regularly to delay flowering.',
    'Bolting risk in sustained high heat.'
  )
on conflict (id) do nothing;

insert into catalog.plant_care_events (
  id,
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
  (
    '20000000-0000-0000-0000-000000000271',
    '20000000-0000-0000-0000-000000000061',
    'maintenance',
    'prune',
    'lifecycle',
    'Prune tomato suckers',
    'Prune side shoots to improve airflow and fruiting balance.',
    'FREQ=WEEKLY;BYDAY=MO',
    0,
    7,
    'medium',
    false,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000272',
    '20000000-0000-0000-0000-000000000062',
    'maintenance',
    'harvest',
    'lifecycle',
    'Harvest basil tips',
    'Harvest top growth to keep basil productive and delay flowering.',
    'FREQ=WEEKLY;BYDAY=WE',
    0,
    7,
    'medium',
    false,
    true,
    true
  )
on conflict (id) do nothing;

insert into catalog.plant_cultivar_overrides (
  id,
  plant_cultivar_id,
  plant_profile_id,
  region_type,
  region_value,
  field_key,
  override_scope,
  override_value,
  evidence_strength_code,
  source_notes
)
values
  (
    '20000000-0000-0000-0000-000000000281',
    '20000000-0000-0000-0000-000000000051',
    '20000000-0000-0000-0000-000000000061',
    'usda_zone',
    '8b',
    'yield_lb_per_plant_year_max',
    'yield',
    '{"value": 30, "unit": "lb/plant/year"}'::jsonb,
    'moderate',
    'Regional grower observations and extension references.'
  )
on conflict (id) do nothing;

insert into catalog.plant_sources (
  id,
  source_name,
  source_type,
  publisher,
  author,
  source_url,
  citation_text,
  published_on,
  credibility_score,
  license,
  notes,
  last_reviewed_at
)
values
  (
    '20000000-0000-0000-0000-000000000291',
    'USDA Plant Hardiness Zone Map',
    'government',
    'USDA ARS',
    null,
    'https://planthardiness.ars.usda.gov',
    'USDA hardiness zone guidance used for regional adaptation.',
    '2025-01-01',
    9.5,
    'Public domain',
    'Primary source for hardiness mapping.',
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000292',
    'Cornell Small Farms Program',
    'extension',
    'Cornell University',
    null,
    'https://smallfarms.cornell.edu/resources/crop-planning/',
    'Crop planning and management references.',
    '2024-01-01',
    8.8,
    'Educational use',
    'Useful operational planning guidance.',
    now()
  )
on conflict (id) do nothing;

insert into catalog.plant_claims (
  id,
  plant_profile_id,
  plant_cultivar_id,
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
  reviewed_by_user_id,
  reviewed_by_human,
  review_status,
  region_scope,
  cultivar_scope,
  ai_generated_summary,
  human_verified,
  conflict_flag,
  region_specific_conflict_notes
)
values
  (
    '20000000-0000-0000-0000-000000000301',
    '20000000-0000-0000-0000-000000000061',
    '20000000-0000-0000-0000-000000000051',
    'water_need_level',
    '{"value":"medium"}'::jsonb,
    'strong',
    0.92,
    3,
    2,
    now(),
    '20000000-0000-0000-0000-000000000292',
    'Consistent moisture improves tomato quality and reduces cracking.',
    'https://smallfarms.cornell.edu/resources/crop-planning/',
    '10000000-0000-0000-0000-000000000011',
    true,
    'approved',
    'USDA 8b',
    'Cherokee Purple',
    false,
    true,
    false,
    null
  ),
  (
    '20000000-0000-0000-0000-000000000302',
    '20000000-0000-0000-0000-000000000062',
    null,
    'companion_potential_with_tomato',
    '{"supports":true,"confidence_note":"traditional evidence"}'::jsonb,
    'traditional',
    0.68,
    2,
    1,
    now(),
    '20000000-0000-0000-0000-000000000292',
    'Companion usage appears in many grower guides.',
    'https://smallfarms.cornell.edu/resources/crop-planning/',
    '10000000-0000-0000-0000-000000000011',
    true,
    'approved',
    'USDA 8b',
    null,
    false,
    true,
    false,
    null
  )
on conflict (id) do nothing;

insert into catalog.plant_images (
  id,
  plant_profile_id,
  source_id,
  stage_code,
  image_url,
  storage_key,
  mime_type,
  width_px,
  height_px,
  attribution_text,
  license,
  is_primary,
  is_public
)
values
  (
    '20000000-0000-0000-0000-000000000311',
    '20000000-0000-0000-0000-000000000061',
    '20000000-0000-0000-0000-000000000292',
    'fruiting',
    'https://example.com/images/tomato-cherokee-purple.jpg',
    'catalog/tomato-cherokee-purple.jpg',
    'image/jpeg',
    1600,
    1200,
    'Garden.io demo image credit',
    'CC-BY',
    true,
    true
  )
on conflict (id) do nothing;

insert into catalog.event_templates (
  id,
  template_key,
  label,
  task_type_code,
  source_type_code,
  default_title,
  default_description,
  metadata,
  is_active
)
values
  (
    '20000000-0000-0000-0000-000000000321',
    'harvest_likely_window',
    'Harvest Window Reminder',
    'harvest',
    'lifecycle',
    'Harvest likely this week',
    'Check crop maturity and schedule harvest pass.',
    '{"surface":"calendar","kind":"signal"}'::jsonb,
    true
  )
on conflict (id) do nothing;

-- ============================================================================
-- Property-side plant instances and execution data
-- ============================================================================

insert into core.plant_instances (
  id,
  property_id,
  zone_id,
  bed_id,
  plant_profile_id,
  plant_cultivar_id,
  display_name_override,
  quantity,
  unit_type,
  planting_method_code,
  planted_at,
  expected_end_at,
  current_stage_code,
  status_code,
  source_origin,
  position_payload,
  notes,
  performance_score,
  is_archived,
  created_by_user_id,
  updated_by_user_id
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '20000000-0000-0000-0000-000000000061',
    '20000000-0000-0000-0000-000000000051',
    null,
    6,
    'count',
    'transplant_seedling',
    '2026-03-20',
    '2026-09-15',
    'maintenance',
    'active',
    'nursery',
    '{"row":1,"position":"north"}'::jsonb,
    'Main production tomato block.',
    8.2,
    false,
    '10000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '20000000-0000-0000-0000-000000000062',
    null,
    null,
    4,
    'count',
    'transplant_seedling',
    '2026-03-25',
    '2026-08-30',
    'maintenance',
    'active',
    'nursery',
    '{"row":2,"position":"edge"}'::jsonb,
    'Companion basil in tomato bed edges.',
    7.9,
    false,
    '10000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011'
  )
on conflict (id) do nothing;

insert into core.plant_instance_stage_history (
  id,
  plant_instance_id,
  stage_code,
  started_at,
  ended_at,
  source_type,
  notes,
  created_by_user_id
)
values
  ('30000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000001', 'transplant', '2026-03-20T09:00:00Z', '2026-04-05T09:00:00Z', 'user', 'Transplanted successfully.', '10000000-0000-0000-0000-000000000011'),
  ('30000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000001', 'maintenance', '2026-04-05T09:00:00Z', null, 'inferred', 'Now in steady growth stage.', '10000000-0000-0000-0000-000000000011')
on conflict (id) do nothing;

insert into core.plant_instance_seasons (
  id,
  plant_instance_id,
  season_label,
  calendar_year,
  status_summary,
  yield_summary,
  performance_score
)
values
  ('30000000-0000-0000-0000-000000000021', '30000000-0000-0000-0000-000000000001', 'Summer', 2026, 'Strong vigor after early prune cycle.', 'Projected 90 lb across 6 plants.', 8.4),
  ('30000000-0000-0000-0000-000000000022', '30000000-0000-0000-0000-000000000002', 'Summer', 2026, 'Companion herb healthy and productive.', 'Continuous leaf harvest.', 7.8)
on conflict (id) do nothing;

insert into core.user_plant_wishlist (
  id,
  user_id,
  property_id,
  plant_profile_id,
  notes,
  priority,
  added_at
)
values
  ('30000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000062', 'Add another basil succession in late spring.', 4, now()),
  ('30000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000012', null, '20000000-0000-0000-0000-000000000061', 'Trial heirloom in family garden.', 3, now())
on conflict (id) do nothing;

insert into core.tasks (
  id,
  property_id,
  zone_id,
  bed_id,
  plant_instance_id,
  assigned_user_id,
  source_type_code,
  task_type_code,
  status_code,
  priority_code,
  title,
  description,
  window_start_at,
  window_end_at,
  due_at,
  completed_at,
  skipped_at,
  created_by_user_id,
  generation_ref,
  metadata
)
values
  (
    '30000000-0000-0000-0000-000000000041',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000012',
    'lifecycle',
    'prune',
    'scheduled',
    'medium',
    'Prune tomato suckers this week',
    'Remove excess side shoots and improve airflow.',
    now()::date,
    (now() + interval '6 days')::date,
    (now() + interval '3 days')::date,
    null,
    null,
    '10000000-0000-0000-0000-000000000011',
    'phenology:20000000-0000-0000-0000-000000000251',
    '{"origin":"phenology_event"}'::jsonb
  ),
  (
    '30000000-0000-0000-0000-000000000042',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000013',
    'manual',
    'harvest',
    'suggested',
    'low',
    'Pinch basil tops',
    'Harvest basil tips before flowering accelerates.',
    now()::date,
    (now() + interval '4 days')::date,
    null,
    null,
    null,
    '10000000-0000-0000-0000-000000000012',
    null,
    '{"source":"manual"}'::jsonb
  )
on conflict (id) do nothing;

insert into core.weather_adjustment_proposals (
  id,
  property_id,
  task_id,
  proposed_action,
  reason,
  confidence_score,
  requires_user_confirmation,
  decision_status,
  decided_by_user_id,
  decided_at,
  applied_at,
  payload
)
values
  (
    '30000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000021',
    '30000000-0000-0000-0000-000000000041',
    'reschedule',
    'Heavy rain forecast likely reduces immediate pruning priority.',
    0.71,
    true,
    'proposed',
    null,
    null,
    null,
    '{"weather_alert":"rain","window_shift_days":2}'::jsonb
  )
on conflict (id) do nothing;

insert into core.recurring_task_templates (
  id,
  property_id,
  zone_id,
  bed_id,
  plant_profile_id,
  title_template,
  description_template,
  task_type_code,
  source_type_code,
  repeat_rule,
  default_priority_code,
  metadata,
  is_active,
  created_by_user_id
)
values
  (
    '30000000-0000-0000-0000-000000000061',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '20000000-0000-0000-0000-000000000061',
    'Weekly tomato inspection',
    'Check leaf undersides and stem health.',
    'inspect',
    'maintenance',
    'FREQ=WEEKLY;BYDAY=SA',
    'medium',
    '{"checklist":["pests","leaf_color","support_ties"]}'::jsonb,
    true,
    '10000000-0000-0000-0000-000000000011'
  )
on conflict (id) do nothing;

insert into core.observations (
  id,
  property_id,
  zone_id,
  bed_id,
  plant_instance_id,
  observation_type,
  title,
  body,
  severity,
  observed_at,
  created_by_user_id,
  ai_interpreted,
  ai_summary,
  metadata
)
values
  (
    '30000000-0000-0000-0000-000000000071',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '30000000-0000-0000-0000-000000000001',
    'issue',
    'Lower leaf yellowing',
    'Some lower leaves turning yellow on two plants.',
    4,
    now() - interval '1 day',
    '10000000-0000-0000-0000-000000000012',
    true,
    'Likely early nitrogen demand increase; monitor progression.',
    '{"leaf_zone":"lower","count":2}'::jsonb
  )
on conflict (id) do nothing;

insert into core.media_assets (
  id,
  property_id,
  zone_id,
  bed_id,
  plant_instance_id,
  observation_id,
  uploaded_by_user_id,
  storage_provider,
  storage_key,
  mime_type,
  file_size_bytes,
  width_px,
  height_px,
  asset_kind,
  review_status,
  metadata
)
values
  (
    '30000000-0000-0000-0000-000000000081',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '30000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000071',
    '10000000-0000-0000-0000-000000000012',
    'supabase_storage',
    'property/10000000-0000-0000-0000-000000000021/obs-300000000000000000000000000000071.jpg',
    'image/jpeg',
    245000,
    1920,
    1080,
    'photo',
    'approved',
    '{"device":"iphone"}'::jsonb
  )
on conflict (id) do nothing;

insert into core.plant_health_issues (
  id,
  property_id,
  plant_instance_id,
  observation_id,
  issue_category,
  detected_by,
  status,
  confidence_score,
  summary,
  recommended_action,
  followup_due_at,
  created_by_user_id
)
values
  (
    '30000000-0000-0000-0000-000000000091',
    '10000000-0000-0000-0000-000000000021',
    '30000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000071',
    'nutrient',
    'ai',
    'monitoring',
    0.69,
    'Possible early nutrient imbalance indicated by lower leaf chlorosis.',
    'Top-dress compost and inspect again in one week.',
    now() + interval '7 days',
    '10000000-0000-0000-0000-000000000012'
  )
on conflict (id) do nothing;

insert into core.harvest_events (
  id,
  property_id,
  zone_id,
  bed_id,
  plant_instance_id,
  harvested_at,
  quantity_value,
  quantity_unit,
  quality_score,
  notes,
  recorded_by_user_id
)
values
  (
    '30000000-0000-0000-0000-000000000101',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '30000000-0000-0000-0000-000000000002',
    now() - interval '2 days',
    0.8,
    'lb',
    8,
    'First basil cut for kitchen use.',
    '10000000-0000-0000-0000-000000000013'
  )
on conflict (id) do nothing;

insert into core.weather_daily (
  id,
  property_id,
  weather_date,
  source_name,
  temp_min_f,
  temp_max_f,
  precip_in,
  humidity_avg,
  wind_avg_mph,
  condition_code,
  raw_payload
)
values
  (
    '30000000-0000-0000-0000-000000000111',
    '10000000-0000-0000-0000-000000000021',
    current_date,
    'open-meteo',
    64,
    87,
    0.15,
    62,
    7.5,
    'partly_cloudy',
    '{"provider":"open-meteo","forecast_hours":24}'::jsonb
  ),
  (
    '30000000-0000-0000-0000-000000000112',
    '10000000-0000-0000-0000-000000000021',
    current_date + interval '1 day',
    'open-meteo',
    66,
    89,
    1.20,
    70,
    9.0,
    'rain',
    '{"provider":"open-meteo","forecast_hours":48}'::jsonb
  )
on conflict (id) do nothing;

insert into core.weather_alerts (
  id,
  property_id,
  alert_type_code,
  starts_at,
  ends_at,
  severity_code,
  summary,
  payload
)
values
  (
    '30000000-0000-0000-0000-000000000121',
    '10000000-0000-0000-0000-000000000021',
    'rain',
    now() + interval '12 hours',
    now() + interval '36 hours',
    'medium',
    'Heavy rain expected tomorrow afternoon.',
    '{"expected_precip_in":1.2}'::jsonb
  )
on conflict (id) do nothing;

-- ============================================================================
-- Community contributions
-- ============================================================================

insert into community.shared_templates (
  id,
  owner_user_id,
  template_type,
  title,
  description,
  payload,
  is_public,
  is_featured
)
values
  (
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000011',
    'guild_template',
    'Tomato Companion Strip',
    'Tomato + basil + marigold pattern for raised beds.',
    '{"plants":["tomato","basil","marigold"],"spacing_in":{"tomato":24,"basil":10}}'::jsonb,
    true,
    true
  )
on conflict (id) do nothing;

insert into community.template_ratings (
  id,
  template_id,
  user_id,
  rating,
  comment
)
values
  (
    '40000000-0000-0000-0000-000000000011',
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000012',
    5,
    'Worked well for airflow and easy harvest access.'
  )
on conflict (id) do nothing;

insert into community.plant_comments (
  id,
  plant_profile_id,
  user_id,
  region_code,
  usda_zone,
  title,
  body,
  is_public,
  is_flagged
)
values
  (
    '40000000-0000-0000-0000-000000000021',
    '20000000-0000-0000-0000-000000000061',
    '10000000-0000-0000-0000-000000000012',
    'TX',
    '8b',
    'Strong summer performer',
    'Consistent watering and weekly pruning gave high-quality fruit in July heat.',
    true,
    false
  )
on conflict (id) do nothing;

insert into community.plant_ratings (
  id,
  plant_profile_id,
  user_id,
  property_id,
  rating_overall,
  rating_success,
  rating_ease
)
values
  (
    '40000000-0000-0000-0000-000000000031',
    '20000000-0000-0000-0000-000000000061',
    '10000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000021',
    5,
    5,
    3
  ),
  (
    '40000000-0000-0000-0000-000000000032',
    '20000000-0000-0000-0000-000000000062',
    '10000000-0000-0000-0000-000000000013',
    null,
    4,
    4,
    5
  )
on conflict (id) do nothing;

insert into community.plant_photo_submissions (
  id,
  plant_profile_id,
  user_id,
  media_asset_id,
  caption,
  region_code,
  usda_zone,
  review_status
)
values
  (
    '40000000-0000-0000-0000-000000000041',
    '20000000-0000-0000-0000-000000000061',
    '10000000-0000-0000-0000-000000000012',
    '30000000-0000-0000-0000-000000000081',
    'Leaf yellowing progression after heat wave.',
    'TX',
    '8b',
    'approved'
  )
on conflict (id) do nothing;

insert into community.plant_data_flags (
  id,
  plant_profile_id,
  user_id,
  field_name,
  reason,
  status,
  reviewed_by_user_id,
  resolution_notes
)
values
  (
    '40000000-0000-0000-0000-000000000051',
    '20000000-0000-0000-0000-000000000062',
    '10000000-0000-0000-0000-000000000013',
    'drought_tolerance_code',
    'Local experience suggests basil drought tolerance should remain low in full sun beds.',
    'in_review',
    '10000000-0000-0000-0000-000000000011',
    'Needs additional source-backed verification.'
  )
on conflict (id) do nothing;

-- ============================================================================
-- AI artifacts
-- ============================================================================

insert into ai.generation_jobs (
  id,
  job_type,
  status,
  requested_by_user_id,
  plant_profile_id,
  plant_taxon_search_term,
  input_payload,
  output_payload,
  error_payload,
  started_at,
  finished_at
)
values
  (
    '50000000-0000-0000-0000-000000000001',
    'recommendations',
    'succeeded',
    '10000000-0000-0000-0000-000000000012',
    '20000000-0000-0000-0000-000000000061',
    'tomato companions',
    '{"context":{"zone":"8b","bed":"tomato-bed-1"}}'::jsonb,
    '{"recommendations":["basil","marigold"]}'::jsonb,
    null,
    now() - interval '1 hour',
    now() - interval '50 minutes'
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'plant_generate',
    'running',
    '10000000-0000-0000-0000-000000000011',
    null,
    'serviceberry',
    '{"search_term":"serviceberry"}'::jsonb,
    null,
    null,
    now() - interval '5 minutes',
    null
  )
on conflict (id) do nothing;

insert into ai.generated_plant_payloads (
  id,
  generation_job_id,
  search_term,
  normalized_name,
  payload,
  review_status,
  published_plant_profile_id
)
values
  (
    '50000000-0000-0000-0000-000000000011',
    '50000000-0000-0000-0000-000000000002',
    'serviceberry',
    'Amelanchier',
    '{"candidate_profile":{"display_name":"Serviceberry","plant_type":"shrub"}}'::jsonb,
    'pending_review',
    null
  )
on conflict (id) do nothing;

insert into ai.diagnosis_runs (
  id,
  property_id,
  plant_instance_id,
  observation_id,
  media_asset_id,
  requested_by_user_id,
  model_name,
  input_payload,
  output_summary,
  confidence_score,
  recommended_actions,
  created_task_id
)
values
  (
    '50000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000021',
    '30000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000071',
    '30000000-0000-0000-0000-000000000081',
    '10000000-0000-0000-0000-000000000012',
    'gpt-vision-garden-v1',
    '{"symptom":"yellow lower leaves"}'::jsonb,
    'Likely nutrient demand increase during fruit set.',
    0.69,
    '{"actions":["top-dress compost","recheck in 7 days"]}'::jsonb,
    '30000000-0000-0000-0000-000000000041'
  )
on conflict (id) do nothing;

insert into ai.recommendation_logs (
  id,
  property_id,
  zone_id,
  bed_id,
  plant_instance_id,
  recommendation_type,
  context_payload,
  result_payload,
  feedback
)
values
  (
    '50000000-0000-0000-0000-000000000031',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000051',
    '10000000-0000-0000-0000-000000000061',
    '30000000-0000-0000-0000-000000000001',
    'companion_addition',
    '{"current_plants":["tomato"],"zone":"8b"}'::jsonb,
    '{"suggested":["basil"],"reason":"companion pattern"}'::jsonb,
    'helpful'
  )
on conflict (id) do nothing;

insert into ai.embeddings (
  id,
  entity_type,
  entity_id,
  embedding,
  content_hash,
  model_name
)
values
  (
    '50000000-0000-0000-0000-000000000041',
    'plant_profile',
    '20000000-0000-0000-0000-000000000061',
    null,
    'hash_demo_tomato_profile_v1',
    'text-embedding-3-large'
  )
on conflict (id) do nothing;

-- ============================================================================
-- Audit + ops records
-- ============================================================================

insert into audit.entity_events (
  id,
  property_id,
  entity_type,
  entity_id,
  event_type,
  performed_by_user_id,
  payload
)
values
  (
    '60000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000021',
    'plant_instance',
    '30000000-0000-0000-0000-000000000001',
    'plant_added',
    '10000000-0000-0000-0000-000000000011',
    '{"bed_id":"10000000-0000-0000-0000-000000000061"}'::jsonb
  )
on conflict (id) do nothing;

insert into audit.task_events (
  id,
  task_id,
  event_type,
  performed_by_user_id,
  payload
)
values
  (
    '60000000-0000-0000-0000-000000000011',
    '30000000-0000-0000-0000-000000000041',
    'created',
    '10000000-0000-0000-0000-000000000011',
    '{"source":"phenology"}'::jsonb
  )
on conflict (id) do nothing;

insert into audit.collaboration_events (
  id,
  property_id,
  membership_id,
  event_type,
  performed_by_user_id,
  payload
)
values
  (
    '60000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000032',
    'invite_accepted',
    '10000000-0000-0000-0000-000000000011',
    '{"accepted_user_id":"10000000-0000-0000-0000-000000000012"}'::jsonb
  )
on conflict (id) do nothing;

insert into ops.notifications (
  id,
  user_id,
  property_id,
  channel,
  notification_type,
  template_key,
  payload,
  status,
  scheduled_for,
  sent_at,
  error_message
)
values
  (
    '70000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000021',
    'in_app',
    'task_due_soon',
    'task_due_reminder',
    '{"task_id":"30000000-0000-0000-0000-000000000041"}'::jsonb,
    'queued',
    now() + interval '30 minutes',
    null,
    null
  )
on conflict (id) do nothing;

insert into ops.generated_reports (
  id,
  property_id,
  report_type,
  period_start,
  period_end,
  payload,
  generated_at
)
values
  (
    '70000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000021',
    'weekly',
    current_date - interval '7 days',
    current_date,
    '{"summary":{"open_tasks":2,"harvest_watch":["tomato","basil"]}}'::jsonb,
    now()
  )
on conflict (id) do nothing;

insert into ops.webhook_deliveries (
  id,
  webhook_type,
  endpoint,
  payload,
  status_code,
  delivery_status,
  attempts,
  next_attempt_at,
  last_error
)
values
  (
    '70000000-0000-0000-0000-000000000021',
    'weekly_report_email',
    'https://api.example.com/hooks/reports',
    '{"report_id":"70000000-0000-0000-0000-000000000011"}'::jsonb,
    202,
    'succeeded',
    1,
    null,
    null
  )
on conflict (id) do nothing;

insert into ops.cron_run_logs (
  id,
  job_key,
  run_status,
  started_at,
  finished_at,
  payload,
  error_message
)
values
  (
    '70000000-0000-0000-0000-000000000031',
    'weekly-report-generator',
    'succeeded',
    now() - interval '10 minutes',
    now() - interval '9 minutes',
    '{"property_count":1}'::jsonb,
    null
  )
on conflict (id) do nothing;

insert into ops.background_jobs (
  id,
  job_type,
  status,
  priority_code,
  payload,
  error_message,
  attempts,
  max_attempts,
  scheduled_for,
  started_at,
  finished_at
)
values
  (
    '70000000-0000-0000-0000-000000000041',
    'weather-sync',
    'queued',
    'medium',
    '{"property_id":"10000000-0000-0000-0000-000000000021"}'::jsonb,
    null,
    0,
    5,
    now() + interval '5 minutes',
    null,
    null
  )
on conflict (id) do nothing;

commit;
