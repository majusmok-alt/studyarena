// XP / leveling / reward economy.
// Tuned so a focused ~25min session feels meaningfully rewarding without
// trivializing long-term progression.

export const XP_PER_MINUTE = 10;
export const COINS_PER_MINUTE = 2;

/** Bonus multiplier for longer unbroken focus sessions. */
export function focusMultiplier(minutes: number): number {
  if (minutes >= 90) return 1.5;
  if (minutes >= 60) return 1.35;
  if (minutes >= 45) return 1.2;
  if (minutes >= 25) return 1.1;
  return 1;
}

export interface SessionRewards {
  xp: number;
  coins: number;
  rating: number;
  multiplier: number;
}

export function rewardsForSession(minutes: number, streak: number): SessionRewards {
  const mult = focusMultiplier(minutes);
  const streakBonus = 1 + Math.min(streak, 30) * 0.01; // up to +30%
  const xp = Math.round(minutes * XP_PER_MINUTE * mult * streakBonus);
  const coins = Math.round(minutes * COINS_PER_MINUTE * mult);
  // Solo study yields modest rating; PvP wins yield much more.
  const rating = Math.round(minutes * 0.6 * mult);
  return { xp, coins, rating, multiplier: mult };
}

// ── Level curve ──────────────────────────────────────────────────────────────
// Level N requires a smoothly increasing amount of cumulative XP.
const BASE = 600;

export function xpForLevel(level: number): number {
  // cumulative XP required to *reach* `level` (level 1 = 0)
  if (level <= 1) return 0;
  return Math.round(BASE * Math.pow(level - 1, 1.6));
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export interface LevelInfo {
  level: number;
  intoLevel: number; // xp accumulated into current level
  span: number; // xp needed for the whole current level
  progress: number; // 0..1
}

export function levelInfo(xp: number): LevelInfo {
  const level = levelForXp(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const span = ceil - floor;
  const intoLevel = xp - floor;
  return { level, intoLevel, span, progress: span === 0 ? 1 : intoLevel / span };
}
