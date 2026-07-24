import type {
  GardenBed,
  GardenPlantInstance,
  GardenSnapshot,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";

export function getTodayISO(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalISODate(value: string): Date | null {
  const iso = value.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function formatGardenDate(value: string | null | undefined): string {
  if (!value) return "No date";
  const date = parseLocalISODate(value);
  if (!date) return value;
  const now = new Date();
  const includeYear = date.getFullYear() !== now.getFullYear();
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {})
  }).format(date);
}

export function sortByCreatedAt<T extends { created_at: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => left.created_at.localeCompare(right.created_at));
}

export function getZoneName(zones: GardenZone[], zoneId: string | null | undefined): string {
  return zones.find((zone) => zone.id === zoneId)?.name ?? "Unplaced";
}

export function getBedName(beds: GardenBed[], bedId: string | null | undefined): string {
  return beds.find((bed) => bed.id === bedId)?.name ?? "No bed";
}

export function getPlantName(
  plants: GardenPlantInstance[],
  plantId: string | null | undefined
): string {
  return plants.find((plant) => plant.id === plantId)?.plant_profile?.display_name ?? "General";
}

export function getSnapshotReadiness(snapshot: GardenSnapshot) {
  const hasProperty = snapshot.properties.length > 0;
  const hasZone = snapshot.zones.length > 0;
  const hasBed = snapshot.beds.length > 0;
  const hasPlant = snapshot.plants.some((plant) => plant.status === "growing");
  const hasTask = snapshot.tasks.length > 0;
  const hasObservation = snapshot.observations.length > 0;

  return {
    hasProperty,
    hasZone,
    hasBed,
    hasPlant,
    hasTask,
    hasObservation,
    completeCount: [hasProperty, hasZone, hasBed, hasPlant, hasTask, hasObservation].filter(Boolean).length
  };
}

export type GardenSetupStepId = "area" | "bed" | "plant" | "complete";

export type GardenSetupProgress = {
  stepId: GardenSetupStepId;
  isComplete: boolean;
  currentStepIndex: number;
  totalSteps: number;
  completedStepIds: GardenSetupStepId[];
};

export function getGardenSetupProgress(input: {
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
}): GardenSetupProgress {
  const hasArea = input.zones.length > 0;
  const hasBed = input.beds.length > 0;
  const hasGrowingPlant = input.plants.some((plant) => plant.status === "growing");
  const completedStepIds: GardenSetupStepId[] = [];

  if (hasArea) completedStepIds.push("area");
  if (hasBed) completedStepIds.push("bed");
  if (hasGrowingPlant) completedStepIds.push("plant");

  if (!hasArea) {
    return { stepId: "area", isComplete: false, currentStepIndex: 0, totalSteps: 3, completedStepIds };
  }
  if (!hasBed) {
    return { stepId: "bed", isComplete: false, currentStepIndex: 1, totalSteps: 3, completedStepIds };
  }
  if (!hasGrowingPlant) {
    return { stepId: "plant", isComplete: false, currentStepIndex: 2, totalSteps: 3, completedStepIds };
  }

  return { stepId: "complete", isComplete: true, currentStepIndex: 3, totalSteps: 3, completedStepIds };
}

export function getOpenTasks(tasks: GardenTask[]): GardenTask[] {
  return [...tasks]
    .filter((task) => task.status === "open")
    .sort((left, right) => {
      const leftDue = left.due_on ?? "9999-12-31";
      const rightDue = right.due_on ?? "9999-12-31";
      return leftDue.localeCompare(rightDue) || left.created_at.localeCompare(right.created_at);
    });
}
