"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { MarketId } from "@/lib/markets";
import { useActiveMarket } from "@/helpers/useActiveMarket";
import { writePreferredMarketToStorage } from "@/lib/marketPreference";
import InlineMarketLocationPicker from "@/components/markets/InlineMarketLocationPicker";
import ServicesAndBookCTAs from "@/components/markets/ServicesAndBookCTAs";

type Props = {
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  className?: string;
  primaryExtra?: ReactNode;
  pickerClassName?: string;
};

export default function ServicesAndBookCTAsWithPicker({
  pickerClassName = "mt-8",
  ...ctaProps
}: Props) {
  const activeMarket = useActiveMarket();
  const [marketId, setMarketId] = useState<MarketId>(activeMarket.id);

  useEffect(() => {
    setMarketId(activeMarket.id);
  }, [activeMarket.id]);

  function handleMarketChange(id: MarketId) {
    writePreferredMarketToStorage(id);
    setMarketId(id);
  }

  return (
    <>
      <InlineMarketLocationPicker
        value={marketId}
        onChange={handleMarketChange}
        className={pickerClassName}
      />
      <ServicesAndBookCTAs {...ctaProps} pageMarketId={marketId} />
    </>
  );
}