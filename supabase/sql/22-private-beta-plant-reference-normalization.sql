-- Normalize MVP plant instance records so user/property records reference the
-- catalogue plant record instead of duplicating plant names or slugs.

begin;

create extension if not exists pgcrypto;

alter table public.garden_catalog_plants
  add column if not exists id uuid default gen_random_uuid();

update public.garden_catalog_plants
set id = gen_random_uuid()
where id is null;

alter table public.garden_catalog_plants
  alter column id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_catalog_plants'::regclass
      and contype = 'u'
      and conname = 'garden_catalog_plants_slug_key'
  ) then
    alter table public.garden_catalog_plants
      add constraint garden_catalog_plants_slug_key unique (slug);
  end if;

  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_catalog_plants'::regclass
      and contype = 'p'
      and conkey = array[
        (
          select attnum
          from pg_attribute
          where attrelid = 'public.garden_catalog_plants'::regclass
            and attname = 'slug'
        )
      ]::smallint[]
  ) then
    alter table public.garden_catalog_plants
      drop constraint garden_catalog_plants_pkey cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_catalog_plants'::regclass
      and contype = 'p'
  ) then
    alter table public.garden_catalog_plants
      add constraint garden_catalog_plants_pkey primary key (id);
  end if;
end $$;

alter table public.garden_plant_instances
  add column if not exists plant_id uuid;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'garden_plant_instances'
      and column_name = 'plant_slug'
  ) then
    update public.garden_plant_instances pi
    set plant_id = cp.id
    from public.garden_catalog_plants cp
    where pi.plant_id is null
      and pi.plant_slug = cp.slug;
  end if;
end $$;

alter table public.garden_plant_instances
  alter column plant_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_plant_instances'::regclass
      and conname = 'garden_plant_instances_plant_id_fkey'
  ) then
    alter table public.garden_plant_instances
      add constraint garden_plant_instances_plant_id_fkey
      foreign key (plant_id) references public.garden_catalog_plants(id);
  end if;
end $$;

alter table public.garden_plant_instances
  drop column if exists plant_slug,
  drop column if exists plant_name;

create index if not exists garden_plant_instances_plant_id_idx
  on public.garden_plant_instances(plant_id);

alter table public.garden_wishlist
  add column if not exists plant_id uuid;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'garden_wishlist'
      and column_name = 'plant_slug'
  ) then
    update public.garden_wishlist w
    set plant_id = cp.id
    from public.garden_catalog_plants cp
    where w.plant_id is null
      and w.plant_slug = cp.slug;
  end if;
end $$;

alter table public.garden_wishlist
  alter column plant_id set not null;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_wishlist'::regclass
      and conname = 'garden_wishlist_owner_user_id_plant_slug_key'
  ) then
    alter table public.garden_wishlist
      drop constraint garden_wishlist_owner_user_id_plant_slug_key;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_wishlist'::regclass
      and conname = 'garden_wishlist_owner_user_id_plant_id_key'
  ) then
    alter table public.garden_wishlist
      add constraint garden_wishlist_owner_user_id_plant_id_key unique (owner_user_id, plant_id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.garden_wishlist'::regclass
      and conname = 'garden_wishlist_plant_id_fkey'
  ) then
    alter table public.garden_wishlist
      add constraint garden_wishlist_plant_id_fkey
      foreign key (plant_id) references public.garden_catalog_plants(id);
  end if;
end $$;

alter table public.garden_wishlist
  drop column if exists plant_slug,
  drop column if exists plant_name;

create index if not exists garden_wishlist_plant_id_idx
  on public.garden_wishlist(plant_id);

commit;
