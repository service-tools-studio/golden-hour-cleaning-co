import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  readPreferredMarketFromCookies,
  resolveResidentialLegacyHomeRedirect,
} from "@/lib/marketPreference";

/** Legacy URL — marketing home moved to `/` and `/phoenix`. */
export default async function ResidentialLegacyHomeRedirect() {
  const cookieStore = await cookies();
  const preferred = readPreferredMarketFromCookies((name) =>
    cookieStore.get(name)?.value,
  );
  redirect(resolveResidentialLegacyHomeRedirect(preferred));
}
