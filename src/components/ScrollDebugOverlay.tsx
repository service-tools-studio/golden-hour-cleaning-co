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
  /** Document Y for absolute positioning (works even when `fixed` is broken). */
  absTop: number;
  absMid: number;
};

/**
 * Open with ?debugScroll=1
 * Uses position:absolute + scrollY so it stays visible even if Chrome has
 * broken position:fixed (which is likely given the homepage scroll bug).
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
        .map(
          (el) =>
            `${el.id || el.className?.toString?.().slice(0, 20) || el.tagName}:${Math.round(el.scrollTop)}`,
        )
        .slice(0, 6);

      // Prefer the largest nested scrollTop if window.scrollY is 0.
      let nestedY = 0;
      document.querySelectorAll("div, main, section").forEach((el) => {
        if (el instanceof HTMLElement && el.scrollTop > nestedY) nestedY = el.scrollTop;
      });

      const y = Math.max(window.scrollY || 0, nestedY);
      const vvTop = vv ? vv.offsetTop : 0;
      const vvH = vv ? vv.height : window.innerHeight;

      setInfo({
        y: (window.scrollY || 0) | 0,
        vvTop: vv ? vv.offsetTop | 0 : -1,
        vvH: vv ? vv.height | 0 : -1,
        innerH: window.innerHeight | 0,
        hdrTop: header ? Math.round(header.getBoundingClientRect().top) : "n/a",
        heroTop: hero ? Math.round(hero.getBoundingClientRect().top) : "n/a",
        scrolled: scrolledEls.join(",") || "none",
        absTop: Math.round(y + vvTop + 12),
        absMid: Math.round(y + vvTop + vvH / 2 - 40),
      });
    };

    tick();
    const id = window.setInterval(tick, 200);
    window.addEventListener("scroll", tick, { passive: true, capture: true });
    document.addEventListener("scroll", tick, { passive: true, capture: true });
    window.visualViewport?.addEventListener("resize", tick);
    window.visualViewport?.addEventListener("scroll", tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("scroll", tick, true);
      document.removeEventListener("scroll", tick, true);
      window.visualViewport?.removeEventListener("resize", tick);
      window.visualViewport?.removeEventListener("scroll", tick);
    };
  }, []);

  if (!enabled || !mounted || !info) return null;

  return createPortal(
    <>
      <div
        className="pointer-events-none absolute inset-x-2 z-[2147483647] rounded-md bg-black px-2 py-1.5 font-mono text-[11px] leading-snug text-lime-300 shadow-lg"
        style={{ top: info.absTop, left: 8, right: 8 }}
      >
        y={info.y} vvTop={info.vvTop} vvH={info.vvH} innerH={info.innerH}
        <br />
        hdrTop={info.hdrTop} heroTop={info.heroTop}
        <br />
        scrolled=[{info.scrolled}]
      </div>
      <div
        className="pointer-events-none absolute inset-x-2 z-[2147483647] rounded-md border-2 border-lime-300 bg-black px-2 py-1.5 font-mono text-[11px] leading-snug text-lime-300 shadow-lg"
        style={{ top: info.absMid, left: 8, right: 8 }}
      >
        DEBUG — middle of view
        <br />
        y={info.y} vvTop={info.vvTop} scrolled=[{info.scrolled}]
      </div>
    </>,
    document.body,
  );
}
