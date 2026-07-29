import { Composition } from 'remotion';
import { CubesLayer } from './CubesLayer';

export const TechBackground: React.FC = () => {
    return <CubesLayer />;
};

export const TechBackgroundComposition = () => (
    <Composition
        id="TechBackground"
        component={TechBackground}
        durationInFrames={600} // 10 detik * 60 fps
        fps={60}
        width={3840}
        height={2160}
    />
);