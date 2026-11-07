import type { MarketConfig } from "@/lib/markets";

export type PpcDeepCleanCopy = {
  heroTitle: string;
  quoteHomeLabel: string;
  pricingFaqQuestion: string;
  typicalHomePhrase: string;
  deepChecklistHref: string;
};

export type PpcMoveOutCopy = {
  heroTitle: string;
  quoteHomeLabel: string;
  pricingFaqQuestion: string;
  moveOutChecklistHref: string;
};

export function ppcDeepCleanCopy(market: MarketConfig): PpcDeepCleanCopy {
  if (market.id === "phoenix") {
    return {
      heroTitle: "Home Deep Cleaning Services in Phoenix & Scottsdale",
      quoteHomeLabel: "Phoenix-area",
      pricingFaqQuestion: "How much does deep cleaning cost in Phoenix?",
      typicalHomePhrase: "typical Phoenix-metro home",
      deepChecklistHref: "/phoenix/services/deep#whats-included",
    };
  }

  return {
    heroTitle: "Home Deep Cleaning Services in Portland",
    quoteHomeLabel: "Portland",
    pricingFaqQuestion: "How much does deep cleaning cost in Portland?",
    typicalHomePhrase: "typical Portland home",
    deepChecklistHref: "/deep-clean/whats-included",
  };
}

export function ppcMoveOutCopy(market: MarketConfig): PpcMoveOutCopy {
  if (market.id === "phoenix") {
    return {
      heroTitle: "Move-Out Cleaning Services in Phoenix & Scottsdale",
      quoteHomeLabel: "Phoenix-area",
      pricingFaqQuestion: "How much does move-out cleaning cost in Phoenix?",
      moveOutChecklistHref: "/phoenix/services/move-out#whats-included",
    };
  }

  return {
    heroTitle: "Move-Out Cleaning Services in Portland",
    quoteHomeLabel: "Portland",
    pricingFaqQuestion: "How much does move-out cleaning cost in Portland?",
    moveOutChecklistHref: "/move-out-clean/whats-included",
  };
}

export const PPC_DEEP_CLEAN_PATHS = new Set([
  "/portland-deep-cleaning",
  "/phoenix-deep-cleaning",
]);

export const PPC_MOVE_OUT_PATHS = new Set([
  "/portland-move-out-cleaning",
  "/phoenix-move-out-cleaning",
]);
