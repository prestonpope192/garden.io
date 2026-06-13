type RateLimitWindow = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | { ok: true }
  | { ok: false; status: 429; message: string };

const ipWindows = new Map<string, RateLimitWindow>();
const emailWindows = new Map<string, RateLimitWindow>();

const HOUR_MS = 60 * 60 * 1000;
const EMAIL_COOLDOWN_MS = 10 * 60 * 1000;
const MAX_IP_ATTEMPTS_PER_HOUR = 10;

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

export function resetWaitlistRateLimitForTests() {
  ipWindows.clear();
  emailWindows.clear();
}
