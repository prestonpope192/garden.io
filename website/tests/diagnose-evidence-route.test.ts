import { afterEach, describe, expect, it, vi } from "vitest";

const getRequestUserMock = vi.hoisted(() => vi.fn());
const createRequestSupabaseClientMock = vi.hoisted(() => vi.fn(() => null));

vi.mock("@/lib/supabase-server", () => ({
  getRequestUser: getRequestUserMock,
  createRequestSupabaseClient: createRequestSupabaseClientMock
}));

afterEach(() => {
  getRequestUserMock.mockReset();
  createRequestSupabaseClientMock.mockReset();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function request() {
  return new Request("http://127.0.0.1:3020/api/diagnose", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ context: { name: "Autumn Sage", season: "Late spring" }, symptoms: "lower leaves yellowing" })
  });
}

describe("diagnosis evidence contract", () => {
  it("returns grounded evidence and a confirmation flag", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    getRequestUserMock.mockResolvedValue({ configured: true, user: { id: "user-1" } });
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        summary: "The lower leaves may be reacting to a watering change.",
        causes: [{ cause: "Watering stress", confidence: "medium", detail: "The reported leaf position makes this plausible." }],
        actions: ["Check soil moisture before watering again."],
        follow_up: "Watch whether new growth stays green.",
        evidence: [{ fact: "The lower leaves are yellowing.", source: "grower_report", used_for: "supports a lower-canopy stress hypothesis" }],
        needs_confirmation: true
      }) } }]
    }), { status: 200, headers: { "content-type": "application/json" } })));

    const { POST } = await import("@/app/api/diagnose/route");
    const response = await POST(request() as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.diagnosis.evidence[0].source).toBe("grower_report");
    expect(payload.diagnosis.needs_confirmation).toBe(true);
  });

  it("rejects a model response that omits the evidence contract", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    getRequestUserMock.mockResolvedValue({ configured: true, user: { id: "user-1" } });
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        summary: "Maybe.", causes: [], actions: [], follow_up: ""
      }) } }]
    }), { status: 200 })));

    const { POST } = await import("@/app/api/diagnose/route");
    const response = await POST(request() as Parameters<typeof POST>[0]);
    expect(response.status).toBe(502);
  });
});
