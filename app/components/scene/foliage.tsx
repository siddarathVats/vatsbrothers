"use client";
"use no memo";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBlendedPalette } from "./time-system";

// TODO: replace asset — the trees/ground are procedural low-poly stand-ins;
// swap for hand-painted foliage alpha planes / sculpted GLB props when the
// final art exists (see ASSETS.md).

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

const TREE_COUNT = 72;
const POND_POSITION: [number, number, number] = [-3.4, 0.012, 1.2];

/**
 * Forest clearing set dressing: radial vertex-darkened ground (lit center,
 * dark border — the painterly framing from the reference), an instanced
 * low-poly tree ring, the pond used by the Day fishing activity, and ground
 * mist planes whose opacity rides the blended `mist` factor.
 */
export function Foliage() {
  const blend = useBlendedPalette();

  // --- ground with radial darkening -------------------------------------
  const groundGeometry = useMemo(() => {
    const geo = new THREE.CircleGeometry(36, 48, 0, Math.PI * 2);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.getAttribute("position");
    const colors = new Float32Array(pos.count * 3);
    const center = new THREE.Color("#41603a");
    const rim = new THREE.Color("#0e150b");
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i += 1) {
      const r = Math.hypot(pos.getX(i), pos.getZ(i)) / 36;
      c.lerpColors(center, rim, Math.min(1, Math.pow(r, 0.72) * 1.15));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // --- instanced trees ----------------------------------------------------
  const trunks = useRef<THREE.InstancedMesh>(null);
  const canopies = useRef<THREE.InstancedMesh>(null);
  const treeTransforms = useMemo(() => {
    const rand = mulberry32(19941203);
    const items: { x: number; z: number; s: number; tint: number }[] = [];
    for (let i = 0; i < TREE_COUNT; i += 1) {
      const a = (i / TREE_COUNT) * Math.PI * 2 + rand() * 0.35;
      const radius = 7.5 + rand() * 6.5;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      // Keep the camera lane (behind, +z toward viewer) a little clearer.
      if (z > 6.5 && Math.abs(x) < 4) continue;
      const s = 0.8 + rand() * 1.3;
      const tint = Math.min(1, (radius - 7) / 6);
      items.push({ x, z, s, tint });
    }
    return items;
  }, []);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    const near = new THREE.Color("#3c6136");
    const far = new THREE.Color("#111c0f");
    const trunkNear = new THREE.Color("#4c3624");
    const trunkFar = new THREE.Color("#191209");
    const c = new THREE.Color();
    treeTransforms.forEach((tr, i) => {
      dummy.position.set(tr.x, 0, tr.z);
      dummy.scale.set(tr.s, tr.s, tr.s);
      dummy.rotation.y = tr.x * 7.3;
      dummy.updateMatrix();
      trunks.current?.setMatrixAt(i, dummy.matrix);
      canopies.current?.setMatrixAt(i, dummy.matrix);
      c.lerpColors(near, far, tr.tint);
      canopies.current?.setColorAt(i, c);
      c.lerpColors(trunkNear, trunkFar, tr.tint);
      trunks.current?.setColorAt(i, c);
    });
    if (trunks.current) {
      // Unused instances keep identity matrices — clamp count so they never draw.
      trunks.current.count = treeTransforms.length;
      trunks.current.instanceMatrix.needsUpdate = true;
      if (trunks.current.instanceColor) trunks.current.instanceColor.needsUpdate = true;
    }
    if (canopies.current) {
      canopies.current.count = treeTransforms.length;
      canopies.current.instanceMatrix.needsUpdate = true;
      if (canopies.current.instanceColor) canopies.current.instanceColor.needsUpdate = true;
    }
  }, [treeTransforms]);

  // --- mist ---------------------------------------------------------------
  const mistTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 8, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(215, 225, 235, 0.55)");
    grad.addColorStop(1, "rgba(215, 225, 235, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);
  const mistMaterials = useRef<THREE.MeshBasicMaterial[]>([]);

  useEffect(
    () => () => {
      groundGeometry.dispose();
      mistTexture.dispose();
    },
    [groundGeometry, mistTexture],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    mistMaterials.current.forEach((m, i) => {
      if (m) m.opacity = blend.mist * (0.26 + 0.08 * Math.sin(t * 0.2 + i * 2.1));
    });
  });

  return (
    <>
      <mesh geometry={groundGeometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>

      {/* Pond — the Day fishing spot, left scene edge */}
      <mesh position={POND_POSITION} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 26]} />
        <meshStandardMaterial
          color="#16323b"
          emissive="#1d4a52"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.55}
        />
      </mesh>

      <instancedMesh ref={trunks} args={[undefined, undefined, TREE_COUNT]} frustumCulled={false}>
        <cylinderGeometry args={[0.09, 0.14, 1.4, 6]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={canopies} args={[undefined, undefined, TREE_COUNT]} frustumCulled={false}>
        <coneGeometry args={[0.85, 2.3, 7]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>

      {/* Ground mist (dawn / late night) */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[-2.5 + i * 2.6, 0.32 + i * 0.07, 1.8 - i * 1.4]}
          rotation={[-Math.PI / 2.6, 0, i * 1.4]}
        >
          <planeGeometry args={[7.5, 3.4]} />
          <meshBasicMaterial
            ref={(m) => {
              if (m) mistMaterials.current[i] = m;
            }}
            map={mistTexture}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}
