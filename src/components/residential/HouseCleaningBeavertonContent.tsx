import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, CalendarCheck2, ShieldCheck, Stars } from "lucide-react";
import TrackedInstantQuoteLink from "@/components/analytics/TrackedInstantQuoteLink";
import GoogleReviews from "@/components/residential/GoogleReviews";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";
import { Badge } from "@/helpers/ui-elements.jsx";
import { FaqItem, Section } from "./servicePageParts";

const NEIGHBORHOODS = [
  "Central Beaverton",
  "Cedar Hills",
  "Murrayhill",
  "Cooper Mountain",
  "Sexton Mountain",
  "West Slope",
  "Five Oaks",
  "Highland",
  "Greenway",
  "Raleigh Hills",
  "Garden Home",
  "Progress Ridge",
  "Aloha",
  "Cedar Mill",
  "Bonny Slope",
  "Vose",
  "Tanasbourne",
  "Beaverton",
];

const SERVICE_CARDS = [
  {
    title: "Standard House Cleaning",
    desc: "Maintenance cleaning for homes that need regular upkeep, including kitchens, bathrooms, dusting, floors, and surfaces.",
    href: "/residential/services/standard",
  },
  {
    title: "Deep Cleaning",
    desc: "A more detailed reset for homes needing extra attention, buildup removal, baseboards, fixtures, and high-touch areas.",
    href: "/residential/services/deep",
  },
  {
    title: "Move-Out Cleaning",
    desc: "Top-to-bottom cleaning for apartments, condos, and homes before move-out, move-in, or listing preparation.",
    href: "/residential/services/move-out",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Get an instant quote and book your cleaning",
    desc: "Tell us about your home, cleaning needs, and book online instantly.",
  },
  {
    step: "02",
    title: "We confirm the details",
    desc: "We make sure the scope, pricing, and expectations are clear.",
  },
  {
    step: "03",
    title: "Enjoy your clean home",
    desc: "Our team arrives ready to make your home feel fresh and cared for.",
  },
];

const FAQS = [
  {
    question: "How much does house cleaning cost in Beaverton?",
    answer:
      "Pricing depends on the size of your home, condition, frequency, and type of cleaning. Recurring cleaning is typically less than a first-time deep clean.",
  },
  {
    question: "Do you bring your own supplies?",
    answer:
      "Yes. Our cleaners can bring professional supplies and equipment unless you prefer we use specific products in your home.",
  },
  {
    question: "Do you offer recurring cleaning?",
    answer:
      "Yes. We offer weekly, biweekly, and custom recurring cleaning options for Beaverton-area homes.",
  },
  {
    question: "Do you clean apartments and condos?",
    answer:
      "Yes. We clean houses, apartments, condos, townhomes, and residential properties throughout the Beaverton area.",
  },
];

export default function HouseCleaningBeavertonContent() {
  return (
    <>
      <section
        id="hero"
        className="relative w-screen max-w-[100vw] overflow-x-clip [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-transparent pointer-events-none" />

        <div className="relative w-full bg-amber-50 lg:min-h-[46rem]">
          <Image
            src="/assets/beaverton-living-room.png"
            alt="Bright Beaverton living room after a professional Golden Hour house cleaning"
            width={1535}
            height={1024}
            className="block h-auto w-full lg:absolute lg:inset-0 lg:h-full lg:w-full lg:object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 hidden bg-black/55 pointer-events-none lg:block"
            aria-hidden
          />
        </div>

        <div className="relative px-4 pt-4 pb-10 lg:absolute lg:inset-0 lg:flex lg:flex-col lg:justify-between lg:gap-8 lg:px-8 lg:pt-[calc(154px+0.75rem)] lg:pb-8 xl:px-12 lg:pointer-events-none">
          <div className="mx-auto w-full max-w-6xl lg:pointer-events-auto">
            <div className="lg:max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#dcbb52] lg:text-amber-200">
                Beaverton Residential Cleaning Services
              </p>
              <h1
                className={`mt-3 text-3xl leading-tight md:text-4xl lg:text-3xl lg:text-white lg:drop-shadow-md ${HEADING_UPPER}`}
              >
                House Cleaning in Beaverton, OR
              </h1>
              <p className="mt-4 text-lg leading-8 text-stone-700 lg:text-base lg:leading-7 lg:text-white/95 lg:drop-shadow-md">
                Whether you're commuting to Nike World Headquarters or Intel, juggling school pickups and youth sports, or simply trying to spend more quality time with your family, life in Beaverton doesn't leave much room for housework. Instead of spending your weekends cleaning, Golden Hour Cleaning Co. helps you come home to a space that feels fresh, peaceful, and truly cared for with one-time deep cleans, recurring house cleaning, and move-out cleaning tailored to your schedule.
              </p>
              <div className="mt-6">
                <a
                  href="#services"
                  className={`${BTN_UPPER} inline-flex w-full items-center justify-center rounded-2xl border border-[#333333] bg-[#333333] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#444444] sm:w-auto lg:border-white/80 lg:bg-white/10 lg:text-white lg:hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
                >
                  Explore Services
                </a>
              </div>
            </div>

            <div className="mt-8 flex w-screen max-w-[100vw] justify-center [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-4 py-2 text-center text-sm font-medium text-stone-700 lg:border-white/25 lg:bg-white/10 lg:text-white/95 lg:drop-shadow-md">
                <BadgeCheck className="h-4 w-4 shrink-0 text-[#dcbb52] lg:text-amber-300" aria-hidden />
                Trusted by Busy Beaverton Professionals and Families.
              </p>
            </div>
          </div>

          <div className="mx-auto hidden w-full max-w-7xl shrink-0 lg:block lg:pointer-events-auto">
            <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              <Badge icon={<ShieldCheck />} label="Licensed & Insured" />
              <Badge icon={<BadgeCheck />} label="Background-Checked" />
              <Badge icon={<CalendarCheck2 />} label="Real-Time Booking" />
              <Badge icon={<Stars />} label="5-Star Experience" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex min-h-[8rem] max-w-7xl flex-col items-center justify-center px-6 pt-2 pb-4 lg:hidden">
        <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-3 text-sm text-stone-700 sm:grid-cols-4">
          <Badge icon={<ShieldCheck />} label="Licensed & Insured" />
          <Badge icon={<BadgeCheck />} label="Background-Checked" />
          <Badge icon={<CalendarCheck2 />} label="Real-Time Booking" />
          <Badge icon={<Stars />} label="5-Star Experience" />
        </div>
      </div>

      <section className="bg-white px-5 py-16 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#dcbb52]">
            Thoughtfully Caring for Homes Across Beaverton
          </p>
          <h2 className={`mt-3 text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
            Helping Beaverton Homes Feel Their Best
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-700">
            Golden Hour Cleaning Co. was founded on the belief that house cleaning is an act of care. Every home reflects the people who live there, and every client is navigating a different season of life. Whether you're building a career, raising children, welcoming a new baby, preparing for guests, or simply trying to stay ahead of life's daily demands, we approach every home with compassion, respect, and meticulous attention to detail.
          </p>
        </div>

      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`text-3xl ${HEADING_UPPER}`}>Our House Cleaning Services</h2>
        <p className="mt-2 max-w-2xl text-stone-700">
          Choose the level of care your Beaverton home needs — from recurring upkeep to
          a full reset before a move.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {SERVICE_CARDS.map(({ title, desc, href }) => (
            <div
              key={title}
              className="flex flex-col rounded-3xl border border-amber-200 bg-white p-6 shadow-sm"
            >
              <h3 className={`font-medium ${HEADING_UPPER}`}>{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-700">{desc}</p>
              <Link
                href={href}
                aria-label={`Learn more about ${title}`}
                className={`${BTN_UPPER} mt-5 inline-flex w-full items-center justify-center rounded-xl border border-[#a7eff1]/40 bg-[#a7eff1]/30 px-4 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#a7eff1]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
              >
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto my-4 max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl border border-[#dcbb52]/25 bg-[#a7eff1] px-8 py-12 shadow-sm md:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#333333]">
            Why Beaverton homeowners choose us
          </p>
          <h2 className={`mt-3 text-2xl md:text-3xl ${HEADING_UPPER}`}>
            A 5-star experience from booking to final walkthrough.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#333333]/80">
            We combine meticulous cleaning standards with a nurturing, human approach. From your first quote to your final walkthrough, you'll experience responsive communication, seamless online booking, and a team that treats your home with the same care and respect we'd want for our own.

          </p>
          <TrackedInstantQuoteLink
            href="#quote"
            buttonLocation="landing_trust_section"
            buttonLabel="Get an Instant Quote and Book Online"
            className={`${BTN_UPPER} mt-8 inline-flex items-center justify-center rounded-xl bg-amber-400 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
          >
            Get an Instant Quote and Book Online
          </TrackedInstantQuoteLink>
        </div>
      </section>

      <GoogleReviews />

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`text-3xl ${HEADING_UPPER}`}>
          Serving Beaverton and nearby neighborhoods
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {NEIGHBORHOODS.map((area) => (
            <span
              key={area}
              className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm"
            >
              {area}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`text-3xl ${HEADING_UPPER}`}>Simple, seamless, and stress-free.</h2>
        <p className="mt-2 text-stone-700">How it works</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PROCESS_STEPS.map(({ step, title, desc }) => (
            <div
              key={step}
              className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm"
            >
              <p className="text-2xl font-semibold text-[#dcbb52]">{step}</p>
              <h3 className={`mt-2 text-lg font-semibold ${HEADING_UPPER}`}>{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#333333] px-5 py-16 text-center text-white md:px-10">
        <div className="mx-auto max-w-2xl">
          <h2 className={`text-3xl md:text-4xl ${HEADING_UPPER}`}>
            Ready for a cleaner, calmer home?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            Book your Beaverton house cleaning with Golden Hour Cleaning Co. today.
          </p>
          <Link
            href="/residential/quote"
            className={`${BTN_UPPER} mt-8 inline-flex items-center justify-center rounded-xl bg-amber-400 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
          >
            Get Your Quote
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Section title="House Cleaning Beaverton FAQs">
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
            {FAQS.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Section>
      </section>
    </>
  );
}
