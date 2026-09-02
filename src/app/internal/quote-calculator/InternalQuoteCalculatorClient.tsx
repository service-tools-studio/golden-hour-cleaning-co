"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PreservedQuoteCalculator from "@/components/internal/PreservedQuoteCalculator";
import InternalBreadcrumbs from "@/components/internal/InternalBreadcrumbs";
import { scrollToId } from "@/helpers/scrollToId";
import { HEADING_UPPER } from "@/helpers/typography.js";

const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);
type Level = "standard" | "deep" | "move_out";

function levelFromUrl(value: string | null): Level | null {
  if (value && VALID_LEVELS.has(value as Level)) return value as Level;
  return null;
}

export default function InternalQuoteCalculatorClient({
  initialLevel,
}: {
  initialLevel: Level;
}) {
  const searchParams = useSearchParams();
  const urlLevel = levelFromUrl(searchParams.get("level"));
  const level = urlLevel ?? initialLevel;

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash === "#quote") {
      scrollToId("#quote", 8, { focus: true });
    }
  }, [level]);

  return (
    <main className="min-h-screen bg-amber-50 text-stone-900">
      <div className="border-b border-amber-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <InternalBreadcrumbs currentPage="Quote calculator" />
          <h1 className={`mt-3 text-2xl md:text-3xl ${HEADING_UPPER}`}>
            Quote calculator
          </h1>
        </div>
      </div>

      <section
        id="quote"
        className="mx-auto max-w-7xl px-6 pt-6 pb-10 md:pt-8 md:pb-12"
      >
        <PreservedQuoteCalculator
          initialLevel={urlLevel ?? undefined}
          hideHeader
        />
      </section>
    </main>
  );
}
