-- Finish-line validation for migration 46. Read-only assertions.

do $$
begin
  if to_regclass('public.garden_rate_limits') is null then
    raise exception 'garden_rate_limits is missing';
  end if;
  if to_regclass('public.garden_product_events') is null then
    raise exception 'garden_product_events is missing';
  end if;
  if to_regprocedure('public.consume_rate_limit(text,integer,integer)') is null then
    raise exception 'consume_rate_limit function is missing';
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'garden_observations'
      and policyname = 'garden_observations_write_own'
      and with_check like '%plant_instance_id%'
  ) then
    raise exception 'observation write policy is not tenant-safe';
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'garden_tasks'
      and policyname = 'garden_tasks_write_own'
      and with_check like '%plant_instance_id%'
  ) then
    raise exception 'task write policy is not tenant-safe';
  end if;
end;
$$;

select 'migration-46-validation-passed' as result;
