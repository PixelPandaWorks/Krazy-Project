"use client";

import { useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/lib/data/planets";
import { useStore } from "@/lib/store";
import { PlanetLabel } from "./PlanetLabel";

interface PlanetProps {
  planet: PlanetData;
}

export function Planet({ planet }: PlanetProps) {
  const ref = useRef<THREE.Group>(null!);
  const [hovered, setHover] = useState(false);
  const { setSelectedPlanet } = useStore();
  
  // Load texture if available
  const texture = useLoader(THREE.TextureLoader, planet.texture);
  const ringTexture = planet.ring ? useLoader(THREE.TextureLoader, planet.ring) : null;
  const moonTexture = planet.moon ? useLoader(THREE.TextureLoader, "/moon.jpg") : null;

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * planet.speed * 0.1;
      // Also rotate the planet on its axis
      const planetMesh = ref.current.children[0] as THREE.Group;
      if (planetMesh) {
          planetMesh.rotation.y += 0.005;
      }
    }
  });

  return (
    <group>
      {/* Orbit Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.distance - 0.1, planet.distance + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Planet Group (Handles Orbital Position) */}
      <group ref={ref}>
        {/* Actual Planet Mesh */}
        <group position={[planet.distance, 0, 0]}>
          <mesh 
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }} 
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
            onClick={() => setSelectedPlanet(planet)}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[planet.size, 64, 64]} />
            <meshStandardMaterial 
              map={texture} 
              color={hovered ? "#ffaaaa" : (planet.color || "#ffffff")} 
            />
          </mesh>

          <PlanetLabel planet={planet} visible={hovered} />

          {/* Moon (if added) */}
          {planet.moon && moonTexture && (
            <mesh position={[1.5, 0, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial map={moonTexture} />
            </mesh>
          )}

          {/* Saturn Ring */}
          {planet.ring && ringTexture && (
            <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
              <ringGeometry args={[planet.size + 0.5, planet.size + 2.0, 64]} />
              <meshBasicMaterial map={ringTexture} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}
