"use client";
"use no memo";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import type { ActivityId, TimeSegmentId } from "@/lib/timeSegments";
import { SEGMENTS } from "@/lib/timeSegments";
import { TimeSystem } from "./time-system";
import { Effects } from "./effects";
import { Lighting } from "./lighting";
import { SkyDome } from "./sky-dome";
import { Fire } from "./fire";
import { Foliage } from "./foliage";
import { Brother, type BrotherId } from "./characters";

const ENABLE_BLOOM = true;

const CAMERA_POSITION: [number, number, number] = [0, 3.1, 8.5];
const LOOK_AT = new THREE.Vector3(0.6, 0.7, 0);
const BASE_R = Math.hypot(CAMERA_POSITION[0] - LOOK_AT.x, CAMERA_POSITION[2] - LOOK_AT.z);
const BASE_ANGLE = Math.atan2(CAMERA_POSITION[0] - LOOK_AT.x, CAMERA_POSITION[2] - LOOK_AT.z);
/** Where the camera drifts when a brother's palette opens (fire-side seats). */
const FOCUS_POINTS: Record<BrotherId, THREE.Vector3> = {
  sid: new THREE.Vector3(0.5, 0.9, 0.9),
  vin: new THREE.Vector3(2.3, 0.9, 0.7),
};

/** Gentle pointer parallax + ease toward a selected brother. No controls. */
function CameraRig({ focus }: { focus: BrotherId | null }) {
  const yaw = useRef(0);
  const look = useRef(LOOK_AT.clone());
  const zoom = useRef({ r: BASE_R });
  useFrame((state, delta) => {
    const target = focus ? FOCUS_POINTS[focus] : LOOK_AT;
    easing.damp3(look.current, target, 0.5, delta);
    easing.damp(zoom.current, "r", focus ? BASE_R - 2.4 : BASE_R, 0.5, delta);
    easing.damp(yaw, "current", state.pointer.x * 0.026, 0.6, delta);
    const a = BASE_ANGLE + yaw.current;
    state.camera.position.set(
      look.current.x + Math.sin(a) * zoom.current.r,
      CAMERA_POSITION[1] + state.pointer.y * 0.12,
      look.current.z + Math.cos(a) * zoom.current.r,
    );
    state.camera.lookAt(look.current);
  });
  return null;
}

export interface SceneCanvasProps {
  segment: TimeSegmentId;
  paused: boolean;
  focusBrother?: BrotherId | null;
  onSelectBrother?: (id: BrotherId) => void;
}

/**
 * The full 3D scene. Client-only (imported via dynamic ssr:false); receives
 * the effective time segment as a prop — React context from the page cannot
 * cross the R3F reconciler root, so callbacks come in as props too.
 */
export default function SceneCanvas({
  segment,
  paused,
  focusBrother = null,
  onSelectBrother,
}: SceneCanvasProps) {
  const activity: ActivityId = SEGMENTS[segment].activity;
  return (
    <Canvas
      className="scene-hero__canvas"
      dpr={[1, 1.75]}
      camera={{ fov: 40, position: CAMERA_POSITION, near: 0.1, far: 130 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={paused ? "never" : "always"}
      onCreated={({ camera }) => camera.lookAt(LOOK_AT)}
    >
      <TimeSystem segment={segment}>
        <Suspense fallback={null}>
          <Lighting />
          <SkyDome />
          <Foliage />
          <Fire />
          <Brother id="sid" activity={activity} onSelect={onSelectBrother} />
          <Brother id="vin" activity={activity} onSelect={onSelectBrother} />
          <CameraRig focus={focusBrother} />
        </Suspense>
        {/* Own boundary: if the composer suspends/fails, the scene must not vanish */}
        {ENABLE_BLOOM && (
          <Suspense fallback={null}>
            <Effects />
          </Suspense>
        )}
      </TimeSystem>
    </Canvas>
  );
}
