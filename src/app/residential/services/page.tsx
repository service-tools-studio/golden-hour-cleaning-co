import ResidentialServicesClient from "./ResidentialServicesClient";

const VALID_LEVELS = new Set(["standard", "deep", "move_out"] as const);
type Level = "standard" | "deep" | "move_out";

function coerceLevel(value: unknown): Level {
  if (typeof value === "string" && VALID_LEVELS.has(value as Level)) {
    return value as Level;
  }
  return "deep";
}

export default async function ResidentialServicesPage({
  searchParams,
}: {
  // Next can provide this as a Promise in some builds
  searchParams: Promise<{ level?: string }> | { level?: string };
}) {
  const sp = "then" in searchParams ? await searchParams : searchParams;
  const initialLevel = coerceLevel(sp?.level);

  return <ResidentialServicesClient initialLevel={initialLevel} />;
}
