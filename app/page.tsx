"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { planets } from "@/lib/data/planets";
import { Sun } from "@/components/3d/Sun";
import { EnhancedEarth } from "@/components/3d/EnhancedEarth";
import { Planet } from "@/components/3d/Planet";
import { AsteroidBelt } from "@/components/3d/AsteroidBelt";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { GameControls } from "@/components/3d/GameControls";
import { SpaceshipControls } from "@/components/3d/SpaceshipControls";
import { Title } from "@/components/3d/Title";
import { HUD } from "@/components/ui/HUD";
import { Navigation } from "@/components/ui/Navigation";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { AudioSystem } from "@/components/systems/AudioSystem";
import { useStore } from "@/lib/store";
import { InteractiveGlobe } from "@/components/3d/InteractiveGlobe";

export default function Home() {
  const { selectedPlanet } = useStore();

  if (selectedPlanet?.name === "Earth") {
    return <InteractiveGlobe />;
  }

  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas camera={{ position: [0, 10, 40], fov: 60 }} shadows>
        <ambientLight intensity={0.2} />
        <Stars radius={300} depth={50} count={10000} factor={4} saturation={1} fade speed={0.5} />
        
        <Title />
        <Sun />
        <EnhancedEarth />
        <AsteroidBelt />

        {planets.filter(p => p.name !== "Earth").map((planet, index) => (
          <Planet key={index} planet={planet} />
        ))}

        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
        </EffectComposer>

        <GameControls />
        <SpaceshipControls />
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
