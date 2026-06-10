# 🏆 StudyArena

> Turn studying into a ranked online game. A competitive PvP study platform for European students — study sessions earn XP, XP and battles drive your rating, and your rating climbs you through the ranked ladder from **Bronze → Grandmaster**.

Built mobile-first with a premium dark UI inspired by **Duolingo, Clash Royale, Strava & Discord**.

![stack](https://img.shields.io/badge/React-18-61dafb) ![ts](https://img.shields.io/badge/TypeScript-5-3178c6) ![tw](https://img.shields.io/badge/Tailwind-3-38bdf8) ![supabase](https://img.shields.io/badge/Supabase-ready-3ecf8e)

---

## ✨ Features

| Area | What's in |
| --- | --- |
| **Auth** | Email sign-up, Google login, username creation, profile-picture upload |
| **Profile** | Rank badge, XP/level, streak, total hours, W/L, global & country ranking, achievement showcase, profile frames |
| **Ranked system** | 7 tiers with unique gradient shield badges, divisions, rating thresholds |
| **Study sessions** | Start / pause / resume / finish timer, 6 subjects, focus-bonus multipliers, animated **victory screen** awarding XP + coins + rating |
| **PvP battles** | Focus Battles (1v1 timed), Daily Challenge, Weekly Tournament, live progress bars, match history, W/L record, rating stakes |
| **Leaderboards** | Global / Country / Friends with podium, live-updating, rank badges & flags |
| **Streaks** | Daily streak tracking with streak-bonus XP and milestone achievements |
| **Achievements** | 8 unlockable achievements with progress tracking & rewards |
| **Social** | Activity feed (Strava-style) with reactions, friends list, add-friends, challenges |
| **Seasons** | 30-day competitive seasons with a live countdown |
| **Gamification** | XP economy, coins, profile frames, rank badges, seasonal rewards |

## 🧱 Tech stack

- **React 18 + TypeScript** (strict) + **Vite**
- **TailwindCSS** with a custom design system (brand/accent palettes, glassmorphism, premium shadows)
- **Framer Motion** for animations & transitions
- **Supabase** (PostgreSQL + Auth + Realtime) — optional, with a transparent offline fallback
- **lucide-react** icons, custom dependency-free SVG charts

## 🚀 Getting started

```bash
npm install
npm run dev      # → http://localhost:5173
```

```bash
npm run build    # type-check + production build
npm run preview  # preview the production build
```

> ℹ️ The app runs **out of the box in demo mode** — no backend required. Progress is persisted to `localStorage`, and the world (leaderboards, friends, feed, battles) is seeded with a deterministic set of European students.

## 🔌 Connecting Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor. It creates all tables, a new-user trigger, **Row Level Security** policies, leaderboard views, and enables Realtime.
3. Copy `.env.example` → `.env` and fill in:
   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Restart the dev server. The app auto-detects the credentials (`isSupabaseEnabled`) and switches the auth flow to Supabase. The data layer is isolated in [`src/lib/store.ts`](src/lib/store.ts) / [`src/context/DataContext.tsx`](src/context/DataContext.tsx) — swap the localStorage calls for Supabase queries there to go fully live.

## 🗂️ Architecture

```
src/
├─ lib/            # backend-agnostic domain layer
│  ├─ types.ts        # core domain types (map 1:1 to SQL rows)
│  ├─ ranks.ts        # rank tiers, thresholds, badge colors, divisions
│  ├─ xp.ts           # XP/level curve + reward economy
│  ├─ achievements.ts # achievement definitions
│  ├─ subjects.ts     # subject catalog
│  ├─ store.ts        # local persistence (Supabase swap-point)
│  ├─ supabase.ts     # optional Supabase client
│  └─ mockData.ts     # deterministic seeded demo world
├─ context/        # AuthContext + DataContext (state, actions, derived data)
├─ components/     # design system (ui/) + feature components (RankBadge, Victory…)
├─ pages/          # Auth, Dashboard, Study, Battles, Leaderboard, Profile, Achievements, Social
└─ App.tsx         # router + auth gate
supabase/schema.sql  # full PostgreSQL schema with RLS + realtime
```

**Design principles**

- *Modular & expandable* — every domain rule (ranks, XP, achievements, subjects) lives in one small file. Add a rank tier or achievement by editing a single array.
- *Backend-agnostic* — UI talks to contexts, contexts talk to the store, the store is the only Supabase touch-point.
- *MVP-first* — Authentication, Profiles, Study timer, XP, Ranks, Leaderboards and Friend challenges are fully built; Tournaments, seasonal reward distribution and realtime sync are scaffolded for easy extension.

## 🎨 Design system

Custom Tailwind theme: deep "ink" surfaces, an electric indigo **brand** palette + cyan **accent**, rank-specific gradients, `.glass`/`.glass-strong` glassmorphism utilities, `Sora`/`Plus Jakarta Sans` typography, and reusable motion primitives (`Card`, `Button`, `RingProgress`, `Sparkline`, `CountUp`, `Sheet`, `Segmented`).
