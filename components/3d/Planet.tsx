"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
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
  const { gl } = useThree();
  
  // Load texture if available
  const texture = useLoader(THREE.TextureLoader, planet.texture);
  const ringTexture = planet.ring ? useLoader(THREE.TextureLoader, planet.ring) : null;
  const moonTexture = planet.moon ? useLoader(THREE.TextureLoader, "/moon.jpg") : null;

  useEffect(() => {
    if (texture) {
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
    }
    if (ringTexture) {
      ringTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    }
    if (moonTexture) {
      moonTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    }
  }, [texture, ringTexture, moonTexture, gl]);

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
        <ringGeometry args={[planet.distance - 0.1, planet.distance + 0.1, 256]} />
        <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Planet Group (Handles Orbital Position) */}
      <group ref={ref}>
        {/* Actual Planet Mesh */}
        <group position={[planet.distance, 0, 0]}>
          <mesh 
            name={`planet-${planet.name}`}
            userData={{ planet }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }} 
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from passing through
              setSelectedPlanet(planet);
            }}
            castShadow
            receiveShadow
          >
            {/* Ultra High Resolution Geometry */}
            <sphereGeometry args={[planet.size, 128, 128]} />
            <meshStandardMaterial 
              map={texture} 
              color={hovered ? "#ffcece" : (planet.color || "#ffffff")} 
              roughness={planet.roughness ?? 0.5}
              metalness={planet.metalness ?? 0.0}
              envMapIntensity={0.8}
            />
          </mesh>

          <PlanetLabel planet={planet} visible={hovered} />

          {/* Moon (if added) */}
          {planet.moon && moonTexture && (
            <mesh position={[planet.size + 1.5, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.2, 64, 64]} />
              <meshStandardMaterial 
                map={moonTexture} 
                roughness={0.8} 
                metalness={0.0} 
              />
            </mesh>
          )}

          {/* Saturn Ring */}
          {planet.ring && ringTexture && (
            <mesh rotation={[-Math.PI / 2.5, 0, 0]} receiveShadow>
              <ringGeometry args={[planet.size + 0.5, planet.size + 2.5, 128]} />
              <meshStandardMaterial 
                map={ringTexture} 
                side={THREE.DoubleSide} 
                transparent 
                opacity={0.9} 
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}
