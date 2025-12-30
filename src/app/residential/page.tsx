"use client"
import dynamic from "next/dynamic";

const ResidentialClient = dynamic(() => import("./ResidentialClient"), {
  ssr: false,
});

export default function ResidentialPage() {
  return <ResidentialClient />;
}
