"use client";

import { OrbitControls } from "@react-three/drei";
import { useStore } from "@/lib/store";

export function GameControls() {
  const { isSpaceshipMode } = useStore();

  if (isSpaceshipMode) return null;

  return <OrbitControls enablePan={false} maxDistance={150} minDistance={10} />;
}
