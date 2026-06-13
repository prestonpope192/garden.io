-- Garden.io private beta MVP schema.
--
-- Additive tables for the first records-only beta:
-- account profile, properties, zones, beds, plant instances, observations,
-- manual tasks, wishlist, and a public starter plant catalogue.

create extension if not exists pgcrypto;

create or replace function public.garden_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.garden_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.garden_properties (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  label text not null default 'Garden',
  region text,
  growing_zone text,
  season text,
  notes text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.garden_zones (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  name text not null,
  purpose text,
  light text,
  water text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, property_id)
);

create table if not exists public.garden_beds (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  zone_id uuid not null,
  name text not null,
  sun text,
  water text,
  soil text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, property_id),
  unique (id, property_id, zone_id),
  foreign key (zone_id, property_id) references public.garden_zones(id, property_id) on delete cascade
);

create table if not exists public.garden_catalog_plants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  common_name text not null,
  latin_name text not null,
  family text not null,
  summary text not null,
  sun text,
  water text,
  soil text,
  growing_requirements jsonb not null default '{}'::jsonb check (jsonb_typeof(growing_requirements) = 'object'),
  fit_for text,
  public_note text,
  tags text[] not null default '{}',
  illustration text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.garden_plant_instances (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  zone_id uuid not null,
  bed_id uuid not null,
  plant_id uuid not null references public.garden_catalog_plants(id),
  quantity numeric(10,2) not null default 1 check (quantity > 0),
  status text not null default 'growing' check (status in ('growing', 'wishlist', 'archived')),
  planted_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (zone_id, property_id) references public.garden_zones(id, property_id) on delete cascade,
  foreign key (bed_id, property_id, zone_id) references public.garden_beds(id, property_id, zone_id) on delete cascade
);

create table if not exists public.garden_observations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  zone_id uuid,
  bed_id uuid,
  plant_instance_id uuid references public.garden_plant_instances(id) on delete set null,
  note text not null,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (zone_id, property_id) references public.garden_zones(id, property_id) on delete set null,
  foreign key (bed_id, property_id) references public.garden_beds(id, property_id) on delete set null
);

create table if not exists public.garden_tasks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  zone_id uuid,
  bed_id uuid,
  plant_instance_id uuid references public.garden_plant_instances(id) on delete set null,
  title text not null,
  notes text,
  due_on date,
  status text not null default 'open' check (status in ('open', 'done')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (zone_id, property_id) references public.garden_zones(id, property_id) on delete set null,
  foreign key (bed_id, property_id) references public.garden_beds(id, property_id) on delete set null
);

create table if not exists public.garden_wishlist (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid not null references public.garden_catalog_plants(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_user_id, plant_id)
);

-- Backward-compatible re-run support for private beta databases created before
-- plant instances and wishlist rows were normalized to catalogue FKs. The
-- follow-up normalization migration backfills, constrains, and drops legacy
-- duplicate name/slug columns.
alter table public.garden_plant_instances
  add column if not exists plant_id uuid;

alter table public.garden_plant_instances
  add column if not exists quantity numeric(10,2) not null default 1;

alter table public.garden_wishlist
  add column if not exists plant_id uuid;

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
end $$;

create index if not exists garden_properties_owner_user_id_idx on public.garden_properties(owner_user_id);
create index if not exists garden_zones_property_id_idx on public.garden_zones(property_id);
create index if not exists garden_beds_property_id_zone_id_idx on public.garden_beds(property_id, zone_id);
create index if not exists garden_plant_instances_property_id_bed_id_idx on public.garden_plant_instances(property_id, bed_id);
create index if not exists garden_plant_instances_plant_id_idx on public.garden_plant_instances(plant_id);
create index if not exists garden_tasks_property_id_status_due_on_idx on public.garden_tasks(property_id, status, due_on);
create index if not exists garden_observations_property_id_observed_at_idx on public.garden_observations(property_id, observed_at desc);
create index if not exists garden_wishlist_owner_user_id_idx on public.garden_wishlist(owner_user_id);
create index if not exists garden_wishlist_plant_id_idx on public.garden_wishlist(plant_id);

create or replace function public.garden_user_owns_property(target_property_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.garden_properties p
    where p.id = target_property_id
      and p.owner_user_id = (select auth.uid())
      and p.deleted_at is null
  );
$$;

create or replace function public.garden_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.garden_profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name')
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.garden_profiles.full_name, excluded.full_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists garden_on_auth_user_created on auth.users;
create trigger garden_on_auth_user_created
  after insert on auth.users
  for each row execute function public.garden_handle_new_user();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'garden_profiles',
    'garden_properties',
    'garden_zones',
    'garden_beds',
    'garden_catalog_plants',
    'garden_plant_instances',
    'garden_observations',
    'garden_tasks',
    'garden_wishlist'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

drop policy if exists garden_profiles_select_own on public.garden_profiles;
create policy garden_profiles_select_own
  on public.garden_profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists garden_profiles_update_own on public.garden_profiles;
create policy garden_profiles_update_own
  on public.garden_profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists garden_properties_select_own on public.garden_properties;
create policy garden_properties_select_own
  on public.garden_properties
  for select
  to authenticated
  using (owner_user_id = (select auth.uid()) and deleted_at is null);

drop policy if exists garden_properties_insert_own on public.garden_properties;
create policy garden_properties_insert_own
  on public.garden_properties
  for insert
  to authenticated
  with check (owner_user_id = (select auth.uid()));

drop policy if exists garden_properties_update_own on public.garden_properties;
create policy garden_properties_update_own
  on public.garden_properties
  for update
  to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

drop policy if exists garden_properties_delete_own on public.garden_properties;
create policy garden_properties_delete_own
  on public.garden_properties
  for delete
  to authenticated
  using (owner_user_id = (select auth.uid()));

drop policy if exists garden_catalog_select_public on public.garden_catalog_plants;
create policy garden_catalog_select_public
  on public.garden_catalog_plants
  for select
  to anon, authenticated
  using (true);

drop policy if exists garden_zones_select_own on public.garden_zones;
create policy garden_zones_select_own
  on public.garden_zones
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_zones_write_own on public.garden_zones;
create policy garden_zones_write_own
  on public.garden_zones
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_beds_select_own on public.garden_beds;
create policy garden_beds_select_own
  on public.garden_beds
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_beds_write_own on public.garden_beds;
create policy garden_beds_write_own
  on public.garden_beds
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_plant_instances_select_own on public.garden_plant_instances;
create policy garden_plant_instances_select_own
  on public.garden_plant_instances
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_plant_instances_write_own on public.garden_plant_instances;
create policy garden_plant_instances_write_own
  on public.garden_plant_instances
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_observations_select_own on public.garden_observations;
create policy garden_observations_select_own
  on public.garden_observations
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_observations_write_own on public.garden_observations;
create policy garden_observations_write_own
  on public.garden_observations
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_tasks_select_own on public.garden_tasks;
create policy garden_tasks_select_own
  on public.garden_tasks
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_tasks_write_own on public.garden_tasks;
create policy garden_tasks_write_own
  on public.garden_tasks
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_wishlist_select_own on public.garden_wishlist;
create policy garden_wishlist_select_own
  on public.garden_wishlist
  for select
  to authenticated
  using (owner_user_id = (select auth.uid()));

drop policy if exists garden_wishlist_write_own on public.garden_wishlist;
create policy garden_wishlist_write_own
  on public.garden_wishlist
  for all
  to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

grant select on public.garden_catalog_plants to anon, authenticated;
grant select, insert, update, delete on
  public.garden_profiles,
  public.garden_properties,
  public.garden_zones,
  public.garden_beds,
  public.garden_plant_instances,
  public.garden_observations,
  public.garden_tasks,
  public.garden_wishlist
to authenticated;

drop trigger if exists garden_properties_touch_updated_at on public.garden_properties;
create trigger garden_properties_touch_updated_at
  before update on public.garden_properties
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_zones_touch_updated_at on public.garden_zones;
create trigger garden_zones_touch_updated_at
  before update on public.garden_zones
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_beds_touch_updated_at on public.garden_beds;
create trigger garden_beds_touch_updated_at
  before update on public.garden_beds
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_catalog_plants_touch_updated_at on public.garden_catalog_plants;
create trigger garden_catalog_plants_touch_updated_at
  before update on public.garden_catalog_plants
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_plant_instances_touch_updated_at on public.garden_plant_instances;
create trigger garden_plant_instances_touch_updated_at
  before update on public.garden_plant_instances
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_observations_touch_updated_at on public.garden_observations;
create trigger garden_observations_touch_updated_at
  before update on public.garden_observations
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_tasks_touch_updated_at on public.garden_tasks;
create trigger garden_tasks_touch_updated_at
  before update on public.garden_tasks
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_wishlist_touch_updated_at on public.garden_wishlist;
create trigger garden_wishlist_touch_updated_at
  before update on public.garden_wishlist
  for each row execute function public.garden_touch_updated_at();

insert into public.garden_catalog_plants (
  slug,
  common_name,
  latin_name,
  family,
  summary,
  sun,
  water,
  soil,
  fit_for,
  public_note,
  tags,
  illustration
)
values
  ('cherokee-purple-tomato', 'Cherokee Purple Tomato', 'Solanum lycopersicum', 'Solanaceae', 'A full-flavor slicing tomato that rewards warm beds, deep feeding, and consistent pruning.', 'Full', 'Medium', 'Rich, warm, mulched', 'Kitchen gardens, warm raised beds, succession planting', 'Popular starter profile because it shows how Garden.io links plant care, companion notes, and timing windows.', array['Fruit', 'Warm season', 'Full sun'], '/art/specimen-tomato.svg'),
  ('scarlet-runner-bean', 'Scarlet Runner Bean', 'Phaseolus coccineus', 'Fabaceae', 'A climbing bean with strong pollinator value and a long visual season on fences and trellises.', 'Full to part', 'Medium', 'Compost-rich, evenly moist', 'Fence lines, trellis beds, pollinator strips', 'Useful for growers balancing edible production with floral impact and pollinator traffic.', array['Climber', 'Pollinator', 'Trellis'], '/art/specimen-bean-vine.svg'),
  ('calendula', 'Calendula', 'Calendula officinalis', 'Asteraceae', 'An easy seasonal flower for edges, pollinator support, and steady cut-and-come-again blooms.', 'Full to part', 'Low to medium', 'Well-drained, forgiving', 'Pollinator borders, companion rows, reseeding beds', 'A strong entry point for visitors who want to browse the catalog without logging in.', array['Flower', 'Pollinator', 'Reseeds'], '/art/specimen-calendar-bloom.svg'),
  ('comfrey', 'Comfrey', 'Symphytum officinale', 'Boraginaceae', 'A heavy-cut perennial often used in orchard guilds for mulch, nutrient cycling, and pollinator support.', 'Full to part', 'Medium', 'Deep, moisture-retentive', 'Orchard circles, guild beds, chop-and-drop systems', 'Useful for regenerative-minded growers thinking in systems rather than isolated crops.', array['Perennial', 'Guild', 'Soil building'], '/art/specimen-herbarium-sheet.svg'),
  ('genovese-basil', 'Genovese Basil', 'Ocimum basilicum', 'Lamiaceae', 'A kitchen-garden staple that pairs well with tomatoes and rewards regular pinching.', 'Full', 'Medium', 'Rich, quick-draining', 'Companion plantings, warm containers, high-use herb beds', 'Included to highlight companion relationships and quick seasonal wins for new users.', array['Herb', 'Companion', 'Warm season'], '/art/specimen-calendar-bloom.svg'),
  ('blueberry-highbush', 'Highbush Blueberry', 'Vaccinium corymbosum', 'Ericaceae', 'A perennial fruiting shrub that depends on acidity, mulch, and long-horizon care.', 'Full to light shade', 'Medium', 'Acidic, organic, moisture-retentive', 'Perennial borders, orchard edges, berry rows', 'A good example of why place-based records matter over multiple seasons.', array['Perennial', 'Fruit', 'Acid-loving'], '/art/specimen-herbarium-sheet.svg'),
  ('dill', 'Dill', 'Anethum graveolens', 'Apiaceae', 'A feathery herb that attracts beneficial insects and bridges the edible and pollinator garden.', 'Full', 'Low to medium', 'Loose, well-drained', 'Pollinator strips, herb beds, edge plantings', 'Shows how the catalog can connect beneficial insect value to practical planting decisions.', array['Herb', 'Beneficial insects', 'Fast growing'], '/art/specimen-bean-vine.svg'),
  ('strawberry-june-bearing', 'June-Bearing Strawberry', 'Fragaria x ananassa', 'Rosaceae', 'A compact fruiting crop that benefits from clean mulch, renewal notes, and bed-level memory.', 'Full', 'Medium', 'Rich, moisture-consistent', 'Perennial rows, raised beds, family picking patches', 'Useful for demonstrating how recurring seasonal tasks attach to a stable place record.', array['Fruit', 'Perennial', 'Mulch'], '/art/specimen-tomato.svg'),
  ('meyer-lemon', 'Meyer Lemon', 'Citrus x meyeri', 'Rutaceae', 'A container-friendly citrus for growers managing winter protection and seasonal movement.', 'Full', 'Medium', 'Sharp-draining citrus mix', 'Containers, protected patios, greenhouse transitions', 'Highlights the kind of plant that benefits from schedule-aware reminders and move-in notes.', array['Container', 'Citrus', 'Protected'], '/art/specimen-calendar-bloom.svg'),
  ('garlic-hardneck', 'Hardneck Garlic', 'Allium sativum var. ophioscorodon', 'Amaryllidaceae', 'A season-spanning crop where planting date, mulch depth, and harvest timing all matter.', 'Full', 'Low to medium', 'Loose, fertile, well-drained', 'Fall planting plans, rotation beds, storage crops', 'A clear example of how calendar timing and plant records reinforce each other.', array['Storage crop', 'Cool season', 'Rotation'], '/art/specimen-herbarium-sheet.svg')
on conflict (slug) do update
set common_name = excluded.common_name,
    latin_name = excluded.latin_name,
    family = excluded.family,
    summary = excluded.summary,
    sun = excluded.sun,
    water = excluded.water,
    soil = excluded.soil,
    fit_for = excluded.fit_for,
    public_note = excluded.public_note,
    tags = excluded.tags,
    illustration = excluded.illustration,
    updated_at = now();
