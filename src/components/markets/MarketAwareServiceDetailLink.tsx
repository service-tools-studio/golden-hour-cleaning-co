"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ServiceSlug } from "@/data/residentialServices";
import { residentialServicePathFromHub } from "@/lib/serviceDetailRoutes";
import { useMarketPaths } from "@/helpers/useMarketPaths";

type Props = {
  serviceSlug: ServiceSlug;
  children: ReactNode;
  className?: string;
  pageMarketId?: import("@/lib/markets").MarketId;
};

export default function MarketAwareServiceDetailLink({
  serviceSlug,
  children,
  className,
  pageMarketId,
}: Props) {
  const { servicesHubPath } = useMarketPaths(pageMarketId);
  const href = residentialServicePathFromHub(servicesHubPath, serviceSlug);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}