"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export function SpaceshipInteraction() {
  const { isSpaceshipMode, setSelectedPlanet } = useStore();
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const center = useRef(new THREE.Vector2(0, 0)); // Center of screen
  
  // Track currently hovered object to avoid spamming events
  const currentHover = useRef<string | null>(null);

  useFrame(() => {
    if (!isSpaceshipMode) return;

    // Cast ray from center of screen
    raycaster.current.setFromCamera(center.current, camera);

    // Intersect with specific identifiable objects
    // We filter heavily to avoid performance hits
    const intersects = raycaster.current.intersectObjects(scene.children, true);

    let foundObject = null;
    let foundName = null;
    let foundData = null;

    // Find the first relevant object
    for (const hit of intersects) {
      // Traverse up to find a named group or mesh we care about
      let obj: THREE.Object3D | null = hit.object;
      
      while (obj) {
        // Check for Planets
        if (obj.name && obj.name.startsWith("planet-")) {
          foundName = obj.name.replace("planet-", "");
          foundData = obj.userData;
          foundObject = obj;
          break;
        }
        // Check for Sun
        if (obj.name === "Sun") {
          foundName = "Sun";
          foundObject = obj;
          break;
        }
        // Check for Constellations
        if (obj.name && obj.name.startsWith("constellation-")) {
            foundName = obj.name.replace("constellation-", "");
            foundObject = obj;
            break;
        }
        
        obj = obj.parent;
      }

      if (foundObject) break;
    }

    // Handle Hover State Changes
    if (foundName && foundName !== currentHover.current) {
        currentHover.current = foundName;
        window.dispatchEvent(new CustomEvent("spaceship-hover-start", { detail: { name: foundName } }));
    } else if (!foundName && currentHover.current) {
        currentHover.current = null;
        window.dispatchEvent(new Event("spaceship-hover-end"));
    }
  });

  // Handle Clicking
  useEffect(() => {
      const handleClick = () => {
          if (!isSpaceshipMode || !currentHover.current) return;
          
          // Re-raycast to get the object data cleanly (or use the cached hover state logic)
          // For simplicity, we trust the visual feedback or re-cast to be sure
          raycaster.current.setFromCamera(center.current, camera);
          const intersects = raycaster.current.intersectObjects(scene.children, true);

          for (const hit of intersects) {
             let obj: THREE.Object3D | null = hit.object;
             while (obj) {
                 if (obj.name && obj.name.startsWith("planet-")) {
                     const planetData = obj.userData?.planet;
                     if (planetData) {
                        setSelectedPlanet(planetData);
                        return; // Done
                     }
                 }
                 obj = obj.parent;
             }
          }
      };

      window.addEventListener("mousedown", handleClick); 
      return () => window.removeEventListener("mousedown", handleClick);

  }, [isSpaceshipMode, camera, scene, setSelectedPlanet]);

  return null;
}
