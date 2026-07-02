"use client";
"use no memo";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useBlendedPalette } from "./time-system";

/**
 * Global light rig: cool hemisphere + ambient fill and a directional key
 * (sun by day, moon by night), all driven per-frame from the blended
 * palette. The warm campfire point light lives in fire.tsx; the balance
 * between that warm key and this cool fill is what shifts per segment.
 */
export function Lighting() {
  const blend = useBlendedPalette();
  const hemi = useRef<THREE.HemisphereLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const fog = useRef<THREE.FogExp2>(null);
  const scene = useThree((s) => s.scene);

  useFrame(() => {
    if (hemi.current) {
      hemi.current.color.copy(blend.hemiSky);
      hemi.current.groundColor.copy(blend.hemiGround);
      hemi.current.intensity = blend.hemiIntensity;
    }
    if (ambient.current) ambient.current.intensity = blend.ambientIntensity;
    if (sun.current) {
      sun.current.position.copy(blend.sunDir).normalize().multiplyScalar(20);
      sun.current.color.copy(blend.sunColor);
      sun.current.intensity = blend.sunIntensity;
    }
    if (fog.current) {
      fog.current.color.copy(blend.fogColor);
      fog.current.density = blend.fogDensity;
    }
    scene.background = null; // sky dome renders the sky; keep clear alpha off
  });

  return (
    <>
      <hemisphereLight ref={hemi} intensity={0.4} />
      <ambientLight ref={ambient} intensity={0.15} />
      <directionalLight ref={sun} position={[-4, 7, -5]} intensity={0.5} />
      <fogExp2 ref={fog} attach="fog" args={["#0d1f30", 0.02]} />
    </>
  );
}
