import { HEADING_UPPER } from "../../helpers/typography.js";
import { SERVICE_LIST } from "../../data/residentialServices";
import ServiceCard from "./ServiceCard.jsx";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 pt-14 pb-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className={`text-3xl mt-0 ${HEADING_UPPER}`}>Residential Services</h2>
        <p className="mt-3 text-stone-700">
          Thoughtful, detail-driven cleaning for every season of your home. From consistent upkeep to comprehensive resets, each service is designed around your space, your needs, and the level of care your home requires.
        </p>
      </div>

      <div className="mt-6 md:mt-8 grid gap-6 md:grid-cols-3 md:items-stretch">
        {SERVICE_LIST.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </section>
  );
}
