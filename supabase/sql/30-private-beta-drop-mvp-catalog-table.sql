-- Retire the temporary public.garden_catalog_plants table. User garden records
-- should reference catalog.plant_profiles directly.

begin;

alter table public.garden_plant_instances
  add column if not exists plant_profile_id uuid;

alter table public.garden_wishlist
  add column if not exists plant_profile_id uuid;

do $$
begin
  if to_regclass('public.garden_catalog_plants') is not null then
    execute $sql$
      create temp table garden_catalog_retire_source on commit drop as
      select
        gen_random_uuid() as taxon_id,
        gen_random_uuid() as profile_id,
        cp.slug,
        cp.common_name,
        cp.latin_name,
        nullif(cp.family, 'Imported starter catalogue') as known_family,
        cp.summary,
        cp.fit_for,
        cp.public_note,
        cp.tags
      from public.garden_catalog_plants cp
      where not exists (
        select 1
        from catalog.plant_profiles p
        where p.slug = cp.slug
          and p.deleted_at is null
      );

      insert into catalog.plant_taxa (
        id,
        family_name,
        genus_name,
        species_name,
        botanical_name_full,
        taxon_rank,
        origin_type
      )
      select
        taxon_id,
        known_family,
        case
          when latin_name <> 'Unknown' and latin_name ~ '^[A-Z][A-Za-z-]+ [a-z]' then split_part(latin_name, ' ', 1)
          else replace(slug, '-', '_')
        end,
        case
          when latin_name <> 'Unknown' and latin_name ~ '^[A-Z][A-Za-z-]+ [a-z]' then split_part(latin_name, ' ', 2)
          else null
        end,
        case when latin_name <> 'Unknown' then latin_name else common_name end,
        case when latin_name <> 'Unknown' and latin_name ~ '^[A-Z][A-Za-z-]+ [a-z]' then 'species' else 'unknown' end,
        'unknown'
      from garden_catalog_retire_source;

      insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)
      select taxon_id, common_name, 'common', 'en', true
      from garden_catalog_retire_source
      on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update
      set is_primary = excluded.is_primary,
          updated_at = now();

      insert into catalog.plant_profiles (
        id,
        plant_taxon_id,
        slug,
        display_name,
        plant_type_code,
        lifecycle_type,
        generation_status,
        is_published,
        review_status,
        evidence_count,
        source_count,
        human_verified
      )
      select
        profile_id,
        taxon_id,
        slug,
        common_name,
        case
          when tags && array['Tree', 'Fruit tree', 'Orchard'] or common_name ~* '(apple|pecan|peach|plum|pear|fig|persimmon)' then 'tree'
          when tags && array['Shrub', 'Berry'] or common_name ~* '(berry|currant|gooseberry|viburnum|azalea|beautyberry)' then 'shrub'
          when common_name ~* '(clematis|vine|grape|runner)' then 'vine'
          when common_name ~* '(fern)' then 'fern'
          when tags && array['Herb'] or common_name ~* '(basil|dill|mint|sage|thyme|oregano)' then 'herb'
          when tags && array['Groundcover'] or common_name ~* '(ajuga|groundcover|clover)' then 'groundcover'
          when tags && array['Vegetable'] or common_name ~* '(tomato|garlic|bean|pepper|okra)' then 'vegetable'
          else 'forb'
        end,
        'unknown',
        'community_generated',
        false,
        'draft',
        0,
        0,
        false
      from garden_catalog_retire_source;

      insert into catalog.plant_profile_narratives (
        plant_profile_id,
        locale,
        short_description,
        why_plant_it,
        primary_use_cases
      )
      select profile_id, 'en', summary, public_note, fit_for
      from garden_catalog_retire_source
      where summary is not null
         or public_note is not null
         or fit_for is not null
      on conflict (plant_profile_id, locale) do update
      set short_description = excluded.short_description,
          why_plant_it = excluded.why_plant_it,
          primary_use_cases = excluded.primary_use_cases,
          updated_at = now();
    $sql$;
  end if;
end $$;

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
    update public.garden_plant_instances pi
    set plant_profile_id = cp.catalog_plant_profile_id,
        updated_at = now()
    from public.garden_catalog_plants cp
    where pi.plant_id = cp.id
      and pi.plant_profile_id is distinct from cp.catalog_plant_profile_id;

    update public.garden_wishlist w
    set plant_profile_id = cp.catalog_plant_profile_id,
        updated_at = now()
    from public.garden_catalog_plants cp
    where w.plant_id = cp.id
      and w.plant_profile_id is distinct from cp.catalog_plant_profile_id;
  end if;
end $$;

alter table public.garden_plant_instances
  alter column plant_profile_id set not null;

alter table public.garden_wishlist
  alter column plant_profile_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_plant_instances'::regclass
      and conname = 'garden_plant_instances_plant_profile_id_fkey'
  ) then
    alter table public.garden_plant_instances
      add constraint garden_plant_instances_plant_profile_id_fkey
      foreign key (plant_profile_id) references catalog.plant_profiles(id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_wishlist'::regclass
      and conname = 'garden_wishlist_plant_profile_id_fkey'
  ) then
    alter table public.garden_wishlist
      add constraint garden_wishlist_plant_profile_id_fkey
      foreign key (plant_profile_id) references catalog.plant_profiles(id);
  end if;
end $$;

create index if not exists garden_plant_instances_plant_profile_id_idx
  on public.garden_plant_instances(plant_profile_id);

create index if not exists garden_wishlist_plant_profile_id_idx
  on public.garden_wishlist(plant_profile_id);

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_wishlist'::regclass
      and conname = 'garden_wishlist_owner_user_id_plant_id_key'
  ) then
    alter table public.garden_wishlist
      drop constraint garden_wishlist_owner_user_id_plant_id_key;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_wishlist'::regclass
      and conname = 'garden_wishlist_owner_user_id_plant_profile_id_key'
  ) then
    alter table public.garden_wishlist
      add constraint garden_wishlist_owner_user_id_plant_profile_id_key
      unique (owner_user_id, plant_profile_id);
  end if;

  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_plant_instances'::regclass
      and conname = 'garden_plant_instances_plant_id_fkey'
  ) then
    alter table public.garden_plant_instances
      drop constraint garden_plant_instances_plant_id_fkey;
  end if;

  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_wishlist'::regclass
      and conname = 'garden_wishlist_plant_id_fkey'
  ) then
    alter table public.garden_wishlist
      drop constraint garden_wishlist_plant_id_fkey;
  end if;
end $$;

drop index if exists public.garden_plant_instances_plant_id_idx;
drop index if exists public.garden_wishlist_plant_id_idx;

alter table public.garden_plant_instances
  drop column if exists plant_id;

alter table public.garden_wishlist
  drop column if exists plant_id;

drop table if exists public.garden_catalog_plants cascade;

commit;
