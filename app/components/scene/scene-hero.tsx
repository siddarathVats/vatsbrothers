"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSegment,
  SEGMENT_BOOT_SCRIPT,
  type TimeSegmentId,
} from "@/lib/timeSegments";
import { useSceneCapability } from "@/lib/use-scene-capability";
import { MenuOverlay } from "./menu-overlay";
import { TimeOverride } from "./time-override";
import { SceneFallback } from "./scene-fallback";
import { usePalette } from "../palette/palette-provider";
import type { BrotherId } from "./characters";

const SceneCanvas = dynamic(() => import("./scene-canvas"), {
  ssr: false,
  loading: () => <SceneFallback loading />,
});

/**
 * The interactive landing hero: a time-of-day-reactive campfire scene in the
 * spirit of the Warlords: Heroes title screen. This component owns the
 * segment state (real clock + manual override), pause logic, and the DOM
 * overlay (ornate menu, hero SEO text, time dots); the 3D canvas itself is
 * lazy-loaded client-only. The dark/light site theme deliberately does not
 * reach in here — the scene follows local time alone.
 */
export function SceneHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { active: activeBrother, open: openPalette } = usePalette();
  // "pending" during SSR/first paint (renders the fallback painting), then
  // "full" or "fallback" — low-power devices never download the 3D chunk.
  const capability = useSceneCapability();
  // Server renders "night"; nothing segment-dependent is SSR'd (the fallback
  // painting reads CSS vars stamped pre-paint by the inline boot script), so
  // the divergence never produces a visible wrong state.
  const [liveSegment, setLiveSegment] = useState<TimeSegmentId>(() =>
    typeof window === "undefined" ? "night" : getSegment(new Date().getHours()),
  );
  const [override, setOverride] = useState<TimeSegmentId | null>(null);
  const [tabVisible, setTabVisible] = useState(true);
  const [onScreen, setOnScreen] = useState(true);

  const segment = override ?? liveSegment;

  // Real-clock rollover — same cross-fade path as a manual override.
  useEffect(() => {
    const tick = () => setLiveSegment(getSegment(new Date().getHours()));
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Pause the render loop when the tab is hidden or the hero is scrolled away.
  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    const el = sectionRef.current;
    let io: IntersectionObserver | undefined;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => setOnScreen(entries[0]?.isIntersecting ?? true),
        { threshold: 0 },
      );
      io.observe(el);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  const handleSelect = useCallback(
    (id: BrotherId) => openPalette(id),
    [openPalette],
  );

  return (
    <section
      ref={sectionRef}
      className="scene-hero"
      id="brothers"
      aria-labelledby="hero-h"
      data-segment={capability === "pending" ? "night" : segment}
      suppressHydrationWarning
    >
      {/* Stamps the visitor's real segment before first paint — no flash. */}
      <script dangerouslySetInnerHTML={{ __html: SEGMENT_BOOT_SCRIPT }} />

      <div className="scene-hero__stage" aria-hidden>
        {capability === "full" ? (
          <SceneCanvas
            segment={segment}
            paused={!tabVisible || !onScreen}
            focusBrother={activeBrother}
            onSelectBrother={handleSelect}
          />
        ) : (
          <SceneFallback loading={capability === "pending"} />
        )}
        <div className="scene-hero__vignette" />
      </div>

      <MenuOverlay onSelectBrother={handleSelect} />
      <TimeOverride override={override} onChange={setOverride} />

      {/* Hero copy — real DOM for SEO/screen readers (spec requirement). */}
      <div className="scene-hero__text">
        <h1 id="hero-h">
          <span className="line">We build AI systems</span>
          <span className="line line--2">for teams that need them shipped.</span>
        </h1>
        <p className="lead visually-hidden">
          <strong>Siddarath</strong> and <strong>Vinayak Vats</strong> are
          brothers and AI engineers. One in Dallas, one in Ahmedabad. We design
          multi-agent systems, ship production RAG, and untangle the data and
          infra around them, together or independently.
        </p>
        <p className="visually-hidden">
          AI systems · LangGraph · Backend · Two timezones · 2 engineers · 4+
          years shipping · 10+ active client projects · 3 continents
        </p>
        <div className="scene-hero__cta">
          <a className="btn btn--primary" href="#contact">
            Connect with us{" "}
            <span className="arrow" aria-hidden>
              →
            </span>
          </a>
          <a className="btn" href="#siddarath">
            See our work
          </a>
        </div>
      </div>

      <div className="scene-hero__scrollhint mono" aria-hidden>
        scroll ↓
      </div>
    </section>
  );
}
