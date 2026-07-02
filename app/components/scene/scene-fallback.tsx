/**
 * Static painterly stand-in for the 3D scene. Pure CSS layers whose colors
 * come from the `[data-segment="…"]` custom-property blocks in globals.css
 * (kept in sync with lib/timeSegments.ts), so it needs no JS to show the
 * correct time of day — the section's data-segment attribute is stamped
 * before first paint by an inline script. Used as (a) the dynamic-import
 * loading state and (b) the full replacement on low-power devices, under
 * prefers-reduced-motion, or when WebGL is unavailable. Deliberately
 * animation-free: the site's reduced-motion CSS zeroes animations anyway.
 */
// TODO: replace asset — swap these CSS gradient "paintings" for real
// painterly stills at public/scene/fallbacks/{dawn,day,afternoon,night,latenight}.webp
// (1920×1080), applied as background-image per [data-segment] block.
export function SceneFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div className="scene-fallback" aria-hidden>
      <div className="scene-fallback__sky" />
      <div className="scene-fallback__treeline scene-fallback__treeline--far" />
      <div className="scene-fallback__treeline scene-fallback__treeline--near" />
      <div className="scene-fallback__ground" />
      <div className="scene-fallback__glow" />
      {loading && <div className="scene-fallback__hint mono">lighting the fire…</div>}
    </div>
  );
}
