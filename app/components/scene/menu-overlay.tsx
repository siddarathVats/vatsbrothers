"use client";

import type { BrotherId } from "./characters";

const YEAR_TAG = "v2026.07"; // Warlords-style "version 1.0.4" homage, current year/build

/**
 * The Warlords: Heroes-style left menu — real DOM (crisp text, keyboard
 * accessible), ornate serif, warm glow on hover like the reference's
 * highlighted "Cheat Menu" item. Siddarath/Vinayak open the work palettes
 * (the non-3D path to them); the rest jump to the existing page sections.
 */
export function MenuOverlay({
  onSelectBrother,
}: {
  onSelectBrother?: (id: BrotherId) => void;
}) {
  return (
    <>
      <nav className="scene-menu" aria-label="Scene menu">
        <button
          type="button"
          className="scene-menu__item"
          aria-haspopup="dialog"
          onClick={() => onSelectBrother?.("sid")}
        >
          Siddarath
        </button>
        <button
          type="button"
          className="scene-menu__item"
          aria-haspopup="dialog"
          onClick={() => onSelectBrother?.("vin")}
        >
          Vinayak
        </button>
        <a className="scene-menu__item" href="#together">
          Together
        </a>
        <a className="scene-menu__item" href="#stack">
          Stack
        </a>
        <a className="scene-menu__item" href="#contact">
          Contact
        </a>
      </nav>
      <span className="scene-version mono" aria-hidden>
        {YEAR_TAG}
      </span>
    </>
  );
}
