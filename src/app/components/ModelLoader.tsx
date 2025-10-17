"use client";

import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";

interface ModelLoaderProps {
    modelPath: string;
    scale?: number;
    [key: string]: unknown;
}

export default function ModelLoader({ modelPath, scale = 1, ...props }: ModelLoaderProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [, hover] = useState(false);
    
    const gltf = useGLTF(modelPath);
    const scene = Array.isArray(gltf) ? gltf[0].scene : gltf.scene;

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta / 2;
        }
    });

    return (
        <group
            {...props}
            ref={groupRef}
            scale={scale}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
        >
            <primitive object={scene.clone()} />
        </group>
    );
}

useGLTF.preload('/ae86.glb');