import type { GardenPlantInstance } from "@/lib/garden-app-types";

// Derives real lifecycle stage + harvest readiness from curated phenology
// (days-to-maturity) and the plant's planted_on date. All functions return null
// when timing data is absent, so callers fall back gracefully.

function daysSinceISO(iso: string, now = new Date()): number {
  const then = new Date(`${iso}T00:00:00`);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - then.getTime()) / 86400000);
}

export type LifecycleStage = {
  label: string;
  /** 0–1 progress toward maturity for annuals; null for perennials. */
  progress: number | null;
};

export function deriveLifecycleStage(plant: GardenPlantInstance, now = new Date()): LifecycleStage | null {
  const ph = plant.plant_profile;
  if (!ph || !plant.planted_on) return null;

  const elapsed = daysSinceISO(plant.planted_on, now);
  if (elapsed < 0) return { label: "Not yet planted", progress: 0 };

  const max = ph.days_to_maturity_max ?? ph.days_to_maturity_min ?? null;
  const isPerennial = ph.maturity_basis === "perennial" || max === null;

  if (isPerennial) {
    // Without a phenology row we can't claim a stage at all.
    if (!ph.maturity_basis && max === null && !ph.perennial_first_harvest_label) return null;
    return { label: elapsed < 365 ? "Establishing" : "Established", progress: null };
  }

  const progress = Math.min(elapsed / max, 1.2);
  let label: string;
  if (progress < 0.15) label = "Seedling";
  else if (progress < 0.5) label = "Vegetative";
  else if (progress < 0.8) label = "Flowering";
  else if (progress < 1) label = "Maturing";
  else label = "Harvest-ready";
  return { label, progress: Math.min(progress, 1) };
}

export type HarvestReadiness = {
  label: string;
  ready: boolean;
};

export function harvestReadiness(plant: GardenPlantInstance, now = new Date()): HarvestReadiness | null {
  const ph = plant.plant_profile;
  if (!ph || !plant.planted_on) return null;
  if (ph.maturity_basis === "perennial") return null;

  const min = ph.days_to_maturity_min ?? ph.days_to_maturity_max ?? null;
  if (min === null) return null;

  const elapsed = daysSinceISO(plant.planted_on, now);
  if (elapsed < 0) return null;
  if (elapsed >= min) return { label: "Ready to harvest", ready: true };
  return { label: `Harvest in ~${min - elapsed} days`, ready: false };
}
