"use client";

import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useEffect } from "react";

export function Comet() {
  const cometGroup = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);
  
  const state = useRef({
    nextSpawn: 0,
    startTime: 0,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    duration: 8 // seconds
  });

  useEffect(() => {
    // Initial spawn delay: 10 seconds after mount
    state.current.nextSpawn = 10;
  }, []);

  useFrame((rootState) => {
    const time = rootState.clock.getElapsedTime();
    const s = state.current;

    // Check for spawn
    if (!active && time >= s.nextSpawn) {
        // Spawn logic
        spawn(time);
        setActive(true);
    }

    // Animate
    if (active && cometGroup.current) {
        const elapsed = time - s.startTime;
        const progress = elapsed / s.duration;

        if (progress >= 1) {
            setActive(false);
            // Schedule next: 60 seconds from now
            s.nextSpawn = time + 60;
        } else {
            // Move comet
            cometGroup.current.position.lerpVectors(s.startPos, s.endPos, progress);
            
            // Optional: Rotate comet to face direction?
            // Since it's a sphere + trail, maybe not strictly needed, but if we had a head mesh...
            cometGroup.current.lookAt(s.endPos);
        }
    }
  });

  const spawn = (currentTime: number) => {
      const radius = 400; // Start distance
      
      // 1. Pick a random start point on the sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const start = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
      
      // 2. Pick a random target point near the center (Solar System core)
      // This ensures the comet passes through the view
      const target = new THREE.Vector3(
          (Math.random() - 0.5) * 50, // x spread
          (Math.random() - 0.5) * 10, // y spread (flatter plane)
          (Math.random() - 0.5) * 50  // z spread
      );
      
      // 3. Calculate direction vector
      const direction = new THREE.Vector3().subVectors(target, start).normalize();
      
      // 4. Calculate end point (exit point)
      // Ray: start + t * direction
      // We want to go past the target to the other side of the "sphere"
      // Distance to target is roughly radius. Total distance ~ 2 * radius.
      const end = new THREE.Vector3().copy(start).add(direction.multiplyScalar(radius * 2.5));

      state.current.startPos.copy(start);
      state.current.endPos.copy(end);
      state.current.startTime = currentTime;
      
      console.log("☄️ Comet incoming!", start, "->", end);
  };

  if (!active) return null;

  return (
    <group ref={cometGroup}>
      {/* Trail Effect */}
      <Trail
        width={4}
        length={12}
        color={new THREE.Color("#00ffff")}
        attenuation={(t) => t} // Taper off
      >
        {/* Comet Head */}
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </Trail>
      
      {/* Outer Glow Sprite/Mesh */}
      <mesh>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}
