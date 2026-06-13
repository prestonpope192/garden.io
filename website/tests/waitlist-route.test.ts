import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetWaitlistRateLimitForTests } from "@/lib/rate-limit";

const processWaitlistSignup = vi.fn();
const createWaitlistDependencies = vi.fn();

vi.mock("@/lib/waitlist-service", () => ({
  processWaitlistSignup
}));

vi.mock("@/lib/waitlist-dependencies", () => ({
  createWaitlistDependencies
}));

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    resetWaitlistRateLimitForTests();
  });

  it("returns success response", async () => {
    createWaitlistDependencies.mockReturnValue({});
    processWaitlistSignup.mockResolvedValue({
      ok: true,
      message: "ok",
      emailChannel: "resend"
    });

    const { POST } = await import("@/app/api/waitlist/route");

    const request = new Request("http://localhost:3000/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email: "person@example.com" }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      message: "ok",
      emailChannel: "resend"
    });
  });

  it("returns validation failure payload", async () => {
    createWaitlistDependencies.mockReturnValue({});
    processWaitlistSignup.mockResolvedValue({
      ok: false,
      status: 400,
      message: "invalid"
    });

    const { POST } = await import("@/app/api/waitlist/route");

    const request = new Request("http://localhost:3000/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email: "invalid" }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ ok: false, message: "invalid" });
  });

  it("rate limits repeated submissions for the same email", async () => {
    createWaitlistDependencies.mockReturnValue({});
    processWaitlistSignup.mockResolvedValue({
      ok: true,
      message: "ok",
      emailChannel: "resend"
    });

    const { POST } = await import("@/app/api/waitlist/route");

    const firstRequest = new Request("http://localhost:3000/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email: "person@example.com" }),
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "203.0.113.9"
      }
    });
    const secondRequest = new Request("http://localhost:3000/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email: "person@example.com" }),
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "203.0.113.9"
      }
    });

    const firstResponse = await POST(firstRequest);
    const secondResponse = await POST(secondRequest);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(429);
    await expect(secondResponse.json()).resolves.toEqual({
      ok: false,
      message: "That email was just submitted. Please check your inbox or try again later."
    });
    expect(processWaitlistSignup).toHaveBeenCalledTimes(1);
  });
});
