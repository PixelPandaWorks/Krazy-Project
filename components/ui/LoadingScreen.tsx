"use client";

import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const { progress, active } = useProgress();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      // Add a small delay to ensure everything is actually ready and for smooth transition
      const timer = setTimeout(() => {
        setFinished(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
        setFinished(false);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="w-64 space-y-4 text-center">
            {/* Logo or Title Area */}
            <motion.h1
              className="text-2xl font-bold tracking-[0.2em] font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              INITIALIZING SYSTEM
            </motion.h1>

            {/* Progress Bar Container */}
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Percentage and Details */}
            <div className="flex justify-between text-xs font-mono text-zinc-500">
              <span>LOADING ASSETS...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            
            {/* Decorative tech elements */}
            <motion.div 
               className="absolute bottom-10 left-0 w-full flex justify-center opacity-30 text-[10px] font-mono tracking-widest"
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.3 }}
               transition={{ delay: 0.5 }}
            >
               ESTABLISHING UPLINK // SECURE CONNECTION
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
