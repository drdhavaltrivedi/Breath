-- Profiles: extended user data (synced with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  onboarding_complete boolean default false,
  notifications_enabled boolean default true,
  heart_rate_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Breathing sessions
create table if not exists public.breathing_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_title text not null,
  protocol text not null,
  duration_seconds integer not null,
  completed boolean not null default true,
  estimated_hr_reduction integer default 0,
  created_at timestamptz default now()
);

create index if not exists breathing_sessions_user_id_idx on public.breathing_sessions(user_id);
create index if not exists breathing_sessions_created_at_idx on public.breathing_sessions(created_at desc);

alter table public.breathing_sessions enable row level security;

create policy "Users can read own sessions"
  on public.breathing_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.breathing_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on public.breathing_sessions for delete
  using (auth.uid() = user_id);

-- Updated_at trigger for profiles
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
