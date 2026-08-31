"use client";

import { useEffect, useRef, type RefObject } from "react";

type Options = {
  /** Fraction of the element that must be visible (0–1). Default 0.35 */
  threshold?: number;
  /** Fire only the first time it enters view. Default true */
  once?: boolean;
  enabled?: boolean;
};

/**
 * Observe when quote results scroll into view. Returns a ref to attach to the results root.
 */
export function useQuoteResultsInView(
  onInView: () => void,
  { threshold = 0.35, once = true, enabled = true }: Options = {}
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);
  const onInViewRef = useRef(onInView);
  onInViewRef.current = onInView;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    if (once && firedRef.current) return;

    if (typeof IntersectionObserver === "undefined") {
      // Fallback: treat as viewed once mounted
      if (!firedRef.current) {
        firedRef.current = true;
        onInViewRef.current();
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (once && firedRef.current) return;
        firedRef.current = true;
        onInViewRef.current();
        if (once) observer.disconnect();
      },
      { threshold, rootMargin: "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, once, threshold]);

  return ref;
}
