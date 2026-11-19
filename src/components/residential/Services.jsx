import { MARKETS } from "@/lib/markets";
import ServicesHubIntro from "./ServicesHubIntro";
import { ServicePricingCards } from "./ResidentialPricingGuide";

/** @param {{ market?: import('@/lib/markets').MarketConfig }} props */
export default function Services({ market = MARKETS.portland }) {
  return (
    <section id="services" className="mx-auto max-w-5xl px-4 pt-14 pb-10">
      <ServicesHubIntro market={market} />

      <div className="mt-6 md:mt-8">
        <ServicePricingCards pageMarketId={market.id} />
      </div>
    </section>
  );
}
