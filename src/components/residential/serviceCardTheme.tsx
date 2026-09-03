import { Home, PackageOpen } from "lucide-react";
import type { ServiceSlug } from "@/data/residentialServices";

export const SERVICE_THEMES = {
  standard: {
    border: "border-amber-200/80",
    iconBg: "bg-amber-100",
    iconColor: "text-[#c9a227]",
    tagline: "text-[#c9a227]",
    divider: "bg-amber-300/70",
    check: "text-[#c9a227]",
  },
  deep: {
    border: "border-[#a7eff1]/70",
    iconBg: "bg-[#a7eff1]/35",
    iconColor: "text-teal-700",
    tagline: "text-teal-600",
    divider: "bg-[#a7eff1]",
    check: "text-teal-600",
  },
  "move-out": {
    border: "border-orange-200/80",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    tagline: "text-orange-600",
    divider: "bg-orange-300/70",
    check: "text-orange-500",
  },
} as const;

export function ServiceIcon({
  slug,
  className = "",
}: {
  slug: ServiceSlug;
  className?: string;
}) {
  if (slug === "move-out") {
    return (
      <PackageOpen className={className} strokeWidth={1.75} aria-hidden />
    );
  }
  return <Home className={className} strokeWidth={1.75} aria-hidden />;
}
