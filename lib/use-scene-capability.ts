"use client";

import { useEffect, useState } from "react";

export type SceneCapability = "pending" | "full" | "fallback";

/**
 * Decides whether the device gets the live 3D scene or the static painterly
 * fallback. Starts "pending" (fallback visuals) so low-power devices never
 * download the three.js chunk at all. Testing override: ?scene=off|on.
 *
 * Fallback when any of: prefers-reduced-motion, low device memory or few
 * cores (heuristics; undefined passes), or WebGL2 unavailable.
 */
export function useSceneCapability(): SceneCapability {
  const [capability, setCapability] = useState<SceneCapability>("pending");

  useEffect(() => {
    const decide = (): SceneCapability => {
      const qs = new URLSearchParams(window.location.search).get("scene");
      if (qs === "off") return "fallback";
      if (qs === "on") return "full";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "fallback";
      const nav = navigator as Navigator & { deviceMemory?: number };
      if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return "fallback";
      if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 3) return "fallback";
      try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2");
        if (!gl) return "fallback";
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        return "fallback";
      }
      return "full";
    };
    setCapability(decide());
  }, []);

  return capability;
}
