"use client";
import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// Attribution: Construction sign by koen caspers [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/4v9QhryzBwT)
const modelUrl = "./models/construction_sign.glb";
const loader = new GLTFLoader();

// Pixelation shader definition
const PixelShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(400, 400) },
    pixelSize: { value: 3 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
  uniform sampler2D tDiffuse;
  uniform vec2 resolution;
  uniform float pixelSize;
  varying vec2 vUv;
  
  void main() {
    vec2 cellSize = vec2(pixelSize) / resolution;
    vec2 cell = floor(vUv / cellSize);
    vec2 uv = cellSize * (cell + 0.5);
    
    vec4 texColor = texture2D(tDiffuse, uv);
    
    // Preserve original colors with pixelation
    gl_FragColor = texColor;
  }
`
};

const SpinningModel = () => {
  // Explicitly type all refs
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Mouse interaction state
  const mouseDownRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const momentumRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef<number>(0);
  const interactingRef = useRef<boolean>(false);
  const damping = 0.95;
  const defaultRotationSpeed = 0.0025; // Original rotation speed
  const inactivityThreshold = 0.350; // Time in ms before returning to default rotation

  useEffect(() => {
    // Critical null check - TypeScript needs this
    if (!mountRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setClearColor(0x080808, 1); // Set explicit background color to #080808
    renderer.setSize(400, 400);

    // Use safe DOM manipulation with null check
    const mountElement = mountRef.current;
    if (mountElement) {
      mountElement.appendChild(renderer.domElement);
    }

    // Enhance lighting for better model definition
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Add backlight for better definition
    const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
    backLight.position.set(-1, 0.5, -1).normalize();
    scene.add(backLight);

    // Set up post-processing
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Create pixelation pass
    const pixelPass = new ShaderPass(PixelShader);
    composer.addPass(pixelPass);

    // Load model
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.25, 1, 1);

        modelRef.current = model;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        camera.position.z = cameraZ * 1.75;
        camera.updateProjectionMatrix();
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      mouseDownRef.current = true;
      interactingRef.current = true;
      previousMousePositionRef.current.x = e.clientX;
      previousMousePositionRef.current.y = e.clientY;
      // Reset momentum when starting interaction
      momentumRef.current = { x: 0, y: 0 };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDownRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      // Only track horizontal movement (x-axis)

      // Update velocity (only x)
      velocityRef.current.x = deltaX * 0.01;
      velocityRef.current.y = 0; // Ignore vertical movement

      // Apply rotation directly based on mouse movement (only y rotation)
      if (modelRef.current) {
        modelRef.current.rotation.y += velocityRef.current.x;
        // No x rotation (which would be vertical tilting)
      }

      // Update momentum (only x)
      momentumRef.current.x = velocityRef.current.x;
      momentumRef.current.y = 0; // No vertical momentum

      // Update previous position
      previousMousePositionRef.current.x = e.clientX;
      previousMousePositionRef.current.y = e.clientY; // Still track y for consistent behavior

      // Update last interaction time
      lastInteractionTimeRef.current = Date.now();
    };

    const handleMouseUp = () => {
      mouseDownRef.current = false;
      // Keep momentum
    };

    const handleMouseLeave = () => {
      mouseDownRef.current = false;
    };

    // Safe event listener attachment with null checks
    const rendererDomElement = renderer.domElement;
    if (rendererDomElement) {
      rendererDomElement.addEventListener('mousedown', handleMouseDown);
      rendererDomElement.addEventListener('mouseleave', handleMouseLeave);
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (sceneRef.current &&
        cameraRef.current &&
        modelRef.current &&
        composerRef.current) {
        const currentTime = Date.now();
        const timeSinceLastInteraction = currentTime - lastInteractionTimeRef.current;

        // Apply momentum with damping
        if (Math.abs(momentumRef.current.x) > 0.0001) {
          // We have momentum, apply it (horizontal only)
          modelRef.current.rotation.y += momentumRef.current.x;
          // No vertical rotation

          // Dampen momentum
          momentumRef.current.x *= damping;
          // No need to dampen y as it's always zero

          // Indicate we're still in interactive mode (momentum is active)
          interactingRef.current = true;
          lastInteractionTimeRef.current = currentTime;
        } else if (timeSinceLastInteraction > inactivityThreshold) {
          // If inactive for threshold time, return to default rotation
          interactingRef.current = false;
          // Apply default rotation only if no longer interacting
          modelRef.current.rotation.y += defaultRotationSpeed;
        }

        // Use composer instead of renderer to apply the pixelation effect
        composerRef.current.render();
      }
    };

    animate();

    // Cleanup with null checks
    return () => {
      // Safe cleanup for DOM elements
      const mount = mountRef.current;
      const renderer = rendererRef.current;
      if (mount && renderer && renderer.domElement) {
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }

      // Remove event listeners safely
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return <div ref={mountRef} style={{ background: "transparent", cursor: "grab" }} />;
};

export default SpinningModel;
