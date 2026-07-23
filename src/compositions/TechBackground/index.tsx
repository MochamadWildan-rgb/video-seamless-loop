import React from 'react';
import { AbsoluteFill, Loop, useVideoConfig } from 'remotion';
import { CubesLayer } from './CubesLayer';
import { GridLayer } from './GridLayer';
import { ParticleLayer } from './ParticleLayer';
import { HexagonLayer } from './HexagonLayer';

export const TechBackground: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const gridColor = 'rgba(0, 191, 255, 0.5)';
  const particleColor = 'rgba(0, 191, 255, 0.7)';
  const hexagonColor = 'rgba(0, 191, 255, 0.8)';

  return (
    <AbsoluteFill style={{ backgroundColor: '#010409' }}>
      <Loop durationInFrames={durationInFrames}>
        <GridLayer color={gridColor} lineWidth={1} />
        <ParticleLayer
          count={200}
          speed={0.3}
          color={particleColor}
          minSize={0.5}
          maxSize={2}
        />
        <HexagonLayer count={10} speed={0.2} color={hexagonColor} />
        <CubesLayer />
      </Loop>
    </AbsoluteFill>
  );
};