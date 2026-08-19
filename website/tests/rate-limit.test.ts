import { describe, expect, it, vi } from "vitest";
import { checkSharedRateLimit } from "@/lib/rate-limit";

describe("shared rate limits", () => {
  it("uses the atomic RPC and returns the provider's decision", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });
    const result = await checkSharedRateLimit(
      { rpc },
      "test:rpc",
      20,
      3600,
      "limited"
    );

    expect(result).toEqual({ ok: true });
    expect(rpc).toHaveBeenCalledWith("consume_rate_limit", {
      p_key: "test:rpc",
      p_limit: 20,
      p_window_seconds: 3600
    });
  });

  it("fails closed when the shared function is unavailable", async () => {
    const result = await checkSharedRateLimit(
      { rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "missing function" } }) },
      "test:missing-function",
      20,
      3600,
      "limited"
    );

    expect(result).toEqual({
      ok: false,
      status: 503,
      message: "Garden help is temporarily unavailable. Please try again in a moment."
    });
  });

  it("keeps the local fallback bounded for isolated test/local clients", async () => {
    const key = `test:fallback:${Date.now()}:${Math.random()}`;
    expect(await checkSharedRateLimit(null, key, 1, 3600, "limited")).toEqual({ ok: true });
    expect(await checkSharedRateLimit(null, key, 1, 3600, "limited")).toEqual({
      ok: false,
      status: 429,
      message: "limited"
    });
  });
});
