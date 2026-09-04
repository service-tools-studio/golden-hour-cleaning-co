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
  "Happy Valley",
  "Scouters Mountain",
  "Happy Valley Park",
  "Mount Scott",
  "Clackamas",
  "Damascus",
  "Sunnyside",
  "Pleasant Valley",
  "SE Portland",
  "Oregon City",
  "West Linn",
  "Lake Oswego",
  "Beaverton",
  "Portland",
];

const SERVICE_CARDS = [
  {
    title: "Recurring House Cleaning",
    desc: "Weekly, bi-weekly, or every-four-weeks cleanings that keep your home consistently fresh—perfect for busy professionals, growing families, retirees, and anyone who'd rather enjoy their weekends.",
    href: "/residential/services/standard",
  },
  {
    title: "Deep Cleaning Services",
    desc: "Goes beyond routine maintenance with baseboards, window sills, doors and trim, light fixtures, cabinet fronts, detailed bathrooms, kitchen detailing, and built-up dust removal.",
    href: "/residential/services/deep",
  },
  {
    title: "Move-In & Move-Out Cleaning",
    desc: "Whether you're buying, selling, or renting, we'll leave your home thoroughly cleaned and ready for its next chapter—so you can focus on the move.",
    href: "/residential/services/move-out",
  },
  {
    title: "Post-Construction Cleaning",
    desc: "Construction dust settles everywhere. We remove fine dust, polish surfaces, and prepare your remodeled home so you can fully enjoy the finished project.",
    href: "/residential/services#services",
  },
];

const WHY_US = [
  "Consistent, dependable service",
  "Exceptional attention to detail",
  "Friendly, respectful cleaners",
  "Honest communication",
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
      "Bed making (if fresh linens are provided)",
      "Mirrors",
      "Floors",
    ],
  },
  {
    title: "Living Areas",
    items: [
      "Dusting",
      "Vacuuming carpets and rugs",
      "Mopping hard floors",
      "Cobweb removal",
      "General straightening",
    ],
  },
];

const PRICING_FACTORS = [
  "Home size",
  "Current condition",
  "Number of bathrooms",
  "Cleaning frequency",
  "Pets",
  "Requested services",
];

const FAQS = [
  HOURLY_CHARGE_FAQ,
  {
    question: "Do I need to be home?",
    answer:
      "No. Many of our clients provide a garage code, lockbox, or key so we can clean while they're away.",
  },
  {
    question: "Do you bring your own supplies?",
    answer:
      "Yes. We use eco-friendly products whenever possible. For heavy buildup, stronger conventional products may be used when needed. We provide professional-grade cleaning products and equipment.",
  },
  {
    question: "Are you insured?",
    answer:
      "Absolutely. Golden Hour Cleaning Co. is fully insured for your peace of mind.",
  },
  {
    question: "How long does a cleaning take?",
    answer:
      "Every home is different. We'll provide an estimated timeframe when scheduling your service.",
  },
];

export default function HouseCleaningHappyValleyContent() {
  return (
    <>
      <section
        id="hero"
        className="relative w-screen max-w-[100vw] overflow-x-clip [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-transparent pointer-events-none" />

        <div className="relative w-full bg-amber-50 lg:min-h-[46rem]">
          <Image
            src="/assets/house-cleaning-happy-valley.png"
            alt="Bright, spotless Happy Valley kitchen after a professional Golden Hour house cleaning"
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
                Happy Valley Residential Cleaning Services
              </p>
              <h1
                className={`mt-3 text-3xl leading-tight md:text-4xl lg:text-3xl lg:text-white lg:drop-shadow-md ${HEADING_UPPER}`}
              >
                House Cleaning Services in Happy Valley, OR
              </h1>
              <p className="mt-4 text-lg leading-8 text-stone-700 lg:text-base lg:leading-7 lg:text-white/95 lg:drop-shadow-md">
                Looking for reliable house cleaning in Happy Valley? Golden Hour
                Cleaning Co. provides premium home cleaning services for busy
                homeowners who want a beautifully maintained home without
                sacrificing their free time.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <TrackedInstantQuoteLink
                  href="#quote"
                  buttonLocation="landing_hero"
                  buttonLabel="Request your free quote"
                  className={`${BTN_PRIMARY} w-full sm:w-auto`}
                >
                  Request your free quote
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
                Trusted House Cleaning in Happy Valley
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
            Trusted House Cleaning in Happy Valley
          </p>
          <h2 className={`mt-3 text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
            A cleaning experience built around you
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-700">
            Whether you need recurring cleaning, a one-time deep clean, or help
            preparing for a move, our experienced team delivers detailed,
            dependable service with exceptional care.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            We&apos;re proud to serve families throughout Happy Valley and the
            surrounding communities. Request your free quote today and enjoy a
            cleaning experience built around you.
          </p>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`text-3xl ${HEADING_UPPER}`}>
          Professional House Cleaning Services in Happy Valley
        </h2>
        <p className="mt-2 max-w-2xl text-stone-700">
          Every home is different, which is why we tailor our cleaning services
          to your home&apos;s unique needs.
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
            Why Happy Valley homeowners choose us
          </p>
          <h2 className={`mt-3 text-2xl md:text-3xl ${HEADING_UPPER}`}>
            Why Happy Valley Homeowners Choose Golden Hour Cleaning Co.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-700">
            We know that inviting a cleaning company into your home requires
            trust. We believe professional cleaning should provide more than a
            spotless home—it should give you peace of mind.
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
            Helping Busy Happy Valley Families
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-700">
            Happy Valley continues to be one of the fastest-growing communities
            in the Portland metro area. Between work, school activities,
            commuting, and family life, finding time to keep your home
            consistently clean isn&apos;t always easy.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            Whether you live near Scouters Mountain, Happy Valley Park, Mount
            Scott, or in one of the area&apos;s newer neighborhoods, we&apos;re
            here to help make life a little easier.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            Our goal is simple: to give you more time to enjoy your home—not
            spend all your free time cleaning it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className={`text-3xl ${HEADING_UPPER}`}>
          What&apos;s Included in Our House Cleaning?
        </h2>
        <p className="mt-2 max-w-2xl text-stone-700">
          Our standard house cleaning typically includes:
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
          Need something specific cleaned? We&apos;re happy to customize your
          service whenever possible.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-3xl border border-amber-200 bg-white p-8 shadow-sm md:p-10">
          <h2 className={`text-3xl ${HEADING_UPPER}`}>
            How Much Does House Cleaning Cost in Happy Valley?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            The cost of house cleaning depends on several factors, including:
          </p>
          <div className="mt-4">
            <BulletList items={PRICING_FACTORS} />
          </div>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            Because every home is unique, we provide personalized estimates
            based on your specific needs. Contact us today for a free quote.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackedInstantQuoteLink
              href="#quote"
              buttonLocation="landing_pricing_section"
              buttonLabel="Get a free quote"
              className={BTN_PRIMARY}
            >
              Get a free quote
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
          Proudly Serving Happy Valley and Nearby Areas
        </h2>
        <p className="mt-2 max-w-2xl text-stone-700">
          We proudly provide house cleaning throughout Happy Valley and nearby
          communities. If you&apos;re unsure whether you&apos;re in our service
          area, reach out—we&apos;re happy to help.
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
            Schedule Your Happy Valley House Cleaning Today
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            If you&apos;re searching for dependable house cleaning in Happy
            Valley, we&apos;d love the opportunity to care for your home. From
            recurring maintenance and deep cleaning to move-out and
            post-construction cleaning, Golden Hour Cleaning Co. is committed to
            delivering exceptional results with every visit.
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
