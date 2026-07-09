import type { Metadata } from "next";
import HouseCleaningPortlandClient from "./HouseCleaningPortlandClient";

export const metadata: Metadata = {
  title: "House Cleaning Portland, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in Portland, OR — recurring, deep, and move-out cleaning with instant online quotes and thoughtful, reliable service.",
};

export default function HouseCleaningPortlandPage() {
  return <HouseCleaningPortlandClient />;
}
