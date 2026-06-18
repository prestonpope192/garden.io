import { describe, expect, it } from "vitest";
import { getOpenTasks, getPlantName, getSnapshotReadiness } from "@/lib/garden-app-helpers";
import type { GardenPlantInstance, GardenPlantProfile, GardenSnapshot, GardenTask } from "@/lib/garden-app-types";

const baseSnapshot: GardenSnapshot = {
  plantProfiles: [],
  properties: [],
  zones: [],
  beds: [],
  plants: [],
  observations: [],
  tasks: [],
  outcomes: [],
  wishlist: []
};

describe("garden app helpers", () => {
  it("tracks records-only MVP readiness", () => {
    const readiness = getSnapshotReadiness({
      ...baseSnapshot,
      properties: [
        {
          id: "property-1",
          owner_user_id: "user-1",
          name: "Home Garden",
          label: "Garden",
          region: null,
          growing_zone: null,
          season: null,
          notes: null,
          latitude: null,
          longitude: null,
          location_label: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z"
        }
      ],
      zones: [
        {
          id: "zone-1",
          property_id: "property-1",
          name: "Kitchen",
          purpose: null,
          light: null,
          water: null,
          notes: null,
          sort_order: 0,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z"
        }
      ]
    });

    expect(readiness).toMatchObject({
      hasProperty: true,
      hasZone: true,
      hasBed: false,
      completeCount: 2
    });
  });

  it("sorts open tasks by due date and hides completed tasks", () => {
    const tasks: GardenTask[] = [
      {
        id: "task-1",
        property_id: "property-1",
        zone_id: null,
        bed_id: null,
        plant_instance_id: null,
        title: "Later",
        notes: null,
        due_on: "2026-06-01",
        status: "open",
        completed_at: null,
        created_at: "2026-01-02T00:00:00Z",
        updated_at: "2026-01-02T00:00:00Z"
      },
      {
        id: "task-2",
        property_id: "property-1",
        zone_id: null,
        bed_id: null,
        plant_instance_id: null,
        title: "Done",
        notes: null,
        due_on: "2026-05-20",
        status: "done",
        completed_at: "2026-05-20T00:00:00Z",
        created_at: "2026-01-03T00:00:00Z",
        updated_at: "2026-01-03T00:00:00Z"
      },
      {
        id: "task-3",
        property_id: "property-1",
        zone_id: null,
        bed_id: null,
        plant_instance_id: null,
        title: "Sooner",
        notes: null,
        due_on: "2026-05-22",
        status: "open",
        completed_at: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z"
      }
    ];

    expect(getOpenTasks(tasks).map((task) => task.title)).toEqual(["Sooner", "Later"]);
  });

  it("reads plant display names from the joined plant profile", () => {
    const plantProfile: GardenPlantProfile = {
      slug: "cherokee-purple-tomato",
      plant_profile_id: "profile-1",
      plant_taxon_id: "taxon-1",
      plant_cultivar_id: null,
      display_name: "Cherokee Purple Tomato",
      plant_type_code: "vegetable",
      lifecycle_type: "annual",
      botanical_name_full: "Solanum lycopersicum",
      primary_common_name: "Cherokee Purple Tomato",
      short_description: "A full-flavor slicing tomato.",
      why_plant_it: null,
      primary_use_cases: null,
      preferred_light: "Full",
      water_need_level: "medium",
      propagation_methods: [],
      drainage_requirement: "Well-drained",
      texture_preferences: {},
      preferred_soil_texture_codes: [],
      soil_texture_summary: null,
      primary_image_url: null,
      ratings: {}
    };
    const plants: GardenPlantInstance[] = [
      {
        id: "plant-1",
        property_id: "property-1",
        zone_id: "zone-1",
        bed_id: "bed-1",
        plant_profile_id: plantProfile.plant_profile_id,
        plant_profile: plantProfile,
        quantity: 3,
        status: "growing",
        planted_on: "2026-05-01",
        notes: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z"
      }
    ];

    expect(getPlantName(plants, "plant-1")).toBe("Cherokee Purple Tomato");
  });
});
