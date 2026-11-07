import type { Metadata } from "next";
import ServicesHubClient from "@/components/residential/ServicesHubClient";
import { MARKETS } from "@/lib/markets";

const VALID_LEVELS = new Set(["standard", "deep", "move_out"] as const);
type Level = "standard" | "deep" | "move_out";

function coerceLevel(value: unknown): Level {
  if (typeof value === "string" && VALID_LEVELS.has(value as Level)) {
    return value as Level;
  }
  return "deep";
}

const hub = MARKETS.portland.servicesHub;

export const metadata: Metadata = {
  title: hub.seoTitle,
  description: hub.seoDescription,
  alternates: { canonical: MARKETS.portland.servicesHubPath },
};

export default async function ResidentialServicesPage({
  searchParams,
}: {
  // Next can provide this as a Promise in some builds
  searchParams: Promise<{ level?: string }> | { level?: string };
}) {
  const sp = "then" in searchParams ? await searchParams : searchParams;
  const initialLevel = coerceLevel(sp?.level);

  return (
    <ServicesHubClient market={MARKETS.portland} initialLevel={initialLevel} />
  );
}
