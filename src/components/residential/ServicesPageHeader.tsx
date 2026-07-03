"use client";

import Image from "next/image";
import Link from "next/link";
import HeaderCTAButtons from "./HeaderCTAButtons";

type ServicesPageHeaderProps = {
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  quoteHref?: string;
  showCtas?: boolean;
};

export default function ServicesPageHeader({
  backLabel,
  backHref,
  onBack,
  quoteHref,
  showCtas = true,
}: ServicesPageHeaderProps) {
  const backClassName =
    "uppercase tracking-wide mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 underline-offset-4 hover:underline";
  const showBack = Boolean(backHref || onBack);

  return (
    <>
      <header className="w-full border-b border-amber-200 bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link href="/residential" aria-label="Go to residential home">
              <Image
                src="/assets/Golden Hour - commercial.png"
                alt="Golden Hour Cleaning Co."
                width={200}
                height={100}
                priority
                className="h-20 w-auto sm:h-[88px]"
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
          {showCtas ? (
            <div className="hidden lg:flex shrink-0 items-center gap-2">
              <HeaderCTAButtons quoteHref={quoteHref} />
            </div>
          ) : null}
        </div>
      </header>

      {showCtas ? (
        <div
          className="w-full lg:hidden sticky top-0 z-[100000] border-b border-amber-200 bg-brand/95 px-6 py-3 shadow-sm backdrop-blur-sm"
          aria-label="Quick actions"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
            <HeaderCTAButtons compact quoteHref={quoteHref} />
          </div>
        </div>
      ) : null}
    </>
  );
}
