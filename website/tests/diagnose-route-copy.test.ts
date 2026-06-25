import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("garden care-help route copy", () => {
  it("uses user-facing language when garden help is unavailable", async () => {
    process.env = {
      NODE_ENV: "test"
    };
    const { POST } = await import("@/app/api/diagnose/route");

    const response = await POST(
      new Request("http://127.0.0.1:3020/api/diagnose", {
        body: JSON.stringify({
          context: { name: "Autumn Sage" },
          symptoms: "lower leaves yellowing"
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      })
    );
    const payload = (await response.json()) as { message?: string };

    expect(response.status).toBe(503);
    expect(payload.message).toBe(
      "We can't look at your garden right now. You can still keep a note and try again later."
    );
    expect(payload.message).not.toContain("save a note");
    expect(payload.message).not.toContain("AI");
    expect(payload.message).not.toContain("check this plant");
    expect(payload.message).not.toContain("configured");
    expect(payload.message).not.toContain("OpenAI");
    expect(payload.message).not.toContain("problem checks");
    expect(payload.message).not.toContain("unavailable");
    expect(payload.message).not.toContain("could not");
  });

  it("keeps retry and limit messages focused on garden help", () => {
    const routeSource = readFileSync(new URL("../app/api/diagnose/route.ts", import.meta.url), "utf8");
    const rateLimitSource = readFileSync(new URL("../lib/rate-limit.ts", import.meta.url), "utf8");

    expect(routeSource).toContain("A lot of garden help is queued right now. Please try again in a moment.");
    expect(routeSource).toContain("Concrete care steps, most useful first.");
    expect(routeSource).toContain("concrete care steps, and one thing to watch or confirm");
    expect(routeSource).toContain("Please sign in to ask about your garden.");
    expect(routeSource).toContain("Add what you are seeing or a photo to ask about your garden.");
    expect(rateLimitSource).toContain("You can ask about the garden again in a little while.");
    expect(routeSource + rateLimitSource).not.toContain("Please sign in to check your garden.");
    expect(routeSource + rateLimitSource).not.toContain("Add what you are seeing or a photo to check your garden.");
    expect(routeSource + rateLimitSource).not.toContain("You can check the garden again in a little while.");
    expect(routeSource + rateLimitSource).not.toContain("plant questions are queued");
    expect(routeSource + rateLimitSource).not.toContain("plant question limit");
    expect(routeSource).not.toContain("Concrete next actions");
    expect(routeSource).not.toContain("concrete next actions");
  });
});
