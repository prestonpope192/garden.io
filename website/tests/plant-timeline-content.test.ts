import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PLANT_TIMELINE_COPY, PlantTimeline } from "@/components/plant-timeline";
import { buildDemoGardenSnapshot } from "@/lib/demo-garden-snapshot";
import type { GardenPlantOutcome } from "@/lib/garden-app-types";
import { formatSuggestionSignal, type GardenSuggestion } from "@/lib/garden-suggestions";

const noop = async () => undefined;

describe("PlantTimeline content", () => {
  it("uses gardener-facing dates and outcome wording", () => {
    const snapshot = buildDemoGardenSnapshot([]);
    const plant = snapshot.plants[0];
    const outcome: GardenPlantOutcome = {
      id: "outcome-how-it-went",
      property_id: plant.property_id,
      plant_instance_id: plant.id,
      result: "failure",
      harvest_quantity: null,
      harvest_unit: null,
      quality_rating: null,
      harvested_on: "2026-06-01",
      notes: "Bolted before harvest.",
      created_at: "2026-06-01T00:00:00Z",
      updated_at: "2026-06-01T00:00:00Z"
    };

    const html = renderToStaticMarkup(
      createElement(PlantTimeline, {
        plant,
        observations: snapshot.observations,
        tasks: snapshot.tasks,
        outcomes: [outcome],
        suggestions: [],
        mediaUrls: {},
        today: "2026-06-22",
        addTask: noop,
        addPlantOutcome: noop,
        deletePlantOutcome: noop
      })
    );

    expect(html).toContain("Plant journal");
    expect(html).toContain("planting");
    expect(html).toContain("What happened");
    expect(html).toContain("didn&#x27;t work");
    expect(html).toContain(PLANT_TIMELINE_COPY.addOutcome);
    expect(html).toContain(PLANT_TIMELINE_COPY.removeOutcome);
    expect(PLANT_TIMELINE_COPY.removeOutcome).toBe("Remove entry");
    expect(PLANT_TIMELINE_COPY.outcomeHeading).toBe("How did this planting go?");
    expect(PLANT_TIMELINE_COPY.saveOutcome).toBe("Keep in plant journal");
    expect(PLANT_TIMELINE_COPY.empty).toContain("Keep a note, photo, harvest, or lesson");
    expect(html).not.toContain("Plant history");
    expect(html).not.toContain("Remove from history");
    expect(PLANT_TIMELINE_COPY.empty).not.toContain("No plant history yet");
    expect(PLANT_TIMELINE_COPY.empty).not.toContain("Save a note");
    expect(html).not.toContain("did not work");
    expect(html).not.toContain("Add harvest or result");
    expect(html).not.toContain("Save to plant journal");
    expect(html).not.toContain("Save result");
    expect(html).not.toContain("+ Add harvest");
    expect(html).not.toContain("Mixed result");
    expect(html).not.toContain("How it went");
    expect(html).not.toContain(">Result<");
    expect(html).not.toContain(">milestone<");
    expect(html).not.toMatch(/\b2026-\d{2}-\d{2}\b/);
  });

  it("labels suggestions as care ideas instead of product steps", () => {
    const snapshot = buildDemoGardenSnapshot([]);
    const plant = snapshot.plants[0];
    const suggestion = {
      id: "care-idea",
      type: "suggestion",
      title: "Shade seedlings before afternoon heat",
      rationale: "This bed runs hot when the afternoon sun settles in.",
      confidence: "medium",
      taskTitle: "Shade seedlings",
      windowLabel: "this week",
      dueInDays: 1
    } satisfies GardenSuggestion;

    const html = renderToStaticMarkup(
      createElement(PlantTimeline, {
        plant,
        observations: [],
        tasks: [],
        outcomes: [],
        suggestions: [suggestion],
        mediaUrls: {},
        today: "2026-06-22",
        addTask: noop,
        addPlantOutcome: noop,
        deletePlantOutcome: noop
      })
    );

    expect(html).toContain("care idea");
    expect(html).not.toContain("next step");
    expect(html).not.toContain("Worth checking");
    expect(formatSuggestionSignal("medium")).toBe("Worth a look");
  });
});
