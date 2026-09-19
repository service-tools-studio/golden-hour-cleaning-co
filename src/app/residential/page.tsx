import type { Metadata } from "next";
import ResidentialPageClient from "./ResidentialPageClient";

export const metadata: Metadata = {
  title: "Residential House Cleaning in Portland, OR | Golden Hour Cleaning Co.",
  description:
    "Residential house cleaning across Portland and the metro area from Golden Hour Cleaning Co. — recurring upkeep, deep cleans, and move-out cleaning with personalized quotes.",
  alternates: { canonical: "/residential" },
};

export default function ResidentialPage() {
  return <ResidentialPageClient />;
}
