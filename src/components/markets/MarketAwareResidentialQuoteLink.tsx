"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMarketPaths } from "@/helpers/useMarketPaths";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function MarketAwareResidentialQuoteLink({
  children,
  className,
}: Props) {
  const { pricingEntryHref } = useMarketPaths();

  return (
    <Link href={pricingEntryHref} className={className}>
      {children}
    </Link>
  );
}