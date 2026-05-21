"use client";

import { useCallback, type MouseEvent } from "react";

/**
 * Calendly profile URL. Opens the popup with the event-type picker so the
 * visitor can pick any of the published events. Swap to a specific event URL
 * (e.g. `https://calendly.com/vats-brothers/20min`) if you'd rather route
 * everyone straight into one event.
 */
export const CALENDLY_URL = "https://calendly.com/vats-brothers";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

function ensureCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export function BookButton({
  className = "book-link",
  children = (
    <>
      Or book 20 minutes <span aria-hidden>→</span>
    </>
  ),
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const onClick = useCallback(async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await ensureCalendly();
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
  }, []);

  return (
    <a
      className={className}
      href={CALENDLY_URL}
      target="_blank"
      rel="noreferrer noopener"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
