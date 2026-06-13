-- Garden.io water quality tracking validation checks.

with expected_tables(schema_name, table_name) as (
  values
    ('catalog', 'water_quality_metrics'),
    ('public', 'garden_water_sources'),
    ('public', 'garden_bed_water_source_assignments'),
    ('public', 'garden_water_quality_tests'),
    ('public', 'garden_water_quality_readings')
),
missing_tables as (
  select e.schema_name, e.table_name
  from expected_tables e
  left join information_schema.tables t
    on t.table_schema = e.schema_name
   and t.table_name = e.table_name
  where t.table_name is null
),
rls_disabled as (
  select c.relname as table_name
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in (
      'garden_water_sources',
      'garden_bed_water_source_assignments',
      'garden_water_quality_tests',
      'garden_water_quality_readings'
    )
    and c.relkind = 'r'
    and not c.relrowsecurity
)
select
  'missing_tables' as check_name,
  coalesce(array_agg(schema_name || '.' || table_name order by schema_name, table_name), '{}') as failures
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
  missing_metric_count int;
  missing_fk_count int;
begin
  select count(*) into missing_count
  from (
    values
      ('catalog', 'water_quality_metrics'),
      ('public', 'garden_water_sources'),
      ('public', 'garden_bed_water_source_assignments'),
      ('public', 'garden_water_quality_tests'),
      ('public', 'garden_water_quality_readings')
  ) expected(schema_name, table_name)
  left join information_schema.tables t
    on t.table_schema = expected.schema_name
   and t.table_name = expected.table_name
  where t.table_name is null;

  if missing_count > 0 then
    raise exception 'Water quality validation failed: % expected tables are missing', missing_count;
  end if;

  select count(*) into rls_disabled_count
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relname in (
      'garden_water_sources',
      'garden_bed_water_source_assignments',
      'garden_water_quality_tests',
      'garden_water_quality_readings'
    )
    and not c.relrowsecurity;

  if rls_disabled_count > 0 then
    raise exception 'Water quality validation failed: % private water quality tables do not have RLS enabled', rls_disabled_count;
  end if;

  select count(*) into missing_metric_count
  from (
    values
      ('ph'),
      ('hardness'),
      ('hydrogen_sulfide'),
      ('iron'),
      ('copper'),
      ('lead'),
      ('manganese'),
      ('free_chlorine'),
      ('total_chlorine'),
      ('mercury'),
      ('nitrate'),
      ('nitrite'),
      ('sulfate'),
      ('zinc'),
      ('fluoride'),
      ('sodium_chloride'),
      ('alkalinity')
  ) expected(code)
  left join catalog.water_quality_metrics m on m.code = expected.code
  where m.code is null;

  if missing_metric_count > 0 then
    raise exception 'Water quality validation failed: % base photo metrics are missing', missing_metric_count;
  end if;

  select count(*) into missing_fk_count
  from (
    values
      ('garden_water_sources', 'garden_water_sources_property_id_fkey'),
      ('garden_bed_water_source_assignments', 'garden_bed_water_sources_zone_fk'),
      ('garden_bed_water_source_assignments', 'garden_bed_water_sources_bed_fk'),
      ('garden_bed_water_source_assignments', 'garden_bed_water_sources_source_fk'),
      ('garden_water_quality_tests', 'garden_water_quality_tests_source_fk'),
      ('garden_water_quality_readings', 'garden_water_quality_readings_metric_fk'),
      ('garden_water_quality_readings', 'garden_water_quality_readings_test_fk')
  ) expected(table_name, constraint_name)
  left join information_schema.table_constraints tc
    on tc.table_schema = 'public'
   and tc.table_name = expected.table_name
   and tc.constraint_name = expected.constraint_name
   and tc.constraint_type = 'FOREIGN KEY'
  where tc.constraint_name is null;

  if missing_fk_count > 0 then
    raise exception 'Water quality validation failed: % water quality foreign keys are missing', missing_fk_count;
  end if;
end $$;
