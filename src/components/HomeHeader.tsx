"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function SimpleHeader() {
  const HEADER_H = 180;
  const BANNER_H = 36;
  const innerHeight = HEADER_H - BANNER_H;

  const pathname = usePathname();
  const router = useRouter();

  const bannerItems = [
    "Serving: Portland • Beaverton • Tigard • Lake Oswego • West Linn • Milwaukie • Tualatin",
    "Eco-friendly, non-toxic products",
    "Licensed & insured",
    "Flexible weekly • bi-weekly • monthly",
    "Same-week openings available",
    "Locally owned & operated",
    "Call or text: (503) 893-4795",
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <header
      className="border-b border-amber-200 flex flex-col overflow-hidden"
      style={{
        height: HEADER_H,
        backgroundColor: "#a7eff1",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
      aria-label="Site header"
    >
      {/* Announcement bar */}
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
            animation: "ghc-marquee 20s linear infinite",
          }}
        >
          {[...bannerItems, ...bannerItems].map((text, i) => (
            <span
              key={i}
              className="px-6 text-sm font-medium text-slate-800"
              style={{ lineHeight: `${BANNER_H}px` }}
            >
              {text}
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

      {/* Logo */}
      <div
        className="flex w-full items-center justify-center"
        style={{ height: innerHeight }}
      >
        <Link
          href="/"
          onClick={handleLogoClick}
          aria-label="Go to homepage"
          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
        >
          <img
            src="/assets/Golden%20Hour%20-%20rectangle.svg"
            alt="Golden Hour Cleaning Co."
            className="h-[120px] w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
}
