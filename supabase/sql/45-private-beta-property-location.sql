-- Garden.io private beta: property geolocation for WeatherIQ (Phase: frost alerts).
--
-- Adds optional coordinates to a property so WeatherIQ can fetch a local frost
-- forecast. Set once (geocoded from a town/ZIP the grower enters). Additive +
-- idempotent. Rollback: drop the three columns.

begin;

alter table public.garden_properties
  add column if not exists latitude numeric(8, 5),
  add column if not exists longitude numeric(8, 5),
  add column if not exists location_label text;

commit;
