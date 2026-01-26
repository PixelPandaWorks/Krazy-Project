"use client";

import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export const Sun = React.forwardRef<THREE.Mesh>((props, ref) => {
  const texture = useLoader(THREE.TextureLoader, "/sun.jpg");
  
  return (
    <mesh ref={ref} {...props}>
      <sphereGeometry args={[4, 128, 128]} />
      <meshStandardMaterial 
        map={texture} 
        emissiveMap={texture} 
        emissiveIntensity={1} 
        emissive={new THREE.Color("#ffffff")} 
      />
      <pointLight intensity={3} distance={100} decay={0} castShadow shadow-mapSize={[2048, 2048]} />
    </mesh>
  );
});

Sun.displayName = "Sun";
