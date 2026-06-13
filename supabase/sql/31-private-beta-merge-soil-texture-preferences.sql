-- Merge soil texture preference rows into catalog.plant_soil_profiles so each
-- plant has a single soil section with structured texture preferences.

begin;

alter table catalog.plant_soil_profiles
  add column if not exists texture_preferences jsonb not null default '{}'::jsonb,
  add column if not exists preferred_soil_texture_codes text[] not null default '{}',
  add column if not exists soil_texture_summary text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'catalog.plant_soil_profiles'::regclass
      and conname = 'plant_soil_profiles_texture_preferences_object'
  ) then
    alter table catalog.plant_soil_profiles
      add constraint plant_soil_profiles_texture_preferences_object
      check (jsonb_typeof(texture_preferences) = 'object');
  end if;
end $$;

do $$
begin
  if to_regclass('catalog.plant_soil_texture_preferences') is not null then
    execute $sql$
      with migrated as (
        select
          plant_profile_id,
          jsonb_object_agg(
            soil_type_code,
            jsonb_build_object('preference_level', preference_level)
            order by preference_level desc, soil_type_code
          ) as texture_preferences,
          array_agg(soil_type_code order by preference_level desc, soil_type_code) as preferred_soil_texture_codes
        from catalog.plant_soil_texture_preferences
        group by plant_profile_id
      )
      update catalog.plant_soil_profiles sp
      set texture_preferences = migrated.texture_preferences,
          preferred_soil_texture_codes = migrated.preferred_soil_texture_codes,
          soil_texture_summary = case
            when cardinality(migrated.preferred_soil_texture_codes) > 0
            then 'Texture preferences, highest first: ' || array_to_string(migrated.preferred_soil_texture_codes, ', ')
            else sp.soil_texture_summary
          end,
          updated_at = now()
      from migrated
      where sp.plant_profile_id = migrated.plant_profile_id
    $sql$;
  end if;
end $$;

create index if not exists idx_plant_soil_profiles_texture_preferences
  on catalog.plant_soil_profiles using gin (texture_preferences);

create index if not exists idx_plant_soil_profiles_texture_codes
  on catalog.plant_soil_profiles using gin (preferred_soil_texture_codes);

drop table if exists catalog.plant_soil_texture_preferences;

commit;
