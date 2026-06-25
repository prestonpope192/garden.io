import type { GardenPlantProfile, GardenPlantRequirementValue } from "@/lib/garden-app-types";
import { getJournalStylePlantImageUrl, getRealPlantPhotoUrl } from "@/lib/plant-images";

export type CatalogueRating = {
  rating: string | null;
  description: string | null;
};

export function formatCatalogueValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "Not listed";
  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function hasKnownCatalogueValue(value: string | number | null | undefined) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return Boolean(normalized) && normalized !== "unknown" && normalized !== "not listed" && normalized !== "tbd";
}

export function formatPlantTypeLabel(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "Not listed";

  const normalized = String(value).trim().toLowerCase();
  const gardenerLabels: Record<string, string> = {
    forb: "Flower",
    flower: "Flower",
    herb: "Herb",
    fruit: "Fruit",
    vegetable: "Vegetable",
    tree: "Tree",
    shrub: "Shrub",
    vine: "Vine",
    groundcover: "Groundcover",
    bulb: "Bulb",
    fern: "Fern",
    grass: "Grass"
  };

  return gardenerLabels[normalized] ?? formatCatalogueValue(value);
}

export function isRecord(value: GardenPlantRequirementValue): value is Record<string, GardenPlantRequirementValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function getRating(profile: GardenPlantProfile, dimensionCode: string): CatalogueRating | null {
  const value = profile.ratings?.[dimensionCode];
  if (!value || !isRecord(value)) return null;

  return {
    rating: value.rating === null || value.rating === undefined ? null : String(value.rating),
    description: typeof value.description === "string" ? value.description : null
  };
}

export function hasRatingContent(rating: CatalogueRating | null) {
  return Boolean(rating?.rating || rating?.description);
}

export function getProfileTags(profile: GardenPlantProfile) {
  return [
    profile.cultivar_name ? `${profile.cultivar_name} cultivar` : null,
    hasKnownCatalogueValue(profile.lifecycle_type) ? formatCatalogueValue(profile.lifecycle_type) : null,
    formatPlantTypeLabel(profile.plant_type_code)
  ].filter(Boolean);
}

export function formatPlantSummaryLine(profile: GardenPlantProfile) {
  return [
    hasKnownCatalogueValue(profile.lifecycle_type) ? formatCatalogueValue(profile.lifecycle_type) : null,
    formatPlantTypeLabel(profile.plant_type_code)
  ].filter(Boolean).join(" · ");
}

export function formatInchesRange(min: string | number | null | undefined, max: string | number | null | undefined) {
  const minValue = min === null || min === undefined ? null : Number(min);
  const maxValue = max === null || max === undefined ? null : Number(max);

  if (minValue && maxValue && minValue !== maxValue) return `${minValue}-${maxValue} in`;
  if (maxValue) return `${maxValue} in`;
  if (minValue) return `${minValue} in`;
  return "Not listed";
}

export function getPlantSearchText(profile: GardenPlantProfile) {
  return [
    profile.display_name,
    profile.botanical_name_full,
    profile.family_name,
    profile.primary_common_name,
    profile.short_description,
    profile.why_plant_it,
    profile.primary_use_cases,
    profile.plant_type_code,
    profile.lifecycle_type,
    profile.preferred_light,
    profile.water_need_level,
    profile.soil_texture_summary,
    profile.drainage_requirement,
    profile.cultivar_name
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function catalogueCategoryMatches(profile: GardenPlantProfile, category: string) {
  if (category === "all") return true;
  const plantType = profile.plant_type_code.toLowerCase();
  const lifecycle = profile.lifecycle_type.toLowerCase();
  const uses = (profile.primary_use_cases ?? "").toLowerCase();

  if (category === "perennial") return lifecycle.includes("perennial");
  if (category === "fruit") return plantType.includes("fruit") || uses.includes("fruit");
  return plantType.includes(category) || uses.includes(category);
}

const SHOWCASE_SLUGS = [
  "calendula",
  "cilantro",
  "cucumber",
  "basil",
  "tomato",
  "rosemary",
  "pepper"
];

function getShowcaseRank(profile: GardenPlantProfile) {
  const index = SHOWCASE_SLUGS.indexOf(profile.slug);
  return index === -1 ? SHOWCASE_SLUGS.length : index;
}

function getSearchRank(profile: GardenPlantProfile, query: string) {
  if (!query) return 0;

  const displayName = profile.display_name.toLowerCase();
  const commonName = (profile.primary_common_name ?? "").toLowerCase();
  const botanicalName = (profile.botanical_name_full ?? "").toLowerCase();

  if (displayName === query || commonName === query) return 0;
  if (displayName.startsWith(query) || commonName.startsWith(query)) return 1;
  if (botanicalName.startsWith(query)) return 2;
  return 3;
}

function compareCatalogueProfiles(a: GardenPlantProfile, b: GardenPlantProfile, query: string) {
  const searchRank = getSearchRank(a, query) - getSearchRank(b, query);
  if (searchRank !== 0) return searchRank;

  const journalImageRank =
    Number(!getJournalStylePlantImageUrl(a.primary_image_url)) -
    Number(!getJournalStylePlantImageUrl(b.primary_image_url));
  if (journalImageRank !== 0) return journalImageRank;

  const photoRank = Number(!getRealPlantPhotoUrl(a.primary_image_url)) - Number(!getRealPlantPhotoUrl(b.primary_image_url));
  if (photoRank !== 0) return photoRank;

  const showcaseRank = getShowcaseRank(a) - getShowcaseRank(b);
  if (showcaseRank !== 0) return showcaseRank;

  return a.display_name.localeCompare(b.display_name);
}

export function filterCatalogueProfiles(profiles: GardenPlantProfile[], query: string, category: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return profiles
    .filter((profile) => {
      const matchesCategory = catalogueCategoryMatches(profile, category);
      const matchesQuery = !normalizedQuery || getPlantSearchText(profile).includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => compareCatalogueProfiles(a, b, normalizedQuery));
}

function formatUseLabel(value: string) {
  const normalized = value.trim().toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ");
  const gardenerLabels: Record<string, string> = {
    "companion plant": "Companion planting",
    "container growing": "Containers",
    "fresh herb": "Fresh herbs",
    ornamental: "Color and flowers",
    "pest confusion": "Helps deter pests",
    "pollinator support": "Pollinators",
    "privacy screen": "Privacy screen",
    xeriscape: "Dry garden"
  };

  return gardenerLabels[normalized] ?? formatCatalogueValue(value);
}

export function getUseLabels(profile: GardenPlantProfile) {
  return (profile.primary_use_cases ?? "")
    .split(/[,;]/)
    .map((use) => use.trim())
    .filter(Boolean)
    .map(formatUseLabel)
    .slice(0, 4);
}

export function getUseSummary(profile: GardenPlantProfile, fallback = "Ways this plant can earn its place") {
  const labels = getUseLabels(profile);
  return labels.length ? labels.join(", ") : fallback;
}

export function getPropagationLabels(profile: GardenPlantProfile) {
  return profile.propagation_methods
    .map((method) => {
      const code = method.method_code ?? method.method ?? method.type;
      return typeof code === "string" ? formatCatalogueValue(code) : null;
    })
    .filter((label): label is string => Boolean(label))
    .slice(0, 5);
}
