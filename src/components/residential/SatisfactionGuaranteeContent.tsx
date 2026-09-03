import Link from "next/link";
import { SEE_PRICING_BOOK_LABEL } from "@/helpers/ctaLabels.js";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";
import { Section } from "./servicePageParts";

const STEPS = [
  {
    number: "1",
    title: "We clean your home",
    body: "Our team completes the cleaning according to the service and scope agreed upon before we begin.",
  },
  {
    number: "2",
    title: "We walk through the finished clean with you",
    body: "If you're available, we'll invite you to take a look through your home with us before we leave. If you notice something we missed, just point it out and we'll take care of it.",
  },
  {
    number: "3",
    title: "We charge you once you're satisfied",
    body: "Your card isn't charged until the cleaning is complete and you're satisfied with the work we've performed.",
  },
  {
    number: "4",
    title: "You're still covered for 24 hours",
    body: "Sometimes you don't notice the little things until later. If you discover something included in your cleaning that was missed, contact us within 24 hours of service.",
  },
  {
    number: "5",
    title: "We'll make it right",
    body: "If an item included in your agreed-upon cleaning scope was missed or wasn't completed to our standard, we'll return to re-clean the affected area at no additional charge.",
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
      <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-700">
        <p>
          We take pride in providing detailed, thoughtful cleaning and want you to
          feel confident in the service you&apos;re paying for.
        </p>
        <p>
          That&apos;s why we don&apos;t simply finish the cleaning and leave.
          Whenever you&apos;re available, we&apos;ll walk through your home with
          you after the cleaning is complete so you can see the results and let us
          know if anything needs additional attention.
        </p>
        <p className="font-semibold text-stone-900">
          We don&apos;t charge your card until you&apos;re satisfied with the
          completed cleaning.
        </p>
        <p>
          And because we know you may notice something later, our guarantee
          doesn&apos;t end when we walk out the door. You&apos;ll still have{" "}
          <strong>24 hours after your cleaning</strong> to let us know if something
          included in your service was missed.
        </p>
      </div>

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
          perform — even after we&apos;ve left your home.
        </p>
      </Section>

      <Section title="A Few Important Details">
        <p className="text-base leading-relaxed text-stone-700">
          Our Satisfaction Guarantee is a{" "}
          <strong>re-clean guarantee</strong>, rather than a refund guarantee.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Requests for re-cleaning must be made within 24 hours of service so
          we&apos;re able to fairly assess and address the concern. The guarantee
          applies to items included in your original cleaning scope and does not
          cover areas or services that were excluded, inaccessible, or not part of
          the booked service.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Some permanent staining, damage, discoloration, wear, mineral buildup,
          mold, or other conditions may not be fully removable through
          professional cleaning. We&apos;ll always do our best and communicate
          with you when we encounter something that cleaning alone cannot
          resolve.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          If you&apos;re not available for a walkthrough when your cleaning is
          complete, <strong>your 24-hour Satisfaction Guarantee still applies.</strong>
        </p>
      </Section>

      <Section title="We Want You to Love Your Clean Home">
        <p className="text-base leading-relaxed text-stone-700">
          We&apos;re not interested in simply checking a job off the schedule. We
          want you to walk into your space and feel the difference.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          From the final walkthrough to the following 24 hours, you have an
          opportunity to make sure we&apos;ve delivered the cleaning we promised.
        </p>
        <p className="mt-4 text-base font-semibold leading-relaxed text-stone-900">
          If we&apos;ve missed something we agreed to clean, give us the
          opportunity to make it right. That&apos;s our promise.
        </p>
        <p className="mt-6 text-base font-semibold leading-relaxed text-stone-900">
          Ready for a fresh start?
        </p>
        <div className="mt-8">
          <Link
            href="/residential/services#services"
            className={`${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
          >
            {SEE_PRICING_BOOK_LABEL}
          </Link>
        </div>
      </Section>
    </>
  );
}
