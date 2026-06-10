// Local persistence layer for the demo experience.
// Mirrors what a Supabase-backed repository would expose, so swapping the
// implementation later (see supabase.ts) touches only this file + DataContext.

import type {
  ActivityEntry,
  Battle,
  StudySession,
  UnlockedAchievement,
  User,
} from './types';
import {
  ME,
  buildBattles,
  buildFeed,
  currentSeason,
} from './mockData';

const KEY = 'studyarena:v1';

export interface AppState {
  user: User;
  sessions: StudySession[];
  battles: Battle[];
  feed: ActivityEntry[];
  unlocked: UnlockedAchievement[];
  seasonId: number;
}

function seed(): AppState {
  return {
    user: structuredClone(ME),
    sessions: [],
    battles: buildBattles(),
    feed: buildFeed(),
    unlocked: [
      { achievementId: 'first_session', unlockedAt: new Date(Date.now() - 86400e3 * 80).toISOString() },
      { achievementId: 'streak_7', unlockedAt: new Date(Date.now() - 86400e3 * 30).toISOString() },
      { achievementId: 'hours_100', unlockedAt: new Date(Date.now() - 86400e3 * 12).toISOString() },
    ],
    seasonId: currentSeason().id,
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as AppState;
    // Light migration / sanity guard
    if (!parsed.user || !Array.isArray(parsed.battles)) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable (private mode); the app still works in-memory */
  }
}

export function resetState(): AppState {
  const fresh = seed();
  saveState(fresh);
  return fresh;
}

// ── Auth session (demo) ──────────────────────────────────────────────────────
const AUTH_KEY = 'studyarena:auth';

export interface StoredAuth {
  username: string;
  email: string;
  country: string;
  avatarUrl: string | null;
}

export function loadAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function saveAuth(auth: StoredAuth | null): void {
  try {
    if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Permanently remove all locally stored account + progress data (account deletion). */
export function wipeAllLocalData(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}
