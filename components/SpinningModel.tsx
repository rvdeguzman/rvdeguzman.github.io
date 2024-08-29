// 3d model attribution: Construction sign by koen caspers [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/4v9QhryzBwT)
// Construction sign by koen caspers [CC-BY] via Poly Pizza
"use client";

import React, { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const modelUrl = "./models/construction_sign.glb";

const loader = new GLTFLoader();

const SpinningModel: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Enable alpha (transparency)
    });

    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        scene.add(model);

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Adjust camera position based on model size
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        camera.position.z = cameraZ * 1.5;

        camera.updateProjectionMatrix();
        console.log("Model loaded and positioned");
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      if (sceneRef.current && cameraRef.current && modelRef.current) {
        modelRef.current.rotation.y += 0.0025;
        renderer.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ background: "transparent" }} />;
};

export default SpinningModel;
