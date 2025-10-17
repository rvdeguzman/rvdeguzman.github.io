"use client";

import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useState, useRef, Suspense } from "react";
import * as THREE from "three";

interface TextToModelProps {
    text: string;
    font?: string;
    size?: number;
    height?: number;
    scale?: number;
    rotateY?: boolean;
    [key: string]: unknown;
}

function TextModel({ text, font, size = 0.5, height = 0.1, rotateY = true, ...props }: TextToModelProps) {
    const { resolvedTheme } = useTheme();
    const groupRef = useRef<THREE.Group>(null);
    const [, hover] = useState(false);

    useFrame((_, delta) => {
        if (groupRef.current && rotateY) {
            groupRef.current.rotation.y += delta / 2;
        }
    });

    return (
        <group
            {...props}
            ref={groupRef}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
        >
            <Center>
                <Text3D
                    font={font || '/fonts/helvetiker_regular.typeface.json'}
                    size={size}
                    height={height}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelSegments={5}
                >
                    {text}
                    <meshStandardMaterial
                        color={resolvedTheme === "dark" ? "aqua" : "coral"}
                    />
                </Text3D>
            </Center>
        </group>
    );
}

export default function TextToModel({ scale = 1, ...props }: TextToModelProps & { scale?: number }) {
    return (
        <group scale={scale}>
            <Suspense fallback={null}>
                <TextModel {...props} />
            </Suspense>
        </group>
    );
}

