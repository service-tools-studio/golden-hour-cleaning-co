import ResidentialPricingGuide from "./ResidentialPricingGuide";

/**
 * Full services + pricing guide for city landings.
 * Replaces the old three-card services grid; keeps #services and #quote
 * anchors so existing CTAs continue to work.
 */
export default function CityPagePricingSection({ city }: { city: string }) {
  return (
    <div
      id="services"
      className="scroll-mt-[var(--header-height,120px)] py-10 md:py-14"
    >
      <div id="quote">
        <ResidentialPricingGuide homeLocation={city} />
      </div>
    </div>
  );
}
