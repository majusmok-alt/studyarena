import type { RankTier } from './types';

export interface RankDef {
  tier: RankTier;
  label: string;
  /** inclusive lower bound of rating for this tier */
  floor: number;
  /** primary + secondary badge colors */
  from: string;
  to: string;
  ring: string;
  text: string;
}

// Rating thresholds. Master+ are effectively uncapped at the top.
export const RANKS: RankDef[] = [
  { tier: 'bronze', label: 'Bronze', floor: 0, from: '#a16207', to: '#7c4a12', ring: '#b4791e', text: '#f6d08a' },
  { tier: 'silver', label: 'Silver', floor: 800, from: '#9aa7b8', to: '#5f6b7d', ring: '#aebccd', text: '#e8eef6' },
  { tier: 'gold', label: 'Gold', floor: 1400, from: '#f5c451', to: '#c98a18', ring: '#ffd970', text: '#fff3cf' },
  { tier: 'platinum', label: 'Platinum', floor: 2000, from: '#5eead4', to: '#0d9488', ring: '#7defdb', text: '#d7fff6' },
  { tier: 'diamond', label: 'Diamond', floor: 2700, from: '#7dd3fc', to: '#3b82f6', ring: '#a5e0ff', text: '#e3f3ff' },
  { tier: 'master', label: 'Master', floor: 3500, from: '#c084fc', to: '#7c3aed', ring: '#d8b4fe', text: '#f3e9ff' },
  { tier: 'grandmaster', label: 'Grandmaster', floor: 4500, from: '#fb7185', to: '#be123c', ring: '#fda4af', text: '#ffe4e9' },
];

export function rankForRating(rating: number): RankDef {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (rating >= r.floor) current = r;
  }
  return current;
}

export function nextRank(rating: number): RankDef | null {
  const idx = RANKS.findIndex((r) => r.tier === rankForRating(rating).tier);
  return RANKS[idx + 1] ?? null;
}

/** Progress (0..1) through the current rank toward the next one. */
export function rankProgress(rating: number): number {
  const cur = rankForRating(rating);
  const nxt = nextRank(rating);
  if (!nxt) return 1;
  return Math.max(0, Math.min(1, (rating - cur.floor) / (nxt.floor - cur.floor)));
}

/** Roman-numeral division within a tier (IV..I), purely cosmetic flavor. */
export function rankDivision(rating: number): string {
  const cur = rankForRating(rating);
  const nxt = nextRank(rating);
  if (!nxt) {
    // Grandmaster shows absolute "LP" instead of divisions
    return `${Math.round(rating - cur.floor)} LP`;
  }
  const span = nxt.floor - cur.floor;
  const within = rating - cur.floor;
  const division = 4 - Math.min(3, Math.floor((within / span) * 4));
  return ['I', 'II', 'III', 'IV'][division - 1] ?? 'IV';
}
