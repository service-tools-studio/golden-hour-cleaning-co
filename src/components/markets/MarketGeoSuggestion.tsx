"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { MARKETS } from "@/lib/markets";
import {
  MARKET_PREFERENCE_STORAGE_KEY,
  readGeoSuggestionDismissed,
  readPreferredMarketFromStorage,
  writeGeoSuggestionDismissed,
} from "@/lib/marketPreference";

type Props = {
  /** Server hint: visitor region (e.g. AZ) from middleware / Vercel geo */
  visitorRegion?: string | null;
};

function subscribeToMarketPreference(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === MARKET_PREFERENCE_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

/**
 * Optional, dismissible banner on `/` when the visitor appears to be in Arizona.
 * Never redirects. Respects dismissal and stored market preference.
 */
export default function MarketGeoSuggestion({ visitorRegion }: Props) {
  const preferPortland = useSyncExternalStore(
    subscribeToMarketPreference,
    () => readPreferredMarketFromStorage() === "portland",
    () => false,
  );

  const [dismissed, setDismissed] = useState(() =>
    typeof window === "undefined" ? false : readGeoSuggestionDismissed(),
  );

  const onDismiss = useCallback(() => {
    writeGeoSuggestionDismissed();
    setDismissed(true);
  }, []);

  if (visitorRegion !== "AZ" || dismissed || preferPortland) {
    return null;
  }

  return (
    <div
      className="border-b border-amber-200 bg-amber-100/90 px-4 py-2.5 text-center text-sm text-stone-800"
      role="region"
      aria-label="Location suggestion"
    >
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
        <p className="sm:pr-8">
          Visiting from Arizona? You can browse our{" "}
          <Link
            href={MARKETS.phoenix.path}
            className="font-semibold text-amber-900 underline underline-offset-2 hover:text-stone-900"
          >
            {MARKETS.phoenix.displayLabel}
          </Link>{" "}
          page.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-0 top-0 inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-600 hover:bg-amber-200/80 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:static sm:h-auto sm:w-auto sm:rounded-md sm:px-2 sm:py-1"
          aria-label="Dismiss location suggestion"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
