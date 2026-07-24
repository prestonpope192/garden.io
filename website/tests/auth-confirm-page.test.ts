import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/app/auth/confirm/page";

describe("auth confirm redirect", () => {
  it("keeps same-origin app paths", () => {
    expect(safeNextPath("/app/my-property?auth=sent", "https://garden.example")).toBe(
      "/app/my-property?auth=sent"
    );
  });

  it("rejects protocol-relative, absolute, and backslash redirect targets", () => {
    expect(safeNextPath("//attacker.example", "https://garden.example")).toBe("/app/my-property");
    expect(safeNextPath("https://attacker.example", "https://garden.example")).toBe("/app/my-property");
    expect(safeNextPath("/\\\\attacker.example", "https://garden.example")).toBe("/app/my-property");
  });
});
