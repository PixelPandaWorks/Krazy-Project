"use client";

import { create } from "zustand";
import { PlanetData } from "@/lib/data/planets";

interface StoreState {
  selectedPlanet: PlanetData | null;
  setSelectedPlanet: (planet: PlanetData | null) => void;
  isSpaceshipMode: boolean;
  toggleSpaceshipMode: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  // Planetary Defense State
  isDefenseMode: boolean;
  toggleDefenseMode: () => void;
  score: number;
  incrementScore: () => void;
  resetScore: () => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  isSpaceshipMode: false,
  toggleSpaceshipMode: () => set((state) => ({ isSpaceshipMode: !state.isSpaceshipMode })),
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  // Planetary Defense
  isDefenseMode: false,
  toggleDefenseMode: () => set((state) => ({ isDefenseMode: !state.isDefenseMode, score: 0 })), // Reset score on toggle
  score: 0,
  incrementScore: () => set((state) => ({ score: state.score + 100 })),
  resetScore: () => set({ score: 0 }),
}));
