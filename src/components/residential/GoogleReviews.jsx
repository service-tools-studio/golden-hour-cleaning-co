'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { SECTION_HEADING, SECTION_PAD } from '../../helpers/typography.js';
import { MARKETS } from '@/lib/markets';

// Link to your Google Business Profile (e.g. from Share on Google Maps)
export const GOOGLE_MAPS_REVIEWS_URL = 'https://maps.app.goo.gl/E1sYk7tLv655F6om7';

const PAGE_INTRO =
  'Every home and every cleaning is different, but our goal is always the same: thoughtful service and a beautifully cared-for space. See what our clients have shared about their experiences with Golden Hour Cleaning Co.';

const REVIEWS_SIDE_IMAGE = {
  src: '/assets/windows-extended-height-v2.PNG',
  alt: 'A Golden Hour cleaner wiping a sunlit living room window',
};

// Review bodies are loaded via `getGoogleReviews()` on the server (72h ISR) — not in the browser.

function ReviewsSideImage() {
  return (
    <div className="relative aspect-[941/1672] w-full overflow-hidden bg-amber-100">
      <Image
        src={REVIEWS_SIDE_IMAGE.src}
        alt={REVIEWS_SIDE_IMAGE.alt}
        fill
        className="object-contain object-center"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  );
}

/** Page layout: copy left / photo right on desktop; photo below on mobile. */
function ReviewsPageShell({ children, className = 'bg-amber-50/50', padClass = SECTION_PAD }) {
  return (
    <section id="reviews" className={`relative overflow-hidden ${className}`} aria-label="Google reviews">
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start">
        <div className={`relative px-6 ${padClass}`}>{children}</div>
        <ReviewsSideImage />
      </div>
    </section>
  );
}

function ReviewCard({ review, index, failedImageIndices, markImageFailed, fullText = false }) {
  return (
    <a
      href={review.reviewUrl || GOOGLE_MAPS_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full cursor-pointer flex-col rounded-3xl border border-amber-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-300"
      aria-label={`Read review by ${review.author_name} on Google`}
    >
      <div className="flex items-center gap-3">
        {review.profile_photo_url && !failedImageIndices.has(index) ? (
          <img
            src={review.profile_photo_url}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => markImageFailed(index)}
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
        <p
          className={`mt-4 flex-1 text-sm leading-relaxed text-stone-700 ${
            fullText ? '' : 'line-clamp-5'
          }`}
        >
          {review.text}
        </p>
      )}
    </a>
  );
}

function ReviewsFallback({
  titleAs: TitleTag = 'h2',
  message,
  showPageIntro = false,
  sectionTitle = 'What our clients say',
  portfolioAttributionNote,
}) {
  const body = (
    <>
      <TitleTag className={SECTION_HEADING}>{sectionTitle}</TitleTag>
      {showPageIntro ? (
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-stone-700 sm:text-base">
          {PAGE_INTRO}
        </p>
      ) : null}
      {portfolioAttributionNote ? (
        <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-relaxed text-stone-600">
          {portfolioAttributionNote}
        </p>
      ) : null}
      <p
        className={`${showPageIntro ? 'mt-5' : 'mt-3'} text-center text-sm text-stone-600`}
      >
        {message || 'Read our reviews on Google'}
      </p>
      <div className="mt-10 flex justify-center">
        <a
          href={GOOGLE_MAPS_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm uppercase tracking-[0.02em] text-stone-600 underline underline-offset-4 hover:text-stone-900"
        >
          View all reviews on Google →
        </a>
      </div>
    </>
  );

  if (showPageIntro) {
    return <ReviewsPageShell>{body}</ReviewsPageShell>;
  }

  return (
    <section id="reviews" className="bg-amber-50/50">
      <div className={`mx-auto max-w-7xl px-6 ${SECTION_PAD}`}>{body}</div>
    </section>
  );
}

/**
 * @param {{
 *   variant?: "carousel" | "page",
 *   market?: import('@/lib/markets').MarketConfig,
 *   googleReviews: import('@/lib/googleReviewsServer').GoogleReviewsCache,
 * }} props
 */
export default function GoogleReviews({
  variant = 'carousel',
  market = MARKETS.portland,
  googleReviews,
}) {
  const isPage = variant === 'page';
  const TitleTag = isPage ? 'h1' : 'h2';
  const sectionTitle = market.reviews.carouselTitle;
  const showAggregate = market.reviews.showAggregateFromGoogle;
  const portfolioAttributionNote = market.reviews.portfolioAttributionNote;
  const carouselSubtitle = market.reviews.carouselSubtitle;

  const reviews = googleReviews.reviews;
  const rating = googleReviews.rating;
  const totalRatings = googleReviews.totalRatings;
  const error = googleReviews.error;
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
    if (isPage || reviews.length <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    autoScrollRef.current = setInterval(() => {
      scroll('next');
    }, 6000);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [reviews.length, isPage]);

  const markImageFailed = (index) => {
    setFailedImageIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';

  if (!placeId) {
    return (
      <ReviewsFallback
        titleAs={TitleTag}
        showPageIntro={isPage}
        sectionTitle={sectionTitle}
        portfolioAttributionNote={portfolioAttributionNote}
      />
    );
  }

  if (error || reviews.length === 0) {
    return (
      <ReviewsFallback
        titleAs={TitleTag}
        message={error || 'No reviews to show yet.'}
        showPageIntro={isPage}
        sectionTitle={sectionTitle}
        portfolioAttributionNote={portfolioAttributionNote}
      />
    );
  }

  const content = (
    <>
      <div className="text-center">
        <TitleTag className={SECTION_HEADING}>{sectionTitle}</TitleTag>
        {isPage ? (
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-stone-700 sm:text-base">
            {PAGE_INTRO}
          </p>
        ) : carouselSubtitle ? (
          <p className="mt-2 text-sm text-stone-600">{carouselSubtitle}</p>
        ) : null}
        {portfolioAttributionNote ? (
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-stone-600">
            {portfolioAttributionNote}
          </p>
        ) : null}
        {showAggregate && (rating != null || totalRatings != null) ? (
          <div className="mt-5 flex items-center justify-center gap-2">
            {rating != null && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-stone-800">
                  {Number(rating).toFixed(1)}
                </span>
              </div>
            )}
            {totalRatings != null && (
              <span className="text-sm text-stone-600">
                ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>
        ) : null}
      </div>

      {isPage ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {reviews.map((review, i) => (
            <ReviewCard
              key={i}
              review={review}
              index={i}
              failedImageIndices={failedImageIndices}
              markImageFailed={markImageFailed}
              fullText
            />
          ))}
        </div>
      ) : (
        <div className="relative mx-auto mt-10 w-full max-w-xl [container-type:inline-size]">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto overflow-y-hidden scroll-smooth py-2 pb-4"
            style={{
              gap: CARD_GAP,
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
            aria-label="Reviews carousel"
          >
            {reviews.map((review, i) => (
              <div
                key={i}
                className="w-[100cqw] min-w-[100cqw] shrink-0"
                style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
              >
                <ReviewCard
                  review={review}
                  index={i}
                  failedImageIndices={failedImageIndices}
                  markImageFailed={markImageFailed}
                />
              </div>
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
      )}

      <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href={GOOGLE_MAPS_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm uppercase tracking-[0.02em] text-stone-600 underline underline-offset-4 hover:text-stone-900"
        >
          View all reviews on Google →
        </a>
      </div>
    </>
  );

  if (isPage) {
    return (
      <ReviewsPageShell padClass="py-10 md:py-14 lg:py-16">
        {content}
      </ReviewsPageShell>
    );
  }

  return (
    <section id="reviews" className="bg-amber-50/50" aria-label="Google reviews">
      <div className={`mx-auto max-w-7xl px-6 ${SECTION_PAD}`}>{content}</div>
    </section>
  );
}
