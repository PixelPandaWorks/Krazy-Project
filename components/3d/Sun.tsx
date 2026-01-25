"use client";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export function Sun() {
  const texture = useLoader(THREE.TextureLoader, "/sun.jpg");
  return (
    <mesh>
      <sphereGeometry args={[4, 64, 64]} />
      <meshStandardMaterial 
        map={texture} 
        emissiveMap={texture} 
        emissiveIntensity={2} 
        emissive={new THREE.Color("#ffffff")} 
      />
      <pointLight intensity={3} distance={200} decay={1} castShadow />
    </mesh>
  );
}
