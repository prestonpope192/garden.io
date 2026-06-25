import { describe, expect, it } from "vitest";
import nextConfig from "../next.config.mjs";

describe("Next.js app config", () => {
  it("keeps local design review screenshots free of the development indicator", () => {
    expect(nextConfig.devIndicators).toBe(false);
  });
});
