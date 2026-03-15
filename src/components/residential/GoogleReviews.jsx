'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Link to your Google Business Profile (e.g. from Share on Google Maps)
const GOOGLE_MAPS_REVIEWS_URL = 'https://maps.app.goo.gl/E1sYk7tLv655F6om7';

// Set in .env.local: NEXT_PUBLIC_GOOGLE_PLACE_ID
// To get it: open your place on Google Maps → Share → copy link; Place ID is in the URL (ChIJ...)
// Or use: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
// Requires "Places API (New)" enabled in Google Cloud for per-review links.

const PLACES_API_FIELDS = 'id,displayName,rating,userRatingCount,reviews';

function normalizeReview(r) {
  const textObj = r.text;
  const author = r.authorAttribution;
  return {
    author_name: author?.displayName ?? '',
    text: typeof textObj === 'string' ? textObj : textObj?.text ?? '',
    rating: r.rating ?? null,
    relative_time_description: r.relativePublishTimeDescription ?? null,
    profile_photo_url: author?.photoUri ?? null,
    reviewUrl: r.googleMapsUri || null,
  };
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [rating, setRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImageIndices, setFailedImageIndices] = useState(() => new Set());
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);

  const CARD_GAP = 24;

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el || reviews.length === 0) return;
    const cardWidth = el.querySelector('a')?.offsetWidth ?? el.clientWidth;
    const step = cardWidth + CARD_GAP;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    if (direction === 'prev') {
      if (el.scrollLeft <= 10) {
        el.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -step, behavior: 'smooth' });
      }
    } else {
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (reviews.length <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    autoScrollRef.current = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardWidth = el.querySelector('a')?.offsetWidth ?? el.clientWidth;
        el.scrollBy({ left: cardWidth + CARD_GAP, behavior: 'smooth' });
      }
    }, 4000);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [reviews.length]);

  const markImageFailed = (i) => {
    setFailedImageIndices((prev) => new Set(prev).add(i));
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';

  useEffect(() => {
    if (!apiKey || !placeId) {
      setLoading(false);
      if (!placeId) setError('Place ID not set');
      return;
    }
    const id = placeId.startsWith('places/') ? placeId.slice(7) : placeId;
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?fields=${encodeURIComponent(PLACES_API_FIELDS)}`;
    fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': PLACES_API_FIELDS,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Could not load reviews');
        return res.json();
      })
      .then((place) => {
        const name = place.displayName;
        setPlaceName(typeof name === 'string' ? name : name?.text ?? '');
        setRating(place.rating ?? null);
        setTotalRatings(place.userRatingCount ?? null);
        setReviews((place.reviews || []).map(normalizeReview));
      })
      .catch(() => setError('Could not load reviews'))
      .finally(() => setLoading(false));
  }, [apiKey, placeId]);

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

        <div className="mt-8 relative mx-auto w-full max-w-xl [container-type:inline-size]">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto overflow-y-hidden py-2 pb-4 scroll-smooth"
            style={{
              gap: CARD_GAP,
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
            aria-label="Reviews carousel"
          >
            {reviews.map((review, i) => (
              <a
                key={i}
                href={review.reviewUrl || GOOGLE_MAPS_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-[100cqw] min-w-[100cqw] shrink-0 cursor-pointer flex-col rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                aria-label={`Read review by ${review.author_name} on Google`}
              >
                <div className="flex items-center gap-3">
                  {review.profile_photo_url && !failedImageIndices.has(i) ? (
                    <img
                      src={review.profile_photo_url}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed(i)}
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-stone-600">
                      {(review.author_name || '?')[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-stone-800">{review.author_name}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 shrink-0 ${
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
              </a>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => scroll('prev')}
              aria-label="Previous reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('next')}
              aria-label="Next reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
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
