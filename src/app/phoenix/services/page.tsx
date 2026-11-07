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

const hub = MARKETS.phoenix.servicesHub;

export const metadata: Metadata = {
  title: hub.seoTitle,
  description: hub.seoDescription,
  alternates: { canonical: MARKETS.phoenix.servicesHubPath },
};

export default async function PhoenixServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }> | { level?: string };
}) {
  const sp = "then" in searchParams ? await searchParams : searchParams;
  const initialLevel = coerceLevel(sp?.level);

  return (
    <ServicesHubClient market={MARKETS.phoenix} initialLevel={initialLevel} />
  );
}
