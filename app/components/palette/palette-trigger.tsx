"use client";

import type { ReactNode } from "react";
import type { BrotherId } from "@/lib/brothers";
import { usePalette } from "./palette-provider";

/**
 * Client button wrapper so server components (e.g. the photo cards in
 * "Meet the brothers") can open a brother's achievements + work palette.
 */
export function PaletteTrigger({
  brother,
  label,
  className,
  children,
}: {
  brother: BrotherId;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const { open } = usePalette();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      aria-label={label}
      onClick={() => open(brother)}
    >
      {children}
    </button>
  );
}
