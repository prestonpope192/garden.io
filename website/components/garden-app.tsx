"use client";

import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { AuthGate, type AuthGateResult } from "@/components/auth-gate";
import { InkStamp, SpecimenLabel } from "@/components/journal-primitives";
import { getTodayISO } from "@/lib/garden-app-helpers";
import type {
  GardenBed,
  GardenObservation,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantProfile,
  GardenPlantStatus,
  GardenProperty,
  GardenSnapshot,
  GardenTask,
  GardenWishlistItem,
  GardenZone
} from "@/lib/garden-app-types";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { CalendarView } from "@/components/views/calendar-view";
import { CatalogueView } from "@/components/views/catalogue-view";
import { GardenAskView } from "@/components/views/garden-ask-view";
import { PlantsView } from "@/components/views/plants-view";
import { PropertyView } from "@/components/views/property-view";
import { getCatalogPlantName } from "@/components/views/shared";
import { QuickLog } from "@/components/quick-log";

type GardenAppView = "ask" | "property" | "calendar" | "plants" | "catalogue";

type GardenAppProps = {
  authResult?: AuthGateResult | null;
  view: GardenAppView;
};

const emptySnapshot: GardenSnapshot = {
  plantProfiles: [],
  properties: [],
  zones: [],
  beds: [],
  plants: [],
  observations: [],
  tasks: [],
  outcomes: [],
  wishlist: []
};

type ViewTitle = { kicker: string; title: string; subtitle: string };

const viewTitles: Record<GardenAppView, ViewTitle> = {
  ask: {
    kicker: "Today",
    title: "Today",
    subtitle: "Add what changed. Get one next step."
  },
  property: {
    kicker: "Garden map",
    title: "My Garden",
    subtitle: "Places, beds, and plants in one view."
  },
  calendar: {
    kicker: "This week",
    title: "Weekly care",
    subtitle: "Start with what needs care. Let the rest wait."
  },
  plants: {
    kicker: "Your plants",
    title: "Plant Journal",
    subtitle: "Open a plant to see notes and care."
  },
  catalogue: {
    kicker: "For your beds",
    title: "Choose plants",
    subtitle: "Choose plants for the beds you have."
  }
};

const navItems: Array<{ view: GardenAppView; label: string; href: string }> = [
  { view: "ask", label: "Today", href: "/app/my-property" },
  { view: "property", label: "My Garden", href: "/app/garden-memory" },
  { view: "calendar", label: "Weekly care", href: "/app/calendar" },
  { view: "plants", label: "Plant Journal", href: "/app/my-plants" },
  { view: "catalogue", label: "Choose plants", href: "/app/plant-catalogue" }
];

export const GARDEN_MUTATION_MESSAGES = {
  gardenCreated: "Garden started. Add one place you can picture.",
  gardenUpdated: "Garden details updated.",
  gardenRemoved: "Garden removed.",
  areaAdded: "Place added. Now give the first plant a bed.",
  areaUpdated: "Place details updated.",
  areaRemoved: "Place removed.",
  bedAdded: "Bed added. Choose the plant for this spot.",
  bedUpdated: "Bed details updated.",
  bedRemoved: "Bed removed.",
  plantAdded: "Plant added. Add a note when you see a change.",
  plantUpdated: "Plant details updated.",
  plantRemoved: "Plant removed.",
  plantFinished: "Moved to past plants.",
  plantGrowing: "Marked as growing again.",
  noteSaved: "Note kept with your garden.",
  noteRemoved: "Note removed from your garden.",
  addGardenFirst: "Start your garden first so notes and care have a place to land.",
  careAdded: "Added to weekly care.",
  careCompleted: "Marked done.",
  careReopened: "Added back to weekly care.",
  careUpdated: "Care updated.",
  careRemoved: "Removed from weekly care.",
  resultSaved: "Kept in this plant's journal.",
  resultRemoved: "Removed from this plant's journal.",
  plantIdeaSaved: "Added to plants to try.",
  plantIdeaRemoved: "Removed from plants to try.",
  savedToGarden: "Kept in your garden.",
  changeFailed: "That change didn't go through. Check the details and try again."
} as const;

async function fetchPlantProfiles(slug?: string): Promise<GardenPlantProfile[]> {
  const response = await fetch(
    slug ? `/api/plant-profiles?slug=${encodeURIComponent(slug)}` : "/api/plant-profiles"
  );
  const payload = (await response.json()) as {
    ok?: boolean;
    message?: string;
    profiles?: GardenPlantProfile[];
  };

  if (!response.ok || !payload.ok) {
    throw new Error(payload.message ?? "Unable to load plant profiles.");
  }

  return payload.profiles ?? [];
}

export function GardenApp({ authResult = null, view }: GardenAppProps) {
  return (
    <AuthGate authResult={authResult}>
      {(session) => <GardenRecordsApp session={session} view={view} />}
    </AuthGate>
  );
}

function GardenRecordsApp({ session, view }: { session: Session; view: GardenAppView }) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [snapshot, setSnapshot] = useState<GardenSnapshot>(emptySnapshot);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [selectedBedId, setSelectedBedId] = useState<string>("");
  const [selectedPlantId, setSelectedPlantId] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  const getPlantProfileBySlug = async (slug: string) => {
    const existingProfile = snapshot.plantProfiles.find((profile) => profile.slug === slug);
    if (existingProfile) return existingProfile;

    const [profile] = await fetchPlantProfiles(slug);
    if (!profile) {
      throw new Error("Plant not found.");
    }
    return profile;
  };

  const activeProperty =
    snapshot.properties.find((property) => property.id === selectedPropertyId) ?? snapshot.properties[0] ?? null;
  const propertyZones = activeProperty
    ? snapshot.zones.filter((zone) => zone.property_id === activeProperty.id)
    : [];
  const propertyBeds = activeProperty
    ? snapshot.beds.filter((bed) => bed.property_id === activeProperty.id)
    : [];
  const propertyPlants = activeProperty
    ? snapshot.plants.filter((plant) => plant.property_id === activeProperty.id)
    : [];
  const propertyTasks = activeProperty
    ? snapshot.tasks.filter((task) => task.property_id === activeProperty.id)
    : [];
  const propertyObservations = activeProperty
    ? snapshot.observations.filter((observation) => observation.property_id === activeProperty.id)
    : [];
  const propertyOutcomes = activeProperty
    ? snapshot.outcomes.filter((outcome) => outcome.property_id === activeProperty.id)
    : [];

  // Focus is derived from selection: plant > bed > zone > property. These are
  // strict (no fallback to the first child) so the view can rest at any level.
  const activeZone = propertyZones.find((zone) => zone.id === selectedZoneId) ?? null;
  const activeBed = propertyBeds.find((bed) => bed.id === selectedBedId) ?? null;
  const activePlant = propertyPlants.find((plant) => plant.id === selectedPlantId) ?? null;

  const loadGardenData = async () => {
    setStatus("loading");
    setNotice("");

    const [
      propertiesResult,
      zonesResult,
      bedsResult,
      plantProfilesResult,
      plantsResult,
      observationsResult,
      tasksResult,
      outcomesResult,
      wishlistResult
    ] = await Promise.all([
      supabase.from("garden_properties").select("*").order("created_at", { ascending: true }),
      supabase.from("garden_zones").select("*").order("sort_order", { ascending: true }),
      supabase.from("garden_beds").select("*").order("sort_order", { ascending: true }),
      fetchPlantProfiles()
        .then((data) => ({ data, error: null as Error | null }))
        .catch((error: Error) => ({ data: [] as GardenPlantProfile[], error })),
      supabase
        .from("garden_plant_instances")
        .select("*")
        .order("created_at", { ascending: true }),
      supabase.from("garden_observations").select("*").order("observed_at", { ascending: false }),
      supabase.from("garden_tasks").select("*").order("due_on", { ascending: true, nullsFirst: false }),
      supabase
        .from("garden_plant_outcomes")
        .select("*")
        .order("harvested_on", { ascending: false, nullsFirst: false }),
      supabase
        .from("garden_wishlist")
        .select("*")
        .order("created_at", { ascending: true })
    ]);

    const firstError =
      propertiesResult.error ??
      zonesResult.error ??
      bedsResult.error ??
      plantProfilesResult.error ??
      plantsResult.error ??
      observationsResult.error ??
      tasksResult.error ??
      outcomesResult.error ??
      wishlistResult.error;

    if (firstError) {
      setStatus("error");
      setNotice("Unable to load your garden. Please refresh and try again.");
      return;
    }

    const plantProfiles = plantProfilesResult.data;
    const profilesById = new Map(plantProfiles.map((profile) => [profile.plant_profile_id, profile]));

    const observations = (observationsResult.data ?? []) as GardenObservation[];

    setSnapshot({
      plantProfiles,
      properties: (propertiesResult.data ?? []) as GardenProperty[],
      zones: (zonesResult.data ?? []) as GardenZone[],
      beds: (bedsResult.data ?? []) as GardenBed[],
      plants: ((plantsResult.data ?? []) as Omit<GardenPlantInstance, "plant_profile">[]).map((plant) => ({
        ...plant,
        plant_profile: profilesById.get(plant.plant_profile_id) ?? null
      })),
      observations: observations,
      tasks: (tasksResult.data ?? []) as GardenTask[],
      outcomes: (outcomesResult.data ?? []) as GardenPlantOutcome[],
      wishlist: ((wishlistResult.data ?? []) as Omit<GardenWishlistItem, "plant_profile">[]).map((item) => ({
        ...item,
        plant_profile: profilesById.get(item.plant_profile_id) ?? null
      }))
    });
    setStatus("ready");

    // Resolve signed URLs for observation photos (private bucket).
    const paths = observations.map((observation) => observation.image_path).filter((path): path is string => Boolean(path));
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage.from("garden-media").createSignedUrls(paths, 3600);
      if (signed) {
        const map: Record<string, string> = {};
        for (const entry of signed) {
          if (entry.path && entry.signedUrl) map[entry.path] = entry.signedUrl;
        }
        setMediaUrls(map);
      }
    } else {
      setMediaUrls({});
    }
  };

  useEffect(() => {
    loadGardenData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeProperty && snapshot.properties[0]) {
      setSelectedPropertyId(snapshot.properties[0].id);
    }
  }, [activeProperty, snapshot.properties]);

  // Deep-link restoration: Weekly care and other views can route here with
  // ?zone&bed&plant to focus a specific node in the garden map.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const zone = params.get("zone");
    const bed = params.get("bed");
    const plant = params.get("plant");
    if (zone) setSelectedZoneId(zone);
    if (bed) setSelectedBedId(bed);
    if (plant) setSelectedPlantId(plant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runMutation = async (
    mutation: () => Promise<void>,
    successMessage: string,
    options: { rethrow?: boolean } = {}
  ) => {
    setStatus("saving");
    setNotice("");

    try {
      await mutation();
      await loadGardenData();
      setStatus("ready");
      setNotice(successMessage);
    } catch (error) {
      setStatus("error");
      setNotice(GARDEN_MUTATION_MESSAGES.changeFailed);
      if (options.rethrow) throw error;
    }
  };

  const createProperty = (input: { name: string; label: string; region: string; growingZone: string; season: string }) =>
    runMutation(async () => {
      const { data, error } = await supabase
        .from("garden_properties")
        .insert({
          owner_user_id: session.user.id,
          name: input.name.trim(),
          label: input.label.trim() || "Garden",
          region: input.region.trim() || null,
          growing_zone: input.growingZone.trim() || null,
          season: input.season.trim() || null
        })
        .select("id")
        .single();

      if (error) throw error;
      setSelectedPropertyId(data.id);
    }, GARDEN_MUTATION_MESSAGES.gardenCreated);

  const updateProperty = (id: string, patch: Partial<Pick<GardenProperty, "name" | "label" | "region" | "growing_zone" | "season" | "notes" | "latitude" | "longitude" | "location_label">>) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_properties").update(patch).eq("id", id);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.gardenUpdated);

  const deleteProperty = (id: string) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_properties").delete().eq("id", id);
      if (error) throw error;
      setSelectedPropertyId("");
      setSelectedZoneId("");
      setSelectedBedId("");
      setSelectedPlantId("");
    }, GARDEN_MUTATION_MESSAGES.gardenRemoved);

  const createZone = (input: { name: string; purpose: string; light: string; water: string }) =>
    runMutation(async () => {
      if (!activeProperty) throw new Error("No garden selected.");
      const { data, error } = await supabase
        .from("garden_zones")
        .insert({
          property_id: activeProperty.id,
          name: input.name.trim(),
          purpose: input.purpose.trim() || null,
          light: input.light.trim() || null,
          water: input.water.trim() || null,
          sort_order: propertyZones.length
        })
        .select("id")
        .single();

      if (error) throw error;
      setSelectedZoneId(data.id);
      setSelectedBedId("");
      setSelectedPlantId("");
    }, GARDEN_MUTATION_MESSAGES.areaAdded);

  const updateZone = (id: string, patch: Partial<Pick<GardenZone, "name" | "purpose" | "light" | "water" | "notes">>) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_zones").update(patch).eq("id", id);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.areaUpdated);

  const deleteZone = (id: string) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_zones").delete().eq("id", id);
      if (error) throw error;
      if (selectedZoneId === id) {
        setSelectedZoneId("");
        setSelectedBedId("");
        setSelectedPlantId("");
      }
    }, GARDEN_MUTATION_MESSAGES.areaRemoved);

  const createBed = (input: { name: string; sun: string; water: string; soil: string }) =>
    runMutation(async () => {
      if (!activeProperty || !activeZone) throw new Error("No place selected.");
      const { data, error } = await supabase
        .from("garden_beds")
        .insert({
          property_id: activeProperty.id,
          zone_id: activeZone.id,
          name: input.name.trim(),
          sun: input.sun.trim() || null,
          water: input.water.trim() || null,
          soil: input.soil.trim() || null,
          sort_order: propertyBeds.filter((bed) => bed.zone_id === activeZone.id).length
        })
        .select("id")
        .single();

      if (error) throw error;
      setSelectedBedId(data.id);
      setSelectedPlantId("");
    }, GARDEN_MUTATION_MESSAGES.bedAdded);

  const updateBed = (id: string, patch: Partial<Pick<GardenBed, "name" | "sun" | "water" | "soil" | "notes">>) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_beds").update(patch).eq("id", id);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.bedUpdated);

  const deleteBed = (id: string) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_beds").delete().eq("id", id);
      if (error) throw error;
      if (selectedBedId === id) {
        setSelectedBedId("");
        setSelectedPlantId("");
      }
    }, GARDEN_MUTATION_MESSAGES.bedRemoved);

  const addPlant = (input: { slug: string; quantity: string; plantedOn: string; notes: string }) =>
    runMutation(async () => {
      if (!activeProperty || !activeBed) throw new Error("No bed selected.");
      const plantProfile = await getPlantProfileBySlug(input.slug);
      const quantity = Math.max(Number.parseFloat(input.quantity) || 1, 0.01);
      const { data, error } = await supabase
        .from("garden_plant_instances")
        .insert({
          property_id: activeProperty.id,
          zone_id: activeBed.zone_id,
          bed_id: activeBed.id,
          plant_profile_id: plantProfile.plant_profile_id,
          quantity,
          planted_on: input.plantedOn || null,
          notes: input.notes.trim() || null,
          status: "growing" satisfies GardenPlantStatus
        })
        .select("id")
        .single();

      if (error) throw error;
      setSelectedPlantId(data.id);
    }, GARDEN_MUTATION_MESSAGES.plantAdded);

  const updatePlant = (id: string, patch: Partial<Pick<GardenPlantInstance, "quantity" | "planted_on" | "notes">>) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_plant_instances").update(patch).eq("id", id);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.plantUpdated);

  const deletePlant = (id: string) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_plant_instances").delete().eq("id", id);
      if (error) throw error;
      if (selectedPlantId === id) setSelectedPlantId("");
    }, GARDEN_MUTATION_MESSAGES.plantRemoved);

  const updatePlantStatus = (plant: GardenPlantInstance, nextStatus: GardenPlantStatus) =>
    runMutation(async () => {
      const { error } = await supabase
        .from("garden_plant_instances")
        .update({ status: nextStatus })
        .eq("id", plant.id);

      if (error) throw error;
    }, nextStatus === "archived" ? GARDEN_MUTATION_MESSAGES.plantFinished : GARDEN_MUTATION_MESSAGES.plantGrowing);

  const addObservation = (note: string) =>
    runMutation(async () => {
      if (!activeProperty) throw new Error("No garden selected.");
      const { error } = await supabase.from("garden_observations").insert({
        property_id: activeProperty.id,
        zone_id: activeZone?.id ?? null,
        bed_id: activeBed?.id ?? null,
        plant_instance_id: activePlant?.id ?? null,
        note: note.trim()
      });

      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.noteSaved);

  const deleteObservation = (id: string) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_observations").delete().eq("id", id);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.noteRemoved);

  // One capture for a note plus optional photo against any scope.
  const quickLog = async (input: {
    note: string;
    file: File | null;
    zoneId: string | null;
    bedId: string | null;
    plantInstanceId: string | null;
  }) => {
    if (!activeProperty) {
      setNotice(GARDEN_MUTATION_MESSAGES.addGardenFirst);
      return;
    }
    await runMutation(async () => {
      let imagePath: string | null = null;
      if (input.file) {
        const ext = (input.file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `${session.user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("garden-media")
          .upload(path, input.file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        imagePath = path;
      }
      const { error } = await supabase.from("garden_observations").insert({
        property_id: activeProperty.id,
        zone_id: input.zoneId,
        bed_id: input.bedId,
        plant_instance_id: input.plantInstanceId,
        note: input.note.trim() || (imagePath ? "Photo" : ""),
        image_path: imagePath
      });
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.savedToGarden);
  };

  const addTask = (input: {
    title: string;
    dueOn: string;
    notes: string;
    propertyId?: string;
    zoneId?: string | null;
    bedId?: string | null;
    plantInstanceId?: string | null;
  }) =>
    runMutation(async () => {
      // Callers that know their scope (e.g. the per-plant timeline) pass it
      // explicitly; otherwise fall back to the app-level active context.
      const propertyId = input.propertyId ?? activeProperty?.id;
      if (!propertyId) throw new Error("No garden selected.");
      const { error } = await supabase.from("garden_tasks").insert({
        property_id: propertyId,
        zone_id: input.zoneId !== undefined ? input.zoneId : activeZone?.id ?? null,
        bed_id: input.bedId !== undefined ? input.bedId : activeBed?.id ?? null,
        plant_instance_id:
          input.plantInstanceId !== undefined ? input.plantInstanceId : activePlant?.id ?? null,
        title: input.title.trim(),
        due_on: input.dueOn || null,
        notes: input.notes.trim() || null
      });

      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.careAdded);

  const updateTaskStatus = (task: GardenTask) =>
    runMutation(async () => {
      const nextStatus = task.status === "done" ? "open" : "done";
      const { error } = await supabase
        .from("garden_tasks")
        .update({
          status: nextStatus,
          completed_at: nextStatus === "done" ? new Date().toISOString() : null
        })
        .eq("id", task.id);

      if (error) throw error;
    }, task.status === "done" ? GARDEN_MUTATION_MESSAGES.careReopened : GARDEN_MUTATION_MESSAGES.careCompleted);

  const updateTask = (id: string, patch: Partial<Pick<GardenTask, "title" | "due_on" | "notes">>) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_tasks").update(patch).eq("id", id);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.careUpdated);

  const deleteTask = (id: string) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_tasks").delete().eq("id", id);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.careRemoved);

  const addPlantOutcome = (
    plant: GardenPlantInstance,
    input: {
      result: GardenPlantOutcome["result"];
      harvestQuantity: number | null;
      harvestUnit: string | null;
      qualityRating: number | null;
      harvestedOn: string | null;
      notes: string;
    }
  ) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_plant_outcomes").insert({
        property_id: plant.property_id,
        plant_instance_id: plant.id,
        result: input.result,
        harvest_quantity: input.harvestQuantity,
        harvest_unit: input.harvestUnit?.trim() || null,
        quality_rating: input.qualityRating,
        harvested_on: input.harvestedOn || null,
        notes: input.notes.trim() || null
      });
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.resultSaved, { rethrow: true });

  const deletePlantOutcome = (id: string) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_plant_outcomes").delete().eq("id", id);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.resultRemoved, { rethrow: true });

  const saveWishlist = (slug: string) =>
    runMutation(async () => {
      const plantProfile = await getPlantProfileBySlug(slug);
      const { error } = await supabase.from("garden_wishlist").upsert(
        {
          owner_user_id: session.user.id,
          plant_profile_id: plantProfile.plant_profile_id
        },
        { onConflict: "owner_user_id,plant_profile_id" }
      );

      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.plantIdeaSaved);

  const removeWishlist = (plantProfileId: string) =>
    runMutation(async () => {
      const { error } = await supabase
        .from("garden_wishlist")
        .delete()
        .eq("owner_user_id", session.user.id)
        .eq("plant_profile_id", plantProfileId);
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.plantIdeaRemoved);

  const addPlantToBed = (slug: string, bedId: string) =>
    runMutation(async () => {
      const bed = propertyBeds.find((candidate) => candidate.id === bedId);
      if (!activeProperty || !bed) throw new Error("No bed selected.");
      const plantProfile = await getPlantProfileBySlug(slug);
      const { data, error } = await supabase
        .from("garden_plant_instances")
        .insert({
          property_id: activeProperty.id,
          zone_id: bed.zone_id,
          bed_id: bed.id,
          plant_profile_id: plantProfile.plant_profile_id,
          quantity: 1,
          planted_on: getTodayISO(),
          status: "growing" satisfies GardenPlantStatus
        })
        .select("id")
        .single();
      if (error) throw error;
      setSelectedBedId(bed.id);
      setSelectedPlantId(data.id);
    }, GARDEN_MUTATION_MESSAGES.plantAdded);

  const logPlantObservation = (plant: GardenPlantInstance, note: string) =>
    runMutation(async () => {
      const { error } = await supabase.from("garden_observations").insert({
        property_id: plant.property_id,
        zone_id: plant.zone_id,
        bed_id: plant.bed_id,
        plant_instance_id: plant.id,
        note: note.trim()
      });
      if (error) throw error;
    }, GARDEN_MUTATION_MESSAGES.noteSaved);

  const addCatalogPlantToBed = async (slug: string) => {
    const targetBed = activeBed ?? propertyBeds[0] ?? null;
    if (!activeProperty || !targetBed) {
      setNotice("Add a place and a bed first, then plants can land in them.");
      return;
    }

    await runMutation(async () => {
      const plantProfile = await getPlantProfileBySlug(slug);
      const { data, error } = await supabase
        .from("garden_plant_instances")
        .insert({
          property_id: activeProperty.id,
          zone_id: targetBed.zone_id,
          bed_id: targetBed.id,
          plant_profile_id: plantProfile.plant_profile_id,
          quantity: 1,
          planted_on: getTodayISO(),
          status: "growing" satisfies GardenPlantStatus
        })
        .select("id")
        .single();

      if (error) throw error;
      setSelectedBedId(targetBed.id);
      setSelectedPlantId(data.id);
    }, GARDEN_MUTATION_MESSAGES.plantAdded);
  };

  const [signingOut, setSigningOut] = useState(false);
  const signOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
  };

  const heading = viewTitles[view];
  const growingCount = propertyPlants.filter((plant) => plant.status === "growing").length;
  const plotSummary = activeProperty
    ? activeProperty.season?.trim() || `${propertyZones.length} places · ${growingCount} growing`
    : "New garden";

  const isAskHome = view === "ask";

  return (
    <main className={`garden-app-shell ${isAskHome ? "garden-app-shell--ai" : ""}`}>
      <header className="garden-app-header">
        <div className="garden-app-header__identity">
          <Link className="journal-shell__brand" href="/app/my-property">
            Garden.io
          </Link>
        </div>
        <nav aria-label="Garden sections" className="garden-app-header__nav">
          {navItems.map((item) => (
            <Link
              aria-current={view === item.view ? "page" : undefined}
              className={view === item.view ? "is-active" : undefined}
              href={item.href}
              key={item.view}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="garden-app-header__account">
          <span>{session.user.email}</span>
          <button className="folio-button" type="button" onClick={signOut} disabled={signingOut}>
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </header>

      {isAskHome ? (
        <GardenAskView
          activeProperty={activeProperty}
          zones={propertyZones}
          beds={propertyBeds}
          plants={propertyPlants}
          observations={propertyObservations}
          tasks={propertyTasks}
          isSaving={status === "saving"}
          quickLog={quickLog}
          addTask={addTask}
          updateTaskStatus={updateTaskStatus}
        />
      ) : (
      <section className="garden-app-layout">
        <section className="garden-app-main">
          {activeZone || activeBed || activePlant ? (
            <nav aria-label="Current garden place" className="garden-breadcrumb">
              {activeProperty ? (
                <button
                  className="garden-breadcrumb__crumb"
                  type="button"
                  onClick={() => {
                    setSelectedZoneId("");
                    setSelectedBedId("");
                    setSelectedPlantId("");
                  }}
                >
                  {activeProperty.name}
                </button>
              ) : null}
              {activeZone ? (
                <>
                  <span aria-hidden="true" className="garden-breadcrumb__sep">›</span>
                  <button
                    className="garden-breadcrumb__crumb"
                    type="button"
                    onClick={() => {
                      setSelectedBedId("");
                      setSelectedPlantId("");
                    }}
                  >
                    {activeZone.name}
                  </button>
                </>
              ) : null}
              {activeBed ? (
                <>
                  <span aria-hidden="true" className="garden-breadcrumb__sep">›</span>
                  <button
                    className="garden-breadcrumb__crumb"
                    type="button"
                    onClick={() => setSelectedPlantId("")}
                  >
                    {activeBed.name}
                  </button>
                </>
              ) : null}
              {activePlant ? (
                <>
                  <span aria-hidden="true" className="garden-breadcrumb__sep">›</span>
                  <span className="garden-breadcrumb__crumb">{getCatalogPlantName(activePlant)}</span>
                </>
              ) : null}
            </nav>
          ) : null}

          <header className="garden-app-title">
            <div>
              <SpecimenLabel tone="olive">{heading.kicker}</SpecimenLabel>
              <h1>{heading.title}</h1>
              <p>{heading.subtitle}</p>
            </div>
            <InkStamp tone="charcoal">{status === "loading" ? "Loading" : plotSummary}</InkStamp>
          </header>

          {notice ? (
            <p className={`garden-notice ${status === "error" ? "is-error" : ""}`} role={status === "error" ? "alert" : "status"}>
              {notice}
            </p>
          ) : null}

          {view === "property" ? (
            <PropertyView
              activeProperty={activeProperty}
              activeZone={activeZone}
              activeBed={activeBed}
              activePlant={activePlant}
              zones={propertyZones}
              beds={propertyBeds}
              plants={propertyPlants}
              plantProfiles={snapshot.plantProfiles}
              observations={propertyObservations}
              mediaUrls={mediaUrls}
              tasks={propertyTasks}
              outcomes={propertyOutcomes}
              selectedZoneId={selectedZoneId}
              selectedBedId={selectedBedId}
              selectedPlantId={selectedPlantId}
              setSelectedZoneId={setSelectedZoneId}
              setSelectedBedId={setSelectedBedId}
              setSelectedPlantId={setSelectedPlantId}
              isSaving={status === "saving"}
              isLoading={status === "loading"}
              createProperty={createProperty}
              updateProperty={updateProperty}
              deleteProperty={deleteProperty}
              createZone={createZone}
              updateZone={updateZone}
              deleteZone={deleteZone}
              createBed={createBed}
              updateBed={updateBed}
              deleteBed={deleteBed}
              addPlant={addPlant}
              updatePlant={updatePlant}
              deletePlant={deletePlant}
              updatePlantStatus={updatePlantStatus}
              addObservation={addObservation}
              deleteObservation={deleteObservation}
              addTask={addTask}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
              addPlantOutcome={addPlantOutcome}
              deletePlantOutcome={deletePlantOutcome}
            />
          ) : null}

          {view === "calendar" ? (
            <CalendarView
              tasks={propertyTasks}
              zones={propertyZones}
              beds={propertyBeds}
              plants={propertyPlants}
              updateTaskStatus={updateTaskStatus}
              updateTask={updateTask}
              addTask={addTask}
              season={activeProperty?.season ?? null}
              region={activeProperty?.region ?? null}
              property={activeProperty}
            />
          ) : null}

          {view === "plants" ? (
            <PlantsView
              beds={propertyBeds}
              zones={propertyZones}
              plants={propertyPlants}
              wishlist={snapshot.wishlist}
              tasks={propertyTasks}
              updatePlantStatus={updatePlantStatus}
              addPlantToBed={addPlantToBed}
              removeWishlist={removeWishlist}
              logPlantObservation={logPlantObservation}
              observations={propertyObservations}
              outcomes={propertyOutcomes}
              mediaUrls={mediaUrls}
              addTask={addTask}
              addPlantOutcome={addPlantOutcome}
              deletePlantOutcome={deletePlantOutcome}
            />
          ) : null}

          {view === "catalogue" ? (
            <CatalogueView
              activeBed={activeBed ?? propertyBeds[0] ?? null}
              plantProfiles={snapshot.plantProfiles}
              addCatalogPlantToBed={addCatalogPlantToBed}
              saveWishlist={saveWishlist}
            />
          ) : null}
        </section>
      </section>
      )}

      {isAskHome ? null : (
        <QuickLog
          zones={propertyZones}
          beds={propertyBeds}
          plants={propertyPlants}
          activeZoneId={selectedZoneId}
          activeBedId={selectedBedId}
          activePlantId={selectedPlantId}
          busy={status === "saving"}
          onLog={quickLog}
        />
      )}
    </main>
  );
}
