"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { planets } from "@/lib/data/planets";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Globe } from "lucide-react";

export function Navigation() {
  const { setSelectedPlanet, selectedPlanet } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button (Visible when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 py-4 pl-2 pr-3 bg-black/50 backdrop-blur-md border-y border-r border-white/20 rounded-r-2xl text-white hover:bg-white/10 hover:pr-4 transition-all group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <span className="text-xs font-mono tracking-widest uppercase opacity-70 [writing-mode:vertical-rl] rotate-180 hidden sm:block">
                Planets
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Click to close (Visible on all screens now) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/0 z-40" 
            />
            {/* Note: I changed bg to transparent on desktop so it doesn't darken the view too much, 
                or kept it if user wants focus. The user just said "click outside". 
                Let's keep it subtle or invisible pointer-event catcher. 
                Actually, let's make it invisible (bg-transparent) but capturing clicks.
            */}
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h2 className="text-white font-bold tracking-wider text-sm">NAVIGATION</h2>
                        <p className="text-[10px] text-white/40 font-mono">STAR SYSTEM</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                  >
                      <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
                  </button>
              </div>

              {/* Planet List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {planets.map((planet) => (
                      <button
                          key={planet.name}
                          onClick={() => {
                              setSelectedPlanet(planet);
                              setIsOpen(false); // Close panel on selection
                          }}
                          className={`w-full group relative overflow-hidden flex items-center gap-4 p-3 rounded-xl transition-all border ${
                              selectedPlanet?.name === planet.name 
                              ? "bg-white/10 border-cyan-500/50" 
                              : "hover:bg-white/5 border-transparent hover:border-white/10"
                          }`}
                      >
                          {/* Active Indicator */}
                          {selectedPlanet?.name === planet.name && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
                          )}

                          <div className={`w-10 h-10 rounded-full bg-cover bg-center shrink-0 border transition-all ${
                            selectedPlanet?.name === planet.name ? "border-cyan-400 scale-110" : "border-white/20 group-hover:border-white/40"
                          }`} style={{ backgroundImage: `url(${planet.texture})` }} />
                          
                          <div className="text-left">
                            <span className={`block font-mono text-sm uppercase tracking-wider transition-colors ${
                                selectedPlanet?.name === planet.name ? "text-cyan-400 font-bold" : "text-white/80 group-hover:text-white"
                            }`}>
                                {planet.name}
                            </span>
                            <span className="text-[10px] text-white/30 truncate block max-w-[120px]">
                                {planet.description ? planet.description.substring(0, 20) + "..." : "Celestial Body"}
                            </span>
                          </div>

                          {/* Arrow on hover */}
                          <ChevronRight className={`w-4 h-4 text-white/20 absolute right-3 transition-transform ${
                             selectedPlanet?.name === planet.name ? "opacity-100 text-cyan-500/50" : "opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100"
                          }`} />
                      </button>
                  ))}
              </div>
              
               <div className="p-4 border-t border-white/10">
                  <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-white/70">SYSTEM NORMAL</span>
                    </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
