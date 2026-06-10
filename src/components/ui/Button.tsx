import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from '../../lib/format';

type Variant = 'primary' | 'ghost' | 'glass' | 'danger' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'btn-grad hover:brightness-110',
  gold: 'bg-gradient-to-br from-gold to-amber-600 text-ink-950 font-bold shadow-glow',
  ghost: 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10',
  glass: 'glass text-white hover:bg-white/10',
  danger: 'bg-loss/15 text-loss border border-loss/30 hover:bg-loss/25',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-xl gap-1.5',
  md: 'h-11 px-5 text-[15px] rounded-2xl gap-2',
  lg: 'h-14 px-6 text-base rounded-2xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={clsx(
        'inline-flex items-center justify-center font-semibold select-none',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
