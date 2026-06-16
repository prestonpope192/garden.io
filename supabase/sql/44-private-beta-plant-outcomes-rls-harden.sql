-- Garden.io private beta: harden plant-outcome write RLS (Phase 3C follow-up).
--
-- The original write policy (migration 43) only checked property ownership, so
-- an authenticated user could insert an outcome whose property_id they own but
-- whose plant_instance_id references another user's plant. Tighten the write
-- check so the plant instance must belong to the same (owned) property.
-- Additive + idempotent. Rollback: restore the property-only check from 43.

begin;

drop policy if exists garden_plant_outcomes_write_own on public.garden_plant_outcomes;
create policy garden_plant_outcomes_write_own
  on public.garden_plant_outcomes
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check (
    (select public.garden_user_owns_property(property_id))
    and exists (
      select 1
      from public.garden_plant_instances pi
      where pi.id = plant_instance_id
        and pi.property_id = garden_plant_outcomes.property_id
    )
  );

commit;
