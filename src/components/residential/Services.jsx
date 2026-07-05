import { HEADING_UPPER } from "../../helpers/typography.js";
import { SERVICE_LIST } from "../../data/residentialServices";
import ServiceCard from "./ServiceCard.jsx";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 pt-14 pb-20">
      <h2 className={`text-3xl mt-0 ${HEADING_UPPER}`}>Residential Services</h2>
      <p className="mt-1 text-stone-700">
        We bill by the square foot, using your home’s size and service type to
        estimate a time range. Eco-friendly products are our default—conventional
        options are available on request.
      </p>

      <div className="mt-6 md:mt-8 grid md:grid-cols-3 gap-6">
        {SERVICE_LIST.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </section>
  );
}
