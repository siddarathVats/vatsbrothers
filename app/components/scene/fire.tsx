"use client";
"use no memo";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBlendedPalette } from "./time-system";

export const FIRE_POSITION: [number, number, number] = [1.4, 0, 0.2];

/** Cheap deterministic 1D noise for the flicker jitter. */
function hashNoise(t: number): number {
  const x = Math.sin(t * 91.7) * 43758.5453;
  return x - Math.floor(x);
}

const FLAME_COLOR = new THREE.Color("#ff8f2e");
const FLAME_HOT = new THREE.Color("#ffcf7a");
const scratch = new THREE.Color();

/**
 * Campfire: crossed logs, two emissive flame cones (emissive pushed >1 and
 * untone-mapped so Stage-6 bloom catches them), one flickering point light,
 * and a spark particle column that only shows when the blended `sparks`
 * factor is up (Night / Late night).
 */
export function Fire() {
  const blend = useBlendedPalette();
  const light = useRef<THREE.PointLight>(null);
  const flameOuter = useRef<THREE.Mesh>(null);
  const flameInner = useRef<THREE.Mesh>(null);
  const flameOuterMat = useRef<THREE.MeshStandardMaterial>(null);
  const flameInnerMat = useRef<THREE.MeshStandardMaterial>(null);

  // --- sparks ------------------------------------------------------------
  const SPARK_COUNT = 120;
  const sparkGeometry = useMemo(() => {
    const positions = new Float32Array(SPARK_COUNT * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);
  // Per-spark phase/speed/radius, deterministic by index.
  const sparkSeeds = useMemo(() => {
    const seeds = new Float32Array(SPARK_COUNT * 3);
    for (let i = 0; i < SPARK_COUNT; i += 1) {
      seeds[i * 3] = (i * 0.618033) % 1; // phase
      seeds[i * 3 + 1] = 0.55 + ((i * 0.414213) % 1) * 0.9; // speed
      seeds[i * 3 + 2] = ((i * 0.267949) % 1) * Math.PI * 2; // angle
    }
    return seeds;
  }, []);
  const sparkMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#ffb35c",
        size: 0.055,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const sparks = useRef<THREE.Points>(null);

  useEffect(
    () => () => {
      sparkGeometry.dispose();
      sparkMaterial.dispose();
    },
    [sparkGeometry, sparkMaterial],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Continuous flicker — every segment; the blended min/max range decides
    // whether it reads as embers (dawn) or a blaze (night).
    const noise =
      0.5 + 0.22 * Math.sin(t * 7.3) + 0.18 * Math.sin(t * 13.1 + 1.7) + 0.1 * (hashNoise(t) - 0.5);
    const flickerK = THREE.MathUtils.clamp(noise, 0, 1);
    if (light.current) {
      light.current.intensity = THREE.MathUtils.lerp(blend.fireMin, blend.fireMax, flickerK) * 3.2;
      scratch.copy(blend.fireColor).lerp(FLAME_HOT, flickerK * 0.35);
      light.current.color.copy(scratch);
    }

    // Flames breathe with the same flicker and scale with fire strength.
    const strength = THREE.MathUtils.lerp(blend.fireMin, blend.fireMax, 0.5);
    const flameScale = THREE.MathUtils.clamp(0.35 + strength * 0.28, 0.4, 1.35);
    if (flameOuter.current) {
      flameOuter.current.scale.setScalar(flameScale * (0.94 + flickerK * 0.12));
      flameOuter.current.rotation.y = t * 0.9;
    }
    if (flameInner.current) {
      flameInner.current.scale.setScalar(flameScale * (0.9 + flickerK * 0.18));
      flameInner.current.rotation.y = -t * 1.3;
    }
    if (flameOuterMat.current) {
      flameOuterMat.current.emissive.copy(blend.fireColor);
      flameOuterMat.current.emissiveIntensity = 1.6 + flickerK * 1.4;
      flameOuterMat.current.opacity = THREE.MathUtils.clamp(0.35 + strength * 0.25, 0.4, 0.95);
    }
    if (flameInnerMat.current) {
      flameInnerMat.current.emissive.copy(FLAME_HOT);
      flameInnerMat.current.emissiveIntensity = 2.2 + flickerK * 1.6;
    }

    // Sparks: rise, wander, respawn. Opacity rides the blended factor so
    // they fade in/out with the segment cross-fade for free.
    sparkMaterial.opacity = blend.sparks * 0.9;
    if (sparks.current) sparks.current.visible = blend.sparks > 0.02;
    if (blend.sparks > 0.02) {
      const pos = sparkGeometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < SPARK_COUNT; i += 1) {
        const phase = sparkSeeds[i * 3];
        const speed = sparkSeeds[i * 3 + 1];
        const angle = sparkSeeds[i * 3 + 2];
        const life = (t * speed * 0.28 + phase) % 1; // 0 birth → 1 death
        const rise = life * 2.6;
        const sway = Math.sin(t * 1.7 + angle * 7.0 + life * 9.0) * 0.14 * life;
        const spread = 0.06 + life * 0.22;
        pos.setXYZ(
          i,
          Math.cos(angle) * spread + sway,
          0.25 + rise,
          Math.sin(angle) * spread + sway * 0.6,
        );
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group position={FIRE_POSITION}>
      {/* Crossed logs */}
      <mesh position={[0, 0.09, 0]} rotation={[0, 0.4, Math.PI / 2.15]}>
        <cylinderGeometry args={[0.06, 0.075, 0.95, 7]} />
        <meshStandardMaterial color="#4a2f1d" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[0, 1.7, -Math.PI / 2.2]}>
        <cylinderGeometry args={[0.055, 0.07, 0.9, 7]} />
        <meshStandardMaterial color="#3d2717" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[0.35, 2.9, Math.PI / 2.05]}>
        <cylinderGeometry args={[0.05, 0.065, 0.8, 7]} />
        <meshStandardMaterial color="#553824" roughness={0.95} />
      </mesh>
      {/* Ember bed glow */}
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 16]} />
        <meshStandardMaterial
          color="#1c0d05"
          emissive={FLAME_COLOR}
          emissiveIntensity={0.9}
          roughness={1}
        />
      </mesh>
      {/* Flames — emissive over 1 + toneMapped off so bloom catches them */}
      <mesh ref={flameOuter} position={[0, 0.52, 0]}>
        <coneGeometry args={[0.26, 0.85, 8]} />
        <meshStandardMaterial
          ref={flameOuterMat}
          color="#903c0a"
          emissive={FLAME_COLOR}
          emissiveIntensity={2.4}
          transparent
          opacity={0.85}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={flameInner} position={[0, 0.42, 0]}>
        <coneGeometry args={[0.14, 0.5, 8]} />
        <meshStandardMaterial
          ref={flameInnerMat}
          color="#b3641c"
          emissive={FLAME_HOT}
          emissiveIntensity={3}
          transparent
          opacity={0.9}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      {/* Stones ring */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.52, 0.06, Math.sin(a) * 0.52]}>
            <dodecahedronGeometry args={[0.09 + (i % 3) * 0.02, 0]} />
            <meshStandardMaterial color="#5c5852" roughness={0.9} />
          </mesh>
        );
      })}
      <pointLight ref={light} position={[0, 0.75, 0]} distance={11} decay={1.8} intensity={6} color={FLAME_COLOR} />
      <points ref={sparks} geometry={sparkGeometry} material={sparkMaterial} />
    </group>
  );
}
