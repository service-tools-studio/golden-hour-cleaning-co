import {
  BUSINESS_ADDRESS,
  BUSINESS_DESCRIPTION,
  BUSINESS_LOGO_PATH,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  SERVICE_AREA_CITIES,
  SITE_URL,
} from "@/lib/site";

/**
 * LocalBusiness JSON-LD for a service-area cleaning company.
 * Uses only facts already published on the site — no invented ratings,
 * hours, geo coordinates, social profiles, or prices.
 */
export default function LocalBusinessJsonLd() {
  const logoUrl = `${SITE_URL}${encodeURI(BUSINESS_LOGO_PATH)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BUSINESS_NAME,
    url: SITE_URL,
    telephone: CONTACT_PHONE_E164,
    email: CONTACT_EMAIL,
    description: BUSINESS_DESCRIPTION,
    image: logoUrl,
    logo: logoUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_ADDRESS.streetAddress,
      addressLocality: BUSINESS_ADDRESS.addressLocality,
      addressRegion: BUSINESS_ADDRESS.addressRegion,
      postalCode: BUSINESS_ADDRESS.postalCode,
      addressCountry: BUSINESS_ADDRESS.addressCountry,
    },
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Portland metro area, Oregon",
      },
      ...SERVICE_AREA_CITIES.map((city) => ({
        "@type": "City",
        name: `${city}, OR`,
      })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Residential cleaning services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Standard / recurring house cleaning",
            url: `${SITE_URL}/residential/services/standard`,
            areaServed: "Portland metro area, Oregon",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Deep house cleaning",
            url: `${SITE_URL}/residential/services/deep`,
            areaServed: "Portland metro area, Oregon",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Move-in and move-out cleaning",
            url: `${SITE_URL}/residential/services/move-out`,
            areaServed: "Portland metro area, Oregon",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial cleaning",
            url: `${SITE_URL}/commercial`,
            areaServed: "Portland metro area, Oregon",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
