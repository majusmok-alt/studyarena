import { motion } from 'framer-motion';
import { Coins, Flame, Sparkles, TrendingUp, Trophy, Zap } from 'lucide-react';
import type { FinishResult } from '../context/DataContext';
import type { SubjectId } from '../lib/types';
import { getSubject } from '../lib/subjects';
import { fmtMinutes } from '../lib/format';
import { CountUp } from './ui/CountUp';
import { Button } from './ui/Button';
import { RankBadge } from './RankBadge';
import { ACHIEVEMENTS } from '../lib/achievements';

interface Props {
  result: FinishResult;
  subject: SubjectId;
  customSubject?: string;
  minutes: number;
  onClaim: () => void;
}

export function Victory({ result, subject, customSubject, minutes, onClaim }: Props) {
  const subj = getSubject(subject);
  const label = subject === 'custom' && customSubject ? customSubject : subj.label;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-ink-950/95 backdrop-blur-xl"
    >
      {/* radial rays */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
        animate={{ opacity: 0.4, scale: 1, rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-1/2 top-32 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 600,
          height: 600,
          background:
            'conic-gradient(from 0deg, transparent 0 14deg, rgba(108,99,245,0.25) 15deg 16deg, transparent 17deg 30deg)',
          maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-md px-6 pt-16 pb-10 min-h-full flex flex-col">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
          className="text-center"
        >
          <div className="inline-grid place-items-center w-24 h-24 rounded-full bg-gradient-to-br from-gold to-amber-600 mb-4 shadow-glow animate-float">
            <Trophy size={48} className="text-ink-950" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Session Complete</p>
          <h1 className="text-4xl font-extrabold font-display text-gradient mt-1">Victory!</h1>
          <p className="text-slate-400 mt-2">
            {fmtMinutes(minutes)} of <span style={{ color: subj.color }} className="font-semibold">{label}</span>
          </p>
        </motion.div>

        {/* Multiplier badge */}
        {result.rewards.multiplier > 1 && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -4 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 260 }}
            className="self-center mt-4 inline-flex items-center gap-1.5 rounded-full bg-loss/20 border border-loss/40 px-3 py-1 text-loss font-bold text-sm"
          >
            <Sparkles size={14} /> {result.rewards.multiplier.toFixed(2)}× Focus Bonus
          </motion.div>
        )}

        {/* Reward tiles */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Reward delay={0.5} icon={<Zap size={18} />} tint="#8587fb" label="XP" value={result.rewards.xp} prefix="+" />
          <Reward delay={0.62} icon={<Coins size={18} />} tint="#f5c451" label="Coins" value={result.rewards.coins} prefix="+" />
          <Reward delay={0.74} icon={<TrendingUp size={18} />} tint="#34d399" label="Rating" value={result.rewards.rating} prefix="+" />
        </div>

        {/* Streak */}
        {result.streakIncreased && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-orange-500/10 border border-orange-400/25 py-3 text-orange-300 font-bold"
          >
            <Flame size={18} /> Streak extended!
          </motion.div>
        )}

        {/* Rank up */}
        {result.rankedUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            className="mt-4 flex items-center gap-3 rounded-3xl p-4 border border-white/10 glass"
          >
            <RankBadge rank={result.rankedUp} size={52} />
            <div>
              <p className="text-xs uppercase tracking-wider font-bold" style={{ color: result.rankedUp.text }}>
                Rank Up!
              </p>
              <p className="font-bold font-display">You reached {result.rankedUp.label}</p>
            </div>
          </motion.div>
        )}

        {/* Achievements */}
        {result.newUnlocks.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-4 space-y-2">
            {result.newUnlocks.map((a) => {
              const def = ACHIEVEMENTS.find((x) => x.id === a.id)!;
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-brand-500/10 border border-brand-400/25 p-3">
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-500/30 text-brand-200">
                    <Sparkles size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wider text-brand-300 font-bold">Achievement Unlocked</p>
                    <p className="font-bold text-sm">{def.title}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        <div className="flex-1" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-8">
          <Button full size="lg" onClick={onClaim}>
            Claim & Continue
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Reward({
  icon,
  label,
  value,
  tint,
  prefix,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tint: string;
  prefix?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0, y: 12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 18 }}
      className="rounded-3xl glass p-3 text-center"
    >
      <span className="inline-grid place-items-center w-9 h-9 rounded-xl mb-2" style={{ backgroundColor: `${tint}22`, color: tint }}>
        {icon}
      </span>
      <div className="text-xl font-extrabold font-display tnum" style={{ color: tint }}>
        {prefix}
        <CountUp to={value} duration={1100} />
      </div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{label}</div>
    </motion.div>
  );
}
