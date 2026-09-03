import { HEADING_UPPER } from "../../helpers/typography.js";
import {
  PricingGuideCTA,
  ServicePricingCards,
} from "./ResidentialPricingGuide";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-5xl px-4 pt-14 pb-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className={`mt-0 text-3xl ${HEADING_UPPER}`}>
          Residential Services & Pricing
        </h2>
        <p className="mt-3 text-stone-700">
          Thoughtful, detail-driven cleaning for every season of your home. From
          consistent upkeep to comprehensive resets, each service is designed
          around your space, your needs, and the level of care your home requires.
        </p>
      </div>

      <div className="mt-6 md:mt-8">
        <ServicePricingCards />
      </div>

      <div className="mt-10">
        <PricingGuideCTA />
      </div>
    </section>
  );
}
