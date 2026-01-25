"use client";

import { Text } from "@react-three/drei";

export function Title() {
  return (
    <Text
      position={[0, 15, 0]}
      fontSize={3}
      color="#00ffff"
      anchorX="center"
      anchorY="middle"
      rotation={[-Math.PI / 6, 0, 0]}
    >
      SOLAR SYSTEM 3D
      <meshStandardMaterial emissive="#00ffff" emissiveIntensity={0.8} />
    </Text>
  );
}
