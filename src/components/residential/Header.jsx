"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CONTACT } from "../../constants.js";
import HeaderNav from "./HeaderNav.jsx";

export default function Header() {
  const router = useRouter();

  const [compact, setCompact] = useState(false);
  const compactRef = useRef(compact);
  compactRef.current = compact;

  // --- Size & timing ---
  const EXPANDED_H = 154;
  const COMPACT_H = 100;
  const BANNER_H = 36;
  const TRANS_MS = 420;
  const HYSTERESIS = 40;
  const TOP_EXPAND_Y = 2;

  const TRIGGER_RATIO = 0.1;
  const TRIGGER_NUDGE_PX = -24;

  const COLLAPSE_AT_ID = "quote";
  const COLLAPSE_OFFSET = 80;        // how early to collapse

  const shouldForceCompact = () => {
    const el = document.getElementById(COLLAPSE_AT_ID)
    if (!el) return false
    const top = el.getBoundingClientRect().top
    return top <= COLLAPSE_OFFSET
  }


  const headerRef = useRef(null);
  const triggerYRef = useRef(0);
  const tickingRef = useRef(false);
  const lockedRef = useRef(false);

  const computeTrigger = () => {
    const hero = document.querySelector("#hero");
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const pageY = window.scrollY + rect.top;
    triggerYRef.current = pageY + rect.height * TRIGGER_RATIO + TRIGGER_NUDGE_PX;
  };

  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--header-height", `${EXPANDED_H}px`);
  }, []);

  useEffect(() => {
    const hero = document.querySelector("#hero");
    computeTrigger();

    const onResize = () => computeTrigger();
    const onLoad = () => computeTrigger();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onLoad);

    let ro;
    if (hero && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => computeTrigger());
      ro.observe(hero);
    }

    const raf = requestAnimationFrame(computeTrigger);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      ro?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const lockFor = (ms) => {
      lockedRef.current = true;
      setTimeout(() => (lockedRef.current = false), ms);
    };

    const onScroll = () => {
      if (tickingRef.current || lockedRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY)

        if (!compactRef.current && shouldForceCompact()) {
          setCompact(true)
          lockFor(TRANS_MS + 80)
          tickingRef.current = false
          return
        }

        // optional: expand back when section is far away again
        if (compactRef.current) {
          const el = document.getElementById(COLLAPSE_AT_ID)
          const top = el?.getBoundingClientRect().top ?? Infinity
          if (top > 220 && y <= 40) {
            setCompact(false)
            lockFor(TRANS_MS + 80)
            tickingRef.current = false
            return
          }
        }

        const triggerY = triggerYRef.current || 0;

        if (!compactRef.current && y >= triggerY + HYSTERESIS) {
          setCompact(true);
          lockFor(TRANS_MS + 80);
        }
        if (compactRef.current && y <= TOP_EXPAND_Y) {
          setCompact(false);
          lockFor(TRANS_MS + 80);
        }
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseHeight = compact ? COMPACT_H : EXPANDED_H;
  const height = baseHeight;
  const innerHeight = Math.max(0, baseHeight - BANNER_H);
  const logoHeight = Math.min(innerHeight * 0.8, 200);
  const logoScale = compact ? 0.98 : 1;

  useEffect(() => {
    document.documentElement.style.setProperty("--header-height", `${height}px`);
  }, [height]);

  const bannerItems = [
    "Serving: Portland • Beaverton • Tigard • Lake Oswego • West Linn • Milwaukie • Tualatin • Happy Valley • Clackamas • Hillsboro • Oregon City",
    "We use eco-friendly products",
    "Licensed & insured",
    "Flexible weekly • bi-weekly • monthly",
    "Same-week openings available",
    "Easy online booking",
    "Locally owned & operated",
    "Women owned & operated",
    "Questions? Call or Text us: (503) 893-4795",
  ];
  const phoneAnnouncement = "Questions? Call or Text us: (503) 893-4795";

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  return (
    <header
      ref={headerRef}
      style={{
        backgroundColor: "#a7eff1",
        height,
        transition: `
          height ${TRANS_MS}ms cubic-bezier(0.16,1,0.3,1),
          box-shadow 300ms ease
        `,
        boxShadow: compact ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
        willChange: "height",
        contain: "layout paint",
        position: "sticky",
        top: 0,
        zIndex: 100000,
      }}
      className="backdrop-blur border-b border-amber-200 flex flex-col overflow-hidden"
      aria-label="Site header"
      data-site-header
    >
      {/* --- Announcement bar --- */}
      <div
        className="relative w-full border-b border-amber-200 overflow-hidden"
        style={{
          height: BANNER_H,
          background: "linear-gradient(to right, #fde68a, #a7eff1)",
          maskImage:
            "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
        }}
        role="region"
        aria-label="Service announcements"
      >
        <div
          style={{
            display: "inline-flex",
            minWidth: "max-content",
            height: "100%",
            alignItems: "center",
            animation: "ghc-marquee 30s linear infinite",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {[...bannerItems, ...bannerItems].map((text, i) => (
            <span
              key={i}
              className="px-6 text-sm font-medium text-slate-800"
              style={{ lineHeight: `${BANNER_H}px` }}
            >
              {text === phoneAnnouncement ? (
                <>
                  Questions?{" "}
                  <a href={`tel:${CONTACT.phone}`} data-call-source="header_banner_call" className="underline underline-offset-2">
                    Call
                  </a>{" "}
                  or{" "}
                  <a href={`sms:${CONTACT.sms}`} className="underline underline-offset-2">
                    Text
                  </a>{" "}
                  us:{" "}
                  <a href={`tel:${CONTACT.phone}`} data-call-source="header_banner_phone" className="underline underline-offset-2">
                    (503) 893-4795
                  </a>
                </>
              ) : (
                text
              )}
            </span>
          ))}
        </div>

        <style>{`
          @keyframes ghc-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            [aria-label="Service announcements"] > div {
              animation: none !important;
              transform: translateX(0) !important;
            }
          }
        `}</style>
      </div>

      {/* --- Logo + nav --- */}
      <div
        className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 lg:px-6"
        style={{ height: innerHeight }}
      >
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="Go to top (or home)"
          className="cursor-pointer shrink-0"
          style={{ background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
        >
          <Image
            src="/assets/Golden Hour - commercial.png"
            alt="Golden Hour Cleaning Co."
            width={200}
            height={100}
            priority
            sizes="(max-width: 640px) 260px, 360px"
            style={{
              height: `${logoHeight}px`,
              width: "auto",
              transform: `scale(${logoScale})`,
              transformOrigin: "left center",
              transition: `transform ${TRANS_MS}ms cubic-bezier(0.16,1,0.3,1)`,
              objectFit: "contain",
              display: "block",
              willChange: "transform",
            }}
            className="w-auto object-contain"
          />
        </button>
        <HeaderNav />
      </div>
    </header>
  );
}
