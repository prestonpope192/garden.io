import type {
  GardenObservation,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenTask,
  GardenTaskStatus,
} from "@/lib/garden-app-types";
import type { GardenSuggestion } from "@/lib/garden-suggestions";
import {
  deriveLifecycleStage,
  type LifecycleStage,
} from "@/lib/garden-phenology";

// Phase 3C · Slice 1 — The Planting Timeline.
//
// Pure derivation: turns a single planting's real history + projected future
// into one legible past → today → upcoming arc. No LLM, no network, no schema
// change — it folds together data that already exists (planting date,
// observations/diagnoses, tasks) plus curated phenology (lifecycle stage,
// projected harvest) and the heuristic suggestion engine (the forward plan).
//
// Bucketing is by *nature*, not by raw date: things that already happened
// (planting, notes, completed tasks) read as the past; things still to do
// (open tasks, projected harvest, suggested actions) read as upcoming. This
// keeps an overdue open task in "upcoming" (it is still to-do) and avoids
// fragile date === today edge logic.

export type TimelineItemKind = "milestone" | "note" | "task" | "suggestion";

export type TimelineItem = {
  id: string;
  kind: TimelineItemKind;
  /** YYYY-MM-DD; "" when the item has no usable date (e.g. open task, no due). */
  date: string;
  title: string;
  detail?: string;
  imagePath?: string | null;
  /** Present for committed tasks. */
  status?: GardenTaskStatus;
  /** Whether the open task / suggestion is overdue relative to `today`. */
  overdue?: boolean;
  /** True for not-yet-real items (phenology projection, suggestion). */
  projected?: boolean;
  /** Present when kind === "suggestion" so the caller can commit it to a task. */
  suggestion?: GardenSuggestion;
};

export type PlantTimeline = {
  /** Things that happened — chronological, oldest → newest. */
  past: TimelineItem[];
  /** Things to do / expected — soonest → furthest; undated sink to the end. */
  upcoming: TimelineItem[];
  /** Plant's current lifecycle stage as of `today` (shown at the divider). */
  currentStage: LifecycleStage | null;
  today: string;
};

export type BuildPlantTimelineInput = {
  observations: GardenObservation[];
  tasks: GardenTask[];
  outcomes: GardenPlantOutcome[];
  suggestions: GardenSuggestion[];
  /** Today as YYYY-MM-DD (caller supplies for determinism). */
  today: string;
};

/** One-line summary of a recorded outcome: "3.5 kg · quality 4/5 · success". */
export function summarizeOutcome(o: GardenPlantOutcome): string {
  const parts: string[] = [];
  if (o.harvest_quantity !== null && o.harvest_quantity !== undefined) {
    parts.push(`${o.harvest_quantity}${o.harvest_unit ? ` ${o.harvest_unit}` : ""}`);
  }
  if (o.quality_rating) parts.push(`quality ${o.quality_rating}/5`);
  if (o.result) parts.push(o.result);
  return parts.join(" · ");
}

// ── Date helpers (local-midnight, string-safe) ──────────────────────────────

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + days);
  return toISO(dt);
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().trim();
}

/** Loose match in both directions — mirrors the suggestion-engine dedup. */
function titlesOverlap(a: string, b: string): boolean {
  const x = normalizeTitle(a);
  const y = normalizeTitle(b);
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

// ── Builder ─────────────────────────────────────────────────────────────────

export function buildPlantTimeline(
  plant: GardenPlantInstance,
  input: BuildPlantTimelineInput
): PlantTimeline {
  const { today } = input;
  const past: TimelineItem[] = [];
  const upcoming: TimelineItem[] = [];

  // 1. Planting milestone — the origin of the arc.
  if (plant.planted_on) {
    past.push({
      id: `planted:${plant.id}`,
      kind: "milestone",
      date: plant.planted_on,
      title: "Planted",
      detail:
        plant.quantity && Number(plant.quantity) > 1
          ? `${plant.quantity} planted out`
          : undefined,
    });
  }

  // 2. Observations / diagnoses (3B persists diagnoses as observations).
  for (const o of input.observations) {
    if (o.plant_instance_id !== plant.id) continue;
    past.push({
      id: `note:${o.id}`,
      kind: "note",
      date: (o.observed_at || o.created_at || "").slice(0, 10),
      title: "",
      detail: o.note,
      imagePath: o.image_path,
    });
  }

  // 2b. Recorded outcomes (harvests / final verdicts) — things that happened.
  for (const o of input.outcomes) {
    if (o.plant_instance_id !== plant.id) continue;
    const summary = summarizeOutcome(o);
    past.push({
      id: `outcome:${o.id}`,
      kind: "milestone",
      date: (o.harvested_on || o.created_at || "").slice(0, 10),
      title: o.harvest_quantity !== null && o.harvest_quantity !== undefined ? "Harvested" : "Outcome",
      detail: [summary, o.notes ?? ""].filter(Boolean).join(" — ") || undefined,
    });
  }

  // 3. Tasks — completed read as past, open as upcoming.
  const plantTasks = input.tasks.filter((t) => t.plant_instance_id === plant.id);
  for (const t of plantTasks) {
    if (t.status === "done") {
      past.push({
        id: `task:${t.id}`,
        kind: "task",
        date: (t.completed_at || t.due_on || t.created_at || "").slice(0, 10),
        title: t.title,
        detail: t.notes ?? undefined,
        status: "done",
      });
    } else {
      const date = (t.due_on || "").slice(0, 10);
      upcoming.push({
        id: `task:${t.id}`,
        kind: "task",
        date,
        title: t.title,
        detail: t.notes ?? undefined,
        status: "open",
        overdue: Boolean(date) && date < today,
      });
    }
  }

  // 4. Projected harvest milestone — gives a brand-new planting an arc even
  //    with zero tasks. Numeric maturity → a dated future milestone; otherwise
  //    fall back to the curated window label (undated).
  const ph = plant.plant_profile;
  if (ph && plant.planted_on && ph.maturity_basis !== "perennial") {
    const min = ph.days_to_maturity_min ?? ph.days_to_maturity_max ?? null;
    if (min !== null) {
      const harvestDate = addDaysISO(plant.planted_on, min);
      upcoming.push({
        id: `harvest:${plant.id}`,
        kind: "milestone",
        date: harvestDate,
        title: "Harvest window opens",
        detail: ph.harvest_window_label ?? undefined,
        projected: true,
        overdue: false,
      });
    } else if (ph.harvest_window_label) {
      upcoming.push({
        id: `harvest:${plant.id}`,
        kind: "milestone",
        date: "",
        title: "Harvest window",
        detail: ph.harvest_window_label,
        projected: true,
      });
    }
  } else if (ph && ph.maturity_basis === "perennial" && ph.perennial_first_harvest_label) {
    upcoming.push({
      id: `harvest:${plant.id}`,
      kind: "milestone",
      date: "",
      title: "First harvest",
      detail: ph.perennial_first_harvest_label,
      projected: true,
    });
  }

  // 5. Suggested next actions (the forward plan). Drop any that already overlap
  //    a real task on this plant so committed work never double-shows.
  const taskTitles = plantTasks.map((t) => t.title);
  for (const s of input.suggestions) {
    if (taskTitles.some((tt) => titlesOverlap(tt, s.taskTitle))) continue;
    upcoming.push({
      id: `sugg:${s.id}`,
      kind: "suggestion",
      date: addDaysISO(today, s.dueInDays),
      title: s.title,
      detail: s.rationale,
      projected: true,
      suggestion: s,
    });
  }

  // Sort: past oldest → newest; upcoming soonest → furthest, undated last.
  past.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  upcoming.sort((a, b) => {
    const ad = a.date || "9999-12-31";
    const bd = b.date || "9999-12-31";
    return ad.localeCompare(bd);
  });

  const currentStage = deriveLifecycleStage(
    plant,
    new Date(`${today}T00:00:00`)
  );

  return { past, upcoming, currentStage, today };
}
