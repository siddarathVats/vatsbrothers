"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

type Item = { src: string; alt: string };
type Ctx = {
  open: (item: Item) => void;
  close: () => void;
};

const LightboxCtx = createContext<Ctx>({
  open: () => {},
  close: () => {},
});

export function useLightbox() {
  return useContext(LightboxCtx);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<Item | null>(null);

  const open = useCallback((next: Item) => setItem(next), []);
  const close = useCallback(() => setItem(null), []);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, close]);

  return (
    <LightboxCtx.Provider value={{ open, close }}>
      {children}
      {item && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          onClick={close}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={close}
            aria-label="Close"
          >
            <X aria-hidden />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </LightboxCtx.Provider>
  );
}
