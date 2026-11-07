const PLACES_API_FIELDS = "rating,userRatingCount";

export type GooglePlaceSummary = {
  rating: number | null;
  reviewCount: number | null;
};

export async function getGooglePlaceSummary(): Promise<GooglePlaceSummary> {
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
