import type { ReactNode } from "react";
import Link from "next/link";
import { CONTACT } from "@/constants.js";
import { RESIDENTIAL_SERVICES } from "@/data/residentialServices";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/helpers/typography.js";
import DeepCleanChecklist from "./DeepCleanChecklist";
import ServiceDetailHero from "./ServiceDetailHero";
import {
  BulletList,
  FaqItem,
  HOURLY_CHARGE_FAQ,
  PORTLAND_METRO_AREAS,
  Section,
} from "./servicePageParts";

export default function DeepCleanPageContent({
  quoteHref,
}: {
  quoteHref: string;
  afterHero?: ReactNode;
}) {
  const service = RESIDENTIAL_SERVICES.deep;

  return (
    <>
      <ServiceDetailHero
        serviceSlug="deep"
        tagline="Full-home reset"
        title="Deep House Cleaning Services in Portland, OR"
        intro="Our deep cleaning service is perfect when your home needs a fresh start. We get into the details so you can enjoy a clean that feels brand new."
        imageSrc="/assets/careful-cleaner.png"
        imageAlt="Golden Hour cleaner smiling while holding supplies in a bright kitchen"
        includedItems={service.items}
        checklistHref="/deep-clean/whats-included"
        quoteHref={quoteHref}
      />

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
          feeling refreshed from top to bottom. We use eco-friendly products
          whenever possible. Stronger conventional products may be used when
          heavy buildup requires it.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Request a personalized quote and book your cleaning directly on our
          website—no phone call required. We&apos;ll confirm your final price
          after a quick walkthrough.
        </p>
      </Section>

      <Section
        id="whats-included"
        title="What's Included in Our Deep Cleaning Service?"
      >
        <DeepCleanChecklist />
      </Section>

      <Section title="What Makes a Deep Clean Different from a Standard Clean?">
        <p className="text-base leading-relaxed text-stone-700">
          Standard cleaning is reserved for recurring customers or homes
          professionally cleaned within the past 2–4 weeks — it maintains a home
          that&apos;s already in good shape.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          A deep cleaning goes much further by focusing on the detailed areas
          that often get overlooked during routine cleaning. It&apos;s the ideal
          choice if:
        </p>
        <BulletList
          items={[
            "Your home hasn't been professionally cleaned in over a month",
            "You're preparing to begin recurring cleaning service",
            "You're hosting family or guests",
            "You're moving into a home",
            "You simply want your home feeling refreshed and reset",
          ]}
        />
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Many of our recurring clients begin with a deep cleaning before
          transitioning to regular standard maintenance cleanings.
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
            question={HOURLY_CHARGE_FAQ.question}
            answer={HOURLY_CHARGE_FAQ.answer}
          />
          <FaqItem
            question="How is deep cleaning priced?"
            answer="You can request a personalized quote online based on your home's size and condition. We confirm your final price after a quick walkthrough."
          />
          <FaqItem
            question="How long does a deep cleaning take?"
            answer="On-site time varies with your home's size and condition. We schedule enough cleaners to keep visits efficient (typically up to about 4 hours on site), and you'll see a time estimate with your quote."
          />
          <FaqItem
            question="Do I need to be home during the cleaning?"
            answer="Not at all. Many of our clients provide secure access while they're away. We'll coordinate the details with you before your appointment."
          />
          <FaqItem
            question="Do you bring your own cleaning supplies?"
            answer="Yes. We use eco-friendly products whenever possible. For heavy buildup, stronger conventional products may be used when needed. Our team arrives fully equipped with professional-grade cleaning products and equipment. If you have specific product preferences, just let us know."
          />
          <FaqItem
            question="How often should I schedule a deep cleaning?"
            answer="Many homeowners schedule a deep cleaning once or twice a year. Others begin with a deep cleaning and then maintain their home with recurring standard cleaning services."
          />
        </div>
      </Section>

      <Section title="Request a Personalized Quote">
        <p className="text-base leading-relaxed text-stone-700">
          Ready to give your home the attention it deserves?
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Golden Hour Cleaning Co. makes it easy to get started. Simply click
          below to request a personalized quote and book your deep cleaning
          online at a time that works for you.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Prefer to speak with someone? Our friendly Golden Hour Cleaning Co.
          team is happy to answer your questions, discuss your cleaning needs,
          and help you choose the service that&apos;s right for your home. Call{" "}
          <a
            href={`tel:${CONTACT.phone}`}
            data-call-source="deep_clean_page_phone"
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
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={quoteHref} className={BTN_PRIMARY}>
            Get a quote for Deep Clean
          </Link>
          <Link href="/residential/services" className={BTN_SECONDARY}>
            Compare all services
          </Link>
        </div>
        <p className="mt-4 text-xs text-stone-500">
          Quotes are based on your home&apos;s size and service type. Final
          price is confirmed after a quick walkthrough.
        </p>
      </Section>
    </>
  );
}
