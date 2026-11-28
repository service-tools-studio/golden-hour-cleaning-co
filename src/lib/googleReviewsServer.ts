import { cache } from "react";
import { GOOGLE_PLACES_REVALIDATE_SECONDS } from "@/lib/googlePlacesRevalidate";

// Places API (New) — `reviews` bills at Enterprise+; only fetch on the server with ISR.
const PLACES_API_FIELDS = "rating,userRatingCount,reviews";

export type CachedGoogleReview = {
  author_name: string;
  text: string;
  rating: number | null;
  relative_time_description: string | null;
  profile_photo_url: string | null;
  reviewUrl: string | null;
};

export type GoogleReviewsCache = {
  reviews: CachedGoogleReview[];
  rating: number | null;
  totalRatings: number | null;
  error: string | null;
};

type PlacesReview = {
  rating?: number | null;
  relativePublishTimeDescription?: string | null;
  googleMapsUri?: string | null;
  text?: string | { text?: string | null } | null;
  authorAttribution?: {
    displayName?: string | null;
    photoUri?: string | null;
  } | null;
};

function normalizeReview(r: PlacesReview): CachedGoogleReview {
  const textObj = r.text;
  const author = r.authorAttribution;
  return {
    author_name: author?.displayName ?? "",
    text: typeof textObj === "string" ? textObj : (textObj?.text ?? ""),
    rating: r.rating ?? null,
    relative_time_description: r.relativePublishTimeDescription ?? null,
    profile_photo_url: author?.photoUri ?? null,
    reviewUrl: r.googleMapsUri || null,
  };
}

function isFiveStarReview(review: CachedGoogleReview) {
  return Number(review.rating) === 5;
}

const emptyCache = (error: string | null = null): GoogleReviewsCache => ({
  reviews: [],
  rating: null,
  totalRatings: null,
  error,
});

export const getGoogleReviews = cache(async (): Promise<GoogleReviewsCache> => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return emptyCache("Could not load reviews");

  const id = placeId.startsWith("places/") ? placeId.slice(7) : placeId;
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACES_API_FIELDS,
      },
      next: { revalidate: GOOGLE_PLACES_REVALIDATE_SECONDS },
    });
    if (!res.ok) return emptyCache("Could not load reviews");

    const place = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      reviews?: PlacesReview[];
    };

    const rating = Number(place.rating);
    const totalRatings = Number(place.userRatingCount);
    const reviews = (place.reviews ?? [])
      .map(normalizeReview)
      .filter(isFiveStarReview);

    return {
      reviews,
      rating: Number.isFinite(rating) ? rating : null,
      totalRatings: Number.isFinite(totalRatings) ? totalRatings : null,
      error: reviews.length === 0 ? "No reviews to show yet." : null,
    };
  } catch {
    return emptyCache("Could not load reviews");
  }
});