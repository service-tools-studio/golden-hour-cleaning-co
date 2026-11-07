import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/residential/ServiceDetailClient";
import {
  getServiceBySlug,
  SERVICE_SLUGS,
} from "@/data/residentialServices";
import { MARKETS } from "@/lib/markets";
import { buildResidentialServiceMetadata } from "@/lib/serviceDetailRoutes";

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
  return buildResidentialServiceMetadata(MARKETS.portland, service.slug);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return <ServiceDetailClient service={service} market={MARKETS.portland} />;
}
