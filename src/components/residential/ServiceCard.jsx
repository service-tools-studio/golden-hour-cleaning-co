"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HEADING_UPPER } from "../../helpers/typography.js";
import { scrollToId } from "../../helpers/scrollToId.js";

export default function ServiceCard({ service }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const detailHref = `/residential/services/${service.slug}`;

  const goToQuote = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("level", service.levelKey);
    router.replace(`${pathname}?${params.toString()}#quote`, { scroll: false });
    window.requestAnimationFrame(() => {
      scrollToId("#quote", 8, { focus: true });
    });
  };

  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm bg-white ${
        service.featured ? "border-stone-900 shadow-xl" : "border-amber-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className={`font-medium ${HEADING_UPPER}`}>{service.title}</h3>
        <span className="text-sm text-stone-500">{service.price}</span>
      </div>

      <p className="mt-2 text-sm text-stone-700">{service.desc}</p>

      <ul className="mt-4 space-y-1 text-sm text-stone-700">
        {service.items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={goToQuote}
          className="uppercase tracking-wide inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Instant Quote + Book
        </button>

        <Link
          href={detailHref}
          aria-label={`Learn more about ${service.title}`}
          className="uppercase tracking-wide inline-flex w-full items-center justify-center rounded-xl border border-[#a7eff1]/40 bg-[#a7eff1]/30 px-4 py-2 text-[#333333] hover:bg-[#a7eff1]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Learn more
        </Link>
      </div>

      <p className="mt-2 text-xs text-stone-500">
        Quotes are based on estimated square footage, service level, and add-ons.
        Final price is confirmed after a quick walkthrough.
      </p>
    </div>
  );
}
