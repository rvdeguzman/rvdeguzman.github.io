"use client";

import { Canvas } from "@react-three/fiber";
import { AsciiRenderer, OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";

import TextToModel from "./TextToModel";

export default function TextModelCanvas() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (
            <div className="h-80 w-full max-w-2xl mx-auto bg-black rounded flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="w-80 h-80 mx-auto">
                <Canvas camera={{
                    fov: 35,
                    position: [0, -0.333, 4],
                }}>
                    <color attach="background" args={['black']} />
                    <ambientLight intensity={0.75} />
                    <directionalLight position={[500, 10, 20]} intensity={10} />
                    <TextToModel text="Ω" size={1} height={0.15} scaleY={1} scaleX={5} rotateX={false} />
                    <AsciiRenderer
                        fgColor="red"
                        bgColor="transparent"
                        characters=" .:-+*=%@#"
                        resolution={0.22}
                    />
                </Canvas>
            </div>
        </div >
    );
}
