import type { ComponentProps } from "react";
import PpcMoveOutCleaningClient from "@/components/ppc/PpcMoveOutCleaningClient";
import { MARKETS } from "@/lib/markets";

export default function PortlandMoveOutCleaningClient(
  props: Omit<ComponentProps<typeof PpcMoveOutCleaningClient>, "market">,
) {
  return <PpcMoveOutCleaningClient market={MARKETS.portland} {...props} />;
}
