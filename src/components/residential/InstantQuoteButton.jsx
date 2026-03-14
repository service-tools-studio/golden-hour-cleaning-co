"use client";

import { useEffect, useRef, useState } from 'react';
import { scrollToId } from '../../helpers/scrollToId';
import ContactButton from './ContactButton';

export default function InstantQuoteButton() {
  const [hidden, setHidden] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const quoteEl = document.querySelector('#quote-calculator');
    if (!quoteEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide the floating button when the quote calculator becomes visible
        if (entry.isIntersecting) {
          setHidden(true);
        } else {
          setHidden(false);
        }
      },
      {
        root: null,
        threshold: 0.1, // triggers when 10% of quote calculator is visible
      }
    );

    observer.observe(quoteEl);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`
        fixed right-4 md:right-8 flex flex-row flex-wrap items-center gap-2
        transition-opacity duration-300
        ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
      style={{
        top: 'calc(var(--header-height, 120px) + 12px)',
        zIndex: 100002,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="min-w-0 shrink">
        <ContactButton />
      </div>
      <button
        type="button"
        aria-label="Get an instant quote and see real-time availability"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('#quote-calculator', 8);
        }}
        className="shrink-0 px-5 md:px-6 h-11 md:h-12 rounded-full bg-amber-400 text-slate-900 font-semibold shadow-lg border border-amber-300 hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        Get Instant Quote + Booking
      </button>
    </div>
  );
}
