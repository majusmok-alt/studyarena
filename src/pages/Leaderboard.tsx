import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Radio } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Segmented } from '../components/ui/Segmented';
import { Avatar } from '../components/ui/Avatar';
import { RankBadge } from '../components/RankBadge';
import { rankForRating } from '../lib/ranks';
import { clsx, countryName, flag, fmtNumber } from '../lib/format';
import type { LeaderboardEntry } from '../lib/types';

type Scope = 'global' | 'country' | 'friends';

export function Leaderboard() {
  const { user, leaderboard } = useData();
  const [scope, setScope] = useState<Scope>('global');
  const rows = useMemo(() => leaderboard(scope), [scope, leaderboard]);
  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const myEntry = rows.find((r) => r.isMe);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-extrabold font-display">Leaderboard</h1>
          <p className="text-sm text-slate-400 inline-flex items-center gap-1.5">
            <Radio size={13} className="text-win animate-pulse" /> Live rankings
          </p>
        </div>
        <RankBadge rating={user.rating} size={44} />
      </header>

      <Segmented<Scope>
        value={scope}
        onChange={setScope}
        options={[
          { value: 'global', label: 'Global' },
          { value: 'country', label: countryName(user.country) },
          { value: 'friends', label: 'Friends' },
        ]}
      />

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 pt-2 pb-1">
        {[1, 0, 2].map((idx) => {
          const e = top3[idx];
          if (!e) return <div key={idx} className="flex-1" />;
          const place = idx + 1;
          const h = place === 1 ? 'h-24' : place === 2 ? 'h-20' : 'h-16';
          return (
            <motion.div
              key={e.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-1 flex flex-col items-center"
            >
              <div className="relative">
                <Avatar username={e.username} src={e.avatarUrl} size={place === 1 ? 'lg' : 'md'} frame={place === 1 ? 'gold' : undefined} />
                <span
                  className={clsx(
                    'absolute -top-2 -right-1 w-6 h-6 rounded-full grid place-items-center text-xs font-extrabold border-2 border-ink-900',
                    place === 1 ? 'bg-gold text-ink-950' : place === 2 ? 'bg-slate-300 text-ink-950' : 'bg-amber-700 text-white',
                  )}
                >
                  {place}
                </span>
              </div>
              <p className={clsx('mt-2 text-xs font-bold truncate max-w-full', e.isMe && 'text-brand-300')}>
                {e.isMe ? 'You' : `@${e.username}`}
              </p>
              <p className="text-[11px] text-slate-400 tnum">{fmtNumber(e.rating)}</p>
              <div className={clsx('mt-2 w-full rounded-t-xl bg-gradient-to-t from-brand-700/40 to-brand-500/20 border-t border-x border-white/10', h)} />
            </motion.div>
          );
        })}
      </div>

      {/* Sticky my-rank summary */}
      {myEntry && myEntry.rank > 3 && <Row entry={myEntry} highlight />}

      {/* List */}
      <div className="space-y-1.5">
        {rest.map((e, i) => (
          <Row key={e.userId} entry={e} delay={i * 0.02} />
        ))}
      </div>
    </div>
  );
}

function Row({ entry, delay = 0, highlight }: { entry: LeaderboardEntry; delay?: number; highlight?: boolean }) {
  const rank = rankForRating(entry.rating);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={clsx(
        'flex items-center gap-3 rounded-2xl px-3 py-2.5 border',
        entry.isMe
          ? 'bg-brand-500/15 border-brand-400/40 shadow-glow'
          : highlight
            ? 'bg-white/[0.05] border-white/10'
            : 'bg-white/[0.02] border-white/[0.05]',
      )}
    >
      <span className={clsx('w-7 text-center font-bold tnum', entry.isMe ? 'text-brand-200' : 'text-slate-400')}>
        {entry.rank}
      </span>
      <Avatar username={entry.username} src={entry.avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate flex items-center gap-1.5">
          {entry.isMe ? 'You' : `@${entry.username}`}
          <span className="text-xs">{flag(entry.country)}</span>
        </p>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-0.5"><Clock size={10} /> {entry.hours.toFixed(0)}h</span>
          <span className="inline-flex items-center gap-0.5"><Flame size={10} /> {entry.streak}</span>
          <span className="tnum">{fmtNumber(entry.xp)} XP</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold tnum text-sm" style={{ color: rank.text }}>{fmtNumber(entry.rating)}</span>
        <RankBadge rating={entry.rating} size={26} glow={false} />
      </div>
    </motion.div>
  );
}
