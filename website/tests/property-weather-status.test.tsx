// @vitest-environment jsdom
import { createElement } from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PropertyView } from "@/components/views/property-view";
import { buildDemoGardenSnapshot } from "@/lib/demo-garden-snapshot";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => undefined
  })
}));

const noop = async () => undefined;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function renderDemoProperty() {
  const snapshot = buildDemoGardenSnapshot([]);
  const activeProperty = {
    ...snapshot.properties[0],
    latitude: 41.8781,
    longitude: -87.6298,
    location_label: "Chicago, Illinois"
  };
  const activeZone = snapshot.zones[0] ?? null;

  return render(
    createElement(PropertyView, {
      activeProperty,
      activeZone,
      activeBed: null,
      activePlant: null,
      zones: snapshot.zones,
      beds: snapshot.beds,
      plants: snapshot.plants,
      plantProfiles: snapshot.plantProfiles,
      observations: snapshot.observations,
      tasks: snapshot.tasks,
      outcomes: snapshot.outcomes,
      selectedZoneId: activeZone?.id ?? "",
      selectedBedId: "",
      selectedPlantId: "",
      setSelectedZoneId: () => undefined,
      setSelectedBedId: () => undefined,
      setSelectedPlantId: () => undefined,
      isSaving: false,
      isLoading: false,
      createProperty: noop,
      updateProperty: noop,
      deleteProperty: noop,
      createZone: noop,
      updateZone: noop,
      deleteZone: noop,
      mediaUrls: {},
      createBed: noop,
      updateBed: noop,
      deleteBed: noop,
      addPlant: noop,
      updatePlant: noop,
      deletePlant: noop,
      updatePlantStatus: noop,
      addObservation: noop,
      deleteObservation: noop,
      addTask: noop,
      updateTaskStatus: noop,
      deleteTask: noop,
      addPlantOutcome: noop,
      deletePlantOutcome: noop
    })
  );
}

describe("PropertyView weather status", () => {
  it("shows a quiet Suggestions notice when the frost forecast check is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        json: async () => ({ ok: false })
      }))
    );

    renderDemoProperty();

    fireEvent.click(screen.getByRole("tab", { name: "Suggestions" }));

    expect(
      await screen.findByText("Weather check unavailable. Frost alerts will try again later.")
    ).toBeTruthy();
  });

  it("keeps geocode failure copy quiet and recoverable", () => {
    const propertySource = readFileSync("components/views/property-view.tsx", "utf8");

    expect(propertySource).toContain("Location search unavailable. You can add it later.");
    expect(propertySource).not.toContain("Geocoding service unavailable.");
  });
});
