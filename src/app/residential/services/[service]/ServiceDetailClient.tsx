"use client";

import { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import StandardCleanPageContent from "@/components/residential/StandardCleanPageContent";
import DeepCleanPageContent from "@/components/residential/DeepCleanPageContent";
import MoveOutCleanPageContent from "@/components/residential/MoveOutCleanPageContent";
import ServiceDetailHero from "@/components/residential/ServiceDetailHero";
import type { ResidentialService } from "@/data/residentialServices";
import { SERVICES_PRICING_HREF } from "@/helpers/ctaLabels.js";
import { scrollToId } from "@/helpers/scrollToId";
import { BTN_PRIMARY, BTN_SECONDARY, HEADING_UPPER } from "@/helpers/typography.js";

function GenericServiceContent({
  service,
  quoteHref,
}: {
  service: ResidentialService;
  quoteHref: string;
}) {
  return (
    <>
      <ServiceDetailHero
        serviceSlug={service.slug}
        tagline={service.price}
        title={service.title}
        intro={service.overview}
        imageSrc="/assets/gh-cleaning-hero.webp"
        imageAlt={`${service.title} by Golden Hour Cleaning Co.`}
        includedItems={service.items}
        checklistHref="#whats-included"
        quoteHref={quoteHref}
      />

      <section
        id="whats-included"
        className="mt-10 scroll-mt-[var(--header-height,120px)] rounded-3xl border border-amber-200 bg-white p-6 shadow-sm"
      >
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
        <h2 className={`text-lg font-semibold ${HEADING_UPPER}`}>Best for</h2>
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
  const quoteHref = "/request-a-quote";

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (
      hash === "#quote" ||
      hash === "#pricing" ||
      hash === "#quote-calculator-heading"
    ) {
      scrollToId("#pricing", 8, { focus: true });
    }
  }, [service.slug]);

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
      <ServicesPageHeader quoteHref={SERVICES_PRICING_HREF} />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          {richContent ?? (
            <>
              <GenericServiceContent service={service} quoteHref={quoteHref} />
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href={quoteHref} className={BTN_PRIMARY}>
                  Get a quote for {service.title}
                </Link>
                <Link href="/residential/services" className={BTN_SECONDARY}>
                  Compare all services
                </Link>
              </div>
            </>
          )}
        </article>

        <Footer />
      </main>
    </>
  );
}
