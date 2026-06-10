import { motion } from 'framer-motion';
import { Crown, Flame, Sparkles, Swords, Timer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ActivityEntry, ActivityType } from '../lib/types';
import { Avatar } from './ui/Avatar';
import { clsx, timeAgo } from '../lib/format';

const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  session: Timer,
  rankup: Crown,
  achievement: Sparkles,
  battle_win: Swords,
  streak: Flame,
};

const TYPE_TINT: Record<ActivityType, string> = {
  session: '#8587fb',
  rankup: '#f5c451',
  achievement: '#c084fc',
  battle_win: '#fb7185',
  streak: '#fb923c',
};

const REACTIONS = [
  { kind: 'fire' as const, emoji: '🔥' },
  { kind: 'clap' as const, emoji: '👏' },
  { kind: 'muscle' as const, emoji: '💪' },
];

export function ActivityItem({
  entry,
  onReact,
  delay = 0,
}: {
  entry: ActivityEntry;
  onReact?: (kind: 'fire' | 'clap' | 'muscle') => void;
  delay?: number;
}) {
  const Ico = TYPE_ICON[entry.type];
  const tint = TYPE_TINT[entry.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex gap-3 py-3"
    >
      <div className="relative shrink-0">
        <Avatar username={entry.username} src={entry.avatarUrl} size="md" />
        <span
          className="absolute -bottom-1 -right-1 grid place-items-center w-5 h-5 rounded-full border-2 border-ink-900"
          style={{ backgroundColor: tint }}
        >
          <Ico size={11} />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-bold">{entry.username}</span>{' '}
          <span className="text-slate-300">{entry.text.replace(`${entry.username} `, '')}</span>
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {entry.meta && (
            <span className="text-xs font-semibold" style={{ color: tint }}>
              {entry.meta}
            </span>
          )}
          <span className="text-xs text-slate-500">· {timeAgo(entry.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          {REACTIONS.map((r) => {
            const count = entry.reactions[r.kind];
            const reacted = entry.reactedByMe?.includes(r.kind);
            return (
              <motion.button
                key={r.kind}
                whileTap={{ scale: 0.85 }}
                onClick={() => onReact?.(r.kind)}
                className={clsx(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border transition-colors',
                  reacted
                    ? 'bg-brand-500/20 border-brand-400/40 text-brand-100'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10',
                )}
              >
                <span>{r.emoji}</span>
                {count > 0 && <span className="tnum">{count}</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
