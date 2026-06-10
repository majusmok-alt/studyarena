import { motion } from 'framer-motion';
import { clsx } from '../../lib/format';

interface BarProps {
  value: number; // 0..1
  className?: string;
  trackClassName?: string;
  gradient?: string; // tailwind gradient classes
  height?: number;
  animated?: boolean;
}

export function ProgressBar({
  value,
  className,
  trackClassName,
  gradient = 'from-brand-500 to-accent-400',
  height = 8,
  animated = true,
}: BarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={clsx('w-full rounded-full overflow-hidden bg-white/8', trackClassName, className)}
      style={{ height }}
    >
      <motion.div
        className={clsx('h-full rounded-full bg-gradient-to-r', gradient)}
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

interface RingProps {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  from?: string;
  to?: string;
  trackColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function RingProgress({
  value,
  size = 120,
  stroke = 10,
  from = '#6c63f5',
  to = '#16c5d8',
  trackColor = 'rgba(255,255,255,0.08)',
  children,
  className,
}: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  const gid = `ring-${from}-${to}`.replace(/[^a-z0-9]/gi, '');
  return (
    <div className={clsx('relative grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
