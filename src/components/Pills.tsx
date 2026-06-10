import { Coins, Flame, Zap } from 'lucide-react';
import { clsx, fmtCompact } from '../lib/format';

export function CoinPill({ value, className }: { value: number; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/20 px-2.5 py-1 text-gold font-bold text-sm tnum', className)}>
      <Coins size={14} /> {fmtCompact(value)}
    </span>
  );
}

export function XpPill({ value, className }: { value: number; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 border border-brand-400/25 px-2.5 py-1 text-brand-200 font-bold text-sm tnum', className)}>
      <Zap size={14} /> {fmtCompact(value)}
    </span>
  );
}

export function StreakPill({ value, className }: { value: number; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-400/25 px-2.5 py-1 text-orange-300 font-bold text-sm tnum', className)}>
      <Flame size={14} /> {value}
    </span>
  );
}
