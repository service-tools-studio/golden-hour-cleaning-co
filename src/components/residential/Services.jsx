import Link from "next/link";
import { HEADING_UPPER } from "../../helpers/typography.js";
import { SERVICE_LIST } from "../../data/residentialServices";

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

function ServiceCard({ service }) {
  const detailHref = `/residential/services/${service.slug}`;

  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm bg-white ${
        service.featured ? "border-stone-900 shadow-xl" : "border-amber-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className={`font-medium ${HEADING_UPPER}`}>{service.title}</h3>
        <span className="text-sm text-stone-500">{service.price}</span>
      </div>

      <p className="mt-2 text-sm text-stone-700">{service.desc}</p>

      <ul className="mt-4 space-y-1 text-sm text-stone-700">
        {service.items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <Link
        href={detailHref}
        aria-label={`Learn more about ${service.title}`}
        className="uppercase tracking-wide mt-5 inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-2 text-white hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        Learn more
      </Link>

      <p className="mt-2 text-xs text-stone-500">
        Quotes are based on estimated square footage, service level, and add-ons.
        Final price is confirmed after a quick walkthrough.
      </p>
    </div>
  );
}
