import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PublicCatalogueBrowser } from "@/components/public-catalogue-browser";
import { CatalogueView } from "@/components/views/catalogue-view";
import type { GardenPlantProfile } from "@/lib/garden-app-types";
import {
  catalogueCategoryMatches,
  filterCatalogueProfiles,
  formatCatalogueValue,
  formatPlantTypeLabel,
  formatInchesRange,
  formatPlantSummaryLine,
  getPlantSearchText,
  getProfileTags,
  getPropagationLabels,
  getRating,
  hasRatingContent,
  hasKnownCatalogueValue,
  getUseLabels,
  getUseSummary
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
    expect(formatPlantTypeLabel("forb")).toBe("Flower");
    expect(formatPlantTypeLabel("groundcover")).toBe("Groundcover");
    expect(formatCatalogueValue(null)).toBe("Not listed");
    expect(formatInchesRange(24, 48)).toBe("24-48 in");
    expect(formatInchesRange(null, 12)).toBe("12 in");
    expect(hasKnownCatalogueValue("unknown")).toBe(false);
    expect(hasKnownCatalogueValue("annual")).toBe(true);
    expect(formatPlantSummaryLine(makeProfile({ lifecycle_type: "unknown", plant_type_code: "forb" }))).toBe("Flower");
  });

  it("extracts profile tags, ratings, use labels, propagation labels, and search text", () => {
    const profile = makeProfile();

    expect(getProfileTags(profile)).toEqual(["Annual", "Herb"]);
    expect(getProfileTags(makeProfile({ plant_type_code: "forb" }))).toEqual(["Annual", "Flower"]);
    expect(getProfileTags(makeProfile({ lifecycle_type: "unknown", plant_type_code: "forb" }))).toEqual(["Flower"]);
    expect(getRating(profile, "container_suitability")).toEqual({
      rating: "4",
      description: "Works in deep containers."
    });
    expect(hasRatingContent(getRating(profile, "container_suitability"))).toBe(true);
    expect(getUseLabels(profile)).toEqual(["Fresh herbs", "Pollinators"]);
    expect(getUseSummary(profile)).toBe("Fresh herbs, Pollinators");
    expect(getPropagationLabels(profile)).toEqual(["Direct Seed"]);
    expect(getPlantSearchText(profile)).toContain("pollinator support");
  });

  it("treats empty ratings as unavailable for public display", () => {
    const profile = makeProfile({
      ratings: {
        container_suitability: {
          rating: null,
          description: null
        },
        pollinator_value: {}
      }
    });

    expect(hasRatingContent(getRating(profile, "container_suitability"))).toBe(false);
    expect(hasRatingContent(getRating(profile, "pollinator_value"))).toBe(false);
    expect(hasRatingContent(null)).toBe(false);
  });

  it("formats database-style plant uses into readable labels", () => {
    const profile = makeProfile({
      primary_use_cases: "pollinator_support, privacy_screen, ornamental shrub, xeriscape, pest_confusion"
    });

    expect(getUseLabels(profile)).toEqual([
      "Pollinators",
      "Privacy screen",
      "Ornamental Shrub",
      "Dry garden"
    ]);
    expect(getUseSummary(profile)).toBe("Pollinators, Privacy screen, Ornamental Shrub, Dry garden");
    expect(getUseLabels(makeProfile({ primary_use_cases: "ornamental, pest_confusion, companion plant" }))).toEqual([
      "Color and flowers",
      "Helps deter pests",
      "Companion planting"
    ]);
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

  it("puts journal-style showcase plants first in broad browse states", () => {
    const profiles = [
      makeProfile({
        slug: "abelia",
        plant_profile_id: "profile-abelia",
        display_name: "Abelia",
        plant_type_code: "shrub",
        lifecycle_type: "perennial",
        botanical_name_full: "Abelia x grandiflora"
      }),
      makeProfile({
        slug: "cucumber",
        plant_profile_id: "profile-cucumber",
        display_name: "Cucumber",
        plant_type_code: "vine",
        lifecycle_type: "annual",
        botanical_name_full: "Cucumis sativus",
        primary_image_url: "https://example.com/cucumber.jpg"
      }),
      makeProfile({
        slug: "calendula",
        plant_profile_id: "profile-calendula",
        display_name: "Calendula",
        plant_type_code: "flower",
        lifecycle_type: "unknown",
        botanical_name_full: "Calendula officinalis",
        primary_image_url: "https://example.com/calendula.jpg"
      }),
      makeProfile({
        slug: "cilantro",
        plant_profile_id: "profile-cilantro",
        display_name: "Cilantro",
        plant_type_code: "herb",
        lifecycle_type: "annual",
        botanical_name_full: "Coriandrum sativum",
        primary_image_url: "https://example.com/cilantro.jpg"
      }),
      makeProfile({
        slug: "basil",
        plant_profile_id: "profile-basil",
        display_name: "Basil",
        plant_type_code: "herb",
        lifecycle_type: "annual",
        botanical_name_full: "Ocimum basilicum",
        primary_image_url: null
      }),
      makeProfile({
        slug: "zinnia",
        plant_profile_id: "profile-zinnia",
        display_name: "Zinnia",
        plant_type_code: "flower",
        lifecycle_type: "annual",
        botanical_name_full: "Zinnia elegans",
        primary_image_url: "https://example.com/zinnia.jpg"
      })
    ];

    expect(filterCatalogueProfiles(profiles, "", "all").map((profile) => profile.slug)).toEqual([
      "calendula",
      "cilantro",
      "cucumber",
      "zinnia",
      "basil",
      "abelia"
    ]);
  });

  it("prefers journal-style plant art before ordinary photos in broad browse states", () => {
    const profiles = [
      makeProfile({
        slug: "zinnia",
        plant_profile_id: "profile-zinnia",
        display_name: "Zinnia",
        plant_type_code: "flower",
        lifecycle_type: "annual",
        botanical_name_full: "Zinnia elegans",
        primary_image_url: "https://example.com/zinnia-garden-photo.jpg"
      }),
      makeProfile({
        slug: "amaranth",
        plant_profile_id: "profile-amaranth",
        display_name: "Amaranth",
        plant_type_code: "grain",
        lifecycle_type: "annual",
        botanical_name_full: "Amaranthus hypochondriacus",
        primary_image_url: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/amaranth.jpg"
      }),
      makeProfile({
        slug: "basil",
        plant_profile_id: "profile-basil",
        display_name: "Basil",
        plant_type_code: "herb",
        lifecycle_type: "annual",
        botanical_name_full: "Ocimum basilicum",
        primary_image_url: null
      })
    ];

    expect(filterCatalogueProfiles(profiles, "", "all").map((profile) => profile.slug)).toEqual([
      "amaranth",
      "zinnia",
      "basil"
    ]);
  });
});

describe("PublicCatalogueBrowser", () => {
  it("renders the plant guide with simple default search, collapsed filters, and profile links", () => {
    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        plantProfiles: [
          makeProfile({ primary_image_url: "/art/plants/dill.svg" }),
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

    expect(html).toContain("Choose a plant for the spot you have");
    expect(html).not.toContain("Choose the right plant for the right spot");
    expect(html).toContain("Check sun, water, soil, and room before you plant");
    expect(html).not.toContain("Search by sun, water, space, and use before you plant");
    expect(html).not.toContain("Search by light, water, space, and use before you make room in a bed");
    expect(html).toContain("Search plants, shade, pollinators");
    expect(html).toContain("All plant kinds");
    expect(html).toContain("plants to choose from");
    expect(html).toContain("Browse by kind");
    expect(html).toContain("Plants to choose from");
    expect(html).toContain("Choose plants");
    expect(html).not.toContain("Field guide");
    expect(html).not.toContain("Find plants");
    expect(html).toContain("2 plants");
    expect(html).toContain("View plant");
    expect(html).not.toContain("Open plant");
    expect(html).not.toContain("Open plant note");
    expect(html).not.toContain("Open plant page");
    expect(html).not.toContain("Choose kind");
    expect(html).not.toContain("Plant type");
    expect(html).not.toContain("Plants to consider");
    expect(html).not.toContain("See this plant");
    expect(html).not.toContain("Browse plants");
    expect(html).not.toContain("Field guide");
    expect(html).toContain("Match the spot");
    expect(html).toContain("sun, water, and room");
    expect(html).toContain("Good to remember");
    expect(html).toContain("what changed and what helped");
    expect(html).not.toContain("Remember later");
    expect(html).not.toContain("Keep notes");
    expect(html).not.toContain("weather and photos together");
    expect(html).not.toContain("Keep the story");
    expect(html).not.toContain("notes, weather, and photos");
    expect(html).not.toContain("Find plants that fit your garden");
    expect(html).not.toContain("Check fit");
    expect(html).not.toContain("Before planting");
    expect(html).not.toContain("After planting");
    expect(html).not.toContain("Right place");
    expect(html).not.toContain("check sun, water, and space");
    expect(html).not.toContain("save what happens");
    expect(html).toContain("/catalog/dill");
    expect(html).not.toContain("Read care guide");
    expect(html).not.toContain("Read guide");
    expect(html).not.toContain("Read full guide");
    expect(html).not.toContain("care guide");
    expect(html).not.toContain("plants to browse");
    expect(html).toContain("Plants to choose from");
    expect(html).not.toContain("Photo coming soon");
    expect(html).not.toContain("photo coming soon");
    expect(html).not.toContain("plant-image-placeholder");
    expect(html).not.toContain("Browsing");
    expect(html).not.toContain("Narrow choices");
    expect(html).not.toContain("Sun + water");
    expect(html).not.toContain("spot-check the basics");
    expect(html).not.toContain("Save to garden");
    expect(html).not.toContain("track what happens");
    expect(html).not.toContain("Showing all plant types");
    expect(html).not.toContain("plants to compare");
    expect(html).not.toContain("Filter plants");
    expect(html).not.toContain("plants with care notes");
    expect(html).not.toContain("Care notes");
    expect(html).not.toContain("Ways to browse");
    expect(html).not.toContain("All<small>");
    expect(html).not.toContain("Start your garden when you want to save plants");
    expect(html).not.toContain("/art/plants/dill.svg");
    expect(html).not.toContain("Public plant catalogue");
    expect(html).not.toContain("Folio 04");
    expect(html).not.toContain("Plate 01");
    expect(html).not.toContain("Read-only");
    expect(html).not.toContain("Specimen index");
    expect(html).not.toContain("Sign in when");
    expect(html).not.toContain("Keep a record");
    expect(html).not.toContain("Care snapshot");
    expect(html).toContain("View plant");
    expect(html).not.toContain("Plant details");
  });

  it("keeps the default plant guide browse short with more plants behind a button", () => {
    const profiles = Array.from({ length: 10 }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return makeProfile({
        slug: `plant-${number}`,
        plant_profile_id: `profile-${number}`,
        plant_taxon_id: `taxon-${number}`,
        display_name: `Plant ${number}`,
        botanical_name_full: `Plantus ${number}`
      });
    });

    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        plantProfiles: profiles
      })
    );

    expect(html).toContain("6 of 10 plants in view.");
    expect(html).toContain("Show more plants");
    expect(html).toContain("Plant 06");
    expect(html).not.toContain("Plant 07</h3>");
    expect(html).not.toContain("Selected plant details");
  });

  it("can render an initially filtered plant guide", () => {
    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        initialQuery: "blue",
        plantProfiles: [
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
        ]
      })
    );

    expect(html).toContain('1 plant for &quot;blue&quot;');
    expect(html).toContain("Blueberry");
    expect(html).not.toContain("Dill</h3>");
  });
});

describe("CatalogueView", () => {
  it("uses simple browse language in the signed-in plant finder", () => {
    const html = renderToStaticMarkup(
      createElement(CatalogueView, {
        activeBed: null,
        plantProfiles: [
          makeProfile({ family_name: "Apiaceae" }),
          makeProfile({
            slug: "blueberry",
            plant_profile_id: "profile-blueberry",
            display_name: "Blueberry",
            plant_type_code: "fruit",
            lifecycle_type: "perennial",
            botanical_name_full: "Vaccinium corymbosum"
          })
        ],
        addCatalogPlantToBed: async () => undefined,
        saveWishlist: async () => undefined
      })
    );

    expect(html).toContain("Every kind");
    expect(html).toContain("Browse by kind");
    expect(html).not.toContain("Choose kind");
    expect(html).not.toContain("Plant type");
    expect(html).toContain("Search plants…");
    expect(html).toContain("2 plants to choose from");
    expect(html).not.toContain("2 plants that fit");
    expect(html).not.toContain("2 plants to consider");
    expect(html).not.toContain("2 plant choices");
    expect(html).not.toContain("2 plants</span>");
    expect(html).toContain("Annual");
    expect(html).toContain("Best spot");
    expect(html).toContain("Good to remember");
    expect(html).not.toContain("Remember later");
    expect(html).not.toContain("Keep notes on");
    expect(html).not.toContain("Fits");
    expect(html).not.toContain("Watch for");
    expect(html).toContain("Fresh herbs, Pollinators");
    expect(html).toContain("Harvest timing, heat stress, and flavor.");
    expect(html).not.toContain("Choose plant type");
    expect(html).toContain("Plant in a bed");
    expect(html).not.toContain("Ready to plant? Add it to a bed. Still deciding? Keep it in plants to try.");
    expect(html).toContain("Add to plants to try");
    expect(html).not.toContain("Know where it belongs?");
    expect(html).not.toContain("Save for later");
    expect(html).not.toContain("Apiaceae");
    expect(html).not.toContain("Anethum graveolens");
    expect(html).not.toContain("Vaccinium corymbosum");
    expect(html).not.toContain("Search by name, botanical name, or family");
    expect(html).not.toContain("<dt>Fit</dt>");
    expect(html).not.toContain("Browsing");
    expect(html).not.toContain("Narrow choices");
    expect(html).not.toContain("Fresh Herb, Pollinator Support");
    expect(html).not.toContain("Filter plants");
    expect(html).not.toContain("Clear filters");
    expect(html).not.toContain("Showing all plant types");
    expect(html).not.toContain("plants to compare");
    expect(html).not.toContain("Save as idea");
    expect(html).not.toContain("save it as an idea");
    const source = readFileSync(new URL("../components/views/catalogue-view.tsx", import.meta.url), "utf8");
    expect(source).toContain("Look for the right light, water, and room.");
    expect(source).toContain("Bloom timing, pollinator visits, and deadheading.");
    expect(source).toContain("garden-cat-fit-list__memory");
    expect(source).toContain("Field notes");
    expect(source).toContain("planting notes");
    expect(source).toContain("planting basics");
    expect(source).not.toContain("More details");
    expect(source).not.toContain("Save harvest timing, heat stress, and flavor notes.");
    expect(source).not.toContain("Save bloom timing, pollinator visits, and deadheading notes.");
    expect(source).not.toContain("Save watering, support, harvest, and pest notes.");
    expect(source).not.toContain("garden-cat-card__botanical");
    expect(source).not.toContain("Match by light, water, and available space.");
    expect(source).not.toContain("Check care needs and garden fit before choosing a spot.");
    expect(source).not.toContain("quick fit");
    expect(source).not.toContain("garden fit");
    expect(source).not.toContain("Care effort");
    expect(source).not.toContain("grouped by type");
    expect(source).not.toContain("garden-cat-sort");
    expect(source).not.toContain("SortKey");
    expect(source).not.toContain('htmlFor="cat-sort"');
  });

  it("keeps the empty signed-in plant finder action-oriented", () => {
    const html = renderToStaticMarkup(
      createElement(CatalogueView, {
        activeBed: null,
        plantProfiles: [],
        addCatalogPlantToBed: async () => undefined,
        saveWishlist: async () => undefined
      })
    );

    expect(html).toContain("Choose plants");
    expect(html).toContain("No plants to choose from yet.");
    expect(html).not.toContain("No plants are ready yet.");
    expect(html).not.toContain("Plant guide");
    expect(html).not.toContain("No plant records are ready yet.");
    expect(html).not.toContain("Find plants");
    expect(html).not.toContain("No plants are ready to browse yet.");
  });
});
