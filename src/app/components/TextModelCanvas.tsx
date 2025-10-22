"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AsciiRenderer } from "@react-three/drei";
import { useState, useEffect } from "react";

import TextToModel from "./TextToModel";

function CameraOrbiter() {
    useFrame(({ camera }) => {
        const radius = 5;
        const speed = 0.8;
        const time = Date.now() * 0.001 * speed;

        camera.position.x = Math.cos(time) * radius;
        camera.position.z = Math.sin(time) * radius;
        camera.position.y = 0.111;
        camera.lookAt(0, 0, 0);
    });

    return null;
}

export default function TextModelCanvas() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (
            <div className="h-full w-full bg-black rounded flex items-center justify-center text-gray-500 min-h-0">
                ...
            </div>
        );
    }
    return (
        <div className="w-full h-full min-h-0 flex items-center justify-center">
            <div className="w-full h-full aspect-square max-w-sm max-h-sm">
                <Canvas camera={{
                    fov: 25
                }}>
                    <color attach="background" args={['black']} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[50, 30, 50]} intensity={7} />
                    <directionalLight position={[-50, 30, -50]} intensity={5} />
                    <CameraOrbiter />
                    <TextToModel text="</>" size={1} thickness={0.2} scaleY={1} scaleX={1} rotateX={false} rotateY={false} />
                    <AsciiRenderer
                        fgColor="#FEA84E"
                        bgColor="transparent"
                        characters=" .:-+*=%@#"
                    />
                </Canvas>
            </div>
        </div >
    );
}
