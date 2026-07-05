"use client";

import Link from "next/link";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import StandardCleanPageContent from "@/components/residential/StandardCleanPageContent";
import DeepCleanPageContent from "@/components/residential/DeepCleanPageContent";
import MoveOutCleanPageContent from "@/components/residential/MoveOutCleanPageContent";
import { BackToServicesLink } from "@/components/residential/servicePageParts";
import type { ResidentialService } from "@/data/residentialServices";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";

function GenericServiceContent({ service }: { service: ResidentialService }) {
  return (
    <>
      <BackToServicesLink />
      <p className="text-sm font-medium text-stone-500">{service.price}</p>
      <h1 className={`mt-1 text-3xl md:text-4xl ${HEADING_UPPER}`}>
        {service.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-700">
        {service.overview}
      </p>

      <section className="mt-10 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <h2 className={`text-lg font-semibold ${HEADING_UPPER}`}>
          What&apos;s included
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-stone-700">
          {service.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="text-amber-600">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <h2 className={`text-lg font-semibold ${HEADING_UPPER}`}>
          Best for
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-stone-700">
          {service.bestFor.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="text-amber-600">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function ServiceDetailClient({
  service,
}: {
  service: ResidentialService;
}) {
  const quoteHref = `/residential/services?level=${encodeURIComponent(service.levelKey)}#quote`;

  const richContent =
    service.slug === "standard" ? (
      <StandardCleanPageContent quoteHref={quoteHref} />
    ) : service.slug === "deep" ? (
      <DeepCleanPageContent quoteHref={quoteHref} />
    ) : service.slug === "move-out" ? (
      <MoveOutCleanPageContent quoteHref={quoteHref} />
    ) : null;

  return (
    <>
      <ServicesPageHeader quoteHref={quoteHref} />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          {richContent ?? (
            <>
              <GenericServiceContent service={service} />
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={quoteHref}
                  className={`${BTN_UPPER} inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
                >
                  Get a quote for {service.title}
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
                add-ons. Final price is confirmed during your in-home
                walkthrough.
              </p>
            </>
          )}
        </article>

        <Footer />
      </main>
    </>
  );
}
