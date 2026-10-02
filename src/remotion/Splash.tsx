import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const IMPACT_FRAME = 20;
const IMPACT_X = 540;
const IMPACT_Y = 1150;
const GRAVITY = 1.6; // px / frame²

const BRAND = '#6c63f5';
const ACCENT = '#3dd7e6';

type Droplet = { vx: number; vy: number; r: number; color: string; delay: number };

const DROPLETS: Droplet[] = Array.from({ length: 72 }, (_, i) => {
  // Mostly upward, fanned out to both sides like a crown splash.
  const angle = interpolate(random(`a${i}`), [0, 1], [-Math.PI * 0.95, -Math.PI * 0.05]);
  const speed = interpolate(random(`s${i}`), [0, 1], [22, 62]);
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: interpolate(random(`r${i}`), [0, 1], [8, 28]),
    color: random(`c${i}`) > 0.5 ? BRAND : ACCENT,
    delay: Math.floor(random(`d${i}`) * 4),
  };
});

const FallingDrop = ({ frame }: { frame: number }) => {
  if (frame >= IMPACT_FRAME) return null;
  const t = frame / IMPACT_FRAME;
  const y = interpolate(t * t, [0, 1], [-80, IMPACT_Y]);
  const stretch = 1 + t * 0.8;
  return <ellipse cx={IMPACT_X} cy={y} rx={34 / Math.sqrt(stretch)} ry={34 * stretch} fill={ACCENT} />;
};

const Droplets = ({ frame }: { frame: number }) => (
  <>
    {DROPLETS.map((d, i) => {
      const t = frame - IMPACT_FRAME - d.delay;
      if (t < 0) return null;
      const x = IMPACT_X + d.vx * t;
      const y = IMPACT_Y + d.vy * t + 0.5 * GRAVITY * t * t;
      if (y > IMPACT_Y + 40) return null; // fell back into the pool
      const r = d.r * interpolate(t, [0, 45], [1, 0.4], { extrapolateRight: 'clamp' });
      return <circle key={i} cx={x} cy={y} r={r} fill={d.color} />;
    })}
  </>
);

// The column of liquid that shoots up after impact (Worthington jet).
const Jet = ({ frame }: { frame: number }) => {
  const t = frame - IMPACT_FRAME - 6;
  if (t < 0) return null;
  const height = Math.max(0, 50 * t - 0.5 * GRAVITY * 1.4 * t * t);
  if (height <= 0 && t > 10) return null;
  const top = IMPACT_Y - height;
  return (
    <>
      <rect x={IMPACT_X - 26} y={top} width={52} height={height + 30} rx={26} fill={BRAND} />
      <circle cx={IMPACT_X} cy={top - 10} r={36} fill={BRAND} />
    </>
  );
};

const Pool = ({ frame }: { frame: number }) => {
  const t = frame - IMPACT_FRAME;
  if (t < 0) return null;
  // Spreads out on impact, then sinks back into the surface.
  const rx = interpolate(t, [0, 12, 60, 95], [40, 340, 240, 0], { extrapolateRight: 'clamp' });
  const ry = interpolate(t, [0, 12, 60, 95], [20, 70, 40, 0], { extrapolateRight: 'clamp' });
  if (rx <= 0) return null;
  return <ellipse cx={IMPACT_X} cy={IMPACT_Y + 20} rx={rx} ry={ry} fill={BRAND} />;
};

const Ripples = ({ frame }: { frame: number }) => (
  <>
    {[0, 10, 20].map((offset) => {
      const t = frame - IMPACT_FRAME - offset;
      if (t < 0) return null;
      const rx = 60 + t * 14;
      const opacity = interpolate(t, [0, 50], [0.8, 0], { extrapolateRight: 'clamp' });
      return (
        <ellipse
          key={offset}
          cx={IMPACT_X}
          cy={IMPACT_Y + 20}
          rx={rx}
          ry={rx * 0.22}
          fill="none"
          stroke={ACCENT}
          strokeWidth={6}
          opacity={opacity}
        />
      );
    })}
  </>
);

export const Splash = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame: frame - IMPACT_FRAME - 18, fps, config: { damping: 12, mass: 0.8 } });
  const flash = interpolate(frame, [IMPACT_FRAME, IMPACT_FRAME + 3, IMPACT_FRAME + 14], [0, 0.35, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#06070d' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          {/* Gooey filter: blur then sharpen alpha so nearby blobs merge like liquid. */}
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
          </filter>
          <radialGradient id="glow">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.5} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </radialGradient>
        </defs>

        <circle cx={IMPACT_X} cy={IMPACT_Y} r={700} fill="url(#glow)" opacity={flash} />
        <Ripples frame={frame} />
        <g filter="url(#goo)">
          <FallingDrop frame={frame} />
          <Pool frame={frame} />
          <Jet frame={frame} />
          <Droplets frame={frame} />
        </g>
      </svg>

      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 560 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Sora, sans-serif',
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: -4,
            background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 120}px) scale(${0.6 + titleIn * 0.4})`,
          }}
        >
          StudyArena
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
