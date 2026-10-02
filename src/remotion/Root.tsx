import { Composition } from 'remotion';
import { Intro } from './Intro';
import { Splash } from './Splash';

export const RemotionRoot = () => (
  <>
    <Composition id="Intro" component={Intro} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="Splash" component={Splash} durationInFrames={120} fps={30} width={1080} height={1920} />
  </>
);
