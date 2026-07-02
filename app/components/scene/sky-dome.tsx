"use client";
"use no memo";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBlendedPalette } from "./time-system";

/** Deterministic PRNG so star positions never differ between mounts. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SKY_VERT = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  varying vec3 vWorld;
  void main() {
    float h = clamp(normalize(vWorld).y, -1.0, 1.0);
    vec3 col = mix(uHorizon, uTop, smoothstep(-0.02, 0.5, h));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Gradient sky dome (custom shader so both stops can be lerped per frame —
 * a baked texture couldn't cross-fade) plus a deterministic starfield whose
 * opacity rides the blended `stars` factor.
 */
export function SkyDome() {
  const blend = useBlendedPalette();

  const skyMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTop: { value: new THREE.Color("#0a1a31") },
          uHorizon: { value: new THREE.Color("#153450") },
        },
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    [],
  );

  const starGeometry = useMemo(() => {
    const rand = mulberry32(20260702);
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Upper hemisphere shell, radius just inside the sky dome.
      const theta = rand() * Math.PI * 2;
      const y = 0.12 + rand() * 0.88;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      positions[i * 3] = Math.cos(theta) * r * 54;
      positions[i * 3 + 1] = y * 54;
      positions[i * 3 + 2] = Math.sin(theta) * r * 54;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const starMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#dce8f5",
        size: 0.85,
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        fog: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      skyMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    },
    [skyMaterial, starGeometry, starMaterial],
  );

  const stars = useRef<THREE.Points>(null);

  useFrame(() => {
    (skyMaterial.uniforms.uTop.value as THREE.Color).copy(blend.skyTop);
    (skyMaterial.uniforms.uHorizon.value as THREE.Color).copy(blend.skyHorizon);
    starMaterial.opacity = blend.stars;
    if (stars.current) stars.current.visible = blend.stars > 0.01;
  });

  return (
    <>
      <mesh material={skyMaterial} renderOrder={-2}>
        <sphereGeometry args={[60, 24, 16]} />
      </mesh>
      <points ref={stars} geometry={starGeometry} material={starMaterial} renderOrder={-1} />
    </>
  );
}
