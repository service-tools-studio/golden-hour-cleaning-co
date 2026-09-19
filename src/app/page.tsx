import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Golden Hour Cleaning Co. | House Cleaning in Portland, OR",
  description:
    "Golden Hour Cleaning Co. provides professional house cleaning in Portland, OR and the surrounding metro area — meticulous care, transparent pricing, and easy online booking.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeClient />;
}
