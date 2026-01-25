import { useThree, useFrame } from "@react-three/fiber";
import { planets } from "@/lib/data/planets";
import * as THREE from "three";
import { useState, useRef } from "react";
import { Html } from "@react-three/drei";

export function PlanetRadar() {
  const { camera, size } = useThree();
  const [indicators, setIndicators] = useState<Array<{ name: string; x: number; y: number; rotation: number; visible: boolean }>>([]);
  const frameCounter = useRef(0);

  useFrame((state) => {
    // Throttling to update HUD 30fps instead of 60+ for performance
    frameCounter.current += 1;
    if (frameCounter.current % 2 !== 0) return;

    const newIndicators = planets
      .map((planet) => {
        // 1. Calculate Planet World Position (Replicating Orbit Logic)
        const angle = state.clock.getElapsedTime() * planet.speed * 0.1;
        const x = Math.sin(angle) * planet.distance;
        const z = Math.cos(angle) * planet.distance;
        const position = new THREE.Vector3(x, 0, z); // Assuming planets are on XZ plane

        // 2. Project to Screen
        position.project(camera);

        const isOffScreen = position.x < -0.9 || position.x > 0.9 || position.y < -0.9 || position.y > 0.9 || position.z > 1;

        if (isOffScreen) {
          // Calculate screen edge position
          // We want the indicator to clamp to the screen edges
          let screenX = position.x;
          let screenY = position.y;
          
          // If behind camera, flip
          if (position.z > 1) {
            screenX *= -1;
            screenY *= -1; 
             // Note: This logic for "behind" needs care.
             // When z > 1, it's behind the camera. The projected x/y are inverted.
          }

          // Normalize to direction
          const angleToPlanet = Math.atan2(screenY, screenX);
          
          // Clamp to box edges (simple approach: use circle or box)
          // Using a logical padding from edge
          const padding = 0.1; 
          const limit = 1.0 - padding;
          
          // Find intersection with screen box
          // This part determines where on the edge to place the arrow
          // For simplicity, we can position based on angle
          
          // Actually, let's keep it normalized on a circle for the radar effect
          // Or clamp to rectangle edges
          
          let displayX = screenX;
          let displayY = screenY;
          
          // Naive clamp
          displayX = Math.max(-limit, Math.min(limit, displayX));
          displayY = Math.max(-limit, Math.min(limit, displayY));

           // If it wasn't outside bounds but z > 1, we still need to push it to edge
           if (position.z > 1 && Math.abs(displayX) < limit && Math.abs(displayY) < limit) {
             if (Math.abs(displayX) > Math.abs(displayY)) {
                 displayX = displayX > 0 ? limit : -limit;
             } else {
                 displayY = displayY > 0 ? limit : -limit;
             }
           }
           
           // Ensure it sticks to edge
           if (Math.abs(displayX) < limit && Math.abs(displayY) < limit) {
               // Push to closest edge
               if (Math.abs(displayX)/limit > Math.abs(displayY)/limit) {
                   displayX = displayX > 0 ? limit : -limit;
               } else {
                   displayY = displayY > 0 ? limit : -limit;
               }
           }


          return {
            name: planet.name,
            x: (displayX + 1) * size.width / 2, // Convert to pixel coords
            y: (-displayY + 1) * size.height / 2,
            rotation: angleToPlanet + Math.PI / 2, // Rotate arrow
            visible: true
          };
        }
        return { name: planet.name, x: 0, y: 0, rotation: 0, visible: false };
      });
    
    setIndicators(newIndicators);
  });

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <div className="w-full h-full relative overflow-hidden">
        {indicators.map((ind, i) => (
          ind.visible && (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: ind.x,
                top: ind.y,
                transform: `translate(-50%, -50%) rotate(${ind.rotation}rad)`,
              }}
              className="flex flex-col items-center justify-center opacity-80"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <span 
                className="text-[8px] font-mono text-cyan-400 font-bold uppercase mt-1 tracking-widest drop-shadow-md"
                style={{ transform: `rotate(-${ind.rotation}rad)` }} // Keep text upright
              >
                {ind.name}
              </span>
            </div>
          )
        ))}
      </div>
    </Html>
  );
}
