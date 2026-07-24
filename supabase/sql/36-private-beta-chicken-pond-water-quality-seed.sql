-- Seed Preston's chicken pond water source and June 6, 2026 test-strip reading.
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
    raise exception 'Expected Preston starter property is missing; apply the starter workbook import before chicken pond water quality seed.';
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
  'e8156ac8-d248-5ef2-9903-9a62b7b54322'::uuid,
  '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid,
  'Chicken Pond',
  'pond',
  'Chicken area',
  'pond edge',
  'Chicken pond surface water source.',
  true,
  'User supplied chicken pond color-card test-strip photos on 2026-06-06. Several pads were visibly affected by suspended organic material, so readings are approximate.',
  jsonb_build_object(
    'reported_on', '2026-06-06',
    'sample_context', 'chicken pond',
    'organic_sediment_visible', true
  )
)
on conflict (property_id, name) do update
set source_type = excluded.source_type,
    location_label = excluded.location_label,
    collection_point = excluded.collection_point,
    description = excluded.description,
    is_active = excluded.is_active,
    notes = excluded.notes,
    metadata = excluded.metadata,
    updated_at = now();

with source as (
  select id
  from public.garden_water_sources
  where property_id = '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid
    and name = 'Chicken Pond'
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
  'd0cda11f-62a2-5a2a-9191-d41adf426288'::uuid,
  '03a80383-00a3-5d5c-b0c9-c8f8b1ef4c2e'::uuid,
  source.id,
  '2026-06-06',
  'test_strip',
  'needs_review',
  jsonb_build_object(
    'source', 'user_supplied_photos',
    'photo_count', 7,
    'inference_method', 'visual color-card comparison',
    'confidence', 'medium_low',
    'review_note', 'Color-card readings are approximate; organic/sediment staining makes several middle pads harder to read.'
  ),
  'Approximate chicken pond water quality readings inferred from seven user-supplied photos of a test strip on 2026-06-06.'
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
    and name = 'Chicken Pond'
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
  'd0cda11f-62a2-5a2a-9191-d41adf426288'::uuid,
  reading.metric_code,
  reading.value_numeric,
  reading.value_text,
  reading.unit,
  reading.qualifier,
  reading.raw_text,
  'Inferred from 2026-06-06 chicken pond test-strip photos; approximate color-card reading with visible sediment/organic staining.',
  reading.sort_order
from (
  values
    ('ph', 6.5::numeric, null::text, 'pH', 'approximate', 'Orange-red pad; closest match around pH 6.5, possibly 6.0-7.0.', 10),
    ('hardness', 100::numeric, null::text, 'ppm', 'approximate', 'Blue/teal pad; closest match around 100 ppm, possibly 50-100 ppm.', 20),
    ('hydrogen_sulfide', 0::numeric, null::text, 'ppm', 'approximate', 'Very light pad; closest match 0 ppm, sediment staining present.', 30),
    ('iron', 0::numeric, null::text, 'ppm', 'approximate', 'Very light pad; closest match 0 ppm, sediment staining present.', 40),
    ('copper', 0.2::numeric, null::text, 'ppm', 'approximate', 'Yellow/tan pad; closest match around 0.2 ppm.', 50),
    ('lead', 5::numeric, null::text, 'ppb', 'approximate', 'Yellow/orange pad; closest match around 5 ppb, possibly below 15 ppb.', 60),
    ('manganese', 0.05::numeric, null::text, 'ppm', 'approximate', 'Yellow pad; closest match around 0.05 ppm.', 70),
    ('total_chlorine', 0.5::numeric, null::text, 'ppm', 'approximate', 'Very light tan pad; closest match around 0.5 ppm.', 80),
    ('mercury', 0.002::numeric, null::text, 'ppm', 'approximate', 'Very pale pad; closest match around 0.002 ppm, possibly 0.', 90),
    ('nitrate', 0::numeric, null::text, 'ppm', 'approximate', 'Light/dirty white pad; closest match 0 ppm, possibly below 10 ppm.', 100),
    ('nitrite', 0::numeric, null::text, 'ppm', 'approximate', 'Light/dirty white pad; closest match 0 ppm.', 110),
    ('sulfate', 200::numeric, null::text, 'ppm', 'approximate', 'Gray/lavender-blue pad; closest match around 200 ppm, possibly 200-400 ppm.', 120),
    ('zinc', 5::numeric, null::text, 'ppm', 'approximate', 'Red/pink pad; closest match around 5 ppm, possibly 5-10 ppm.', 130),
    ('fluoride', 4::numeric, null::text, 'ppm', 'approximate', 'Red pad; closest match around 4 ppm, possibly 0-4 ppm.', 140),
    ('sodium_chloride', 100::numeric, null::text, 'ppm', 'approximate', 'Orange-brown pad; closest match around 100 ppm, possibly 100-250 ppm.', 150),
    ('alkalinity', 120::numeric, null::text, 'ppm', 'approximate', 'Green pad; closest match around 120 ppm, possibly 120-180 ppm.', 160)
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
