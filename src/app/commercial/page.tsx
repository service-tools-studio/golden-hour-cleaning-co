import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CommercialLeadForm from "@/components/commercial/CommercialLeadForm";

export const metadata: Metadata = {
  title: "Commercial Cleaning | Golden Hour Cleaning Co.",
  description:
    "Premium, eco-minded cleaning for offices, studios, and small commercial spaces in the Portland metro area.",
};

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      {/* brand accent */}
      <div className="mb-4 h-1 w-10 rounded-full bg-brand/80" />
      <h3 className="text-sm font-semibold tracking-tight text-stone-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{desc}</p>
    </div>
  );
}

export default function CommercialPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-6 pt-4 pb-12 sm:pt-6 sm:pb-16">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: back + logo */}
          <div className="flex items-center gap-4 leading-none">
            <Link
              href="/"
              className="text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
            >
              ← Back
            </Link>

            <div className="hidden sm:flex items-center h-[100px]">
              <Image
                src="/assets/Golden Hour - commercial.png"
                alt="Golden Hour Cleaning Co."
                width={200}
                height={100}
                priority
                className="block"
              />
            </div>
          </div>

          {/* Right: nav + CTA */}
          <div className="hidden sm:flex items-center gap-3 pt-1">
            <Link
              href="/residential"
              className="text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
            >
              Residential
            </Link>
            <a
              href="#request-quote"
              className="rounded-2xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 ring-1 ring-brand/40 hover:ring-brand/70"
            >
              Request a quote
            </a>
          </div>
        </div>

        {/* Hero */}
        <header className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Commercial cleaning for{" "}
            <span className="relative inline-block">
              calm, well-run spaces
              <span className="pointer-events-none absolute -bottom-1 left-0 h-[7px] w-full rounded-full bg-brand/60" />
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Premium, eco-minded cleaning for offices, studios, and small commercial
            spaces in the Portland metro area. Consistency-first service with clear
            communication and dependable results.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#request-quote"
              className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 ring-1 ring-brand/40 hover:ring-brand/70"
            >
              Request a commercial quote
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              How it works
            </a>
          </div>
        </header>

        {/* Brand background section (subtle, premium) */}
        <section className="mt-12 rounded-[32px] border border-brand/30 bg-brand/20 p-6 sm:p-8">
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight text-stone-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Premium, consistency-first commercial cleaning
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              We’re built for long-term partnerships—clear scope, repeatable checklists,
              and a reliable cadence. Your team walks into a space that feels calm,
              professional, and cared for.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              Best for teams that value{" "}
              <span className="font-semibold text-stone-900">quality, communication,</span>{" "}
              and{" "}
              <span className="font-semibold text-stone-900">steady standards</span>
            </p>

            {/* Divider */}
            <div className="mt-6 h-px w-full bg-brand/30" />

            {/* Ideal spaces */}
            <div className="mt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-stone-600">
                Ideal for spaces like
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <MiniPill>Professional offices</MiniPill>
                <MiniPill>Wellness studios</MiniPill>
                <MiniPill>Therapy & counseling offices</MiniPill>
                <MiniPill>Medical-adjacent clinics</MiniPill>
                <MiniPill>Boutique coworking spaces</MiniPill>
                <MiniPill>Creative studios</MiniPill>
                <MiniPill>Retail boutiques</MiniPill>
                <MiniPill>Showrooms & galleries</MiniPill>
                <MiniPill>Property-managed common areas</MiniPill>
                <MiniPill>Boutique fitness studios</MiniPill>
              </div>
            </div>
          </div>
        </section>


        {/* Trust / clarity cards */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Card
            title="Consistency-first"
            desc="A reliable team, clear expectations, and repeatable results—so your space stays steady week after week."
          />
          <Card
            title="Eco-minded"
            desc="Thoughtful products and methods that support a clean space without harsh residue or overwhelming scent."
          />
          <Card
            title="Professional communication"
            desc="Simple scheduling, fast response times, and proactive updates when anything needs attention."
          />
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mt-12 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm"
        >
          <h2 className="text-lg font-semibold tracking-tight text-stone-900 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" />
            How it works
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Step n="1" title="Submit details" desc="Tell us about your space and what you need." />
            <Step n="2" title="Confirm fit" desc="We review scope, access, and cadence." />
            <Step n="3" title="Walkthrough (if needed)" desc="Quick onsite to finalize scope and pricing." />
            <Step n="4" title="Start with consistency" desc="A reliable team + clear checklist." />
          </div>
        </section>

        {/* Form */}
        <section id="request-quote" className="mt-12">
          <CommercialLeadForm />
        </section>

        {/* Subtle footer divider using brand */}
        <div className="mt-12 h-px w-full bg-brand opacity-40" />
        <footer className="mt-6 text-xs text-stone-500">
          Serving the Portland metro area • Commercial service availability varies
          by location and schedule
        </footer>
      </div>
    </main>
  );
}

function Step({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-stone-900 shadow-sm ring-1 ring-brand/30">
          {n}
        </div>
        <div className="text-sm font-semibold text-stone-900">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">{desc}</p>
    </div>
  );
}

function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand/30 bg-white/70 px-4 py-3 text-sm font-semibold text-stone-800 shadow-sm">
      {children}
    </div>
  );
}
