import { useEffect, useRef, useState } from 'react';
import { fmtNumber } from '../../lib/format';

interface Props {
  to: number;
  from?: number;
  duration?: number; // ms
  format?: (n: number) => string;
  className?: string;
}

/** Animated number rollup used for XP/coins/stats reveals. */
export function CountUp({ to, from = 0, duration = 900, format = fmtNumber, className }: Props) {
  const [val, setVal] = useState(from);
  const raf = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(from + (to - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [to, from, duration]);

  return <span className={className}>{format(Math.round(val))}</span>;
}
