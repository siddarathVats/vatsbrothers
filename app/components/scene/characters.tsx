"use client";
"use no memo";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import type { ActivityId } from "@/lib/timeSegments";

// TODO: replace asset — swap these primitive rigs for rigged GLTF models at
// public/scene/models/sid.glb and public/scene/models/vin.glb (loaded via
// drei useGLTF), keeping the same <Brother> props / seat / activity API and
// per-activity animation clips (idle, type, sip, fish, stretch, doze).

export type BrotherId = "sid" | "vin";

interface PoseSpec {
  /** Root seat position (x, z) and the point (x, z) the figure faces. */
  seat: [number, number];
  face: [number, number];
  torsoLean: number; // rotation.x, + leans forward
  headDrop: number; // rotation.x, + drops chin
  armL: [number, number, number];
  armR: [number, number, number];
  laptop: "open" | "closed" | null;
  laptopGlow: number; // emissive intensity of the screen when open
  mug: boolean;
  rod: boolean;
  typing: boolean;
  dozing: boolean;
}

const FIRE_XZ: [number, number] = [1.4, 0.2];
const POND_XZ: [number, number] = [-3.4, 1.2];

const SEATS: Record<BrotherId, [number, number]> = {
  sid: [0.5, 0.9],
  vin: [2.3, 0.7],
};
const POND_SEATS: Record<BrotherId, [number, number]> = {
  sid: [-2.1, 0.7],
  vin: [-1.9, 2.1],
};

const ARMS_LAP: [number, number, number] = [-1.05, 0, 0.15];
const ARMS_TYPE: [number, number, number] = [-1.25, 0, 0.12];
const ARMS_UP: [number, number, number] = [-2.7, 0, 0.35];
const ARM_SIP: [number, number, number] = [-2.05, 0, -0.35];
const ARMS_ROD: [number, number, number] = [-1.35, 0, 0.1];

function pose(base: Partial<PoseSpec> & { seat: [number, number]; face: [number, number] }): PoseSpec {
  return {
    torsoLean: 0.08,
    headDrop: 0,
    armL: ARMS_LAP,
    armR: ARMS_LAP,
    laptop: null,
    laptopGlow: 0,
    mug: false,
    rod: false,
    typing: false,
    dozing: false,
    ...base,
  };
}

/** Per-activity, per-brother pose + prop table (spec §five time segments). */
const POSES: Record<ActivityId, Record<BrotherId, PoseSpec>> = {
  waking: {
    sid: pose({ seat: SEATS.sid, face: FIRE_XZ, torsoLean: -0.12, headDrop: -0.2, armL: ARMS_UP, armR: ARMS_UP }),
    vin: pose({ seat: SEATS.vin, face: FIRE_XZ, torsoLean: -0.08, headDrop: -0.14, armL: ARMS_UP, armR: [-1.5, 0, 0.5] }),
  },
  fishing: {
    sid: pose({ seat: POND_SEATS.sid, face: POND_XZ, torsoLean: 0.12, headDrop: 0.1, armL: ARMS_ROD, armR: ARMS_ROD, rod: true, laptop: "closed" }),
    vin: pose({ seat: POND_SEATS.vin, face: POND_XZ, torsoLean: 0.1, headDrop: 0.12, armL: ARMS_ROD, armR: ARMS_ROD, rod: true, laptop: "closed" }),
  },
  supper: {
    sid: pose({ seat: SEATS.sid, face: FIRE_XZ, torsoLean: 0.16, armL: ARMS_TYPE, armR: ARMS_TYPE, laptop: "open", laptopGlow: 1.1, typing: true }),
    vin: pose({ seat: SEATS.vin, face: FIRE_XZ, torsoLean: 0.02, headDrop: 0.08, armL: ARMS_LAP, armR: ARM_SIP, mug: true }),
  },
  working: {
    sid: pose({ seat: SEATS.sid, face: FIRE_XZ, torsoLean: 0.18, headDrop: 0.16, armL: ARMS_TYPE, armR: ARMS_TYPE, laptop: "open", laptopGlow: 2.4, typing: true }),
    vin: pose({ seat: SEATS.vin, face: FIRE_XZ, torsoLean: 0.2, headDrop: 0.18, armL: ARMS_TYPE, armR: ARMS_TYPE, laptop: "open", laptopGlow: 2.4, typing: true }),
  },
  dozing: {
    sid: pose({ seat: SEATS.sid, face: FIRE_XZ, torsoLean: 0.34, headDrop: 0.55, armL: ARMS_LAP, armR: ARMS_LAP, dozing: true }),
    vin: pose({ seat: SEATS.vin, face: FIRE_XZ, torsoLean: 0.16, headDrop: 0.14, armL: ARMS_TYPE, armR: ARMS_TYPE, laptop: "open", laptopGlow: 1.8, typing: true }),
  },
};

const LOOKS: Record<
  BrotherId,
  { name: string; tunic: string; hair: string; phase: number }
> = {
  sid: { name: "Siddarath", tunic: "#3e88c2", hair: "#241f1c", phase: 0 },
  vin: { name: "Vinayak", tunic: "#c2564e", hair: "#1d1815", phase: 2.4 },
};

const SKIN = "#e0b48f";
const PANTS = "#39404d";
const EYE = "#181210";

/** 0 → 1 pulse when x crosses near its peak — used for occasional glances. */
function pulse(x: number): number {
  return THREE.MathUtils.smoothstep(x, 0.86, 0.97);
}

/** Shared 3-step toon gradient — module scope, created once, never disposed. */
let toonGradient: THREE.DataTexture | null = null;
function getToonGradient(): THREE.DataTexture {
  if (!toonGradient) {
    const data = new Uint8Array([90, 170, 255, 255]);
    toonGradient = new THREE.DataTexture(data, 4, 1, THREE.RedFormat);
    toonGradient.minFilter = THREE.NearestFilter;
    toonGradient.magFilter = THREE.NearestFilter;
    toonGradient.needsUpdate = true;
  }
  return toonGradient;
}

function useToon(color: string) {
  return useMemo(
    () => new THREE.MeshToonMaterial({ color, gradientMap: getToonGradient() }),
    [color],
  );
}

export function Brother({
  id,
  activity,
  onSelect,
}: {
  id: BrotherId;
  activity: ActivityId;
  onSelect?: (id: BrotherId) => void;
}) {
  const look = LOOKS[id];
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const laptop = useRef<THREE.Group>(null);
  const laptopLid = useRef<THREE.Group>(null);
  const laptopScreen = useRef<THREE.MeshStandardMaterial>(null);
  const mug = useRef<THREE.Group>(null);
  const rod = useRef<THREE.Group>(null);

  const tunicMat = useToon(look.tunic);
  const skinMat = useToon(SKIN);
  const pantsMat = useToon(PANTS);
  const hairMat = useToon(look.hair);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime + look.phase;
    const p = POSES[activity][id];

    if (root.current) {
      // Seat + facing ease between fire-side and pond-side per activity.
      easing.damp(root.current.position, "x", p.seat[0], 0.6, delta);
      easing.damp(root.current.position, "z", p.seat[1], 0.6, delta);
      const targetYaw = Math.atan2(p.face[0] - p.seat[0], p.face[1] - p.seat[1]);
      easing.damp(root.current.rotation, "y", targetYaw, 0.5, delta);
      // Hover lift.
      const s = hovered ? 1.045 : 1;
      easing.damp(root.current.scale, "x", s, 0.12, delta);
      easing.damp(root.current.scale, "y", s, 0.12, delta);
      easing.damp(root.current.scale, "z", s, 0.12, delta);
    }

    // Idle sway + pose damping (pose changes ride the segment cross-fade).
    const breathe = Math.sin(t * 1.05) * 0.018;
    const dozeSway = p.dozing ? Math.sin(t * 0.45) * 0.05 : 0;
    if (torso.current) {
      // Slow weight shift so the whole figure never sits perfectly still.
      const shift = Math.sin(t * 0.31) * 0.015;
      easing.damp(torso.current.rotation, "x", p.torsoLean + dozeSway, 0.5, delta);
      torso.current.scale.y = 1 + breathe;
      torso.current.rotation.z = Math.sin(t * 0.7) * 0.02 + shift;
    }
    if (head.current) {
      // Layered head life: typing nods, doze nod-off with a jerk awake,
      // wandering gaze, and occasional glances toward the other brother.
      const typingNod = p.typing ? Math.sin(t * 4.3) * 0.024 : 0;
      const dozeNod = p.dozing
        ? Math.pow(Math.max(0, Math.sin(t * 0.18)), 9) * -0.35
        : 0;
      easing.damp(
        head.current.rotation,
        "x",
        p.headDrop + dozeSway * 1.6 + typingNod + dozeNod,
        0.3,
        delta,
      );
      const wander = 0.1 * Math.sin(t * 0.23) + 0.05 * Math.sin(t * 0.61 + 2);
      const glance = pulse(Math.sin(t * 0.14 + look.phase * 1.7));
      const glanceYaw = (id === "sid" ? 0.55 : -0.55) * glance;
      easing.damp(head.current.rotation, "y", p.dozing ? 0 : wander + glanceYaw, 0.3, delta);
      head.current.rotation.z = Math.sin(t * 0.6 + 1) * 0.03;
    }
    if (eyes.current) {
      // Blinks (quick dips) — held closed while dozing.
      const blink = 1 - THREE.MathUtils.smoothstep(Math.sin(t * 1.9 + look.phase * 5), 0.982, 0.995) * 0.9;
      easing.damp(eyes.current.scale, "y", p.dozing ? 0.12 : blink, 0.06, delta);
    }
    const typeJitter = p.typing ? Math.sin(t * 9.5) * 0.05 : 0;
    const armDrift = Math.sin(t * 0.5 + look.phase) * 0.015;
    if (armL.current) {
      easing.damp(armL.current.rotation, "x", p.armL[0] + typeJitter + armDrift, 0.45, delta);
      easing.damp(armL.current.rotation, "z", p.armL[2], 0.45, delta);
    }
    if (armR.current) {
      const sipBob = p.mug ? Math.sin(t * 0.9) * 0.06 : 0;
      easing.damp(armR.current.rotation, "x", p.armR[0] - typeJitter + sipBob - armDrift, 0.45, delta);
      easing.damp(armR.current.rotation, "z", p.armR[2], 0.45, delta);
    }
    if (rod.current && p.rod) {
      // Rod bobs on the water, with an occasional sharp tug on the line.
      const tug = Math.pow(Math.max(0, Math.sin(t * 0.27 + look.phase)), 21) * 0.28;
      rod.current.rotation.x = 0.5 + Math.sin(t * 0.9 + look.phase) * 0.045 + tug;
    }

    // Props scale in/out smoothly instead of popping.
    const dampProp = (ref: React.RefObject<THREE.Group | null>, show: boolean) => {
      const g = ref.current;
      if (!g) return;
      easing.damp(g.scale, "x", show ? 1 : 0.0001, 0.35, delta);
      easing.damp(g.scale, "y", show ? 1 : 0.0001, 0.35, delta);
      easing.damp(g.scale, "z", show ? 1 : 0.0001, 0.35, delta);
      g.visible = g.scale.x > 0.01;
    };
    dampProp(laptop, p.laptop !== null);
    dampProp(mug, p.mug);
    dampProp(rod, p.rod);
    if (laptopLid.current) {
      easing.damp(
        laptopLid.current.rotation,
        "x",
        p.laptop === "open" ? -1.85 : -0.12,
        0.4,
        delta,
      );
    }
    if (laptopScreen.current) {
      easing.damp(laptopScreen.current, "emissiveIntensity", p.laptop === "open" ? p.laptopGlow : 0, 0.4, delta);
    }

    // Hover emissive lift on the tunic.
    const lift = hovered ? 0.32 : 0;
    tunicMat.emissive.set(look.tunic);
    easing.damp(tunicMat, "emissiveIntensity", lift, 0.15, delta);
  });

  return (
    <group
      ref={root}
      position={[SEATS[id][0], 0, SEATS[id][1]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      {/* Log seat */}
      <mesh position={[0, 0.2, -0.12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.8, 9]} />
        <meshStandardMaterial color="#4a3622" roughness={0.95} />
      </mesh>

      {/* Legs (seated) */}
      <group position={[0, 0.42, 0]}>
        <mesh position={[-0.12, 0, 0.2]} rotation={[Math.PI / 2.25, 0, 0]} material={pantsMat}>
          <capsuleGeometry args={[0.085, 0.3, 3, 8]} />
        </mesh>
        <mesh position={[0.12, 0, 0.2]} rotation={[Math.PI / 2.25, 0, 0]} material={pantsMat}>
          <capsuleGeometry args={[0.085, 0.3, 3, 8]} />
        </mesh>
        <mesh position={[-0.13, -0.2, 0.38]} material={pantsMat}>
          <capsuleGeometry args={[0.07, 0.26, 3, 8]} />
        </mesh>
        <mesh position={[0.13, -0.2, 0.38]} material={pantsMat}>
          <capsuleGeometry args={[0.07, 0.26, 3, 8]} />
        </mesh>
      </group>

      {/* Torso + head + arms pivot */}
      <group ref={torso} position={[0, 0.55, 0]}>
        <mesh position={[0, 0.28, 0]} material={tunicMat}>
          <capsuleGeometry args={[0.23, 0.4, 4, 12]} />
        </mesh>
        <group ref={head} position={[0, 0.72, 0]}>
          <mesh material={skinMat}>
            <sphereGeometry args={[0.185, 16, 14]} />
          </mesh>
          <mesh position={[0, 0.09, -0.02]} material={hairMat}>
            <sphereGeometry args={[0.19, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
          </mesh>
          {/* Eyes — blink via group scale.y; held shut while dozing */}
          <group ref={eyes} position={[0, 0.015, 0]}>
            <mesh position={[-0.066, 0, 0.164]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshBasicMaterial color={EYE} />
            </mesh>
            <mesh position={[0.066, 0, 0.164]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshBasicMaterial color={EYE} />
            </mesh>
          </group>
          {/* Little nose so the face reads at a distance */}
          <mesh position={[0, -0.035, 0.18]} material={skinMat}>
            <sphereGeometry args={[0.028, 8, 8]} />
          </mesh>
        </group>
        <group ref={armL} position={[-0.29, 0.48, 0]} rotation={[-1.05, 0, 0.15]}>
          <mesh position={[0, -0.24, 0]} material={tunicMat}>
            <capsuleGeometry args={[0.065, 0.34, 3, 8]} />
          </mesh>
          <mesh position={[0, -0.46, 0]} material={skinMat}>
            <sphereGeometry args={[0.06, 8, 8]} />
          </mesh>
        </group>
        <group ref={armR} position={[0.29, 0.48, 0]} rotation={[-1.05, 0, -0.15]}>
          <mesh position={[0, -0.24, 0]} material={tunicMat}>
            <capsuleGeometry args={[0.065, 0.34, 3, 8]} />
          </mesh>
          <mesh position={[0, -0.46, 0]} material={skinMat}>
            <sphereGeometry args={[0.06, 8, 8]} />
          </mesh>
          {/* Mug rides the right hand (supper) */}
          <group ref={mug} position={[0, -0.5, 0.06]} visible={false}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.045, 0.1, 10]} />
              <meshStandardMaterial color="#8a4b2d" roughness={0.7} />
            </mesh>
            <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.035, 0.01, 6, 10]} />
              <meshStandardMaterial color="#8a4b2d" roughness={0.7} />
            </mesh>
          </group>
          {/* Fishing rod rides the right hand (day) */}
          <group ref={rod} position={[0, -0.48, 0.05]} rotation={[0.5, 0, 0]} visible={false}>
            <mesh position={[0, 0.05, 0.75]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.02, 1.7, 6]} />
              <meshStandardMaterial color="#6b4a2a" roughness={0.85} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Laptop on the lap */}
      <group ref={laptop} position={[0, 0.62, 0.34]} rotation={[0, 0, 0]} visible={false}>
        <mesh>
          <boxGeometry args={[0.38, 0.022, 0.26]} />
          <meshStandardMaterial color="#2b2f36" roughness={0.5} metalness={0.4} />
        </mesh>
        <group ref={laptopLid} position={[0, 0.01, -0.13]} rotation={[-1.85, 0, 0]}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.38, 0.25, 0.014]} />
            <meshStandardMaterial color="#23272e" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Glowing screen face — pushed past 1 at night so bloom catches it */}
          <mesh position={[0, 0.12, 0.009]}>
            <planeGeometry args={[0.34, 0.21]} />
            <meshStandardMaterial
              ref={laptopScreen}
              color="#0c1118"
              emissive="#bfe3ff"
              emissiveIntensity={0}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* Floating name label on hover */}
      {hovered && (
        <Html center position={[0, 1.75, 0]} distanceFactor={9} style={{ pointerEvents: "none" }}>
          <span className="scene-name-label">{look.name}</span>
        </Html>
      )}
    </group>
  );
}
