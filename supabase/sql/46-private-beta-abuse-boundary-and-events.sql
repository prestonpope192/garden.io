-- Garden.io private beta: shared abuse controls, product events, and tenant-safe
-- observation/task writes. Additive and idempotent; no existing rows are changed.

begin;

create table if not exists public.garden_rate_limits (
  rate_limit_key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  updated_at timestamptz not null default now()
);

create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_window public.garden_rate_limits%rowtype;
begin
  if p_key is null or length(trim(p_key)) = 0 or p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  insert into public.garden_rate_limits (rate_limit_key, window_started_at, request_count)
  values (p_key, now(), 1)
  on conflict (rate_limit_key) do update
    set request_count = case
      when public.garden_rate_limits.window_started_at + make_interval(secs => p_window_seconds) <= now()
        then 1
      else public.garden_rate_limits.request_count + 1
    end,
    window_started_at = case
      when public.garden_rate_limits.window_started_at + make_interval(secs => p_window_seconds) <= now()
        then now()
      else public.garden_rate_limits.window_started_at
    end,
    updated_at = now()
  returning * into current_window;

  return current_window.request_count <= p_limit;
end;
$$;

revoke all on table public.garden_rate_limits from anon, authenticated;
revoke all on function public.consume_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to anon, authenticated;

create table if not exists public.garden_product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null check (event_name in (
    'app_opened',
    'observation_saved',
    'care_task_added',
    'care_task_completed',
    'diagnosis_saved'
  )),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists garden_product_events_user_time_idx
  on public.garden_product_events(user_id, occurred_at desc);

alter table public.garden_product_events enable row level security;

drop policy if exists garden_product_events_select_own on public.garden_product_events;
create policy garden_product_events_select_own
  on public.garden_product_events
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists garden_product_events_insert_own on public.garden_product_events;
create policy garden_product_events_insert_own
  on public.garden_product_events
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

grant select, insert on public.garden_product_events to authenticated;

drop policy if exists garden_observations_write_own on public.garden_observations;
create policy garden_observations_write_own
  on public.garden_observations
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check (
    (select public.garden_user_owns_property(property_id))
    and (
      plant_instance_id is null
      or exists (
        select 1
        from public.garden_plant_instances pi
        where pi.id = garden_observations.plant_instance_id
          and pi.property_id = garden_observations.property_id
      )
    )
  );

drop policy if exists garden_tasks_write_own on public.garden_tasks;
create policy garden_tasks_write_own
  on public.garden_tasks
  for all
  to authenticated
  using ((select public.garden_user_owns_property(property_id)))
  with check (
    (select public.garden_user_owns_property(property_id))
    and (
      plant_instance_id is null
      or exists (
        select 1
        from public.garden_plant_instances pi
        where pi.id = garden_tasks.plant_instance_id
          and pi.property_id = garden_tasks.property_id
      )
    )
  );

commit;
