import type { Metadata } from "next";
import HouseCleaningWestLinnClient from "./HouseCleaningWestLinnClient";

export const metadata: Metadata = {
  title: "House Cleaning West Linn, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in West Linn, OR — recurring, deep, and move-out cleaning with instant online quotes and thoughtful, reliable service.",
};

export default function HouseCleaningWestLinnPage() {
  return <HouseCleaningWestLinnClient />;
}
