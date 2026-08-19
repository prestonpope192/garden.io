import { afterEach, describe, expect, it, vi } from "vitest";

const getUserMock = vi.hoisted(() => vi.fn());
const insertMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase-server", () => ({
  createRequestSupabaseClient: vi.fn(() => ({
    auth: { getUser: getUserMock },
    from: vi.fn(() => ({ insert: insertMock }))
  }))
}));

afterEach(() => {
  getUserMock.mockReset();
  insertMock.mockReset();
});

describe("product events route", () => {
  it("persists an allowlisted event with sanitized metadata for the signed-in user", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insertMock.mockResolvedValue({ error: null });
    const { POST } = await import("@/app/api/analytics/events/route");

    const response = await POST(new Request("http://127.0.0.1:3020/api/analytics/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName: "app_opened",
        metadata: {
          view: "ask",
          oversized: "x".repeat(200),
          "bad-key!": "ignored"
        }
      })
    }) as Parameters<typeof POST>[0]);

    expect(response.status).toBe(201);
    expect(insertMock).toHaveBeenCalledWith({
      user_id: "user-1",
      event_name: "app_opened",
      metadata: { view: "ask", oversized: "x".repeat(120) }
    });
  });

  it("rejects unknown events before writing", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } } });
    const { POST } = await import("@/app/api/analytics/events/route");

    const response = await POST(new Request("http://127.0.0.1:3020/api/analytics/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventName: "raw_prompt" })
    }) as Parameters<typeof POST>[0]);

    expect(response.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });
});
