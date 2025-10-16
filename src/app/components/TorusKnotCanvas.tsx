"use client";

import { Canvas } from "@react-three/fiber";
import { AsciiRenderer, OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";
import Torusknot from "../torusKnot";

export default function TorusKnotCanvas() {
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
        <div className="h-80 w-full max-w-2xl mx-auto">
            <Canvas>
                <color attach="background" args={['black']} />
                <ambientLight intensity={0.75} />
                <directionalLight position={[500, 10, 20]} intensity={10} />
                <Torusknot />
                <AsciiRenderer
                    fgColor="red"
                    bgColor="transparent"
                    characters=" .:-+*=%@#"
                />
                <OrbitControls enableZoom={false} minDistance={3.5} maxDistance={3} />
            </Canvas>
        </div>
    );
}
