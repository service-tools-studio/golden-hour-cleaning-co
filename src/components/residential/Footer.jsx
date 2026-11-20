"use client";

import { HEADING_UPPER } from "../../helpers/typography.js";
import InlineMarketLocationPicker from "@/components/markets/InlineMarketLocationPicker";
import FooterCitiesMenu from "./FooterCitiesMenu";
import FooterNavLink from "./FooterNavLink";
import { useSelectPreferredMarket } from "@/helpers/useSelectPreferredMarket";
import { useMarketPaths } from "@/helpers/useMarketPaths";

const footerBrandId = "footer-brand-heading";
const footerContactId = "footer-contact-heading";
const footerExploreId = "footer-explore-heading";

const footerLinkClass =
  "hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm";

/** @param {{ market?: import('@/lib/markets').MarketConfig }} props */
export default function Footer({ market: pageMarket }) {
  const { market, selectMarket } = useSelectPreferredMarket(pageMarket?.id);
  const { requestQuoteHref, satisfactionGuaranteeHref, reviewsHref, contactHref } =
    useMarketPaths(pageMarket?.id);
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
          <InlineMarketLocationPicker
            value={market.id}
            onChange={selectMarket}
            className="mt-3 justify-start text-left"
            menuAlign="start"
          />
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
            <FooterNavLink
              href={contactHref}
              className={`mt-2 block ${footerLinkClass}`}
            >
              💌 Contact Form
            </FooterNavLink>
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
            {market.id === "portland" ? <FooterCitiesMenu /> : null}
            <li>
              <FooterNavLink
                href={market.servicesHubPath}
                className={footerLinkClass}
              >
                Residential Services
              </FooterNavLink>
            </li>
            <li>
              <FooterNavLink
                href={requestQuoteHref}
                className={footerLinkClass}
              >
                Get a residential quote
              </FooterNavLink>
            </li>
            <li>
              <FooterNavLink
                href={satisfactionGuaranteeHref}
                className={footerLinkClass}
              >
                Satisfaction Guarantee
              </FooterNavLink>
            </li>
            <li>
              <FooterNavLink href={market.aboutPath} className={footerLinkClass}>
                About Us
              </FooterNavLink>
            </li>
            <li>
              <FooterNavLink href="/blog" className={footerLinkClass}>
                Blog
              </FooterNavLink>
            </li>
            <li>
              <FooterNavLink href={reviewsHref} className={footerLinkClass}>
                Reviews
              </FooterNavLink>
            </li>
            <li>
              <FooterNavLink href="/partnerships" className={footerLinkClass}>
                Partnerships
              </FooterNavLink>
            </li>
            <li>
              <FooterNavLink href="/careers" className={footerLinkClass}>
                Careers
              </FooterNavLink>
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