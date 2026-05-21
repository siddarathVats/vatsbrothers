"use client";

import { useRef, type PointerEvent } from "react";
import { Reveal } from "./reveal";
import { TickerNum } from "./ticker-num";

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    if (!matchMedia("(hover: hover)").matches) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  return (
    <section
      className="hero"
      id="brothers"
      aria-labelledby="hero-h"
      ref={heroRef}
      onPointerMove={onMove}
    >
      <div className="hero__grid" aria-hidden />
      <div className="hero__bg" aria-hidden />
      <div className="hero__cursor" aria-hidden />
      <div className="container-1200">
        <Reveal initialIn>
          <span className="eyebrow">
            <span className="dot" aria-hidden />
            AI systems · LangGraph · Backend · Two timezones
          </span>
        </Reveal>
        <h1
          id="hero-h"
          className="reveal in"
          style={{ ["--d" as never]: "60ms" }}
        >
          <span className="line">We build AI systems</span>
          <span className="line line--2">for teams that need them shipped.</span>
        </h1>
        <Reveal as="p" className="lead" initialIn delay={160}>
          <strong>Siddarath</strong> and <strong>Vinayak Vats</strong> are
          brothers and AI engineers. One in Dallas, one in Ahmedabad. We design
          multi-agent systems, ship production RAG, and untangle the data and
          infra around them, together or independently.
        </Reveal>
        <Reveal className="cta-row" initialIn delay={240}>
          <a className="btn btn--primary" href="#contact">
            Connect with us{" "}
            <span className="arrow" aria-hidden>
              →
            </span>
          </a>
          <a className="btn" href="#siddarath">
            See our work
          </a>
        </Reveal>
        <Reveal
          className="ticker"
          initialIn
          delay={320}
        >
          <span className="metric">
            <TickerNum target={2} />
            <span className="muted">engineers</span>
          </span>
          <span className="sep">·</span>
          <span className="metric">
            <TickerNum target={4} />
            <span className="muted">+ years shipping</span>
          </span>
          <span className="sep">·</span>
          <span className="metric">
            <TickerNum target={10} />
            <span className="muted">+ active client projects</span>
          </span>
          <span className="sep">·</span>
          <span className="metric">
            <TickerNum target={3} />
            <span className="muted">continents</span>
          </span>
        </Reveal>
      </div>
    </section>
  );
}
