-- Garden.io private beta: plant phenology (timing) for the published catalogue.
--
-- Adds days-to-maturity + planting/harvest window guidance so the app can show
-- real lifecycle stages, harvest readiness, and data-driven task suggestions
-- instead of type-only heuristics. Values are curated for the 25 published
-- plants; plants without a row degrade gracefully (null = unknown timing).
-- Additive + idempotent. Rollback: drop table catalog.plant_phenology_profiles.

begin;

create table if not exists catalog.plant_phenology_profiles (
  id uuid primary key default gen_random_uuid(),
  plant_profile_id uuid not null unique references catalog.plant_profiles(id) on delete cascade,
  days_to_maturity_min integer,
  days_to_maturity_max integer,
  maturity_basis text,                 -- transplant | direct_sow | perennial
  planting_window_label text,
  harvest_window_label text,
  perennial_first_harvest_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create temporary table _pheno (
  slug text primary key,
  d_min integer,
  d_max integer,
  basis text,
  planting_label text,
  harvest_label text,
  first_harvest_label text
) on commit drop;

insert into _pheno (slug, d_min, d_max, basis, planting_label, harvest_label, first_harvest_label) values
  ('acanthus', null, null, 'perennial', 'Plant in spring or fall', null, 'Flower spikes from year 2, early summer'),
  ('beautyberry', null, null, 'perennial', 'Plant in fall or early spring', null, 'Berry clusters from year 2, fall'),
  ('bee-balm', null, null, 'perennial', 'Plant in spring', null, 'First blooms summer; fuller in year 2'),
  ('blackberry', null, null, 'perennial', 'Plant dormant canes late winter–early spring', null, 'Fruits in year 2, mid-summer'),
  ('blueberry', null, null, 'perennial', 'Plant in early spring or fall', null, 'Light fruit year 2–3, summer'),
  ('borage', 50, 60, 'direct_sow', 'Direct-sow after last frost', 'Leaves and flowers ~7–8 weeks from sowing', null),
  ('bouquet-dill', 40, 55, 'direct_sow', 'Direct-sow after last frost; succession to midsummer', 'Leaves 6–8 weeks; seed heads ~10 weeks', null),
  ('calendula', 45, 60, 'direct_sow', 'Sow early spring (or fall in mild zones)', 'Cut-and-come blooms from ~7 weeks', null),
  ('cherokee-purple-tomato', 75, 90, 'transplant', 'Transplant after last frost, soil above 60°F', 'Slicing fruit 75–90 days from transplant, late summer', null),
  ('chives', null, null, 'perennial', 'Plant in spring', null, 'Snip lightly first season; full clumps year 2'),
  ('comfrey', null, null, 'perennial', 'Plant root cuttings in spring', null, 'Chop-and-drop leaves from late spring, year 1'),
  ('dill', 40, 55, 'direct_sow', 'Direct-sow after last frost; succession-sow', 'Leaves 6–8 weeks; seed ~10 weeks', null),
  ('garlic-hardneck', 240, 270, 'direct_sow', 'Plant cloves in fall, 4–6 weeks before hard frost', 'Scapes late spring; bulbs early–mid summer', null),
  ('genovese-basil', 60, 75, 'transplant', 'Transplant after last frost into warm soil', 'Pinch leaves from ~6 weeks, all summer', null),
  ('hellebores', null, null, 'perennial', 'Plant in fall or early spring', null, 'Blooms late winter; established by year 2'),
  ('japanese-maple', null, null, 'perennial', 'Plant dormant in fall or early spring', null, 'Grown for foliage; fall color each year'),
  ('jerusalem-artichoke-sunchoke', null, null, 'perennial', 'Plant tubers in early spring', null, 'Dig tubers after first frost, fall of year 1'),
  ('mammoth-dill', 45, 60, 'direct_sow', 'Direct-sow after last frost', 'Leaves earlier; broad seed heads ~10 weeks', null),
  ('meyer-lemon', null, null, 'perennial', 'Plant in spring (or year-round in containers)', null, 'Fruit year 2–3, ripening late fall–winter'),
  ('nasturtium', 50, 65, 'direct_sow', 'Direct-sow after last frost into lean soil', 'Flowers and leaves ~7–9 weeks', null),
  ('pawpaw-mango', null, null, 'perennial', 'Plant in spring; shade young trees', null, 'Fruit in year 4–7, early fall'),
  ('pecan', null, null, 'perennial', 'Plant dormant in late winter', null, 'Nuts in year 6–10, fall'),
  ('raspberry', null, null, 'perennial', 'Plant dormant canes early spring or fall', null, 'Fruit year 2 (or first fall on everbearers), summer'),
  ('scarlet-runner-bean', 65, 80, 'direct_sow', 'Direct-sow after last frost', 'Pods from ~9–11 weeks', null),
  ('strawberry', null, null, 'perennial', 'Plant in early spring or fall', null, 'Fruit late spring–early summer; heavier year 2');

insert into catalog.plant_phenology_profiles (
  id, plant_profile_id, days_to_maturity_min, days_to_maturity_max, maturity_basis,
  planting_window_label, harvest_window_label, perennial_first_harvest_label, created_at, updated_at, version
)
select gen_random_uuid(), p.id, x.d_min, x.d_max, x.basis,
       x.planting_label, x.harvest_label, x.first_harvest_label, now(), now(), 1
from _pheno x
join catalog.plant_profiles p on p.slug = x.slug
on conflict (plant_profile_id) do update
set days_to_maturity_min = excluded.days_to_maturity_min,
    days_to_maturity_max = excluded.days_to_maturity_max,
    maturity_basis = excluded.maturity_basis,
    planting_window_label = excluded.planting_window_label,
    harvest_window_label = excluded.harvest_window_label,
    perennial_first_harvest_label = excluded.perennial_first_harvest_label,
    updated_at = now();

commit;

-- Verification:
-- select count(*) from catalog.plant_phenology_profiles;  -- expect 25
