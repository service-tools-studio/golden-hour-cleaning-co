import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/constants.js";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";
import { BulletList, BackToServicesLink, FaqItem, PORTLAND_METRO_AREAS, Section } from "./servicePageParts";

export default function DeepCleanPageContent({
  quoteHref,
}: {
  quoteHref: string;
}) {
  return (
    <>
      <BackToServicesLink />
      <p className="text-sm font-medium text-stone-500">
        ~$0.35/sq ft • full-home reset
      </p>
      <h1 className={`mt-1 text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
        Deep House Cleaning Services in Portland, OR
      </h1>

      <figure className="mx-auto mt-6 max-w-xs overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm sm:max-w-sm">
        <div className="relative aspect-[4/5] w-full bg-stone-100">
          <Image
            src="/assets/glass-cleaning.webp"
            alt="Streak-free glass and mirrors after a Golden Hour deep cleaning"
            fill
            sizes="(max-width: 640px) 320px, 384px"
            className="object-cover object-top"
            priority
          />
        </div>
      </figure>

      <Section title="Professional Deep Cleaning for a Fresh Start">
        <p className="text-base leading-relaxed text-stone-700">
          Sometimes your home needs more than routine upkeep. Whether it&apos;s
          been a while since your last professional cleaning, you&apos;re
          preparing for guests, moving into a new home, or simply ready for a
          reset, Golden Hour Cleaning Co. provides thorough deep cleaning
          services throughout Portland, OR and the surrounding communities.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Our deep cleaning service targets the buildup, dust, grime, and
          overlooked areas that naturally accumulate over time, leaving your home
          feeling refreshed from top to bottom.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Get an instant quote and book your cleaning directly on our
          website—no phone call required.
        </p>
      </Section>

      <Section title="What's Included in Our Deep Cleaning Service?">
        <p className="text-base leading-relaxed text-stone-700">
          Our deep cleaning includes everything in our Standard Cleaning service,
          plus additional detailed attention throughout your home.
        </p>

        <div className="mt-6 space-y-6 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Kitchen
            </h3>
            <BulletList
              items={[
                "Clean and sanitize countertops",
                "Clean backsplash",
                "Clean stovetop",
                "Clean inside and outside of the microwave",
                "Clean exterior of appliances",
                "Wipe cabinet fronts to remove fingerprints and buildup",
                "Detail sink and faucet",
                "Spot clean walls as needed",
                "Vacuum and mop floors",
                "Empty trash",
              ]}
            />
          </div>

          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Bathrooms
            </h3>
            <BulletList
              items={[
                "Scrub showers, tubs, and tile",
                "Remove soap scum and buildup",
                "Clean and disinfect toilets",
                "Clean sinks and countertops",
                "Polish mirrors and fixtures",
                "Wipe cabinet fronts",
                "Spot clean walls",
                "Vacuum and mop floors",
                "Empty trash",
              ]}
            />
          </div>

          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Bedrooms &amp; Living Areas
            </h3>
            <BulletList
              items={[
                "Dust all accessible surfaces",
                "Dust furniture and décor",
                "Dust baseboards",
                "Clean window sills",
                "Spot clean doors and door frames",
                "Clean light switches",
                "Wipe reachable trim",
                "Vacuum carpets, rugs, and furniture edges",
                "Mop hard floors",
                "Empty trash",
              ]}
            />
          </div>

          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Throughout the Home
            </h3>
            <BulletList
              items={[
                "Dust ceiling fan blades (within reach)",
                "Dust vents (within reach)",
                "Dust baseboards throughout",
                "Clean window sills and tracks (light detail)",
                "Spot clean walls",
                "Wipe doors and door frames",
                "Clean light switches",
                "Remove cobwebs",
                "Vacuum under accessible furniture",
                "Vacuum edges and corners",
                "Mop all hard flooring",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="What Makes a Deep Cleaning Different?">
        <p className="text-base leading-relaxed text-stone-700">
          A standard cleaning is designed to maintain a home that is already being
          cleaned regularly.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          A deep cleaning goes much further by focusing on the detailed areas that
          often get overlooked during routine cleaning. It&apos;s the ideal choice
          if:
        </p>
        <BulletList
          items={[
            "Your home hasn't been professionally cleaned in several months",
            "You're preparing to begin recurring cleaning service",
            "You're hosting family or guests",
            "You're moving into a home",
            "You simply want your home feeling refreshed and reset",
          ]}
        />
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Many of our recurring clients begin with a deep cleaning before
          transitioning to regular maintenance cleanings.
        </p>
      </Section>

      <Section title="Why Choose Golden Hour Cleaning Co.?">
        <p className="text-base leading-relaxed text-stone-700">
          We believe a truly clean home creates more space for what matters most.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Our clients choose us because we&apos;re known for:
        </p>
        <BulletList
          items={[
            "Friendly, professional cleaners",
            "Meticulous attention to detail",
            "Reliable communication",
            "Respect for your home and belongings",
            "Consistent, high-quality results",
            "Convenient online booking",
            "Transparent pricing with no hidden fees",
          ]}
        />
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Our goal isn&apos;t just to clean your home—it&apos;s to leave it
          feeling lighter, healthier, and more enjoyable to live in.
        </p>
      </Section>

      <Section title="Areas We Serve">
        <p className="text-base leading-relaxed text-stone-700">
          Golden Hour Cleaning Co. proudly provides deep house cleaning services
          throughout:
        </p>
        <BulletList items={PORTLAND_METRO_AREAS} />
      </Section>

      <Section title="Frequently Asked Questions">
        <div className="mt-4 space-y-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <FaqItem
            question="How long does a deep cleaning take?"
            answer="Every home is different. The time depends on the size of your home and its current condition. When you request a quote through our website, we'll provide an estimate based on your home's details."
          />
          <FaqItem
            question="Do I need to be home during the cleaning?"
            answer="Not at all. Many of our clients provide secure access while they're away. We'll coordinate the details with you before your appointment."
          />
          <FaqItem
            question="Do you bring your own cleaning supplies?"
            answer="Yes. Our team arrives fully equipped with professional-grade cleaning products and equipment. If you have specific product preferences, just let us know."
          />
          <FaqItem
            question="How often should I schedule a deep cleaning?"
            answer="Many homeowners schedule a deep cleaning once or twice a year. Others begin with a deep cleaning and then maintain their home with recurring standard cleaning services."
          />
        </div>
      </Section>

      <Section title="Get an Instant Quote & Book Online">
        <p className="text-base leading-relaxed text-stone-700">
          Ready to give your home the attention it deserves?
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Golden Hour Cleaning Co. makes it easy to get started. Simply click
          below to receive an instant quote and book your deep cleaning online at
          a time that works for you.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Prefer to speak with someone? Our friendly Golden Hour Cleaning Co.
          team is happy to answer your questions, discuss your cleaning needs,
          and help you choose the service that&apos;s right for your home. Call{" "}
          <a
            href={`tel:${CONTACT.phone}`}
            className="font-medium text-stone-900 underline underline-offset-2 hover:text-stone-700"
          >
            (503) 893-4795
          </a>
          .
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Whether you book online or give us a call, we&apos;re here to make the
          process simple, transparent, and stress-free.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          We proudly provide professional deep cleaning services throughout
          Portland, OR and the surrounding Portland metro area, delivering
          exceptional attention to detail and dependable service with every
          visit.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={quoteHref}
            className={`${BTN_UPPER} inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
          >
            Get a quote for Deep Clean
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
