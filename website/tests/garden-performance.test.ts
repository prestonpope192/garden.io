import { describe, expect, it } from "vitest";
import {
  buildPerformanceMemory,
  classifyPerformance,
  describePerformance,
} from "@/lib/garden-performance";
import type { GardenPlantInstance, GardenPlantOutcome } from "@/lib/garden-app-types";

function makePlant(overrides: Partial<GardenPlantInstance> = {}): GardenPlantInstance {
  return {
    id: "plant-1",
    property_id: "prop-1",
    zone_id: "zone-1",
    bed_id: "bed-1",
    plant_profile_id: "tomato",
    plant_profile: null,
    quantity: 1,
    status: "growing",
    planted_on: "2026-05-01",
    notes: null,
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
    ...overrides,
  };
}

function makeOutcome(overrides: Partial<GardenPlantOutcome> = {}): GardenPlantOutcome {
  return {
    id: "o-1",
    property_id: "prop-1",
    plant_instance_id: "plant-1",
    result: "success",
    harvest_quantity: 2,
    harvest_unit: "kg",
    quality_rating: 5,
    harvested_on: "2026-06-01",
    notes: null,
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    ...overrides,
  };
}

describe("buildPerformanceMemory", () => {
  it("aggregates outcomes by bed×profile and by profile", () => {
    const plants = [
      makePlant({ id: "p1", bed_id: "bedA", plant_profile_id: "tomato" }),
      makePlant({ id: "p2", bed_id: "bedB", plant_profile_id: "tomato" }),
    ];
    const outcomes = [
      makeOutcome({ id: "o1", plant_instance_id: "p1", quality_rating: 4, harvest_quantity: 3 }),
      makeOutcome({ id: "o2", plant_instance_id: "p1", quality_rating: 5, harvest_quantity: 2 }),
      makeOutcome({ id: "o3", plant_instance_id: "p2", quality_rating: 2, harvest_quantity: 1, result: "partial" }),
    ];
    const mem = buildPerformanceMemory(plants, outcomes);

    const bedA = mem.byBedProfile.get("bedA::tomato");
    expect(bedA?.count).toBe(2);
    expect(bedA?.avgQuality).toBe(4.5);
    expect(bedA?.totalHarvest).toBe(5);

    const profile = mem.byProfile.get("tomato");
    expect(profile?.count).toBe(3); // across both beds
    expect(profile?.successCount).toBe(2);
    expect(profile?.partialCount).toBe(1);
  });

  it("ignores nulls in averages and skips orphaned outcomes", () => {
    const plants = [makePlant({ id: "p1", plant_profile_id: "kale" })];
    const outcomes = [
      makeOutcome({ id: "o1", plant_instance_id: "p1", quality_rating: 4, harvest_quantity: null }),
      makeOutcome({ id: "o2", plant_instance_id: "p1", quality_rating: null, harvest_quantity: 3 }),
      makeOutcome({ id: "orphan", plant_instance_id: "ghost" }), // no such plant
    ];
    const mem = buildPerformanceMemory(plants, outcomes);
    const stat = mem.byProfile.get("kale");
    expect(stat?.count).toBe(2); // orphan excluded
    expect(stat?.avgQuality).toBe(4); // only one quality value counted
    expect(stat?.totalHarvest).toBe(3); // only one harvest value counted
  });

  it("tracks the most recent result by date", () => {
    const plants = [makePlant({ id: "p1", plant_profile_id: "bean" })];
    const mem = buildPerformanceMemory(plants, [
      makeOutcome({ id: "old", plant_instance_id: "p1", harvested_on: "2026-05-01", result: "success" }),
      makeOutcome({ id: "new", plant_instance_id: "p1", harvested_on: "2026-07-01", result: "failure" }),
    ]);
    const stat = mem.byProfile.get("bean");
    expect(stat?.lastResult).toBe("failure");
    expect(stat?.lastDate).toBe("2026-07-01");
  });
});

describe("classifyPerformance", () => {
  const base = { count: 1, avgQuality: null, successCount: 0, partialCount: 0, failureCount: 0, totalHarvest: null, lastResult: null, lastDate: null };
  it("marks high quality / more wins as strong", () => {
    expect(classifyPerformance({ ...base, avgQuality: 4.5 })).toBe("strong");
    expect(classifyPerformance({ ...base, count: 3, successCount: 3 })).toBe("strong");
  });
  it("marks low quality / more losses as weak", () => {
    expect(classifyPerformance({ ...base, avgQuality: 2 })).toBe("weak");
    expect(classifyPerformance({ ...base, count: 2, failureCount: 2 })).toBe("weak");
  });
  it("is mixed when there is no history or no clear signal", () => {
    expect(classifyPerformance({ ...base, count: 0 })).toBe("mixed");
    expect(classifyPerformance({ ...base, avgQuality: 3.2 })).toBe("mixed");
  });
});

describe("describePerformance", () => {
  it("renders a readable one-liner with verdict counts", () => {
    const s = describePerformance({ count: 3, avgQuality: 4.333, successCount: 2, partialCount: 1, failureCount: 0, totalHarvest: 9, lastResult: "success", lastDate: "2026-06-01" });
    expect(s).toContain("averaged 4.3/5 over 3 recorded harvests");
    expect(s).toContain("2 success");
    expect(s).toContain("1 partial");
  });
});
