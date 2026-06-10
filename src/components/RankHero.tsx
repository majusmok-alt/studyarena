import { ChevronRight } from 'lucide-react';
import type { User } from '../lib/types';
import { nextRank, rankDivision, rankForRating, rankProgress } from '../lib/ranks';
import { levelInfo } from '../lib/xp';
import { RankBadge } from './RankBadge';
import { ProgressBar } from './ui/Progress';
import { fmtNumber } from '../lib/format';

export function RankHero({ user }: { user: User }) {
  const rank = rankForRating(user.rating);
  const next = nextRank(user.rating);
  const prog = rankProgress(user.rating);
  const div = rankDivision(user.rating);
  const lvl = levelInfo(user.xp);

  return (
    <div className="relative overflow-hidden rounded-4xl p-5 border border-white/[0.08] shadow-card">
      {/* tinted backdrop from rank colors */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(120% 100% at 0% 0%, ${rank.from}55, transparent 60%)` }}
      />
      <div className="absolute inset-0 glass" />
      <div className="relative">
        <div className="flex items-center gap-4">
          <RankBadge rank={rank} size={72} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold font-display" style={{ color: rank.text }}>
                {rank.label}
              </h2>
              <span className="text-sm font-bold text-slate-400">{div}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-sm">
              <span className="font-bold tnum text-white">{fmtNumber(user.rating)}</span>
              <span className="text-slate-500">rating</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Lvl {lvl.level}</span>
            </div>
          </div>
        </div>

        {/* progress to next rank */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold">
              {next ? `Climb to ${next.label}` : 'Apex rank reached'}
            </span>
            {next && (
              <span className="text-slate-500 tnum">
                {fmtNumber(user.rating)} / {fmtNumber(next.floor)}
              </span>
            )}
          </div>
          <ProgressBar value={prog} height={10} gradient="from-brand-400 via-brand-500 to-accent-400" />
        </div>

        {/* level xp bar */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <div className="flex-1">
            <ProgressBar value={lvl.progress} height={5} gradient="from-gold to-amber-500" trackClassName="bg-white/5" />
          </div>
          <span className="tnum">{fmtNumber(lvl.intoLevel)}/{fmtNumber(lvl.span)} XP</span>
          <ChevronRight size={14} className="text-slate-600" />
        </div>
      </div>
    </div>
  );
}
