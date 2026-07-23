import React, { useRef, useEffect, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface ParticleLayerProps {
  count: number;
  speed: number;
  color: string;
  minSize: number;
  maxSize: number;
}

// A simple deterministic pseudo-random generator based on sine wave
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const ParticleLayer: React.FC<ParticleLayerProps> = ({
  count,
  speed,
  color,
  minSize,
  maxSize,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate particles array deterministically and memoize it
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = i * 37;
      const xInit = pseudoRandom(seed) * width;
      const yInit = pseudoRandom(seed + 1) * height;
      const size = minSize + pseudoRandom(seed + 2) * (maxSize - minSize);
      const angle = pseudoRandom(seed + 3) * Math.PI * 2;
      const opacity = 0.3 + pseudoRandom(seed + 4) * 0.7;
      return { xInit, yInit, size, angle, opacity };
    });
  }, [count, minSize, maxSize, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      // Calculate current position with wrapping
      const distance = frame * speed;
      let x = (p.xInit + Math.cos(p.angle) * distance) % width;
      let y = (p.yInit + Math.sin(p.angle) * distance) % height;

      if (x < 0) x += width;
      if (y < 0) y += height;

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
  }, [frame, speed, color, width, height, particles]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};
