import { describe, expect, it, vi } from "vitest";

const redirectMock = vi.hoisted(() =>
  vi.fn((target: string) => {
    throw new Error(`redirect:${target}`);
  })
);

vi.mock("next/navigation", () => ({
  redirect: redirectMock
}));

describe("app entry redirect", () => {
  it("preserves auth and deep-link query state when entering through /app", async () => {
    const { default: PrototypeNotebookHome } = await import("@/app/app/page");

    await expect(
      PrototypeNotebookHome({
        searchParams: Promise.resolve({
          auth: "sent",
          zone: "kitchen garden",
          tag: ["one", "two"],
          empty: undefined
        })
      })
    ).rejects.toThrow("redirect:/app/my-property?auth=sent&zone=kitchen+garden&tag=one&tag=two");

    expect(redirectMock).toHaveBeenCalledWith(
      "/app/my-property?auth=sent&zone=kitchen+garden&tag=one&tag=two"
    );
  });
});
