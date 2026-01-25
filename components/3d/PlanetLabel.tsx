import { Html } from "@react-three/drei";
import { PlanetData } from "@/lib/data/planets";
import { useState } from "react";

interface PlanetLabelProps {
  planet: PlanetData;
  visible: boolean;
}

export function PlanetLabel({ planet, visible }: PlanetLabelProps) {
  return (
    <Html
      position={[0, planet.size * 1.5 + 0.5, 0]}
      center
      distanceFactor={150}
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div 
        className={`transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      >
        <div className="text-white text-[12px] font-bold font-mono tracking-widest uppercase text-shadow-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {planet.name}
        </div>
      </div>
    </Html>
  );
}
