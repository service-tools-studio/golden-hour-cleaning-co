import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, CalendarCheck2, ShieldCheck, Stars } from "lucide-react";
import TrackedInstantQuoteLink from "@/components/analytics/TrackedInstantQuoteLink";
import GoogleReviews from "@/components/residential/GoogleReviews";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  HEADING_UPPER,
  SECTION_EYEBROW,
  SECTION_EYEBROW_ON_DARK,
} from "@/helpers/typography.js";
import { Badge } from "@/helpers/ui-elements.jsx";
import { BulletList, FaqItem, HOURLY_CHARGE_FAQ, Section } from "./servicePageParts";

const NEIGHBORHOODS = [
  "Historic Downtown Oregon City",
  "Hillendale",
  "South End",
  "Park Place",
  "West Linn",
  "Gladstone",
  "Lake Oswego",
  "Milwaukie",
  "Happy Valley",
  "Clackamas",
  "Beavercreek",
];

const SERVICE_CARDS = [
  {
    title: "Recurring House Cleaning",
    desc: "Weekly, bi-weekly, or every-four-weeks maintenance so you can come home to a consistently clean house—kitchens, bathrooms, bedrooms, living areas, dusting, vacuuming, mopping, and more.",
    href: "/residential/services/standard",
  },
  {
    title: "Deep House Cleaning",
    desc: "A fuller reset that tackles overlooked areas like baseboards, doors and trim, light fixtures, ceiling fans, detailed bathrooms, kitchen detailing, and built-up dust and grime.",
    href: "/residential/services/deep",
  },
  {
    title: "Move-In & Move-Out Cleaning",
    desc: "Thorough room-by-room cleaning whether you're preparing a home for new owners or settling into a new one—so you can focus on the move.",
    href: "/residential/services/move-out",
  },
  {
    title: "Post-Construction Cleaning",
    desc: "Fine construction dust settles everywhere—even after contractors finish. We remove dust and debris throughout your home so it's ready to enjoy.",
    href: "/residential/services#services",
  },
];

const WHY_US = [
  "Friendly, professional cleaners",
  "Exceptional attention to detail",
  "Reliable communication",
  "Transparent pricing",
  "Flexible scheduling",
  "Satisfaction guarantee",
];

const INCLUDED = [
  {
    title: "Kitchen",
    items: [
      "Countertops",
      "Appliance exteriors",
      "Sink and faucet",
      "Stovetop",
      "Microwave",
      "Cabinet fronts",
      "Floors",
    ],
  },
  {
    title: "Bathrooms",
    items: [
      "Toilets",
      "Showers and tubs",
      "Sinks",
      "Mirrors",
      "Counters",
      "Floors",
    ],
  },
  {
    title: "Bedrooms",
    items: [
      "Dusting",
      "Vacuuming",
      "Bed making (if fresh linens are left out)",
      "Mirrors",
      "Floors",
    ],
  },
  {
    title: "Living Areas",
    items: [
      "Dusting furniture",
      "Vacuuming rugs and carpet",
      "Hard floor mopping",
      "General tidying",
      "Cobweb removal",
    ],
  },
];

const PRICING_FACTORS = [
  "Home size",
  "Current condition",
  "Number of bathrooms",
  "Pets",
  "Requested services",
  "Cleaning frequency",
];

const FAQS = [
  HOURLY_CHARGE_FAQ,
  {
    question: "Do I need to be home during the cleaning?",
    answer:
      "Not at all. Many of our clients provide a garage code, lockbox, or key so we can clean while they're away.",
  },
  {
    question: "Do you bring your own cleaning supplies?",
    answer:
      "Yes. We use eco-friendly products whenever possible. For heavy buildup, stronger conventional products may be used when needed. We arrive with professional-grade cleaning products and equipment.",
  },
  {
    question: "Are you insured?",
    answer:
      "Yes. Golden Hour Cleaning Co. is fully insured for your peace of mind.",
  },
  {
    question: "How long does a house cleaning take?",
    answer:
      "It depends on the size and condition of your home, but we'll provide an estimated timeframe when scheduling your service.",
  },
];

export default function HouseCleaningOregonCityContent() {
  return (
    <>
      <section
        id="hero"
        className="relative w-screen max-w-[100vw] overflow-x-clip [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-transparent pointer-events-none" />

        <div className="relative w-full bg-amber-50 lg:min-h-[46rem]">
          <Image
            src="/assets/house-cleaning-oregon-city.png"
            alt="Bright open-concept Oregon City home after a professional Golden Hour house cleaning"
            width={1536}
            height={1024}
            className="block h-auto w-full lg:absolute lg:inset-0 lg:h-full lg:w-full lg:object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 hidden bg-black/70 pointer-events-none lg:block"
            aria-hidden
          />
        </div>

        <div className="relative px-4 pt-4 pb-10 lg:absolute lg:inset-0 lg:flex lg:flex-col lg:justify-between lg:gap-8 lg:px-8 lg:pt-[calc(154px+0.75rem)] lg:pb-8 xl:px-12 lg:pointer-events-none">
          <div className="mx-auto w-full max-w-6xl lg:pointer-events-auto">
            <div className="lg:max-w-4xl">
              <p className={`${SECTION_EYEBROW} lg:text-amber-200`}>
                Oregon City Residential Cleaning Services
              </p>
              <h1
                className={`mt-3 text-3xl leading-tight md:text-4xl lg:text-3xl lg:text-white lg:drop-shadow-md ${HEADING_UPPER}`}
              >
                House Cleaning Services in Oregon City, OR
              </h1>
              <p className="mt-4 text-lg leading-8 text-stone-700 lg:text-base lg:leading-7 lg:text-white/95 lg:drop-shadow-md">
                Looking for dependable house cleaning in Oregon City? Golden Hour
                Cleaning Co. provides detailed, high-quality home cleaning
                services designed around your needs—not rushed checklists or
                one-size-fits-all cleanings.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <TrackedInstantQuoteLink
                  href="#quote"
                  buttonLocation="landing_hero"
                  buttonLabel="Get your free quote"
                  className={`${BTN_PRIMARY} w-full sm:w-auto`}
                >
                  Get your free quote
                </TrackedInstantQuoteLink>
                <a
                  href="#services"
                  className={`${BTN_SECONDARY} w-full sm:w-auto`}
                >
                  Explore Services
                </a>
              </div>
            </div>

            <div className="mt-8 flex w-screen max-w-[100vw] justify-center [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-4 py-2 text-center text-sm font-medium text-stone-700 lg:border-white/25 lg:bg-white/10 lg:text-white/95 lg:drop-shadow-md">
                <BadgeCheck
                  className="h-4 w-4 shrink-0 text-amber-600 lg:text-amber-300"
                  aria-hidden
                />
                Trusted House Cleaning in Oregon City
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
          <p className={SECTION_EYEBROW}>
            Trusted House Cleaning in Oregon City
          </p>
          <h2 className={`mt-3 text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
            Cleaning designed around your home
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-700">
            Whether you&apos;re looking for recurring maintenance, a deep clean
            before hosting family, or help getting your home back under control,
            our experienced team delivers meticulous results with friendly,
            reliable service.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            We proudly serve homeowners throughout Oregon City and the
            surrounding communities. Get your free quote today and discover why
            Oregon City homeowners trust Golden Hour Cleaning Co.
          </p>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`text-3xl ${HEADING_UPPER}`}>
          Our House Cleaning Services in Oregon City
        </h2>
        <p className="mt-2 max-w-2xl text-stone-700">
          From weekly upkeep to post-construction resets, choose the level of
          care your Oregon City home needs.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {SERVICE_CARDS.map(({ title, desc, href }) => (
            <div
              key={title}
              className="flex flex-col rounded-3xl border border-amber-200 bg-white p-6 shadow-sm"
            >
              <h3 className={`font-medium ${HEADING_UPPER}`}>{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-700">
                {desc}
              </p>
              <Link
                href={href}
                aria-label={`Learn more about ${title}`}
                className={`${BTN_SECONDARY} mt-5 w-full`}
              >
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto my-4 max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl border border-amber-200 bg-[#a7eff1] px-8 py-12 shadow-sm md:px-12">
          <p className={`${SECTION_EYEBROW} text-stone-900`}>
            Why Oregon City homeowners choose us
          </p>
          <h2 className={`mt-3 text-2xl md:text-3xl ${HEADING_UPPER}`}>
            Why Oregon City Homeowners Choose Golden Hour Cleaning Co.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-700">
            We know inviting someone into your home requires trust. We
            don&apos;t believe in rushing through homes. We believe every
            cleaning should leave your space feeling refreshed, comfortable, and
            genuinely cared for.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {WHY_US.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm font-medium text-stone-900"
              >
                <BadgeCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
          <TrackedInstantQuoteLink
            href="#quote"
            buttonLocation="landing_trust_section"
            buttonLabel="See Pricing"
            className={`${BTN_PRIMARY} mt-8`}
          >
            See Pricing
          </TrackedInstantQuoteLink>
        </div>
      </section>

      <GoogleReviews />

      <section className="bg-white px-5 py-16 md:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className={`text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
            Cleaning Services for Busy Oregon City Families
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-700">
            Life gets busy. Between work, school, kids&apos; activities, and
            everything else, cleaning often falls to the bottom of the list.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            Whether you live near Historic Downtown Oregon City, Hillendale,
            South End, Park Place, or elsewhere in the area, we&apos;re here to
            help you spend less time cleaning and more time enjoying your home.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            Many of our clients tell us that professional cleaning gives them
            something even more valuable than a spotless home—it gives them
            their weekends back.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`text-3xl ${HEADING_UPPER}`}>
          What&apos;s Included in Our House Cleaning?
        </h2>
        <p className="mt-2 max-w-2xl text-stone-700">
          Every home is different, but our standard cleanings typically include:
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {INCLUDED.map(({ title, items }) => (
            <div
              key={title}
              className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm"
            >
              <h3 className={`text-lg font-semibold ${HEADING_UPPER}`}>{title}</h3>
              <div className="mt-4">
                <BulletList items={items} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-base text-stone-700">
          Need something extra? Just let us know when requesting your quote.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-3xl border border-amber-200 bg-white p-8 shadow-sm md:p-10">
          <h2 className={`text-3xl ${HEADING_UPPER}`}>
            How Much Does House Cleaning Cost in Oregon City?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            Cleaning prices depend on several factors, including:
          </p>
          <div className="mt-4">
            <BulletList items={PRICING_FACTORS} />
          </div>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            Because every home is unique, we provide personalized quotes instead
            of one-size-fits-all pricing. Contact us today for a free,
            no-obligation estimate.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackedInstantQuoteLink
              href="#quote"
              buttonLocation="landing_pricing_section"
              buttonLabel="Get a free estimate"
              className={BTN_PRIMARY}
            >
              Get a free estimate
            </TrackedInstantQuoteLink>
            <Link
              href="/blog/how-much-does-house-cleaning-cost-in-portland-2026"
              className={BTN_SECONDARY}
            >
              Read our pricing guide
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`text-3xl ${HEADING_UPPER}`}>
          Serving Oregon City and Nearby Communities
        </h2>
        <p className="mt-2 max-w-2xl text-stone-700">
          In addition to Oregon City, we also provide house cleaning nearby. If
          you&apos;re unsure whether you&apos;re in our service area, reach
          out—we&apos;re happy to help.
        </p>
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

      <section className="bg-stone-900 px-5 py-16 text-center text-white md:px-10">
        <div className="mx-auto max-w-2xl">
          <h2 className={`text-3xl md:text-4xl ${HEADING_UPPER}`}>
            Schedule Your Oregon City House Cleaning Today
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            If you&apos;re looking for reliable, detail-oriented house cleaning
            in Oregon City, we&apos;d love the opportunity to earn your trust.
            Whether you need recurring cleaning, a deep clean, move-out
            cleaning, or post-construction cleaning, Golden Hour Cleaning Co. is
            here to help you enjoy a cleaner, healthier home.
          </p>
          <TrackedInstantQuoteLink
            href="#quote"
            buttonLocation="landing_final_cta"
            buttonLabel="Request your free quote"
            className={`${BTN_PRIMARY} mt-8`}
          >
            Request your free quote
          </TrackedInstantQuoteLink>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Section title="Frequently Asked Questions">
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
            {FAQS.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </Section>
      </section>
    </>
  );
}
