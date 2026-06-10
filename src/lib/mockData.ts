import type {
  ActivityEntry,
  Battle,
  Friend,
  LeaderboardEntry,
  Season,
  User,
} from './types';

// Deterministic PRNG so the demo world is stable across reloads.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

const NAMES = [
  'Alex', 'Emma', 'Lukas', 'Sofia', 'Mateo', 'Lena', 'Noah', 'Mia', 'Hugo', 'Olivia',
  'Liam', 'Anna', 'Felix', 'Julia', 'Leon', 'Clara', 'Jan', 'Eva', 'Marco', 'Nora',
  'Tomas', 'Ines', 'Viktor', 'Maja', 'Pablo', 'Freya', 'Niklas', 'Alma', 'Stefan', 'Lucia',
  'Kacper', 'Zoé', 'Mikkel', 'Greta', 'Andrei', ' Siri', 'Rasmus', 'Elif', 'Dario', 'Yara',
  'Kai', 'Maren', 'Bruno', 'Saga', 'Henri', 'Ada', 'Oskar', 'Lia', 'Theo', 'Nina',
];
const COUNTRIES = ['DE', 'FR', 'ES', 'IT', 'NL', 'PL', 'SE', 'PT', 'BE', 'AT', 'DK', 'FI', 'GR', 'CZ', 'CH', 'IE'];

let idCounter = 1;
const uid = (p = 'u') => `${p}_${(idCounter++).toString(36)}`;

function makeUsername(name: string, i: number): string {
  const handles = ['', '_', 'x', '99', '_eu', 'study', 'pro', '_x', '07', 'grind'];
  return `${name.trim().toLowerCase()}${pick(handles)}${i % 3 === 0 ? Math.floor(rand() * 90 + 10) : ''}`;
}

// ── The current (demo) user ──────────────────────────────────────────────────
export const ME: User = {
  id: 'me',
  email: 'you@studyarena.app',
  username: 'you',
  avatarUrl: null,
  country: 'DE',
  rating: 1685, // Gold
  xp: 14820,
  coins: 2340,
  streak: 12,
  longestStreak: 19,
  totalMinutes: 11070, // ~184.5h
  wins: 47,
  losses: 23,
  frame: 'aurora',
  createdAt: new Date(Date.now() - 86400e3 * 90).toISOString(),
  // Studied yesterday, so today's first session continues (not resets) the streak.
  lastStudyDate: new Date(Date.now() - 86400e3).toISOString().slice(0, 10),
};

// ── World population ──────────────────────────────────────────────────────────
export interface Citizen extends LeaderboardEntry {
  online: boolean;
  studyingNow: boolean;
}

function buildWorld(): Citizen[] {
  const people: Citizen[] = [];
  for (let i = 0; i < 60; i++) {
    const name = NAMES[i % NAMES.length];
    const rating = Math.round(4800 - Math.pow(i, 1.32) * 38 - rand() * 60);
    people.push({
      rank: 0,
      userId: uid(),
      username: makeUsername(name, i),
      avatarUrl: null,
      country: COUNTRIES[i % COUNTRIES.length],
      rating: Math.max(120, rating),
      xp: Math.round(rating * 9 + rand() * 4000),
      hours: Math.round((rating / 9 + rand() * 60) * 10) / 10,
      streak: Math.floor(rand() * 40),
      online: rand() > 0.55,
      studyingNow: rand() > 0.8,
    });
  }
  // insert me into the standings
  people.push({
    rank: 0,
    userId: ME.id,
    username: ME.username,
    avatarUrl: ME.avatarUrl,
    country: ME.country,
    rating: ME.rating,
    xp: ME.xp,
    hours: Math.round((ME.totalMinutes / 60) * 10) / 10,
    streak: ME.streak,
    online: true,
    studyingNow: false,
    isMe: true,
  });
  people.sort((a, b) => b.rating - a.rating);
  people.forEach((p, i) => (p.rank = i + 1));
  return people;
}

export const WORLD: Citizen[] = buildWorld();

export function globalLeaderboard(): LeaderboardEntry[] {
  return WORLD.map(({ online: _o, studyingNow: _s, ...e }) => e);
}

export function countryLeaderboard(country: string): LeaderboardEntry[] {
  return WORLD.filter((p) => p.country === country)
    .map((p, i) => ({ ...p, rank: i + 1 }))
    .map(({ online: _o, studyingNow: _s, ...e }) => e);
}

// ── Friends (a curated slice of the world) ───────────────────────────────────
export const FRIENDS: Friend[] = WORLD.slice(3, 12).map((p) => ({
  id: p.userId,
  username: p.username,
  avatarUrl: null,
  country: p.country,
  rating: p.rating,
  online: p.online,
  studyingNow: p.studyingNow ? 'mathematics' : null,
  streak: p.streak,
}));

export function friendsLeaderboard(): LeaderboardEntry[] {
  const meEntry = WORLD.find((p) => p.isMe)!;
  const rows = [
    ...FRIENDS.map((f) => ({
      rank: 0,
      userId: f.id,
      username: f.username,
      avatarUrl: f.avatarUrl,
      country: f.country,
      rating: f.rating,
      xp: Math.round(f.rating * 9),
      hours: Math.round((f.rating / 9) * 10) / 10,
      streak: f.streak,
    })),
    {
      rank: 0,
      userId: meEntry.userId,
      username: meEntry.username,
      avatarUrl: meEntry.avatarUrl,
      country: meEntry.country,
      rating: meEntry.rating,
      xp: meEntry.xp,
      hours: meEntry.hours,
      streak: meEntry.streak,
      isMe: true,
    },
  ];
  rows.sort((a, b) => b.rating - a.rating);
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

// ── Activity feed ─────────────────────────────────────────────────────────────
const FEED_TEMPLATES: Array<(n: string) => { type: ActivityEntry['type']; text: string; meta?: string }> = [
  (n) => ({ type: 'session', text: `${n} completed a study session`, meta: '2h 10m · Mathematics' }),
  (n) => ({ type: 'rankup', text: `${n} reached Gold rank`, meta: 'Promotion' }),
  (n) => ({ type: 'battle_win', text: `${n} won a Focus Battle`, meta: '+28 rating' }),
  (n) => ({ type: 'achievement', text: `${n} unlocked “7 Day Streak”`, meta: 'Achievement' }),
  (n) => ({ type: 'session', text: `${n} completed a study session`, meta: '45m · Programming' }),
  (n) => ({ type: 'streak', text: `${n} extended their streak to 21 days`, meta: '🔥 21 days' }),
  (n) => ({ type: 'session', text: `${n} completed a study session`, meta: '1h 30m · Languages' }),
];

export function buildFeed(): ActivityEntry[] {
  const entries: ActivityEntry[] = [];
  for (let i = 0; i < 14; i++) {
    const person = WORLD[(i * 3 + 4) % WORLD.length];
    const t = FEED_TEMPLATES[i % FEED_TEMPLATES.length](person.username);
    entries.push({
      id: uid('a'),
      userId: person.userId,
      username: person.username,
      avatarUrl: null,
      type: t.type,
      text: t.text,
      meta: t.meta,
      createdAt: new Date(Date.now() - i * 1000 * 60 * (17 + Math.floor(rand() * 90))).toISOString(),
      reactions: { fire: Math.floor(rand() * 14), clap: Math.floor(rand() * 9), muscle: Math.floor(rand() * 7) },
      reactedByMe: [],
    });
  }
  return entries;
}

// ── Battles ───────────────────────────────────────────────────────────────────
export function buildBattles(): Battle[] {
  const opp1 = FRIENDS[0];
  const opp2 = FRIENDS[2];
  const opp3 = FRIENDS[4];
  const now = Date.now();
  return [
    {
      id: uid('b'),
      type: 'focus',
      status: 'active',
      subject: 'mathematics',
      durationMin: 60,
      opponentId: opp1.id,
      opponentName: opp1.username,
      opponentAvatar: null,
      myProgress: 0.62,
      oppProgress: 0.48,
      myScore: 0,
      oppScore: 0,
      ratingStake: 25,
      result: 'pending',
      createdAt: new Date(now - 1000 * 60 * 37).toISOString(),
      endsAt: new Date(now + 1000 * 60 * 23).toISOString(),
    },
    {
      id: uid('b'),
      type: 'daily',
      status: 'active',
      subject: 'programming',
      durationMin: 0,
      opponentId: 'field',
      opponentName: 'Daily Challenge',
      opponentAvatar: null,
      myProgress: 0.4,
      oppProgress: 0,
      myScore: 320,
      oppScore: 0,
      ratingStake: 15,
      result: 'pending',
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      endsAt: new Date(new Date().setHours(23, 59, 59, 0)).toISOString(),
    },
    {
      id: uid('b'),
      type: 'focus',
      status: 'completed',
      subject: 'science',
      durationMin: 45,
      opponentId: opp2.id,
      opponentName: opp2.username,
      opponentAvatar: null,
      myProgress: 1,
      oppProgress: 1,
      myScore: 480,
      oppScore: 410,
      ratingStake: 22,
      result: 'win',
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      endsAt: new Date(now - 1000 * 60 * 60 * 25).toISOString(),
    },
    {
      id: uid('b'),
      type: 'focus',
      status: 'completed',
      subject: 'languages',
      durationMin: 30,
      opponentId: opp3.id,
      opponentName: opp3.username,
      opponentAvatar: null,
      myProgress: 1,
      oppProgress: 1,
      myScore: 290,
      oppScore: 360,
      ratingStake: 19,
      result: 'loss',
      createdAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
      endsAt: new Date(now - 1000 * 60 * 60 * 49).toISOString(),
    },
  ];
}

// ── Season ────────────────────────────────────────────────────────────────────
export function currentSeason(): Season {
  const start = new Date();
  start.setDate(start.getDate() - 12);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 30);
  return { id: 7, name: 'Season 7 · Ascension', startsAt: start.toISOString(), endsAt: end.toISOString() };
}

// Sparkline of last 7 days of study minutes (for dashboard chart)
export const WEEK_MINUTES = [45, 120, 0, 95, 60, 150, 80];
