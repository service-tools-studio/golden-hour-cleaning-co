'use client';

import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from './GoogleMapsProvider.jsx';
import { Star } from 'lucide-react';

// Link to your Google Business Profile (e.g. from Share on Google Maps)
const GOOGLE_MAPS_REVIEWS_URL = 'https://maps.app.goo.gl/kLUYbAoqrLbEyzKf9';

// Set in .env.local: NEXT_PUBLIC_GOOGLE_PLACE_ID
// To get it: open your place on Google Maps → Share → copy link; Place ID is in the URL (ChIJ...)
// Or use: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder

export default function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [rating, setRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serviceRef = useRef(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (!isLoaded || !apiKey || !placeId) {
      setLoading(false);
      if (!placeId) setError('Place ID not set');
      return;
    }

    const div = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(div);
    serviceRef.current = service;

    const request = {
      placeId,
      fields: ['name', 'rating', 'reviews', 'user_ratings_total'],
    };

    service.getDetails(request, (place, status) => {
      setLoading(false);
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
        setError('Could not load reviews');
        return;
      }
      setPlaceName(place.name || '');
      setRating(place.rating ?? null);
      setTotalRatings(place.user_ratings_total ?? null);
      setReviews(place.reviews || []);
    });
  }, [isLoaded, apiKey, placeId]);

  if (!placeId) {
    return (
      <section className="bg-amber-50/50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-center font-lora text-2xl font-semibold text-stone-800">
            What our clients say
          </h2>
          <p className="mt-2 text-center text-sm text-stone-600">
            Read our reviews on Google
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={GOOGLE_MAPS_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-md hover:bg-amber-300"
            >
              <Star className="h-5 w-5 fill-current" />
              See reviews on Google
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-amber-50/50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-center font-lora text-2xl font-semibold text-stone-800">
            What our clients say
          </h2>
          <div className="mt-8 flex justify-center py-12">
            <p className="text-stone-500">Loading reviews…</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <section className="bg-amber-50/50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-center font-lora text-2xl font-semibold text-stone-800">
            What our clients say
          </h2>
          <p className="mt-2 text-center text-sm text-stone-600">
            {error || 'No reviews to show yet.'}
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={GOOGLE_MAPS_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-md hover:bg-amber-300"
            >
              <Star className="h-5 w-5 fill-current" />
              See reviews on Google
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-amber-50/50" aria-label="Google reviews">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:items-end">
          <div>
            <h2 className="font-lora text-2xl font-semibold text-stone-800">
              What our clients say
            </h2>
            {placeName && (
              <p className="mt-1 text-sm text-stone-600">{placeName}</p>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            {rating != null && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-stone-800">{Number(rating).toFixed(1)}</span>
              </div>
            )}
            {totalRatings != null && (
              <span className="text-sm text-stone-600">
                ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review, i) => (
            <article
              key={i}
              className="flex flex-col rounded-2xl border border-amber-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {review.profile_photo_url ? (
                  <img
                    src={review.profile_photo_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-stone-600">
                    {(review.author_name || '?')[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-stone-800">{review.author_name}</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= (review.rating ?? 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                    {review.relative_time_description && (
                      <span className="ml-1 text-xs text-stone-500">
                        {review.relative_time_description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {review.text && (
                <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-700 line-clamp-5">
                  {review.text}
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={GOOGLE_MAPS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm hover:bg-amber-50"
          >
            View all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
