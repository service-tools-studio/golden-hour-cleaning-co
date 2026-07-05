import Image from "next/image";
import Link from "next/link";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";
import { BulletList, BackToServicesLink, FaqItem, PORTLAND_METRO_AREAS, Section } from "./servicePageParts";

export default function StandardCleanPageContent({
  quoteHref,
}: {
  quoteHref: string;
}) {
  return (
    <>
      <BackToServicesLink />
      <p className="text-sm font-medium text-stone-500">
        ~$0.26/sq ft • lighter upkeep
      </p>
      <h1 className={`mt-1 text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
        Standard House Cleaning Services in Portland, OR
      </h1>

      <figure className="mt-6 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
        <div className="relative aspect-[3/4] w-full bg-stone-100 sm:aspect-[4/5]">
          <Image
            src="/assets/chateau-cleaning.webp"
            alt="Bright, freshly cleaned home interior after a Golden Hour standard cleaning"
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover object-top"
            priority
          />
        </div>
      </figure>

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
          attention to detail and reliability you deserve.
        </p>
      </Section>

      <Section title="What's Included in Our Standard Cleaning Service?">
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
          A standard cleaning is ideal for homes that are cleaned regularly and
          simply need ongoing maintenance.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          If your home hasn&apos;t been professionally cleaned in several months,
          has significant buildup, or you&apos;re preparing for recurring service,
          we may recommend starting with a deep cleaning to restore your home to a
          maintainable condition.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          After that, regular standard cleanings help keep your home consistently
          fresh.
        </p>
      </Section>

      <Section title="Who Benefits from Standard Cleaning?">
        <p className="text-base leading-relaxed text-stone-700">
          Our standard cleaning service is perfect for:
        </p>
        <BulletList
          items={[
            "Busy professionals",
            "Families with children",
            "Pet owners",
            "Seniors",
            "Remote workers",
            "Anyone who wants more free time and a consistently clean home",
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
            question="How long does a standard cleaning take?"
            answer="Cleaning times vary depending on your home's size, condition, and layout. We'll provide an estimate before your appointment."
          />
          <FaqItem
            question="Do I need to be home?"
            answer="No. Many of our clients provide secure access while they're at work or away. We'll discuss the option that works best for you."
          />
          <FaqItem
            question="Do you bring your own supplies?"
            answer="Yes. We arrive with professional-grade equipment and cleaning products, so you don't have to worry about providing anything unless you have specific product preferences."
          />
          <FaqItem
            question="How often should I schedule cleaning?"
            answer="Most homeowners choose bi-weekly service, while others prefer weekly or monthly visits depending on their household and lifestyle."
          />
        </div>
      </Section>

      <Section title="Get Your Free Instant Quote">
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
          <Link
            href={quoteHref}
            className={`${BTN_UPPER} inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
          >
            Get a quote for Standard Clean
          </Link>
          <Link
            href="/residential#services"
            className={`${BTN_UPPER} inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 hover:bg-stone-50`}
          >
            Compare all services
          </Link>
        </div>
        <p className="mt-4 text-xs text-stone-500">
          Quotes are based on estimated square footage, service level, and
          add-ons. Final price is confirmed during your in-home walkthrough.
        </p>
      </Section>
    </>
  );
}
