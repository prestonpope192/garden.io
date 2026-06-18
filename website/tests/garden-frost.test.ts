import { describe, expect, it } from "vitest";
import { buildFrostAlert, tenderness, type ForecastDay } from "@/lib/garden-frost";
import type { GardenPlantInstance, GardenPlantProfile } from "@/lib/garden-app-types";

const TODAY = "2026-06-16";

function makeProfile(overrides: Partial<GardenPlantProfile> = {}): GardenPlantProfile {
  return {
    plant_profile_id: "p",
    slug: "p",
    plant_taxon_id: "t",
    plant_cultivar_id: null,
    display_name: "Plant",
    plant_type_code: "vegetable",
    lifecycle_type: "annual",
    botanical_name_full: null,
    primary_common_name: null,
    short_description: null,
    why_plant_it: null,
    primary_use_cases: null,
    preferred_light: null,
    mature_height_min_in: null,
    mature_height_max_in: null,
    mature_width_min_in: null,
    mature_width_max_in: null,
    water_need_level: null,
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

let pid = 0;
function makePlant(profile: Partial<GardenPlantProfile>, status: GardenPlantInstance["status"] = "growing"): GardenPlantInstance {
  pid += 1;
  return {
    id: `plant-${pid}`,
    property_id: "prop",
    zone_id: "z",
    bed_id: "b",
    plant_profile_id: "p",
    plant_profile: makeProfile(profile),
    quantity: 1,
    status,
    planted_on: "2026-05-01",
    notes: null,
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
  };
}

const days = (lows: Array<[string, number]>): ForecastDay[] => lows.map(([date, lowF]) => ({ date, lowF }));

describe("tenderness", () => {
  it("respects an explicit frost_tender flag", () => {
    expect(tenderness(makePlant({ frost_tender: true }))).toBe(true);
    expect(tenderness(makePlant({ frost_tender: false }))).toBe(false);
  });
  it("falls back to a keyword heuristic when unflagged", () => {
    expect(tenderness(makePlant({ display_name: "Cherokee Purple Tomato" }))).toBe(true);
    expect(tenderness(makePlant({ display_name: "Genovese Basil" }))).toBe(true);
  });
  it("returns null when genuinely unknown", () => {
    expect(tenderness(makePlant({ display_name: "Mystery Shrub" }))).toBeNull();
  });
});

describe("buildFrostAlert", () => {
  it("returns null when no day is at/below threshold", () => {
    const alert = buildFrostAlert({
      days: days([["2026-06-17", 50], ["2026-06-18", 48]]),
      growingPlants: [makePlant({ frost_tender: true })],
      today: TODAY,
    });
    expect(alert).toBeNull();
  });

  it("returns null when frost is forecast but every plant is known-hardy", () => {
    const alert = buildFrostAlert({
      days: days([["2026-06-18", 30]]),
      growingPlants: [makePlant({ frost_tender: false, display_name: "Kale" })],
      today: TODAY,
    });
    expect(alert).toBeNull();
  });

  it("names tender plants when frost is forecast", () => {
    const alert = buildFrostAlert({
      days: days([["2026-06-17", 40], ["2026-06-19", 31]]),
      growingPlants: [
        makePlant({ frost_tender: true, display_name: "Tomato" }),
        makePlant({ frost_tender: false, display_name: "Kale" }),
      ],
      today: TODAY,
    });
    expect(alert).not.toBeNull();
    expect(alert!.type).toBe("warning");
    expect(alert!.title).toContain("Tomato");
    expect(alert!.rationale).toContain("31°F");
    expect(alert!.id).toBe("frost:2026-06-19"); // soonest day at/below threshold
    expect(alert!.dueInDays).toBe(3); // 06-16 -> 06-19
  });

  it("falls back to a property-level alert when no plant is identifiably tender", () => {
    const alert = buildFrostAlert({
      days: days([["2026-06-18", 28]]),
      growingPlants: [makePlant({ display_name: "Mystery Shrub" })], // unknown tenderness
      today: TODAY,
    });
    expect(alert).not.toBeNull();
    expect(alert!.title.toLowerCase()).toContain("protect tender plants");
    expect(alert!.rationale).toContain("any frost-tender plants");
  });

  it("uses the keyword heuristic to name unflagged warm-season crops", () => {
    const alert = buildFrostAlert({
      days: days([["2026-06-18", 33]]),
      growingPlants: [makePlant({ display_name: "Sweet Pepper" })],
      today: TODAY,
    });
    expect(alert!.title).toContain("Sweet Pepper");
  });

  it("ignores past days and non-growing plants", () => {
    const alert = buildFrostAlert({
      days: days([["2026-06-10", 20], ["2026-06-18", 30]]),
      growingPlants: [makePlant({ frost_tender: true, display_name: "Basil" }, "archived")],
      today: TODAY,
    });
    // only plant is archived -> no tender/unknown growing plants -> null
    expect(alert).toBeNull();
  });
});
