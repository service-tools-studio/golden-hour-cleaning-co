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
      title: "Standard House Cleaning Services in Portland, OR | Golden Hour Cleaning Co.",
      description:
        "Dependable standard house cleaning in Portland and the metro area. Weekly, bi-weekly, or monthly maintenance cleaning with eco-friendly products and online scheduling.",
    };
  }

  if (slug === "deep") {
    return {
      title: "Deep House Cleaning Services in Portland, OR | Golden Hour Cleaning Co.",
      description:
        "Thorough deep cleaning in Portland and the metro area. Top-to-bottom reset for homes that need more than routine upkeep. Instant online quotes and booking.",
    };
  }

  if (slug === "move-out") {
    return {
      title: "Move-In & Move-Out Cleaning Services in Portland, OR | Golden Hour Cleaning Co.",
      description:
        "Detailed move-in and move-out cleaning for empty homes in Portland and the metro area. Cabinets, oven, fridge, and more. Instant online quotes and booking.",
    };
  }

  return {
    title: `${service.title} | Golden Hour Cleaning Co.`,
    description: service.desc,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return <ServiceDetailClient service={service} />;
}
