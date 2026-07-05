import { scrollToId } from '../../helpers/scrollToId';
import { HEADING_UPPER } from '../../helpers/typography.js';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-screen max-w-[100vw] overflow-x-clip [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-transparent pointer-events-none" />

      {/* Full viewport width — natural aspect ratio, no side crop */}
      <div className="relative w-full bg-amber-50">
        <Image
          src="/assets/new-hero.png"
          alt="Hand wiping a countertop with eco-friendly cleaning supplies nearby"
          width={1487}
          height={617}
          className="block h-auto w-full"
          sizes="100vw"
          priority
        />
        {/* Dark overlay on desktop so overlaid text pops */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none hidden lg:block" aria-hidden />
      </div>

      {/* Copy: block below image on mobile, overlayed on image on desktop */}
      <div className="relative px-4 pt-4 pb-16 lg:absolute lg:inset-0 lg:flex lg:items-center lg:px-8 lg:pt-0 lg:pb-0 xl:px-12 lg:pointer-events-none">
        <div className="mx-auto max-w-6xl w-full lg:max-w-xl lg:pointer-events-auto">
          <h1 className={`text-2xl lg:text-3xl lg:text-white lg:drop-shadow-md leading-snug ${HEADING_UPPER}`}>
            Professional cleaners with high standards, intentional care & consistent results.
          </h1>

          <p className="mt-4 text-stone-700 lg:text-lg lg:text-white/95 lg:drop-shadow-md">
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
              className="uppercase tracking-wide w-full sm:flex-1 inline-flex items-center justify-center rounded-2xl bg-[#333333] px-5 py-3 text-sm font-medium text-white shadow hover:bg-[#dcbb52] hover:text-[#333333] lg:bg-white lg:text-[#333333] lg:hover:bg-amber-50 lg:hover:text-[#333333] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              Explore Services
            </button>
          </div>

          <div className="mt-3">
            <Link
              href="/commercial"
              className="text-sm text-stone-600 hover:text-stone-900 lg:text-white/90 lg:hover:text-white underline underline-offset-4"
            >
              Looking for office or studio cleaning? → Commercial cleaning
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
