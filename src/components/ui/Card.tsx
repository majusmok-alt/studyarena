import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from '../../lib/format';

interface CardProps extends HTMLMotionProps<'div'> {
  glass?: boolean;
  glow?: boolean;
  /** apply entrance animation */
  appear?: boolean;
  delay?: number;
}

export function Card({ glass, glow, appear = true, delay = 0, className, children, ...rest }: CardProps) {
  return (
    <motion.div
      initial={appear ? { opacity: 0, y: 10 } : false}
      animate={appear ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      className={clsx(
        'rounded-3xl p-4',
        glass ? 'glass' : 'bg-ink-850/80 border border-white/[0.06]',
        glow && 'shadow-glow',
        'shadow-card',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  children,
  action,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center justify-between mb-3 px-1', className)}>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">{children}</h2>
      {action}
    </div>
  );
}
