-- Garden.io private beta: photo capture for observations (Phase 3A).
--
-- Adds an image path to observations and a PRIVATE storage bucket with
-- owner-scoped RLS (path convention: <user_id>/<file>). Photos are personal —
-- access is restricted to the owning user. Additive + idempotent.
-- Rollback: drop column; drop policies; delete bucket (if empty).

begin;

alter table public.garden_observations add column if not exists image_path text;

-- Private bucket for personal garden media.
insert into storage.buckets (id, name, public)
values ('garden-media', 'garden-media', false)
on conflict (id) do nothing;

-- Owner-scoped RLS on storage.objects for this bucket. The first path segment
-- must equal the authenticated user's id.
drop policy if exists garden_media_select_own on storage.objects;
create policy garden_media_select_own on storage.objects
  for select to authenticated
  using (bucket_id = 'garden-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists garden_media_insert_own on storage.objects;
create policy garden_media_insert_own on storage.objects
  for insert to authenticated
  with check (bucket_id = 'garden-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists garden_media_delete_own on storage.objects;
create policy garden_media_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'garden-media' and (storage.foldername(name))[1] = auth.uid()::text);

commit;
