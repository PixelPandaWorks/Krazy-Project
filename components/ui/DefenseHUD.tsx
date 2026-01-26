"use client";

import { useStore } from "@/lib/store";
import { Shield, ShieldAlert, Target } from "lucide-react";
import { useEffect, useState } from "react";

export function DefenseHUD() {
  const { isDefenseMode, score, toggleDefenseMode } = useStore();
  const [threatLevel, setThreatLevel] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");

  // Mock threat level update
  useEffect(() => {
    if (!isDefenseMode) return;
    const interval = setInterval(() => {
        const r = Math.random();
        if (r > 0.7) setThreatLevel("HIGH");
        else if (r > 0.4) setThreatLevel("MEDIUM");
        else setThreatLevel("LOW");
    }, 5000);
    return () => clearInterval(interval);
  }, [isDefenseMode]);

  return (
    <div className="absolute top-24 left-6 z-40">
      {/* Activate Button */}
      <button
        onClick={toggleDefenseMode}
        className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold uppercase tracking-wider backdrop-blur-md transition-all shadow-lg border ${
            isDefenseMode 
            ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" 
            : "bg-black/60 border-white/20 text-white hover:bg-white/10"
        }`}
      >
        {isDefenseMode ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
        {isDefenseMode ? "Defense Active" : "Planetary Defense"}
      </button>

      {/* Game Stats Panel */}
      {isDefenseMode && (
        <div className="mt-4 p-5 bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl w-64 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
             {/* Score */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-red-400 font-mono text-xs uppercase tracking-widest">Score</span>
                <span className="text-2xl font-bold text-white font-mono">{score.toLocaleString()}</span>
            </div>

            {/* Threat Monitor */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs uppercase">Threat Level</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        threatLevel === "HIGH" ? "bg-red-500 text-black" :
                        threatLevel === "MEDIUM" ? "bg-yellow-500 text-black" :
                        "bg-green-500 text-black"
                    }`}>
                        {threatLevel}
                    </span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
                    <div className={`h-full transition-all duration-1000 ${threatLevel === "HIGH" ? "w-full bg-red-500" : threatLevel === "MEDIUM" ? "w-2/3 bg-yellow-500" : "w-1/3 bg-green-500"}`} />
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-white/40 flex items-center gap-2">
                <Target className="w-3 h-3" />
                <span>CLICK ASTEROIDS TO DEFLECT</span>
            </div>
        </div>
      )}
    </div>
  );
}
