import { afterEach, describe, expect, it, vi } from "vitest";

const signInWithOtpMock = vi.hoisted(() => vi.fn());
const createClientMock = vi.hoisted(() =>
  vi.fn(() => ({
    auth: {
      signInWithOtp: signInWithOtpMock
    }
  }))
);

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock
}));

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  createClientMock.mockClear();
  signInWithOtpMock.mockReset();
});

function makePostRequest(email: string) {
  const body = new URLSearchParams();
  body.set("email", email);

  return new Request("http://127.0.0.1:3020/api/auth/magic-link", {
    body,
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
}

describe("magic-link auth fallback route", () => {
  it("redirects invalid email without requiring Supabase config", async () => {
    process.env = {
      NODE_ENV: "test"
    };
    const { POST } = await import("@/app/api/auth/magic-link/route");

    const response = await POST(makePostRequest("garden"));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "http://127.0.0.1:3020/app/my-property?auth=invalid_email"
    );
  });

  it("redirects to a user-facing config state when Supabase is not configured", async () => {
    process.env = {
      NODE_ENV: "test"
    };
    const { POST } = await import("@/app/api/auth/magic-link/route");

    const response = await POST(makePostRequest("grower@example.com"));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "http://127.0.0.1:3020/app/my-property?auth=missing_config"
    );
  });

  it("sends the magic link back to the app and redirects to the sent state", async () => {
    process.env = {
      NODE_ENV: "test",
      NEXT_PUBLIC_SUPABASE_URL: "https://garden.example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
    };
    signInWithOtpMock.mockResolvedValue({ error: null });
    const { POST } = await import("@/app/api/auth/magic-link/route");

    const response = await POST(makePostRequest(" Grower@Example.COM "));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "http://127.0.0.1:3020/app/my-property?auth=sent"
    );
    expect(createClientMock).toHaveBeenCalledWith(
      "https://garden.example.supabase.co",
      "anon-key",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: "grower@example.com",
      options: {
        emailRedirectTo: "http://127.0.0.1:3020/app",
        shouldCreateUser: true
      }
    });
  });
});
