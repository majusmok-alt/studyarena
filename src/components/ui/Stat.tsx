import { clsx } from '../../lib/format';
import { Icon } from './Icon';

interface Props {
  icon: string;
  label: string;
  value: React.ReactNode;
  tint?: string; // hex
  className?: string;
}

export function Stat({ icon, label, value, tint = '#8587fb', className }: Props) {
  return (
    <div className={clsx('rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3', className)}>
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="grid place-items-center w-7 h-7 rounded-lg"
          style={{ backgroundColor: `${tint}22`, color: tint }}
        >
          <Icon name={icon} size={15} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      </div>
      <div className="text-xl font-bold font-display tnum">{value}</div>
    </div>
  );
}
