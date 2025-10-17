"use client";

import { Canvas } from "@react-three/fiber";
import { AsciiRenderer } from "@react-three/drei";
import { useState, useEffect } from "react";

import TextToModel from "./TextToModel";

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
                    fov: 35,
                    position: [0, 0.111, 5],
                    rotation: [-Math.PI * 0.02, 0, 0],
                }}>
                    <color attach="background" args={['black']} />
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[50, 30, 50]} intensity={10} />
                    <TextToModel text="Ω" size={1} height={0.1} scaleY={1.2} scaleX={5.3} rotateX={false} />
                    <AsciiRenderer
                        fgColor="red"
                        bgColor="transparent"
                        characters=" .:-+*=%@#"
                        resolution={0.333}
                    />
                </Canvas>
            </div>
        </div >
    );
}
