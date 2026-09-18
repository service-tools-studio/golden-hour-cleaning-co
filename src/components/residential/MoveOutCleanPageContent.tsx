import type { ReactNode } from "react";
import Link from "next/link";
import { CONTACT } from "@/constants.js";
import { RESIDENTIAL_SERVICES } from "@/data/residentialServices";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/helpers/typography.js";
import ServiceDetailHero from "./ServiceDetailHero";
import MoveOutCleanChecklist from "./MoveOutCleanChecklist";
import {
  HOURLY_CHARGE_FAQ,
  MOVE_OUT_PRICING_FAQ,
  SUPPLIES_FAQ,
  siteFaq,
} from "@/data/siteFaqs";
import { BulletList, FaqItem, PORTLAND_METRO_AREAS, Section } from "./servicePageParts";

export default function MoveOutCleanPageContent({
  quoteHref,
}: {
  quoteHref: string;
  afterHero?: ReactNode;
}) {
  const service = RESIDENTIAL_SERVICES["move-out"];

  return (
    <>
      <ServiceDetailHero
        serviceSlug="move-out"
        tagline="Most intensive"
        title="Move-In & Move-Out Cleaning Services in Portland, OR"
        intro="Our move-in/out cleaning is a detailed empty-home reset—so you can hand over keys or settle in with a truly clean start."
        imageSrc="/assets/move-out-shutters.jpg"
        imageAlt="A Golden Hour cleaner smiling while wiping white shutters during a move-out clean"
        imageClassName="object-cover object-center"
        includedItems={service.items}
        checklistHref="/move-out-clean/whats-included"
        quoteHref={quoteHref}
      />

      <Section title="Professional Move-In & Move-Out Cleaning for a Fresh Start">
        <p className="text-base leading-relaxed text-stone-700">
          Moving is stressful enough without having to worry about cleaning.
          Whether you&apos;re preparing to leave your current home or getting
          ready to settle into a new one, Golden Hour Cleaning Co. provides
          thorough move-in and move-out cleaning services throughout Portland,
          OR and the surrounding communities.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Our detailed cleaning service helps leave your home fresh, clean, and
          ready for its next chapter. We use eco-friendly products whenever possible. Stronger
          conventional products may be used when heavy buildup requires it. Whether
          you&apos;re a homeowner, renter, landlord, property manager, or real estate
          professional, we&apos;re here to make moving a little easier.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Request a personalized quote and book your cleaning directly on our website,
          or give us a call to speak with a friendly Golden Hour Cleaning Co.
          representative. We&apos;ll confirm your final price after a quick
          walkthrough.
        </p>
      </Section>

      <Section id="whats-included" title="What's Included in Our Move-In & Move-Out Cleaning?">
        <MoveOutCleanChecklist />
      </Section>

      <Section title="Designed for Empty Homes">
        <p className="text-base leading-relaxed text-stone-700">
          Our move-in and move-out cleaning is intended for homes that are vacant
          or nearly empty, allowing us to access areas that are difficult to
          reach during occupied cleanings.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          This service is ideal for:
        </p>
        <BulletList
          items={[
            "Homeowners preparing to sell",
            "Renters moving out",
            "Families moving into a new home",
            "Property managers",
            "Landlords preparing for new tenants",
            "Real estate professionals",
          ]}
        />
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          A professionally cleaned home creates a better first impression and
          provides a fresh, welcoming space for the next occupants.
        </p>
      </Section>

      <Section title="Why Choose Golden Hour Cleaning Co.?">
        <p className="text-base leading-relaxed text-stone-700">
          We understand how important this stage of your move is. Our team
          focuses on delivering a thorough, dependable clean while making the
          process as smooth and stress-free as possible.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          When you work with Golden Hour Cleaning Co., you can expect:
        </p>
        <BulletList
          items={[
            "Friendly, professional cleaners",
            "Detailed, top-to-bottom cleaning",
            "Reliable communication",
            "Respect for your property",
            "Flexible scheduling",
            "Transparent pricing",
            "Convenient online booking",
          ]}
        />
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Our mission is to help you leave your old home with confidence—or start
          your new one with a truly fresh beginning.
        </p>
      </Section>

      <Section title="Areas We Serve">
        <p className="text-base leading-relaxed text-stone-700">
          Golden Hour Cleaning Co. proudly provides move-in and move-out cleaning
          services throughout:
        </p>
        <BulletList items={PORTLAND_METRO_AREAS} />
      </Section>

      <Section title="Frequently Asked Questions">
        <div className="mt-4 space-y-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <FaqItem {...HOURLY_CHARGE_FAQ} />
          <FaqItem {...MOVE_OUT_PRICING_FAQ} />
          <FaqItem
            {...siteFaq(
              "moveOutEmptyHome",
              "Do I need to empty the home before the cleaning?",
            )}
          />
          <FaqItem
            {...siteFaq(
              "moveOutCabinets",
              "Do you clean inside cabinets and drawers?",
            )}
          />
          <FaqItem
            {...siteFaq("moveOutOven", "Do you clean inside the oven?")}
          />
          <FaqItem
            {...siteFaq(
              "moveOutFridge",
              "Do you clean inside the refrigerator?",
            )}
          />
          <FaqItem {...SUPPLIES_FAQ} />
          <FaqItem {...siteFaq("howToGetQuote", "How do I get a quote?")} />
        </div>
      </Section>

      <Section title="Request a Personalized Quote">
        <p className="text-base leading-relaxed text-stone-700">
          Moving is a big job—let us take the cleaning off your checklist.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Golden Hour Cleaning Co. makes it easy to request a personalized quote and
          book your move-in or move-out cleaning online in just a few minutes.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Prefer to speak with someone? Our friendly Golden Hour Cleaning Co.
          representatives are happy to answer your questions, discuss your
          cleaning needs, and help you schedule the right service. Call{" "}
          <a
            href={`tel:${CONTACT.phone}`}
            data-call-source="move_out_page_phone"
            className="font-medium text-stone-900 underline underline-offset-2 hover:text-stone-700"
          >
            (503) 893-4795
          </a>
          .
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Whether you book online or give us a call, we&apos;re committed to
          providing exceptional service, dependable communication, and meticulous
          attention to detail from start to finish.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Proudly serving Portland, OR and the surrounding Portland metro area
          with professional move-in and move-out cleaning services.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={quoteHref} className={BTN_PRIMARY}>
            Get a quote for Move-In &amp; Move-Out
          </Link>
          <Link href="/residential/services" className={BTN_SECONDARY}>
            Compare all services
          </Link>
        </div>
        <p className="mt-4 text-xs text-stone-500">
          Quotes are based on your home&apos;s size and service type. Final price is confirmed after
          a quick walkthrough.
        </p>
      </Section>
    </>
  );
}
