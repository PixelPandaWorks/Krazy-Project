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
}

export const useStore = create<StoreState>((set) => ({
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  isSpaceshipMode: false,
  toggleSpaceshipMode: () => set((state) => ({ isSpaceshipMode: !state.isSpaceshipMode })),
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
