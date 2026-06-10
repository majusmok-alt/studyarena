// ─────────────────────────────────────────────────────────────────────────────
// StudyArena — core domain types
// These are intentionally backend-agnostic. The Supabase row shapes in
// `supabase/schema.sql` map 1:1 to these so the data layer can swap cleanly.
// ─────────────────────────────────────────────────────────────────────────────

export type RankTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'master'
  | 'grandmaster';

export type SubjectId =
  | 'mathematics'
  | 'science'
  | 'economics'
  | 'languages'
  | 'programming'
  | 'custom';

export interface Subject {
  id: SubjectId;
  label: string;
  icon: string; // lucide icon name
  color: string; // hex
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  country: string; // ISO-3166 alpha-2, e.g. "DE"
  rating: number; // ranked rating points (drives RankTier)
  xp: number; // lifetime XP (drives level)
  coins: number;
  streak: number; // current daily streak (days)
  longestStreak: number;
  totalMinutes: number; // lifetime studied minutes
  wins: number;
  losses: number;
  frame: string; // unlockable profile frame id
  createdAt: string; // ISO
  lastStudyDate: string | null; // YYYY-MM-DD
}

export interface StudySession {
  id: string;
  userId: string;
  subject: SubjectId;
  customSubject?: string;
  minutes: number;
  xpEarned: number;
  coinsEarned: number;
  ratingDelta: number;
  startedAt: string; // ISO
  endedAt: string; // ISO
}

export type BattleType = 'focus' | 'daily' | 'tournament';
export type BattleStatus = 'pending' | 'active' | 'completed';

export interface Battle {
  id: string;
  type: BattleType;
  status: BattleStatus;
  subject: SubjectId;
  durationMin: number; // target duration for focus battles
  opponentId: string; // other user id (or "field" for tournaments)
  opponentName: string;
  opponentAvatar: string | null;
  myProgress: number; // 0..1
  oppProgress: number; // 0..1
  myScore: number;
  oppScore: number;
  ratingStake: number;
  result?: 'win' | 'loss' | 'pending';
  createdAt: string;
  endsAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  /** progress threshold metric */
  metric: 'sessions' | 'streak' | 'hours' | 'wins' | 'rankTop' | 'rating';
  goal: number;
  rewardXp: number;
  rewardCoins: number;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
}

export type ActivityType =
  | 'session'
  | 'rankup'
  | 'achievement'
  | 'battle_win'
  | 'streak';

export interface ActivityEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  type: ActivityType;
  text: string;
  meta?: string; // e.g. "2h · Mathematics"
  createdAt: string; // ISO
  reactions: { fire: number; clap: number; muscle: number };
  reactedByMe?: ('fire' | 'clap' | 'muscle')[];
}

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string | null;
  country: string;
  rating: number;
  online: boolean;
  studyingNow?: SubjectId | null;
  streak: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  country: string;
  rating: number;
  xp: number;
  hours: number;
  streak: number;
  isMe?: boolean;
}

export interface Season {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
}
