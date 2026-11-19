"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SEE_PRICING_BOOK_LABEL } from "@/helpers/ctaLabels.js";
import type { MarketId } from "@/lib/markets";
import { useMarketPaths } from "@/helpers/useMarketPaths";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/helpers/typography.js";

type Props = {
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  className?: string;
  primaryExtra?: ReactNode;
  /** Override active market (e.g. inline location picker on this page). */
  pageMarketId?: MarketId;
};

/** See pricing (market services hub) + book-online — respects market preference. */
export default function ServicesAndBookCTAs({
  primaryLabel = SEE_PRICING_BOOK_LABEL,
  secondaryLabel = "Reserve Your Cleaning",
  primaryClassName = BTN_PRIMARY,
  secondaryClassName = BTN_SECONDARY,
  className = "mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
  primaryExtra,
  pageMarketId,
}: Props) {
  const { servicesHubPath, bookOnlineHref } = useMarketPaths(pageMarketId);

  return (
    <div className={className}>
      <Link href={servicesHubPath} className={primaryClassName}>
        {primaryLabel}
        {primaryExtra}
      </Link>
      <Link href={bookOnlineHref} className={secondaryClassName}>
        {secondaryLabel}
      </Link>
    </div>
  );
}