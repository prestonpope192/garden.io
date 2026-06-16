import type {
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantOutcomeResult,
} from "@/lib/garden-app-types";

// Phase 3C · Slice 3 — personal performance memory.
//
// Aggregates recorded outcomes into per-(bed × plant) and per-plant track
// records, so the suggestion engine can cite real history ("your tomatoes here
// rated 4/5 last time") instead of only generic heuristics. Pure + derived —
// no network, no schema reads beyond the snapshot it is handed.

export type PerformanceStat = {
  /** Number of outcome entries that fed this stat. */
  count: number;
  /** How many entries actually recorded a quality_rating (the avg's denominator). */
  qualityCount: number;
  /** Mean quality_rating over entries that recorded one; null if none did. */
  avgQuality: number | null;
  successCount: number;
  partialCount: number;
  failureCount: number;
  /** Sum of harvest_quantity over entries that recorded one; null if none did. */
  totalHarvest: number | null;
  /** Most recent entry's result / date (by harvested_on, then created_at). */
  lastResult: GardenPlantOutcomeResult | null;
  lastDate: string | null;
};

export type PerformanceMemory = {
  /** key: `${bed_id}::${plant_profile_id}` */
  byBedProfile: Map<string, PerformanceStat>;
  /** key: plant_profile_id (across the whole property) */
  byProfile: Map<string, PerformanceStat>;
};

function entryDate(o: GardenPlantOutcome): string {
  return (o.harvested_on || o.created_at || "").slice(0, 10);
}

function aggregate(outcomes: GardenPlantOutcome[]): PerformanceStat {
  let qualitySum = 0;
  let qualityN = 0;
  let harvestSum = 0;
  let harvestN = 0;
  let successCount = 0;
  let partialCount = 0;
  let failureCount = 0;
  let lastResult: GardenPlantOutcomeResult | null = null;
  let lastDate: string | null = null;

  for (const o of outcomes) {
    if (o.quality_rating !== null && o.quality_rating !== undefined) {
      qualitySum += o.quality_rating;
      qualityN += 1;
    }
    if (o.harvest_quantity !== null && o.harvest_quantity !== undefined) {
      harvestSum += o.harvest_quantity;
      harvestN += 1;
    }
    if (o.result === "success") successCount += 1;
    else if (o.result === "partial") partialCount += 1;
    else if (o.result === "failure") failureCount += 1;

    // Track the most recent entry's result. Update on a strictly newer date, or
    // on a same-date tie only to FILL an as-yet-unknown result — never let a
    // same-date null-result entry clobber a real verdict.
    const d = entryDate(o);
    if (d && (lastDate === null || d > lastDate || (d === lastDate && lastResult === null))) {
      lastDate = d;
      lastResult = o.result;
    }
  }

  return {
    count: outcomes.length,
    qualityCount: qualityN,
    avgQuality: qualityN > 0 ? qualitySum / qualityN : null,
    successCount,
    partialCount,
    failureCount,
    totalHarvest: harvestN > 0 ? harvestSum : null,
    lastResult,
    lastDate,
  };
}

export function buildPerformanceMemory(
  plants: GardenPlantInstance[],
  outcomes: GardenPlantOutcome[]
): PerformanceMemory {
  const plantById = new Map(plants.map((p) => [p.id, p]));
  const byBedProfileGroups = new Map<string, GardenPlantOutcome[]>();
  const byProfileGroups = new Map<string, GardenPlantOutcome[]>();

  const pushTo = (m: Map<string, GardenPlantOutcome[]>, key: string, o: GardenPlantOutcome) => {
    const arr = m.get(key);
    if (arr) arr.push(o);
    else m.set(key, [o]);
  };

  for (const o of outcomes) {
    const plant = plantById.get(o.plant_instance_id);
    if (!plant) continue; // orphaned outcome (plant deleted) — skip
    const profileId = plant.plant_profile_id;
    pushTo(byBedProfileGroups, `${plant.bed_id}::${profileId}`, o);
    pushTo(byProfileGroups, profileId, o);
  }

  const byBedProfile = new Map<string, PerformanceStat>();
  for (const [key, group] of byBedProfileGroups) byBedProfile.set(key, aggregate(group));
  const byProfile = new Map<string, PerformanceStat>();
  for (const [key, group] of byProfileGroups) byProfile.set(key, aggregate(group));

  return { byBedProfile, byProfile };
}

/** A one-line, human summary of a track record, e.g. "averaged 4.3/5 over 3 harvests". */
export function describePerformance(stat: PerformanceStat): string {
  const parts: string[] = [];
  if (stat.avgQuality !== null) {
    const n = stat.qualityCount;
    parts.push(`averaged ${stat.avgQuality.toFixed(1)}/5 over ${n} recorded ${n === 1 ? "harvest" : "harvests"}`);
  } else {
    parts.push(`${stat.count} recorded ${stat.count === 1 ? "outcome" : "outcomes"}`);
  }
  const verdicts: string[] = [];
  if (stat.successCount) verdicts.push(`${stat.successCount} success`);
  if (stat.partialCount) verdicts.push(`${stat.partialCount} partial`);
  if (stat.failureCount) verdicts.push(`${stat.failureCount} failure`);
  if (verdicts.length) parts.push(`(${verdicts.join(", ")})`);
  return parts.join(" ");
}

/**
 * Classify a track record into a coarse verdict the suggestion engine can act
 * on. "strong" → worth repeating; "weak" → worth a caution; else "mixed".
 */
export function classifyPerformance(stat: PerformanceStat): "strong" | "weak" | "mixed" {
  if (stat.count === 0) return "mixed";
  const goodQuality = stat.avgQuality !== null && stat.avgQuality >= 4;
  const badQuality = stat.avgQuality !== null && stat.avgQuality <= 2.5;
  const moreFail = stat.failureCount + stat.partialCount > stat.successCount;
  const moreWin = stat.successCount > stat.failureCount + stat.partialCount;
  if ((goodQuality || moreWin) && !badQuality && !moreFail) return "strong";
  if (badQuality || moreFail) return "weak";
  return "mixed";
}
