import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PublicCatalogueBrowser } from "@/components/public-catalogue-browser";
import type { GardenPlantProfile } from "@/lib/garden-app-types";
import {
  catalogueCategoryMatches,
  filterCatalogueProfiles,
  formatCatalogueValue,
  formatInchesRange,
  getPlantSearchText,
  getProfileTags,
  getPropagationLabels,
  getRating,
  getUseLabels
} from "@/lib/catalogue-format";

function makeProfile(overrides: Partial<GardenPlantProfile> = {}): GardenPlantProfile {
  return {
    slug: "dill",
    plant_profile_id: "profile-dill",
    plant_taxon_id: "taxon-dill",
    plant_cultivar_id: null,
    display_name: "Dill",
    plant_type_code: "herb",
    lifecycle_type: "annual",
    botanical_name_full: "Anethum graveolens",
    primary_common_name: "Dill",
    short_description: "Fast-growing annual culinary herb.",
    why_plant_it: "Useful for fresh leaves and beneficial insect flowers.",
    primary_use_cases: "Fresh herb, pollinator support",
    preferred_light: "full_sun",
    mature_height_min_in: 24,
    mature_height_max_in: 48,
    mature_width_min_in: null,
    mature_width_max_in: null,
    water_need_level: "medium",
    propagation_methods: [{ method_code: "direct_seed" }],
    drainage_requirement: "Well-drained",
    texture_preferences: {},
    preferred_soil_texture_codes: [],
    soil_texture_summary: "Loamy soil",
    primary_image_url: null,
    ratings: {
      container_suitability: {
        rating: 4,
        description: "Works in deep containers."
      }
    },
    ...overrides
  };
}

describe("catalogue formatting helpers", () => {
  it("formats catalogue labels and inch ranges for public plant facts", () => {
    expect(formatCatalogueValue("full_sun")).toBe("Full Sun");
    expect(formatCatalogueValue(null)).toBe("TBD");
    expect(formatInchesRange(24, 48)).toBe("24-48 in");
    expect(formatInchesRange(null, 12)).toBe("12 in");
  });

  it("extracts profile tags, ratings, use labels, propagation labels, and search text", () => {
    const profile = makeProfile();

    expect(getProfileTags(profile)).toEqual(["Species profile", "Annual", "Herb"]);
    expect(getRating(profile, "container_suitability")).toEqual({
      rating: "4",
      description: "Works in deep containers."
    });
    expect(getUseLabels(profile)).toEqual(["Fresh herb", "pollinator support"]);
    expect(getPropagationLabels(profile)).toEqual(["Direct Seed"]);
    expect(getPlantSearchText(profile)).toContain("pollinator support");
  });

  it("filters public catalogue profiles by query and category", () => {
    const profiles = [
      makeProfile(),
      makeProfile({
        slug: "blueberry",
        plant_profile_id: "profile-blueberry",
        display_name: "Blueberry",
        plant_type_code: "fruit",
        lifecycle_type: "perennial",
        botanical_name_full: "Vaccinium corymbosum",
        primary_use_cases: "Fruit, perennial border",
        short_description: "Acid-loving fruiting shrub."
      })
    ];

    expect(catalogueCategoryMatches(profiles[0], "herb")).toBe(true);
    expect(catalogueCategoryMatches(profiles[1], "perennial")).toBe(true);
    expect(filterCatalogueProfiles(profiles, "pollinator", "all").map((profile) => profile.slug)).toEqual(["dill"]);
    expect(filterCatalogueProfiles(profiles, "", "fruit").map((profile) => profile.slug)).toEqual(["blueberry"]);
  });
});

describe("PublicCatalogueBrowser", () => {
  it("renders the public catalogue shell with search, categories, and a field-guide link", () => {
    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        plantProfiles: [
          makeProfile(),
          makeProfile({
            slug: "blueberry",
            plant_profile_id: "profile-blueberry",
            display_name: "Blueberry",
            plant_type_code: "fruit",
            lifecycle_type: "perennial",
            botanical_name_full: "Vaccinium corymbosum",
            primary_use_cases: "Fruit, perennial border"
          })
        ]
      })
    );

    expect(html).toContain("A searchable field guide");
    expect(html).toContain("Search plants, shade, pollinators");
    expect(html).toContain("Botanical index");
    expect(html).toContain("Specimen index");
    expect(html).toContain("Herbs");
    expect(html).toContain("Fruit");
    expect(html).toContain("/catalog/dill");
  });
});
