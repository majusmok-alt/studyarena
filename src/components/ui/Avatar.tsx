import { clsx } from '../../lib/format';

const GRADIENTS = [
  ['#6c63f5', '#16c5d8'],
  ['#fb7185', '#f5c451'],
  ['#34d399', '#06b6d4'],
  ['#c084fc', '#6c63f5'],
  ['#f59e0b', '#ef4444'],
  ['#22d3ee', '#3b82f6'],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const SIZES = { xs: 28, sm: 36, md: 44, lg: 60, xl: 92 } as const;

interface Props {
  username: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  frame?: string; // 'aurora' | 'gold' | 'default'
  online?: boolean;
  className?: string;
}

const FRAME_RING: Record<string, string> = {
  aurora: 'ring-2 ring-offset-2 ring-offset-ink-900 ring-brand-400',
  gold: 'ring-2 ring-offset-2 ring-offset-ink-900 ring-gold',
  diamond: 'ring-2 ring-offset-2 ring-offset-ink-900 ring-accent-400',
};

export function Avatar({ username, src, size = 'md', frame, online, className }: Props) {
  const px = SIZES[size];
  const g = GRADIENTS[hash(username) % GRADIENTS.length];
  const initials = username.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '??';

  return (
    <div className={clsx('relative inline-grid place-items-center', className)} style={{ width: px, height: px }}>
      <div
        className={clsx(
          'w-full h-full rounded-full overflow-hidden grid place-items-center font-bold text-white',
          frame && FRAME_RING[frame],
        )}
        style={{
          background: src ? undefined : `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
          fontSize: px * 0.36,
        }}
      >
        {src ? (
          <img src={src} alt={username} className="w-full h-full object-cover" />
        ) : (
          <span className="drop-shadow-sm">{initials}</span>
        )}
      </div>
      {online != null && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-ink-900',
            online ? 'bg-win' : 'bg-slate-500',
          )}
          style={{ width: px * 0.26, height: px * 0.26 }}
        />
      )}
    </div>
  );
}
