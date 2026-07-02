# Scene assets — what's placeholder and what to supply

The campfire landing scene ships with procedural placeholders. Every
consumption site carries a matching `// TODO: replace asset` comment.
Supplying the items below upgrades the look without code changes beyond the
marked swap points.

## 1. Rigged characters (highest impact)

| Target file | Notes |
|---|---|
| `public/scene/models/sid.glb` | Seated, stylized/toon, ≤15k tris |
| `public/scene/models/vin.glb` | Same style, distinct silhouette |

- Swap point: `app/components/scene/characters.tsx` (primitive rigs → drei `useGLTF`).
- Keep the same seat/activity API. Useful clips per model: `idle`, `type`,
  `sip`, `fish`, `stretch`, `doze`.

## 2. Painterly fallback stills (one per time segment)

| Target file | Mood |
|---|---|
| `public/scene/fallbacks/dawn.webp` | Cool blue→peach sky, mist, embers |
| `public/scene/fallbacks/day.webp` | Bright dappled greens, pond fishing |
| `public/scene/fallbacks/afternoon.webp` | Golden hour amber, mug + laptop |
| `public/scene/fallbacks/night.webp` | Deep teal forest, blazing fire, laptops |
| `public/scene/fallbacks/latenight.webp` | Near-black, moon rim, one dozing |

- ~1920×1080, hand-painted look matching the live scene's palette
  (`lib/timeSegments.ts` hex values).
- Swap point: `app/components/scene/scene-fallback.tsx` + the
  `[data-segment]` CSS blocks in `app/globals.css` (set as `background-image`
  per segment, replacing the gradient layers).
- Shown to: reduced-motion users, low-power devices, no-WebGL browsers, and
  as the loading state — worth making beautiful.

## 3. Foliage & ground textures (optional)

- 4–5 painted foliage alpha PNGs (tree clusters, bushes) to replace the
  instanced cone trees at the frame edges — swap point in
  `app/components/scene/foliage.tsx`.
- Painted ground texture (clearing → dark rim) to replace vertex-color
  gradient.
- Flame sprite sheet for richer fire than the two emissive cones —
  `app/components/scene/fire.tsx`.

## 4. OG image

- A rendered still of the **Night** scene (the hero state) at 1200×630 for
  `openGraph.images` in `app/layout.tsx` — currently unset.
