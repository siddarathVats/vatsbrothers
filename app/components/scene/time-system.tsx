"use client";
"use no memo";

import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  SEGMENTS,
  type SegmentPalette,
  type TimeSegmentId,
} from "@/lib/timeSegments";

/**
 * Mutable, per-frame blended palette. One TimeSystem useFrame (priority -1,
 * so it runs before every consumer) advances a 1.5s smoothstep blend between
 * the previous and target segment palettes and writes the result here.
 * Consumers read it inside their own useFrame and mutate three.js objects
 * directly — no React state churn per frame. This object is the spec's
 * "shared time factor": everything moves together, continuously, including
 * when the target segment changes mid-fade.
 */
export interface BlendedPalette {
  skyTop: THREE.Color;
  skyHorizon: THREE.Color;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  ambientIntensity: number;
  sunDir: THREE.Vector3;
  sunColor: THREE.Color;
  sunIntensity: number;
  fogColor: THREE.Color;
  fogDensity: number;
  fireMin: number;
  fireMax: number;
  fireColor: THREE.Color;
  sparks: number;
  stars: number;
  fireflies: number;
  mist: number;
}

const FADE_SECONDS = 1.5;

function paletteToBlend(p: SegmentPalette, out: BlendedPalette): BlendedPalette {
  out.skyTop.set(p.sky.top);
  out.skyHorizon.set(p.sky.horizon);
  out.hemiSky.set(p.hemisphere.sky);
  out.hemiGround.set(p.hemisphere.ground);
  out.hemiIntensity = p.hemisphere.intensity;
  out.ambientIntensity = p.ambientIntensity;
  out.sunDir.set(...p.sun.direction);
  out.sunColor.set(p.sun.color);
  out.sunIntensity = p.sun.intensity;
  out.fogColor.set(p.fog.color);
  out.fogDensity = p.fog.density;
  out.fireMin = p.fire.min;
  out.fireMax = p.fire.max;
  out.fireColor.set(p.fire.color);
  out.sparks = p.sparks;
  out.stars = p.stars;
  out.fireflies = p.fireflies;
  out.mist = p.mist;
  return out;
}

function makeBlend(p: SegmentPalette): BlendedPalette {
  return paletteToBlend(p, {
    skyTop: new THREE.Color(),
    skyHorizon: new THREE.Color(),
    hemiSky: new THREE.Color(),
    hemiGround: new THREE.Color(),
    hemiIntensity: 0,
    ambientIntensity: 0,
    sunDir: new THREE.Vector3(),
    sunColor: new THREE.Color(),
    sunIntensity: 0,
    fogColor: new THREE.Color(),
    fogDensity: 0,
    fireMin: 0,
    fireMax: 0,
    fireColor: new THREE.Color(),
    sparks: 0,
    stars: 0,
    fireflies: 0,
    mist: 0,
  });
}

function copyBlend(src: BlendedPalette, out: BlendedPalette): void {
  out.skyTop.copy(src.skyTop);
  out.skyHorizon.copy(src.skyHorizon);
  out.hemiSky.copy(src.hemiSky);
  out.hemiGround.copy(src.hemiGround);
  out.hemiIntensity = src.hemiIntensity;
  out.ambientIntensity = src.ambientIntensity;
  out.sunDir.copy(src.sunDir);
  out.sunColor.copy(src.sunColor);
  out.sunIntensity = src.sunIntensity;
  out.fogColor.copy(src.fogColor);
  out.fogDensity = src.fogDensity;
  out.fireMin = src.fireMin;
  out.fireMax = src.fireMax;
  out.fireColor.copy(src.fireColor);
  out.sparks = src.sparks;
  out.stars = src.stars;
  out.fireflies = src.fireflies;
  out.mist = src.mist;
}

function lerpBlend(
  from: BlendedPalette,
  to: BlendedPalette,
  k: number,
  out: BlendedPalette,
): void {
  out.skyTop.lerpColors(from.skyTop, to.skyTop, k);
  out.skyHorizon.lerpColors(from.skyHorizon, to.skyHorizon, k);
  out.hemiSky.lerpColors(from.hemiSky, to.hemiSky, k);
  out.hemiGround.lerpColors(from.hemiGround, to.hemiGround, k);
  out.hemiIntensity = THREE.MathUtils.lerp(from.hemiIntensity, to.hemiIntensity, k);
  out.ambientIntensity = THREE.MathUtils.lerp(from.ambientIntensity, to.ambientIntensity, k);
  out.sunDir.lerpVectors(from.sunDir, to.sunDir, k);
  out.sunColor.lerpColors(from.sunColor, to.sunColor, k);
  out.sunIntensity = THREE.MathUtils.lerp(from.sunIntensity, to.sunIntensity, k);
  out.fogColor.lerpColors(from.fogColor, to.fogColor, k);
  out.fogDensity = THREE.MathUtils.lerp(from.fogDensity, to.fogDensity, k);
  out.fireMin = THREE.MathUtils.lerp(from.fireMin, to.fireMin, k);
  out.fireMax = THREE.MathUtils.lerp(from.fireMax, to.fireMax, k);
  out.fireColor.lerpColors(from.fireColor, to.fireColor, k);
  out.sparks = THREE.MathUtils.lerp(from.sparks, to.sparks, k);
  out.stars = THREE.MathUtils.lerp(from.stars, to.stars, k);
  out.fireflies = THREE.MathUtils.lerp(from.fireflies, to.fireflies, k);
  out.mist = THREE.MathUtils.lerp(from.mist, to.mist, k);
}

const BlendCtx = createContext<BlendedPalette | null>(null);

export function useBlendedPalette(): BlendedPalette {
  const blend = useContext(BlendCtx);
  if (!blend) throw new Error("useBlendedPalette must be used inside <TimeSystem>");
  return blend;
}

export function TimeSystem({
  segment,
  children,
}: {
  segment: TimeSegmentId;
  children: ReactNode;
}) {
  // Initialized directly to the current segment — no fade-in from a default,
  // so the first rendered frame is already the correct time of day.
  const blend = useMemo(() => makeBlend(SEGMENTS[segment]), []); // eslint-disable-line react-hooks/exhaustive-deps
  const from = useMemo(() => makeBlend(SEGMENTS[segment]), []); // eslint-disable-line react-hooks/exhaustive-deps
  const to = useMemo(() => makeBlend(SEGMENTS[segment]), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useRef({ segment, t: 1 });

  useFrame((_, delta) => {
    if (state.current.segment !== segment) {
      // Retarget mid-fade from the *currently blended* values so rapid
      // override clicks stay continuous instead of hard-cutting.
      copyBlend(blend, from);
      paletteToBlend(SEGMENTS[segment], to);
      state.current.segment = segment;
      state.current.t = 0;
    }
    if (state.current.t < 1) {
      state.current.t = Math.min(1, state.current.t + delta / FADE_SECONDS);
      const k = THREE.MathUtils.smoothstep(state.current.t, 0, 1);
      lerpBlend(from, to, k, blend);
    }
  }, -1);

  return <BlendCtx.Provider value={blend}>{children}</BlendCtx.Provider>;
}
