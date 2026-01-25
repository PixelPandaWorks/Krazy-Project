"use client";

import { useEffect, useRef } from "react";
import * as Tone from "tone";
import { useStore } from "@/lib/store";
import { Volume2, VolumeX } from "lucide-react";

export function AudioSystem() {
  const { selectedPlanet, isSpaceshipMode, isMuted, toggleMute } = useStore();
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const droneRef = useRef<Tone.Oscillator | null>(null);
  const spaceshipRef = useRef<Tone.Noise | null>(null);
  const initialized = useRef(false);

  // Initialize Audio
  const initAudio = async () => {
    if (initialized.current) return;
    await Tone.start();
    
    // SFX Synth
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 1 }
    }).toDestination();
    synthRef.current.volume.value = -10;

    // Ambient Drone
    droneRef.current = new Tone.Oscillator(50, "sine").toDestination();
    droneRef.current.volume.value = -20;
    
    // Spaceship Engine Noise
    spaceshipRef.current = new Tone.Noise("brown").toDestination();
    spaceshipRef.current.volume.value = -30;
    const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
    spaceshipRef.current.connect(autoFilter);

    initialized.current = true;
    
    if (!isMuted) droneRef.current.start();
  };

  // Handle Mute/Unmute
  useEffect(() => {
    if (!initialized.current) return;
    Tone.Destination.mute = isMuted;
    
    // Manage drone state
    if (!isMuted && initialized.current) {
        if (droneRef.current?.state === "stopped") droneRef.current.start();
    } else {
        if (droneRef.current?.state === "started") droneRef.current.stop();
    }

  }, [isMuted]);

  // Handle Planet Selection Sound
  useEffect(() => {
    if (!initialized.current || isMuted) return;
    if (selectedPlanet) {
      // High sci-fi blip
      synthRef.current?.triggerAttackRelease(["C6", "E6"], "8n");
    } else {
      // Closing sound
      synthRef.current?.triggerAttackRelease(["G5", "C5"], "8n");
    }
  }, [selectedPlanet, isMuted]);

  // Handle Spaceship Mode Sound
  useEffect(() => {
    if (!initialized.current || isMuted) return;
    if (isSpaceshipMode) {
      // Power up
      synthRef.current?.triggerAttackRelease(["C3", "C4", "G4", "C5"], "2n");
      spaceshipRef.current?.start();
      spaceshipRef.current?.volume.rampTo(-10, 1);
    } else {
      // Power down
      spaceshipRef.current?.volume.rampTo(-50, 0.5);
      setTimeout(() => spaceshipRef.current?.stop(), 500);
    }
  }, [isSpaceshipMode, isMuted]);

  return (
    <button
      onClick={() => {
        if (!initialized.current) initAudio();
        toggleMute();
      }}
      className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all"
    >
      {isMuted ? <VolumeX /> : <Volume2 />}
    </button>
  );
}
