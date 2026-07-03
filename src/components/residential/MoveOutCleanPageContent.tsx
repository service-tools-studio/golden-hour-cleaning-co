import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/constants.js";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";
import { BulletList, FaqItem, PORTLAND_METRO_AREAS, Section } from "./servicePageParts";

export default function MoveOutCleanPageContent({
  quoteHref,
}: {
  quoteHref: string;
}) {
  return (
    <>
      <p className="text-sm font-medium text-stone-500">
        ~$0.46/sq ft • most intensive
      </p>
      <h1 className={`mt-1 text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
        Move-In &amp; Move-Out Cleaning Services in Portland, OR
      </h1>

      <figure className="mt-6 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
        <div className="relative aspect-[3/4] w-full bg-stone-100 sm:aspect-[4/5]">
          <Image
            src="/assets/move-out-clean.png"
            alt="Golden Hour cleaner wiping inside an empty kitchen cabinet during a move-out cleaning"
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover object-top"
            priority
          />
        </div>
      </figure>

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
          ready for its next chapter. Whether you&apos;re a homeowner, renter,
          landlord, property manager, or real estate professional, we&apos;re here
          to make moving a little easier.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Get an instant quote and book your cleaning directly on our website,
          or give us a call to speak with a friendly Golden Hour Cleaning Co.
          representative.
        </p>
      </Section>

      <Section title="What's Included in Our Move-In & Move-Out Cleaning?">
        <p className="text-base leading-relaxed text-stone-700">
          Our move-in and move-out cleaning is one of our most detailed services,
          designed to clean areas that are often overlooked during routine
          housekeeping.
        </p>

        <div className="mt-6 space-y-6 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Kitchen
            </h3>
            <BulletList
              items={[
                "Clean inside and outside of cabinets and drawers",
                "Clean countertops and backsplash",
                "Clean sink and faucet",
                "Clean stovetop",
                "Clean inside and outside of the oven",
                "Clean inside and outside of the microwave",
                "Clean exterior of appliances",
                "Wipe doors, trim, and baseboards",
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
                "Remove soap scum and mineral buildup",
                "Clean and disinfect toilets",
                "Clean sinks and countertops",
                "Polish mirrors and fixtures",
                "Clean inside cabinets and drawers",
                "Wipe doors, trim, and baseboards",
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
                "Dust baseboards, trim, and window sills",
                "Spot clean walls as needed",
                "Clean doors and door frames",
                "Clean light switches",
                "Vacuum carpets and hard-to-reach edges",
                "Mop hard floors",
                "Remove cobwebs",
              ]}
            />
          </div>

          <div>
            <h3 className={`text-base font-semibold ${HEADING_UPPER}`}>
              Throughout the Home
            </h3>
            <BulletList
              items={[
                "Dust ceiling fans (within reach)",
                "Dust vents (within reach)",
                "Clean baseboards throughout",
                "Clean window sills and tracks",
                "Spot clean walls",
                "Wipe doors and trim",
                "Vacuum closets",
                "Vacuum under accessible areas",
                "Mop all hard flooring",
              ]}
            />
          </div>
        </div>
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
          <FaqItem
            question="Do I need to empty the home before the cleaning?"
            answer="For the most thorough results, we recommend the home be completely empty or nearly empty before our arrival. This allows us to clean every accessible surface efficiently."
          />
          <FaqItem
            question="Do you clean inside cabinets and drawers?"
            answer="Yes. For move-in and move-out cleanings, we clean the interiors of empty cabinets and drawers."
          />
          <FaqItem
            question="Do you clean inside the oven?"
            answer="Yes. Cleaning the inside of the oven is included in our move-in and move-out cleaning service."
          />
          <FaqItem
            question="Do you clean inside the refrigerator?"
            answer="Yes. Cleaning the inside of the refrigerator is included in our move-in and move-out cleaning service."
          />
          <FaqItem
            question="How do I get a quote?"
            answer="Simply visit our website to receive an instant quote and book your cleaning online. If you'd rather speak with someone, our Golden Hour Cleaning Co. team is happy to answer your questions and help schedule your service."
          />
        </div>
      </Section>

      <Section title="Get an Instant Quote & Book Online">
        <p className="text-base leading-relaxed text-stone-700">
          Moving is a big job—let us take the cleaning off your checklist.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Golden Hour Cleaning Co. makes it easy to receive an instant quote and
          book your move-in or move-out cleaning online in just a few minutes.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Prefer to speak with someone? Our friendly Golden Hour Cleaning Co.
          representatives are happy to answer your questions, discuss your
          cleaning needs, and help you schedule the right service. Call{" "}
          <a
            href={`tel:${CONTACT.phone}`}
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
          <Link
            href={quoteHref}
            className={`${BTN_UPPER} inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
          >
            Get a quote for Move-In &amp; Move-Out
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
