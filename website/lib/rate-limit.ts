import { createHash } from "node:crypto";

type RateLimitWindow = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | { ok: true }
  | { ok: false; status: 429 | 503; message: string };

const diagnoseWindows = new Map<string, RateLimitWindow>();
const fallbackWindows = new Map<string, RateLimitWindow>();

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

export const RATE_LIMIT_UNAVAILABLE_MESSAGE =
  "Garden help is temporarily unavailable. Please try again in a moment.";

type RateLimitClient = {
  rpc?: (
    functionName: string,
    params: Record<string, unknown>
  ) => PromiseLike<{ data: boolean | null; error: { message?: string } | null }>;
};

export function hashRateLimitKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function checkSharedRateLimit(
  client: RateLimitClient | null,
  key: string,
  limit: number,
  windowSeconds: number,
  message: string,
  fallbackStore = fallbackWindows
): Promise<RateLimitResult> {
  // The fallback keeps isolated unit tests and local builds usable before the
  // migration is applied. Production Supabase clients expose rpc and therefore
  // use the atomic database function above.
  if (!client || typeof client.rpc !== "function") {
    if (!checkWindow(fallbackStore, key, limit, windowSeconds * 1000)) {
      return { ok: false, status: 429, message };
    }
    return { ok: true };
  }

  try {
    const { data, error } = await client.rpc("consume_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds
    });
    if (error || data !== true) {
      return {
        ok: false,
        status: error ? 503 : 429,
        message: error ? RATE_LIMIT_UNAVAILABLE_MESSAGE : message
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 503, message: RATE_LIMIT_UNAVAILABLE_MESSAGE };
  }
}

/** Each vision call costs money, so the shared limiter is fail-closed. */
export async function checkDiagnoseRateLimit(userId: string, client: RateLimitClient | null): Promise<RateLimitResult> {
  const key = `diagnose:user:${hashRateLimitKey(userId || "unknown")}`;
  return checkSharedRateLimit(
    client,
    key,
    MAX_DIAGNOSE_PER_HOUR,
    HOUR_MS / 1000,
    "You can ask about the garden again in a little while.",
    diagnoseWindows
  );
}

export async function checkMagicLinkRateLimit(
  client: RateLimitClient | null,
  email: string,
  ipAddress: string
): Promise<RateLimitResult> {
  const emailResult = await checkSharedRateLimit(
    client,
    `magic-link:email:${hashRateLimitKey(email)}`,
    3,
    HOUR_MS / 1000,
    "Too many start-link requests. Please try again later."
  );
  if (!emailResult.ok) return emailResult;

  return checkSharedRateLimit(
    client,
    `magic-link:ip:${hashRateLimitKey(ipAddress || "unknown")}`,
    10,
    HOUR_MS / 1000,
    "Too many start-link requests. Please try again later."
  );
}
