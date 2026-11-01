"use client";

import { useEffect, useState } from "react";

/** Lean mask for badges — avoid `reviews` (Enterprise+ SKU). See GoogleReviews for review bodies. */
const PLACES_SUMMARY_FIELDS = "rating,userRatingCount";

function toCount(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function hasProvidedSummary(initial?: {
  rating?: number | null;
  reviewCount?: number | null;
}) {
  return initial?.rating != null && initial?.reviewCount != null;
}

export function useGooglePlaceSummary(initial?: {
  rating?: number | null;
  reviewCount?: number | null;
}) {
  const [rating, setRating] = useState<number | null>(initial?.rating ?? null);
  const [reviewCount, setReviewCount] = useState<number | null>(
    initial?.reviewCount ?? null,
  );

  useEffect(() => {
    if (hasProvidedSummary(initial)) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || "";
    if (!apiKey || !placeId) return;

    const id = placeId.startsWith("places/") ? placeId.slice(7) : placeId;
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?fields=${encodeURIComponent(PLACES_SUMMARY_FIELDS)}`;

    let cancelled = false;

    fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACES_SUMMARY_FIELDS,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load place summary");
        return res.json();
      })
      .then((place) => {
        if (cancelled) return;
        const nextRating = toCount(place.rating);
        const nextCount = toCount(place.userRatingCount);
        if (nextRating != null) setRating(nextRating);
        if (nextCount != null) setReviewCount(nextCount);
      })
      .catch(() => {
        // Keep the static fallback label if Places is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [initial?.rating, initial?.reviewCount]);

  return { rating, reviewCount };
}
