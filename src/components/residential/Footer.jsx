import { BTN_UPPER, HEADING_UPPER } from "../../helpers/typography.js";
import FooterCitiesMenu from "./FooterCitiesMenu";

const COI_URL =
  "https://portal.nextinsurance.com/public/certificates/live-certificate/4689e08f2c04efe155c98e6d5588048d";

const footerBrandId = "footer-brand-heading";
const footerContactId = "footer-contact-heading";
const footerExploreId = "footer-explore-heading";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      aria-labelledby={footerBrandId}
      className="bg-amber-50 border-t border-amber-200 text-amber-900"
    >
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12 grid md:grid-cols-3 gap-8">
        <section aria-labelledby={footerBrandId}>
          <h2
            id={footerBrandId}
            className={`text-xl font-semibold ${HEADING_UPPER}`}
          >
            Golden Hour Cleaning Co.
          </h2>
          <p className="mt-2 text-sm text-amber-800/80 leading-relaxed">
            Meticulous care, mindful presence, and eco-friendly products —
            restoring harmony in your space, one clean at a time. Golden Hour
            Cleaning Co is licensed in the State of Oregon and carries general
            liability coverage up to $1 million.
          </p>
          <a
            href={COI_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View certificate of insurance (opens in new tab)"
            className={`mt-4 inline-flex rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${BTN_UPPER}`}
          >
            View Certificate of Insurance
          </a>
        </section>

        <section aria-labelledby={footerContactId}>
          <h3 id={footerContactId} className={`mb-2 font-semibold ${HEADING_UPPER}`}>
            Contact
          </h3>
          <address className="not-italic text-sm text-amber-900">
            <span className="block">5441 S Macadam Ave #4907</span>
            <span className="block">Portland, OR 97239, USA</span>
            <a
              href="tel:+15038934795"
              className="mt-1 inline-block hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
            >
              (503) 893-4795
            </a>
            <a
              href="mailto:golden.hour.cleaning.company@gmail.com"
              className="mt-1 block break-all hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
            >
              golden.hour.cleaning.company@gmail.com
            </a>
          </address>
          <p className="text-xs mt-3 text-amber-800/70">
            Licensed, insured, background-checked professionals
          </p>
        </section>

        <nav aria-labelledby={footerExploreId}>
          <h3 id={footerExploreId} className={`mb-2 font-semibold ${HEADING_UPPER}`}>
            Explore
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="/residential/services"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Residential Services
              </a>
            </li>
            <li>
              <a
                href="/residential/quote"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Get a residential quote
              </a>
            </li>
            <li>
              <a
                href="/commercial"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Commercial Cleaning
              </a>
            </li>
            <FooterCitiesMenu />
            <li>
              <a
                href="/about"
                className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
              >
                About Us
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
