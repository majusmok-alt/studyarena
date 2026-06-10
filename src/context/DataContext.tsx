import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type {
  ActivityEntry,
  Battle,
  LeaderboardEntry,
  Season,
  StudySession,
  SubjectId,
  UnlockedAchievement,
  User,
} from '../lib/types';
import { ACHIEVEMENTS } from '../lib/achievements';
import { rankForRating } from '../lib/ranks';
import { rewardsForSession, type SessionRewards } from '../lib/xp';
import { getSubject } from '../lib/subjects';
import { currentSeason, FRIENDS, WORLD } from '../lib/mockData';
import { loadState, saveState, resetState, todayKey, type AppState } from '../lib/store';

export interface FinishResult {
  rewards: SessionRewards;
  newUnlocks: typeof ACHIEVEMENTS;
  rankedUp: ReturnType<typeof rankForRating> | null;
  streakIncreased: boolean;
  session: StudySession;
}

export interface AchievementProgress {
  id: string;
  current: number;
  goal: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface DataValue {
  user: User;
  sessions: StudySession[];
  battles: Battle[];
  feed: ActivityEntry[];
  season: Season;
  unlocked: UnlockedAchievement[];
  finishSession: (input: { subject: SubjectId; customSubject?: string; minutes: number }) => FinishResult;
  reactToActivity: (id: string, kind: 'fire' | 'clap' | 'muscle') => void;
  updateProfile: (patch: Partial<Pick<User, 'username' | 'avatarUrl' | 'country'>>) => void;
  challengeFriend: (friendId: string, subject: SubjectId, durationMin: number) => void;
  achievementProgress: () => AchievementProgress[];
  leaderboard: (scope: 'global' | 'country' | 'friends') => LeaderboardEntry[];
  resetDemo: () => void;
}

const DataContext = createContext<DataValue | null>(null);

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

function metricValue(metric: string, user: User, sessionCount: number): number {
  switch (metric) {
    case 'sessions': return sessionCount;
    case 'streak': return user.longestStreak;
    case 'hours': return user.totalMinutes / 60;
    case 'wins': return user.wins;
    case 'rating': return user.rating;
    case 'rankTop': {
      const myRank = WORLD.find((w) => w.isMe)?.rank ?? 999;
      // metric is "reach top N" → satisfied when rank <= goal; expose inverted progress
      return myRank <= 100 ? 100 : 0;
    }
    default: return 0;
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  const commit = useCallback((next: AppState) => {
    saveState(next);
    setState(next);
  }, []);

  const finishSession: DataValue['finishSession'] = useCallback(
    ({ subject, customSubject, minutes }) => {
      const result = (() => {
        const s = state;
        const today = todayKey();
        const rewards = rewardsForSession(minutes, s.user.streak);

        // Streak update
        let streak = s.user.streak;
        let streakIncreased = false;
        if (s.user.lastStudyDate !== today) {
          const yesterday = todayKey(new Date(Date.now() - 86400e3));
          streak = s.user.lastStudyDate === yesterday ? s.user.streak + 1 : 1;
          streakIncreased = true;
        }

        const beforeRank = rankForRating(s.user.rating);
        const nextUser: User = {
          ...s.user,
          xp: s.user.xp + rewards.xp,
          coins: s.user.coins + rewards.coins,
          rating: s.user.rating + rewards.rating,
          totalMinutes: s.user.totalMinutes + minutes,
          streak,
          longestStreak: Math.max(s.user.longestStreak, streak),
          lastStudyDate: today,
        };
        const afterRank = rankForRating(nextUser.rating);
        const rankedUp = afterRank.tier !== beforeRank.tier ? afterRank : null;

        const session: StudySession = {
          id: uid('s'),
          userId: nextUser.id,
          subject,
          customSubject,
          minutes,
          xpEarned: rewards.xp,
          coinsEarned: rewards.coins,
          ratingDelta: rewards.rating,
          startedAt: new Date(Date.now() - minutes * 60000).toISOString(),
          endedAt: new Date().toISOString(),
        };

        // Achievement evaluation
        const sessionCount = s.sessions.length + 1;
        const alreadyUnlocked = new Set(s.unlocked.map((u) => u.achievementId));
        const newUnlocks = ACHIEVEMENTS.filter((a) => {
          if (alreadyUnlocked.has(a.id)) return false;
          return metricValue(a.metric, nextUser, sessionCount) >= a.goal;
        });
        let bonusXp = 0;
        let bonusCoins = 0;
        for (const a of newUnlocks) {
          bonusXp += a.rewardXp;
          bonusCoins += a.rewardCoins;
        }
        nextUser.xp += bonusXp;
        nextUser.coins += bonusCoins;

        const newUnlockedRows: UnlockedAchievement[] = newUnlocks.map((a) => ({
          achievementId: a.id,
          unlockedAt: new Date().toISOString(),
        }));

        // Activity feed entries
        const subjLabel = subject === 'custom' && customSubject ? customSubject : getSubject(subject).label;
        const feedEntries: ActivityEntry[] = [
          {
            id: uid('a'),
            userId: nextUser.id,
            username: nextUser.username,
            avatarUrl: nextUser.avatarUrl,
            type: 'session',
            text: `${nextUser.username} completed a study session`,
            meta: `${minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60 ? `${minutes % 60}m` : ''}`.trim() : `${minutes}m`} · ${subjLabel}`,
            createdAt: new Date().toISOString(),
            reactions: { fire: 0, clap: 0, muscle: 0 },
            reactedByMe: [],
          },
          ...(rankedUp
            ? [{
                id: uid('a'),
                userId: nextUser.id,
                username: nextUser.username,
                avatarUrl: nextUser.avatarUrl,
                type: 'rankup' as const,
                text: `${nextUser.username} reached ${rankedUp.label} rank`,
                meta: 'Promotion',
                createdAt: new Date().toISOString(),
                reactions: { fire: 0, clap: 0, muscle: 0 },
                reactedByMe: [],
              }]
            : []),
        ];

        const next: AppState = {
          ...s,
          user: nextUser,
          sessions: [session, ...s.sessions],
          feed: [...feedEntries, ...s.feed],
          unlocked: [...s.unlocked, ...newUnlockedRows],
        };
        commit(next);
        return {
          rewards: { ...rewards, xp: rewards.xp, coins: rewards.coins },
          newUnlocks,
          rankedUp,
          streakIncreased,
          session,
        } satisfies FinishResult;
      })();
      return result;
    },
    [state, commit],
  );

  const reactToActivity: DataValue['reactToActivity'] = useCallback(
    (id, kind) => {
      setState((s) => {
        const feed = s.feed.map((e) => {
          if (e.id !== id) return e;
          const mine = new Set(e.reactedByMe ?? []);
          const has = mine.has(kind);
          if (has) mine.delete(kind);
          else mine.add(kind);
          return {
            ...e,
            reactions: { ...e.reactions, [kind]: e.reactions[kind] + (has ? -1 : 1) },
            reactedByMe: [...mine] as ('fire' | 'clap' | 'muscle')[],
          };
        });
        const next = { ...s, feed };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const updateProfile: DataValue['updateProfile'] = useCallback(
    (patch) => {
      setState((s) => {
        const next = { ...s, user: { ...s.user, ...patch } };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const challengeFriend: DataValue['challengeFriend'] = useCallback(
    (friendId, subject, durationMin) => {
      setState((s) => {
        const friend = FRIENDS.find((f) => f.id === friendId);
        const battle: Battle = {
          id: uid('b'),
          type: 'focus',
          status: 'pending',
          subject,
          durationMin,
          opponentId: friendId,
          opponentName: friend?.username ?? 'Opponent',
          opponentAvatar: null,
          myProgress: 0,
          oppProgress: 0,
          myScore: 0,
          oppScore: 0,
          ratingStake: Math.round(20 + durationMin / 6),
          result: 'pending',
          createdAt: new Date().toISOString(),
          endsAt: new Date(Date.now() + durationMin * 60000).toISOString(),
        };
        const next = { ...s, battles: [battle, ...s.battles] };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const achievementProgress: DataValue['achievementProgress'] = useCallback(() => {
    const unlockedMap = new Map(state.unlocked.map((u) => [u.achievementId, u.unlockedAt]));
    return ACHIEVEMENTS.map((a) => {
      const current = metricValue(a.metric, state.user, state.sessions.length);
      const unlocked = unlockedMap.has(a.id) || current >= a.goal;
      return {
        id: a.id,
        current,
        goal: a.goal,
        progress: Math.min(1, current / a.goal),
        unlocked,
        unlockedAt: unlockedMap.get(a.id),
      };
    });
  }, [state]);

  const leaderboard: DataValue['leaderboard'] = useCallback(
    (scope) => {
      const meRow = (): LeaderboardEntry => ({
        rank: 0,
        userId: state.user.id,
        username: state.user.username,
        avatarUrl: state.user.avatarUrl,
        country: state.user.country,
        rating: state.user.rating,
        xp: state.user.xp,
        hours: Math.round((state.user.totalMinutes / 60) * 10) / 10,
        streak: state.user.streak,
        isMe: true,
      });

      let pool: LeaderboardEntry[];
      if (scope === 'friends') {
        pool = FRIENDS.map((f) => ({
          rank: 0,
          userId: f.id,
          username: f.username,
          avatarUrl: f.avatarUrl,
          country: f.country,
          rating: f.rating,
          xp: Math.round(f.rating * 9),
          hours: Math.round((f.rating / 9) * 10) / 10,
          streak: f.streak,
        }));
      } else {
        const others = WORLD.filter((w) => !w.isMe);
        pool = others
          .filter((w) => (scope === 'country' ? w.country === state.user.country : true))
          .map(({ online: _o, studyingNow: _s, ...e }) => e);
      }
      const rows = [...pool, meRow()].sort((a, b) => b.rating - a.rating);
      rows.forEach((r, i) => (r.rank = i + 1));
      return rows;
    },
    [state.user],
  );

  const resetDemo = useCallback(() => {
    commit(resetState());
  }, [commit]);

  const season = useMemo(() => currentSeason(), []);

  const value = useMemo<DataValue>(
    () => ({
      user: state.user,
      sessions: state.sessions,
      battles: state.battles,
      feed: state.feed,
      unlocked: state.unlocked,
      season,
      finishSession,
      reactToActivity,
      updateProfile,
      challengeFriend,
      achievementProgress,
      leaderboard,
      resetDemo,
    }),
    [state, season, finishSession, reactToActivity, updateProfile, challengeFriend, achievementProgress, leaderboard, resetDemo],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData(): DataValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
