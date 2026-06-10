import { useEffect, useState } from 'react';
import { countdown } from '../../lib/format';

export function useNow(intervalMs = 1000) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

export function Countdown({ to, compact }: { to: string; compact?: boolean }) {
  useNow(1000);
  const c = countdown(to);
  if (compact) {
    if (c.days > 0) return <span className="tnum">{c.days}d {c.hours}h</span>;
    return <span className="tnum">{c.hours}h {String(c.minutes).padStart(2, '0')}m</span>;
  }
  const Unit = ({ v, l }: { v: number; l: string }) => (
    <div className="text-center">
      <div className="text-2xl font-bold font-display tnum tabular-nums">{String(v).padStart(2, '0')}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{l}</div>
    </div>
  );
  return (
    <div className="flex items-center gap-3">
      <Unit v={c.days} l="days" />
      <span className="text-xl text-slate-600 -mt-2">:</span>
      <Unit v={c.hours} l="hrs" />
      <span className="text-xl text-slate-600 -mt-2">:</span>
      <Unit v={c.minutes} l="min" />
      <span className="text-xl text-slate-600 -mt-2">:</span>
      <Unit v={c.seconds} l="sec" />
    </div>
  );
}
