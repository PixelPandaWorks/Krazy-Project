"use client";

import { useStore } from "@/lib/store";
import { planets } from "@/lib/data/planets";
import { motion } from "framer-motion";

export function Navigation() {
  const { setSelectedPlanet } = useStore();

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
      {planets.map((planet) => (
        <button
          key={planet.name}
          onClick={() => setSelectedPlanet(planet)}
          className="group relative flex items-center gap-4 text-left"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 overflow-hidden flex items-center justify-center">
             <div className="w-full h-full bg-cover bg-center opacity-80 group-hover:opacity-100" style={{ backgroundImage: `url(${planet.texture})` }} />
          </div>
          <span className="text-white/60 group-hover:text-white font-mono text-sm tracking-wider uppercase transition-colors">
            {planet.name}
          </span>
          <motion.div 
            className="absolute -bottom-1 left-0 h-px bg-cyan-400"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
          />
        </button>
      ))}
    </div>
  );
}
