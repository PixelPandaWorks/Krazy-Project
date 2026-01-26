"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { Html, useTexture } from "@react-three/drei";

interface NEO {
  id: string;
  name: string;
  diameter_min: number;
  diameter_max: number;
  velocity: number;
  miss_distance: number;
  position: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
}

export function AsteroidField() {
  const { isDefenseMode, incrementScore } = useStore();
  const [asteroids, setAsteroids] = useState<NEO[]>([]);
  const meshRefs = useRef<{[key: string]: THREE.Mesh}>({});
  const groupRef = useRef<THREE.Group>(null!);
  
  // Load asteroid texture
  const asteroidTexture = useTexture("/asteroid.jpg");
  asteroidTexture.wrapS = asteroidTexture.wrapT = THREE.RepeatWrapping;

  // Fetch NASA Data
  useEffect(() => {
    if (!isDefenseMode) {
        setAsteroids([]);
        return;
    }

    const fetchNEO = async () => {
        try {
            // Using DEMO_KEY for convenience. 
            // In a real app, this should be proxied to hide the key or use a user env var.
            const today = new Date().toISOString().split('T')[0];
            const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`);
            const data = await res.json();
            
            const neos: NEO[] = [];
            const elementCount = data.element_count;
            const objects = Object.values(data.near_earth_objects)[0] as any[]; // Get today's list

            objects.forEach((obj: any) => {
                // Map real data to game world
                // Real space is huge, so we normalize to our scene scale (~50-100 units around Earth)
                
                // Random spherical position around Earth (radius 25-60)
                const radius = 30 + Math.random() * 30;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                neos.push({
                    id: obj.id,
                    name: obj.name,
                    diameter_min: obj.estimated_diameter.meters.estimated_diameter_min,
                    diameter_max: obj.estimated_diameter.meters.estimated_diameter_max,
                    velocity: parseFloat(obj.close_approach_data[0].relative_velocity.kilometers_per_hour),
                    miss_distance: parseFloat(obj.close_approach_data[0].miss_distance.kilometers),
                    position: new THREE.Vector3(x, y, z),
                    rotationSpeed: new THREE.Vector3(Math.random() * 0.02, Math.random() * 0.02, Math.random() * 0.02)
                });
            });
            
            setAsteroids(neos);
        } catch (error) {
            console.error("Failed to fetch NASA NEO data:", error);
        }
    };

    fetchNEO();
  }, [isDefenseMode]);

  useFrame(() => {
      if (!isDefenseMode) return;
      
      // Rotate asteroids
      asteroids.forEach(asteroid => {
          const mesh = meshRefs.current[asteroid.id];
          if (mesh) {
              mesh.rotation.x += asteroid.rotationSpeed.x;
              mesh.rotation.y += asteroid.rotationSpeed.y;
              mesh.rotation.z += asteroid.rotationSpeed.z;
          }
      });
  });

  const handleDeflect = (id: string, e: any) => {
      e.stopPropagation();
      // Visual feedback handled by state removal
      setAsteroids(prev => prev.filter(a => a.id !== id));
      incrementScore();
      
      // Optional: Add explosion effect here later
  };

  if (!isDefenseMode) return null;

  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid) => (
        <group key={asteroid.id} position={asteroid.position}>
             {/* Asteroid Mesh */}
            <mesh 
                ref={(el) => { if (el) meshRefs.current[asteroid.id] = el; }}
                onClick={(e) => handleDeflect(asteroid.id, e)}
                onPointerOver={() => document.body.style.cursor = 'crosshair'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                {/* Dodecahedron looks rocky */}
                <dodecahedronGeometry args={[Math.max(0.5, asteroid.diameter_max / 100), 0]} /> 
                <meshStandardMaterial 
                    map={asteroidTexture}
                    roughness={0.9} 
                    metalness={0.1} 
                    flatShading 
                    bumpMap={asteroidTexture}
                    bumpScale={0.1}
                />
            </mesh>
            
            {/* Info Label (Only visible on hover ideally, but messy in R3F loop. Let's keep it simple) */}
            <Html distanceFactor={15} center>
                <div className="pointer-events-none opacity-50 text-[10px] text-red-500 font-mono bg-black/50 px-1 rounded border border-red-500/20 whitespace-nowrap">
                    ⚠️ {asteroid.name}
                </div>
            </Html>
        </group>
      ))}
    </group>
  );
}
