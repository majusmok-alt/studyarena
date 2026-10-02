import { Composition } from 'remotion';
import { Intro } from './Intro';

export const RemotionRoot = () => (
  <Composition id="Intro" component={Intro} durationInFrames={90} fps={30} width={1080} height={1920} />
);
