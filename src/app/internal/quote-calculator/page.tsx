import type { Metadata } from "next";
import InternalQuoteCalculatorClient from "./InternalQuoteCalculatorClient";

export const metadata: Metadata = {
  title: "Preserved quote calculator | Golden Hour Cleaning Co.",
  robots: {
    index: false,
    follow: false,
  },
};

const VALID_LEVELS = new Set(["standard", "deep", "move_out"] as const);
type Level = "standard" | "deep" | "move_out";

function coerceLevel(value: unknown): Level {
  if (typeof value === "string" && VALID_LEVELS.has(value as Level)) {
    return value as Level;
  }
  return "deep";
}

export default async function InternalQuoteCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }> | { level?: string };
}) {
  const sp = "then" in searchParams ? await searchParams : searchParams;
  const initialLevel = coerceLevel(sp?.level);

  return <InternalQuoteCalculatorClient initialLevel={initialLevel} />;
}
