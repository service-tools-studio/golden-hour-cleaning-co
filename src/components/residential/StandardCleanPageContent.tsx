import type { ReactNode } from "react";
import Link from "next/link";
import { RESIDENTIAL_SERVICES } from "@/data/residentialServices";
import { BTN_PRIMARY, BTN_SECONDARY, HEADING_UPPER } from "@/helpers/typography.js";
import ServiceDetailHero from "./ServiceDetailHero";
import { BulletList, FaqItem, HOURLY_CHARGE_FAQ, PORTLAND_METRO_AREAS, Section } from "./servicePageParts";

export default function StandardCleanPageContent({
  quoteHref,
}: {
  quoteHref: string;
  afterHero?: ReactNode;
}) {
  const service = RESIDENTIAL_SERVICES.standard;

  return (
    <>
      <ServiceDetailHero
        serviceSlug="standard"
        tagline="Lighter upkeep"
        title="Standard House Cleaning Services in Portland, OR"
        intro="Our standard cleaning keeps a tidy home looking its best—ideal for recurring upkeep or homes professionally cleaned within the past 2–4 weeks."
        imageSrc="/assets/chateau-cleaning.webp"
        imageAlt="Bright, freshly cleaned home interior after a Golden Hour standard cleaning"
        includedItems={service.items}
        checklistHref="#whats-included"
        quoteHref={quoteHref}
      />

      <Section title="Professional Standard Cleaning for a Home That Always Feels Fresh">
        <p className="text-base leading-relaxed text-stone-700">
          Life gets busy, and keeping up with routine cleaning isn&apos;t always
          easy. At Golden Hour Cleaning Co., we provide
          dependable standard house cleaning services throughout Portland and the
          surrounding communities, helping you enjoy a consistently clean,
          comfortable home without sacrificing your valuable time.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Whether you&apos;re looking for weekly, bi-weekly, monthly, or
          occasional maintenance cleaning, our experienced team delivers the
          attention to detail and reliability you deserve. We use eco-friendly products whenever possible.
        </p>
      </Section>

      <Section id="whats-included" title="What's Included in Our Standard Cleaning Service?">
        <p className="text-base leading-relaxed text-stone-700">
          Our standard cleaning is designed to maintain an already lived-in home
          and keep it looking its best.
        </p>

        <div className="mt-6 space-y-6 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Kitchen
            </h3>
            <BulletList
              items={[
                "Clean and sanitize countertops",
                "Wipe exterior of appliances",
                "Clean stovetop",
                "Clean microwave interior and exterior",
                "Polish sink and faucet",
                "Spot clean cabinet fronts",
                "Empty trash",
                "Vacuum and mop floors",
              ]}
            />
          </div>

          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Bathrooms
            </h3>
            <BulletList
              items={[
                "Clean and disinfect toilets",
                "Scrub showers and bathtubs",
                "Clean sinks and countertops",
                "Polish mirrors",
                "Wipe fixtures",
                "Empty trash",
                "Vacuum and mop floors",
              ]}
            />
          </div>

          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Living Areas &amp; Bedrooms
            </h3>
            <BulletList
              items={[
                "Dust accessible surfaces",
                "Dust furniture",
                "Make beds (if linens are left out)",
                "Vacuum carpets and rugs",
                "Mop hard floors",
                "Empty trash",
                "Spot clean mirrors and glass surfaces",
              ]}
            />
          </div>

          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Throughout the Home
            </h3>
            <BulletList
              items={[
                "Dust reachable surfaces",
                "Vacuum all accessible floors",
                "Mop hard surface flooring",
                "Light touch-up of high-contact areas",
                "General tidying",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Why Choose Golden Hour Cleaning Co.?">
        <p className="text-base leading-relaxed text-stone-700">
          We know inviting someone into your home requires trust. That&apos;s why
          we focus on more than just cleaning—we focus on creating an exceptional
          customer experience.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          When you choose Golden Hour Cleaning Co., you can expect:
        </p>
        <BulletList
          items={[
            "Friendly, professional cleaners",
            "Reliable communication",
            "Consistent, high-quality workmanship",
            "Careful attention to detail",
            "Respect for your home and belongings",
            "Convenient online scheduling and payment",
            "Flexible recurring cleaning options",
          ]}
        />
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Our goal is simple: leave your home feeling refreshed so you can spend
          more time enjoying life.
        </p>
      </Section>

      <Section title="Standard Cleaning vs. Deep Cleaning">
        <p className="text-base leading-relaxed text-stone-700">
          Standard cleaning is reserved for recurring customers or homes that have
          had a professional cleaning within the past 2–4 weeks. It&apos;s meant for
          ongoing maintenance once a home is already in good condition.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          If your home hasn&apos;t been professionally cleaned recently, has
          buildup, or you&apos;re starting service for the first time, we recommend
          a{" "}
          <Link
            href="/residential/services/deep"
            className="font-medium text-stone-900 underline underline-offset-2 hover:text-stone-700"
          >
            Deep Clean
          </Link>{" "}
          first. After that, regular standard cleanings help keep your
          home consistently fresh.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          We confirm your final price after a quick walkthrough.
        </p>
      </Section>

      <Section title="Who Benefits from Standard Cleaning?">
        <p className="text-base leading-relaxed text-stone-700">
          Our standard cleaning service is a great fit for:
        </p>
        <BulletList
          items={[
            "Recurring weekly, bi-weekly, or monthly clients",
            "Homes professionally cleaned within the past 2–4 weeks",
            "Households maintaining a deep-clean baseline",
            "Busy professionals and families who want reliable upkeep",
          ]}
        />
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Whether you need weekly, bi-weekly, or monthly service, we&apos;ll
          create a schedule that fits your lifestyle.
        </p>
      </Section>

      <Section title="Areas We Serve">
        <p className="text-base leading-relaxed text-stone-700">
          Golden Hour Cleaning Co. proudly provides standard house cleaning
          services throughout:
        </p>
        <BulletList items={PORTLAND_METRO_AREAS} />
      </Section>

      <Section title="Frequently Asked Questions">
        <div className="mt-4 space-y-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <FaqItem
            question={HOURLY_CHARGE_FAQ.question}
            answer={HOURLY_CHARGE_FAQ.answer}
          />
          <FaqItem
            question="How is standard cleaning priced?"
            answer="You can request a personalized quote online based on your home's size and service type. We confirm your final price after a quick walkthrough."
          />
          <FaqItem
            question="Who is Standard Cleaning for?"
            answer="Standard cleans are reserved for recurring customers or homes that have had a professional cleaning within the past 2–4 weeks. If it's been longer, we usually recommend starting with a Deep Clean."
          />
          <FaqItem
            question="How long does a standard cleaning take?"
            answer="On-site time varies with your home's size and condition. We schedule enough cleaners to keep visits efficient, and you'll see an estimate when you get your quote."
          />
          <FaqItem
            question="Do I need to be home?"
            answer="No. Many of our clients provide secure access while they're at work or away. We'll discuss the option that works best for you."
          />
          <FaqItem
            question="Do you bring your own supplies?"
            answer="Yes. We use eco-friendly products whenever possible. We arrive with professional-grade equipment and supplies, and you're welcome to share any product preferences."
          />
          <FaqItem
            question="How often should I schedule cleaning?"
            answer="Most homeowners choose bi-weekly service, while others prefer weekly or monthly visits depending on their household and lifestyle."
          />
        </div>
      </Section>

      <Section title="Request a Personalized Quote">
        <p className="text-base leading-relaxed text-stone-700">
          Ready to spend less time cleaning and more time enjoying your home?
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Golden Hour Cleaning Co. proudly serves homeowners throughout Portland,
          OR, with dependable, detail-oriented standard house cleaning services.
          Contact us today for a free, no-obligation quote and discover why so
          many homeowners trust us to keep their homes beautifully maintained.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={quoteHref} className={BTN_PRIMARY}>
            Get a quote for Standard Clean
          </Link>
          <Link href="/residential/services" className={BTN_SECONDARY}>
            Compare all services
          </Link>
        </div>
        <p className="mt-4 text-xs text-stone-500">
          Quotes are based on your home&apos;s size and service type. We use eco-friendly products
          whenever possible. Final price is confirmed after a quick walkthrough.
        </p>
      </Section>
    </>
  );
}
