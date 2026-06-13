-- Add a machine-readable requirements object to plant reference records.
-- Display summary fields such as sun/water/soil remain for simple UI surfaces.

begin;

alter table public.garden_catalog_plants
  add column if not exists growing_requirements jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_catalog_plants'::regclass
      and conname = 'garden_catalog_plants_growing_requirements_object'
  ) then
    alter table public.garden_catalog_plants
      add constraint garden_catalog_plants_growing_requirements_object
      check (jsonb_typeof(growing_requirements) = 'object');
  end if;
end $$;

create index if not exists garden_catalog_plants_growing_requirements_gin_idx
  on public.garden_catalog_plants using gin (growing_requirements);

commit;
