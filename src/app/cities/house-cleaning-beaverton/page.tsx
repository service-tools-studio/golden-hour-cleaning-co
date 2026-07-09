import type { Metadata } from "next";
import HouseCleaningBeavertonClient from "./HouseCleaningBeavertonClient";

export const metadata: Metadata = {
  title: "House Cleaning Beaverton, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in Beaverton, OR — recurring, deep, and move-out cleaning with instant online quotes and thoughtful, reliable service.",
};

export default function HouseCleaningBeavertonPage() {
  return <HouseCleaningBeavertonClient />;
}
