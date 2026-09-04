"use client";

import { useEffect, useState } from "react";

/**
 * Open with ?debugScroll=1 to see live scroll metrics on mobile Chrome.
 * If scrollY stays 0 while the page "looks" scrolled, it's the browser UI /
 * visual viewport — not document scroll (which is why scrollTo(0) does nothing).
 */
export default function ScrollDebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [info, setInfo] = useState("…");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("debugScroll") !== "1") return;
    setEnabled(true);

    const tick = () => {
      const vv = window.visualViewport;
      const header = document.querySelector("[data-site-header]");
      const hero = document.getElementById("hero");
      const scrolledEls = [...document.querySelectorAll("div, main, section, body, html")]
        .filter((el) => el instanceof HTMLElement && el.scrollTop > 0)
        .map((el) => `${el.id || el.tagName}:${el.scrollTop}`)
        .slice(0, 5);

      setInfo(
        [
          `y=${window.scrollY|0}`,
          `vvTop=${vv ? vv.offsetTop|0 : "n/a"}`,
          `vvH=${vv ? vv.height|0 : "n/a"}`,
          `innerH=${window.innerHeight|0}`,
          `hdrTop=${header ? Math.round(header.getBoundingClientRect().top) : "n/a"}`,
          `heroTop=${hero ? Math.round(hero.getBoundingClientRect().top) : "n/a"}`,
          `scrolled=[${scrolledEls.join(",") || "none"}]`,
        ].join(" "),
      );
    };

    tick();
    const id = window.setInterval(tick, 200);
    window.addEventListener("scroll", tick, { passive: true });
    window.visualViewport?.addEventListener("resize", tick);
    window.visualViewport?.addEventListener("scroll", tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("scroll", tick);
      window.visualViewport?.removeEventListener("resize", tick);
      window.visualViewport?.removeEventListener("scroll", tick);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200000] bg-black/80 px-2 py-1 font-mono text-[10px] leading-snug text-lime-300"
      style={{ paddingTop: "max(0.25rem, env(safe-area-inset-top))" }}
    >
      {info}
    </div>
  );
}
