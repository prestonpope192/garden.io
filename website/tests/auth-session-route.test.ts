import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const verifyOtpMock = vi.hoisted(() => vi.fn());
const setSessionMock = vi.hoisted(() => vi.fn());
const createServerClientMock = vi.hoisted(() =>
  vi.fn((_url: string, _key: string, options: { cookies: { setAll: Function } }) => {
    const setCookie = () => {
      options.cookies.setAll([
        {
          name: "sb-test-auth-token",
          value: "session-cookie",
          options: {
            path: "/",
            sameSite: "lax"
          }
        }
      ]);
    };

    verifyOtpMock.mockImplementation(async () => {
      setCookie();
      return { error: null };
    });
    setSessionMock.mockImplementation(async () => {
      setCookie();
      return { error: null };
    });

    return {
      auth: {
        setSession: setSessionMock,
        verifyOtp: verifyOtpMock
      }
    };
  })
);

vi.mock("@supabase/ssr", () => ({
  createServerClient: createServerClientMock
}));

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  createServerClientMock.mockClear();
  verifyOtpMock.mockReset();
  setSessionMock.mockReset();
});

function makePostRequest(body: Record<string, string>, origin = "http://localhost:3020") {
  return new NextRequest("http://127.0.0.1:3020/api/auth/session", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      origin
    },
    method: "POST"
  });
}

function setSupabaseEnv() {
  process.env = {
    NODE_ENV: "test",
    NEXT_PUBLIC_SUPABASE_URL: "https://garden.example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
  };
}

describe("auth session route", () => {
  it("rejects cross-origin session requests", async () => {
    setSupabaseEnv();
    const { POST } = await import("@/app/api/auth/session/route");

    const response = await POST(
      makePostRequest(
        {
          token_hash: "hash-token",
          type: "magiclink"
        },
        "https://attacker.example"
      )
    );

    expect(response.status).toBe(403);
    expect(verifyOtpMock).not.toHaveBeenCalled();
  });

  it("verifies token-hash links and stores auth cookies", async () => {
    setSupabaseEnv();
    const { POST } = await import("@/app/api/auth/session/route");

    const response = await POST(
      makePostRequest({
        token_hash: "hash-token",
        type: "magiclink"
      })
    );

    expect(response.status).toBe(200);
    expect(verifyOtpMock).toHaveBeenCalledWith({
      token_hash: "hash-token",
      type: "magiclink"
    });
    expect(response.headers.get("set-cookie")).toContain("sb-test-auth-token=session-cookie");
  });

  it("stores sessions from Supabase default fragment-token redirects", async () => {
    setSupabaseEnv();
    const { POST } = await import("@/app/api/auth/session/route");

    const response = await POST(
      makePostRequest({
        access_token: "access-token",
        refresh_token: "refresh-token"
      })
    );

    expect(response.status).toBe(200);
    expect(setSessionMock).toHaveBeenCalledWith({
      access_token: "access-token",
      refresh_token: "refresh-token"
    });
    expect(response.headers.get("set-cookie")).toContain("sb-test-auth-token=session-cookie");
  });

  it("rejects missing sign-in details", async () => {
    setSupabaseEnv();
    const { POST } = await import("@/app/api/auth/session/route");

    const response = await POST(makePostRequest({}));

    expect(response.status).toBe(400);
    expect(verifyOtpMock).not.toHaveBeenCalled();
    expect(setSessionMock).not.toHaveBeenCalled();
  });
});
