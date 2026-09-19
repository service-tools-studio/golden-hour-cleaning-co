"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT } from "../../constants.js";
import HeaderNav from "./HeaderNav.jsx";

const BANNER_H = 28;

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
  const pathname = usePathname();

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
      className="relative sticky top-0 z-[100000] w-full border-b border-amber-200 bg-brand"
      aria-label="Site header"
      data-site-header
    >
      {/* Mint veil: obscures marquee through transparent logo, fades soft to the right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-40 bg-gradient-to-r from-brand from-[42%] via-brand/70 via-[72%] to-transparent sm:w-44 md:w-52"
      />

      {/* Mint veil (right): mirrors logo treatment behind hamburger; marquee scrolls underneath */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-28 bg-gradient-to-l from-brand from-[42%] via-brand/70 via-[72%] to-transparent sm:w-32 md:w-36 xl:hidden"
      />

      {/* Logo spans marquee + nav; sits above both. Marquee scrolls full-width behind it. */}
      <Link
        href="/"
        aria-label="Go to homepage"
        className="absolute left-3 top-1 bottom-1 z-30 flex items-center sm:left-4 lg:left-6"
        onClick={(e) => {
          if (pathname !== "/" && pathname !== "/residential") return;
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          document
            .getElementById("page-top")
            ?.scrollIntoView({ block: "start", behavior: "smooth" });
        }}
      >
        <Image
          src="/assets/Golden Hour - commercial.png"
          alt="Golden Hour Cleaning Co."
          width={200}
          height={100}
          priority
          className="h-full w-auto max-w-none object-contain object-left"
          sizes="(max-width: 640px) 140px, 180px"
        />
      </Link>

      {/* Announcement marquee — full width, behind logo */}
      <div
        className="relative z-10 w-full overflow-hidden border-b border-amber-200"
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

      {/* Nav row — left padding clears logo; right padding clears overlay hamburger (xl keeps normal inset) */}
      <div className="flex w-full items-center justify-end gap-3 py-1 pl-32 pr-14 sm:py-1.5 sm:pl-36 sm:pr-16 lg:pl-40 lg:pr-16 xl:pr-8">
        <HeaderNav hamburgerOverlay />
      </div>
    </header>
  );
}
