import { HEADING_UPPER } from "../../helpers/typography.js";
import { MARKETS } from "@/lib/markets";
import { ServicePricingCards } from "./ResidentialPricingGuide";

/** @param {{ market?: import('@/lib/markets').MarketConfig }} props */
export default function Services({ market = MARKETS.portland }) {
  const { title, intro } = market.servicesHub;

  return (
    <section id="services" className="mx-auto max-w-5xl px-4 pt-14 pb-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className={`mt-0 text-3xl ${HEADING_UPPER}`}>{title}</h1>
        <p className="mt-3 text-stone-700">{intro}</p>
      </div>

      <div className="mt-6 md:mt-8">
        <ServicePricingCards servicesHubPath={market.servicesHubPath} />
      </div>
    </section>
  );
}
