"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

export function Crosshair() {
  const { isSpaceshipMode } = useStore();
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  // Listen for interaction events from SpaceshipInteraction component
  useEffect(() => {
    const handleInteractStart = (e: CustomEvent) => setHoveredObject(e.detail.name);
    const handleInteractEnd = () => setHoveredObject(null);

    window.addEventListener("spaceship-hover-start", handleInteractStart as EventListener);
    window.addEventListener("spaceship-hover-end", handleInteractEnd);

    return () => {
      window.removeEventListener("spaceship-hover-start", handleInteractStart as EventListener);
      window.removeEventListener("spaceship-hover-end", handleInteractEnd);
    };
  }, []);

  if (!isSpaceshipMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {/* Central Dot */}
      <div 
        className={`w-2 h-2 rounded-full transition-all duration-200 ${
          hoveredObject ? "bg-red-500 scale-150" : "bg-white/80"
        }`} 
      />
      
      {/* Outer Ring */}
      <div 
        className={`absolute w-8 h-8 border rounded-full transition-all duration-200 ${
          hoveredObject ? "border-red-500 scale-125 opacity-100" : "border-white/30 opacity-60"
        }`} 
      />

      {/* Label */}
      {hoveredObject && (
        <div className="absolute top-8 bg-black/60 backdrop-blur px-3 py-1 rounded text-white text-xs font-mono border border-red-500/50">
          SELECT: {hoveredObject.toUpperCase()}
        </div>
      )}
    </div>
  );
}
