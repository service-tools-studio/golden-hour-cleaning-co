import type { Metadata } from "next";
import Link from "next/link";
import { HEADING_UPPER } from "@/helpers/typography.js";

export const metadata: Metadata = {
  title: "Internal tools | Golden Hour Cleaning Co.",
  robots: {
    index: false,
    follow: false,
  },
};

const INTERNAL_TOOLS = [
  {
    href: "/internal/quote-calculator",
    title: "Quote calculator",
    description:
      "Residential Instant Quote + Book flow preserved for reference while the live CTA is updated.",
  },
  {
    href: "/internal/calendar-details",
    title: "Calendar details",
    description:
      "Paste a Calendly URL or utm_content payload to decode quote details from a booking.",
  },
] as const;

export default function InternalIndexPage() {
  return (
    <main className="min-h-screen bg-amber-50 text-stone-900">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#dcbb52]">
          Internal
        </p>
        <h1 className={`mt-3 text-3xl md:text-4xl ${HEADING_UPPER}`}>
          Tools
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Not linked from the public site. For team use only.
        </p>

        <nav aria-label="Internal tools" className="mt-10">
          <ul className="space-y-4">
            {INTERNAL_TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="block rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                >
                  <h2
                    className={`text-lg font-semibold text-stone-900 ${HEADING_UPPER}`}
                  >
                    {tool.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {tool.description}
                  </p>
                  <p className="mt-3 font-mono text-xs text-stone-500">
                    {tool.href}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
