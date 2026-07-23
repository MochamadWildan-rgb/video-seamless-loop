import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { random } from 'remotion';

const CUBE_COUNT = 30;

interface CubeInfo {
    x: number;
    y: number;
    size: number;
    initialRotationX: number;
    initialRotationY: number;
    rotationSpeedX: number;
    rotationSpeedY: number;
    rotationSpeedZ: number;
}

const Cube: React.FC<{
    size: number;
    rotation: { x: number; y: number; z: number };
}> = ({ size, rotation }) => {
    const faceStyle: React.CSSProperties = {
        position: 'absolute',
        width: size,
        height: size,
        border: '1px solid rgba(0, 191, 255, 0.15)',
        backgroundColor: 'rgba(0, 40, 70, 0.1)',
    };

    return (
        <div
            style={{
                width: size,
                height: size,
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
            }}
        >
            <div
                style={{ ...faceStyle, transform: `rotateY(0deg) translateZ(${size / 2}px)` }}
            />
            <div
                style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${size / 2}px)` }}
            />
            <div
                style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${size / 2}px)` }}
            />
            <div
                style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${size / 2}px)` }}
            />
            <div
                style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${size / 2}px)` }}
            />
            <div
                style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${size / 2}px)` }}
            />
        </div>
    );
};

export const CubesLayer: React.FC = () => {
    const { width, height, durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();

    const cubes = React.useMemo((): CubeInfo[] => {
        return Array.from({ length: CUBE_COUNT }).map((_, i) => ({
            x: random(`cube-x-${i}`) * width,
            y: random(`cube-y-${i}`) * height,
            size: random(`cube-size-${i}`) * 80 + 20,
            initialRotationX: random(`cube-rotX-${i}`) * 360,
            initialRotationY: random(`cube-rotY-${i}`) * 360,
            rotationSpeedX: (random(`cube-speedX-${i}`) - 0.5) * 0.5,
            rotationSpeedY: (random(`cube-speedY-${i}`) - 0.5) * 0.5,
            rotationSpeedZ: (random(`cube-speedZ-${i}`) - 0.5) * 0.5,
        }));
    }, [width, height]);

    return (
        <AbsoluteFill style={{ perspective: '1000px' }}>
            {cubes.map((cube, i) => {
                const progress = frame / durationInFrames;

                // Ensure the rotation completes a full 360-degree cycle for a seamless loop
                const rotationX = cube.initialRotationX + progress * 360 * Math.sign(cube.rotationSpeedX);
                const rotationY = cube.initialRotationY + progress * 360 * Math.sign(cube.rotationSpeedY);
                const rotationZ = progress * 360 * Math.sign(cube.rotationSpeedZ);

                return (
                    <div key={i} style={{ position: 'absolute', left: cube.x, top: cube.y }}>
                        <Cube size={cube.size} rotation={{ x: rotationX, y: rotationY, z: rotationZ }} />
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};