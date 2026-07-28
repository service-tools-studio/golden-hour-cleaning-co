import type { Metadata } from "next";
import HouseCleaningHappyValleyClient from "./HouseCleaningHappyValleyClient";

export const metadata: Metadata = {
  title: "House Cleaning Happy Valley, OR | Golden Hour Cleaning Co.",
  description:
    "Trusted house cleaning in Happy Valley, OR — recurring, deep, move-out, and post-construction cleaning with free quotes and dependable, detail-oriented service.",
};

export default function HouseCleaningHappyValleyPage() {
  return <HouseCleaningHappyValleyClient />;
}
