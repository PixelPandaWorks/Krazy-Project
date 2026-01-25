"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { X, Thermometer, Weight, Clock, Calendar } from "lucide-react";

export function HUD() {
  const { selectedPlanet, setSelectedPlanet } = useStore();

  return (
    <AnimatePresence>
      {selectedPlanet && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-20 right-10 w-80 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white shadow-2xl"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {selectedPlanet.name}
            </h2>
            <button 
              onClick={() => setSelectedPlanet(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <StatItem 
              icon={<Thermometer size={16} className="text-red-400" />} 
              label="Temp" 
              value={selectedPlanet.stats.temp} 
            />
            <StatItem 
              icon={<Weight size={16} className="text-blue-400" />} 
              label="Gravity" 
              value={selectedPlanet.stats.gravity} 
            />
            <StatItem 
              icon={<Clock size={16} className="text-green-400" />} 
              label="Day" 
              value={selectedPlanet.stats.day} 
            />
            <StatItem 
              icon={<Calendar size={16} className="text-yellow-400" />} 
              label="Year" 
              value={selectedPlanet.stats.year} 
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-white/5 p-3 rounded-lg border border-white/5 shadow-sm">
      <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
