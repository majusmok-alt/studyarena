import { rankForRating, type RankDef } from '../lib/ranks';
import { clsx } from '../lib/format';

interface Props {
  rating?: number;
  rank?: RankDef;
  size?: number;
  className?: string;
  glow?: boolean;
}

/** Premium gradient shield badge, unique per rank tier. */
export function RankBadge({ rating, rank, size = 56, className, glow = true }: Props) {
  const r = rank ?? rankForRating(rating ?? 0);
  const gid = `rb-${r.tier}`;
  const stars = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster'].indexOf(r.tier) + 1;

  return (
    <div className={clsx('relative inline-block', className)} style={{ width: size, height: size }}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-50"
          style={{ background: `radial-gradient(circle, ${r.from}, transparent 70%)` }}
        />
      )}
      <svg viewBox="0 0 64 64" width={size} height={size} className="relative drop-shadow-lg">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={r.from} />
            <stop offset="100%" stopColor={r.to} />
          </linearGradient>
          <linearGradient id={`${gid}-sheen`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Shield */}
        <path
          d="M32 3 L56 12 V31 C56 46 45 56 32 61 C19 56 8 46 8 31 V12 Z"
          fill={`url(#${gid})`}
          stroke={r.ring}
          strokeWidth="2"
        />
        <path
          d="M32 3 L56 12 V31 C56 46 45 56 32 61 C19 56 8 46 8 31 V12 Z"
          fill={`url(#${gid}-sheen)`}
          opacity="0.6"
        />
        {/* Inner emblem */}
        <path
          d="M32 16 L37 27 L49 28 L40 36 L43 48 L32 41 L21 48 L24 36 L15 28 L27 27 Z"
          fill="rgba(255,255,255,0.92)"
          opacity="0.95"
        />
        {/* Tier pips */}
        {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
          <circle
            key={i}
            cx={32 - (Math.min(stars, 5) - 1) * 3 + i * 6}
            cy={53}
            r={1.5}
            fill="rgba(255,255,255,0.85)"
          />
        ))}
      </svg>
    </div>
  );
}
