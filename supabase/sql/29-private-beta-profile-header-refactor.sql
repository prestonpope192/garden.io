-- Make catalog.plant_profiles the stable header/FK anchor and move profile
-- narrative plus ornamental display facts into dedicated child tables.

begin;

alter table catalog.plant_profiles
  add column if not exists slug text;

do $$
begin
  if to_regclass('public.garden_catalog_plants') is not null
     and exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'garden_catalog_plants'
         and column_name = 'catalog_plant_profile_id'
     ) then
    execute $sql$
      update catalog.plant_profiles p
      set slug = cp.slug,
          updated_at = now()
      from public.garden_catalog_plants cp
      where cp.catalog_plant_profile_id = p.id
        and p.slug is distinct from cp.slug
    $sql$;
  end if;
end $$;

update catalog.plant_profiles
set slug = regexp_replace(
    regexp_replace(lower(display_name), '[^a-z0-9]+', '-', 'g'),
    '(^-|-$)',
    '',
    'g'
  ),
  updated_at = now()
where slug is null;

do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'catalog'
      and indexname = 'uq_plant_profiles_slug'
  ) then
    create unique index uq_plant_profiles_slug
      on catalog.plant_profiles(slug)
      where deleted_at is null;
  end if;
end $$;

create table if not exists catalog.plant_profile_narratives (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null references catalog.plant_profiles(id) on delete cascade,
  locale text not null default 'en',
  short_description text,
  why_plant_it text,
  pros_summary text,
  cons_summary text,
  primary_use_cases text,
  notes_for_homestead text,
  notes_for_small_garden text,
  notes_for_container_growing text,
  editorial_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  unique (plant_profile_id, locale)
);

create index if not exists idx_plant_profile_narratives_profile
  on catalog.plant_profile_narratives(plant_profile_id);

drop trigger if exists trg_touch_updated_at on catalog.plant_profile_narratives;
create trigger trg_touch_updated_at
before update on catalog.plant_profile_narratives
for each row execute function core.touch_updated_at();

create table if not exists catalog.plant_ornamental_profiles (
  plant_profile_id uuid primary key references catalog.plant_profiles(id) on delete cascade,
  evergreen_deciduous text check (evergreen_deciduous in ('evergreen', 'deciduous', 'semi_evergreen', 'unknown')),
  ornamental_season_interest text[],
  visual_texture text,
  foliage_color text,
  evergreen_foliage boolean,
  winter_interest boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

drop trigger if exists trg_touch_updated_at on catalog.plant_ornamental_profiles;
create trigger trg_touch_updated_at
before update on catalog.plant_ornamental_profiles
for each row execute function core.touch_updated_at();

insert into catalog.plant_profile_narratives (
  plant_profile_id,
  locale,
  short_description,
  why_plant_it,
  pros_summary,
  cons_summary,
  primary_use_cases,
  notes_for_homestead,
  notes_for_small_garden,
  notes_for_container_growing
)
select
  id,
  'en',
  short_description,
  why_plant_it,
  pros_summary,
  cons_summary,
  primary_use_cases,
  notes_for_homestead,
  notes_for_small_garden,
  notes_for_container_growing
from catalog.plant_profiles
where short_description is not null
   or why_plant_it is not null
   or pros_summary is not null
   or cons_summary is not null
   or primary_use_cases is not null
   or notes_for_homestead is not null
   or notes_for_small_garden is not null
   or notes_for_container_growing is not null
on conflict (plant_profile_id, locale) do update
set short_description = excluded.short_description,
    why_plant_it = excluded.why_plant_it,
    pros_summary = excluded.pros_summary,
    cons_summary = excluded.cons_summary,
    primary_use_cases = excluded.primary_use_cases,
    notes_for_homestead = excluded.notes_for_homestead,
    notes_for_small_garden = excluded.notes_for_small_garden,
    notes_for_container_growing = excluded.notes_for_container_growing,
    updated_at = now();

insert into catalog.plant_ornamental_profiles (
  plant_profile_id,
  evergreen_deciduous,
  ornamental_season_interest,
  visual_texture,
  foliage_color,
  evergreen_foliage,
  winter_interest
)
select
  id,
  evergreen_deciduous,
  ornamental_season_interest,
  visual_texture,
  foliage_color,
  evergreen_foliage,
  winter_interest
from catalog.plant_profiles
where evergreen_deciduous is not null
   or ornamental_season_interest is not null
   or visual_texture is not null
   or foliage_color is not null
   or evergreen_foliage is not null
   or winter_interest is not null
on conflict (plant_profile_id) do update
set evergreen_deciduous = excluded.evergreen_deciduous,
    ornamental_season_interest = excluded.ornamental_season_interest,
    visual_texture = excluded.visual_texture,
    foliage_color = excluded.foliage_color,
    evergreen_foliage = excluded.evergreen_foliage,
    winter_interest = excluded.winter_interest,
    updated_at = now();

comment on table catalog.plant_profiles is
  'Core plant profile header and FK anchor. App catalogue views should join child profile tables for narrative, requirements, ratings, ecology, care, and media.';
comment on column catalog.plant_profiles.slug is
  'Stable profile lookup key for URLs/imports. This belongs to the header record, not a separate catalog-entry table.';
comment on column catalog.plant_profiles.short_description is
  'Deprecated for new writes; use catalog.plant_profile_narratives.short_description.';
comment on column catalog.plant_profiles.why_plant_it is
  'Deprecated for new writes; use catalog.plant_profile_narratives.why_plant_it.';
comment on column catalog.plant_profiles.pros_summary is
  'Deprecated for new writes; use catalog.plant_profile_narratives.pros_summary.';
comment on column catalog.plant_profiles.cons_summary is
  'Deprecated for new writes; use catalog.plant_profile_narratives.cons_summary.';
comment on column catalog.plant_profiles.primary_use_cases is
  'Deprecated for new writes; use catalog.plant_profile_narratives.primary_use_cases.';
comment on column catalog.plant_profiles.notes_for_homestead is
  'Deprecated for new writes; use catalog.plant_profile_narratives.notes_for_homestead.';
comment on column catalog.plant_profiles.notes_for_small_garden is
  'Deprecated for new writes; use catalog.plant_profile_narratives.notes_for_small_garden.';
comment on column catalog.plant_profiles.notes_for_container_growing is
  'Deprecated for new writes; use catalog.plant_profile_narratives.notes_for_container_growing.';
comment on column catalog.plant_profiles.evergreen_deciduous is
  'Deprecated for new writes; use catalog.plant_ornamental_profiles.evergreen_deciduous.';
comment on column catalog.plant_profiles.ornamental_season_interest is
  'Deprecated for new writes; use catalog.plant_ornamental_profiles.ornamental_season_interest.';
comment on column catalog.plant_profiles.visual_texture is
  'Deprecated for new writes; use catalog.plant_ornamental_profiles.visual_texture.';
comment on column catalog.plant_profiles.foliage_color is
  'Deprecated for new writes; use catalog.plant_ornamental_profiles.foliage_color.';
comment on column catalog.plant_profiles.evergreen_foliage is
  'Deprecated for new writes; use catalog.plant_ornamental_profiles.evergreen_foliage.';
comment on column catalog.plant_profiles.winter_interest is
  'Deprecated for new writes; use catalog.plant_ornamental_profiles.winter_interest.';
comment on column catalog.plant_profiles.beginner_friendliness is
  'Deprecated for new writes; use catalog.plant_profile_ratings.dimension_code = beginner_friendliness.';
comment on column catalog.plant_profiles.maintenance_level_code is
  'Deprecated for new writes; use catalog.plant_profile_ratings.dimension_code = maintenance_need.';
comment on column catalog.plant_profiles.deer_resistance is
  'Deprecated for new writes; use catalog.plant_profile_ratings.dimension_code = deer_resistance.';
comment on column catalog.plant_profiles.rabbit_resistance is
  'Deprecated for new writes; use catalog.plant_profile_ratings.dimension_code = rabbit_resistance.';

commit;
