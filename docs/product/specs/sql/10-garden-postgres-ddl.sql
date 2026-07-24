-- Garden.io Module 10
-- PostgreSQL DDL schema
-- Effective date: 2026-03-09

begin;

-- ============================================================================
-- Extensions
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists vector;

-- ============================================================================
-- Schemas
-- ============================================================================

create schema if not exists core;
create schema if not exists catalog;
create schema if not exists community;
create schema if not exists ai;
create schema if not exists audit;
create schema if not exists ops;
create schema if not exists reporting;

-- ============================================================================
-- Utility functions
-- ============================================================================

create or replace function core.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.version := coalesce(old.version, 1) + 1;
  return new;
end;
$$;

create or replace function core.current_user_id()
returns uuid
language plpgsql
stable
as $$
declare
  raw_sub text;
begin
  raw_sub := current_setting('request.jwt.claim.sub', true);
  if raw_sub is null or raw_sub = '' then
    return null;
  end if;
  return raw_sub::uuid;
exception
  when others then
    return null;
end;
$$;

-- ============================================================================
-- Core reference tables
-- ============================================================================

create table if not exists core.property_label_types (
  code text primary key,
  label text not null,
  description text,
  sort_order int not null default 100
);

insert into core.property_label_types (code, label, description, sort_order)
values
  ('garden', 'Garden', 'General garden property', 10),
  ('farm', 'Farm', 'Small or diversified farm', 20),
  ('homestead', 'Homestead', 'Homestead-style growing property', 30),
  ('orchard', 'Orchard', 'Tree-fruit-focused property', 40),
  ('ranch', 'Ranch', 'Ranch property', 50),
  ('vineyard', 'Vineyard', 'Vine-focused property', 60),
  ('custom', 'Custom', 'Custom user-selected label', 70)
on conflict (code) do nothing;

create table if not exists core.membership_role_types (
  code text primary key,
  rank_value smallint not null,
  label text not null,
  description text,
  unique(rank_value)
);

insert into core.membership_role_types (code, rank_value, label, description)
values
  ('owner', 100, 'Owner', 'Full control including billing and deletion'),
  ('manager', 80, 'Manager', 'Can manage structure and tasks'),
  ('contributor', 50, 'Contributor', 'Can log work and observations'),
  ('viewer', 10, 'Viewer', 'Read-only access')
on conflict (code) do nothing;

create table if not exists core.task_source_types (
  code text primary key,
  label text not null,
  description text
);

insert into core.task_source_types (code, label, description)
values
  ('lifecycle', 'Lifecycle', 'Generated from phenology/lifecycle logic'),
  ('maintenance', 'Maintenance', 'Routine maintenance task'),
  ('weather', 'Weather', 'Generated from weather signal'),
  ('observation', 'Observation', 'Generated from user observation or issue'),
  ('ai', 'AI', 'Generated from AI recommendation'),
  ('manual', 'Manual', 'Created directly by user'),
  ('template', 'Template', 'Created from reusable template')
on conflict (code) do nothing;

create table if not exists core.task_type_types (
  code text primary key,
  label text not null,
  sort_order int not null default 100
);

insert into core.task_type_types (code, label, sort_order)
values
  ('plant', 'Planting', 10),
  ('water', 'Watering', 20),
  ('inspect', 'Inspection', 30),
  ('prune', 'Pruning', 40),
  ('harvest', 'Harvest', 50),
  ('fertilize', 'Fertilize', 60),
  ('mulch', 'Mulch', 70),
  ('support', 'Support/Staking', 80),
  ('protect', 'Protection', 90),
  ('observe', 'Observation', 100),
  ('repair', 'Repair', 110),
  ('cleanup', 'Cleanup', 120),
  ('other', 'Other', 130)
on conflict (code) do nothing;

create table if not exists core.task_status_types (
  code text primary key,
  label text not null,
  is_open boolean not null,
  sort_order int not null default 100
);

insert into core.task_status_types (code, label, is_open, sort_order)
values
  ('suggested', 'Suggested', true, 10),
  ('scheduled', 'Scheduled', true, 20),
  ('completed', 'Completed', false, 30),
  ('skipped', 'Skipped', false, 40),
  ('expired', 'Expired', false, 50)
on conflict (code) do nothing;

create table if not exists core.priority_levels (
  code text primary key,
  rank_value smallint not null,
  label text not null
);

insert into core.priority_levels (code, rank_value, label)
values
  ('low', 10, 'Low'),
  ('medium', 20, 'Medium'),
  ('high', 30, 'High'),
  ('critical', 40, 'Critical')
on conflict (code) do nothing;

create table if not exists core.plant_instance_status_types (
  code text primary key,
  label text not null,
  is_active boolean not null,
  sort_order int not null default 100
);

insert into core.plant_instance_status_types (code, label, is_active, sort_order)
values
  ('planned', 'Planned', false, 10),
  ('active', 'Active', true, 20),
  ('dormant', 'Dormant', true, 30),
  ('harvested_out', 'Harvested Out', false, 40),
  ('failed', 'Failed', false, 50),
  ('archived', 'Archived', false, 60)
on conflict (code) do nothing;

create table if not exists core.alert_types (
  code text primary key,
  label text not null,
  description text
);

insert into core.alert_types (code, label, description)
values
  ('frost', 'Frost', 'Frost risk signal'),
  ('heat', 'Heat', 'Heat stress signal'),
  ('rain', 'Rain', 'Rain or storm signal'),
  ('wind', 'Wind', 'Wind stress signal'),
  ('drought', 'Drought', 'Dry spell signal')
on conflict (code) do nothing;

-- ============================================================================
-- Accounts, users, memberships
-- ============================================================================

create table if not exists core.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan_tier text not null default 'free' check (plan_tier in ('free', 'paid', 'enterprise')),
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled', 'suspended')),
  billing_customer_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  sort_order int not null default 100
);

create table if not exists core.users (
  id uuid primary key,
  account_id uuid not null references core.accounts(id) on delete cascade,
  email text not null,
  email_normalized text generated always as (lower(trim(email))) stored,
  display_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  locale text not null default 'en-US',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  sort_order int not null default 100,
  unique (email_normalized)
);

create index if not exists idx_users_account_active on core.users(account_id, is_active);

create table if not exists core.properties (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references core.accounts(id) on delete cascade,
  name text not null,
  property_label_code text not null references core.property_label_types(code),
  custom_label text,
  slug text not null,
  description text,
  country_code char(2),
  region_code text,
  postal_code text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  usda_zone text,
  ahs_heat_zone text,
  default_timezone text,
  start_of_week smallint not null default 1 check (start_of_week between 1 and 7),
  notes text,
  is_archived boolean not null default false,
  deleted_at timestamptz,
  created_by_user_id uuid references core.users(id),
  updated_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  sort_order int not null default 100,
  unique (account_id, slug)
);

create index if not exists idx_properties_account_archived on core.properties(account_id, is_archived);
create index if not exists idx_properties_geo on core.properties(country_code, region_code, postal_code);

create table if not exists core.property_memberships (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  user_id uuid not null references core.users(id) on delete cascade,
  role_code text not null references core.membership_role_types(code),
  invited_by_user_id uuid references core.users(id),
  invitation_email text,
  accepted_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (property_id, user_id)
);

create index if not exists idx_property_memberships_property_role_active
  on core.property_memberships(property_id, role_code, is_active);
create index if not exists idx_property_memberships_user_active
  on core.property_memberships(user_id, is_active);

create table if not exists core.property_invitations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  email text not null,
  role_code text not null references core.membership_role_types(code),
  invited_by_user_id uuid not null references core.users(id),
  invitation_token text not null unique,
  invitation_status text not null default 'pending' check (invitation_status in ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz,
  accepted_at timestamptz,
  accepted_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_property_invitations_property_status on core.property_invitations(property_id, invitation_status);

-- ============================================================================
-- Spatial hierarchy
-- ============================================================================

create table if not exists core.zones (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  name text not null,
  slug text not null,
  purpose text,
  description text,
  environment_summary text,
  sun_profile text,
  soil_profile text,
  irrigation_profile text,
  slope_profile text,
  wind_profile text,
  microclimate_notes text,
  map_geometry jsonb,
  sort_order int not null default 100,
  is_archived boolean not null default false,
  deleted_at timestamptz,
  created_by_user_id uuid references core.users(id),
  updated_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (property_id, slug),
  unique (id, property_id)
);

create index if not exists idx_zones_property_sort on core.zones(property_id, sort_order);
create index if not exists idx_zones_property_archived on core.zones(property_id, is_archived);

create table if not exists core.beds (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  zone_id uuid not null,
  name text not null,
  slug text not null,
  bed_type text not null check (
    bed_type in (
      'raised',
      'in_ground',
      'row',
      'container_group',
      'trellis_run',
      'orchard_ring',
      'perennial_patch',
      'wild_section'
    )
  ),
  description text,
  length_value numeric(10,2),
  width_value numeric(10,2),
  height_value numeric(10,2),
  unit_system text not null default 'imperial' check (unit_system in ('imperial', 'metric')),
  sun_hours_min numeric(4,1),
  sun_hours_max numeric(4,1),
  preferred_light text,
  soil_texture text,
  drainage_class text,
  organic_matter_pct numeric(5,2),
  soil_ph_min numeric(4,2),
  soil_ph_max numeric(4,2),
  soil_notes text,
  irrigation_method text,
  watering_zone_ref text,
  layout_payload jsonb,
  sort_order int not null default 100,
  is_archived boolean not null default false,
  deleted_at timestamptz,
  created_by_user_id uuid references core.users(id),
  updated_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (zone_id, slug),
  unique (id, property_id, zone_id),
  constraint fk_beds_zone_property
    foreign key (zone_id, property_id)
    references core.zones(id, property_id)
    on delete cascade,
  check (sun_hours_min is null or sun_hours_max is null or sun_hours_min <= sun_hours_max)
);

create index if not exists idx_beds_zone_sort on core.beds(zone_id, sort_order);
create index if not exists idx_beds_property_zone_archived on core.beds(property_id, zone_id, is_archived);

create table if not exists core.property_activity (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  actor_user_id uuid references core.users(id),
  event_type text not null,
  summary text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_property_activity_property_created_desc
  on core.property_activity(property_id, created_at desc);

-- ============================================================================
-- Catalog reference data
-- ============================================================================

create table if not exists catalog.plant_types (
  code text primary key,
  label text not null,
  sort_order int not null default 100
);

insert into catalog.plant_types (code, label, sort_order)
values
  ('tree', 'Tree', 10),
  ('shrub', 'Shrub', 20),
  ('subshrub', 'Subshrub', 25),
  ('vine', 'Vine', 30),
  ('groundcover', 'Groundcover', 40),
  ('grass', 'Grass', 50),
  ('sedge', 'Sedge', 55),
  ('fern', 'Fern', 60),
  ('forb', 'Forb', 65),
  ('succulent', 'Succulent', 70),
  ('aquatic', 'Aquatic', 75),
  ('herb', 'Herb', 80),
  ('vegetable', 'Vegetable', 90),
  ('grain', 'Grain', 100),
  ('legume', 'Legume', 110),
  ('fruit_cane', 'Fruit Cane', 120),
  ('bulb', 'Bulb', 130),
  ('tuber', 'Tuber', 140)
on conflict (code) do nothing;

create table if not exists catalog.maintenance_levels (
  code text primary key,
  rank_value smallint not null,
  label text not null
);

insert into catalog.maintenance_levels (code, rank_value, label)
values
  ('very_low', 10, 'Very Low'),
  ('low', 20, 'Low'),
  ('medium', 30, 'Medium'),
  ('high', 40, 'High'),
  ('very_high', 50, 'Very High')
on conflict (code) do nothing;

create table if not exists catalog.evidence_strength_levels (
  code text primary key,
  rank_value smallint not null,
  label text not null
);

insert into catalog.evidence_strength_levels (code, rank_value, label)
values
  ('strong', 50, 'Strong'),
  ('moderate', 40, 'Moderate'),
  ('weak', 30, 'Weak'),
  ('traditional', 20, 'Traditional'),
  ('anecdotal', 10, 'Anecdotal'),
  ('unknown', 0, 'Unknown')
on conflict (code) do nothing;

create table if not exists catalog.tolerance_levels (
  code text primary key,
  rank_value smallint not null,
  label text not null
);

insert into catalog.tolerance_levels (code, rank_value, label)
values
  ('very_low', 10, 'Very Low'),
  ('low', 20, 'Low'),
  ('medium', 30, 'Medium'),
  ('high', 40, 'High'),
  ('very_high', 50, 'Very High'),
  ('unknown', 0, 'Unknown')
on conflict (code) do nothing;

create table if not exists catalog.safety_levels (
  code text primary key,
  rank_value smallint not null,
  label text not null
);

insert into catalog.safety_levels (code, rank_value, label)
values
  ('safe', 10, 'Safe'),
  ('caution', 20, 'Caution'),
  ('toxic', 30, 'Toxic'),
  ('severe_toxicity', 40, 'Severe Toxicity'),
  ('unknown', 0, 'Unknown')
on conflict (code) do nothing;

create table if not exists catalog.use_types (
  code text primary key,
  label text not null,
  description text,
  sort_order int not null default 100
);

insert into catalog.use_types (code, label, description, sort_order)
values
  ('culinary', 'Culinary', 'Used for cooking', 10),
  ('medicinal', 'Medicinal', 'Used in herbal practice', 20),
  ('pollinator_support', 'Pollinator Support', 'Supports pollinator activity', 30),
  ('erosion_control', 'Erosion Control', 'Helps stabilize soil', 40),
  ('chop_and_drop', 'Chop and Drop', 'Provides biomass for mulch', 50),
  ('nitrogen_fixation', 'Nitrogen Fixation', 'Supports nitrogen cycling', 60),
  ('dynamic_accumulator', 'Dynamic Accumulator', 'Mines deeper nutrients', 70),
  ('pest_confusion', 'Pest Confusion', 'Can confuse pests in mixed planting', 80),
  ('trap_crop', 'Trap Crop', 'Attracts pests away from primary crop', 90),
  ('privacy_screen', 'Privacy Screen', 'Visual/privacy barrier', 100),
  ('fodder', 'Fodder', 'Livestock fodder use', 110),
  ('cut_flower', 'Cut Flower', 'Cut flower production', 120),
  ('shade', 'Shade', 'Shade-providing plant', 130),
  ('edible_fruit', 'Edible Fruit', 'Produces edible fruit', 140),
  ('edible_leaf', 'Edible Leaf', 'Produces edible leaves', 150),
  ('living_mulch', 'Living Mulch', 'Ground cover for moisture/weed suppression', 160)
on conflict (code) do nothing;

create table if not exists catalog.environment_tags (
  code text primary key,
  label text not null,
  description text
);

insert into catalog.environment_tags (code, label, description)
values
  ('full_sun', 'Full Sun', 'Generally 6+ hours direct sunlight'),
  ('part_shade', 'Part Shade', 'Filtered or partial-day shade'),
  ('full_shade', 'Full Shade', 'Low direct sunlight'),
  ('humidity_tolerant', 'Humidity Tolerant', 'Performs in humid conditions'),
  ('drought_tolerant', 'Drought Tolerant', 'Handles low-water periods'),
  ('frost_sensitive', 'Frost Sensitive', 'Requires frost protection')
on conflict (code) do nothing;

create table if not exists catalog.soil_types (
  code text primary key,
  label text not null,
  description text
);

insert into catalog.soil_types (code, label, description)
values
  ('sand', 'Sand', 'Coarse draining soil'),
  ('sandy_loam', 'Sandy Loam', 'Balanced with strong drainage'),
  ('loam', 'Loam', 'Balanced mineral/organic profile'),
  ('silt_loam', 'Silt Loam', 'Fine texture, moderate drainage'),
  ('clay', 'Clay', 'Dense, water-retentive soil'),
  ('rocky', 'Rocky', 'High mineral/stone composition'),
  ('peaty', 'Peaty', 'Organic-rich soil')
on conflict (code) do nothing;

create table if not exists catalog.aesthetic_style_tags (
  code text primary key,
  label text not null,
  description text
);

insert into catalog.aesthetic_style_tags (code, label, description)
values
  ('formal', 'Formal', 'Structured visual style'),
  ('cottage', 'Cottage', 'Dense, informal cottage style'),
  ('meadow', 'Meadow', 'Natural meadow style'),
  ('tropical', 'Tropical', 'Large-leaf or tropical look'),
  ('edible_landscape', 'Edible Landscape', 'Food-first ornamental style'),
  ('xeric', 'Xeric', 'Water-wise style'),
  ('woodland', 'Woodland', 'Shade/forest-garden style')
on conflict (code) do nothing;

create table if not exists catalog.planting_methods (
  code text primary key,
  label text not null,
  description text
);

insert into catalog.planting_methods (code, label, description)
values
  ('direct_sow', 'Direct Sow', 'Seed directly into bed'),
  ('transplant_seedling', 'Transplant Seedling', 'Transplant started seedling'),
  ('cutting', 'Cutting', 'Root from cutting'),
  ('division', 'Division', 'Divide mature plant'),
  ('bare_root', 'Bare Root', 'Plant dormant bare-root stock'),
  ('crown', 'Crown', 'Plant crown division'),
  ('tuber', 'Tuber', 'Plant tuber'),
  ('rhizome', 'Rhizome', 'Plant rhizome'),
  ('bulb', 'Bulb', 'Plant bulb'),
  ('grafted_tree', 'Grafted Tree', 'Plant grafted woody stock')
on conflict (code) do nothing;

create table if not exists catalog.lifecycle_stage_types (
  code text primary key,
  label text not null,
  stage_category text not null check (stage_category in ('biological', 'management')),
  sort_order int not null default 100,
  description text
);

insert into catalog.lifecycle_stage_types (code, label, stage_category, sort_order, description)
values
  ('bed_prep', 'Bed Prep', 'management', 10, 'Prepare bed before planting'),
  ('direct_sow', 'Direct Sow', 'management', 20, 'Direct sow stage'),
  ('transplant', 'Transplant', 'management', 30, 'Transplant stage'),
  ('establishment', 'Establishment', 'biological', 40, 'Early establishment stage'),
  ('maintenance', 'Maintenance', 'management', 50, 'Routine maintenance stage'),
  ('inspection', 'Inspection', 'management', 55, 'Inspection stage'),
  ('flowering', 'Flowering', 'biological', 60, 'Flowering stage'),
  ('fruiting', 'Fruiting', 'biological', 70, 'Fruiting stage'),
  ('harvest', 'Harvest', 'management', 80, 'Harvest stage'),
  ('trim', 'Trim', 'management', 85, 'Trim/prune stage'),
  ('seed_set', 'Seed Set', 'biological', 90, 'Seed set stage'),
  ('seed_drop', 'Seed Drop', 'biological', 95, 'Seed drop stage'),
  ('die_back', 'Die Back', 'biological', 100, 'Seasonal die-back'),
  ('reemergence', 'Re-emergence', 'biological', 110, 'Re-emergence stage'),
  ('termination', 'Termination', 'management', 120, 'End crop cycle'),
  ('propagation', 'Propagation', 'management', 130, 'Propagation stage'),
  ('dormant_entry', 'Dormant Entry', 'biological', 140, 'Entering dormancy'),
  ('dormant_exit', 'Dormant Exit', 'biological', 150, 'Exiting dormancy')
on conflict (code) do nothing;

create table if not exists catalog.safety_subject_types (
  code text primary key,
  label text not null
);

insert into catalog.safety_subject_types (code, label)
values
  ('human', 'Human'),
  ('cow', 'Cow'),
  ('chicken', 'Chicken'),
  ('dog', 'Dog'),
  ('cat', 'Cat'),
  ('horse', 'Horse'),
  ('goat', 'Goat')
on conflict (code) do nothing;

create table if not exists catalog.relationship_types (
  code text primary key,
  label text not null,
  description text
);

insert into catalog.relationship_types (code, label, description)
values
  ('good_companion', 'Good Companion', 'Positive companion interaction'),
  ('bad_companion', 'Bad Companion', 'Negative companion interaction'),
  ('nurse_plant', 'Nurse Plant', 'Provides support microclimate'),
  ('trap_crop_helper', 'Trap Crop Helper', 'Helps as trap crop strategy'),
  ('shade_conflict', 'Shade Conflict', 'Competing light profile'),
  ('root_competition', 'Root Competition', 'Competing root-zone behavior'),
  ('allelopathy_risk', 'Allelopathy Risk', 'Potential allelopathic interaction'),
  ('shared_disease_risk', 'Shared Disease Risk', 'Shared disease pressure'),
  ('pollination_partner', 'Pollination Partner', 'Pollination support relationship')
on conflict (code) do nothing;

create table if not exists catalog.regions (
  id uuid primary key default gen_random_uuid(),
  region_type text not null check (region_type in ('country', 'state', 'province', 'climate_band', 'custom_region')),
  country_code char(2),
  region_code text not null,
  display_name text not null,
  usda_zone_min text,
  usda_zone_max text,
  ahs_heat_zone_min text,
  ahs_heat_zone_max text,
  created_at timestamptz not null default now(),
  unique (region_type, region_code)
);

create table if not exists catalog.frost_dates (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references catalog.regions(id) on delete cascade,
  percentile_label text not null default 'median',
  average_last_frost_date date,
  average_first_frost_date date,
  created_at timestamptz not null default now(),
  unique (region_id, percentile_label)
);

create table if not exists catalog.weather_normals (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references catalog.regions(id) on delete cascade,
  month_no smallint not null check (month_no between 1 and 12),
  avg_temp_min_f numeric(5,2),
  avg_temp_max_f numeric(5,2),
  avg_precip_in numeric(6,2),
  avg_humidity_pct numeric(5,2),
  avg_wind_mph numeric(5,2),
  created_at timestamptz not null default now(),
  unique (region_id, month_no)
);

-- ============================================================================
-- Catalog plant identity and profile model
-- ============================================================================

create table if not exists catalog.plant_taxa (
  id uuid primary key default gen_random_uuid(),
  kingdom_name text default 'Plantae',
  family_name text,
  genus_name text not null,
  species_name text,
  subspecies_name text,
  variety_name text,
  botanical_name_full text not null,
  taxon_rank text not null default 'species' check (taxon_rank in ('genus', 'species', 'subspecies', 'variety', 'hybrid', 'unknown')),
  native_range text,
  origin_type text not null default 'unknown' check (origin_type in ('native', 'naturalized', 'exotic', 'invasive_risk', 'unknown')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create unique index if not exists uq_plant_taxa_canonical
  on catalog.plant_taxa(
    lower(genus_name),
    coalesce(lower(species_name), ''),
    coalesce(lower(subspecies_name), ''),
    coalesce(lower(variety_name), '')
  );

create table if not exists catalog.plant_names (
  id uuid primary key default gen_random_uuid(),
  plant_taxon_id uuid not null references catalog.plant_taxa(id) on delete cascade,
  name text not null,
  name_type text not null check (name_type in ('common', 'synonym', 'trade', 'latin_variant')),
  locale text not null default 'en',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create unique index if not exists uq_plant_names_taxon_name_type
  on catalog.plant_names(plant_taxon_id, lower(name), name_type, locale);

create table if not exists catalog.plant_cultivars (
  id uuid primary key default gen_random_uuid(),
  plant_taxon_id uuid not null references catalog.plant_taxa(id) on delete cascade,
  cultivar_name text not null,
  market_name text,
  description text,
  chill_hours_min int,
  chill_hours_max int,
  disease_resistance_notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (plant_taxon_id, cultivar_name),
  check (chill_hours_min is null or chill_hours_max is null or chill_hours_min <= chill_hours_max)
);

create table if not exists catalog.plant_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_taxon_id uuid not null references catalog.plant_taxa(id) on delete cascade,
  plant_cultivar_id uuid references catalog.plant_cultivars(id) on delete set null,
  display_name text not null,
  plant_type_code text not null references catalog.plant_types(code),
  short_description text,
  why_plant_it text,
  pros_summary text,
  cons_summary text,
  primary_use_cases text,
  beginner_friendliness smallint check (beginner_friendliness between 1 and 5),
  maintenance_level_code text references catalog.maintenance_levels(code),
  notes_for_homestead text,
  notes_for_small_garden text,
  notes_for_container_growing text,
  lifecycle_type text not null check (lifecycle_type in ('annual', 'biennial', 'perennial', 'self_seed_annual', 'unknown')),
  evergreen_deciduous text check (evergreen_deciduous in ('evergreen', 'deciduous', 'semi_evergreen', 'unknown')),
  privacy_screen_value smallint check (privacy_screen_value between 0 and 10),
  deer_resistance smallint check (deer_resistance between 0 and 10),
  rabbit_resistance smallint check (rabbit_resistance between 0 and 10),
  armadillo_disturbance_risk smallint check (armadillo_disturbance_risk between 0 and 10),
  chicken_scratch_tolerance smallint check (chicken_scratch_tolerance between 0 and 10),
  foot_traffic_tolerance smallint check (foot_traffic_tolerance between 0 and 10),
  mow_tolerance smallint check (mow_tolerance between 0 and 10),
  ornamental_season_interest text[],
  visual_texture text,
  foliage_color text,
  evergreen_foliage boolean,
  winter_interest boolean,
  confidence_score numeric(5,2),
  evidence_count int not null default 0,
  source_count int not null default 0,
  source_last_reviewed_at timestamptz,
  ai_generated_summary boolean not null default false,
  human_verified boolean not null default false,
  conflict_flag boolean not null default false,
  region_specific_conflict_notes text,
  is_ai_generated boolean not null default false,
  generation_status text not null default 'human_curated' check (generation_status in ('human_curated', 'ai_generated', 'ai_reviewed', 'community_generated')),
  is_published boolean not null default false,
  review_status text not null default 'draft' check (review_status in ('draft', 'pending_review', 'approved', 'rejected')),
  created_by_user_id uuid references core.users(id),
  updated_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version int not null default 1,
  search_document tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(display_name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(short_description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(why_plant_it, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(primary_use_cases, '')), 'C')
  ) stored
);

create index if not exists idx_plant_profiles_taxon on catalog.plant_profiles(plant_taxon_id);
create index if not exists idx_plant_profiles_cultivar on catalog.plant_profiles(plant_cultivar_id);
create index if not exists idx_plant_profiles_type_published on catalog.plant_profiles(plant_type_code, is_published);
create index if not exists idx_plant_profiles_search_document on catalog.plant_profiles using gin(search_document);
create unique index if not exists uq_plant_profiles_one_published_variant
  on catalog.plant_profiles(
    plant_taxon_id,
    coalesce(plant_cultivar_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  where is_published = true and deleted_at is null;

create table if not exists catalog.plant_profile_aesthetic_styles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  style_code text not null references catalog.aesthetic_style_tags(code),
  weight_score smallint check (weight_score between 0 and 10),
  created_at timestamptz not null default now(),
  unique (plant_profile_id, style_code)
);

create table if not exists catalog.plant_profile_uses (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  use_type_code text not null references catalog.use_types(code),
  evidence_strength_code text not null references catalog.evidence_strength_levels(code),
  supports_use boolean not null default true,
  mechanism_description text,
  target_benefit text,
  target_pest text,
  target_soil_effect text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (plant_profile_id, use_type_code)
);

create table if not exists catalog.plant_climate_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  usda_hardiness_min text,
  usda_hardiness_max text,
  ahs_heat_zone_min text,
  ahs_heat_zone_max text,
  cold_tolerance_absolute_f numeric(6,2),
  cold_tolerance_established_f numeric(6,2),
  heat_tolerance_f numeric(6,2),
  humidity_tolerance_code text references catalog.tolerance_levels(code),
  drought_tolerance_code text references catalog.tolerance_levels(code),
  flood_tolerance_code text references catalog.tolerance_levels(code),
  wind_tolerance_code text references catalog.tolerance_levels(code),
  salt_tolerance_code text references catalog.tolerance_levels(code),
  chill_hours_min int,
  chill_hours_max int,
  frost_tender boolean,
  reemergence_after_freeze_behavior text,
  sun_min_hours numeric(4,1),
  sun_max_hours numeric(4,1),
  preferred_light text,
  shade_tolerance_score smallint check (shade_tolerance_score between 0 and 10),
  afternoon_sun_tolerance_score smallint check (afternoon_sun_tolerance_score between 0 and 10),
  reflected_heat_tolerance_score smallint check (reflected_heat_tolerance_score between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  check (sun_min_hours is null or sun_max_hours is null or sun_min_hours <= sun_max_hours),
  check (chill_hours_min is null or chill_hours_max is null or chill_hours_min <= chill_hours_max)
);

create table if not exists catalog.plant_growth_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  mature_height_min_in numeric(8,2),
  mature_height_max_in numeric(8,2),
  mature_width_min_in numeric(8,2),
  mature_width_max_in numeric(8,2),
  annual_growth_height_in numeric(8,2),
  annual_growth_width_in numeric(8,2),
  growth_rate_code text references catalog.tolerance_levels(code),
  growth_habit text,
  root_behavior text,
  spread_aggressiveness smallint check (spread_aggressiveness between 0 and 10),
  pruning_response text,
  transplant_tolerance smallint check (transplant_tolerance between 0 and 10),
  container_tolerance smallint check (container_tolerance between 0 and 10),
  trellis_needed boolean,
  support_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  check (mature_height_min_in is null or mature_height_max_in is null or mature_height_min_in <= mature_height_max_in),
  check (mature_width_min_in is null or mature_width_max_in is null or mature_width_min_in <= mature_width_max_in)
);

create table if not exists catalog.plant_propagation_methods (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  planting_method_code text not null references catalog.planting_methods(code),
  allowed boolean not null default true,
  is_preferred boolean not null default false,
  depth_min_in numeric(8,2),
  depth_max_in numeric(8,2),
  spacing_min_in numeric(8,2),
  spacing_max_in numeric(8,2),
  proliferation_behavior text,
  self_seeds boolean,
  reseeding_intensity smallint check (reseeding_intensity between 0 and 10),
  spreads_by_runners boolean,
  spreads_by_rhizomes boolean,
  grafted_common boolean,
  seed_viability_duration_months int,
  germination_days_min int,
  germination_days_max int,
  cold_stratification_required boolean,
  scarification_required boolean,
  rooting_hormone_helpful boolean,
  transplant_shock_risk_code text references catalog.tolerance_levels(code),
  establishment_difficulty smallint check (establishment_difficulty between 0 and 10),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (plant_profile_id, planting_method_code),
  check (germination_days_min is null or germination_days_max is null or germination_days_min <= germination_days_max)
);

create index if not exists idx_plant_propagation_methods_profile_preferred
  on catalog.plant_propagation_methods(plant_profile_id, is_preferred desc, planting_method_code);

create table if not exists catalog.plant_flowering_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  flowering_bool boolean,
  flower_color text,
  flower_size text,
  bloom_start_week smallint check (bloom_start_week between 1 and 53),
  bloom_end_week smallint check (bloom_end_week between 1 and 53),
  bloom_duration_days int,
  flower_abundance text,
  flower_fragrance_strength smallint check (flower_fragrance_strength between 0 and 10),
  pollinator_value smallint check (pollinator_value between 0 and 10),
  nectar_value smallint check (nectar_value between 0 and 10),
  pollen_value smallint check (pollen_value between 0 and 10),
  attracts_bees boolean,
  attracts_butterflies boolean,
  attracts_hummingbirds boolean,
  larval_host boolean,
  native_pollinator_value smallint check (native_pollinator_value between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create table if not exists catalog.plant_fruiting_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  fruiting_bool boolean,
  fruit_color text,
  fruit_size text,
  fruit_flavor text,
  fruiting_start_age_years numeric(5,2),
  yield_lb_per_plant_year_min numeric(8,2),
  yield_lb_per_plant_year_max numeric(8,2),
  harvest_window_start_week smallint check (harvest_window_start_week between 1 and 53),
  harvest_window_end_week smallint check (harvest_window_end_week between 1 and 53),
  fruit_drop_behavior text,
  wildlife_attraction smallint check (wildlife_attraction between 0 and 10),
  first_harvest_time_from_planting_days int,
  productive_years_min int,
  productive_years_max int,
  harvest_frequency text,
  preservation_uses text,
  edible_parts text[],
  medicinal_parts text[],
  fodder_parts text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  check (yield_lb_per_plant_year_min is null or yield_lb_per_plant_year_max is null or yield_lb_per_plant_year_min <= yield_lb_per_plant_year_max),
  check (productive_years_min is null or productive_years_max is null or productive_years_min <= productive_years_max)
);

create table if not exists catalog.plant_soil_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  drainage_requirement text,
  organic_matter_preference text,
  compaction_tolerance_code text references catalog.tolerance_levels(code),
  rocky_soil_tolerance_code text references catalog.tolerance_levels(code),
  ph_min numeric(4,2),
  ph_max numeric(4,2),
  ph_ideal_min numeric(4,2),
  ph_ideal_max numeric(4,2),
  ph_sensitivity_code text references catalog.tolerance_levels(code),
  fertility_need text,
  nitrogen_need text,
  phosphorus_need text,
  potassium_need text,
  calcium_sensitivity_code text references catalog.tolerance_levels(code),
  soil_oxygen_need text,
  mycorrhizal_association_notes text,
  mulch_preference text,
  mulch_depth_preference_in numeric(5,2),
  waterlogging_sensitivity_code text references catalog.tolerance_levels(code),
  texture_preferences jsonb not null default '{}'::jsonb check (jsonb_typeof(texture_preferences) = 'object'),
  preferred_soil_texture_codes text[] not null default '{}',
  soil_texture_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  check (ph_min is null or ph_max is null or ph_min <= ph_max),
  check (ph_ideal_min is null or ph_ideal_max is null or ph_ideal_min <= ph_ideal_max)
);

create index if not exists idx_plant_soil_profiles_texture_preferences
  on catalog.plant_soil_profiles using gin (texture_preferences);

create index if not exists idx_plant_soil_profiles_texture_codes
  on catalog.plant_soil_profiles using gin (preferred_soil_texture_codes);

create table if not exists catalog.plant_water_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  water_need_level text not null default 'medium' check (water_need_level in ('very_low', 'low', 'medium', 'high', 'very_high')),
  drought_tolerance_code text references catalog.tolerance_levels(code),
  moisture_sensitivity_code text references catalog.tolerance_levels(code),
  preferred_irrigation_method text,
  root_zone_depth_in numeric(8,2),
  container_water_multiplier numeric(6,3),
  mulched_water_reduction_factor numeric(6,3),
  summer_heat_adjustment_factor numeric(6,3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create table if not exists catalog.plant_water_establishment_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  week_from_planting_start int not null,
  week_from_planting_end int not null,
  gallons_per_week numeric(8,2),
  frequency_per_week numeric(6,2),
  deep_vs_frequent text,
  notes text,
  created_at timestamptz not null default now(),
  check (week_from_planting_start <= week_from_planting_end)
);

create index if not exists idx_water_establishment_profile_week
  on catalog.plant_water_establishment_profiles(plant_profile_id, week_from_planting_start, week_from_planting_end);

create table if not exists catalog.plant_water_seasonal_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  region_type text not null default 'usda_zone' check (region_type in ('usda_zone', 'region', 'state', 'generic')),
  region_value text,
  month_no smallint not null check (month_no between 1 and 12),
  lifecycle_stage_code text references catalog.lifecycle_stage_types(code),
  estimated_inches_per_week numeric(8,2),
  estimated_gallons_per_week numeric(8,2),
  preferred_method text,
  stress_watchouts text,
  created_at timestamptz not null default now()
);

create unique index if not exists uq_plant_water_seasonal_profiles
  on catalog.plant_water_seasonal_profiles(
    plant_profile_id,
    region_type,
    coalesce(region_value, ''),
    month_no,
    coalesce(lifecycle_stage_code, '')
  );

create table if not exists catalog.plant_ecology_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  invasive_risk_code text references catalog.safety_levels(code),
  wildlife_food_value smallint check (wildlife_food_value between 0 and 10),
  erosion_control_value smallint check (erosion_control_value between 0 and 10),
  biomass_value smallint check (biomass_value between 0 and 10),
  compost_value smallint check (compost_value between 0 and 10),
  chop_drop_value smallint check (chop_drop_value between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create table if not exists catalog.plant_maintenance_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  pruning_frequency text,
  deadheading_helpful boolean,
  division_interval_years numeric(6,2),
  staking_needed boolean,
  suckering_management text,
  cleanup_intensity smallint check (cleanup_intensity between 0 and 10),
  disease_susceptibility_level smallint check (disease_susceptibility_level between 0 and 10),
  pest_susceptibility_level smallint check (pest_susceptibility_level between 0 and 10),
  humidity_disease_risk smallint check (humidity_disease_risk between 0 and 10),
  air_flow_importance smallint check (air_flow_importance between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create table if not exists catalog.plant_safety_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  subject_type_code text not null references catalog.safety_subject_types(code),
  safety_level_code text not null references catalog.safety_levels(code),
  toxic_parts text[],
  condition_notes text,
  symptoms text,
  evidence_source_type text,
  safe_use_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (plant_profile_id, subject_type_code)
);

create table if not exists catalog.plant_relationships (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  related_plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  relationship_type_code text not null references catalog.relationship_types(code),
  rank_value smallint,
  evidence_strength_code text references catalog.evidence_strength_levels(code),
  rationale text,
  distance_notes text,
  overlap_window_start_week smallint check (overlap_window_start_week between 1 and 53),
  overlap_window_end_week smallint check (overlap_window_end_week between 1 and 53),
  source_notes text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  check (plant_profile_id <> related_plant_profile_id),
  unique (plant_profile_id, related_plant_profile_id, relationship_type_code)
);

create index if not exists idx_plant_relationships_profile_type
  on catalog.plant_relationships(plant_profile_id, relationship_type_code, is_published);

create table if not exists catalog.phenology_templates (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  region_type text not null check (region_type in ('usda_zone', 'climate_band', 'state', 'region', 'generic')),
  region_value text,
  is_default boolean not null default false,
  notes text,
  created_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create unique index if not exists uq_phenology_templates_region_default
  on catalog.phenology_templates(
    plant_profile_id,
    region_type,
    coalesce(region_value, ''),
    is_default
  );

create table if not exists catalog.phenology_events (
  id uuid primary key default gen_random_uuid(),
  phenology_template_id uuid not null references catalog.phenology_templates(id) on delete cascade,
  stage_code text not null references catalog.lifecycle_stage_types(code),
  stage_name text,
  trigger_type text not null check (trigger_type in ('date', 'temperature', 'soil_temp', 'frost', 'rainfall', 'daylight', 'gdd', 'plant_observation', 'calendar')),
  trigger_rule text,
  timing_type text not null check (timing_type in ('calendar', 'temp_threshold', 'soil_temp', 'gdd', 'rainfall', 'photoperiod', 'event_offset')),
  earliest_date date,
  typical_date date,
  latest_date date,
  week_start_of_year smallint check (week_start_of_year between 1 and 53),
  week_end_of_year smallint check (week_end_of_year between 1 and 53),
  month_start smallint check (month_start between 1 and 12),
  month_end smallint check (month_end between 1 and 12),
  offset_days_from_planting int,
  repeat_every_days int,
  cues text,
  recommended_action text,
  recurrence text,
  urgency_code text references core.priority_levels(code),
  failure_risk_if_missed text,
  priority_weight smallint not null default 50,
  repeatable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  check (
    earliest_date is null or typical_date is null or earliest_date <= typical_date
  ),
  check (
    typical_date is null or latest_date is null or typical_date <= latest_date
  )
);

create index if not exists idx_phenology_events_template_stage
  on catalog.phenology_events(phenology_template_id, stage_code);

create table if not exists catalog.plant_zone_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  region_type text not null check (region_type in ('usda_zone', 'climate_band', 'state', 'region', 'generic')),
  region_value text,
  usda_zone_min text,
  usda_zone_max text,
  planting_window_start_week smallint check (planting_window_start_week between 1 and 53),
  planting_window_end_week smallint check (planting_window_end_week between 1 and 53),
  harvest_window_start_week smallint check (harvest_window_start_week between 1 and 53),
  harvest_window_end_week smallint check (harvest_window_end_week between 1 and 53),
  bloom_window_start_week smallint check (bloom_window_start_week between 1 and 53),
  bloom_window_end_week smallint check (bloom_window_end_week between 1 and 53),
  dieback_window_start_week smallint check (dieback_window_start_week between 1 and 53),
  reemergence_window_start_week smallint check (reemergence_window_start_week between 1 and 53),
  proliferation_behavior text,
  maintenance_timing_notes text,
  seasonal_risk_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create unique index if not exists uq_plant_zone_profiles_region
  on catalog.plant_zone_profiles(
    plant_profile_id,
    region_type,
    coalesce(region_value, '')
  );

create table if not exists catalog.plant_care_events (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  stage_code text references catalog.lifecycle_stage_types(code),
  task_type_code text not null references core.task_type_types(code),
  source_type_code text not null references core.task_source_types(code),
  title text not null,
  description text,
  recurrence_rule text,
  lead_days int,
  window_days int,
  priority_code text references core.priority_levels(code),
  requires_confirmation boolean not null default false,
  repeatable boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_plant_care_events_profile_active
  on catalog.plant_care_events(plant_profile_id, is_active);

create table if not exists catalog.plant_cultivar_overrides (
  id uuid primary key default gen_random_uuid(),
  plant_cultivar_id uuid not null references catalog.plant_cultivars(id) on delete cascade,
  plant_profile_id uuid references catalog.plant_profiles(id) on delete set null,
  region_type text check (region_type in ('usda_zone', 'climate_band', 'state', 'region', 'generic')),
  region_value text,
  field_key text not null,
  override_scope text not null check (override_scope in ('trait', 'climate', 'yield', 'disease', 'phenology', 'water', 'other')),
  override_value jsonb not null,
  evidence_strength_code text references catalog.evidence_strength_levels(code),
  source_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create unique index if not exists uq_plant_cultivar_overrides_scope
  on catalog.plant_cultivar_overrides(
    plant_cultivar_id,
    field_key,
    coalesce(region_type, ''),
    coalesce(region_value, '')
  );

create table if not exists catalog.plant_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_type text not null check (source_type in ('extension', 'academic', 'government', 'community', 'internal_curation', 'ai_extraction', 'other')),
  publisher text,
  author text,
  source_url text,
  citation_text text,
  published_on date,
  credibility_score numeric(4,2),
  license text,
  notes text,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create table if not exists catalog.plant_claims (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  plant_cultivar_id uuid references catalog.plant_cultivars(id) on delete set null,
  claim_type text not null,
  value_json jsonb not null,
  evidence_strength_code text references catalog.evidence_strength_levels(code),
  confidence_score numeric(5,2),
  evidence_count int not null default 0,
  source_count int not null default 0,
  source_last_reviewed_at timestamptz,
  source_id uuid references catalog.plant_sources(id) on delete set null,
  source_quote_or_excerpt text,
  source_url text,
  reviewed_by_user_id uuid references core.users(id),
  reviewed_by_human boolean not null default false,
  review_status text not null default 'pending_review' check (review_status in ('pending_review', 'approved', 'rejected', 'needs_more_evidence')),
  region_scope text,
  cultivar_scope text,
  ai_generated_summary boolean not null default false,
  human_verified boolean not null default false,
  conflict_flag boolean not null default false,
  region_specific_conflict_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_plant_claims_profile_type
  on catalog.plant_claims(plant_profile_id, claim_type);
create index if not exists idx_plant_claims_review_status
  on catalog.plant_claims(review_status, conflict_flag);

create table if not exists catalog.plant_images (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  source_id uuid references catalog.plant_sources(id) on delete set null,
  stage_code text references catalog.lifecycle_stage_types(code),
  image_url text,
  storage_key text,
  mime_type text,
  width_px int,
  height_px int,
  attribution_text text,
  license text,
  is_primary boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_plant_images_profile_public
  on catalog.plant_images(plant_profile_id, is_public);

create table if not exists catalog.event_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  label text not null,
  task_type_code text not null references core.task_type_types(code),
  source_type_code text not null references core.task_source_types(code),
  default_title text not null,
  default_description text,
  metadata jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

-- ============================================================================
-- Core plant instances and personal lists
-- ============================================================================

create table if not exists core.plant_instances (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  zone_id uuid not null,
  bed_id uuid not null,
  plant_profile_id uuid not null references catalog.plant_profiles(id),
  plant_cultivar_id uuid references catalog.plant_cultivars(id),
  display_name_override text,
  quantity numeric(10,2) not null default 1,
  unit_type text not null default 'count' check (unit_type in ('count', 'patch', 'row', 'cluster')),
  planting_method_code text references catalog.planting_methods(code),
  planted_at date,
  expected_end_at date,
  current_stage_code text references catalog.lifecycle_stage_types(code),
  status_code text not null references core.plant_instance_status_types(code),
  source_origin text check (source_origin in ('seed', 'nursery', 'propagated', 'gifted', 'unknown')),
  position_payload jsonb,
  notes text,
  performance_score numeric(5,2),
  is_archived boolean not null default false,
  deleted_at timestamptz,
  created_by_user_id uuid references core.users(id),
  updated_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (id, property_id, zone_id, bed_id),
  constraint fk_plant_instances_zone_property
    foreign key (zone_id, property_id)
    references core.zones(id, property_id)
    on delete cascade,
  constraint fk_plant_instances_bed_property_zone
    foreign key (bed_id, property_id, zone_id)
    references core.beds(id, property_id, zone_id)
    on delete cascade
);

create index if not exists idx_plant_instances_bed_status on core.plant_instances(bed_id, status_code);
create index if not exists idx_plant_instances_property_profile_status
  on core.plant_instances(property_id, plant_profile_id, status_code);
create index if not exists idx_plant_instances_zone_status on core.plant_instances(zone_id, status_code);
create index if not exists idx_plant_instances_property_bed_active
  on core.plant_instances(property_id, bed_id, current_stage_code)
  where status_code in ('active', 'dormant');

create table if not exists core.plant_instance_stage_history (
  id uuid primary key default gen_random_uuid(),
  plant_instance_id uuid not null references core.plant_instances(id) on delete cascade,
  stage_code text not null references catalog.lifecycle_stage_types(code),
  started_at timestamptz not null,
  ended_at timestamptz,
  source_type text not null check (source_type in ('user', 'ai', 'inferred', 'system')),
  notes text,
  created_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  check (ended_at is null or started_at <= ended_at)
);

create index if not exists idx_stage_history_instance_started_desc
  on core.plant_instance_stage_history(plant_instance_id, started_at desc);

create table if not exists core.plant_instance_seasons (
  id uuid primary key default gen_random_uuid(),
  plant_instance_id uuid not null references core.plant_instances(id) on delete cascade,
  season_label text not null,
  calendar_year int not null,
  status_summary text,
  yield_summary text,
  performance_score numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (plant_instance_id, season_label, calendar_year)
);

create table if not exists core.user_plant_wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  property_id uuid references core.properties(id) on delete cascade,
  plant_profile_id uuid not null references catalog.plant_profiles(id),
  notes text,
  priority smallint default 3 check (priority between 1 and 5),
  added_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create unique index if not exists uq_wishlist_user_profile_global
  on core.user_plant_wishlist(user_id, plant_profile_id)
  where property_id is null;

create unique index if not exists uq_wishlist_user_property_profile
  on core.user_plant_wishlist(user_id, property_id, plant_profile_id)
  where property_id is not null;

-- ============================================================================
-- Task system
-- ============================================================================

create table if not exists core.tasks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  zone_id uuid,
  bed_id uuid,
  plant_instance_id uuid,
  assigned_user_id uuid references core.users(id),
  source_type_code text not null references core.task_source_types(code),
  task_type_code text not null references core.task_type_types(code),
  status_code text not null references core.task_status_types(code),
  priority_code text not null default 'medium' references core.priority_levels(code),
  title text not null,
  description text,
  window_start_at timestamptz,
  window_end_at timestamptz,
  due_at timestamptz,
  completed_at timestamptz,
  skipped_at timestamptz,
  created_by_user_id uuid references core.users(id),
  generation_ref text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  constraint fk_tasks_zone
    foreign key (zone_id)
    references core.zones(id)
    on delete set null,
  constraint fk_tasks_bed
    foreign key (bed_id)
    references core.beds(id)
    on delete set null,
  constraint fk_tasks_instance
    foreign key (plant_instance_id)
    references core.plant_instances(id)
    on delete set null,
  check (window_start_at is null or window_end_at is null or window_start_at <= window_end_at)
);

create index if not exists idx_tasks_property_status_window
  on core.tasks(property_id, status_code, window_start_at);
create index if not exists idx_tasks_assigned_status_window
  on core.tasks(assigned_user_id, status_code, window_start_at);
create index if not exists idx_tasks_bed_status_window
  on core.tasks(bed_id, status_code, window_start_at);
create index if not exists idx_tasks_open_property_window
  on core.tasks(property_id, window_start_at)
  where status_code in ('suggested', 'scheduled');
create index if not exists idx_tasks_plant_instance on core.tasks(plant_instance_id, status_code);

create table if not exists core.weather_adjustment_proposals (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  task_id uuid not null references core.tasks(id) on delete cascade,
  proposed_action text not null check (proposed_action in ('suppress', 'reschedule', 'retime', 'escalate', 'add_followup')),
  reason text not null,
  confidence_score numeric(5,2),
  requires_user_confirmation boolean not null default true,
  decision_status text not null default 'proposed' check (decision_status in ('proposed', 'accepted', 'rejected', 'expired')),
  decided_by_user_id uuid references core.users(id),
  decided_at timestamptz,
  applied_at timestamptz,
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_weather_adjustment_property_status
  on core.weather_adjustment_proposals(property_id, decision_status, created_at desc);

create table if not exists core.recurring_task_templates (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  zone_id uuid,
  bed_id uuid,
  plant_profile_id uuid references catalog.plant_profiles(id),
  title_template text not null,
  description_template text,
  task_type_code text not null references core.task_type_types(code),
  source_type_code text not null default 'template' references core.task_source_types(code),
  repeat_rule text not null,
  default_priority_code text not null default 'medium' references core.priority_levels(code),
  metadata jsonb,
  is_active boolean not null default true,
  created_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  constraint fk_recurring_zone
    foreign key (zone_id)
    references core.zones(id)
    on delete set null,
  constraint fk_recurring_bed
    foreign key (bed_id)
    references core.beds(id)
    on delete set null
);

create index if not exists idx_recurring_templates_property_active
  on core.recurring_task_templates(property_id, is_active);

-- ============================================================================
-- Observations, issues, media
-- ============================================================================

create table if not exists core.observations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  zone_id uuid,
  bed_id uuid,
  plant_instance_id uuid,
  observation_type text not null check (observation_type in ('note', 'issue', 'progress', 'weather_note', 'maintenance_note', 'harvest_note')),
  title text,
  body text,
  severity smallint check (severity between 0 and 10),
  observed_at timestamptz not null,
  created_by_user_id uuid references core.users(id),
  ai_interpreted boolean not null default false,
  ai_summary text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  constraint fk_observations_zone
    foreign key (zone_id)
    references core.zones(id)
    on delete set null,
  constraint fk_observations_bed
    foreign key (bed_id)
    references core.beds(id)
    on delete set null,
  constraint fk_observations_instance
    foreign key (plant_instance_id)
    references core.plant_instances(id)
    on delete set null
);

create index if not exists idx_observations_instance_observed_desc
  on core.observations(plant_instance_id, observed_at desc);
create index if not exists idx_observations_bed_observed_desc
  on core.observations(bed_id, observed_at desc);
create index if not exists idx_observations_property_type_observed_desc
  on core.observations(property_id, observation_type, observed_at desc);

create table if not exists core.media_assets (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references core.properties(id) on delete cascade,
  zone_id uuid,
  bed_id uuid,
  plant_instance_id uuid,
  observation_id uuid,
  uploaded_by_user_id uuid references core.users(id),
  storage_provider text not null default 'supabase_storage',
  storage_key text not null,
  mime_type text,
  file_size_bytes bigint,
  width_px int,
  height_px int,
  asset_kind text not null check (asset_kind in ('photo', 'illustration', 'attachment')),
  review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected')),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (storage_provider, storage_key),
  constraint fk_media_zone
    foreign key (zone_id)
    references core.zones(id)
    on delete set null,
  constraint fk_media_bed
    foreign key (bed_id)
    references core.beds(id)
    on delete set null,
  constraint fk_media_instance
    foreign key (plant_instance_id)
    references core.plant_instances(id)
    on delete set null,
  constraint fk_media_observation
    foreign key (observation_id)
    references core.observations(id)
    on delete set null
);

create index if not exists idx_media_property_created_desc
  on core.media_assets(property_id, created_at desc);
create index if not exists idx_media_instance_created_desc
  on core.media_assets(plant_instance_id, created_at desc);

create table if not exists core.plant_health_issues (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  plant_instance_id uuid not null references core.plant_instances(id) on delete cascade,
  observation_id uuid references core.observations(id) on delete set null,
  issue_category text not null check (issue_category in ('pest', 'disease', 'nutrient', 'watering', 'temperature', 'unknown')),
  detected_by text not null check (detected_by in ('user', 'ai')),
  status text not null default 'open' check (status in ('open', 'monitoring', 'resolved', 'dismissed')),
  confidence_score numeric(5,2),
  summary text not null,
  recommended_action text,
  followup_due_at timestamptz,
  created_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_plant_health_issues_instance_status
  on core.plant_health_issues(plant_instance_id, status, followup_due_at);

-- ============================================================================
-- Harvest and weather
-- ============================================================================

create table if not exists core.harvest_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  zone_id uuid,
  bed_id uuid,
  plant_instance_id uuid,
  harvested_at timestamptz not null,
  quantity_value numeric(12,3) not null,
  quantity_unit text not null,
  quality_score smallint check (quality_score between 0 and 10),
  notes text,
  recorded_by_user_id uuid references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  constraint fk_harvest_zone
    foreign key (zone_id)
    references core.zones(id)
    on delete set null,
  constraint fk_harvest_bed
    foreign key (bed_id)
    references core.beds(id)
    on delete set null,
  constraint fk_harvest_instance
    foreign key (plant_instance_id)
    references core.plant_instances(id)
    on delete set null
);

create index if not exists idx_harvest_instance_desc on core.harvest_events(plant_instance_id, harvested_at desc);
create index if not exists idx_harvest_bed_desc on core.harvest_events(bed_id, harvested_at desc);
create index if not exists idx_harvest_property_desc on core.harvest_events(property_id, harvested_at desc);

create table if not exists core.weather_daily (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  weather_date date not null,
  source_name text not null,
  temp_min_f numeric(6,2),
  temp_max_f numeric(6,2),
  precip_in numeric(8,3),
  humidity_avg numeric(5,2),
  wind_avg_mph numeric(6,2),
  condition_code text,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  unique (property_id, weather_date, source_name)
);

create index if not exists idx_weather_daily_property_date_desc
  on core.weather_daily(property_id, weather_date desc);

create table if not exists core.weather_alerts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  alert_type_code text not null references core.alert_types(code),
  starts_at timestamptz not null,
  ends_at timestamptz,
  severity_code text not null default 'medium' references core.priority_levels(code),
  summary text,
  payload jsonb,
  created_at timestamptz not null default now(),
  check (ends_at is null or starts_at <= ends_at)
);

create index if not exists idx_weather_alerts_property_window
  on core.weather_alerts(property_id, starts_at, ends_at);

-- ============================================================================
-- Community
-- ============================================================================

create table if not exists community.shared_templates (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references core.users(id) on delete cascade,
  template_type text not null check (template_type in ('bed_template', 'guild_template', 'zone_template')),
  title text not null,
  description text,
  payload jsonb not null,
  is_public boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  deleted_at timestamptz
);

create index if not exists idx_shared_templates_public_featured
  on community.shared_templates(is_public, is_featured, created_at desc)
  where deleted_at is null;

create table if not exists community.template_ratings (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references community.shared_templates(id) on delete cascade,
  user_id uuid not null references core.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (template_id, user_id)
);

create table if not exists community.plant_comments (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  user_id uuid not null references core.users(id) on delete cascade,
  region_code text,
  usda_zone text,
  title text,
  body text not null,
  is_public boolean not null default true,
  is_flagged boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  deleted_at timestamptz
);

create index if not exists idx_plant_comments_profile_created_desc
  on community.plant_comments(plant_profile_id, created_at desc);
create index if not exists idx_plant_comments_public
  on community.plant_comments(plant_profile_id, created_at desc)
  where is_public = true and deleted_at is null;

create table if not exists community.plant_ratings (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  user_id uuid not null references core.users(id) on delete cascade,
  property_id uuid references core.properties(id) on delete set null,
  rating_overall smallint not null check (rating_overall between 1 and 5),
  rating_success smallint check (rating_success between 1 and 5),
  rating_ease smallint check (rating_ease between 1 and 5),
  created_at timestamptz not null default now()
);

create unique index if not exists uq_plant_ratings_profile_user_property
  on community.plant_ratings(
    plant_profile_id,
    user_id,
    coalesce(property_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

create table if not exists community.plant_photo_submissions (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  user_id uuid not null references core.users(id) on delete cascade,
  media_asset_id uuid not null references core.media_assets(id) on delete cascade,
  caption text,
  region_code text,
  usda_zone text,
  review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_plant_photo_submissions_profile_review
  on community.plant_photo_submissions(plant_profile_id, review_status, created_at desc);

create table if not exists community.plant_data_flags (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  user_id uuid not null references core.users(id) on delete cascade,
  field_name text not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'in_review', 'resolved', 'dismissed')),
  reviewed_by_user_id uuid references core.users(id),
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_plant_data_flags_profile_status
  on community.plant_data_flags(plant_profile_id, status, created_at desc);

-- ============================================================================
-- AI artifacts
-- ============================================================================

create table if not exists ai.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null check (job_type in ('plant_generate', 'diagnosis', 'recommendations', 'enrichment')),
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'canceled')),
  requested_by_user_id uuid references core.users(id),
  plant_profile_id uuid references catalog.plant_profiles(id) on delete set null,
  plant_taxon_search_term text,
  input_payload jsonb,
  output_payload jsonb,
  error_payload jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_generation_jobs_type_status_created_desc
  on ai.generation_jobs(job_type, status, created_at desc);

create table if not exists ai.generated_plant_payloads (
  id uuid primary key default gen_random_uuid(),
  generation_job_id uuid not null references ai.generation_jobs(id) on delete cascade,
  search_term text,
  normalized_name text,
  payload jsonb not null,
  review_status text not null default 'pending_review' check (review_status in ('pending_review', 'approved', 'rejected')),
  published_plant_profile_id uuid references catalog.plant_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create table if not exists ai.diagnosis_runs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  plant_instance_id uuid not null references core.plant_instances(id) on delete cascade,
  observation_id uuid references core.observations(id) on delete set null,
  media_asset_id uuid references core.media_assets(id) on delete set null,
  requested_by_user_id uuid references core.users(id),
  model_name text,
  input_payload jsonb,
  output_summary text,
  confidence_score numeric(5,2),
  recommended_actions jsonb,
  created_task_id uuid references core.tasks(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_diagnosis_runs_instance_created_desc
  on ai.diagnosis_runs(plant_instance_id, created_at desc);

create table if not exists ai.recommendation_logs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references core.properties(id) on delete cascade,
  zone_id uuid,
  bed_id uuid,
  plant_instance_id uuid,
  recommendation_type text not null,
  context_payload jsonb,
  result_payload jsonb,
  feedback text check (feedback in ('helpful', 'dismissed', 'irrelevant')),
  created_at timestamptz not null default now(),
  constraint fk_reco_zone
    foreign key (zone_id)
    references core.zones(id)
    on delete set null,
  constraint fk_reco_bed
    foreign key (bed_id)
    references core.beds(id)
    on delete set null,
  constraint fk_reco_instance
    foreign key (plant_instance_id)
    references core.plant_instances(id)
    on delete set null
);

create index if not exists idx_recommendation_logs_property_created_desc
  on ai.recommendation_logs(property_id, created_at desc);

create table if not exists ai.embeddings (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('plant_profile', 'comment', 'template', 'observation', 'task')),
  entity_id uuid not null,
  embedding vector(1536),
  content_hash text,
  model_name text,
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, model_name)
);

-- ============================================================================
-- Audit and ops
-- ============================================================================

create table if not exists audit.entity_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references core.properties(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  event_type text not null,
  performed_by_user_id uuid references core.users(id),
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_entity_events_property_created_desc
  on audit.entity_events(property_id, created_at desc);
create index if not exists idx_entity_events_entity
  on audit.entity_events(entity_type, entity_id, created_at desc);

create table if not exists audit.task_events (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references core.tasks(id) on delete cascade,
  event_type text not null check (event_type in ('created', 'reassigned', 'rescheduled', 'completed', 'skipped', 'reopened', 'expired', 'updated')),
  performed_by_user_id uuid references core.users(id),
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_task_events_task_created_desc
  on audit.task_events(task_id, created_at desc);

create table if not exists audit.collaboration_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  membership_id uuid references core.property_memberships(id) on delete set null,
  event_type text not null check (event_type in ('invite_sent', 'invite_accepted', 'role_changed', 'member_removed', 'ownership_transferred')),
  performed_by_user_id uuid references core.users(id),
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_collaboration_events_property_created_desc
  on audit.collaboration_events(property_id, created_at desc);

create table if not exists ops.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  property_id uuid references core.properties(id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'push', 'in_app')),
  notification_type text not null,
  template_key text,
  payload jsonb,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'canceled')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_notifications_user_status_schedule
  on ops.notifications(user_id, status, scheduled_for);

create table if not exists ops.generated_reports (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references core.properties(id) on delete cascade,
  report_type text not null check (report_type in ('weekly', 'monthly')),
  period_start date not null,
  period_end date not null,
  payload jsonb,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (period_start <= period_end)
);

create index if not exists idx_generated_reports_property_period
  on ops.generated_reports(property_id, report_type, period_start desc);

create table if not exists ops.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  webhook_type text not null,
  endpoint text not null,
  payload jsonb,
  status_code int,
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'succeeded', 'failed')),
  attempts int not null default 0,
  next_attempt_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create table if not exists ops.cron_run_logs (
  id uuid primary key default gen_random_uuid(),
  job_key text not null,
  run_status text not null check (run_status in ('started', 'succeeded', 'failed')),
  started_at timestamptz not null,
  finished_at timestamptz,
  payload jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cron_run_logs_job_started_desc
  on ops.cron_run_logs(job_key, started_at desc);

create table if not exists ops.background_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'dead_letter')),
  priority_code text not null default 'medium' references core.priority_levels(code),
  payload jsonb,
  error_message text,
  attempts int not null default 0,
  max_attempts int not null default 5,
  scheduled_for timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists idx_background_jobs_status_schedule
  on ops.background_jobs(status, scheduled_for, priority_code);

-- ============================================================================
-- Reporting views (initial)
-- ============================================================================

create or replace view reporting.property_open_task_summary as
select
  t.property_id,
  date_trunc('week', coalesce(t.window_start_at, t.created_at))::date as week_start,
  count(*) filter (where t.status_code in ('suggested', 'scheduled')) as open_task_count,
  count(*) filter (where t.priority_code in ('high', 'critical') and t.status_code in ('suggested', 'scheduled')) as high_priority_open_task_count
from core.tasks t
group by t.property_id, date_trunc('week', coalesce(t.window_start_at, t.created_at));

create or replace view reporting.plant_profile_rating_summary as
select
  r.plant_profile_id,
  count(*) as rating_count,
  avg(r.rating_overall)::numeric(5,2) as avg_overall,
  avg(r.rating_success)::numeric(5,2) as avg_success,
  avg(r.rating_ease)::numeric(5,2) as avg_ease
from community.plant_ratings r
group by r.plant_profile_id;

-- ============================================================================
-- Auto-attach updated_at trigger to all mutable tables with updated_at column
-- ============================================================================

do $$
declare
  rec record;
begin
  for rec in
    select c.table_schema, c.table_name
    from information_schema.columns c
    where c.column_name = 'updated_at'
      and c.table_schema in ('core', 'catalog', 'community', 'ai', 'ops')
  loop
    execute format('drop trigger if exists trg_touch_updated_at on %I.%I;', rec.table_schema, rec.table_name);
    execute format(
      'create trigger trg_touch_updated_at before update on %I.%I for each row execute function core.touch_updated_at();',
      rec.table_schema,
      rec.table_name
    );
  end loop;
end $$;

-- ============================================================================
-- Row-level security (private data)
-- ============================================================================

create or replace function core.current_account_id()
returns uuid
language sql
stable
as $$
  select u.account_id
  from core.users u
  where u.id = core.current_user_id()
    and u.is_active = true
  limit 1;
$$;

create or replace function core.user_has_property_access(p_property_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from core.property_memberships pm
    where pm.property_id = p_property_id
      and pm.user_id = core.current_user_id()
      and pm.is_active = true
      and pm.accepted_at is not null
  );
$$;

create or replace function core.user_has_property_role(
  p_property_id uuid,
  p_roles text[]
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from core.property_memberships pm
    where pm.property_id = p_property_id
      and pm.user_id = core.current_user_id()
      and pm.is_active = true
      and pm.accepted_at is not null
      and pm.role_code = any(p_roles)
  );
$$;

alter table core.properties enable row level security;
alter table core.property_memberships enable row level security;
alter table core.property_invitations enable row level security;
alter table core.zones enable row level security;
alter table core.beds enable row level security;
alter table core.plant_instances enable row level security;
alter table core.tasks enable row level security;
alter table core.weather_adjustment_proposals enable row level security;
alter table core.recurring_task_templates enable row level security;
alter table core.observations enable row level security;
alter table core.media_assets enable row level security;
alter table core.plant_health_issues enable row level security;
alter table core.harvest_events enable row level security;
alter table core.weather_daily enable row level security;
alter table core.weather_alerts enable row level security;
alter table core.user_plant_wishlist enable row level security;
alter table core.property_activity enable row level security;

-- Properties
drop policy if exists property_select on core.properties;
create policy property_select
on core.properties
for select
using (core.user_has_property_access(id));

drop policy if exists property_insert on core.properties;
create policy property_insert
on core.properties
for insert
with check (account_id = core.current_account_id());

drop policy if exists property_update on core.properties;
create policy property_update
on core.properties
for update
using (core.user_has_property_role(id, array['owner', 'manager']))
with check (core.user_has_property_role(id, array['owner', 'manager']));

drop policy if exists property_delete on core.properties;
create policy property_delete
on core.properties
for delete
using (core.user_has_property_role(id, array['owner']));

-- Memberships
drop policy if exists membership_select on core.property_memberships;
create policy membership_select
on core.property_memberships
for select
using (
  user_id = core.current_user_id()
  or core.user_has_property_role(property_id, array['owner', 'manager'])
);

drop policy if exists membership_insert on core.property_memberships;
create policy membership_insert
on core.property_memberships
for insert
with check (core.user_has_property_role(property_id, array['owner']));

drop policy if exists membership_update on core.property_memberships;
create policy membership_update
on core.property_memberships
for update
using (core.user_has_property_role(property_id, array['owner']))
with check (core.user_has_property_role(property_id, array['owner']));

drop policy if exists membership_delete on core.property_memberships;
create policy membership_delete
on core.property_memberships
for delete
using (core.user_has_property_role(property_id, array['owner']));

-- Invitations
drop policy if exists invitation_select on core.property_invitations;
create policy invitation_select
on core.property_invitations
for select
using (core.user_has_property_role(property_id, array['owner', 'manager']));

drop policy if exists invitation_write on core.property_invitations;
create policy invitation_write
on core.property_invitations
for all
using (core.user_has_property_role(property_id, array['owner', 'manager']))
with check (core.user_has_property_role(property_id, array['owner', 'manager']));

-- Generic property-scoped policies
drop policy if exists zones_select on core.zones;
create policy zones_select on core.zones
for select using (core.user_has_property_access(property_id));

drop policy if exists zones_write on core.zones;
create policy zones_write on core.zones
for all using (core.user_has_property_role(property_id, array['owner', 'manager']))
with check (core.user_has_property_role(property_id, array['owner', 'manager']));

drop policy if exists beds_select on core.beds;
create policy beds_select on core.beds
for select using (core.user_has_property_access(property_id));

drop policy if exists beds_write on core.beds;
create policy beds_write on core.beds
for all using (core.user_has_property_role(property_id, array['owner', 'manager']))
with check (core.user_has_property_role(property_id, array['owner', 'manager']));

drop policy if exists plant_instances_select on core.plant_instances;
create policy plant_instances_select on core.plant_instances
for select using (core.user_has_property_access(property_id));

drop policy if exists plant_instances_write on core.plant_instances;
create policy plant_instances_write on core.plant_instances
for all using (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']))
with check (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']));

drop policy if exists tasks_select on core.tasks;
create policy tasks_select on core.tasks
for select using (core.user_has_property_access(property_id));

drop policy if exists tasks_write on core.tasks;
create policy tasks_write on core.tasks
for all using (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']))
with check (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']));

drop policy if exists weather_adjustment_select on core.weather_adjustment_proposals;
create policy weather_adjustment_select on core.weather_adjustment_proposals
for select using (core.user_has_property_access(property_id));

drop policy if exists weather_adjustment_write on core.weather_adjustment_proposals;
create policy weather_adjustment_write on core.weather_adjustment_proposals
for all using (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']))
with check (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']));

drop policy if exists recurring_select on core.recurring_task_templates;
create policy recurring_select on core.recurring_task_templates
for select using (core.user_has_property_access(property_id));

drop policy if exists recurring_write on core.recurring_task_templates;
create policy recurring_write on core.recurring_task_templates
for all using (core.user_has_property_role(property_id, array['owner', 'manager']))
with check (core.user_has_property_role(property_id, array['owner', 'manager']));

drop policy if exists observations_select on core.observations;
create policy observations_select on core.observations
for select using (core.user_has_property_access(property_id));

drop policy if exists observations_write on core.observations;
create policy observations_write on core.observations
for all using (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']))
with check (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']));

drop policy if exists media_select on core.media_assets;
create policy media_select on core.media_assets
for select using (property_id is null or core.user_has_property_access(property_id));

drop policy if exists media_write on core.media_assets;
create policy media_write on core.media_assets
for all using (property_id is null or core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']))
with check (property_id is null or core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']));

drop policy if exists plant_health_select on core.plant_health_issues;
create policy plant_health_select on core.plant_health_issues
for select using (core.user_has_property_access(property_id));

drop policy if exists plant_health_write on core.plant_health_issues;
create policy plant_health_write on core.plant_health_issues
for all using (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']))
with check (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']));

drop policy if exists harvest_select on core.harvest_events;
create policy harvest_select on core.harvest_events
for select using (core.user_has_property_access(property_id));

drop policy if exists harvest_write on core.harvest_events;
create policy harvest_write on core.harvest_events
for all using (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']))
with check (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']));

drop policy if exists weather_daily_select on core.weather_daily;
create policy weather_daily_select on core.weather_daily
for select using (core.user_has_property_access(property_id));

drop policy if exists weather_daily_write on core.weather_daily;
create policy weather_daily_write on core.weather_daily
for all using (core.user_has_property_role(property_id, array['owner', 'manager']))
with check (core.user_has_property_role(property_id, array['owner', 'manager']));

drop policy if exists weather_alerts_select on core.weather_alerts;
create policy weather_alerts_select on core.weather_alerts
for select using (core.user_has_property_access(property_id));

drop policy if exists weather_alerts_write on core.weather_alerts;
create policy weather_alerts_write on core.weather_alerts
for all using (core.user_has_property_role(property_id, array['owner', 'manager']))
with check (core.user_has_property_role(property_id, array['owner', 'manager']));

drop policy if exists wishlist_select on core.user_plant_wishlist;
create policy wishlist_select on core.user_plant_wishlist
for select
using (
  user_id = core.current_user_id()
  and (
    property_id is null
    or core.user_has_property_access(property_id)
  )
);

drop policy if exists wishlist_write on core.user_plant_wishlist;
create policy wishlist_write on core.user_plant_wishlist
for all
using (
  user_id = core.current_user_id()
  and (
    property_id is null
    or core.user_has_property_role(property_id, array['owner', 'manager', 'contributor'])
  )
)
with check (
  user_id = core.current_user_id()
  and (
    property_id is null
    or core.user_has_property_role(property_id, array['owner', 'manager', 'contributor'])
  )
);

drop policy if exists property_activity_select on core.property_activity;
create policy property_activity_select on core.property_activity
for select using (core.user_has_property_access(property_id));

drop policy if exists property_activity_insert on core.property_activity;
create policy property_activity_insert on core.property_activity
for insert with check (core.user_has_property_role(property_id, array['owner', 'manager', 'contributor']));

commit;
