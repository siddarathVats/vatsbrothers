"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun } from "lucide-react";

const ANCHORS = [
  ["#brothers", "Brothers"],
  ["#siddarath", "Siddarath"],
  ["#vinayak", "Vinayak"],
  ["#together", "Together"],
  ["#stack", "Stack"],
  ["#contact", "Contact"],
] as const;

export function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setStuck(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);
  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <>
      <header className={`nav${stuck ? " is-stuck" : ""}`} id="nav" role="banner">
        <div className="container-1200 nav__inner">
          <a className="logo" href="#brothers" aria-label="Vats Brothers home">
            <span>vats</span>
            <span className="slash">/</span>
            <b>brothers</b>
          </a>
          <nav className="nav__anchors" aria-label="Primary">
            {ANCHORS.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav__right">
            <button
              className="icon-btn"
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon aria-hidden /> : <Sun aria-hidden />}
            </button>
            <button
              className="icon-btn menu-btn"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu aria-hidden />
            </button>
            <a className="pill" href="#contact">
              <span className="pill__dot" aria-hidden />
              Connect with us
            </a>
          </div>
        </div>
      </header>
      <div
        className={`menu${open ? " open" : ""}`}
        id="menu"
        aria-hidden={!open}
      >
        {ANCHORS.map(([href, label]) => (
          <a key={href} href={href} onClick={closeMenu}>
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
