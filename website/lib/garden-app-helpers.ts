import type {
  GardenBed,
  GardenPlantInstance,
  GardenSnapshot,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";

export function getTodayISO(date = new Date()): string {
  return date.toISOString().slice(0, 10);
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

export function getOpenTasks(tasks: GardenTask[]): GardenTask[] {
  return [...tasks]
    .filter((task) => task.status === "open")
    .sort((left, right) => {
      const leftDue = left.due_on ?? "9999-12-31";
      const rightDue = right.due_on ?? "9999-12-31";
      return leftDue.localeCompare(rightDue) || left.created_at.localeCompare(right.created_at);
    });
}
