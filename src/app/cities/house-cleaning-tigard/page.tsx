import type { Metadata } from "next";
import HouseCleaningTigardClient from "./HouseCleaningTigardClient";

export const metadata: Metadata = {
  title: "House Cleaning Tigard, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in Tigard, OR — recurring, deep, and move-out cleaning with instant online quotes and thoughtful, reliable service.",
};

export default function HouseCleaningTigardPage() {
  return <HouseCleaningTigardClient />;
}
