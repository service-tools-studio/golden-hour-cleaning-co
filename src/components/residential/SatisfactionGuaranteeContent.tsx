import Link from "next/link";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";
import { Section } from "./servicePageParts";

const STEPS = [
  {
    number: "1",
    title: "Let us know within 24 hours",
    body: "Contact us within 24 hours of your completed cleaning and tell us what needs additional attention.",
  },
  {
    number: "2",
    title: "Show us what we missed",
    body: "Let us know which areas you're concerned about. Photos are helpful when applicable and allow us to quickly understand what needs to be addressed.",
  },
  {
    number: "3",
    title: "We'll come back and make it right",
    body: "If an item included in your agreed-upon cleaning scope was missed or not completed to our standard, we'll return to re-clean the affected area at no additional charge.",
  },
];

export default function SatisfactionGuaranteeContent() {
  return (
    <>
      <h1 className={`text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
        Our Satisfaction Guarantee
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-stone-700">
        A clean you can feel confident booking.
      </p>
      <p className="mt-6 text-base leading-relaxed text-stone-700">
        We take pride in providing detailed, thoughtful cleaning and want you to
        feel confident in the service you&apos;re paying for. If something
        included in your cleaning was missed or wasn&apos;t completed to our
        standard, let us know and we&apos;ll make it right.
      </p>

      <Section title="How Our Guarantee Works">
        <div className="space-y-5 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fde68a] text-sm font-semibold text-stone-900">
                {step.number}
              </span>
              <div>
                <p className={`text-sm font-semibold text-stone-900 ${HEADING_UPPER}`}>
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-stone-700">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What's Covered?">
        <p className="text-base leading-relaxed text-stone-700">
          Our Satisfaction Guarantee applies to cleaning tasks included in the
          service you booked and agreed upon before cleaning began.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Every home is different, which is why we confirm your cleaning scope
          and final price before we begin. Our guarantee means you can feel
          confident that we&apos;ll stand behind the work we&apos;ve agreed to
          perform.
        </p>
      </Section>

      <Section title="A Few Important Details">
        <p className="text-base leading-relaxed text-stone-700">
          Our Satisfaction Guarantee is a{" "}
          <strong>re-clean guarantee</strong>, rather than a refund guarantee.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Requests must be made within 24 hours of service so we&apos;re able to
          fairly assess and address the concern. The guarantee applies to items
          included in your original cleaning scope and does not cover areas or
          services that were excluded, inaccessible, or not part of the booked
          service.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Some permanent staining, damage, discoloration, wear, mineral buildup,
          mold, or other conditions may not be fully removable through
          professional cleaning. We&apos;ll always do our best and communicate
          with you when we encounter something that cleaning alone cannot
          resolve.
        </p>
      </Section>

      <Section title="We Want You to Love Your Clean Home">
        <p className="text-base leading-relaxed text-stone-700">
          We&apos;re not interested in simply checking a job off the schedule. We
          want you to walk into your space and feel the difference.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          If we&apos;ve missed something we agreed to clean, give us the
          opportunity to make it right. That&apos;s our promise.
        </p>
        <p className="mt-4 text-base font-semibold leading-relaxed text-stone-900">
          Ready for a fresh start?
        </p>
        <div className="mt-8">
          <Link
            href="/residential/services#quote"
            className={`${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
          >
            Get an Instant Quote + Book
          </Link>
        </div>
      </Section>
    </>
  );
}
