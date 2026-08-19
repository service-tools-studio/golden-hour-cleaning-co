import type { Metadata } from "next";
import PortlandDeepCleaningClient from "@/components/ppc/PortlandDeepCleaningClient";

export const metadata: Metadata = {
  title: "Deep Cleaning Services in Portland | Golden Hour Cleaning Co.",
  description:
    "Get an instant deep cleaning quote for your Portland home and book live availability online. Licensed, insured, and locally owned.",
};

const PLACES_API_FIELDS = "id,displayName,rating,userRatingCount";

async function getGooglePlaceSummary() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return { rating: null, reviewCount: null };

  const id = placeId.startsWith("places/") ? placeId.slice(7) : placeId;
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?fields=${encodeURIComponent(PLACES_API_FIELDS)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACES_API_FIELDS,
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { rating: null, reviewCount: null };
    const place = await res.json();
    const rating = Number(place.rating);
    const reviewCount = Number(place.userRatingCount);
    return {
      rating: Number.isFinite(rating) ? rating : null,
      reviewCount: Number.isFinite(reviewCount) ? reviewCount : null,
    };
  } catch {
    return { rating: null, reviewCount: null };
  }
}

export default async function PortlandDeepCleaningPage() {
  const { rating, reviewCount } = await getGooglePlaceSummary();

  return (
    <PortlandDeepCleaningClient
      initialRating={rating}
      initialReviewCount={reviewCount}
    />
  );
}
