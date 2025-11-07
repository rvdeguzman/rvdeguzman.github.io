"use client";

import { useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useState, useRef, Suspense } from "react";
import * as THREE from "three";

interface TextToModelProps {
    text: string;
    font?: string;
    size?: number;
    thickness?: number;
    scale?: number;
    scaleY?: number;
    scaleX?: number;
    rotateY?: boolean;
    rotateX?: boolean;
    [key: string]: unknown;
}

function TextModel({ text, font, size = 0.5, thickness = 0.1, rotateY = true, rotateX = true, ...props }: TextToModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const textRef = useRef<THREE.Mesh>(null);
    const [, hover] = useState(false);
    const [centered, setCentered] = useState(false);

    useFrame((_, delta) => {
        if (groupRef.current && rotateY) {
            groupRef.current.rotation.y += delta / 2;
        }
        if (groupRef.current && rotateX) {
            groupRef.current.rotation.x += delta / 2;
        }
        if (textRef.current && !centered) {
            const geometry = textRef.current.geometry;
            if (geometry) {
                geometry.computeBoundingBox();
                const box = geometry.boundingBox;
                if (box) {
                    const centerX = (box.max.x + box.min.x) / 2;
                    const centerY = (box.max.y + box.min.y) / 2;
                    const centerZ = (box.max.z + box.min.z) / 2;
                    geometry.translate(-centerX, -centerY, -centerZ);
                    setCentered(true);
                }
            }
        }
    });

    return (
        <group {...props}>
            <group
                ref={groupRef}
                onPointerOver={() => hover(true)}
                onPointerOut={() => hover(false)}
            >
                <Text3D
                    ref={textRef}
                    font={font || '/fonts/iosevka.json'}
                    size={size}
                    height={thickness}
                    curveSegments={32}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelSegments={5}
                    position={[0, 0.08, 0]}
                >
                    {text}
                    <meshStandardMaterial />
                </Text3D>
            </group>
        </group>
    );
}

export default function TextToModel({ scale = 1, scaleY = 1, scaleX = 1, ...props }: TextToModelProps & { scale?: number; scaleY?: number }) {
    return (
        <group scale={[scale * scaleX, scale * scaleY, scale]}>
            <Suspense fallback={null}>
                <TextModel {...props} />
            </Suspense>
        </group>
    );
}

