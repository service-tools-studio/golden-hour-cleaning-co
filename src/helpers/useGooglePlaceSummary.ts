"use client";

import { useEffect, useState } from "react";

/** Same field mask as GoogleReviews so this request is accepted by Places API (New). */
const PLACES_API_FIELDS = "id,displayName,rating,userRatingCount,reviews";

function toCount(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function useGooglePlaceSummary(initial?: {
  rating?: number | null;
  reviewCount?: number | null;
}) {
  const [rating, setRating] = useState<number | null>(initial?.rating ?? null);
  const [reviewCount, setReviewCount] = useState<number | null>(
    initial?.reviewCount ?? null
  );

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || "";
    if (!apiKey || !placeId) return;

    const id = placeId.startsWith("places/") ? placeId.slice(7) : placeId;
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?fields=${encodeURIComponent(PLACES_API_FIELDS)}`;

    let cancelled = false;

    fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACES_API_FIELDS,
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
  }, []);

  return { rating, reviewCount };
}
