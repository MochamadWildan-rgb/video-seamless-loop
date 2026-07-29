import './style.css';
import { Composition } from 'remotion';
import { TechBackground } from './compositions/TechBackground';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CubesLayer"
        component={TechBackground}
        durationInFrames={600}
        fps={60}
        width={3840}
        height={2160}
      />
    </>
  );
};
