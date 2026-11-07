import type { ComponentProps } from "react";
import PpcDeepCleaningClient from "@/components/ppc/PpcDeepCleaningClient";
import { MARKETS } from "@/lib/markets";

export default function PortlandDeepCleaningClient(
  props: Omit<ComponentProps<typeof PpcDeepCleaningClient>, "market">,
) {
  return <PpcDeepCleaningClient market={MARKETS.portland} {...props} />;
}
