import type { Metadata } from "next";
import HouseCleaningOregonCityClient from "./HouseCleaningOregonCityClient";

export const metadata: Metadata = {
  title: "House Cleaning Oregon City, OR | Golden Hour Cleaning Co.",
  description:
    "Trusted house cleaning in Oregon City, OR — recurring, deep, move-out, and post-construction cleaning with free quotes and reliable, detail-oriented service.",
};

export default function HouseCleaningOregonCityPage() {
  return <HouseCleaningOregonCityClient />;
}
