"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";

export function SpaceshipControls() {
  const { camera } = useThree();
  const { isSpaceshipMode } = useStore();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  
  // Velocity for smooth movement
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!isSpaceshipMode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW": setMoveForward(true); break;
        case "KeyS": setMoveBackward(true); break;
        case "KeyA": setMoveLeft(true); break;
        case "KeyD": setMoveRight(true); break;
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW": setMoveForward(false); break;
        case "KeyS": setMoveBackward(false); break;
        case "KeyA": setMoveLeft(false); break;
        case "KeyD": setMoveRight(false); break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpaceshipMode]);

  useFrame((state, delta) => {
    if (!isSpaceshipMode) return;

    // Movement speed
    const speed = 200 * delta; 
    const damping = 5 * delta;

    velocity.current.x -= velocity.current.x * damping;
    velocity.current.z -= velocity.current.z * damping;
    velocity.current.y -= velocity.current.y * damping;

    direction.current.z = Number(moveForward) - Number(moveBackward);
    direction.current.x = Number(moveRight) - Number(moveLeft);
    direction.current.normalize();

    if (moveForward || moveBackward) velocity.current.z -= direction.current.z * speed;
    if (moveLeft || moveRight) velocity.current.x -= direction.current.x * speed;

    camera.translateX(-velocity.current.x * delta);
    camera.translateZ(velocity.current.z * delta);
  });

  if (!isSpaceshipMode) return null;

  return <PointerLockControls />;
}
