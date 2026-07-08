import Image from "next/image";
import TrackedInstantQuoteLink from "@/components/analytics/TrackedInstantQuoteLink";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";

export default function LifestyleSection() {
  return (
    <section
      aria-labelledby="lifestyle-heading"
      className="bg-[#fffbea] py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <figure className="overflow-hidden rounded-3xl border border-amber-200 shadow-sm">
          <div className="relative aspect-[4/5] w-full bg-stone-100 sm:aspect-[5/6]">
            <Image
              src="/assets/chateau-cleaning.webp"
              alt="Bright, peaceful home interior after a Golden Hour cleaning"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </figure>

        <div>
          <h2
            id="lifestyle-heading"
            className={`text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl ${HEADING_UPPER}`}
          >
            More Time for What Matters
          </h2>
          <p className="mt-6 text-base leading-relaxed text-stone-700 sm:text-lg">
            A clean home is about more than spotless countertops. It&apos;s about coming
            home to a space that feels peaceful, welcoming, and cared for. Whether you
            need recurring cleaning, a deep clean, or help preparing for a move,
            we&apos;re here to make life a little easier.
          </p>
          <TrackedInstantQuoteLink
            href="/residential/services#quote"
            buttonLocation="home_lifestyle"
            buttonLabel="Get Instant Quote"
            className={`${BTN_UPPER} mt-8 inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300 hover:shadow-xl`}
          >
            Get Instant Quote
          </TrackedInstantQuoteLink>
        </div>
      </div>
    </section>
  );
}
