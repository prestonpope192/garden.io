-- Validate the canonical catalog bridge and the full Acanthus POC profile.

with expected_tables(table_schema, table_name) as (
  values
    ('catalog', 'plant_taxa'),
    ('catalog', 'plant_names'),
    ('catalog', 'plant_profiles'),
    ('catalog', 'plant_profile_narratives'),
    ('catalog', 'plant_ornamental_profiles'),
    ('catalog', 'plant_profile_uses'),
    ('catalog', 'plant_climate_profiles'),
    ('catalog', 'plant_growth_profiles'),
    ('catalog', 'plant_propagation_methods'),
    ('catalog', 'plant_flowering_profiles'),
    ('catalog', 'plant_fruiting_profiles'),
    ('catalog', 'plant_soil_profiles'),
    ('catalog', 'plant_water_profiles'),
    ('catalog', 'plant_water_establishment_profiles'),
    ('catalog', 'plant_water_seasonal_profiles'),
    ('catalog', 'plant_ecology_profiles'),
    ('catalog', 'plant_maintenance_profiles'),
    ('catalog', 'plant_safety_profiles'),
    ('catalog', 'plant_relationships'),
    ('catalog', 'phenology_templates'),
    ('catalog', 'phenology_events'),
    ('catalog', 'plant_zone_profiles'),
    ('catalog', 'plant_care_events'),
    ('catalog', 'plant_sources'),
    ('catalog', 'plant_claims'),
    ('catalog', 'plant_images'),
    ('catalog', 'plant_rating_dimensions'),
    ('catalog', 'plant_rating_dimension_levels'),
    ('catalog', 'plant_profile_ratings')
),
missing_tables as (
  select e.table_schema, e.table_name
  from expected_tables e
  left join information_schema.tables t
    on t.table_schema = e.table_schema
   and t.table_name = e.table_name
  where t.table_name is null
)
select
  'missing_canonical_tables' as check_name,
  coalesce(array_agg(table_schema || '.' || table_name order by table_schema, table_name), '{}') as failures
from missing_tables;

do $$
declare
  mvp_plant_count int;
  profile_count int;
  unbridged_instance_count int;
  unbridged_wishlist_count int;
  acanthus_profile_id uuid;
  missing_acanthus_sections int;
  incomplete_rating_dimension_count int;
  acanthus_rating_count int;
  broad_claim_type_count int;
begin
  if exists (
    with expected_tables(table_schema, table_name) as (
      values
        ('catalog', 'plant_taxa'),
        ('catalog', 'plant_profiles'),
        ('catalog', 'plant_profile_narratives'),
        ('catalog', 'plant_ornamental_profiles'),
        ('catalog', 'plant_claims')
    )
    select 1
    from expected_tables e
    left join information_schema.tables t
      on t.table_schema = e.table_schema
     and t.table_name = e.table_name
    where t.table_name is null
  ) then
    raise exception 'Canonical catalog validation failed: expected catalog tables are missing';
  end if;

  select count(*) into mvp_plant_count
  from catalog.plant_profiles;

  select count(*) into profile_count
  from catalog.plant_profile_catalogue_view;

  if profile_count <> mvp_plant_count then
    raise exception 'Canonical catalog validation failed: % plant profiles but % catalogue view rows', mvp_plant_count, profile_count;
  end if;

  if to_regclass('public.garden_catalog_plants') is not null then
    raise exception 'Canonical catalog validation failed: public.garden_catalog_plants should be retired';
  end if;

  if to_regclass('catalog.plant_soil_texture_preferences') is not null then
    raise exception 'Canonical catalog validation failed: plant_soil_texture_preferences should be merged into plant_soil_profiles';
  end if;

  if to_regclass('catalog.plant_propagation_profiles') is not null then
    raise exception 'Canonical catalog validation failed: plant_propagation_profiles should be merged into plant_propagation_methods';
  end if;

  select count(*) into unbridged_instance_count
  from public.garden_plant_instances
  where plant_profile_id is null;

  select count(*) into unbridged_wishlist_count
  from public.garden_wishlist
  where plant_profile_id is null;

  if unbridged_instance_count + unbridged_wishlist_count > 0 then
    raise exception 'Canonical catalog validation failed: unbridged instances %, wishlist %',
      unbridged_instance_count, unbridged_wishlist_count;
  end if;

  if to_regclass('catalog.plant_profile_catalogue_view') is null then
    raise exception 'Canonical catalog validation failed: catalog.plant_profile_catalogue_view is missing';
  end if;

  select id into acanthus_profile_id
  from catalog.plant_profiles
  where slug = 'acanthus';

  select count(*) into missing_acanthus_sections
  from (
    values
      ('plant_profile_narratives', exists (select 1 from catalog.plant_profile_narratives where plant_profile_id = acanthus_profile_id)),
      ('plant_ornamental_profiles', exists (select 1 from catalog.plant_ornamental_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_profile_uses', exists (select 1 from catalog.plant_profile_uses where plant_profile_id = acanthus_profile_id)),
      ('plant_climate_profiles', exists (select 1 from catalog.plant_climate_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_growth_profiles', exists (select 1 from catalog.plant_growth_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_propagation_methods', exists (select 1 from catalog.plant_propagation_methods where plant_profile_id = acanthus_profile_id)),
      ('plant_flowering_profiles', exists (select 1 from catalog.plant_flowering_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_soil_profiles', exists (select 1 from catalog.plant_soil_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_water_profiles', exists (select 1 from catalog.plant_water_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_ecology_profiles', exists (select 1 from catalog.plant_ecology_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_maintenance_profiles', exists (select 1 from catalog.plant_maintenance_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_safety_profiles', exists (select 1 from catalog.plant_safety_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_relationships', exists (select 1 from catalog.plant_relationships where plant_profile_id = acanthus_profile_id)),
      ('phenology_templates', exists (select 1 from catalog.phenology_templates where plant_profile_id = acanthus_profile_id)),
      ('plant_zone_profiles', exists (select 1 from catalog.plant_zone_profiles where plant_profile_id = acanthus_profile_id)),
      ('plant_care_events', exists (select 1 from catalog.plant_care_events where plant_profile_id = acanthus_profile_id)),
      ('plant_claims', exists (select 1 from catalog.plant_claims where plant_profile_id = acanthus_profile_id)),
      ('plant_images', exists (select 1 from catalog.plant_images where plant_profile_id = acanthus_profile_id))
  ) required(section_name, present)
  where not present;

  if missing_acanthus_sections > 0 then
    raise exception 'Canonical catalog validation failed: Acanthus is missing % required POC sections', missing_acanthus_sections;
  end if;

  if not exists (
    select 1
    from catalog.plant_soil_profiles
    where plant_profile_id = acanthus_profile_id
      and texture_preferences ? 'loam'
      and preferred_soil_texture_codes @> array['loam']
  ) then
    raise exception 'Canonical catalog validation failed: Acanthus soil texture preferences are not merged into plant_soil_profiles';
  end if;

  if not exists (
    select 1
    from catalog.plant_propagation_methods
    where plant_profile_id = acanthus_profile_id
      and planting_method_code = 'division'
      and is_preferred = true
      and spreads_by_rhizomes = true
      and proliferation_behavior is not null
  ) then
    raise exception 'Canonical catalog validation failed: Acanthus propagation details are not merged into method rows';
  end if;

  select count(*) into broad_claim_type_count
  from catalog.plant_claims
  where plant_profile_id = acanthus_profile_id
    and claim_type !~ '^[a-z_]+[.][a-z0-9_]+$';

  if broad_claim_type_count > 0 then
    raise exception 'Canonical catalog validation failed: Acanthus has % broad claim types; claims should be field-aligned', broad_claim_type_count;
  end if;

  select count(*) into incomplete_rating_dimension_count
  from catalog.plant_rating_dimensions d
  left join catalog.plant_rating_dimension_levels l on l.dimension_code = d.code
  group by d.code
  having count(l.rating) <> 5
  limit 1;

  if incomplete_rating_dimension_count is not null then
    raise exception 'Canonical catalog validation failed: at least one rating dimension does not have exactly 5 levels';
  end if;

  select count(*) into acanthus_rating_count
  from catalog.plant_profile_ratings
  where plant_profile_id = acanthus_profile_id;

  if acanthus_rating_count < 20 then
    raise exception 'Canonical catalog validation failed: Acanthus has only % normalized ratings', acanthus_rating_count;
  end if;
end $$;
