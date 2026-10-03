import Link from "next/link";
import { CONTACT } from "@/constants.js";
import { HEADING_UPPER } from "@/helpers/typography.js";

/**
 * Compact footer for PPC landings — trust + contact, minimal exits.
 */
export default function PpcLandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className="border-t border-amber-200 bg-amber-50 text-amber-900"
    >
      <div className="mx-auto max-w-3xl px-4 py-10 text-center md:px-6 md:py-12">
        <h2 className={`text-xl font-semibold ${HEADING_UPPER}`}>
          Golden Hour Cleaning Co.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-amber-800/80">
          Meticulous care and eco-friendly products for Portland homes. Licensed
          in Oregon.
        </p>

        <p className="mt-5 text-sm">
          <a
            href={`tel:${CONTACT.phone}`}
            data-call-source="ppc_footer_phone"
            className="font-semibold text-amber-950 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
          >
            (503) 893-4795
          </a>
          <span className="mx-2 text-amber-700/50" aria-hidden>
            ·
          </span>
          <a
            href={`mailto:${CONTACT.email}`}
            className="break-all text-amber-900 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
          >
            {CONTACT.email}
          </a>
        </p>

        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
          <Link
            href="/satisfaction-guarantee"
            className="font-semibold text-amber-950 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
          >
            Satisfaction Guarantee
          </Link>
        </p>

        <p className="mt-4 text-sm text-amber-800/80">
          <Link
            href="/residential/services"
            className="underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
          >
            Compare residential cleaning services →
          </Link>
        </p>
      </div>

      <div className="border-t border-amber-200 bg-amber-100 py-4 text-center text-sm">
        <p>© {year} Golden Hour Cleaning Co. All rights reserved.</p>
      </div>
    </footer>
  );
}
