import { motion } from 'framer-motion';
import { clsx } from '../../lib/format';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  'aria-label'?: string;
}

export function Toggle({ checked, onChange, ...rest }: Props) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={rest['aria-label'] ?? rest.label}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative w-12 h-7 rounded-full transition-colors shrink-0',
        checked ? 'bg-gradient-to-r from-brand-500 to-accent-500' : 'bg-white/12',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={clsx(
          'absolute top-1 w-5 h-5 rounded-full bg-white shadow',
          checked ? 'left-6' : 'left-1',
        )}
      />
    </button>
  );
}
