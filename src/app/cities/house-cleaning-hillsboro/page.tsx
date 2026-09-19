import type { Metadata } from "next";
import HouseCleaningHillsboroClient from "./HouseCleaningHillsboroClient";

export const metadata: Metadata = {
  title: "House Cleaning Hillsboro, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in Hillsboro, OR — recurring, deep, and move-out cleaning with personalized quotes and thoughtful, reliable service.",
  alternates: { canonical: "/cities/house-cleaning-hillsboro" },
};

export default function HouseCleaningHillsboroPage() {
  return <HouseCleaningHillsboroClient />;
}
