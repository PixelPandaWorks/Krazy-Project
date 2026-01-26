"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "@/lib/store";
import * as THREE from "three";
import { useEffect, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export function PlanetFocus() {
  const { selectedPlanet } = useStore();
  const { camera, controls } = useThree();
  
  // Track if we are currently focusing on a planet
  const isFocusing = useRef(false);
  const previousPlanetName = useRef<string | null>(null);

  useFrame((state, delta) => {
    const orbitControls = controls as unknown as OrbitControlsImpl;
    if (!orbitControls) return;

    if (selectedPlanet && selectedPlanet.name !== "Earth") {
      // === FOCUS MODE ===
      isFocusing.current = true;
      previousPlanetName.current = selectedPlanet.name;

      // 1. Find the planet
      const planetObject = state.scene.getObjectByName(`planet-${selectedPlanet.name}`);

      if (planetObject) {
         // Update controls settings for close-up
         orbitControls.minDistance = selectedPlanet.size * 1.5;
         // Allow zooming out a bit but not too far while focused? 
         // Actually, if user zooms out too far, maybe we should auto-exit?
         // For now, let's restrict it to keep focus.
         orbitControls.maxDistance = selectedPlanet.size * 10;
        
        const worldPos = new THREE.Vector3();
        planetObject.getWorldPosition(worldPos);

        // 2. Smoothly move controls.target to the planet
        // We do this every frame to follow the planet
        orbitControls.target.lerp(worldPos, 0.1);

        // 3. Helper: Only move camera if we just started focusing
        // OR if the camera is "too far" from the desired relative offset?
        // No, if we force camera position every frame, the user CANNOT rotate.
        // We only want to "Move" the camera to the start position initially.
        // BUT the planet is moving. If we don't update camera, the planet will fly away from the camera
        // (even if target follows, the camera position stays static in world space).
        // So we MUST move the camera relative to the planet.
        
        // Calculate the current relative offset from target
        // const relativeOffset = camera.position.clone().sub(orbitControls.target);
        
        // We want to maintain the relative offset, but allow the user to change it (orbit).
        // OrbitControls handles `camera.position` updates based on `target` and `spherical` coords.
        // If we modify `orbitControls.target`, OrbitControls shifts the camera to maintain the offset?
        // Yes, OrbitControls generally maintains the vector (Camera - Target) unless we rotate.
        // So moving Target moves Camera.
        
        // So simply updating `orbitControls.target.lerp` is sufficient to "tow" the camera along!
        // We just need to "Zoom In" initially.
        
        // Check distance
        const dist = camera.position.distanceTo(worldPos);
        const desiredDist = selectedPlanet.size * 3.5;
        
        if (dist > desiredDist * 1.5) {
             // We are too far, zoom in smoothly
             // We move the camera along the view vector
             const viewVec = camera.position.clone().sub(worldPos).normalize();
             const targetCamPos = worldPos.clone().add(viewVec.multiplyScalar(desiredDist));
             camera.position.lerp(targetCamPos, 0.05);
        }
      }
    } else {
      // === IDLE / RETURN MODE ===
      if (isFocusing.current) {
        // We just stopped focusing. Reset controls.
        orbitControls.minDistance = 10;
        orbitControls.maxDistance = 150;
        
        // Animate back to center
        const center = new THREE.Vector3(0, 0, 0);
        orbitControls.target.lerp(center, 0.05);
        
        // Initial home position
        const homePos = new THREE.Vector3(0, 20, 40);
        
        // Smoothly return
        camera.position.lerp(homePos, 0.02);
        
        // Stop "Focusing" behavior when close to home
        if (camera.position.distanceTo(homePos) < 1 && orbitControls.target.distanceTo(center) < 1) {
             isFocusing.current = false;
        }
      }
    }
  });

  return null;
}
