import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DIAGNOSE_COPY, DiagnosePanel } from "@/components/diagnose-panel";

describe("DiagnosePanel content", () => {
  it("uses gardener-facing copy for plant questions", () => {
    const html = renderToStaticMarkup(
      createElement(DiagnosePanel, {
        context: {
          name: "Autumn Sage",
          season: "Late spring"
        },
        addObservation: async () => undefined,
        addTask: async () => undefined
      })
    );

    expect(html).toContain("Ask about this plant");
    expect(html).toContain("Add what changed on Autumn Sage.");
    expect(html).toContain("A little context makes the answer more useful.");
    expect(html).not.toContain("Keep it with this plant so the note stays where it belongs.");
    expect(html).not.toContain("Keep it with this plant so the note stays in the right spot.");
    expect(html).not.toContain("Save it with this plant so the note stays in the right spot.");
    expect(html).not.toContain("future checks remember");
    expect(html).not.toContain("Its notes, bed, and season stay with this check.");
    expect(html).not.toContain("Check this plant");
    expect(html).not.toContain("Add what you see");
    expect(html).not.toContain("help narrow what to check");
    expect(html).toContain("What changed on this plant?");
    expect(html).not.toContain("What are you seeing?");
    expect(html).toContain("Add a photo (optional)");
    expect(html).toContain("Get care help");
    expect(html).not.toContain("Get guidance");
    expect(DIAGNOSE_COPY.previewAlt).toBe("Photo you added for this plant");
    expect(DIAGNOSE_COPY.saveHint).toBe("Kept with this plant so you remember what helped.");
    expect(DIAGNOSE_COPY.saveHint).not.toContain("Saved with");
    expect(DIAGNOSE_COPY.saveHint).not.toContain("next time starts with what you tried");
    expect(DIAGNOSE_COPY.unavailableFallback).toContain("We couldn't look at this plant right now");
    expect(DIAGNOSE_COPY.networkError).toContain("keep a note and try again");
    expect(DIAGNOSE_COPY.networkError).not.toContain("save a note");
    expect(html).not.toContain("Save to this plant");
    expect(html).not.toContain("Garden.io uses");
    expect(html).not.toContain("Get garden guidance");
    expect(html).not.toContain("help shape a useful answer");
    expect(DIAGNOSE_COPY.saveHint).not.toContain("Keeps this with the plant so you remember what you tried.");
    expect(html).not.toContain("help suggest what to try next");
    expect(DIAGNOSE_COPY.saveHint).not.toContain("future suggestions");
    expect(DIAGNOSE_COPY.saveHint).not.toContain("Saves this check with the plant's notes and care list");
    expect(html).not.toContain("Check a plant problem");
    expect(html).not.toContain("narrow likely causes");
    expect(html).not.toContain("turn the next step into a task");
    expect(html).not.toContain("diagnosis assistant");
    expect(html).not.toContain("Ask what to do next");
    expect(Object.values(DIAGNOSE_COPY).join(" ")).not.toContain("what to do next");
    expect(html).not.toContain("Get a next step");
    expect(Object.values(DIAGNOSE_COPY).join(" ")).not.toContain("assistant");
    expect(Object.values(DIAGNOSE_COPY).join(" ")).not.toContain("Care Timeline");
    expect(Object.values(DIAGNOSE_COPY).join(" ")).not.toContain("tasks");
    expect(Object.values(DIAGNOSE_COPY).join(" ")).not.toContain("reading");
    expect(Object.values(DIAGNOSE_COPY).join(" ")).not.toContain("problem checks");
    expect(Object.values(DIAGNOSE_COPY).join(" ")).not.toContain("could not run");
    expect(Object.values(DIAGNOSE_COPY).join(" ")).not.toContain("future care tips use it");
    const source = Object.values(DIAGNOSE_COPY).join(" ");
    expect(source).not.toContain("plant check");
    const panelSource = readFileSync(new URL("../components/diagnose-panel.tsx", import.meta.url), "utf8");
    expect(panelSource).toContain("Looking closely...");
    expect(panelSource).toContain("Looking over this plant...");
    expect(panelSource).toContain("Looking over {context.name}...");
    expect(panelSource).not.toContain("Reading notes...");
    expect(panelSource).not.toContain("Reading plant notes...");
    expect(panelSource).not.toContain("Reading notes for {context.name}...");
    expect(panelSource).toContain("Watch for:");
    expect(panelSource).toContain("Needs a closer look");
    expect(panelSource).toContain("Keep with this plant");
    expect(panelSource).not.toContain("Worth checking");
    expect(panelSource).not.toContain("Save and check this plant");
    expect(panelSource).not.toContain("Save to this plant");
    expect(panelSource).not.toContain('saved ? "Saved"');
    expect(panelSource).not.toContain("Checking…");
    expect(panelSource).not.toContain("Checking this plant...");
    expect(panelSource).not.toContain("Checking {context.name}...");
    expect(panelSource).not.toContain("Look for:");
  });

  it("uses care-first result labels in saved diagnosis copy", () => {
    const source = readFileSync(new URL("../components/diagnose-panel.tsx", import.meta.url), "utf8");

    expect(source).toContain("Plant note");
    expect(source).toContain("From this plant note:");
    expect(source).not.toContain("Plant check —");
    expect(source).not.toContain("From this plant check:");
    expect(source).toContain("Try first");
    expect(source).not.toContain("From asking about");
    expect(source).not.toContain("Asked for garden guidance");
    expect(source).not.toContain("Try next");
  });
});
