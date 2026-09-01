// @vitest-environment jsdom
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { GardenAskView } from "@/components/views/garden-ask-view";
import type {
  GardenBed,
  GardenObservation,
  GardenPlantInstance,
  GardenPlantProfile,
  GardenProperty,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";

const property: GardenProperty = {
  id: "property-1",
  owner_user_id: "user-1",
  name: "Backyard Garden",
  label: "Garden",
  region: "Central Texas",
  growing_zone: "8b",
  season: "Summer",
  notes: null,
  latitude: null,
  longitude: null,
  location_label: null,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

const zone: GardenZone = {
  id: "zone-1",
  property_id: property.id,
  name: "Kitchen Garden",
  purpose: "Vegetables",
  light: "Morning sun",
  water: null,
  notes: null,
  sort_order: 0,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

const bed: GardenBed = {
  id: "bed-1",
  property_id: property.id,
  zone_id: zone.id,
  name: "Tomato Bed",
  sun: "Full sun",
  water: null,
  soil: null,
  notes: null,
  sort_order: 0,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

const profile = {
  plant_profile_id: "profile-1",
  slug: "tomato",
  display_name: "Tomato",
  primary_common_name: "Tomato",
  botanical_name_full: "Solanum lycopersicum"
} as GardenPlantProfile;

const plant = {
  id: "plant-1",
  property_id: property.id,
  zone_id: zone.id,
  bed_id: bed.id,
  plant_profile_id: profile.plant_profile_id,
  plant_profile: profile,
  quantity: 2,
  status: "growing",
  planted_on: "2026-05-01",
  notes: null,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
} as GardenPlantInstance;

const observation: GardenObservation = {
  id: "observation-1",
  property_id: property.id,
  zone_id: zone.id,
  bed_id: bed.id,
  plant_instance_id: plant.id,
  note: "First strong bloom after two hot days.",
  image_path: null,
  observed_at: "2026-06-03T00:00:00Z",
  created_at: "2026-06-03T00:00:00Z",
  updated_at: "2026-06-03T00:00:00Z"
};

const task: GardenTask = {
  id: "task-1",
  property_id: property.id,
  zone_id: zone.id,
  bed_id: bed.id,
  plant_instance_id: plant.id,
  title: "Water tomatoes",
  notes: null,
  due_on: "2026-06-03",
  status: "open",
  completed_at: null,
  created_at: "2026-06-03T00:00:00Z",
  updated_at: "2026-06-03T00:00:00Z"
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GardenAskView with an existing property", () => {
  it("retains memory, plant context, target selection, note save, and care actions", async () => {
    const quickLog = vi.fn(async () => undefined);
    const addTask = vi.fn(async () => undefined);
    const askGarden = vi.fn(async () => ({
      summary: "Water the tomatoes at the soil line.",
      causes: [{ cause: "Dry soil", confidence: "high" as const, detail: "The bed is drying between waterings." }],
      actions: ["Water slowly at the soil line.", "Check the soil again tomorrow."],
      follow_up: "Watch for leaves that stay wilted after watering."
    }));

    render(
      createElement(GardenAskView, {
        activeProperty: property,
        zones: [zone],
        beds: [bed],
        plants: [plant],
        observations: [observation],
        tasks: [task],
        isSaving: false,
        quickLog,
        addTask,
        updateTaskStatus: async () => undefined,
        askGarden,
        promptExamples: ["Why are my tomatoes wilting?"]
      })
    );

    expect(screen.getByLabelText("Garden memory snapshot").textContent).toContain("Backyard Garden");
    expect(screen.getByLabelText("Garden memory snapshot").textContent).toContain("First strong bloom after two hot days.");

    fireEvent.change(screen.getByRole("textbox", { name: "Ask about your garden" }), {
      target: { value: "Why are my tomatoes wilting?" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await screen.findByRole("heading", { name: "Water the tomatoes at the soil line." });
    const contextChip = screen.getByRole("link", { name: "Tomato" });
    expect(contextChip.getAttribute("href")).toBe("/app/my-garden?plant=plant-1");
    expect(screen.getByRole("button", { name: "Add to weekly care" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Change" }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zone:zone-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep note" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to weekly care" }));

    await waitFor(() => expect(quickLog).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(addTask).toHaveBeenCalledTimes(1));
    expect(quickLog).toHaveBeenCalledWith({
      note: "Why are my tomatoes wilting?",
      file: null,
      zoneId: "zone-1",
      bedId: null,
      plantInstanceId: null
    });
    expect(addTask).toHaveBeenCalledWith({
      title: "Water slowly at the soil line.",
      dueOn: expect.any(String),
      notes: "From this garden note: Water the tomatoes at the soil line.",
      propertyId: property.id,
      zoneId: "zone-1",
      bedId: null,
      plantInstanceId: null
    });
  });

  it("keeps a submitted photo attached when the answer is saved", async () => {
    const quickLog = vi.fn(async () => undefined);
    const photo = new File(["photo bytes"], "garden.jpg", { type: "image/jpeg" });
    const askGarden = vi.fn(async () => ({
      summary: "Check the tomato leaves for early stress.",
      causes: [],
      actions: ["Check the soil before watering."],
      follow_up: "Watch for spots that spread after the next watering."
    }));
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:garden-photo"),
      revokeObjectURL: vi.fn()
    });
    class FailingImage {
      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onerror?.();
      }
    }
    vi.stubGlobal("Image", FailingImage);

    render(
      createElement(GardenAskView, {
        activeProperty: property,
        zones: [zone],
        beds: [bed],
        plants: [plant],
        observations: [observation],
        tasks: [task],
        isSaving: false,
        quickLog,
        addTask: async () => undefined,
        updateTaskStatus: async () => undefined,
        askGarden,
        promptExamples: ["Why are my tomatoes wilting?"]
      })
    );

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput as HTMLInputElement, { target: { files: [photo] } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await screen.findByRole("heading", { name: "Check the tomato leaves for early stress." });
    fireEvent.click(screen.getByRole("button", { name: "Keep note" }));

    await waitFor(() => expect(quickLog).toHaveBeenCalledTimes(1));
    expect(quickLog).toHaveBeenCalledWith(expect.objectContaining({ file: photo }));
  });
});
