-- Lift the Lid public gallery schema
-- Run in Supabase SQL editor, then create a public Storage bucket named "scans".

create extension if not exists "pgcrypto";

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  story jsonb not null,
  image_path text not null,
  sketch_path text,
  hidden boolean not null default false
);

create index if not exists scans_created_at_idx on public.scans (created_at desc);
create index if not exists scans_hidden_idx on public.scans (hidden);

alter table public.scans enable row level security;

-- Public read of visible scans only (anon key). Writes go through service role.
drop policy if exists "Public can read visible scans" on public.scans;
create policy "Public can read visible scans"
  on public.scans
  for select
  to anon, authenticated
  using (hidden = false);

-- Storage: create bucket "scans" as public in Dashboard.
-- Suggested policies (adjust as needed):
-- - public SELECT on storage.objects where bucket_id = 'scans'
-- - service role handles INSERT/UPDATE/DELETE
