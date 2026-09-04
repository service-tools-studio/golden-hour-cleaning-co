"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "../../constants.js";
import HeaderNav from "./HeaderNav.jsx";

const BANNER_H = 36;

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

export default function Header() {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${el.offsetHeight}px`,
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100000] w-full border-b border-amber-200 bg-brand"
      aria-label="Site header"
      data-site-header
    >
      {/* Announcement marquee */}
      <div
        className="relative w-full overflow-hidden border-b border-amber-200"
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
          className="inline-flex h-full min-w-max items-center"
          style={{ animation: "ghc-marquee 30s linear infinite" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = "running";
          }}
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
                  <a
                    href={`tel:${CONTACT.phone}`}
                    data-call-source="header_banner_call"
                    className="underline underline-offset-2"
                  >
                    Call
                  </a>{" "}
                  or{" "}
                  <a
                    href={`sms:${CONTACT.sms}`}
                    className="underline underline-offset-2"
                  >
                    Text
                  </a>{" "}
                  us:{" "}
                  <a
                    href={`tel:${CONTACT.phone}`}
                    data-call-source="header_banner_phone"
                    className="underline underline-offset-2"
                  >
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

      {/* Logo + nav — same static sizing as ServicesPageHeader */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/" aria-label="Go to homepage" className="inline-block shrink-0">
          <Image
            src="/assets/Golden Hour - commercial.png"
            alt="Golden Hour Cleaning Co."
            width={200}
            height={100}
            priority
            className="h-14 w-auto max-w-none object-contain sm:h-16 md:h-20"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 240px"
          />
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
