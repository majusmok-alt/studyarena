import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Coins, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/Progress';
import { Icon } from '../components/ui/Icon';
import { ACHIEVEMENTS } from '../lib/achievements';
import { clsx, fmtNumber, timeAgo } from '../lib/format';

export function Achievements() {
  const { achievementProgress } = useData();
  const rows = achievementProgress();
  const unlocked = rows.filter((r) => r.unlocked);
  const earnedXp = unlocked.reduce((a, r) => a + (ACHIEVEMENTS.find((x) => x.id === r.id)?.rewardXp ?? 0), 0);

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3 pt-1">
        <Link to="/profile" className="p-2 -ml-2 rounded-full hover:bg-white/5"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-extrabold font-display">Achievements</h1>
          <p className="text-sm text-slate-400">{unlocked.length}/{ACHIEVEMENTS.length} unlocked · {fmtNumber(earnedXp)} XP earned</p>
        </div>
      </header>

      <Card glass className="flex items-center gap-4">
        <div className="relative">
          <svg width="64" height="64" className="-rotate-90">
            <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle cx="32" cy="32" r="27" fill="none" stroke="#f5c451" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 27}
              strokeDashoffset={2 * Math.PI * 27 * (1 - unlocked.length / ACHIEVEMENTS.length)} />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-bold tnum">{Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%</span>
        </div>
        <div>
          <p className="font-bold font-display">Collection progress</p>
          <p className="text-sm text-slate-400">Keep studying to unlock them all.</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {rows.map((r, i) => {
          const def = ACHIEVEMENTS.find((x) => x.id === r.id)!;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={clsx(
                'rounded-3xl p-4 border flex items-center gap-4',
                r.unlocked ? 'bg-gold/[0.07] border-gold/25' : 'bg-white/[0.02] border-white/[0.06]',
              )}
            >
              <span
                className={clsx(
                  'relative grid place-items-center w-14 h-14 rounded-2xl shrink-0',
                  r.unlocked ? 'bg-gradient-to-br from-gold/30 to-amber-600/20 text-gold' : 'bg-white/5 text-slate-500',
                )}
              >
                <Icon name={def.icon} size={26} />
                {r.unlocked && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-win grid place-items-center border-2 border-ink-900">
                    <Check size={11} strokeWidth={3} className="text-ink-950" />
                  </span>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">{def.title}</p>
                  <div className="flex items-center gap-2 text-[11px] font-bold shrink-0">
                    <span className="inline-flex items-center gap-0.5 text-brand-300"><Zap size={11} />{fmtNumber(def.rewardXp)}</span>
                    <span className="inline-flex items-center gap-0.5 text-gold"><Coins size={11} />{fmtNumber(def.rewardCoins)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{def.description}</p>
                {r.unlocked ? (
                  <p className="text-[11px] text-gold/80 mt-1.5">Unlocked {r.unlockedAt ? timeAgo(r.unlockedAt) : ''}</p>
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar value={r.progress} height={5} className="flex-1" gradient="from-brand-400 to-accent-400" />
                    <span className="text-[10px] text-slate-500 tnum">
                      {Math.floor(r.current)}/{r.goal}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
