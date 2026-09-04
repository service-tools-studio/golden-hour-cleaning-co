"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Snapshot = {
  y: number;
  vvTop: number;
  vvH: number;
  innerH: number;
  hdrTop: number | string;
  heroTop: number | string;
  scrolled: string;
};

/**
 * Open with ?debugScroll=1
 * Portaled to document.body so it stays visible even when an inner scroller moves.
 */
export default function ScrollDebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<Snapshot | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("debugScroll") !== "1") return;
    setEnabled(true);

    const tick = () => {
      const vv = window.visualViewport;
      const header = document.querySelector("[data-site-header]");
      const hero = document.getElementById("hero");
      const scrolledEls = [
        ...document.querySelectorAll("html, body, div, main, section, aside, nav"),
      ]
        .filter((el): el is HTMLElement => el instanceof HTMLElement && el.scrollTop > 0)
        .map((el) => `${el.id || el.className?.toString?.().slice(0, 24) || el.tagName}:${Math.round(el.scrollTop)}`)
        .slice(0, 6);

      setInfo({
        y: window.scrollY | 0,
        vvTop: vv ? vv.offsetTop | 0 : -1,
        vvH: vv ? vv.height | 0 : -1,
        innerH: window.innerHeight | 0,
        hdrTop: header ? Math.round(header.getBoundingClientRect().top) : "n/a",
        heroTop: hero ? Math.round(hero.getBoundingClientRect().top) : "n/a",
        scrolled: scrolledEls.join(",") || "none",
      });
    };

    tick();
    const id = window.setInterval(tick, 200);
    window.addEventListener("scroll", tick, { passive: true, capture: true });
    window.visualViewport?.addEventListener("resize", tick);
    window.visualViewport?.addEventListener("scroll", tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("scroll", tick, true);
      window.visualViewport?.removeEventListener("resize", tick);
      window.visualViewport?.removeEventListener("scroll", tick);
    };
  }, []);

  if (!enabled || !mounted || !info) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[2147483647] bg-black/85 px-2 py-1 font-mono text-[10px] leading-snug text-lime-300"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: "max(0.25rem, env(safe-area-inset-top))",
      }}
    >
      y={info.y} vvTop={info.vvTop} vvH={info.vvH} innerH={info.innerH}
      <br />
      hdrTop={info.hdrTop} heroTop={info.heroTop}
      <br />
      scrolled=[{info.scrolled}]
    </div>,
    document.body,
  );
}
