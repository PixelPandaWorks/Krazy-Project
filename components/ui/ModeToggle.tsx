"use client";

import { useStore } from "@/lib/store";
import { Rocket, MonitorPlay } from "lucide-react";

export function ModeToggle() {
  const { isSpaceshipMode, toggleSpaceshipMode } = useStore();

  return (
    <button 
      onClick={toggleSpaceshipMode}
      className={`absolute top-6 left-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full font-bold uppercase tracking-wider shadow-lg transition-all duration-300 ${isSpaceshipMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-black'}`}
    >
      {isSpaceshipMode ? <Rocket className="animate-pulse" /> : <MonitorPlay />}
      {isSpaceshipMode ? "Exit Flight Mode" : "Enter Spaceship"}
    </button>
  );
}
