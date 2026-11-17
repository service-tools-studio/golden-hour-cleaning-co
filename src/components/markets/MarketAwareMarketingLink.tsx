"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useActiveMarket } from "@/helpers/useActiveMarket";
import { resolveMarketingHrefForMarket } from "@/lib/marketNavigation";
import type { MarketId } from "@/lib/markets";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  pageMarketId?: MarketId;
};

/** Internal link whose destination honors `?market=` and stored preference. */
export default function MarketAwareMarketingLink({
  href,
  children,
  className,
  pageMarketId,
}: Props) {
  const marketId = useActiveMarket(pageMarketId).id;
  const resolvedHref = resolveMarketingHrefForMarket(href, marketId);

  return (
    <Link href={resolvedHref} className={className}>
      {children}
    </Link>
  );
}