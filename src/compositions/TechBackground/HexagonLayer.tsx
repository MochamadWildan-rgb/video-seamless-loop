import React, { useRef, useEffect, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface HexagonLayerProps {
  count: number;
  speed: number;
  color: string;
}

// A simple deterministic pseudo-random generator
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const HexagonLayer: React.FC<HexagonLayerProps> = ({ count, speed, color }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate hexagons deterministically and memoize them
  const hexagons = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = i * 47;
      const xInit = pseudoRandom(seed) * width;
      const yInit = pseudoRandom(seed + 1) * height;
      const radius = 60 + pseudoRandom(seed + 2) * 140; // Size between 60px and 200px
      const angle = pseudoRandom(seed + 3) * Math.PI * 2;
      const pulseSpeed = 0.01 + pseudoRandom(seed + 4) * 0.03;
      const rotationSpeed = (pseudoRandom(seed + 5) > 0.5 ? 1 : -1) * (0.001 + pseudoRandom(seed + 5) * 0.003);
      const opacity = 0.08 + pseudoRandom(seed + 6) * 0.15; // Soft opacity
      return { xInit, yInit, radius, angle, pulseSpeed, rotationSpeed, opacity };
    });
  }, [count, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    hexagons.forEach((h) => {
      // Calculate current position with wrapping
      const distance = frame * speed;
      let x = (h.xInit + Math.cos(h.angle) * distance) % width;
      let y = (h.yInit + Math.sin(h.angle) * distance) % height;

      if (x < 0) x += width;
      if (y < 0) y += height;

      // Pulse the radius slightly over time
      const currentRadius = h.radius * (1 + Math.sin(frame * h.pulseSpeed) * 0.12);
      
      // Calculate rotation
      const baseRotation = frame * h.rotationSpeed;

      // Draw the hexagon path
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const sideAngle = (Math.PI / 3) * i + baseRotation;
        const hx = x + currentRadius * Math.cos(sideAngle);
        const hy = y + currentRadius * Math.sin(sideAngle);
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();

      // Style and stroke
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = h.opacity;
      ctx.stroke();
    });

    ctx.globalAlpha = 1.0;
  }, [frame, speed, color, width, height, hexagons]);

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
