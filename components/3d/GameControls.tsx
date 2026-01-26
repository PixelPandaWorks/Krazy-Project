"use client";

import { OrbitControls } from "@react-three/drei";
import { useStore } from "@/lib/store";

export function GameControls() {
  const { isSpaceshipMode, selectedPlanet } = useStore();

  return <OrbitControls 
    makeDefault
    enabled={!isSpaceshipMode}
    enablePan={false} 
    maxDistance={150} 
    minDistance={10} 
  />;
}
