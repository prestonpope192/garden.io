-- Seed Preston's July 6, 2025 shallow-well tap test-strip reading.
--
-- Values are inferred from user-supplied photos of a color-card test strip and
-- are stored as approximate field results, not lab-confirmed measurements.

begin;

do $$
begin
  if not exists (
    select 1
    from public.garden_properties
    where id = '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid
  ) then
    raise exception 'Expected Preston starter property is missing; apply the starter workbook import before shallow-well July 2025 water quality seed.';
  end if;
end $$;

insert into public.garden_water_sources (
  id,
  property_id,
  name,
  source_type,
  location_label,
  collection_point,
  description,
  is_active,
  notes,
  metadata
)
values (
  '84a95d99-cd36-5566-99a1-3f4c457111b0'::uuid,
  '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid,
  'Shallow Well Tap',
  'well',
  'Tap',
  'house tap',
  'Shallow well tap water that currently feeds most beds.',
  true,
  'User reported this shallow-well tap feeds almost all beds as of 2026-06-06. Bed-level source assignments were not seeded because the exceptions are not specified yet.',
  jsonb_build_object(
    'reported_feeds_most_beds', true,
    'reported_on', '2026-06-06'
  )
)
on conflict (property_id, name) do update
set source_type = excluded.source_type,
    location_label = excluded.location_label,
    collection_point = excluded.collection_point,
    description = excluded.description,
    is_active = excluded.is_active,
    notes = excluded.notes,
    metadata = public.garden_water_sources.metadata || excluded.metadata,
    updated_at = now();

with source as (
  select id
  from public.garden_water_sources
  where property_id = '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid
    and name = 'Shallow Well Tap'
)
insert into public.garden_water_quality_tests (
  id,
  property_id,
  water_source_id,
  tested_on,
  test_method,
  ocr_status,
  ocr_payload,
  notes
)
select
  '97029a29-525e-5cc5-96f0-9d307abe87bf'::uuid,
  '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid,
  source.id,
  '2025-07-06',
  'test_strip',
  'needs_review',
  jsonb_build_object(
    'source', 'user_supplied_photos',
    'photo_count', 7,
    'inference_method', 'visual color-card comparison',
    'confidence', 'medium',
    'photo_capture_time_local', '2025-07-06 16:44:52',
    'review_note', 'Color-card readings are approximate and should be treated as field estimates.'
  ),
  'Approximate shallow-well tap water quality readings inferred from seven user-supplied photos of a test strip captured on 2025-07-06.'
from source
on conflict (id) do update
set water_source_id = excluded.water_source_id,
    tested_on = excluded.tested_on,
    test_method = excluded.test_method,
    ocr_status = excluded.ocr_status,
    ocr_payload = excluded.ocr_payload,
    notes = excluded.notes,
    updated_at = now();

with source as (
  select id
  from public.garden_water_sources
  where property_id = '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid
    and name = 'Shallow Well Tap'
)
insert into public.garden_water_quality_readings (
  property_id,
  water_source_id,
  water_quality_test_id,
  metric_code,
  value_numeric,
  value_text,
  unit,
  qualifier,
  raw_text,
  notes,
  sort_order
)
select
  '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid,
  source.id,
  '97029a29-525e-5cc5-96f0-9d307abe87bf'::uuid,
  reading.metric_code,
  reading.value_numeric,
  reading.value_text,
  reading.unit,
  reading.qualifier,
  reading.raw_text,
  'Inferred from 2025-07-06 shallow-well tap test-strip photos; approximate color-card reading.',
  reading.sort_order
from (
  values
    ('ph', 6.0::numeric, null::text, 'pH', 'approximate', 'Red/orange pad; closest match around pH 6.0, possibly 6.0-6.5.', 10),
    ('hardness', 250::numeric, null::text, 'ppm', 'approximate', 'Purple-blue pad; closest match around 250 ppm, possibly 250-425 ppm.', 20),
    ('hydrogen_sulfide', 0::numeric, null::text, 'ppm', 'approximate', 'White pad; closest match 0 ppm.', 30),
    ('iron', 0::numeric, null::text, 'ppm', 'approximate', 'White pad; closest match 0 ppm.', 40),
    ('copper', 0.2::numeric, null::text, 'ppm', 'approximate', 'Light yellow/tan pad; closest match around 0.2 ppm.', 50),
    ('lead', 5::numeric, null::text, 'ppb', 'approximate', 'Yellow/gold pad; closest match around 5 ppb.', 60),
    ('manganese', 0.05::numeric, null::text, 'ppm', 'approximate', 'Yellow pad; closest match around 0.05 ppm.', 70),
    ('total_chlorine', 0.5::numeric, null::text, 'ppm', 'approximate', 'Very light yellow/tan pad; closest match around 0.5 ppm.', 80),
    ('mercury', 0.002::numeric, null::text, 'ppm', 'approximate', 'Pale lavender pad; closest match around 0.002 ppm.', 90),
    ('nitrate', 0::numeric, null::text, 'ppm', 'approximate', 'Nearly white pad; closest match 0 ppm, possibly below 10 ppm.', 100),
    ('nitrite', 0::numeric, null::text, 'ppm', 'approximate', 'White/off-white pad; closest match 0 ppm.', 110),
    ('sulfate', 200::numeric, null::text, 'ppm', 'approximate', 'Lavender-blue pad; closest match around 200 ppm, possibly 200-400 ppm.', 120),
    ('zinc', 10::numeric, null::text, 'ppm', 'approximate', 'Pink pad; closest match around 10 ppm, possibly 5-10 ppm.', 130),
    ('fluoride', 4::numeric, null::text, 'ppm', 'approximate', 'Red pad; closest match around 4 ppm, visually within the 0-4 ppm low range.', 140),
    ('sodium_chloride', 100::numeric, null::text, 'ppm', 'approximate', 'Orange-brown pad; closest match around 100 ppm.', 150),
    ('alkalinity', 0::numeric, null::text, 'ppm', 'approximate', 'Bright yellow pad; closest match 0 ppm, possibly below 40 ppm.', 160)
) as reading(metric_code, value_numeric, value_text, unit, qualifier, raw_text, sort_order)
cross join source
on conflict (water_quality_test_id, metric_code) do update
set value_numeric = excluded.value_numeric,
    value_text = excluded.value_text,
    unit = excluded.unit,
    qualifier = excluded.qualifier,
    raw_text = excluded.raw_text,
    notes = excluded.notes,
    sort_order = excluded.sort_order,
    updated_at = now();

commit;
