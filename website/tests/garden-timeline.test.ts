import { describe, expect, it } from "vitest";
import { buildPlantTimeline, summarizeOutcome } from "@/lib/garden-timeline";
import type {
  GardenObservation,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantProfile,
  GardenTask,
} from "@/lib/garden-app-types";
import type { GardenSuggestion } from "@/lib/garden-suggestions";

const TODAY = "2026-06-15";

function makeProfile(
  overrides: Partial<GardenPlantProfile> = {}
): GardenPlantProfile {
  return {
    plant_profile_id: "profile-tomato",
    slug: "tomato",
    plant_taxon_id: "taxon-tomato",
    plant_cultivar_id: null,
    display_name: "Tomato",
    plant_type_code: "vegetable",
    lifecycle_type: "annual",
    botanical_name_full: "Solanum lycopersicum",
    primary_common_name: "Tomato",
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

function makePlant(
  overrides: Partial<GardenPlantInstance> = {}
): GardenPlantInstance {
  return {
    id: "plant-1",
    property_id: "prop-1",
    zone_id: "zone-1",
    bed_id: "bed-1",
    plant_profile_id: "profile-tomato",
    plant_profile: makeProfile(),
    quantity: 1,
    status: "growing",
    planted_on: "2026-05-01",
    notes: null,
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
    ...overrides,
  };
}

function makeObservation(
  overrides: Partial<GardenObservation> = {}
): GardenObservation {
  return {
    id: "obs-1",
    property_id: "prop-1",
    zone_id: "zone-1",
    bed_id: "bed-1",
    plant_instance_id: "plant-1",
    note: "Looking healthy",
    image_path: null,
    observed_at: "2026-05-20",
    created_at: "2026-05-20T00:00:00Z",
    updated_at: "2026-05-20T00:00:00Z",
    ...overrides,
  };
}

function makeTask(overrides: Partial<GardenTask> = {}): GardenTask {
  return {
    id: "task-1",
    property_id: "prop-1",
    zone_id: "zone-1",
    bed_id: "bed-1",
    plant_instance_id: "plant-1",
    title: "Water deeply",
    notes: null,
    due_on: "2026-06-20",
    status: "open",
    completed_at: null,
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    ...overrides,
  };
}

function makeSuggestion(
  overrides: Partial<GardenSuggestion> = {}
): GardenSuggestion {
  return {
    id: "sugg-1",
    type: "suggestion",
    title: "Prune suckers and scout for hornworms",
    rationale: "Summer push — pinching suckers keeps fruit set strong.",
    confidence: "high",
    taskTitle: "Prune suckers and check for hornworms",
    windowLabel: "this week",
    dueInDays: 4,
    ...overrides,
  };
}

function makeOutcome(overrides: Partial<GardenPlantOutcome> = {}): GardenPlantOutcome {
  return {
    id: "outcome-1",
    property_id: "prop-1",
    plant_instance_id: "plant-1",
    result: "success",
    harvest_quantity: 3.5,
    harvest_unit: "kg",
    quality_rating: 4,
    harvested_on: "2026-06-05",
    notes: null,
    created_at: "2026-06-05T00:00:00Z",
    updated_at: "2026-06-05T00:00:00Z",
    ...overrides,
  };
}

describe("buildPlantTimeline", () => {
  it("buckets by nature: happened → past, to-do → upcoming", () => {
    const plant = makePlant();
    const tl = buildPlantTimeline(plant, {
      observations: [makeObservation()],
      tasks: [
        makeTask({ id: "done-1", title: "Mulched", status: "done", completed_at: "2026-05-25T00:00:00Z" }),
        makeTask({ id: "open-1", title: "Water deeply", status: "open", due_on: "2026-06-20" }),
      ],
      suggestions: [],
      outcomes: [],
      today: TODAY,
    });

    const pastKinds = tl.past.map((i) => i.id);
    expect(pastKinds).toContain("planted:plant-1"); // planting milestone
    expect(pastKinds).toContain("note:obs-1"); // observation
    expect(pastKinds).toContain("task:done-1"); // completed task
    // open task → upcoming, not past
    expect(tl.upcoming.map((i) => i.id)).toContain("task:open-1");
    expect(tl.past.map((i) => i.id)).not.toContain("task:open-1");
  });

  it("orders past oldest→newest and upcoming soonest→furthest", () => {
    const plant = makePlant({ planted_on: "2026-05-01", plant_profile: makeProfile({ days_to_maturity_min: null }) });
    const tl = buildPlantTimeline(plant, {
      observations: [
        makeObservation({ id: "late", observed_at: "2026-06-10" }),
        makeObservation({ id: "early", observed_at: "2026-05-10" }),
      ],
      tasks: [
        makeTask({ id: "far", title: "Stake", status: "open", due_on: "2026-07-01" }),
        makeTask({ id: "soon", title: "Feed", status: "open", due_on: "2026-06-18" }),
      ],
      suggestions: [],
      outcomes: [],
      today: TODAY,
    });

    const pastDates = tl.past.map((i) => i.date);
    expect(pastDates).toEqual([...pastDates].sort((a, b) => a.localeCompare(b)));
    expect(tl.past[0].id).toBe("planted:plant-1"); // oldest
    expect(tl.upcoming[0].id).toBe("task:soon");
    expect(tl.upcoming[1].id).toBe("task:far");
  });

  it("gives a brand-new planting an arc from phenology alone", () => {
    const plant = makePlant({
      planted_on: "2026-06-01",
      plant_profile: makeProfile({ days_to_maturity_min: 60, maturity_basis: "transplant" }),
    });
    const tl = buildPlantTimeline(plant, {
      observations: [],
      tasks: [],
      suggestions: [],
      outcomes: [],
      today: TODAY,
    });

    expect(tl.past.map((i) => i.id)).toEqual(["planted:plant-1"]);
    const harvest = tl.upcoming.find((i) => i.id === "harvest:plant-1");
    expect(harvest).toBeDefined();
    expect(harvest?.projected).toBe(true);
    expect(harvest?.date).toBe("2026-07-31"); // 2026-06-01 + 60 days
  });

  it("folds suggestions in but drops ones that overlap an existing task", () => {
    const plant = makePlant({ plant_profile: makeProfile({ days_to_maturity_min: null }) });
    const tl = buildPlantTimeline(plant, {
      observations: [],
      tasks: [makeTask({ id: "t-prune", title: "Prune suckers and check for hornworms", status: "open", due_on: "2026-06-19" })],
      suggestions: [
        makeSuggestion({ id: "dup", taskTitle: "Prune suckers and check for hornworms" }),
        makeSuggestion({ id: "fresh", title: "Net against birds", taskTitle: "Net against birds", dueInDays: 7 }),
      ],
      outcomes: [],
      today: TODAY,
    });

    const ids = tl.upcoming.map((i) => i.id);
    expect(ids).not.toContain("sugg:dup"); // deduped against committed task
    expect(ids).toContain("sugg:fresh");
    const fresh = tl.upcoming.find((i) => i.id === "sugg:fresh");
    expect(fresh?.date).toBe("2026-06-22"); // today + 7 days
    expect(fresh?.suggestion?.id).toBe("fresh"); // committable
  });

  it("flags overdue open tasks", () => {
    const plant = makePlant({ plant_profile: makeProfile({ days_to_maturity_min: null }) });
    const tl = buildPlantTimeline(plant, {
      observations: [],
      tasks: [
        makeTask({ id: "overdue", title: "Weed", status: "open", due_on: "2026-06-01" }),
        makeTask({ id: "future", title: "Water", status: "open", due_on: "2026-06-30" }),
      ],
      suggestions: [],
      outcomes: [],
      today: TODAY,
    });

    expect(tl.upcoming.find((i) => i.id === "task:overdue")?.overdue).toBe(true);
    expect(tl.upcoming.find((i) => i.id === "task:future")?.overdue).toBe(false);
  });

  it("derives the current lifecycle stage at the divider", () => {
    const plant = makePlant({
      planted_on: "2026-05-01",
      plant_profile: makeProfile({ days_to_maturity_min: 60, days_to_maturity_max: 60, maturity_basis: "transplant" }),
    });
    const tl = buildPlantTimeline(plant, {
      observations: [],
      tasks: [],
      suggestions: [],
      outcomes: [],
      today: TODAY,
    });
    // 45 days of 60 elapsed → ~0.75 → "Flowering"
    expect(tl.currentStage?.label).toBe("Flowering");
  });

  it("only scopes to the given plant", () => {
    const plant = makePlant({ id: "plant-1", plant_profile: makeProfile({ days_to_maturity_min: null }) });
    const tl = buildPlantTimeline(plant, {
      observations: [makeObservation({ id: "other", plant_instance_id: "plant-2" })],
      tasks: [makeTask({ id: "other-task", plant_instance_id: "plant-2", status: "open" })],
      suggestions: [],
      outcomes: [],
      today: TODAY,
    });
    expect(tl.past.map((i) => i.id)).not.toContain("note:other");
    expect(tl.upcoming.map((i) => i.id)).not.toContain("task:other-task");
  });

  it("dedups suggestions by loose (substring) title overlap, not just exact match", () => {
    const plant = makePlant({ plant_profile: makeProfile({ days_to_maturity_min: null }) });
    const tl = buildPlantTimeline(plant, {
      observations: [],
      // committed task title is a substring of the suggestion's taskTitle
      tasks: [makeTask({ id: "t-prune", title: "Prune suckers", status: "open", due_on: "2026-06-19" })],
      suggestions: [
        makeSuggestion({ id: "overlap", taskTitle: "Prune suckers and check for hornworms" }),
        makeSuggestion({ id: "distinct", title: "Feed with compost", taskTitle: "Feed with compost", dueInDays: 5 }),
      ],
      outcomes: [],
      today: TODAY,
    });
    const ids = tl.upcoming.map((i) => i.id);
    expect(ids).not.toContain("sugg:overlap"); // substring overlap → deduped
    expect(ids).toContain("sugg:distinct"); // no overlap → kept
  });

  it("handles a planting with no date and no phenology gracefully", () => {
    const plant = makePlant({ planted_on: null, plant_profile: makeProfile({ days_to_maturity_min: null }) });
    const tl = buildPlantTimeline(plant, {
      observations: [makeObservation()],
      tasks: [makeTask({ status: "open", due_on: "2026-06-20" })],
      suggestions: [],
      outcomes: [],
      today: TODAY,
    });
    expect(tl.past.map((i) => i.id)).not.toContain("planted:plant-1"); // no planting milestone
    expect(tl.upcoming.map((i) => i.id)).not.toContain("harvest:plant-1"); // no projection
    expect(tl.past.map((i) => i.id)).toContain("note:obs-1"); // notes still show
    expect(tl.currentStage).toBeNull();
  });

  it("handles a missing plant_profile without projecting harvest", () => {
    const plant = makePlant({ plant_profile: null });
    const tl = buildPlantTimeline(plant, {
      observations: [],
      tasks: [],
      suggestions: [],
      outcomes: [],
      today: TODAY,
    });
    expect(tl.past.map((i) => i.id)).toContain("planted:plant-1"); // planting still anchors the arc
    expect(tl.upcoming.map((i) => i.id)).not.toContain("harvest:plant-1");
    expect(tl.currentStage).toBeNull();
  });

  it("folds recorded outcomes into the past as harvest milestones", () => {
    const plant = makePlant({ plant_profile: makeProfile({ days_to_maturity_min: null }) });
    const tl = buildPlantTimeline(plant, {
      observations: [],
      tasks: [],
      suggestions: [],
      outcomes: [makeOutcome({ id: "o1", plant_instance_id: "plant-1", harvested_on: "2026-06-05" })],
      today: TODAY,
    });
    const item = tl.past.find((i) => i.id === "outcome:o1");
    expect(item).toBeDefined();
    expect(item?.kind).toBe("milestone");
    expect(item?.date).toBe("2026-06-05");
    expect(item?.detail).toContain("3.5 kg");
    expect(item?.detail).toContain("quality 4/5");
    expect(item?.detail).toContain("success");
    // outcomes from other plants are excluded
    expect(tl.past.map((i) => i.id)).not.toContain("outcome:other");
  });

  it("summarizeOutcome renders a compact one-liner and tolerates sparse data", () => {
    expect(summarizeOutcome(makeOutcome())).toBe("3.5 kg · quality 4/5 · success");
    expect(
      summarizeOutcome(makeOutcome({ harvest_quantity: null, quality_rating: null, result: "failure" }))
    ).toBe("failure");
    expect(
      summarizeOutcome(makeOutcome({ harvest_quantity: 6, harvest_unit: null, quality_rating: null, result: null }))
    ).toBe("6");
  });
});
