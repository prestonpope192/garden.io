-- Merge plant-level propagation profile fields into method rows. Propagation
-- should be queried as method-specific records, not as a separate summary table
-- that duplicates possible methods.

begin;

alter table catalog.plant_propagation_methods
  add column if not exists proliferation_behavior text,
  add column if not exists self_seeds boolean,
  add column if not exists reseeding_intensity smallint check (reseeding_intensity between 0 and 10),
  add column if not exists spreads_by_runners boolean,
  add column if not exists spreads_by_rhizomes boolean,
  add column if not exists grafted_common boolean,
  add column if not exists seed_viability_duration_months int,
  add column if not exists germination_days_min int,
  add column if not exists germination_days_max int,
  add column if not exists cold_stratification_required boolean,
  add column if not exists scarification_required boolean,
  add column if not exists rooting_hormone_helpful boolean,
  add column if not exists transplant_shock_risk_code text references catalog.tolerance_levels(code),
  add column if not exists establishment_difficulty smallint check (establishment_difficulty between 0 and 10),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists version int not null default 1;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'catalog.plant_propagation_methods'::regclass
      and conname = 'plant_propagation_methods_germination_days_order'
  ) then
    alter table catalog.plant_propagation_methods
      add constraint plant_propagation_methods_germination_days_order
      check (germination_days_min is null or germination_days_max is null or germination_days_min <= germination_days_max);
  end if;
end $$;

drop trigger if exists trg_touch_updated_at on catalog.plant_propagation_methods;
create trigger trg_touch_updated_at
before update on catalog.plant_propagation_methods
for each row execute function core.touch_updated_at();

do $$
begin
  if to_regclass('catalog.plant_propagation_profiles') is not null then
    execute $sql$
      insert into catalog.plant_propagation_methods (
        plant_profile_id,
        planting_method_code,
        allowed,
        is_preferred,
        notes
      )
      select plant_profile_id, 'division', true, false, 'Division is marked possible for this plant.'
      from catalog.plant_propagation_profiles
      where division_possible = true
      on conflict (plant_profile_id, planting_method_code) do nothing;

      insert into catalog.plant_propagation_methods (
        plant_profile_id,
        planting_method_code,
        allowed,
        is_preferred,
        notes
      )
      select plant_profile_id, 'cutting', true, false, 'Cuttings are marked possible for this plant.'
      from catalog.plant_propagation_profiles
      where cutting_possible = true
      on conflict (plant_profile_id, planting_method_code) do nothing;

      insert into catalog.plant_propagation_methods (
        plant_profile_id,
        planting_method_code,
        allowed,
        is_preferred,
        notes
      )
      select plant_profile_id, 'grafted_tree', true, false, 'Grafting is common for this plant.'
      from catalog.plant_propagation_profiles
      where grafted_common = true
      on conflict (plant_profile_id, planting_method_code) do nothing;

      update catalog.plant_propagation_methods pm
      set proliferation_behavior = coalesce(pm.proliferation_behavior, pp.proliferation_behavior),
          self_seeds = coalesce(pm.self_seeds, pp.self_seeds),
          reseeding_intensity = coalesce(pm.reseeding_intensity, pp.reseeding_intensity),
          seed_viability_duration_months = coalesce(pm.seed_viability_duration_months, pp.seed_viability_duration_months),
          germination_days_min = coalesce(pm.germination_days_min, pp.germination_days_min),
          germination_days_max = coalesce(pm.germination_days_max, pp.germination_days_max),
          cold_stratification_required = coalesce(pm.cold_stratification_required, pp.cold_stratification_required),
          scarification_required = coalesce(pm.scarification_required, pp.scarification_required),
          establishment_difficulty = coalesce(pm.establishment_difficulty, pp.establishment_difficulty),
          updated_at = now()
      from catalog.plant_propagation_profiles pp
      where pm.plant_profile_id = pp.plant_profile_id
        and pm.planting_method_code in ('direct_sow', 'transplant_seedling');

      update catalog.plant_propagation_methods pm
      set proliferation_behavior = coalesce(pm.proliferation_behavior, pp.proliferation_behavior),
          spreads_by_runners = coalesce(pm.spreads_by_runners, pp.spreads_by_runners),
          spreads_by_rhizomes = coalesce(pm.spreads_by_rhizomes, pp.spreads_by_rhizomes),
          transplant_shock_risk_code = coalesce(pm.transplant_shock_risk_code, pp.transplant_shock_risk_code),
          establishment_difficulty = coalesce(pm.establishment_difficulty, pp.establishment_difficulty),
          updated_at = now()
      from catalog.plant_propagation_profiles pp
      where pm.plant_profile_id = pp.plant_profile_id
        and pm.planting_method_code in ('division', 'crown', 'rhizome', 'bare_root', 'tuber', 'bulb');

      update catalog.plant_propagation_methods pm
      set proliferation_behavior = coalesce(pm.proliferation_behavior, pp.proliferation_behavior),
          rooting_hormone_helpful = coalesce(pm.rooting_hormone_helpful, pp.rooting_hormone_helpful),
          transplant_shock_risk_code = coalesce(pm.transplant_shock_risk_code, pp.transplant_shock_risk_code),
          establishment_difficulty = coalesce(pm.establishment_difficulty, pp.establishment_difficulty),
          updated_at = now()
      from catalog.plant_propagation_profiles pp
      where pm.plant_profile_id = pp.plant_profile_id
        and pm.planting_method_code = 'cutting';

      update catalog.plant_propagation_methods pm
      set proliferation_behavior = coalesce(pm.proliferation_behavior, pp.proliferation_behavior),
          grafted_common = coalesce(pm.grafted_common, pp.grafted_common),
          transplant_shock_risk_code = coalesce(pm.transplant_shock_risk_code, pp.transplant_shock_risk_code),
          establishment_difficulty = coalesce(pm.establishment_difficulty, pp.establishment_difficulty),
          updated_at = now()
      from catalog.plant_propagation_profiles pp
      where pm.plant_profile_id = pp.plant_profile_id
        and pm.planting_method_code = 'grafted_tree';
    $sql$;
  end if;
end $$;

create index if not exists idx_plant_propagation_methods_profile_preferred
  on catalog.plant_propagation_methods(plant_profile_id, is_preferred desc, planting_method_code);

drop table if exists catalog.plant_propagation_profiles;

commit;
