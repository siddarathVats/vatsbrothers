"use client";
"use no memo";

import { Bloom, EffectComposer } from "@react-three/postprocessing";

/**
 * Subtle bloom over anything emissive past 1.0 — the campfire flames and
 * the laptop screens at night (both use toneMapped={false} + emissive > 1).
 * The painterly edge vignette is CSS (scene-hero__vignette), not a pass.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.55} luminanceThreshold={1} luminanceSmoothing={0.25} />
    </EffectComposer>
  );
}
