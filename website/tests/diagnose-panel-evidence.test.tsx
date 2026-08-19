// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DiagnosePanel } from "@/components/diagnose-panel";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("DiagnosePanel evidence", () => {
  it("shows the evidence and confirmation instruction returned by the route", async () => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      ok: true,
      diagnosis: {
        summary: "The lower leaves may be reacting to a watering change.",
        causes: [{ cause: "Watering stress", confidence: "medium", detail: "The leaf position makes this plausible." }],
        actions: ["Check soil moisture."],
        follow_up: "Watch new growth.",
        evidence: [{ fact: "The lower leaves are yellowing.", source: "grower_report", used_for: "supports the hypothesis" }],
        needs_confirmation: true
      }
    }), { status: 200, headers: { "content-type": "application/json" } })));

    render(<DiagnosePanel
      context={{ name: "Autumn Sage" }}
      addTask={async () => undefined}
      addObservation={async () => undefined}
    />);
    fireEvent.change(screen.getByLabelText("What changed on this plant?"), {
      target: { value: "lower leaves yellowing" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Ask about Autumn Sage" }));

    expect(await screen.findByText("Why it fits this garden")).toBeTruthy();
    expect(screen.getByText("The lower leaves are yellowing.")).toBeTruthy();
    expect(screen.getByText(/Confirm before acting:/)).toBeTruthy();
  });
});
