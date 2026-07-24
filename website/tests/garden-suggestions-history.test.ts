import { describe, expect, it } from "vitest";
import {
  formatSuggestionType,
  formatSuggestionWindowLabel,
  generateSuggestions
} from "@/lib/garden-suggestions";
import type {
  GardenBed,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantProfile,
  GardenProperty,
  GardenZone,
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

const baseProperty: GardenProperty = {
  id: "prop-1",
  owner_user_id: "owner-1",
  name: "Back Garden",
  label: "",
  region: null,
  growing_zone: null,
  season: "Spring",
  notes: null,
  latitude: null,
  longitude: null,
  location_label: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const baseZone: GardenZone = {
  id: "zone-1",
  property_id: "prop-1",
  name: "Kitchen Garden",
  purpose: null,
  light: null,
  water: null,
  notes: null,
  sort_order: 0,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("suggestion formatting", () => {
  it("uses user-facing labels for suggestion types", () => {
    expect(formatSuggestionType("suggestion")).toBe("Care idea");
    expect(formatSuggestionType("insight")).toBe("From your garden");
    expect(formatSuggestionType("warning")).toBe("Check soon");
    expect(formatSuggestionType("opportunity")).toBe("Good moment");
    expect(formatSuggestionType("warning")).not.toBe("Needs attention");
    expect(formatSuggestionType("opportunity")).not.toBe("Good timing");
  });

  it("uses polished timing labels for next care steps", () => {
    expect(formatSuggestionWindowLabel("later")).toBe("Later");
    expect(formatSuggestionWindowLabel("this season")).toBe("This season");
    expect(formatSuggestionWindowLabel("from your history")).toBe("From your history");
    expect(formatSuggestionWindowLabel("~10 days")).toBe("In about 10 days");
    expect(formatSuggestionWindowLabel("")).toBe("Soon");
  });
});

describe("history-cited suggestions", () => {
  it("uses place language for garden layout suggestions", () => {
    const plant = makePlant();
    const out = generateSuggestions({
      ...baseInput,
      focus: "property",
      property: baseProperty,
      zones: [baseZone],
      beds: [],
      plants: [plant],
      season: "Spring",
      outcomes: [],
    });
    const layout = out.find((s) => s.id === "property:more-beds");

    expect(layout?.title).toBe("Add one more bed when you need room");
    expect(layout?.rationale).toBe("If this place starts to feel crowded, one clear bed gives future plants a place to go.");
    expect(layout?.taskTitle).toBe("Plan one more bed");
    expect(layout?.rationale).toContain("this place");
    expect(layout?.rationale).not.toContain("this area");
    expect(layout?.title).not.toContain("productive space");
    expect(layout?.rationale).not.toContain("productive space");
    expect(layout?.title).not.toContain("Lay out more beds");
    expect(layout?.title).not.toContain("zones");
    expect(layout?.rationale).not.toContain("zones");
  });

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
    expect(insight?.title).toContain("has done well for you");
    expect(insight?.rationale).toContain("From your garden notes");
    expect(insight?.rationale).toContain("averaged 4.5/5");
    expect(insight?.taskTitle).toContain("Keep Cosmos in the plan");
    expect(insight?.title).not.toContain("track record");
    expect(insight?.rationale).not.toContain("records");
    expect(insight?.rationale).not.toContain("From what you saved");
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
    expect(warning?.title).toContain("has struggled before");
    expect(warning?.rationale).toContain("From your garden notes");
    expect(warning?.taskTitle).toContain("Check Cosmos early");
    expect(warning?.title).not.toContain("underperformed");
    expect(warning?.rationale).not.toContain("records");
    expect(warning?.rationale).not.toContain("From what you saved");
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
    expect(opp?.rationale).toContain("This pairing is working");
    expect(opp?.rationale).not.toContain("lean into it");
  });

  it("warns about a crop that has done poorly in a bed", () => {
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
      outcomes: [
        makeOutcome({ id: "a", plant_instance_id: "cur", quality_rating: 2, result: "failure" }),
        makeOutcome({ id: "b", plant_instance_id: "cur", quality_rating: 2, result: "partial" }),
      ],
    });
    const warn = out.find((s) => s.id === "bed:bedA:history-loss-cosmos");
    expect(warn).toBeDefined();
    expect(warn?.type).toBe("warning");
    expect(warn?.title).toContain("has struggled in Bed A");
    expect(warn?.rationale).toContain("Try a different bed");
    expect(warn?.taskTitle).toContain("Try a different plan for Cosmos");
    expect(warn?.title).not.toContain("underperformed");
    expect(warn?.taskTitle).not.toContain("Rethink");
  });
});

describe("plain-language suggestion copy", () => {
  it("uses direct berry protection language", () => {
    const berry = makePlant({
      plant_profile_id: "blueberry",
      plant_profile: makeProfile({
        plant_profile_id: "blueberry",
        display_name: "Blueberry",
        slug: "blueberry",
        botanical_name_full: "Vaccinium corymbosum",
        plant_type_code: "fruit",
        primary_common_name: "Blueberry"
      })
    });
    const out = generateSuggestions({
      ...baseInput,
      focus: "plant",
      plant: berry,
      plants: [berry],
      season: "Summer",
    });
    const net = out.find((s) => s.id === "plant:cur:net");

    expect(net?.title).toBe("Cover Blueberry as berries ripen");
    expect(net?.taskTitle).toBe("Cover Blueberry against birds");
    expect(net?.title).not.toContain("colours");
    expect(net?.taskTitle).not.toContain("Net Blueberry");
  });

  it("uses plain clover-or-beans language under fruit trees", () => {
    const apple = makePlant({
      plant_profile_id: "apple",
      plant_profile: makeProfile({
        plant_profile_id: "apple",
        display_name: "Apple",
        slug: "apple",
        botanical_name_full: "Malus domestica",
        plant_type_code: "tree",
        primary_common_name: "Apple"
      })
    });
    const out = generateSuggestions({
      ...baseInput,
      focus: "zone",
      zone: baseZone,
      zones: [baseZone],
      plants: [apple],
      season: "Spring",
    });
    const soilBuilder = out.find((s) => s.id === "zone:zone-1:nfixer");

    expect(soilBuilder?.title).toBe("Plant clover or beans under the trees in Kitchen Garden");
    expect(soilBuilder?.rationale).toBe("Clover or beans beneath fruit trees feed the soil and reduce fertilizer needs.");
    expect(soilBuilder?.taskTitle).toBe("Plant clover or beans in Kitchen Garden");
    expect(soilBuilder?.title).not.toContain("nitrogen-fixer");
    expect(soilBuilder?.rationale).not.toContain("fertiliser");
    expect(soilBuilder?.taskTitle).not.toContain("nitrogen-fixer");
  });

  it("spells out beneficial insects in pollinator suggestions", () => {
    const apple = makePlant({
      plant_profile_id: "apple",
      plant_profile: makeProfile({
        plant_profile_id: "apple",
        display_name: "Apple",
        slug: "apple",
        botanical_name_full: "Malus domestica",
        plant_type_code: "tree",
        primary_common_name: "Apple"
      })
    });
    const out = generateSuggestions({
      ...baseInput,
      focus: "property",
      property: baseProperty,
      zones: [baseZone],
      plants: [apple],
      season: "Spring",
    });
    const pollinator = out.find((s) => s.id === "property:pollinator-patch");

    expect(pollinator?.rationale).toContain("beneficial insects");
    expect(pollinator?.rationale).not.toContain("beneficials");
  });
});
