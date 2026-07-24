-- Add a structured plant-instance quantity field and tighten placement so the
-- selected bed, zone, and property all refer to the same bed record.

begin;

alter table public.garden_plant_instances
  add column if not exists quantity numeric(10,2) not null default 1;

with parsed as (
  select
    id,
    ((regexp_match(notes, '(^|\n)Quantity:\s*([0-9]+(?:\.[0-9]+)?)'))[2])::numeric(10,2) as parsed_quantity,
    nullif(
      btrim(
        regexp_replace(
          notes,
          '(^|\n)Quantity:\s*[0-9]+(?:\.[0-9]+)?\s*(\n|$)',
          E'\n',
          'g'
        ),
        E'\n'
      ),
      ''
    ) as cleaned_notes
  from public.garden_plant_instances
  where notes ~ '(^|\n)Quantity:\s*[0-9]+(?:\.[0-9]+)?'
)
update public.garden_plant_instances pi
set
  quantity = greatest(parsed.parsed_quantity, 1),
  notes = parsed.cleaned_notes,
  updated_at = now()
from parsed
where pi.id = parsed.id;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_plant_instances'::regclass
      and conname = 'garden_plant_instances_quantity_positive'
  ) then
    alter table public.garden_plant_instances
      add constraint garden_plant_instances_quantity_positive check (quantity > 0);
  end if;
end $$;

update public.garden_plant_instances pi
set
  zone_id = b.zone_id,
  updated_at = now()
from public.garden_beds b
where pi.bed_id = b.id
  and pi.property_id = b.property_id
  and pi.zone_id <> b.zone_id;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_beds'::regclass
      and conname = 'garden_beds_id_property_id_zone_id_key'
  ) then
    alter table public.garden_beds
      add constraint garden_beds_id_property_id_zone_id_key unique (id, property_id, zone_id);
  end if;

  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_plant_instances'::regclass
      and conname = 'garden_plant_instances_bed_id_property_id_fkey'
  ) then
    alter table public.garden_plant_instances
      drop constraint garden_plant_instances_bed_id_property_id_fkey;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_plant_instances'::regclass
      and conname = 'garden_plant_instances_bed_id_property_id_zone_id_fkey'
  ) then
    alter table public.garden_plant_instances
      add constraint garden_plant_instances_bed_id_property_id_zone_id_fkey
      foreign key (bed_id, property_id, zone_id) references public.garden_beds(id, property_id, zone_id) on delete cascade;
  end if;
end $$;

commit;
