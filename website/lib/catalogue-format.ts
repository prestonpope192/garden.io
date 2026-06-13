import type { GardenPlantProfile, GardenPlantRequirementValue } from "@/lib/garden-app-types";

export type CatalogueRating = {
  rating: string | null;
  description: string | null;
};

export function formatCatalogueValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "TBD";
  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

export function getProfileIllustration(profile: GardenPlantProfile) {
  if (profile.primary_image_url?.startsWith("/")) return profile.primary_image_url;
  if (profile.plant_type_code === "herb") return "/art/specimen-calendar-bloom.svg";
  if (profile.plant_type_code === "fruit" || profile.primary_use_cases?.toLowerCase().includes("fruit")) return "/art/specimen-tomato.svg";
  return "/art/specimen-herbarium-sheet.svg";
}

export function getProfileTags(profile: GardenPlantProfile) {
  return [
    profile.cultivar_name ? `${profile.cultivar_name} cultivar` : "Species profile",
    formatCatalogueValue(profile.lifecycle_type),
    formatCatalogueValue(profile.plant_type_code)
  ].filter(Boolean);
}

export function formatInchesRange(min: string | number | null | undefined, max: string | number | null | undefined) {
  const minValue = min === null || min === undefined ? null : Number(min);
  const maxValue = max === null || max === undefined ? null : Number(max);

  if (minValue && maxValue && minValue !== maxValue) return `${minValue}-${maxValue} in`;
  if (maxValue) return `${maxValue} in`;
  if (minValue) return `${minValue} in`;
  return "TBD";
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

export function filterCatalogueProfiles(profiles: GardenPlantProfile[], query: string, category: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return profiles.filter((profile) => {
    const matchesCategory = catalogueCategoryMatches(profile, category);
    const matchesQuery = !normalizedQuery || getPlantSearchText(profile).includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}

export function getUseLabels(profile: GardenPlantProfile) {
  return (profile.primary_use_cases ?? "")
    .split(/[,;]/)
    .map((use) => use.trim())
    .filter(Boolean)
    .slice(0, 4);
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
