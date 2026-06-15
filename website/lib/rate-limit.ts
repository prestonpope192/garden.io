type RateLimitWindow = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | { ok: true }
  | { ok: false; status: 429; message: string };

const ipWindows = new Map<string, RateLimitWindow>();
const emailWindows = new Map<string, RateLimitWindow>();
const diagnoseWindows = new Map<string, RateLimitWindow>();

const HOUR_MS = 60 * 60 * 1000;
const EMAIL_COOLDOWN_MS = 10 * 60 * 1000;
const MAX_IP_ATTEMPTS_PER_HOUR = 10;
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

export function checkWaitlistRateLimit(input: {
  ip: string;
  email?: string;
}): RateLimitResult {
  const ipKey = input.ip || "unknown";

  if (!checkWindow(ipWindows, ipKey, MAX_IP_ATTEMPTS_PER_HOUR, HOUR_MS)) {
    return {
      ok: false,
      status: 429,
      message: "Too many signup attempts. Please try again later."
    };
  }

  if (input.email) {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (normalizedEmail && !checkWindow(emailWindows, normalizedEmail, 1, EMAIL_COOLDOWN_MS)) {
      return {
        ok: false,
        status: 429,
        message: "That email was just submitted. Please check your inbox or try again later."
      };
    }
  }

  return { ok: true };
}

/**
 * Per-user limit on AI diagnosis calls. Each call costs real money, so this
 * caps abuse/runaway usage. In-memory (per server instance) — good enough for
 * the private beta; move to a shared store if we scale horizontally.
 */
export function checkDiagnoseRateLimit(userId: string): RateLimitResult {
  const key = userId || "unknown";
  if (!checkWindow(diagnoseWindows, key, MAX_DIAGNOSE_PER_HOUR, HOUR_MS)) {
    return {
      ok: false,
      status: 429,
      message: "You've reached the diagnosis limit for now. Please try again in a little while."
    };
  }
  return { ok: true };
}

export function resetWaitlistRateLimitForTests() {
  ipWindows.clear();
  emailWindows.clear();
  diagnoseWindows.clear();
}
