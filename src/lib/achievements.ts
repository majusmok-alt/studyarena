import type { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_session', title: 'First Session', description: 'Complete your very first study session.', icon: 'Flag', metric: 'sessions', goal: 1, rewardXp: 100, rewardCoins: 50 },
  { id: 'streak_7', title: '7 Day Streak', description: 'Study 7 days in a row.', icon: 'Flame', metric: 'streak', goal: 7, rewardXp: 400, rewardCoins: 200 },
  { id: 'streak_30', title: '30 Day Streak', description: 'Keep a 30 day streak alive.', icon: 'Flame', metric: 'streak', goal: 30, rewardXp: 1500, rewardCoins: 800 },
  { id: 'hours_100', title: 'Century', description: 'Study 100 total hours.', icon: 'Clock', metric: 'hours', goal: 100, rewardXp: 2000, rewardCoins: 1000 },
  { id: 'hours_500', title: 'Scholar', description: 'Study 500 total hours.', icon: 'GraduationCap', metric: 'hours', goal: 500, rewardXp: 8000, rewardCoins: 4000 },
  { id: 'wins_100', title: 'Centurion', description: 'Win 100 study battles.', icon: 'Swords', metric: 'wins', goal: 100, rewardXp: 3000, rewardCoins: 1500 },
  { id: 'top_100', title: 'Top 100', description: 'Reach the global top 100.', icon: 'Trophy', metric: 'rankTop', goal: 100, rewardXp: 5000, rewardCoins: 2500 },
  { id: 'diamond', title: 'Diamond Mind', description: 'Reach Diamond rank.', icon: 'Gem', metric: 'rating', goal: 2700, rewardXp: 4000, rewardCoins: 2000 },
];
