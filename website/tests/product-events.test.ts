// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { recordProductEvent } from "@/lib/product-events";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("product event client", () => {
  it("posts an allowlisted event without blocking the garden UI", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    recordProductEvent("app_opened", { view: "ask" });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    expect(fetchMock).toHaveBeenCalledWith("/api/analytics/events", expect.objectContaining({
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ eventName: "app_opened", metadata: { view: "ask" } })
    }));
  });
});
