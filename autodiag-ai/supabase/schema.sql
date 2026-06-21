-- AutoDiag AI — schéma Supabase (PostgreSQL)
-- À exécuter dans l'éditeur SQL de votre projet Supabase.

-- Table des véhicules sauvegardés par l'utilisateur
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  marque text not null,
  modele text not null,
  annee text,
  motorisation text,
  created_at timestamptz not null default now()
);

-- Table des diagnostics
create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  vehicle_id uuid references public.vehicles (id) on delete set null,
  vehicle_label text,
  symptome text not null,
  resultat jsonb not null,
  date timestamptz not null default now()
);

create index if not exists vehicles_user_idx on public.vehicles (user_id);
create index if not exists diagnostics_user_idx on public.diagnostics (user_id, date desc);

-- Row Level Security : chaque utilisateur ne voit que ses propres données.
alter table public.vehicles enable row level security;
alter table public.diagnostics enable row level security;

create policy "vehicles_owner" on public.vehicles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "diagnostics_owner" on public.diagnostics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Note : la table `users` (id, email, created_at) est gérée nativement par Supabase
-- dans le schéma `auth`. Inutile de la recréer.
