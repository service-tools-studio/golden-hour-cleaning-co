import type { Metadata } from "next";
import HouseCleaningLakeOswegoClient from "./HouseCleaningLakeOswegoClient";

export const metadata: Metadata = {
  title: "House Cleaning Lake Oswego, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in Lake Oswego, OR — recurring, deep, and move-out cleaning with personalized quotes and thoughtful, reliable service.",
};

export default function HouseCleaningLakeOswegoPage() {
  return <HouseCleaningLakeOswegoClient />;
}
