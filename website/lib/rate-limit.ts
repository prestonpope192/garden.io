type RateLimitWindow = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | { ok: true }
  | { ok: false; status: 429; message: string };

const diagnoseWindows = new Map<string, RateLimitWindow>();

const HOUR_MS = 60 * 60 * 1000;
const MAX_DIAGNOSE_PER_HOUR = 20;

function checkWindow(
  store: Map<string, RateLimitWindow>,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  return true;
}

/**
 * Per-user limit on garden question calls. Each call costs real money, so this
 * caps abuse/runaway usage. In-memory (per server instance) — move to a shared
 * store if we scale horizontally.
 */
export function checkDiagnoseRateLimit(userId: string): RateLimitResult {
  const key = userId || "unknown";
  if (!checkWindow(diagnoseWindows, key, MAX_DIAGNOSE_PER_HOUR, HOUR_MS)) {
    return {
      ok: false,
      status: 429,
      message: "You can ask about the garden again in a little while."
    };
  }
  return { ok: true };
}
