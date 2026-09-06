"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import HeaderNav from "./HeaderNav";

type ServicesPageHeaderProps = {
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  /** Hide main nav / hamburger (e.g. PPC landing pages). Default true. */
  showNav?: boolean;
  /** Logo click scrolls to top instead of navigating home. */
  logoScrollsToTop?: boolean;
  /** @deprecated Ignored — kept for call-site compatibility. */
  quoteHref?: string;
  /** @deprecated Ignored — kept for call-site compatibility. */
  showCtas?: boolean;
};

export default function ServicesPageHeader({
  backLabel,
  backHref,
  onBack,
  showNav = true,
  logoScrollsToTop = false,
}: ServicesPageHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const backClassName =
    "uppercase tracking-wide mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 underline-offset-4 hover:underline";
  const showBack = Boolean(backHref || onBack);

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
  }, [showBack, showNav]);

  const logo = (
    <Image
      src="/assets/Golden Hour - commercial.png"
      alt="Golden Hour Cleaning Co."
      width={200}
      height={100}
      priority
      className="h-12 w-auto max-w-none object-contain sm:h-14 md:h-16"
      sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, 200px"
    />
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100000] w-full border-b border-amber-200 bg-brand"
      data-site-header
    >
      <div
        className={`mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-3.5 ${
          showNav ? "justify-between" : "justify-start"
        }`}
      >
        <div className="shrink-0">
          {logoScrollsToTop ? (
            <button
              type="button"
              aria-label="Back to top"
              className="inline-block shrink-0"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {logo}
            </button>
          ) : (
            <Link
              href="/"
              aria-label="Go to homepage"
              className="inline-block shrink-0"
            >
              {logo}
            </Link>
          )}
          {showBack && backHref ? (
            <Link href={backHref} className={backClassName}>
              <span aria-hidden>←</span>
              {backLabel}
            </Link>
          ) : showBack ? (
            <button type="button" onClick={onBack} className={backClassName}>
              <span aria-hidden>←</span>
              {backLabel}
            </button>
          ) : null}
        </div>
        {showNav ? <HeaderNav /> : null}
      </div>
    </header>
  );
}
