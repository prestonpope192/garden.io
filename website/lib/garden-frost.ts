import type { GardenPlantInstance } from "@/lib/garden-app-types";
import type { GardenSuggestion } from "@/lib/garden-suggestions";

// Frost protection. Pure logic: given a daily-low forecast and the grower's
// growing plants, decide whether to raise a frost alert and
// which tender plants to name. No network here — the forecast is fetched
// upstream (Open-Meteo via /api/weather) and passed in.

export type ForecastDay = { date: string; lowF: number };

export type FrostAlertInput = {
  days: ForecastDay[];
  growingPlants: GardenPlantInstance[];
  today: string; // YYYY-MM-DD
  thresholdF?: number; // nightly low at/below this raises an alert
};

const DEFAULT_THRESHOLD_F = 36;

// Warm-season crops commonly damaged by frost — used only when a plant has no
// explicit frost_tender flag in the catalogue.
const TENDER_KEYWORDS = [
  "tomato",
  "pepper",
  "eggplant",
  "aubergine",
  "basil",
  "cucumber",
  "squash",
  "zucchini",
  "melon",
  "watermelon",
  "bean",
  "corn",
  "okra",
  "citrus",
  "lemon",
  "lime",
  "pumpkin",
  "sweet potato",
  "tomatillo",
  "nasturtium",
  "dahlia",
];

function plantText(plant: GardenPlantInstance): string {
  const p = plant.plant_profile;
  return [p?.display_name, p?.plant_type_code, p?.primary_use_cases, p?.botanical_name_full]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** true = tender, false = hardy, null = unknown (no flag, no keyword match). */
export function tenderness(plant: GardenPlantInstance): boolean | null {
  const flag = plant.plant_profile?.frost_tender;
  if (flag === true) return true;
  if (flag === false) return false;
  const t = plantText(plant);
  if (TENDER_KEYWORDS.some((k) => t.includes(k))) return true;
  return null;
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = new Date(ay, (am ?? 1) - 1, ad ?? 1);
  const db = new Date(by, (bm ?? 1) - 1, bd ?? 1);
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

function friendlyDay(date: string, today: string): string {
  const delta = daysBetween(today, date);
  if (delta <= 0) return "tonight";
  if (delta === 1) return "tomorrow night";
  const d = new Date(`${date}T00:00:00`);
  return `${d.toLocaleDateString("en-US", { weekday: "long" })} night`;
}

function uniqueNames(plants: GardenPlantInstance[]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const p of plants) {
    const name = p.plant_profile?.display_name;
    if (name && !seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
  }
  return names;
}

function listForSentence(names: string[], max = 3): string {
  if (names.length <= max) {
    if (names.length <= 1) return names[0] ?? "";
    return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  }
  return `${names.slice(0, max).join(", ")} and ${names.length - max} more`;
}

/**
 * Returns a frost alert as a GardenSuggestion (so it slots into the existing
 * Ideas/suggest-confirm surface), or null when no protective action is needed.
 */
export function buildFrostAlert(input: FrostAlertInput): GardenSuggestion | null {
  const threshold = input.thresholdF ?? DEFAULT_THRESHOLD_F;
  const upcoming = input.days
    .filter((d) => d.date >= input.today && typeof d.lowF === "number" && d.lowF <= threshold)
    .sort((a, b) => a.date.localeCompare(b.date));
  const frost = upcoming[0];
  if (!frost) return null;

  const growing = input.growingPlants.filter((p) => p.status === "growing");
  const tender = growing.filter((p) => tenderness(p) === true);
  const unknown = growing.filter((p) => tenderness(p) === null);
  // Everything the grower has is known-hardy → no protective action needed.
  if (tender.length === 0 && unknown.length === 0) return null;

  const when = friendlyDay(frost.date, input.today);
  const lowLabel = `${Math.round(frost.lowF)}°F`;
  const names = uniqueNames(tender);
  const protectClause = names.length
    ? `Protect ${listForSentence(names)} — cover them, move containers under shelter, or water before nightfall.`
    : "Protect any frost-tender plants — cover them, move containers under shelter, or water before nightfall.";

  const dueInDays = Math.max(daysBetween(input.today, frost.date), 0);
  const title = names.length
    ? `Frost ${when} (${lowLabel}) — protect ${listForSentence(names, 2)}`
    : `Frost ${when} (${lowLabel}) — protect tender plants`;

  return {
    id: `frost:${frost.date}`,
    type: "warning",
    title,
    rationale: `A low of ${lowLabel} is forecast for ${frost.date}. ${protectClause}`,
    confidence: "high",
    taskTitle: `Protect tender plants from frost (${frost.date})`,
    windowLabel: when,
    dueInDays,
  };
}
