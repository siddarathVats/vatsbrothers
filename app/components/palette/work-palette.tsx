"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, FileText, Github, Linkedin, Mail, Trophy, X } from "lucide-react";
import { BROTHERS, type BrotherId, type BrotherLink } from "@/lib/brothers";

const LINK_ICONS: Record<BrotherLink["kind"], typeof Mail> = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  upwork: ExternalLink,
  resume: FileText,
};

/**
 * The per-brother "palette": a DOM dialog (crisp text, screen-reader and
 * keyboard friendly — never in-canvas) listing achievements first, then
 * selected work, then contact/resume links. Blur+dim backdrop covers the
 * scene behind it; Esc, the close button, and click-outside dismiss it.
 */
export function WorkPalette({
  active,
  onClose,
}: {
  active: BrotherId | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Minimal focus trap: cycle within the panel.
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, onClose]);

  const profile = active ? BROTHERS[active] : null;

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          key={profile.id}
          className="palette"
          role="dialog"
          aria-modal="true"
          aria-labelledby="palette-title"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            ref={panelRef}
            className="palette__panel"
            data-brother={profile.id}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 48, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={closeRef}
              type="button"
              className="palette__close"
              onClick={onClose}
              aria-label="Close"
            >
              <X aria-hidden />
            </button>

            <header className="palette__head">
              <h2 id="palette-title">
                <span className="accent-dot" aria-hidden />
                {profile.name}
              </h2>
              <p className="palette__role">
                {profile.role} · {profile.location}
              </p>
            </header>

            <section aria-labelledby="palette-achievements">
              <h3 id="palette-achievements" className="palette__sec mono">
                <Trophy size={13} aria-hidden /> Achievements
              </h3>
              <ul className="palette__achievements">
                {profile.achievements.map((a) => (
                  <li key={a.label}>
                    <strong>{a.label}</strong>
                    {a.detail && <span>{a.detail}</span>}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="palette-work">
              <h3 id="palette-work" className="palette__sec mono">
                Selected work
              </h3>
              <ul className="palette__works">
                {profile.works.map((w) => (
                  <li key={w.title} className="palette__work">
                    <div className="palette__work-head">
                      <strong>{w.title}</strong>
                      {w.href && (
                        <a
                          href={w.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`Open ${w.title}`}
                        >
                          <ExternalLink size={14} aria-hidden />
                        </a>
                      )}
                    </div>
                    <p>{w.blurb}</p>
                    <div className="palette__chips">
                      {w.tech.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <footer className="palette__links">
              {profile.links.map((l) => {
                const Icon = LINK_ICONS[l.kind];
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    target={l.kind === "mail" ? undefined : "_blank"}
                    rel="noreferrer noopener"
                  >
                    <Icon size={14} aria-hidden /> {l.label}
                  </a>
                );
              })}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
