import type {
  GardenPlantInstance,
  GardenPlantProfile,
  GardenPlantRequirementValue,
  GardenWishlistItem
} from "@/lib/garden-app-types";

export function getCatalogPlantName(plant: GardenPlantInstance | GardenWishlistItem | null | undefined) {
  return plant?.plant_profile?.display_name ?? "Unknown plant";
}

export function formatQuantity(quantity: number) {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(2).replace(/\.?0+$/, "");
}

export function formatCatalogueValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "TBD";
  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatInchesRange(min: string | number | null | undefined, max: string | number | null | undefined) {
  const minValue = min === null || min === undefined ? null : Number(min);
  const maxValue = max === null || max === undefined ? null : Number(max);

  if (minValue && maxValue && minValue !== maxValue) return `${minValue}-${maxValue} in`;
  if (maxValue) return `${maxValue} in`;
  if (minValue) return `${minValue} in`;
  return "TBD";
}

export function isRecord(value: GardenPlantRequirementValue): value is Record<string, GardenPlantRequirementValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function getRating(profile: GardenPlantProfile, dimensionCode: string) {
  const value = profile.ratings?.[dimensionCode];
  if (!value || !isRecord(value)) return null;

  return {
    rating: value.rating === null || value.rating === undefined ? null : String(value.rating),
    description: typeof value.description === "string" ? value.description : null
  };
}

export function getProfileIllustration(profile: GardenPlantProfile) {
  if (profile.primary_image_url) return profile.primary_image_url;
  if (profile.plant_type_code === "herb") return "/art/specimen-calendar-bloom.svg";
  if (profile.plant_type_code === "fruit" || profile.primary_use_cases?.toLowerCase().includes("fruit")) return "/art/specimen-tomato.svg";
  return "/art/specimen-herbarium-sheet.svg";
}

export function getCultivarLabel(profile: GardenPlantProfile) {
  return profile.cultivar_name ? `${profile.cultivar_name} cultivar` : "Species profile";
}

/* Structured option sets for zone/bed condition fields. These write to the
   existing free-text columns (garden_zones.light/water, garden_beds.sun/water/soil)
   so no migration is needed; selects just keep the data consistent. */
export const LIGHT_OPTIONS = ["Full sun", "Part sun", "Part shade", "Full shade"] as const;
export const WATER_OPTIONS = ["Low", "Medium", "High"] as const;
export const SOIL_OPTIONS = ["Sandy", "Loam", "Clay loam", "Clay", "Silt", "Rocky", "Rich / amended"] as const;

/* Build a select option list that always preserves an existing (possibly legacy
   free-text) value, even when it is not part of the canonical option set. */
export function buildFieldOptions(options: readonly string[], current: string | null | undefined): string[] {
  const trimmed = (current ?? "").trim();
  if (trimmed && !options.includes(trimmed)) {
    return [trimmed, ...options];
  }
  return [...options];
}
