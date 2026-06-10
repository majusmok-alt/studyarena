interface Props {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}

/** Lightweight dependency-free area sparkline. */
export function Sparkline({
  data,
  width = 280,
  height = 64,
  stroke = '#8587fb',
  fill = 'rgba(108,99,245,0.18)',
  className,
}: Props) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const step = width / (data.length - 1 || 1);
  const pts = data.map((d, i) => [i * step, height - (d / max) * (height - 8) - 4] as const);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none" width="100%" height={height}>
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3.5 : 0} fill={stroke} />
      ))}
    </svg>
  );
}

interface BarsProps {
  data: number[];
  labels?: string[];
  height?: number;
  className?: string;
}

/** Vertical bar chart for weekly study minutes. */
export function MiniBars({ data, labels, height = 90, className }: BarsProps) {
  const max = Math.max(...data, 1);
  return (
    <div className={className} style={{ height }}>
      <div className="flex items-end justify-between gap-1.5 h-full">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
            <div className="w-full rounded-lg bg-gradient-to-t from-brand-600 to-accent-400 relative overflow-hidden"
              style={{ height: `${(d / max) * 100}%`, minHeight: d > 0 ? 6 : 3, opacity: d > 0 ? 1 : 0.25 }}
            >
              <div className="absolute inset-0 bg-white/10" />
            </div>
            {labels && <span className="text-[10px] text-slate-500 font-medium">{labels[i]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
