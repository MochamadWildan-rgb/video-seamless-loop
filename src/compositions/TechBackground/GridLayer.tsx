import React, { useRef, useEffect } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface GridLayerProps {
  color: string;
  lineWidth: number;
}

export const GridLayer: React.FC<GridLayerProps> = ({ color, lineWidth }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const perspective = height * 0.8;
    const projectionCenterY = height * 0.45;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = 0.4;

    const numLines = 50;
    const lineSpacing = 40;
    const speed = 0.5;
    const progress = (frame * speed) % lineSpacing;

    // Draw horizontal lines (along Z-axis in 3D)
    for (let i = 0; i < numLines; i++) {
      const z = i * lineSpacing + progress;
      const scale = perspective / (perspective + z);
      const y = projectionCenterY + z * scale;

      if (y < height) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw vertical lines (along X-axis in 3D)
    const numVerticalLines = Math.floor(width / (lineSpacing * 2)) + 2;
    for (let i = -numVerticalLines; i <= numVerticalLines; i++) {
      const x = width / 2 + i * lineSpacing;

      const startZ = 0;
      const endZ = height;

      const startScale = perspective / (perspective + startZ);
      const startY = projectionCenterY + startZ * startScale;
      const startX = width / 2 + (x - width / 2) * startScale;

      const endScale = perspective / (perspective + endZ);
      const endY = projectionCenterY + endZ * endScale;
      const endX = width / 2 + (x - width / 2) * endScale;

      if (endY < height) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1.0;
  }, [frame, color, lineWidth, width, height]);

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
