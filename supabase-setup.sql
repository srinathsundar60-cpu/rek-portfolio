-- ══════════════════════════════════════════════════════════════
-- REK Portfolio — Full Database Setup
-- Run this in: https://supabase.com/dashboard/project/dfphgwoaklhdmbyaktdn/sql/new
-- ══════════════════════════════════════════════════════════════

-- ── 1. PRODUCTS TABLE ──────────────────────────────────────────
create table if not exists public.products (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  description text        not null,
  image_url   text        not null,
  product_url text        not null,
  visible     boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at();

-- Row Level Security
alter table public.products enable row level security;

-- Public visitors: read ONLY visible products (no hidden products downloaded)
drop policy if exists "public_read_visible" on public.products;
create policy "public_read_visible"
  on public.products for select
  using (visible = true);

-- Authenticated admins: full CRUD
drop policy if exists "admin_full_access" on public.products;
create policy "admin_full_access"
  on public.products for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ── 2. ADMIN PROFILES TABLE ────────────────────────────────────
create table if not exists public.admin_profiles (
  id         uuid        primary key,
  name       text        not null,
  email      text        not null unique,
  role       text        not null default 'admin',
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.admin_profiles enable row level security;

-- Authenticated admins: read all profiles
drop policy if exists "admin_read_profiles" on public.admin_profiles;
create policy "admin_read_profiles"
  on public.admin_profiles for select
  using (auth.role() = 'authenticated');

-- Authenticated admins: full CRUD on profiles
drop policy if exists "admin_manage_profiles" on public.admin_profiles;
create policy "admin_manage_profiles"
  on public.admin_profiles for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
