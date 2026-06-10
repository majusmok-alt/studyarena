-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ StudyArena — PostgreSQL schema for Supabase                                ║
-- ║ Run in the Supabase SQL editor. Row Level Security is enabled throughout.  ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

create extension if not exists "pgcrypto";

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text unique not null,
  avatar_url    text,
  country       text not null default 'DE',
  rating        integer not null default 0,
  xp            integer not null default 0,
  coins         integer not null default 0,
  streak        integer not null default 0,
  longest_streak integer not null default 0,
  total_minutes integer not null default 0,
  wins          integer not null default 0,
  losses        integer not null default 0,
  frame         text not null default 'default',
  last_study_date date,
  created_at    timestamptz not null default now()
);

-- ── Study sessions ────────────────────────────────────────────────────────────
create table if not exists public.study_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  subject       text not null,
  custom_subject text,
  minutes       integer not null,
  xp_earned     integer not null default 0,
  coins_earned  integer not null default 0,
  rating_delta  integer not null default 0,
  started_at    timestamptz not null,
  ended_at      timestamptz not null default now()
);
create index if not exists study_sessions_user_idx on public.study_sessions (user_id, ended_at desc);

-- ── Battles ───────────────────────────────────────────────────────────────────
create type battle_type   as enum ('focus', 'daily', 'tournament');
create type battle_status as enum ('pending', 'active', 'completed');

create table if not exists public.battles (
  id            uuid primary key default gen_random_uuid(),
  type          battle_type not null,
  status        battle_status not null default 'pending',
  subject       text not null,
  duration_min  integer not null default 0,
  challenger_id uuid not null references public.profiles (id) on delete cascade,
  opponent_id   uuid references public.profiles (id) on delete cascade,
  challenger_progress real not null default 0,
  opponent_progress  real not null default 0,
  challenger_score   integer not null default 0,
  opponent_score     integer not null default 0,
  rating_stake  integer not null default 20,
  winner_id     uuid references public.profiles (id),
  created_at    timestamptz not null default now(),
  ends_at       timestamptz not null
);
create index if not exists battles_participants_idx on public.battles (challenger_id, opponent_id);

-- ── Friends (mutual once accepted) ────────────────────────────────────────────
create table if not exists public.friendships (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  friend_id  uuid not null references public.profiles (id) on delete cascade,
  status     text not null default 'pending', -- pending | accepted
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id)
);

-- ── Achievements ──────────────────────────────────────────────────────────────
create table if not exists public.user_achievements (
  user_id        uuid not null references public.profiles (id) on delete cascade,
  achievement_id text not null,
  unlocked_at    timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ── Activity feed ─────────────────────────────────────────────────────────────
create table if not exists public.activity (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  type       text not null,
  text       text not null,
  meta       text,
  reactions  jsonb not null default '{"fire":0,"clap":0,"muscle":0}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_created_idx on public.activity (created_at desc);

-- ── Leaderboard views ─────────────────────────────────────────────────────────
create or replace view public.global_leaderboard as
  select row_number() over (order by rating desc) as rank,
         id as user_id, username, avatar_url, country, rating, xp,
         round(total_minutes / 60.0, 1) as hours, streak
  from public.profiles;

-- ── New-user trigger: auto-create a profile row ───────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, avatar_url, country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'country', 'DE')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.profiles          enable row level security;
alter table public.study_sessions    enable row level security;
alter table public.battles           enable row level security;
alter table public.friendships       enable row level security;
alter table public.user_achievements enable row level security;
alter table public.activity          enable row level security;

-- Profiles: world-readable (leaderboards), self-writable.
create policy "profiles readable"      on public.profiles for select using (true);
create policy "profiles self-update"   on public.profiles for update using (auth.uid() = id);

-- Sessions: owner only.
create policy "sessions owner select"  on public.study_sessions for select using (auth.uid() = user_id);
create policy "sessions owner insert"  on public.study_sessions for insert with check (auth.uid() = user_id);

-- Battles: participants can read/write.
create policy "battles participant select" on public.battles for select
  using (auth.uid() = challenger_id or auth.uid() = opponent_id);
create policy "battles challenger insert"  on public.battles for insert with check (auth.uid() = challenger_id);
create policy "battles participant update" on public.battles for update
  using (auth.uid() = challenger_id or auth.uid() = opponent_id);

-- Friendships: visible to either side.
create policy "friendships select" on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "friendships insert" on public.friendships for insert with check (auth.uid() = user_id);

-- Achievements: owner-managed, world-readable for showcases.
create policy "achievements readable" on public.user_achievements for select using (true);
create policy "achievements insert"   on public.user_achievements for insert with check (auth.uid() = user_id);

-- Activity: world-readable, self-authored.
create policy "activity readable" on public.activity for select using (true);
create policy "activity insert"   on public.activity for insert with check (auth.uid() = user_id);

-- Realtime: broadcast leaderboard + activity changes.
alter publication supabase_realtime add table public.profiles, public.activity, public.battles;
