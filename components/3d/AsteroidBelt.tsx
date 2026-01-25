"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const count = 2000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random asteroid data once
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Position between Mars (25) and Jupiter (35)
      const angle = Math.random() * Math.PI * 2;
      const radius = 28 + Math.random() * 5; // Band between 28 and 33
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 2; // Vertical spread
      
      const scale = 0.1 + Math.random() * 0.4; // Random sizes
      
      temp.push({ x, y, z, scale, rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number] });
    }
    return temp;
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      asteroids.forEach((data, i) => {
        dummy.position.set(data.x, data.y, data.z);
        dummy.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2]);
        dummy.scale.set(data.scale, data.scale, data.scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [asteroids, dummy]);

  useFrame(() => {
    if (meshRef.current) {
      // Rotate the entire belt slowly
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#666666" roughness={0.8} />
    </instancedMesh>
  );
}
