import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const Intro = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 30], [0.9, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0b14', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: 'white', fontSize: 120, fontFamily: 'sans-serif', opacity, transform: `scale(${scale})` }}>
        StudyArena
      </h1>
    </AbsoluteFill>
  );
};
