"use client";

import { Canvas } from "@react-three/fiber";
import { AsciiRenderer, OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";
import ModelLoader from "./ModelLoader";
import TextToModel from "./TextToModel";

export default function TorusKnotCanvas() {
    const [mounted, setMounted] = useState(false);
    const [useText, setUseText] = useState(false);

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
            <div className="mb-4 text-center">
                <button
                    onClick={() => setUseText(!useText)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    {useText ? 'Show GLB Model' : 'Show Text Model'}
                </button>
            </div>
            <div className="h-80">
                <Canvas>
                    <color attach="background" args={['black']} />
                    <ambientLight intensity={0.75} />
                    <directionalLight position={[500, 10, 20]} intensity={10} />
                    <TextToModel text="</>" size={0.6} height={0.15} />
                    <AsciiRenderer
                        bgColor="transparent"
                        characters=" .:-+*=%@#"
                        resolution={0.2}
                    />
                    <OrbitControls enableZoom={false} minDistance={1} maxDistance={1} />
                </Canvas>
            </div>
        </div>
    );
}
