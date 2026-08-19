import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("repository hygiene", () => {
  it("keeps browser profiles and generated test artifacts out of the tracked set", () => {
    const repoRoot = process.cwd().replace(/\/website$/, "");
    const tracked = execFileSync("git", ["-C", repoRoot, "ls-files", "-z"], { encoding: "utf8" })
      .split("\0")
      .filter(Boolean);

    expect(tracked.some((file) => file.startsWith("website/test-results/"))).toBe(false);
    expect(tracked.some((file) => /(^|\/)(Cookies|Login Data|Web Data|Local State)$/i.test(file))).toBe(false);
  });
});
