import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

describe("Supabase environment config", () => {
  it("loads waitlist config from the current publishable key name", async () => {
    process.env = {
      NODE_ENV: "test",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      WAITLIST_TABLE: "waitlist_signups"
    };

    const { loadWaitlistConfig } = await import("@/lib/env");

    expect(loadWaitlistConfig()).toMatchObject({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "sb_publishable_test",
      waitlistTable: "waitlist_signups"
    });
  });

  it("loads browser config from the current publishable key name", async () => {
    process.env = {
      NODE_ENV: "test",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test"
    };

    const { getBrowserSupabaseConfig } = await import("@/lib/supabase-browser");

    expect(getBrowserSupabaseConfig()).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "sb_publishable_test"
    });
  });
});
