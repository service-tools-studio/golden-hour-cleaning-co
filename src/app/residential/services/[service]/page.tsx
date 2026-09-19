import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getServiceBySlug,
  SERVICE_SLUGS,
} from "@/data/residentialServices";
import ServiceDetailClient from "./ServiceDetailClient";

type Props = {
  params: Promise<{ service: string }>;
};

export function generateStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };

  if (slug === "standard") {
    return {
      title:
        "Recurring House Cleaning in Portland, OR | Golden Hour Cleaning Co.",
      description:
        "Dependable recurring house cleaning in Portland and the metro area. Weekly, bi-weekly, or monthly maintenance cleaning with eco-friendly products and online scheduling.",
      alternates: { canonical: `/residential/services/${slug}` },
    };
  }

  if (slug === "deep") {
    return {
      title:
        "Deep Cleaning Services in Portland, OR | Golden Hour Cleaning Co.",
      description:
        "Professional deep house cleaning in Portland and the metro area — what's included, typical starting prices, and how to request a personalized quote.",
      alternates: { canonical: `/residential/services/${slug}` },
    };
  }

  if (slug === "move-out") {
    return {
      title:
        "Move-Out Cleaning Services in Portland, OR | Golden Hour Cleaning Co.",
      description:
        "Detailed move-in and move-out cleaning for empty homes in Portland and the metro area. Cabinets, oven, fridge, and more. Request a personalized quote online.",
      alternates: { canonical: `/residential/services/${slug}` },
    };
  }

  return {
    title: `${service.title} | Golden Hour Cleaning Co.`,
    description: service.desc,
    alternates: { canonical: `/residential/services/${slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return <ServiceDetailClient service={service} />;
}
