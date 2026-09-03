"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import HeaderNav from "./HeaderNav";

type ServicesPageHeaderProps = {
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  /** @deprecated Ignored — kept for call-site compatibility. */
  quoteHref?: string;
  /** @deprecated Ignored — kept for call-site compatibility. */
  showCtas?: boolean;
};

export default function ServicesPageHeader({
  backLabel,
  backHref,
  onBack,
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
  }, [showBack]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100000] w-full border-b border-amber-200 bg-brand"
      data-site-header
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <Link href="/" aria-label="Go to homepage">
            <Image
              src="/assets/Golden Hour - commercial.png"
              alt="Golden Hour Cleaning Co."
              width={200}
              height={100}
              priority
              className="h-16 w-auto sm:h-20"
              sizes="(max-width: 640px) 200px, 240px"
            />
          </Link>
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
        <HeaderNav />
      </div>
    </header>
  );
}
