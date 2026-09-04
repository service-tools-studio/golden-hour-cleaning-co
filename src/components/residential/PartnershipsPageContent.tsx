import Link from "next/link";
import { BTN_PRIMARY, HEADING_UPPER } from "@/helpers/typography.js";
import { buildMailto } from "@/helpers/contactHelpers";
import { BulletList, Section } from "./servicePageParts";

const EMAIL = "golden.hour.cleaning.company@gmail.com";

const PARTNERS = [
  {
    name: "Rent Portland Homes – Darla Andrew's Office",
    category: "Property Management",
    description:
      "Golden Hour provides professional cleaning services for properties managed through the Darla Andrew's Office of Rent Portland Homes.",
  },
  {
    name: "Olympus Property",
    category: "Property Management",
    description:
      "Golden Hour provides professional cleaning services in support of properties managed by Olympus Property.",
  },
  {
    name: "Chateau de Lis",
    category: "Wedding & Event Venue",
    description:
      "Golden Hour provides recurring cleaning and guest-room turnover services in support of events and overnight stays at Chateau de Lis.",
  },
];

const SERVICES = [
  "Move-out and turnover cleaning",
  "Deep cleaning",
  "Common-area cleaning",
  "Post-construction and post-renovation cleaning",
  "Recurring property cleaning",
  "Custom cleaning scopes for unique spaces",
];

export default function PartnershipsPageContent() {
  const inquiryMailto = buildMailto({
    email: EMAIL,
    subject: "Partnership Inquiry",
    body: "Hi Golden Hour Cleaning Co.,\n\nI'm interested in learning more about partnering with you for property cleaning services.\n\n",
  });

  return (
    <>
      <h1 className={`text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
        Partnerships
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-stone-700">
        Building relationships with Portland&apos;s property professionals.
      </p>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-700">
        <p>
          Golden Hour Cleaning Co. is proud to work alongside property management
          teams and local organizations throughout the Portland metro area.
        </p>
        <p>
          These relationships allow us to provide professional cleaning support for
          properties that need dependable service, thoughtful attention to detail,
          and a team that can adapt to the needs of each space.
        </p>
      </div>

      <Section title="Organizations We Work With" level={3}>
        <div className="space-y-4">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm"
            >
              <p className={`text-sm font-semibold text-stone-900 ${HEADING_UPPER}`}>
                {partner.name}
              </p>
              <p className="mt-1 text-sm italic text-stone-600">{partner.category}</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Professional Cleaning Support, Built Around Your Properties">
        <p className="text-base leading-relaxed text-stone-700">
          Every property management team operates a little differently. We work to
          make cleaning one less thing to manage by providing responsive
          communication, flexible scheduling, clear pricing, and detailed service
          tailored to the needs of each property.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Our property and business services can include:
        </p>
        <BulletList items={SERVICES} />
      </Section>

      <Section title="Let's Work Together">
        <h3 className={`text-base font-semibold text-stone-900 ${HEADING_UPPER}`}>
          Looking for a cleaning company for your properties?
        </h3>
        <p className="mt-3 text-base leading-relaxed text-stone-700">
          Whether you manage a single property or an entire portfolio, we&apos;d
          love to learn more about what your team needs and explore how Golden Hour
          can support you.
        </p>
        <div className="mt-8">
          <Link href={inquiryMailto} className={BTN_PRIMARY}>
            Inquire About Working With Us
          </Link>
        </div>
      </Section>
    </>
  );
}
