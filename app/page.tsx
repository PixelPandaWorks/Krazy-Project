"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { planets } from "@/lib/data/planets";
import { Sun } from "@/components/3d/Sun";
import { EnhancedEarth } from "@/components/3d/EnhancedEarth";
import { Planet } from "@/components/3d/Planet";
import { AsteroidBelt } from "@/components/3d/AsteroidBelt";
import { EffectComposer, Bloom, GodRays } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { GameControls } from "@/components/3d/GameControls";
import { NebulaSkybox } from "@/components/3d/NebulaSkybox";
import { PlanetRadar } from "@/components/3d/PlanetRadar";
import React, { useState } from "react";
import * as THREE from "three";
import { SpaceshipControls } from "@/components/3d/SpaceshipControls";
import { HUD } from "@/components/ui/HUD";
import { Navigation } from "@/components/ui/Navigation";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { AudioSystem } from "@/components/systems/AudioSystem";
import { useStore } from "@/lib/store";
import { InteractiveGlobe } from "@/components/3d/InteractiveGlobe";

export default function Home() {
  const { selectedPlanet } = useStore();
  const [sunMesh, setSunMesh] = useState<THREE.Mesh | null>(null);

  if (selectedPlanet?.name === "Earth") {
    return <InteractiveGlobe />;
  }

  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas camera={{ position: [0, 10, 40], fov: 60 }} shadows>
        <ambientLight intensity={0.1} />
        <NebulaSkybox />
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Sun ref={setSunMesh} />
        <EnhancedEarth />
        <AsteroidBelt />

        {planets.filter(p => p.name !== "Earth").map((planet, index) => (
          <Planet key={index} planet={planet} />
        ))}

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} />
          {(sunMesh && (
            <GodRays
              sun={sunMesh}
              blendFunction={BlendFunction.SCREEN} 
              samples={60} 
              density={0.96} 
              decay={0.9} 
              weight={0.3} 
              exposure={0.6} 
              clampMax={1} 
              kernelSize={KernelSize.SMALL} 
              blur={true} 
            />
          )) as unknown as React.ReactElement}
        </EffectComposer>

        <GameControls />
        <SpaceshipControls />
        <PlanetRadar />
      </Canvas>
      
      <HUD />
      <Navigation />
      <ModeToggle />
      <AudioSystem />

      <div className="absolute bottom-10 left-10 text-white font-mono opacity-70 pointer-events-none">
        <p className="text-xl font-bold">CONTROLS:</p>
        <p>🖱️ Drag to Rotate (Orbit)</p>
        <p>🚀 Toggle Flight Mode to Fly (WASD)</p>
        <p>🌍 Click Planet for Details</p>
      </div>
    </div>
  );
}
