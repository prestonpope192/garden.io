-- Waitlist table used by website/app/api/waitlist.
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;

-- Allow public website signups (insert only).
drop policy if exists "anon_insert_waitlist_signups" on public.waitlist_signups;
create policy "anon_insert_waitlist_signups"
  on public.waitlist_signups
  for insert
  to anon
  with check (true);
