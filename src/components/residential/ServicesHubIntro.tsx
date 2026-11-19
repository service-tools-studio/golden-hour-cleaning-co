"use client";

import MarketLocationSelector from "@/components/markets/MarketLocationSelector";
import type { MarketConfig } from "@/lib/markets";
import { HEADING_UPPER, SECTION_EYEBROW } from "@/helpers/typography.js";

export default function ServicesHubIntro({ market }: { market: MarketConfig }) {
  const { title, intro } = market.servicesHub;

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div
        className={`${SECTION_EYEBROW} mb-3 flex items-center justify-center gap-1 text-center`}
      >
        <span aria-hidden>📍</span>
        <MarketLocationSelector market={market} linkTarget="servicesHub" />
      </div>
      <h1 className={`mt-0 text-3xl ${HEADING_UPPER}`}>{title}</h1>
      <p className="mt-3 text-stone-700">{intro}</p>
    </div>
  );
}