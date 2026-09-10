"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useMemo } from "react";

export default function SceneController() {
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const smoothProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollRef.current = window.scrollY / maxScroll;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize value
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Coordinates and look-at targets for the Viewport Camera at each section (0 to 6)
  const viewportPoints = useMemo(() => [
    { pos: new THREE.Vector3(0, 0, 6.2), look: new THREE.Vector3(0, -0.4, 0) },         // Hero
    { pos: new THREE.Vector3(2.5, -12.0, 5.2), look: new THREE.Vector3(-0.6, -12.0, 0.8) }, // Numbers
    { pos: new THREE.Vector3(-2.6, -24.0, 5.0), look: new THREE.Vector3(0.6, -24.0, 0.8) }, // Services
    { pos: new THREE.Vector3(2.8, -36.0, 4.8), look: new THREE.Vector3(0, -36.0, 0) },    // Brig Haus
    { pos: new THREE.Vector3(0, -47.0, 5.4), look: new THREE.Vector3(0, -48.2, 0.5) },   // Selected Work
    { pos: new THREE.Vector3(-2.2, -60.0, 4.2), look: new THREE.Vector3(0.2, -60.0, 0.8) }, // FAQ
    { pos: new THREE.Vector3(0, -72.0, 6.2), look: new THREE.Vector3(0, -72.4, 0) }      // Contact
  ], []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rawProgress = scrollRef.current;

    // Apply smooth easing / inertia to scroll progress
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, rawProgress, 0.05);
    const progress = smoothProgress.current;

    const segmentCount = viewportPoints.length - 1;
    const scaledProgress = progress * segmentCount;
    const index = Math.min(Math.floor(scaledProgress), segmentCount - 1);
    const fraction = scaledProgress - index;

    // Calculate Viewport Camera Position & Target
    const vp1 = viewportPoints[index];
    const vp2 = viewportPoints[index + 1];
    
    const targetVpPos = new THREE.Vector3();
    const targetVpLook = new THREE.Vector3();
    
    targetVpPos.lerpVectors(vp1.pos, vp2.pos, fraction);
    targetVpLook.lerpVectors(vp1.look, vp2.look, fraction);

    // Brig Haus specific viewport orbiting camera sweep
    if (index === 3 || (index === 2 && fraction > 0.8)) {
      const orbitSpeed = time * 0.2;
      targetVpPos.x = 3.2 * Math.cos(orbitSpeed);
      targetVpPos.z = 3.2 * Math.sin(orbitSpeed) + 2.5;
    }

    // Subtle 3D mouse parallax offset for viewport camera
    const mx = state.pointer.x * 0.8;
    const my = state.pointer.y * 0.8;
    targetVpPos.x += mx;
    targetVpPos.y += my;

    camera.position.lerp(targetVpPos, 0.1);

    const currentLook = new THREE.Vector3().copy(targetVpLook);
    currentLook.x += mx * 0.2;
    currentLook.y += my * 0.2;
    camera.lookAt(currentLook);
  });

  return null;
}



