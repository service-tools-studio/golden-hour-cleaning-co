"use client";

import Link from "next/link";
import { HEADING_UPPER } from "../../helpers/typography.js";
import FooterCitiesMenu from "./FooterCitiesMenu";
import { MARKETS } from "@/lib/markets";
import { useActiveMarket } from "@/helpers/useActiveMarket";

const footerBrandId = "footer-brand-heading";
const footerContactId = "footer-contact-heading";
const footerExploreId = "footer-explore-heading";

/** @param {{ market?: import('@/lib/markets').MarketConfig }} props */
export default function Footer({ market: pageMarket }) {
  const market = useActiveMarket(pageMarket?.id);
  const year = new Date().getFullYear();
  return (
    <footer
      id="site-footer"
      aria-labelledby={footerBrandId}
      className="bg-amber-50 border-t border-amber-200 text-amber-900"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:py-16 lg:max-w-7xl lg:py-20">
        <section aria-labelledby={footerBrandId}>
          <h2
            id={footerBrandId}
            className={`text-xl font-semibold ${HEADING_UPPER}`}
          >
            Golden Hour Cleaning Co.
          </h2>
          <p className="mt-2 text-sm text-amber-800/80 leading-relaxed">
            {market.footer.blurb} {market.footer.licenseNote}
          </p>
        </section>

        <section aria-labelledby={footerContactId}>
          <h3 id={footerContactId} className={`mb-2 font-semibold ${HEADING_UPPER}`}>
            Contact
          </h3>
          <address className="not-italic text-sm text-amber-900">
            <span className="block">{market.footer.mailingAddress.street}</span>
            <span className="block">{market.footer.mailingAddress.cityStateZip}</span>
            <a
              href={`tel:${market.contact.phoneE164}`}
              data-call-source="footer_phone"
              className="mt-1 inline-block hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
            >
              {market.contact.phoneDisplay}
            </a>
            <a
              href="mailto:golden.hour.cleaning.company@gmail.com"
              className="mt-1 block break-all hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
            >
              golden.hour.cleaning.company@gmail.com
            </a>
          </address>
          <p className="text-xs mt-3 text-amber-800/70">
            Vetted cleaning professionals
          </p>
        </section>

        <nav aria-labelledby={footerExploreId}>
          <h3 id={footerExploreId} className={`mb-2 font-semibold ${HEADING_UPPER}`}>
            Explore
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href={MARKETS.portland.path}
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                {MARKETS.portland.displayLabel} home
              </Link>
            </li>
            <li>
              <Link
                href={MARKETS.phoenix.path}
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                {MARKETS.phoenix.displayLabel} home
              </Link>
            </li>
            {market.id === "portland" ? <FooterCitiesMenu /> : null}
            <li>
              <Link
                href={market.servicesHubPath}
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Residential Services
              </Link>
            </li>
            <li>
              <a
                href="/request-a-quote"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Get a residential quote
              </a>
            </li>
            <li>
              <a
                href="/satisfaction-guarantee"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Satisfaction Guarantee
              </a>
            </li>
            <li>
              <Link
                href={market.aboutPath}
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                About Us
              </Link>
            </li>
            <li>
              <a
                href="/reviews"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Reviews
              </a>
            </li>
            <li>
              <a
                href="/blog"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="/partnerships"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Partnerships
              </a>
            </li>
            <li>
              <a
                href="/careers"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Careers
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="bg-amber-100 text-center text-sm py-4 border-t border-amber-200">
        <p>© {year} Golden Hour Cleaning Co. All rights reserved.</p>
      </div>
    </footer>
  );
}
