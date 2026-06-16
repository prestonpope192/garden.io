import { describe, expect, it } from "vitest";
import { generateSuggestions } from "@/lib/garden-suggestions";
import type {
  GardenBed,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantProfile,
} from "@/lib/garden-app-types";

function makeProfile(overrides: Partial<GardenPlantProfile> = {}): GardenPlantProfile {
  return {
    plant_profile_id: "cosmos",
    slug: "cosmos",
    plant_taxon_id: "t",
    plant_cultivar_id: null,
    display_name: "Cosmos",
    plant_type_code: "flower",
    lifecycle_type: "annual",
    botanical_name_full: "Cosmos bipinnatus",
    primary_common_name: "Cosmos",
    short_description: null,
    why_plant_it: null,
    primary_use_cases: null,
    preferred_light: "full_sun",
    mature_height_min_in: null,
    mature_height_max_in: null,
    mature_width_min_in: null,
    mature_width_max_in: null,
    water_need_level: "medium",
    propagation_methods: [],
    drainage_requirement: null,
    texture_preferences: {},
    preferred_soil_texture_codes: [],
    soil_texture_summary: null,
    primary_image_url: null,
    ratings: {},
    ...overrides,
  };
}

function makePlant(overrides: Partial<GardenPlantInstance> = {}): GardenPlantInstance {
  return {
    id: "cur",
    property_id: "prop-1",
    zone_id: "zone-1",
    bed_id: "bedA",
    plant_profile_id: "cosmos",
    plant_profile: makeProfile(),
    quantity: 1,
    status: "growing",
    planted_on: "2026-01-01", // old, so the "water-in" heuristic doesn't fire
    notes: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeOutcome(overrides: Partial<GardenPlantOutcome> = {}): GardenPlantOutcome {
  return {
    id: "o-1",
    property_id: "prop-1",
    plant_instance_id: "cur",
    result: "success",
    harvest_quantity: 2,
    harvest_unit: "bunches",
    quality_rating: 5,
    harvested_on: "2026-06-01",
    notes: null,
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    ...overrides,
  };
}

const baseInput = {
  property: null,
  zone: null,
  bed: null,
  plant: null,
  zones: [],
  beds: [],
  plants: [],
  season: "Winter" as const,
  existingTaskTitles: [],
};

describe("history-cited suggestions", () => {
  it("emits a strong-history insight for a plant with a good track record", () => {
    const plant = makePlant();
    const out = generateSuggestions({
      ...baseInput,
      focus: "plant",
      plant,
      plants: [plant],
      outcomes: [
        makeOutcome({ id: "a", quality_rating: 5, result: "success" }),
        makeOutcome({ id: "b", quality_rating: 4, result: "success" }),
      ],
    });
    const insight = out.find((s) => s.id === "plant:cur:history-strong");
    expect(insight).toBeDefined();
    expect(insight?.type).toBe("insight");
    expect(insight?.rationale).toContain("averaged 4.5/5");
  });

  it("emits a warning for a plant with a poor track record", () => {
    const plant = makePlant();
    const out = generateSuggestions({
      ...baseInput,
      focus: "plant",
      plant,
      plants: [plant],
      outcomes: [
        makeOutcome({ id: "a", quality_rating: 2, result: "failure" }),
        makeOutcome({ id: "b", quality_rating: 2, result: "partial" }),
      ],
    });
    const warning = out.find((s) => s.id === "plant:cur:history-weak");
    expect(warning).toBeDefined();
    expect(warning?.type).toBe("warning");
  });

  it("emits nothing history-related when there are no outcomes", () => {
    const plant = makePlant();
    const out = generateSuggestions({
      ...baseInput,
      focus: "plant",
      plant,
      plants: [plant],
      outcomes: [],
    });
    expect(out.some((s) => s.id.includes("history"))).toBe(false);
  });

  it("cites a winning crop for a bed", () => {
    const bed: GardenBed = {
      id: "bedA",
      property_id: "prop-1",
      zone_id: "zone-1",
      name: "Bed A",
      sun: null,
      water: null,
      soil: null,
      notes: null,
      sort_order: 0,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };
    const plant = makePlant({ id: "cur", bed_id: "bedA", plant_profile_id: "cosmos" });
    const out = generateSuggestions({
      ...baseInput,
      focus: "bed",
      bed,
      beds: [bed],
      plants: [plant],
      outcomes: [makeOutcome({ id: "a", plant_instance_id: "cur", quality_rating: 5, result: "success" })],
    });
    const opp = out.find((s) => s.id === "bed:bedA:history-win-cosmos");
    expect(opp).toBeDefined();
    expect(opp?.type).toBe("opportunity");
    expect(opp?.title).toContain("Cosmos");
    expect(opp?.title).toContain("Bed A");
  });
});
