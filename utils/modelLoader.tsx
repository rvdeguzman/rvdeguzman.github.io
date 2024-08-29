import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const loadModel = (url: string): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error)
    );
  });
};
