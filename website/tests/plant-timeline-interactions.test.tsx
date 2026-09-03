// @vitest-environment jsdom
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PlantTimeline, type PlantTimelineProps } from "@/components/plant-timeline";
import { buildDemoGardenSnapshot } from "@/lib/demo-garden-snapshot";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderTimeline(addPlantOutcome: PlantTimelineProps["addPlantOutcome"]) {
  const snapshot = buildDemoGardenSnapshot([]);
  const plant = snapshot.plants.find((candidate) => candidate.id === "demo-plant-bell-pepper")!;

  render(
    createElement(PlantTimeline, {
      plant,
      observations: snapshot.observations,
      tasks: snapshot.tasks,
      outcomes: snapshot.outcomes,
      suggestions: [],
      mediaUrls: {},
      today: "2026-07-10",
      addTask: async () => undefined,
      addPlantOutcome,
      deletePlantOutcome: async () => undefined,
    })
  );

  return plant;
}

describe("PlantTimeline outcome capture", () => {
  it("records a complete harvest or lesson and closes after confirmation", async () => {
    const addPlantOutcome = vi.fn(async () => undefined);
    const plant = renderTimeline(addPlantOutcome);

    fireEvent.click(screen.getByRole("button", { name: "Add harvest or lesson" }));
    fireEvent.change(screen.getByLabelText("What happened"), { target: { value: "success" } });
    fireEvent.change(screen.getByLabelText("Harvest amount"), { target: { value: "4.5" } });
    fireEvent.change(screen.getByLabelText("Unit"), { target: { value: "lb" } });
    fireEvent.change(screen.getByLabelText("Harvest quality"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("Harvested on"), { target: { value: "2026-07-08" } });
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: "Steady watering helped through the hot stretch." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Keep in plant journal" }));

    await waitFor(() => expect(addPlantOutcome).toHaveBeenCalledTimes(1));
    expect(addPlantOutcome).toHaveBeenCalledWith(plant, {
      result: "success",
      harvestQuantity: 4.5,
      harvestUnit: "lb",
      qualityRating: 4,
      harvestedOn: "2026-07-08",
      notes: "Steady watering helped through the hot stretch.",
    });
    await waitFor(() => expect(screen.getByRole("button", { name: "Add harvest or lesson" })).toBeTruthy());
  });

  it("keeps the entered outcome open when persistence fails", async () => {
    const addPlantOutcome = vi.fn(async () => {
      throw new Error("save failed");
    });
    renderTimeline(addPlantOutcome);

    fireEvent.click(screen.getByRole("button", { name: "Add harvest or lesson" }));
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Try afternoon shade next year." } });
    fireEvent.click(screen.getByRole("button", { name: "Keep in plant journal" }));

    await waitFor(() => expect(addPlantOutcome).toHaveBeenCalledTimes(1));
    expect(screen.getByLabelText("Notes")).toHaveProperty("value", "Try afternoon shade next year.");
    expect(screen.getByRole("button", { name: "Keep in plant journal" })).toBeTruthy();
  });
});
