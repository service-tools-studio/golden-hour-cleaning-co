"use client";

import {
  createContext,
  Suspense,
  useContext,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

const MarketQueryParamContext = createContext<string | null>(null);

function MarketQueryParamInner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  return (
    <MarketQueryParamContext.Provider value={searchParams.get("market")}>
      {children}
    </MarketQueryParamContext.Provider>
  );
}

/** Single Suspense boundary for `?market=` — avoids per-page `useSearchParams` bailouts. */
export function MarketQueryParamProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <MarketQueryParamContext.Provider value={null}>
          {children}
        </MarketQueryParamContext.Provider>
      }
    >
      <MarketQueryParamInner>{children}</MarketQueryParamInner>
    </Suspense>
  );
}

export function useMarketQueryParamFromContext(): string | null {
  return useContext(MarketQueryParamContext);
}