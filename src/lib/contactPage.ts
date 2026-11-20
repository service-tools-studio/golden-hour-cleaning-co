import type { MarketId } from "@/lib/markets";
import { withMarketQueryForNeutralPath } from "@/lib/marketPreference";

export const CONTACT_TOPICS = [
  { value: "general", label: "General question" },
  { value: "careers", label: "Careers / joining our team" },
  { value: "partnerships", label: "Partnerships & property management" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export function isContactTopic(value: string | null | undefined): value is ContactTopic {
  return CONTACT_TOPICS.some((t) => t.value === value);
}

export function buildContactPageHref(
  marketId: MarketId,
  topic?: ContactTopic,
): string {
  const base = withMarketQueryForNeutralPath("/contact", marketId);
  if (!topic || topic === "general") return base;
  const [path, search = ""] = base.split("?");
  const params = new URLSearchParams(search);
  params.set("topic", topic);
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}