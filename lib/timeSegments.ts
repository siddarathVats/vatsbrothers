/**
 * Time-of-day system for the campfire landing scene.
 *
 * The visitor's local clock picks one of five segments; every scene system
 * (sky, lights, fog, fire, particles, character activity) reads its values
 * from the single SEGMENTS config below so the palette stays tunable in one
 * place. Keep the hex values in sync with the `[data-segment="…"]` CSS
 * blocks in app/globals.css (used by the static fallback painting).
 */

export type TimeSegmentId = "dawn" | "day" | "afternoon" | "night" | "latenight";

export type ActivityId = "waking" | "fishing" | "supper" | "working" | "dozing";

export interface SegmentPalette {
  id: TimeSegmentId;
  label: string;
  /** [start, end) in local hours; latenight wraps midnight. */
  hours: [number, number];
  sky: { top: string; horizon: string };
  hemisphere: { sky: string; ground: string; intensity: number };
  ambientIntensity: number;
  /** Directional key light — sun by day, moon by night. */
  sun: { direction: [number, number, number]; color: string; intensity: number };
  fog: { color: string; density: number };
  /** Flicker range for the campfire point light — nonzero in every segment. */
  fire: { min: number; max: number; color: string };
  /** 0..1 visibility factors, cross-faded with everything else. */
  sparks: number;
  stars: number;
  fireflies: number;
  mist: number;
  activity: ActivityId;
}

export const SEGMENT_ORDER = [
  "dawn",
  "day",
  "afternoon",
  "night",
  "latenight",
] as const satisfies readonly TimeSegmentId[];

export const SEGMENTS: Record<TimeSegmentId, SegmentPalette> = {
  dawn: {
    id: "dawn",
    label: "Dawn",
    hours: [5, 8],
    sky: { top: "#46618f", horizon: "#f0b287" },
    hemisphere: { sky: "#a9bedd", ground: "#3c4837", intensity: 0.55 },
    ambientIntensity: 0.22,
    sun: { direction: [7, 2.2, 4], color: "#ffd9a0", intensity: 1.3 },
    fog: { color: "#aebccb", density: 0.026 },
    fire: { min: 0.5, max: 1.0, color: "#ff9c4a" },
    sparks: 0,
    stars: 0.12,
    fireflies: 0,
    mist: 0.8,
    activity: "waking",
  },
  day: {
    id: "day",
    label: "Day",
    hours: [8, 16],
    sky: { top: "#64aee6", horizon: "#cfe9f2" },
    hemisphere: { sky: "#bfe3ff", ground: "#47693c", intensity: 0.95 },
    ambientIntensity: 0.45,
    sun: { direction: [4, 9, 3], color: "#fff3d1", intensity: 2.4 },
    fog: { color: "#c8e0e9", density: 0.011 },
    fire: { min: 0.35, max: 0.7, color: "#ffa85c" },
    sparks: 0,
    stars: 0,
    fireflies: 0,
    mist: 0,
    activity: "fishing",
  },
  afternoon: {
    id: "afternoon",
    label: "Afternoon",
    hours: [16, 19],
    sky: { top: "#6f7fae", horizon: "#f4a15b" },
    hemisphere: { sky: "#e8c9a0", ground: "#564e2d", intensity: 0.7 },
    ambientIntensity: 0.32,
    sun: { direction: [-7, 2.6, 2], color: "#ffb45e", intensity: 2.1 },
    fog: { color: "#d3ac86", density: 0.015 },
    fire: { min: 0.7, max: 1.3, color: "#ff9440" },
    sparks: 0,
    stars: 0.04,
    fireflies: 0.15,
    mist: 0.08,
    activity: "supper",
  },
  night: {
    id: "night",
    label: "Night",
    hours: [19, 23],
    sky: { top: "#0a1a31", horizon: "#153450" },
    hemisphere: { sky: "#24425e", ground: "#101c14", intensity: 0.38 },
    ambientIntensity: 0.15,
    sun: { direction: [-4, 7, -5], color: "#9fc4e8", intensity: 0.5 },
    fog: { color: "#0d1f30", density: 0.02 },
    fire: { min: 2.3, max: 3.6, color: "#ff8f2e" },
    sparks: 1,
    stars: 1,
    fireflies: 1,
    mist: 0.15,
    activity: "working",
  },
  latenight: {
    id: "latenight",
    label: "Late night",
    hours: [23, 5],
    sky: { top: "#04060c", horizon: "#0a1119" },
    hemisphere: { sky: "#17212d", ground: "#0a0d09", intensity: 0.24 },
    ambientIntensity: 0.08,
    sun: { direction: [-6, 8, -4], color: "#b8cfe8", intensity: 0.8 },
    fog: { color: "#070c12", density: 0.031 },
    fire: { min: 1.0, max: 1.7, color: "#ff8330" },
    sparks: 1,
    stars: 0.85,
    fireflies: 0.3,
    mist: 0.9,
    activity: "dozing",
  },
};

export function getSegment(hours: number): TimeSegmentId {
  if (hours >= 5 && hours < 8) return "dawn";
  if (hours >= 8 && hours < 16) return "day";
  if (hours >= 16 && hours < 19) return "afternoon";
  if (hours >= 19 && hours < 23) return "night";
  return "latenight"; // 23:00–04:59, wraps midnight
}

/**
 * Inline-script body that stamps the correct `data-segment` on the hero
 * before first paint, so neither the SSR default nor the loading fallback
 * ever flashes the wrong time of day. Must mirror getSegment().
 */
export const SEGMENT_BOOT_SCRIPT = `(function(){var h=new Date().getHours();var s=h>=5&&h<8?"dawn":h>=8&&h<16?"day":h>=16&&h<19?"afternoon":h>=19&&h<23?"night":"latenight";var el=document.currentScript&&document.currentScript.parentElement;if(el)el.setAttribute("data-segment",s);})();`;
