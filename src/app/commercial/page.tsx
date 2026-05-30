import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarCheck2,
  Handshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import CommercialLeadForm from "@/components/commercial/CommercialLeadForm";
import Footer from "@/components/residential/Footer";
import { BTN_UPPER } from "@/helpers/typography.js";

export const metadata: Metadata = {
  title: "Commercial Cleaning | Golden Hour Cleaning Co.",
  description:
    "Reliable, high-quality commercial cleaning for offices, studios, and boutique businesses in Portland.",
};

const spaces = [
  "Office buildings & suites",
  "Retail boutiques",
  "Wellness studios",
  "Salons & spas",
  "Showrooms & galleries",
  "Therapy & counseling offices",
  "Medical-adjacent clinics",
  "Creative studios",
  "Property-managed common areas",
  "Boutique fitness studios",
];

function Feature({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-black/5 bg-[#a7eff1]/20 p-6 backdrop-blur-sm shadow-sm hover:-translate-y-1 transition">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a7eff1]/50 text-stone-900">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-stone-900">
        {title}
      </h3>
      <p className="mt-2 text-stone-700 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function CommercialPage() {
  return (
    <>
      <main className="min-h-screen bg-[#fffbea] text-stone-900 overflow-hidden">
        <header className="w-full border-b border-amber-200 bg-brand">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-6 sm:pt-6">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" aria-label="Go to homepage" className="shrink-0">
                <Image
                  src="/assets/Golden Hour - commercial.png"
                  alt="Golden Hour Cleaning Co."
                  width={200}
                  height={100}
                  priority
                  className="h-[100px] sm:h-[100px] w-auto cursor-pointer"
                  sizes="(max-width: 640px) 260px, 360px"
                />
              </Link>

              <div className="flex shrink-0 items-center gap-3">
                <a
                  href="tel:+15038934795"
                  className={`rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50 ${BTN_UPPER}`}
                >
                  Call now
                </a>
                <a
                  href="#request-quote"
                  className={`rounded-2xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 ring-1 ring-brand/40 hover:ring-brand/70 ${BTN_UPPER}`}
                >
                  Request a quote
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#dcbb52]/15 via-[#fffbea] to-[#a7eff1]/20" />

          <div className="relative mx-auto max-w-7xl px-6 py-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex rounded-full bg-[#dcbb52]/20 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-stone-800">
                  Locally owned • Loving • Reliable
                </div>

                <h1 className="mt-6 text-4xl sm:text-5xl font-semibold leading-[0.95] tracking-tight">
                  Commercial cleaning that feels{" "}
                  <span className="text-[#dcbb52]">warm, polished,</span>{" "}
                  and dependable.
                </h1>

                <p className="mt-6 text-lg text-stone-700 max-w-xl leading-relaxed">
                  Professional commercial cleaning that reflects the love and care
                  you put into your business. Consistent, trustworthy, and
                  detail-oriented service for spaces that deserve to shine.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#request-quote"
                    className={`rounded-full bg-stone-900 px-8 py-4 text-white font-semibold shadow-lg ${BTN_UPPER}`}
                  >
                    Request a Free Quote
                  </a>

                  <a
                    href="#spaces"
                    className={`rounded-full border border-stone-300 bg-white px-8 py-4 font-semibold ${BTN_UPPER}`}
                  >
                    Spaces We Serve
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-5 rounded-[3rem] bg-[#dcbb52]/20 blur-3xl" />

                <div className="relative overflow-hidden rounded-[3rem] border border-black/5 shadow-2xl">
                  <Image
                    src="/assets/commercial-cleaning-office.png"
                    alt="Commercial office cleaning"
                    width={1200}
                    height={800}
                    className="h-[560px] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#a7eff1]/40 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Feature
                icon={<ShieldCheck className="h-6 w-6" strokeWidth={1.75} />}
                title="Reliable & Consistent"
                desc="You can count on us to show up, follow through, and deliver every time."
              />
              <Feature
                icon={<Sparkles className="h-6 w-6" strokeWidth={1.75} />}
                title="High‑Quality Cleaning"
                desc="Detailed, thorough cleaning that creates a fresh and welcoming environment."
              />
              <Feature
                icon={<Handshake className="h-6 w-6" strokeWidth={1.75} />}
                title="Trusted Professionals"
                desc="Respectful, dependable team members who care for your business like their own."
              />
              <Feature
                icon={<CalendarCheck2 className="h-6 w-6" strokeWidth={1.75} />}
                title="Flexible Solutions"
                desc="Customized cleaning schedules designed around your business needs."
              />
            </div>
          </div>
        </section>

        <section id="spaces" className="py-24">
          <div className="mx-auto max-w-7xl px-6 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[40px] bg-white p-10 shadow-xl border border-black/5">
              <p className="uppercase tracking-[0.25em] text-[#dcbb52] font-bold text-sm">
                Spaces we serve
              </p>

              <h2 className="mt-4 text-3xl font-semibold">
                Commercial spaces that value quality.
              </h2>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {spaces.map((space) => (
                  <div
                    key={space}
                    className="rounded-2xl bg-[#fffbea] border border-[#dcbb52]/20 px-4 py-4 font-medium"
                  >
                    ✓ {space}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[40px] bg-[#dcbb52] p-10 text-stone-900 shadow-xl">
              <p className="uppercase tracking-[0.25em] font-bold text-sm">
                Local & Professional
              </p>

              <h3 className="mt-4 text-4xl font-semibold leading-tight">
                We care about the businesses that make Portland thrive.
              </h3>

              <p className="mt-6 text-lg leading-relaxed">
                Golden Hour Cleaning Co. is locally owned and deeply committed to
                creating spaces that feel calm, polished, and welcoming.
              </p>

              <div className="mt-10 rounded-[32px] bg-white/70 p-6">
                <div className="font-semibold text-xl">
                  Let’s create a clean space for your business.
                </div>
                <p className="mt-2">
                  Request a free quote and we’ll tailor a plan for your space.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="request-quote"
          className="mx-auto max-w-6xl px-6 pb-24"
        >
          <div className="rounded-[48px] bg-white border border-black/5 shadow-2xl p-8 sm:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold">
                Ready for a cleaner, calmer business?
              </h2>
              <p className="mt-3 text-stone-600">
                Tell us about your space and we’ll send a custom quote.
              </p>
            </div>

            <CommercialLeadForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
