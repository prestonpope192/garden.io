-- Garden.io private beta: plot geometry for the draggable My Property map.
--
-- Adds normalized layout coordinates so growers can arrange zones on the
-- property canvas and beds within their zone to mirror the real garden.
-- All columns nullable → views without geometry fall back to the auto-grid.
-- Additive + idempotent. Rollback: drop the columns.

begin;

alter table public.garden_zones add column if not exists layout_x numeric;
alter table public.garden_zones add column if not exists layout_y numeric;
alter table public.garden_zones add column if not exists layout_w numeric;
alter table public.garden_zones add column if not exists layout_h numeric;

alter table public.garden_beds add column if not exists layout_x numeric;
alter table public.garden_beds add column if not exists layout_y numeric;
alter table public.garden_beds add column if not exists layout_w numeric;
alter table public.garden_beds add column if not exists layout_h numeric;

commit;
