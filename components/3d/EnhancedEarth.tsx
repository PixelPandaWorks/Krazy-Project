"use client";

import { useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { planets } from "@/lib/data/planets";

export function EnhancedEarth() {
  const orbitRef = useRef<THREE.Group>(null!);
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const { setSelectedPlanet } = useStore();

  const earthData = planets.find(p => p.name === "Earth")!;

  // Load all Earth textures
  const dayTexture = useLoader(THREE.TextureLoader, "/earth_day.png");
  const nightTexture = useLoader(THREE.TextureLoader, "/earth_night.png");
  const cloudsTexture = useLoader(THREE.TextureLoader, "/earth_clouds.png");
  const moonTexture = useLoader(THREE.TextureLoader, "/moon.jpg");

  // Earth parameters
  const distance = 20;
  const speed = 1;
  const size = 0.8;

  useFrame((state) => {
    if (orbitRef.current) {
      // Orbital rotation
      orbitRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.1;
    }
    if (earthRef.current) {
      // Axial rotation (Earth day)
      earthRef.current.rotation.y += 0.002;
    }
    if (cloudsRef.current) {
      // Clouds rotate slightly faster than Earth
      cloudsRef.current.rotation.y += 0.0025;
    }
  });

  return (
    <group>
      {/* Orbit Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.1, distance + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Orbit Group */}
      <group ref={orbitRef}>
        {/* Earth System Group */}
        <group position={[distance, 0, 0]}>
          
          {/* Main Earth - Day side with emissive night lights */}
          <mesh 
            ref={earthRef}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }} 
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
            onClick={() => setSelectedPlanet(earthData)}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial 
              map={dayTexture}
              emissiveMap={nightTexture}
              emissive={new THREE.Color("#ffffff")}
              emissiveIntensity={hovered ? 0.8 : 0.3}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>

          {/* Cloud Layer - slightly larger, semi-transparent */}
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[size + 0.02, 64, 64]} />
            <meshStandardMaterial 
              map={cloudsTexture}
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>

          {/* Atmosphere Glow - outer transparent sphere */}
          <mesh>
            <sphereGeometry args={[size + 0.08, 32, 32]} />
            <meshBasicMaterial 
              color="#4da6ff"
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Outer Atmosphere Ring (Fresnel-like effect) */}
          <mesh>
            <sphereGeometry args={[size + 0.15, 32, 32]} />
            <meshBasicMaterial 
              color="#87ceeb"
              transparent
              opacity={0.08}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Moon */}
          <mesh position={[1.5, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial map={moonTexture} />
          </mesh>

          {/* Label */}
          {hovered && (
            <Html distanceFactor={25}>
              <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm select-none pointer-events-none whitespace-nowrap border border-cyan-400/50 shadow-lg">
                <div className="font-bold text-cyan-400">🌍 Earth</div>
                <div className="text-xs text-gray-300">The Blue Marble</div>
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}
