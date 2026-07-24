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

-- Public Storage bucket for scan photos + sketches
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'scans',
  'scans',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read scan images" on storage.objects;
create policy "Public read scan images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'scans');

-- Workshop waitlist (writes via service role in /api/waitlist)
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

alter table public.waitlist enable row level security;
