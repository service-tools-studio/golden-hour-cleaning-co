import { scrollToId } from '../../helpers/scrollToId';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-x-clip">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-transparent pointer-events-none" />

      {/* Full viewport width image on all screen sizes */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 aspect-[4/3] md:aspect-[21/9] overflow-hidden">
        <img
          src="/assets/gh-cleaning-hero.PNG"
          alt="Sunlit, tidy living room with natural textures"
          className="h-full w-full object-cover"
        />
        {/* Dark overlay on desktop so overlaid text pops */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none hidden md:block" aria-hidden />
      </div>

      {/* Copy: block below image on mobile, overlayed on image on desktop */}
      <div className="relative px-4 pt-4 pb-16 md:absolute md:inset-0 md:flex md:items-center md:px-8 md:pt-0 md:pb-0 lg:px-12">
        <div className="mx-auto max-w-6xl w-full md:max-w-xl">
          <h1 className="font-lora text-3xl md:text-4xl md:text-white md:drop-shadow-md leading-snug">
            Professional cleaning for busy, discerning homes.
          </h1>

          <p className="mt-4 text-stone-700 md:text-lg md:text-white/95 md:drop-shadow-md">
            Golden Hour brings meticulous, non-toxic cleaning with a calm, grounded presence.
            Designed for high-performing households and boutique rentals who value immaculate results,
            instant online booking, and a team that treats your space like a sanctuary.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('#services', 8);
              }}
              className="w-full sm:flex-1 inline-flex items-center justify-center rounded-2xl bg-stone-900 md:bg-white md:text-stone-900 px-5 py-3 text-sm font-medium text-white shadow hover:bg-stone-800 md:hover:bg-amber-50"
            >
              See Services &amp; Get Quote
            </button>
          </div>

          <div className="mt-3">
            <Link
              href="/commercial"
              className="text-sm text-stone-600 hover:text-stone-900 md:text-white/90 md:hover:text-white underline underline-offset-4"
            >
              Looking for office or studio cleaning? → Commercial cleaning
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
