"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BrotherId } from "@/lib/brothers";
import { WorkPalette } from "./work-palette";

type Ctx = {
  active: BrotherId | null;
  open: (id: BrotherId) => void;
  close: () => void;
};

const PaletteCtx = createContext<Ctx>({
  active: null,
  open: () => {},
  close: () => {},
});

export function usePalette() {
  return useContext(PaletteCtx);
}

/**
 * Shared open/close state for the per-brother achievements + work overlay.
 * Mirrors the LightboxProvider pattern; mounted in the root layout so the
 * palette can be opened from the 3D scene, the scene menu, AND the photo
 * cards in "Meet the brothers". Restores focus to the invoking element on
 * close (the invoker is captured at open time).
 */
export function PaletteProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<BrotherId | null>(null);
  const invokerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((id: BrotherId) => {
    invokerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActive(id);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    invokerRef.current?.focus?.();
    invokerRef.current = null;
  }, []);

  return (
    <PaletteCtx.Provider value={{ active, open, close }}>
      {children}
      <WorkPalette active={active} onClose={close} />
    </PaletteCtx.Provider>
  );
}
