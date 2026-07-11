"use client";

import { scrollToId } from "../../helpers/scrollToId";
import { ArrowRight, Check } from "lucide-react";

const POINTS = [
  {
    title: "Detailed Cleaning Checklists",
    desc: "We follow detailed cleaning checklists so important areas aren't overlooked.",
  },
  {
    title: "Thoughtful Communication",
    desc: "Clear communication before, during, and after your appointment.",
  },
  {
    title: "Consistent Cleaners",
    desc: "We do our best to send the same cleaner whenever possible, so your home is cared for by someone who knows it.",
  },
  {
    title: "Happiness Guarantee",
    desc: "If something isn't right, let us know within 24 hours and we'll return to make it right at no additional charge.",
  },
] as const;

export default function ClientExperienceSection() {
  return (
    <section className="bg-white px-5 py-20 md:px-10">
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#dcbb52]">
          The Golden Hour Difference
        </p>

        <h2 className="mx-auto max-w-3xl text-4xl font-semibold uppercase leading-tight tracking-[0.08em] text-[#333333] md:text-5xl">
          A Cleaning Experience Built Around{" "}
          <span className="underline decoration-[#a7eff1] decoration-[0.2em] underline-offset-[0.15em]">
            You
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#333333]/75">
          Your home isn&apos;t just another appointment on our schedule. We know
          inviting someone into your home requires trust, and we work hard to
          earn it every visit.
        </p>

        <ul className="mx-auto mt-8 grid max-w-4xl gap-4 text-left sm:grid-cols-2">
          {POINTS.map(({ title, desc }) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-2xl border border-[#dcbb52]/30 bg-[#fffbea] px-5 py-5"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#a7eff1] text-[#333333]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#333333]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#333333]/75">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scrollToId("#services", 8)}
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-[#333333] px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-[#dcbb52] hover:text-[#333333] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Explore Services
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
