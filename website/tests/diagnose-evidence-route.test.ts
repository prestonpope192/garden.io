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

function request(context: Record<string, unknown> = { name: "Autumn Sage", season: "Late spring" }) {
  return new Request("http://127.0.0.1:3020/api/diagnose", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ context, symptoms: "lower leaves yellowing" })
  });
}

describe("diagnosis evidence contract", () => {
  it("returns grounded evidence and a confirmation flag", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    getRequestUserMock.mockResolvedValue({ configured: true, user: { id: "user-1" } });
    const upstream = vi.fn(async (..._args: Parameters<typeof fetch>) => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        summary: "The lower leaves may be reacting to a watering change.",
        causes: [{ cause: "Watering stress", confidence: "medium", detail: "The reported leaf position makes this plausible." }],
        actions: ["Check soil moisture before watering again."],
        follow_up: "Watch whether new growth stays green.",
        evidence: [{ fact: "The lower leaves are yellowing.", source: "grower_report", used_for: "supports a lower-canopy stress hypothesis" }],
        needs_confirmation: true
      }) } }]
    }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", upstream);

    const { POST } = await import("@/app/api/diagnose/route");
    const response = await POST(request() as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.diagnosis.evidence[0].source).toBe("grower_report");
    expect(payload.diagnosis.needs_confirmation).toBe(true);

    const requestBody = JSON.parse(String(upstream.mock.calls[0]?.[1]?.body));
    expect(requestBody.messages[1].content[0].text).toContain("Context: Autumn Sage");
  });

  it("passes a previous answer into the model context for comparison follow-ups", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    getRequestUserMock.mockResolvedValue({ configured: true, user: { id: "user-1" } });
    const upstream = vi.fn(async (..._args: Parameters<typeof fetch>) => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        summary: "Compare the newest growth with the last note.",
        causes: [],
        actions: ["Describe what changed."],
        follow_up: "Watch the newest growth.",
        evidence: [],
        needs_confirmation: false
      }) } }]
    }), { status: 200 }));
    vi.stubGlobal("fetch", upstream);

    const { POST } = await import("@/app/api/diagnose/route");
    const response = await POST(request({
      name: "Autumn Sage",
      previousAnswer: {
        prompt: "Why are the leaves yellowing?",
        summary: "The lower leaves may be reacting to a watering change.",
        followUp: "Watch whether new growth stays green."
      }
    }) as Parameters<typeof POST>[0]);

    expect(response.status).toBe(200);
    const requestBody = JSON.parse(String(upstream.mock.calls[0]?.[1]?.body));
    const contextText = requestBody.messages[1].content[0].text as string;
    expect(contextText).toContain("Previous garden question: Why are the leaves yellowing?");
    expect(contextText).toContain("Previous garden answer: The lower leaves may be reacting to a watering change.");
    expect(contextText).toContain("Watch-for: Watch whether new growth stays green.");
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
