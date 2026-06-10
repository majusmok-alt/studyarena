import { motion } from 'framer-motion';
import { clsx } from '../../lib/format';

interface Props<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

export function Segmented<T extends string>({ value, onChange, options, className }: Props<T>) {
  return (
    <div className={clsx('flex p-1 rounded-2xl glass', className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="relative flex-1 py-2 text-sm font-semibold rounded-xl transition-colors"
          >
            {active && (
              <motion.span
                layoutId={`seg-${className ?? 'x'}`}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className={clsx('relative', active ? 'text-white' : 'text-slate-400')}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
