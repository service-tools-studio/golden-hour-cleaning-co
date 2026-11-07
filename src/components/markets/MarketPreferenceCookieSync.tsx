"use client";

import { useEffect } from "react";
import {
  MARKET_PREFERENCE_STORAGE_KEY,
  PREFERRED_MARKET_CHANGE_EVENT,
  syncPreferredMarketCookieFromStorage,
} from "@/lib/marketPreference";

/** Keeps `ghc_preferred_market` cookie aligned with localStorage for server redirects. */
export default function MarketPreferenceCookieSync() {
  useEffect(() => {
    syncPreferredMarketCookieFromStorage();
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === MARKET_PREFERENCE_STORAGE_KEY) {
        syncPreferredMarketCookieFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(PREFERRED_MARKET_CHANGE_EVENT, syncPreferredMarketCookieFromStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        PREFERRED_MARKET_CHANGE_EVENT,
        syncPreferredMarketCookieFromStorage,
      );
    };
  }, []);

  return null;
}
