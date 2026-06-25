import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicCatalogueBrowser } from "@/components/public-catalogue-browser";
import type { GardenPlantProfile } from "@/lib/garden-app-types";

const profile: GardenPlantProfile = {
  plant_profile_id: "profile-french-marigold",
  slug: "french-marigold",
  plant_taxon_id: "taxon-french-marigold",
  plant_cultivar_id: null,
  display_name: "French Marigold",
  plant_type_code: "forb",
  lifecycle_type: "annual",
  family_name: "Asteraceae",
  genus_name: "Tagetes",
  species_name: "patula",
  botanical_name_full: "Tagetes patula",
  primary_common_name: "French marigold",
  short_description: "Compact annual flower for color and pollinators.",
  why_plant_it: "A strong entry point for visitors who want to browse the catalog without logging in.",
  primary_use_cases: "Pollinator Support, Companion Plant",
  preferred_light: "Full Sun",
  water_need_level: "Medium",
  propagation_methods: [],
  drainage_requirement: "Well drained",
  texture_preferences: {},
  preferred_soil_texture_codes: [],
  soil_texture_summary: "Average garden soil",
  primary_image_url: null,
  ratings: {}
};

afterEach(() => {
  vi.doUnmock("@/lib/plant-profile-service");
  vi.doUnmock("next/navigation");
  vi.resetModules();
});

describe("PublicCatalogueBrowser content", () => {
  it("describes the highlighted plant as a useful starting point", () => {
    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        plantProfiles: [
          {
            ...profile,
            drainage_requirement: null,
            soil_texture_summary: null
          }
        ]
      })
    );

    expect(html).toContain("Plant note");
    expect(html).not.toContain("Plant plate");
    expect(html).toContain("Compact annual flower for color and pollinators.");
    expect(html).toContain("View plant");
    expect(html).not.toContain("Open plant");
    expect(html).not.toContain("Open plant note");
    expect(html).not.toContain("Open plant page");
    expect(html).toContain("/catalog/french-marigold");
    expect(html).toContain("Annual · Flower");
    expect(html).toContain("All plant kinds");
    expect(html).toContain("plant to choose from");
    expect(html).toContain("Browse by kind");
    expect(html).toContain("Choose plants");
    expect(html).toContain("aria-label=\"Plant choosing summary\"");
    expect(html).not.toContain("aria-label=\"Field guide summary\"");
    expect(html).toContain("Check sun, water, soil, and room before you plant.");
    expect(html).not.toContain("Search by sun, water, space, and use before you plant.");
    expect(html).not.toContain("Search by light, water, space, and use before you make room in a bed.");
    expect(html).toContain("Match the spot");
    expect(html).toContain("sun, water, and room");
    expect(html).toContain("Good to remember");
    expect(html).toContain("what changed and what helped");
    expect(html).not.toContain("Remember later");
    expect(html).not.toContain("Keep notes");
    expect(html).not.toContain("weather and photos together");
    expect(html).not.toContain("Keep the story");
    expect(html).not.toContain("notes, weather, and photos");
    expect(html).toContain("Plants to choose from");
    expect(html).not.toContain("Find plants");
    expect(html).toContain("Type");
    expect(html).not.toContain("Start here");
    expect(html).not.toContain("Check fit");
    expect(html).not.toContain("Before planting");
    expect(html).not.toContain("After planting");
    expect(html).not.toContain("Plant type");
    expect(html).not.toContain("Choose kind");
    expect(html).not.toContain("Hide kinds");
    expect(html).not.toContain("See this plant");
    expect(html).not.toContain("Plant kind");
    expect(html).not.toContain("Choose plant type");
    expect(html).not.toContain("Plant type</span><strong>Annual");
    expect(html).not.toContain("Plant guide");
    expect(html).not.toContain("aria-label=\"Plant guide summary\"");
    expect(html).not.toContain("Browse plants");
    expect(html).toContain("Check drainage and soil before planting.");
    expect(html).not.toContain("<dt>Height</dt><dd>Not listed</dd>");
    expect(html).not.toContain("Asteraceae");
    expect(html).not.toContain("Plant family");
    expect(html).not.toContain("garden role");
    expect(html).not.toContain("Search by sun, water, space, or garden role");
    expect(html).not.toContain("Search by sun, water, or purpose");
    expect(html).not.toContain("Match this plant to your bed conditions before planting.");
    expect(html).not.toContain("Check light, water, size, and garden role before choosing a spot.");
    expect(html).not.toContain("Good place to start");
    expect(html).not.toContain("Right place");
    expect(html).not.toContain("check sun, water, and space");
    expect(html).not.toContain("save what happens");
    expect(html).not.toContain("Good fit if:");
    expect(html).not.toContain("Browsing");
    expect(html).not.toContain("Narrow choices");
    expect(html).not.toContain("Sun + water");
    expect(html).not.toContain("spot-check the basics");
    expect(html).not.toContain("Save to garden");
    expect(html).not.toContain("track what happens");
    expect(html).not.toContain("View care guide");
    expect(html).not.toContain("Read care guide");
    expect(html).not.toContain("Read guide");
    expect(html).not.toContain("Read full guide");
    expect(html).not.toContain("care guide");
    expect(html).not.toContain("Filter plants");
    expect(html).not.toContain("Showing all plant types");
    expect(html).not.toContain("plants to compare");
    expect(html).not.toContain("plants to browse");
    expect(html).toContain("Plants to choose from");
    expect(html).not.toContain("Ways to browse");
    expect(html).not.toContain("What you can do next");
    expect(html).not.toContain("Selected plant details");
    expect(html).not.toContain("Plant details");
    expect(html).not.toContain("Selected plant");
    expect(html).not.toContain("Plant preview");
    expect(html).not.toContain("Selected plant preview");
    expect(html).not.toContain("Preview French Marigold");
    expect(html).not.toContain("Featured plant");
    expect(html).not.toContain("Forb");
    expect(html).not.toContain("Photo coming soon");
    expect(html).not.toContain("photo coming soon");
    expect(html).not.toContain("plant-image-placeholder");
    expect(html).not.toContain("aria-label=\"Catalogue summary\"");
    expect(html).not.toContain("aria-label=\"Catalogue filters\"");
    expect(html).not.toContain("A strong entry point for visitors");
    expect(html).not.toContain("logging in");
  });

  it("shows gardener-facing use labels when choices are narrowed", () => {
    const source = readFileSync(
      new URL("../components/public-catalogue-browser.tsx", import.meta.url),
      "utf8"
    );
    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        initialQuery: "marigold",
        plantProfiles: [profile]
      })
    );

    expect(html).toContain("Pollinators");
    expect(html).toContain("Companion planting");
    expect(source).toContain('aria-label="Plant kinds"');
    expect(source).toContain("<SpecimenLabel tone=\"clay\">Plant kinds</SpecimenLabel>");
    expect(html).not.toContain("Pollinator Support");
    expect(html).not.toContain("Companion Plant");
    expect(source).not.toContain('aria-label="Ways to browse plants"');
    expect(source).not.toContain("<SpecimenLabel tone=\"clay\">Ways to browse</SpecimenLabel>");
    expect(source).not.toContain('aria-label="Catalogue filters"');
  });

  it("gives public catalogue row images useful plant-specific alt text", () => {
    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        plantProfiles: [
          {
            ...profile,
            primary_image_url: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/french-marigold.jpg"
          }
        ]
      })
    );

    expect(html).toContain('alt="French Marigold plant image"');
    expect(html).not.toContain('alt=""');
  });

  it("does not promote ordinary garden photos as journal-style guide images", () => {
    const sagebrush: GardenPlantProfile = {
      ...profile,
      plant_profile_id: "profile-sagebrush",
      slug: "sagebrush",
      display_name: "Sagebrush",
      botanical_name_full: "Artemisia tridentata",
      primary_common_name: "Sagebrush",
      short_description: "Drought-tolerant native shrub.",
      why_plant_it: "Supports dry garden structure and wildlife habitat.",
      primary_image_url: null
    };
    const autumnSage: GardenPlantProfile = {
      ...profile,
      plant_profile_id: "profile-autumn-sage",
      slug: "autumn-sage",
      display_name: "Autumn Sage",
      botanical_name_full: "Salvia greggii",
      primary_common_name: "Autumn sage",
      family_name: "Lamiaceae",
      short_description: "Woody perennial with tubular flowers.",
      why_plant_it: "Adds pollinator blooms through warm weather.",
      primary_image_url: "https://example.com/autumn-sage.jpg",
      image_attribution: "Garden photo"
    };
    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        initialQuery: "sage",
        plantProfiles: [profile, sagebrush, autumnSage]
      })
    );
    const featuredStart = html.indexOf("plant-profile-photo-card public-catalogue-feature-card");
    const featuredEnd = html.indexOf("</article>", featuredStart);
    const featuredHtml = html.slice(featuredStart, featuredEnd);

    expect(featuredHtml).toContain("Sagebrush");
    expect(html).not.toContain("Garden photo");
    expect(html).not.toContain("autumn-sage.jpg");
    expect(html).not.toContain("Lamiaceae");
    expect(html).not.toContain("No photo yet");
    expect(html).not.toContain("Photo coming soon");
    expect(html).not.toContain("photo coming soon");
    expect(html).not.toContain("Featured plant");
    expect(html).toContain("Sagebrush");
    expect(html).toContain("/catalog/sagebrush");
    expect(html).toContain("View plant");
  });

  it("prefers a journal-style image for the highlighted plant when one is available", () => {
    const gardenPhotoSage: GardenPlantProfile = {
      ...profile,
      plant_profile_id: "profile-garden-photo-sage",
      slug: "garden-photo-sage",
      display_name: "Garden Photo Sage",
      botanical_name_full: "Salvia officinalis",
      primary_common_name: "Garden photo sage",
      primary_image_url: "https://example.com/sage-garden-photo.jpg",
      image_attribution: "Garden photo"
    };
    const plateSage: GardenPlantProfile = {
      ...profile,
      plant_profile_id: "profile-plate-sage",
      slug: "plate-sage",
      display_name: "Plate Sage",
      botanical_name_full: "Salvia platea",
      primary_common_name: "Plate sage",
      primary_image_url: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/plate-sage.jpg",
      image_attribution: "Botanical plate"
    };
    const html = renderToStaticMarkup(
      createElement(PublicCatalogueBrowser, {
        initialQuery: "sage",
        plantProfiles: [gardenPhotoSage, plateSage]
      })
    );
    const featuredStart = html.indexOf("plant-profile-photo-card public-catalogue-feature-card");
    const featuredEnd = html.indexOf("</article>", featuredStart);
    const featuredHtml = html.slice(featuredStart, featuredEnd);

    expect(featuredHtml).toContain("Plate Sage");
    expect(featuredHtml).toContain("plant-art%2Fplate-sage.jpg");
    expect(featuredHtml).not.toContain("Garden Photo Sage");
  });

  it("removes failed public catalogue photos instead of leaving blank image frames", () => {
    const source = readFileSync(
      new URL("../components/public-catalogue-browser.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain("failedPhotoUrls");
    expect(source).toContain("markPhotoFailed");
    expect(source).toContain("onError={() => onPhotoError?.(photoUrl)}");
    expect(source).toContain("priority={index < INITIAL_VISIBLE_COUNT}");
    expect(source).toContain("public-catalogue-row--text-only");
  });

  it("uses user-facing value copy on public plant detail pages", () => {
    const source = readFileSync(new URL("../app/catalog/[slug]/page.tsx", import.meta.url), "utf8");

    expect(source).toContain("Choose plants");
    expect(source).not.toContain("Field guide");
    expect(source).toContain("At a glance");
    expect(source).not.toContain("Field notes");
    expect(source).toContain("<span>Type</span>");
    expect(source).toContain('label: "Grows as"');
    expect(source).toContain("Before you plant");
    expect(source).not.toContain("Find the right spot");
    expect(source).not.toContain("Before planting");
    expect(source).not.toContain("Quick facts");
    expect(source).not.toContain("Plant kind");
    expect(source).not.toContain('label: "Lifecycle"');
    expect(source).not.toContain("<span>Kind</span>");
    expect(source).not.toContain("<span>Plant type</span>");
    expect(source).toContain("Match it to the garden you have.");
    expect(source).not.toContain("Match it to your garden.");
    expect(source).not.toContain("Check the spot first.");
    expect(source).not.toContain("Good spot");
    expect(source).not.toContain("Match the plant to the place.");
    expect(source).toContain("Check sun, water, soil, and room before you plant.");
    expect(source).not.toContain("Check light, water, soil, and room before you make space.");
    expect(source).not.toContain("Check light, water, soil, and room before it goes in the bed.");
    expect(source).toContain("Where it belongs");
    expect(source).toContain("Watch this season");
    expect(source).toContain("Use it for");
    expect(source).toContain("Start from");
    expect(source).not.toContain("Good for");
    expect(source).not.toContain("Planting method");
    expect(source).toContain("Bloom timing, weather shifts, pests, and what helped.");
    expect(source).not.toContain("Bloom timing, weather shifts, pests, and care that helped.");
    expect(source).toContain("Add it to your garden");
    expect(source).toContain("Give it a place to grow.");
    expect(source).not.toContain("Give it the right place.");
    expect(source).not.toContain("Grow this plant");
    expect(source).not.toContain("Plant it in the right place.");
    expect(source).toContain("Then remember what happened and what helped.");
    expect(source).not.toContain("Then remember what happened and what helped next time.");
    expect(source).not.toContain("Then keep its notes, photos, weather, and care together.");
    expect(source).not.toContain("Find plants");
    expect(source).toContain("Back to plants");
    expect(source).not.toContain("Back to field guide");
    expect(source).not.toContain("Browse plants");
    expect(source).not.toContain("Plant guide");
    expect(source).not.toContain("Keep it in your garden");
    expect(source).not.toContain("Add it to a bed.");
    expect(source).not.toContain("Plant family");
    expect(source).not.toContain("family_name ??");
    expect(source).not.toContain("Light, water, size, and care");
    expect(source).not.toContain("Plant facts");
    expect(source).not.toContain("Good to know");
    expect(source).not.toContain("Fit check");
    expect(source).not.toContain("Choose a spot that matches this plant.");
    expect(source).not.toContain("Check light, water, soil, and size before you make room in a bed.");
    expect(source).not.toContain("What to remember");
    expect(source).not.toContain("Save bloom timing, weather, photos, and care notes for next season.");
    expect(source).not.toContain("Give it a bed.");
    expect(source).not.toContain("Once it is planted, keep notes, photos, weather, and care with it.");
    expect(source).not.toContain("Save bloom timing, weather, photos, and care notes so next season is easier.");
    expect(source).not.toContain("Keep the details with the bed.");
    expect(source).not.toContain("Save it with the right bed.");
    expect(source).not.toContain("Choose a bed, then keep notes, photos, weather, and care with the plant as the season unfolds.");
    expect(source).not.toContain("Match this plant to your bed conditions before planting.");
    expect(source).not.toContain("Match it to the garden before you give it a bed.");
    expect(source).not.toContain("Garden role");
    expect(source).not.toContain("Care needs and garden fit");
    expect(source).not.toContain("Browse more plants");
    expect(source).not.toContain("Check the fit in under a minute.");
    expect(source).not.toContain("save what actually happens");
    expect(source).not.toContain("What to notice");
    expect(source).not.toContain("Once it is growing, note timing");
    expect(source).not.toContain("When you plant it");
    expect(source).not.toContain("connected as the season unfolds");
    expect(source).not.toContain("What to track");
    expect(source).not.toContain("keep notes on timing, weather, photos, and care");
    expect(source).not.toContain("trackingDetails");
    expect(source).not.toContain("Photo coming soon");
    expect(source).not.toContain("photo coming soon");
  });

  it("does not keep dead catalogue navigation anchors after simplification", () => {
    const source = readFileSync(new URL("../app/catalog/page.tsx", import.meta.url), "utf8");

    expect(source).toContain('href="#browse"');
    expect(source).toContain("Choose plants");
    expect(source).not.toContain("Find plants");
    expect(source).not.toContain('href="#how"');
    expect(source).not.toContain("How it works");
  });

  it("keeps the public catalogue usable when database access is unavailable", async () => {
    vi.doMock("@/lib/plant-profile-service", () => ({
      getPlantProfiles: vi.fn(async () => {
        throw new Error("Missing SUPABASE_DB_URL");
      })
    }));

    const { default: PublicCataloguePage } = await import("@/app/catalog/page");
    const html = renderToStaticMarkup(
      await PublicCataloguePage({
        searchParams: Promise.resolve({})
      })
    );

    expect(html).toContain("Choose plants");
    expect(html).not.toContain("Find plants");
    expect(html).toContain("Borage");
    expect(html).toContain("Bouquet Dill");
    expect(html).toContain("Bell Pepper");
    expect(html).toContain("plant-art%2Fborage.jpg");
    expect(html).toContain("plant-art%2Fbouquet-dill.jpg");
    expect(html).toContain("plant-art%2Fbell-pepper.jpg");
    expect(html).not.toContain("plant-art%2Fcucumber.jpg");
    expect(html).not.toContain("plant-art%2Ffrench-marigold.jpg");
    expect(html).not.toContain("plant-art%2Ffoxglove.jpg");
    expect(html).not.toContain("plant-art%2Fcurry-leaf.jpg");
    expect(html).not.toContain("Unknown · Flower");
    expect(html).not.toContain("Missing SUPABASE_DB_URL");
    expect(html).not.toContain("Photo coming soon");
  });

  it("keeps public plant details usable when database access is unavailable", async () => {
    vi.doMock("@/lib/plant-profile-service", () => ({
      getPlantProfiles: vi.fn(async () => {
        throw new Error("Missing SUPABASE_DB_URL");
      })
    }));
    vi.doMock("next/navigation", () => ({
      notFound: vi.fn(() => {
        throw new Error("not-found");
      })
    }));

    const { default: PublicPlantDetailPage } = await import("@/app/catalog/[slug]/page");
    const html = renderToStaticMarkup(
      await PublicPlantDetailPage({
        params: Promise.resolve({ slug: "borage" })
      })
    );

    expect(html).toContain("Borage");
    expect(html).toContain("Choose plants");
    expect(html).toContain("Before you plant");
    expect(html).not.toContain("Find the right spot");
    expect(html).toContain("Match it to the garden you have.");
    expect(html).not.toContain("Match it to your garden.");
    expect(html).not.toContain("Check the spot first.");
    expect(html).toContain("Add it to your garden");
    expect(html).toContain("plant-art%2Fborage.jpg");
    expect(html).not.toContain("Unknown · Flower");
    expect(html).toContain("<dt>Grows as</dt><dd>Annual</dd>");
    expect(html).not.toContain("Lifecycle");
    expect(html).not.toContain("Grows as</dt><dd>Unknown");
    expect(html).not.toContain("Missing SUPABASE_DB_URL");
    expect(html).not.toContain("Photo coming soon");
  });

  it("does not expose no-photo placeholder copy in plant surfaces", () => {
    const source = [
      "../components/public-catalogue-browser.tsx",
      "../components/views/catalogue-view.tsx",
      "../components/views/plants-view.tsx",
      "../app/catalog/[slug]/page.tsx"
    ].map((file) => readFileSync(new URL(file, import.meta.url), "utf8")).join("\n");

    expect(source).not.toContain("Photo coming soon");
    expect(source).not.toContain("photo coming soon");
    expect(source).not.toContain("Plant photo coming soon");
  });
});
