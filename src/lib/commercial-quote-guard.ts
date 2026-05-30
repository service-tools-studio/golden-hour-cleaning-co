/** Minimum time on page before a quote submit counts as human. */
export const MIN_SUBMIT_MS = 3_000;

/** Reject stale timestamps (replay with old values). */
export const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;

const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function isSubmitTimingValid(formLoadedAt: unknown): boolean {
  if (typeof formLoadedAt !== "number" || !Number.isFinite(formLoadedAt)) {
    return false;
  }
  const elapsed = Date.now() - formLoadedAt;
  return elapsed >= MIN_SUBMIT_MS && elapsed <= MAX_FORM_AGE_MS;
}

export function checkRateLimit(ip: string): { allowed: boolean } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    pruneRateLimitStore(now);
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false };
  }

  entry.count += 1;
  return { allowed: true };
}

function pruneRateLimitStore(now: number) {
  if (rateLimitStore.size < 500) return;
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}
