-- Add water source and water quality tracking for the private beta app.
--
-- The reading table is metric-row based so new strip, lab, or meter fields can
-- be added through metric definitions instead of schema rewrites.

begin;

create table if not exists catalog.water_quality_metrics (
  code text primary key,
  label text not null,
  category text not null,
  default_unit text,
  sort_order int not null default 100,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);

insert into catalog.water_quality_metrics (
  code,
  label,
  category,
  default_unit,
  sort_order,
  description
)
values
  ('ph', 'pH', 'general', 'pH', 10, 'Acidity or alkalinity of the water.'),
  ('hardness', 'Hardness', 'general', 'ppm', 20, 'Total hardness, typically driven by dissolved calcium and magnesium.'),
  ('alkalinity', 'Alkalinity', 'general', 'ppm', 30, 'Buffering capacity, usually reported as calcium carbonate equivalent.'),
  ('hydrogen_sulfide', 'Hydrogen Sulfide', 'sulfur', 'ppm', 40, 'Hydrogen sulfide level from strip, kit, lab, or meter result.'),
  ('iron', 'Iron', 'metals', 'ppm', 50, 'Dissolved or total iron level.'),
  ('copper', 'Copper', 'metals', 'ppm', 60, 'Copper level.'),
  ('lead', 'Lead', 'metals', 'ppb', 70, 'Lead level.'),
  ('manganese', 'Manganese', 'metals', 'ppm', 80, 'Manganese level.'),
  ('free_chlorine', 'Free Chlorine', 'treatment', 'ppm', 90, 'Free chlorine disinfectant residual.'),
  ('total_chlorine', 'Total Chlorine', 'treatment', 'ppm', 95, 'Total chlorine disinfectant residual.'),
  ('mercury', 'Mercury', 'metals', 'ppm', 100, 'Mercury level.'),
  ('nitrate', 'Nitrate', 'nutrients', 'ppm', 110, 'Nitrate level.'),
  ('nitrite', 'Nitrite', 'nutrients', 'ppm', 120, 'Nitrite level.'),
  ('sulfate', 'Sulfate', 'sulfur', 'ppm', 130, 'Sulfate level.'),
  ('zinc', 'Zinc', 'metals', 'ppm', 140, 'Zinc level.'),
  ('fluoride', 'Fluoride', 'treatment', 'ppm', 150, 'Fluoride level.'),
  ('sodium_chloride', 'Sodium Chloride', 'salinity', 'ppm', 160, 'Sodium chloride level from the base strip chart.'),
  ('total_dissolved_solids', 'Total Dissolved Solids', 'salinity', 'ppm', 170, 'Total dissolved solids.'),
  ('electrical_conductivity', 'Electrical Conductivity', 'salinity', 'mS/cm', 180, 'Electrical conductivity, useful for salinity tracking.'),
  ('sodium', 'Sodium', 'salinity', 'ppm', 190, 'Sodium level.'),
  ('chloride', 'Chloride', 'salinity', 'ppm', 200, 'Chloride level.'),
  ('bicarbonate', 'Bicarbonate', 'alkalinity', 'ppm', 210, 'Bicarbonate level.'),
  ('boron', 'Boron', 'micronutrients', 'ppm', 220, 'Boron level.'),
  ('calcium', 'Calcium', 'minerals', 'ppm', 230, 'Calcium level.'),
  ('magnesium', 'Magnesium', 'minerals', 'ppm', 240, 'Magnesium level.'),
  ('potassium', 'Potassium', 'nutrients', 'ppm', 250, 'Potassium level.'),
  ('total_coliform', 'Total Coliform', 'biology', 'presence_absence', 260, 'Total coliform result.'),
  ('e_coli', 'E. coli', 'biology', 'presence_absence', 270, 'E. coli result.'),
  ('turbidity', 'Turbidity', 'general', 'NTU', 280, 'Water clarity or turbidity.'),
  ('temperature', 'Temperature', 'general', 'F', 290, 'Water temperature at sample or test time.')
on conflict (code) do update
set label = excluded.label,
    category = excluded.category,
    default_unit = excluded.default_unit,
    sort_order = excluded.sort_order,
    description = excluded.description,
    updated_at = now();

create table if not exists public.garden_water_sources (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  name text not null,
  source_type text not null default 'other' check (
    source_type in (
      'municipal_tap',
      'well',
      'rainwater',
      'pond',
      'creek',
      'irrigation_system',
      'hose',
      'stored',
      'blended',
      'other'
    )
  ),
  provider text,
  location_label text,
  collection_point text,
  description text,
  is_active boolean not null default true,
  notes text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, property_id),
  unique (property_id, name)
);

create table if not exists public.garden_bed_water_source_assignments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  zone_id uuid not null,
  bed_id uuid not null,
  water_source_id uuid not null,
  assigned_on date not null default current_date,
  ended_on date,
  is_primary boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, property_id),
  constraint garden_bed_water_sources_zone_fk
    foreign key (zone_id, property_id)
    references public.garden_zones(id, property_id)
    on delete cascade,
  constraint garden_bed_water_sources_bed_fk
    foreign key (bed_id, property_id, zone_id)
    references public.garden_beds(id, property_id, zone_id)
    on delete cascade,
  constraint garden_bed_water_sources_source_fk
    foreign key (water_source_id, property_id)
    references public.garden_water_sources(id, property_id)
    on delete cascade,
  check (ended_on is null or assigned_on <= ended_on)
);

create table if not exists public.garden_water_quality_tests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  water_source_id uuid not null,
  tested_on date not null default current_date,
  collected_at timestamptz,
  test_method text not null default 'manual_entry' check (
    test_method in (
      'manual_entry',
      'test_strip',
      'lab_report',
      'meter',
      'image_upload',
      'ocr_image',
      'other'
    )
  ),
  lab_name text,
  result_image_url text,
  result_image_storage_path text,
  ocr_status text not null default 'not_requested' check (
    ocr_status in (
      'not_requested',
      'pending',
      'parsed',
      'needs_review',
      'failed'
    )
  ),
  ocr_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(ocr_payload) = 'object'),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, property_id),
  unique (id, property_id, water_source_id),
  constraint garden_water_quality_tests_source_fk
    foreign key (water_source_id, property_id)
    references public.garden_water_sources(id, property_id)
    on delete cascade,
  check (collected_at is null or collected_at::date <= tested_on)
);

create table if not exists public.garden_water_quality_readings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.garden_properties(id) on delete cascade,
  water_source_id uuid not null,
  water_quality_test_id uuid not null,
  metric_code text not null,
  value_numeric numeric(14,4),
  value_text text,
  unit text,
  qualifier text not null default 'exact' check (
    qualifier in (
      'exact',
      'approximate',
      'trace',
      'not_detected',
      'below_detection_limit',
      'above_range',
      'not_tested'
    )
  ),
  detection_limit numeric(14,4),
  raw_text text,
  notes text,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (water_quality_test_id, metric_code),
  constraint garden_water_quality_readings_metric_fk
    foreign key (metric_code)
    references catalog.water_quality_metrics(code),
  constraint garden_water_quality_readings_test_fk
    foreign key (water_quality_test_id, property_id, water_source_id)
    references public.garden_water_quality_tests(id, property_id, water_source_id)
    on delete cascade,
  check (
    value_numeric is not null
    or value_text is not null
    or qualifier in ('trace', 'not_detected', 'below_detection_limit', 'above_range', 'not_tested')
  )
);

create index if not exists garden_water_sources_property_active_idx
  on public.garden_water_sources(property_id, is_active, name);

create index if not exists garden_bed_water_source_assignments_bed_active_idx
  on public.garden_bed_water_source_assignments(property_id, bed_id, ended_on);

create unique index if not exists garden_bed_water_source_assignments_one_active_primary_idx
  on public.garden_bed_water_source_assignments(property_id, bed_id)
  where ended_on is null and is_primary = true;

create index if not exists garden_water_quality_tests_source_tested_idx
  on public.garden_water_quality_tests(property_id, water_source_id, tested_on desc);

create index if not exists garden_water_quality_readings_metric_idx
  on public.garden_water_quality_readings(property_id, metric_code, created_at desc);

drop trigger if exists trg_touch_updated_at on catalog.water_quality_metrics;
create trigger trg_touch_updated_at
before update on catalog.water_quality_metrics
for each row execute function core.touch_updated_at();

drop trigger if exists garden_water_sources_touch_updated_at on public.garden_water_sources;
create trigger garden_water_sources_touch_updated_at
  before update on public.garden_water_sources
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_bed_water_source_assignments_touch_updated_at on public.garden_bed_water_source_assignments;
create trigger garden_bed_water_source_assignments_touch_updated_at
  before update on public.garden_bed_water_source_assignments
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_water_quality_tests_touch_updated_at on public.garden_water_quality_tests;
create trigger garden_water_quality_tests_touch_updated_at
  before update on public.garden_water_quality_tests
  for each row execute function public.garden_touch_updated_at();

drop trigger if exists garden_water_quality_readings_touch_updated_at on public.garden_water_quality_readings;
create trigger garden_water_quality_readings_touch_updated_at
  before update on public.garden_water_quality_readings
  for each row execute function public.garden_touch_updated_at();

alter table public.garden_water_sources enable row level security;
alter table public.garden_bed_water_source_assignments enable row level security;
alter table public.garden_water_quality_tests enable row level security;
alter table public.garden_water_quality_readings enable row level security;

drop policy if exists garden_water_sources_select_own on public.garden_water_sources;
create policy garden_water_sources_select_own
  on public.garden_water_sources
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_water_sources_write_own on public.garden_water_sources;
create policy garden_water_sources_write_own
  on public.garden_water_sources
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_bed_water_source_assignments_select_own on public.garden_bed_water_source_assignments;
create policy garden_bed_water_source_assignments_select_own
  on public.garden_bed_water_source_assignments
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_bed_water_source_assignments_write_own on public.garden_bed_water_source_assignments;
create policy garden_bed_water_source_assignments_write_own
  on public.garden_bed_water_source_assignments
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_water_quality_tests_select_own on public.garden_water_quality_tests;
create policy garden_water_quality_tests_select_own
  on public.garden_water_quality_tests
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_water_quality_tests_write_own on public.garden_water_quality_tests;
create policy garden_water_quality_tests_write_own
  on public.garden_water_quality_tests
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_water_quality_readings_select_own on public.garden_water_quality_readings;
create policy garden_water_quality_readings_select_own
  on public.garden_water_quality_readings
  for select
  to authenticated
  using ((select public.garden_user_owns_property(property_id)));

drop policy if exists garden_water_quality_readings_write_own on public.garden_water_quality_readings;
create policy garden_water_quality_readings_write_own
  on public.garden_water_quality_readings
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check ((select public.garden_user_owns_property(property_id)));

grant select on catalog.water_quality_metrics to anon, authenticated;

grant select, insert, update, delete on
  public.garden_water_sources,
  public.garden_bed_water_source_assignments,
  public.garden_water_quality_tests,
  public.garden_water_quality_readings
to authenticated;

commit;
