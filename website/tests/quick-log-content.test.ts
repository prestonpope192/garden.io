import { createElement } from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { QUICK_LOG_COPY, QuickLog } from "@/components/quick-log";

const noop = async () => undefined;

describe("QuickLog content", () => {
  it("frames garden capture as keeping a useful note", () => {
    const html = renderToStaticMarkup(
      createElement(QuickLog, {
        zones: [],
        beds: [],
        plants: [],
        activeZoneId: "",
        activeBedId: "",
        activePlantId: "",
        busy: false,
        onLog: noop
      })
    );
    const copy = Object.values(QUICK_LOG_COPY).join(" ");

    expect(html).toContain("Add note");
    expect(html).toContain("Add a garden note or photo");
    expect(copy).toContain("Keep a garden note");
    expect(copy).toContain("What did you notice?");
    expect(copy).toContain("Keep with");
    expect(copy).toContain("Keep in garden");
    expect(copy).toContain("Keeping...");
    expect(copy).not.toContain("Save what happened");
    expect(copy).not.toContain("Save with");
    expect(copy).not.toContain("Save to garden");
    expect(copy).not.toContain("Save update");
    expect(copy).not.toContain("garden update");
    expect(copy).not.toContain("What changed?");
    expect(copy).not.toContain("Attach it to");
    expect(copy).not.toContain("Where should this go?");
    expect(copy).not.toContain("Where to save it");
    expect(copy).not.toContain("Save it with");
    expect(copy).not.toContain("Close note form");
    expect(copy).not.toContain("Save note");
    expect(copy).not.toMatch(/quick log/i);
    expect(copy).not.toMatch(/journal/i);
  });

  it("keeps note capture forms focused on what the gardener noticed", () => {
    const files = [
      "../components/views/property-view.tsx",
      "../components/views/plants-view.tsx",
      "../components/garden-app.tsx",
      "../components/garden-app-preview.tsx"
    ];
    const source = files.map((file) => readFileSync(new URL(file, import.meta.url), "utf8")).join("\n");
    const quickLogSource = readFileSync(new URL("../components/quick-log.tsx", import.meta.url), "utf8");

    expect(source).toContain("Add a note when you see a change.");
    expect(source).not.toContain("Add a note when you notice something.");
    expect(source).toContain("First tomato, aphids on kale, rain soaked the beds...");
    expect(source).toContain("Keep in garden");
    expect(source).not.toContain("Save to garden");
    expect(source).toContain("Keep a garden note");
    expect(source).not.toContain("Save what happened");
    expect(source).toContain("Save and get care help");
    expect(source).not.toContain("Save and check this plant");
    expect(source).not.toContain("Save and ask about this plant");
    expect(quickLogSource).toContain("Keep with");
    expect(quickLogSource).not.toContain("Save with");
    expect(quickLogSource).toContain("{zone.name} place");
    expect(quickLogSource).not.toContain("{zone.name} area");
    expect(quickLogSource).toContain("{bed.name} in {getZoneName(zones, bed.zone_id)}");
    expect(quickLogSource).toContain("{getCatalogPlantName(plant)} in {getBedName(beds, plant.bed_id)}");
    expect(quickLogSource).not.toContain("Area ·");
    expect(quickLogSource).not.toContain("Bed ·");
    expect(quickLogSource).not.toContain("Plant ·");
    expect(quickLogSource).not.toContain("›");
    expect(quickLogSource).not.toContain("{bed.name} bed");
    expect(quickLogSource).not.toContain("Where to save it");
    expect(quickLogSource).not.toContain("Save it with");
    expect(source).not.toContain("Save update");
    expect(source).not.toContain("when something changes");
    expect(source).not.toContain("Bloomed, watered deeply, spotted aphids, harvested basil...");
  });
});
