"use client";

import { useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useState, useRef } from "react";
import * as THREE from "three";

export default function Torusknot(props: object) {
    const { resolvedTheme } = useTheme();
    const ref = useRef<THREE.Mesh>(null);
    const [, hover] = useState(false);
    useFrame((state, delta) => {
        ref.current!.rotation.y += delta / 2;
    });
    return (
        <>
            <mesh
                {...props}
                ref={ref}
                scale={1}
                onPointerOver={() => hover(true)}
                onPointerOut={() => hover(false)}
            >
                <cylinderGeometry args={[1, 1, 2, 3]} />
                <meshStandardMaterial color={resolvedTheme === "dark" ? "aqua" : "coral"} />
            </mesh>
        </>
    );
}
