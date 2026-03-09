-- Garden.io Module 10 validation checks

-- 1) Show row counts for all user tables in main schemas.
with table_counts as (
  select
    n.nspname as table_schema,
    c.relname as table_name,
    (
      xpath('/row/cnt/text()', query_to_xml(format('select count(*) as cnt from %I.%I', n.nspname, c.relname), false, true, ''))
    )[1]::text::bigint as row_count
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where c.relkind = 'r'
    and n.nspname in ('core', 'catalog', 'community', 'ai', 'audit', 'ops')
)
select *
from table_counts
order by table_schema, table_name;

-- 2) Hard assertion: every table in these schemas has at least one row.
do $$
declare
  rec record;
  cnt bigint;
  missing text[] := '{}';
begin
  for rec in
    select n.nspname as table_schema, c.relname as table_name
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'r'
      and n.nspname in ('core', 'catalog', 'community', 'ai', 'audit', 'ops')
    order by n.nspname, c.relname
  loop
    execute format('select count(*) from %I.%I', rec.table_schema, rec.table_name) into cnt;
    if cnt < 1 then
      missing := array_append(missing, rec.table_schema || '.' || rec.table_name);
    end if;
  end loop;

  if coalesce(array_length(missing, 1), 0) > 0 then
    raise exception 'Seed validation failed. Empty tables: %', array_to_string(missing, ', ');
  end if;
end $$;

-- 3) Key path sanity checks for UI flows.
select
  p.name as property_name,
  z.name as zone_name,
  b.name as bed_name,
  pi.id as plant_instance_id,
  pp.display_name as plant_name,
  t.title as sample_task,
  t.status_code as sample_task_status
from core.properties p
join core.zones z on z.property_id = p.id
join core.beds b on b.zone_id = z.id
join core.plant_instances pi on pi.bed_id = b.id
join catalog.plant_profiles pp on pp.id = pi.plant_profile_id
left join core.tasks t on t.plant_instance_id = pi.id
where p.id = '10000000-0000-0000-0000-000000000021'
order by z.sort_order, b.sort_order
limit 20;
