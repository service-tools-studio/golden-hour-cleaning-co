import { headers } from "next/headers";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

/**
 * Portland LocalBusiness schema only — avoids attributing Oregon address/reviews to Phoenix URLs.
 */
export default async function LocalBusinessJsonLdGate() {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/";
  if (pathname === "/phoenix" || pathname.startsWith("/phoenix/")) {
    return null;
  }
  return <LocalBusinessJsonLd />;
}
