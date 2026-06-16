-- Garden.io private beta: per-planting outcome capture (Phase 3C Slice 2).
--
-- Records how a planting actually did — harvest quantity/quality and a
-- success/partial/failure result — as a log (a planting can have several
-- entries: weekly harvests, then a final verdict). This is the "remember what
-- I did" memory that later feeds history-cited recommendations (Slice 3) and
-- shows up as past milestones on the planting timeline (Slice 1).
--
-- Additive + idempotent. Owner-scoped RLS via garden_user_owns_property.
-- Rollback: drop table public.garden_plant_outcomes.

begin;

create table if not exists public.garden_plant_outcomes (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  plant_instance_id uuid not null references public.garden_plant_instances(id) on delete cascade,
  -- Overall verdict for this entry; optional so a pure harvest log entry need
  -- not commit to one.
  result text check (result in ('success', 'partial', 'failure')),
  harvest_quantity numeric(10, 2) check (harvest_quantity is null or harvest_quantity >= 0),
  harvest_unit text,
  quality_rating smallint check (quality_rating is null or (quality_rating between 1 and 5)),
  harvested_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists garden_plant_outcomes_plant_instance_id_idx
  on public.garden_plant_outcomes(plant_instance_id);
create index if not exists garden_plant_outcomes_property_id_idx
  on public.garden_plant_outcomes(property_id);

alter table public.garden_plant_outcomes enable row level security;

drop policy if exists garden_plant_outcomes_select_own on public.garden_plant_outcomes;
create policy garden_plant_outcomes_select_own
  on public.garden_plant_outcomes
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_plant_outcomes_write_own on public.garden_plant_outcomes;
create policy garden_plant_outcomes_write_own
  on public.garden_plant_outcomes
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

grant select, insert, update, delete on public.garden_plant_outcomes to authenticated;

drop trigger if exists garden_plant_outcomes_touch_updated_at on public.garden_plant_outcomes;
create trigger garden_plant_outcomes_touch_updated_at
  before update on public.garden_plant_outcomes
  for each row execute function public.garden_touch_updated_at();

commit;
