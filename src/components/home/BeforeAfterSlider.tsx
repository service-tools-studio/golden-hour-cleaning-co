"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BEFORE_AFTER_PHOTOS, beforeAfterSrc } from "@/data/beforeAfterPhotos";
import { HEADING_UPPER } from "@/helpers/typography.js";

const CARD_GAP = 24;

export default function BeforeAfterSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "prev" | "next") {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("figure");
    const step = (card?.offsetWidth ?? el.clientWidth) + CARD_GAP;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    if (direction === "prev") {
      el.scrollLeft = el.scrollLeft <= step ? maxScroll : el.scrollLeft - step;
    } else {
      el.scrollLeft = el.scrollLeft >= maxScroll - step ? 0 : el.scrollLeft + step;
    }
  }

  return (
    <section
      id="before-after"
      aria-labelledby="before-after-heading"
      className="border-t border-amber-200/60 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="before-after-heading"
          className={`text-center text-3xl font-semibold text-stone-900 sm:text-4xl ${HEADING_UPPER}`}
        >
          Before &amp; After
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
          Real results from Golden Hour visits — closets, bathrooms, floors, kitchens,
          and more. Every photo is a side-by-side from the same home.
        </p>

        <div className="relative mt-10">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth py-2 pb-4"
            style={{
              gap: CARD_GAP,
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
            aria-label="Before and after photos"
          >
            {BEFORE_AFTER_PHOTOS.map(({ id, title, alt }) => (
              <figure
                key={id}
                className="w-[min(100%,520px)] shrink-0 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm"
                style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
              >
                <div className="relative aspect-[3/2] w-full bg-stone-100">
                  <Image
                    src={beforeAfterSrc(id)}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 520px"
                    className="object-contain"
                  />
                </div>
                <figcaption className="border-t border-amber-100 px-4 py-3 text-sm font-medium text-stone-800">
                  {title}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => scroll("prev")}
              aria-label="Previous photo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("next")}
              aria-label="Next photo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
