-- Garden.io private beta MVP validation checks.

with expected_tables(table_name) as (
  values
    ('garden_profiles'),
    ('garden_properties'),
    ('garden_zones'),
    ('garden_beds'),
    ('garden_plant_instances'),
    ('garden_observations'),
    ('garden_tasks'),
    ('garden_wishlist')
),
missing_tables as (
  select e.table_name
  from expected_tables e
  left join information_schema.tables t
    on t.table_schema = 'public'
   and t.table_name = e.table_name
  where t.table_name is null
),
rls_disabled as (
  select c.relname as table_name
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  join expected_tables e on e.table_name = c.relname
  where n.nspname = 'public'
    and c.relkind = 'r'
    and not c.relrowsecurity
)
select
  'missing_tables' as check_name,
  coalesce(array_agg(table_name order by table_name), '{}') as failures
from missing_tables
union all
select
  'rls_disabled' as check_name,
  coalesce(array_agg(table_name order by table_name), '{}') as failures
from rls_disabled;

do $$
declare
  missing_count int;
  rls_disabled_count int;
  legacy_column_count int;
  missing_normalized_column_count int;
  missing_fk_count int;
  invalid_quantity_count int;
  invalid_requirements_count int;
  starter_count int;
begin
  select count(*) into missing_count
  from (
    values
      ('garden_profiles'),
      ('garden_properties'),
      ('garden_zones'),
      ('garden_beds'),
      ('garden_plant_instances'),
      ('garden_observations'),
      ('garden_tasks'),
      ('garden_wishlist')
  ) expected(table_name)
  left join information_schema.tables t
    on t.table_schema = 'public'
   and t.table_name = expected.table_name
  where t.table_name is null;

  if missing_count > 0 then
    raise exception 'MVP validation failed: % expected tables are missing', missing_count;
  end if;

  select count(*) into rls_disabled_count
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relname like 'garden_%'
    and not c.relrowsecurity;

  if rls_disabled_count > 0 then
    raise exception 'MVP validation failed: % garden tables do not have RLS enabled', rls_disabled_count;
  end if;

  select count(*) into legacy_column_count
  from information_schema.columns
  where table_schema = 'public'
    and table_name in ('garden_plant_instances', 'garden_wishlist')
    and column_name in ('plant_slug', 'plant_name');

  if legacy_column_count > 0 then
    raise exception 'MVP validation failed: garden plant instance/wishlist rows still duplicate plant_slug or plant_name';
  end if;

  if to_regclass('public.garden_catalog_plants') is not null then
    raise exception 'MVP validation failed: public.garden_catalog_plants should be retired in favor of catalog.plant_profiles';
  end if;

  select count(*) into missing_normalized_column_count
  from (
    values
      ('garden_plant_instances', 'plant_profile_id'),
      ('garden_plant_instances', 'quantity'),
      ('garden_wishlist', 'plant_profile_id')
  ) expected(table_name, column_name)
  left join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = expected.table_name
   and c.column_name = expected.column_name
  where c.column_name is null;

  if missing_normalized_column_count > 0 then
    raise exception 'MVP validation failed: expected normalized plant reference columns are missing';
  end if;

  select count(*) into missing_fk_count
  from (
    values
      ('garden_plant_instances', 'garden_plant_instances_plant_profile_id_fkey'),
      ('garden_plant_instances', 'garden_plant_instances_zone_id_property_id_fkey'),
      ('garden_plant_instances', 'garden_plant_instances_bed_id_property_id_zone_id_fkey'),
      ('garden_wishlist', 'garden_wishlist_plant_profile_id_fkey')
  ) expected(table_name, constraint_name)
  left join information_schema.table_constraints tc
    on tc.table_schema = 'public'
   and tc.table_name = expected.table_name
   and tc.constraint_name = expected.constraint_name
   and tc.constraint_type = 'FOREIGN KEY'
  where tc.constraint_name is null;

  if missing_fk_count > 0 then
    raise exception 'MVP validation failed: plant instance or wishlist foreign key constraints are missing';
  end if;

  select count(*) into invalid_quantity_count
  from public.garden_plant_instances
  where quantity <= 0;

  if invalid_quantity_count > 0 then
    raise exception 'MVP validation failed: % plant instance quantities are invalid', invalid_quantity_count;
  end if;

  select count(*) into starter_count
  from catalog.plant_profiles;

  if starter_count < 10 then
    raise exception 'MVP validation failed: expected at least 10 canonical plant profiles, found %', starter_count;
  end if;
end $$;
