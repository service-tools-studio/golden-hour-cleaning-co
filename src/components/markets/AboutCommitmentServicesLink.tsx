"use client";

import Link from "next/link";
import { useMarketPaths } from "@/helpers/useMarketPaths";

const linkClass =
  "font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700";

export default function AboutCommitmentServicesLink() {
  const { servicesHubPath } = useMarketPaths();

  return (
    <Link href={servicesHubPath} className={linkClass}>
      residential cleaning services
    </Link>
  );
}