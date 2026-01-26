"use client";

import React from "react";
import { constellations, Star } from "@/lib/data/constellations";
import { Line, Sphere, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

interface ConstellationsProps {
  radius?: number;
}

export function Constellations({ radius = 900 }: ConstellationsProps) {
  const [hoveredConstellation, setHoveredConstellation] = React.useState<string | null>(null);
  const hoverTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handlePointerOver = (e: any, name: string) => {
    e.stopPropagation();
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredConstellation(name);
  };

  const handlePointerOut = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredConstellation(null);
    }, 100);
  };

  // Convert spherical coordinates (RA/Dec) to Cartesian (x, y, z)
  const getPosition = (star: Star) => {
    const phi = (90 - star.dec) * (Math.PI / 180);
    const theta = (star.ra / 180) * Math.PI;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  };

  return (
    <group>
      {constellations.map((constellation) => {
        const starPositions = constellation.stars.map(star => getPosition(star));
        const isHovered = hoveredConstellation === constellation.name;
        const color = "#00BFFF"; // Bright Deep Sky Blue

        // Calculate center for label
        const center = new THREE.Vector3();
        starPositions.forEach(pos => center.add(pos));
        center.divideScalar(starPositions.length);
        
        return (
          <group key={constellation.name}>
            {/* Stars */}
            {constellation.stars.map((star, sIndex) => (
              <group key={star.name} position={starPositions[sIndex]}>
                {/* Visual Star */}
                <mesh>
                  <sphereGeometry args={[star.magnitude < 1 ? 2 : star.magnitude < 2 ? 1.5 : 1, 8, 8]} />
                  <meshBasicMaterial 
                    color={color}
                    transparent 
                    opacity={isHovered ? 1 : 0.8} 
                  />
                </mesh>
                
                {/* Hit Box (Invisible Sphere for interaction) */}
                <mesh 
                  onPointerOver={(e) => handlePointerOver(e, constellation.name)} 
                  onPointerOut={handlePointerOut}
                >
                  <sphereGeometry args={[25, 8, 8]} />
                  <meshBasicMaterial transparent opacity={0} depthWrite={false} color="red" side={THREE.DoubleSide} /> 
                </mesh>
              </group>
            ))}

            {/* Lines */}
            {constellation.connections.map((connection, lIndex) => {
              const start = starPositions[connection[0]];
              const end = starPositions[connection[1]];
              return (
                <Line
                  key={lIndex}
                  points={[start, end]}
                  color={color}
                  opacity={isHovered ? 0.6 : 0.2}
                  transparent
                  lineWidth={isHovered ? 2 : 1}
                />
              );
            })}
            
            {/* Label - Only visible on hover */}
            {isHovered && (
              <Billboard position={center} follow={true} lockX={false} lockY={false} lockZ={false}>
                 <Text
                    color="white"
                    fontSize={15}
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={1}
                 >
                    {constellation.name.split(" (")[0].toUpperCase()}
                 </Text>
              </Billboard>
            )}
          </group>
        );
      })}
    </group>
  );
}
