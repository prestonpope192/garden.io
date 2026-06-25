"use client";

import { FormEvent, useEffect, useState } from "react";
import { InkStamp, MarginNote, SpecimenLabel } from "@/components/journal-primitives";
import {
  formatGardenDate,
  getGardenSetupProgress,
  getTodayISO,
  sortByCreatedAt,
  type GardenSetupProgress,
  type GardenSetupStepId
} from "@/lib/garden-app-helpers";
import {
  deriveSeason,
  dueDateISO,
  formatSuggestionType,
  formatSuggestionWindowLabel,
  generateSuggestions,
  type GardenSuggestion
} from "@/lib/garden-suggestions";
import { deriveLifecycleStage, harvestReadiness } from "@/lib/garden-phenology";
import { buildFrostAlert, type ForecastDay } from "@/lib/garden-frost";
import { DiagnosePanel } from "@/components/diagnose-panel";
import { PlantTimeline, type AddPlantOutcomeInput } from "@/components/plant-timeline";
import type {
  GardenBed,
  GardenObservation,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantProfile,
  GardenProperty,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";
import {
  buildFieldOptions,
  formatQuantity,
  formatPlantTypeLabel,
  getCatalogPlantName,
  LIGHT_OPTIONS,
  SOIL_OPTIONS,
  WATER_OPTIONS
} from "./shared";

type PropertyInput = { name: string; label: string; region: string; growingZone: string; season: string };
type ZoneInput = { name: string; purpose: string; light: string; water: string };
type BedInput = { name: string; sun: string; water: string; soil: string };
type PlantInput = { slug: string; quantity: string; plantedOn: string; notes: string };
type TaskInput = { title: string; dueOn: string; notes: string };

export type PropertyViewProps = {
  activeProperty: GardenProperty | null;
  activeZone: GardenZone | null;
  activeBed: GardenBed | null;
  activePlant: GardenPlantInstance | null;
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  plantProfiles: GardenPlantProfile[];
  observations: GardenObservation[];
  tasks: GardenTask[];
  outcomes: GardenPlantOutcome[];
  selectedZoneId: string;
  selectedBedId: string;
  selectedPlantId: string;
  setSelectedZoneId: (value: string) => void;
  setSelectedBedId: (value: string) => void;
  setSelectedPlantId: (value: string) => void;
  isSaving: boolean;
  isLoading: boolean;
  createProperty: (input: PropertyInput) => Promise<void>;
  updateProperty: (id: string, patch: Partial<Pick<GardenProperty, "name" | "label" | "region" | "growing_zone" | "season" | "notes" | "latitude" | "longitude" | "location_label">>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  createZone: (input: ZoneInput) => Promise<void>;
  updateZone: (id: string, patch: Partial<Pick<GardenZone, "name" | "purpose" | "light" | "water" | "notes">>) => Promise<void>;
  deleteZone: (id: string) => Promise<void>;
  mediaUrls: Record<string, string>;
  createBed: (input: BedInput) => Promise<void>;
  updateBed: (id: string, patch: Partial<Pick<GardenBed, "name" | "sun" | "water" | "soil" | "notes">>) => Promise<void>;
  deleteBed: (id: string) => Promise<void>;
  addPlant: (input: PlantInput) => Promise<void>;
  updatePlant: (id: string, patch: Partial<Pick<GardenPlantInstance, "quantity" | "planted_on" | "notes">>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  updatePlantStatus: (plant: GardenPlantInstance, status: GardenPlantInstance["status"]) => Promise<void>;
  addObservation: (note: string) => Promise<void>;
  deleteObservation: (id: string) => Promise<void>;
  addTask: (input: TaskInput) => Promise<void>;
  updateTaskStatus: (task: GardenTask) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addPlantOutcome: (plant: GardenPlantInstance, input: AddPlantOutcomeInput) => Promise<void>;
  deletePlantOutcome: (id: string) => Promise<void>;
  isReadOnly?: boolean;
};

type FocusLevel = "property" | "zone" | "bed" | "plant";
type DrawerMode = "info" | "tasks" | "ideas" | "actions";
type ActiveSetupStepId = Exclude<GardenSetupStepId, "complete">;

const EMPTY_PROPERTY: PropertyInput = { name: "", label: "Garden", region: "", growingZone: "", season: "" };
const EMPTY_ZONE: ZoneInput = { name: "", purpose: "", light: "", water: "" };
const EMPTY_BED: BedInput = { name: "", sun: "", water: "", soil: "" };

const FOCUS_LABELS: Record<FocusLevel, string> = {
  property: "Garden",
  zone: "Place",
  bed: "Bed",
  plant: "Plant"
};

const SETUP_STEP_IDS: ActiveSetupStepId[] = ["area", "bed", "plant"];

const SETUP_STEP_COPY: Record<ActiveSetupStepId, { label: string; title: string; body: string; action: string }> = {
  area: {
    label: "Place",
    title: "Name where it grows",
    body: "Choose the part of the garden you can picture first, like Kitchen Garden, Orchard Row, or Shade Border.",
    action: "Add place"
  },
  bed: {
    label: "Bed",
    title: "Name its bed",
    body: "Give your first plant a clear home, like a bed, container row, or border.",
    action: "Add bed"
  },
  plant: {
    label: "Plant",
    title: "Choose the plant",
    body: "Put one plant in that bed so notes stay where they belong.",
    action: "Add plant"
  }
};

function isActiveSetupStep(stepId: GardenSetupStepId): stepId is ActiveSetupStepId {
  return stepId !== "complete";
}

function SetupWizard(props: {
  progress: GardenSetupProgress;
  onClose: () => void;
  onPrimaryAction: () => void;
}) {
  if (!isActiveSetupStep(props.progress.stepId)) return null;

  const currentStep = props.progress.stepId;
  const copy = SETUP_STEP_COPY[currentStep];

  return (
    <div className="garden-setup-wizard" role="presentation">
      <section
        aria-describedby="garden-setup-wizard-description"
        aria-labelledby="garden-setup-wizard-title"
        aria-modal="true"
        className="garden-setup-wizard__dialog"
        role="dialog"
      >
        <div className="garden-setup-wizard__header">
          <SpecimenLabel tone="olive">Give one plant a home</SpecimenLabel>
          <button className="folio-button" type="button" onClick={props.onClose}>
            Close
          </button>
        </div>
        <h2 id="garden-setup-wizard-title">{copy.title}</h2>
        <p id="garden-setup-wizard-description">{copy.body}</p>

        <ol className="garden-setup-wizard__steps" aria-label="Give one plant a home">
          {SETUP_STEP_IDS.map((stepId, index) => {
            const isComplete = props.progress.completedStepIds.includes(stepId);
            const isCurrent = stepId === currentStep;
            return (
              <li
                className={`garden-setup-wizard__step ${isComplete ? "is-complete" : ""} ${isCurrent ? "is-current" : ""}`}
                key={stepId}
              >
                <span className="garden-setup-wizard__step-number" aria-hidden="true">
                  {isComplete ? "Done" : index + 1}
                </span>
                <span>{SETUP_STEP_COPY[stepId].label}</span>
              </li>
            );
          })}
        </ol>

        <div className="garden-setup-wizard__actions">
          <button className="button" type="button" onClick={props.onPrimaryAction}>
            {copy.action}
          </button>
          <button className="folio-button" type="button" onClick={props.onClose}>
            Finish later
          </button>
        </div>
      </section>
    </div>
  );
}

function focusLabel(focus: FocusLevel) {
  return FOCUS_LABELS[focus];
}

function drawerTabLabel(mode: DrawerMode, focus: FocusLevel) {
  if (mode === "info") return "Details";
  if (mode === "tasks") return "Care";
  if (mode === "ideas") return "Care ideas";
  return focus === "plant" ? "Update" : "Add";
}

function growing(plants: GardenPlantInstance[]) {
  return plants.filter((plant) => plant.status === "growing");
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function formatPlantStatus(status: GardenPlantInstance["status"]) {
  return status === "archived" ? "Past" : "Growing";
}

function getPlantTypeSummary(profile: GardenPlantProfile | null | undefined) {
  const type = profile?.plant_type_code ? formatPlantTypeLabel(profile.plant_type_code) : null;
  const lifecycle = profile?.lifecycle_type?.toLowerCase() ?? "";
  const lifecycleLabel = lifecycle.includes("peren") ? "Perennial" : lifecycle.includes("ann") ? "Annual" : null;
  return [type, lifecycleLabel].filter(Boolean).join(" · ");
}

function FieldText(props: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string }) {
  return (
    <label className="garden-field">
      <span>{props.label}</span>
      <input
        className="input"
        type={props.type ?? "text"}
        required={props.required}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </label>
  );
}

function FieldSelect(props: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="garden-field">
      <span>{props.label}</span>
      <select className="input" value={props.value} onChange={(event) => props.onChange(event.target.value)}>
        <option value="">—</option>
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PropertyView(props: PropertyViewProps) {
  const { activeProperty, activeZone, activeBed, activePlant } = props;
  const isReadOnly = props.isReadOnly ?? false;
  const focus: FocusLevel = activePlant ? "plant" : activeBed ? "bed" : activeZone ? "zone" : "property";
  const focusKey = `${focus}:${activeProperty?.id ?? ""}:${activeZone?.id ?? ""}:${activeBed?.id ?? ""}:${activePlant?.id ?? ""}`;
  const sortedZones = sortByCreatedAt(props.zones);
  const growingPlants = growing(props.plants);
  const gardenSummary = `${plural(growingPlants.length, "plant")} in ${plural(props.beds.length, "bed")}`;
  const firstZone = sortedZones[0] ?? null;
  const firstBed = sortByCreatedAt(props.beds)[0] ?? null;
  const setupProgress = getGardenSetupProgress({
    zones: props.zones,
    beds: props.beds,
    plants: props.plants
  });
  const setupIncomplete = Boolean(activeProperty) && !setupProgress.isComplete && !isReadOnly;

  const [drawerMode, setDrawerMode] = useState<DrawerMode>("info");
  const [dismissedIdeas, setDismissedIdeas] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ message: string; run: () => void } | null>(null);
  const [setupWizardOpen, setSetupWizardOpen] = useState(setupIncomplete);
  const [setupWizardDismissed, setSetupWizardDismissed] = useState(false);

  const [propertyDraft, setPropertyDraft] = useState<PropertyInput>(EMPTY_PROPERTY);
  const [zoneDraft, setZoneDraft] = useState<ZoneInput>(EMPTY_ZONE);
  const [bedDraft, setBedDraft] = useState<BedInput>(EMPTY_BED);
  const [plantDraft, setPlantDraft] = useState<PlantInput>({ slug: "", quantity: "1", plantedOn: getTodayISO(), notes: "" });
  const [noteDraft, setNoteDraft] = useState("");
  const [diagnoseSeed, setDiagnoseSeed] = useState<{ text: string; nonce: number }>({ text: "", nonce: 0 });
  const [taskDraft, setTaskDraft] = useState<TaskInput>({ title: "", dueOn: getTodayISO(), notes: "" });
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isReadOnly) return;
    if (drawerMode === "actions") setDrawerMode("info");
    if (isEditing) setIsEditing(false);
    if (confirmDelete) setConfirmDelete(null);
  }, [confirmDelete, drawerMode, isEditing, isReadOnly]);

  // Forecast-driven frost alert + one-time location geocoding.
  const [frostAlert, setFrostAlert] = useState<GardenSuggestion | null>(null);
  const [geoMatches, setGeoMatches] = useState<
    { label: string; latitude: number; longitude: number }[]
  >([]);
  const [geoBusy, setGeoBusy] = useState(false);

  const lat = activeProperty?.latitude ?? null;
  const lon = activeProperty?.longitude ?? null;
  useEffect(() => {
    if (lat == null || lon == null) {
      setFrostAlert(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = (await res.json()) as { ok?: boolean; days?: ForecastDay[] };
        if (cancelled || !data.ok || !data.days) return;
        setFrostAlert(
          buildFrostAlert({ days: data.days, growingPlants: props.plants, today: getTodayISO() })
        );
      } catch {
        if (!cancelled) setFrostAlert(null);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProperty?.id, lat, lon, props.plants]);

  const runGeocode = async () => {
    const q = (editDraft.location_query ?? "").trim();
    if (q.length < 2) return;
    setGeoBusy(true);
    try {
      const res = await fetch(`/api/weather?geocode=${encodeURIComponent(q)}`);
      const data = (await res.json()) as {
        ok?: boolean;
        matches?: { label: string; latitude: number; longitude: number }[];
      };
      setGeoMatches(data.ok ? data.matches ?? [] : []);
    } catch {
      setGeoMatches([]);
    } finally {
      setGeoBusy(false);
    }
  };

  const pickLocation = (match: { label: string; latitude: number; longitude: number }) => {
    setEditDraft((d) => ({
      ...d,
      location_label: match.label,
      latitude: String(match.latitude),
      longitude: String(match.longitude),
    }));
    setGeoMatches([]);
  };

  // Reset transient drawer state whenever the focused node changes.
  useEffect(() => {
    setIsEditing(false);
    setConfirmDelete(null);
  }, [focusKey]);

  // Keep the add-plant select pointed at a real, loaded profile.
  useEffect(() => {
    if (props.plantProfiles.length > 0 && !props.plantProfiles.some((profile) => profile.slug === plantDraft.slug)) {
      setPlantDraft((draft) => ({ ...draft, slug: props.plantProfiles[0].slug }));
    }
  }, [props.plantProfiles, plantDraft.slug]);

  const busy = props.isSaving;

  useEffect(() => {
    if (!setupIncomplete) {
      setSetupWizardOpen(false);
      setSetupWizardDismissed(false);
      return;
    }

    if (!setupWizardDismissed) {
      setSetupWizardOpen(true);
    }
  }, [activeProperty?.id, setupIncomplete, setupProgress.stepId, setupWizardDismissed]);

  const goProperty = (mode?: DrawerMode) => {
    props.setSelectedZoneId("");
    props.setSelectedBedId("");
    props.setSelectedPlantId("");
    if (mode) setDrawerMode(mode);
  };
  const goZone = (zone: GardenZone, mode?: DrawerMode) => {
    props.setSelectedZoneId(zone.id);
    props.setSelectedBedId("");
    props.setSelectedPlantId("");
    if (mode) setDrawerMode(mode);
  };
  const goBed = (bed: GardenBed, mode?: DrawerMode) => {
    props.setSelectedZoneId(bed.zone_id);
    props.setSelectedBedId(bed.id);
    props.setSelectedPlantId("");
    if (mode) setDrawerMode(mode);
  };
  const goPlant = (plant: GardenPlantInstance, mode?: DrawerMode) => {
    props.setSelectedZoneId(plant.zone_id);
    props.setSelectedBedId(plant.bed_id);
    props.setSelectedPlantId(plant.id);
    if (mode) setDrawerMode(mode);
  };

  const openSetupWizard = () => {
    if (!setupIncomplete) return;
    setSetupWizardDismissed(false);
    setSetupWizardOpen(true);
  };

  const closeSetupWizard = () => {
    setSetupWizardDismissed(true);
    setSetupWizardOpen(false);
  };

  const runSetupWizardAction = () => {
    setSetupWizardOpen(false);
    if (setupProgress.stepId === "area") {
      goProperty("actions");
      return;
    }
    if (setupProgress.stepId === "bed" && firstZone) {
      goZone(firstZone, "actions");
      return;
    }
    if (setupProgress.stepId === "plant" && firstBed) {
      goBed(firstBed, "actions");
    }
  };

  const renderZoneInner = (zone: GardenZone) => {
    const zoneBeds = sortByCreatedAt(props.beds.filter((bed) => bed.zone_id === zone.id));
    return (
      <>
        <button className="garden-zone__head" type="button" onClick={() => goZone(zone, "info")}>
          <span className="garden-zone__name">{zone.name}</span>
          <span className="garden-zone__tag">{zoneBeds.length} {zoneBeds.length === 1 ? "bed" : "beds"}</span>
        </button>
        {zone.light || zone.purpose ? (
          <p className="garden-zone__sub">{[zone.purpose, zone.light].filter(Boolean).join(" · ")}</p>
        ) : null}
        <div className="garden-zone__beds">
          {zoneBeds.length === 0 ? (
            isReadOnly ? (
              <p className="garden-plot__empty-note">No beds here yet.</p>
            ) : (
            <button className="garden-bed garden-bed--empty" type="button" onClick={() => goZone(zone, "actions")}>
              Add your first bed
            </button>
            )
          ) : (
            zoneBeds.map((bed) => {
              const bedPlants = growing(props.plants.filter((plant) => plant.bed_id === bed.id));
              const bedFocused = activeBed?.id === bed.id;
              return (
                <div className={`garden-bed ${bedFocused ? "is-active" : ""}`} key={bed.id}>
                  <button className="garden-bed__head" type="button" onClick={() => goBed(bed, "info")}>
                    <span className="garden-bed__name">{bed.name}</span>
                    <span className="garden-bed__count">{bedPlants.length}</span>
                  </button>
                  <div className="garden-bed__plants">
                    {bedPlants.slice(0, 4).map((plant) => (
                      <button
                        className={`garden-chip ${activePlant?.id === plant.id ? "is-active" : ""}`}
                        key={plant.id}
                        type="button"
                        onClick={() => goPlant(plant, "info")}
                      >
                        {getCatalogPlantName(plant)}
                        {plant.quantity > 1 ? ` · ${formatQuantity(plant.quantity)}` : ""}
                      </button>
                    ))}
                    {bedPlants.length > 4 ? <span className="garden-chip garden-chip--more">+{bedPlants.length - 4}</span> : null}
                    {isReadOnly ? null : (
                      <button className="garden-chip garden-chip--add" type="button" onClick={() => goBed(bed, "actions")}>+ plant</button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {isReadOnly ? null : (
          <button className="garden-zone__add" type="button" onClick={() => goZone(zone, "actions")}>+ add bed</button>
        )}
      </>
    );
  };

  // ---- No property yet: a single, calm first-run prompt ----------------------
  if (!activeProperty) {
    return (
      <div className="garden-plot garden-plot--solo">
        {props.isLoading ? (
          <p className="garden-plot__loading">Opening your garden…</p>
        ) : (
          <div className="garden-plot__firstrun">
            <SpecimenLabel tone="olive">First step</SpecimenLabel>
            <h2>Start with the place you grow.</h2>
            <p>Name your garden. Then add one place, one bed, and one plant.</p>
            <form
              className="garden-form"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                void props.createProperty(propertyDraft).then(() => setPropertyDraft(EMPTY_PROPERTY));
              }}
            >
              <FieldText label="Garden name" required value={propertyDraft.name} placeholder="Backyard garden" onChange={(value) => setPropertyDraft({ ...propertyDraft, name: value })} />
              <button className="button" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Start your garden"}
              </button>
              <p className="garden-drawer__muted" style={{marginTop: '0.5rem', fontSize: '0.75rem'}}>
                Add your growing zone and location later for frost alerts.
              </p>
            </form>
          </div>
        )}
      </div>
    );
  }

  const nextGardenTask =
    props.tasks
      .filter((task) => task.status === "open")
      .sort((a, b) => (a.due_on ?? "9999-12-31").localeCompare(b.due_on ?? "9999-12-31"))[0] ?? null;
  const nextTaskPlant = nextGardenTask?.plant_instance_id
    ? props.plants.find((plant) => plant.id === nextGardenTask.plant_instance_id) ?? null
    : null;
  const nextTaskBed = nextGardenTask?.bed_id
    ? props.beds.find((bed) => bed.id === nextGardenTask.bed_id) ?? null
    : nextTaskPlant
      ? props.beds.find((bed) => bed.id === nextTaskPlant.bed_id) ?? null
      : null;
  const nextTaskZone = nextGardenTask?.zone_id
    ? props.zones.find((zone) => zone.id === nextGardenTask.zone_id) ?? null
    : nextTaskPlant
      ? props.zones.find((zone) => zone.id === nextTaskPlant.zone_id) ?? null
      : nextTaskBed
        ? props.zones.find((zone) => zone.id === nextTaskBed.zone_id) ?? null
        : null;
  const nextTaskPlace = [nextTaskBed?.name, nextTaskZone?.name].filter(Boolean).join(" · ");
  const nextTaskPlantName = nextTaskPlant ? getCatalogPlantName(nextTaskPlant) : null;
  const showDefaultGuide = focus === "property" && drawerMode === "info" && !isEditing && setupProgress.isComplete;

  // ---- Drawer body builders --------------------------------------------------

  const scopeLabel =
    focus === "plant"
      ? `Plant · ${getCatalogPlantName(activePlant)}`
      : focus === "bed"
        ? `Bed · ${activeBed?.name}`
        : focus === "zone"
          ? `Place · ${activeZone?.name}`
          : activeProperty.name;

  const startEdit = () => {
    if (focus === "property") {
      setEditDraft({
        name: activeProperty.name,
        label: activeProperty.label ?? "",
        region: activeProperty.region ?? "",
        growing_zone: activeProperty.growing_zone ?? "",
        season: activeProperty.season ?? "",
        notes: activeProperty.notes ?? "",
        location_label: activeProperty.location_label ?? "",
        latitude: activeProperty.latitude != null ? String(activeProperty.latitude) : "",
        longitude: activeProperty.longitude != null ? String(activeProperty.longitude) : "",
        location_query: ""
      });
      setGeoMatches([]);
    } else if (focus === "zone" && activeZone) {
      setEditDraft({
        name: activeZone.name,
        purpose: activeZone.purpose ?? "",
        light: activeZone.light ?? "",
        water: activeZone.water ?? "",
        notes: activeZone.notes ?? ""
      });
    } else if (focus === "bed" && activeBed) {
      setEditDraft({
        name: activeBed.name,
        sun: activeBed.sun ?? "",
        water: activeBed.water ?? "",
        soil: activeBed.soil ?? "",
        notes: activeBed.notes ?? ""
      });
    } else if (focus === "plant" && activePlant) {
      setEditDraft({
        quantity: formatQuantity(activePlant.quantity),
        planted_on: activePlant.planted_on ?? "",
        notes: activePlant.notes ?? ""
      });
    }
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (focus === "property") {
      void props.updateProperty(activeProperty.id, {
        name: editDraft.name?.trim() || activeProperty.name,
        label: editDraft.label?.trim() || "Garden",
        region: editDraft.region?.trim() || null,
        growing_zone: editDraft.growing_zone?.trim() || null,
        season: editDraft.season?.trim() || null,
        notes: editDraft.notes?.trim() || null,
        latitude: editDraft.latitude ? Number(editDraft.latitude) : null,
        longitude: editDraft.longitude ? Number(editDraft.longitude) : null,
        location_label: editDraft.location_label?.trim() || null
      }).then(() => setIsEditing(false));
    } else if (focus === "zone" && activeZone) {
      void props.updateZone(activeZone.id, {
        name: editDraft.name?.trim() || activeZone.name,
        purpose: editDraft.purpose?.trim() || null,
        light: editDraft.light?.trim() || null,
        water: editDraft.water?.trim() || null,
        notes: editDraft.notes?.trim() || null
      }).then(() => setIsEditing(false));
    } else if (focus === "bed" && activeBed) {
      void props.updateBed(activeBed.id, {
        name: editDraft.name?.trim() || activeBed.name,
        sun: editDraft.sun?.trim() || null,
        water: editDraft.water?.trim() || null,
        soil: editDraft.soil?.trim() || null,
        notes: editDraft.notes?.trim() || null
      }).then(() => setIsEditing(false));
    } else if (focus === "plant" && activePlant) {
      void props.updatePlant(activePlant.id, {
        quantity: Math.max(Number.parseFloat(editDraft.quantity) || activePlant.quantity, 0.01),
        planted_on: editDraft.planted_on?.trim() || null,
        notes: editDraft.notes?.trim() || null
      }).then(() => setIsEditing(false));
    }
  };

  const requestDelete = () => {
    if (focus === "property") {
      const z = props.zones.length;
      const b = props.beds.length;
      const p = growing(props.plants).length;
      setConfirmDelete({
        message: `Remove "${activeProperty.name}" and everything in it — ${plural(z, "place")}, ${plural(b, "bed")}, ${plural(p, "plant")}? This cannot be undone.`,
        run: () => void props.deleteProperty(activeProperty.id)
      });
    } else if (focus === "zone" && activeZone) {
      const b = props.beds.filter((bed) => bed.zone_id === activeZone.id).length;
      const p = growing(props.plants.filter((plant) => plant.zone_id === activeZone.id)).length;
      setConfirmDelete({
        message: `Remove place "${activeZone.name}"? Its ${plural(b, "bed")} and ${plural(p, "plant")} are removed with it. Notes you already kept stay in your garden.`,
        run: () => void props.deleteZone(activeZone.id).then(() => goProperty())
      });
    } else if (focus === "bed" && activeBed) {
      const p = growing(props.plants.filter((plant) => plant.bed_id === activeBed.id)).length;
      const zoneForBed = props.zones.find((z) => z.id === activeBed.zone_id) ?? null;
      setConfirmDelete({
        message: `Remove bed "${activeBed.name}"? Its ${plural(p, "plant")} ${p === 1 ? "is" : "are"} removed with it. Notes you already kept stay in your garden.`,
        run: () => void props.deleteBed(activeBed.id).then(() => zoneForBed ? goZone(zoneForBed) : goProperty())
      });
    } else if (focus === "plant" && activePlant) {
      setConfirmDelete({
        message: `Remove ${getCatalogPlantName(activePlant)} from ${activeBed?.name ?? "this bed"}? Notes and care kept with this plant will be removed too.`,
        run: () => void props.deletePlant(activePlant.id).then(() => activeBed ? goBed(activeBed) : activeZone ? goZone(activeZone) : goProperty())
      });
    }
  };

  const renderInfo = () => {
    if (isEditing) {
      return (
        <div className="garden-drawer__section">
          <div className="garden-field-grid">
            {focus === "property" ? (
              <>
                <FieldText label="Name" value={editDraft.name ?? ""} onChange={(value) => setEditDraft({ ...editDraft, name: value })} />
                <FieldText label="Kind of garden" value={editDraft.label ?? ""} onChange={(value) => setEditDraft({ ...editDraft, label: value })} />
                <FieldText label="Location or region" value={editDraft.region ?? ""} onChange={(value) => setEditDraft({ ...editDraft, region: value })} />
                <FieldText label="Growing zone" value={editDraft.growing_zone ?? ""} onChange={(value) => setEditDraft({ ...editDraft, growing_zone: value })} />
                <FieldText label="Season" value={editDraft.season ?? ""} onChange={(value) => setEditDraft({ ...editDraft, season: value })} />
                <div className="garden-field garden-geo" style={{ gridColumn: "1 / -1" }}>
                  <span>Location (for frost alerts)</span>
                  <div className="garden-geo__row">
                    <input
                      className="input"
                      placeholder="Town or ZIP"
                      value={editDraft.location_query ?? ""}
                      onChange={(event) => setEditDraft({ ...editDraft, location_query: event.target.value })}
                    />
                    <button type="button" className="folio-button" onClick={() => void runGeocode()} disabled={geoBusy}>
                      {geoBusy ? "Finding…" : "Find"}
                    </button>
                  </div>
                  {geoMatches.length > 0 ? (
                    <ul className="garden-geo__matches">
                      {geoMatches.map((match) => (
                        <li key={`${match.latitude},${match.longitude}`}>
                          <button type="button" className="garden-link-button" onClick={() => pickLocation(match)}>
                            {match.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {editDraft.location_label ? (
                    <p className="garden-drawer__muted">📍 {editDraft.location_label}</p>
                  ) : null}
                </div>
              </>
            ) : null}
            {focus === "zone" ? (
              <>
                <FieldText label="Name" value={editDraft.name ?? ""} onChange={(value) => setEditDraft({ ...editDraft, name: value })} />
                <FieldText label="Use" value={editDraft.purpose ?? ""} onChange={(value) => setEditDraft({ ...editDraft, purpose: value })} />
                <FieldSelect label="Light" value={editDraft.light ?? ""} options={buildFieldOptions(LIGHT_OPTIONS, editDraft.light)} onChange={(value) => setEditDraft({ ...editDraft, light: value })} />
                <FieldSelect label="Water" value={editDraft.water ?? ""} options={buildFieldOptions(WATER_OPTIONS, editDraft.water)} onChange={(value) => setEditDraft({ ...editDraft, water: value })} />
              </>
            ) : null}
            {focus === "bed" ? (
              <>
                <FieldText label="Name" value={editDraft.name ?? ""} onChange={(value) => setEditDraft({ ...editDraft, name: value })} />
                <FieldSelect label="Sun" value={editDraft.sun ?? ""} options={buildFieldOptions(LIGHT_OPTIONS, editDraft.sun)} onChange={(value) => setEditDraft({ ...editDraft, sun: value })} />
                <FieldSelect label="Water" value={editDraft.water ?? ""} options={buildFieldOptions(WATER_OPTIONS, editDraft.water)} onChange={(value) => setEditDraft({ ...editDraft, water: value })} />
                <FieldSelect label="Soil" value={editDraft.soil ?? ""} options={buildFieldOptions(SOIL_OPTIONS, editDraft.soil)} onChange={(value) => setEditDraft({ ...editDraft, soil: value })} />
              </>
            ) : null}
            {focus === "plant" ? (
              <>
                <FieldText label="Quantity" type="number" value={editDraft.quantity ?? ""} onChange={(value) => setEditDraft({ ...editDraft, quantity: value })} />
                <FieldText label="Planted on" type="date" value={editDraft.planted_on ?? ""} onChange={(value) => setEditDraft({ ...editDraft, planted_on: value })} />
              </>
            ) : null}
          </div>
          <label className="garden-field">
            <span>Notes</span>
            <textarea className="input garden-textarea" value={editDraft.notes ?? ""} onChange={(event) => setEditDraft({ ...editDraft, notes: event.target.value })} />
          </label>
          <div className="garden-drawer__actions-row">
            <button className="folio-button" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="button" type="button" onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
          </div>
        </div>
      );
    }

    if (focus === "property") {
      return (
        <div className="garden-drawer__section garden-property-guide">
          <SpecimenLabel tone="olive">
            {setupProgress.isComplete && nextGardenTask ? "This week" : setupProgress.isComplete ? "Garden at a glance" : "Give one plant a home"}
          </SpecimenLabel>
          {!setupProgress.isComplete ? (
            <>
              <p>{`${gardenSummary}. Add one place, one bed, and one plant so your notes have a home.`}</p>
              <p className="garden-property-guide__next">You can fill in the rest later.</p>
            </>
          ) : nextGardenTask ? (
            <>
              <p className="garden-property-guide__focus">
                <strong>{nextTaskPlantName ?? nextTaskBed?.name ?? nextTaskZone?.name ?? "Garden"}</strong>
                <span>
                  {nextGardenTask.title}
                  {nextGardenTask.due_on ? ` · ${formatGardenDate(nextGardenTask.due_on)}` : ""}
                </span>
                {nextTaskPlace ? <em>{nextTaskPlace}</em> : null}
              </p>
              <p>
                {nextTaskPlantName
                  ? `${gardenSummary}. Start with ${nextTaskPlantName}. Read its notes before you act.`
                  : nextTaskBed?.name
                    ? `${gardenSummary}. Start with care in ${nextTaskBed.name}.`
                    : nextTaskZone?.name
                      ? `${gardenSummary}. Start with care in ${nextTaskZone.name}.`
                      : `${gardenSummary}. Start with the next care step.`}
              </p>
            </>
          ) : (
            <>
              <p>{`${gardenSummary}. Choose a bed or plant when you want its notes.`}</p>
              <p className="garden-property-guide__next">No care waiting this week.</p>
            </>
          )}
          <div className="garden-property-guide__actions">
            {!setupProgress.isComplete ? (
              isReadOnly ? null : (
                <button className="folio-button" type="button" onClick={openSetupWizard}>
                  Give one plant a home
                </button>
              )
            ) : (
              <>
                {nextTaskPlant ? (
                  <button className="folio-button" type="button" onClick={() => goPlant(nextTaskPlant, "info")}>
                    View {nextTaskPlantName} notes
                  </button>
                ) : null}
                {isReadOnly ? null : (
                  <>
                    <button className="folio-button" type="button" onClick={() => goProperty("tasks")}>
                      See weekly care
                    </button>
                    <button className="folio-button" type="button" onClick={() => goProperty("actions")}>
                      Add place
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    const rows: Array<[string, string]> = [];
    if (focus === "zone" && activeZone) {
      if (activeZone.purpose) rows.push(["Use", activeZone.purpose]);
      if (activeZone.light) rows.push(["Light", activeZone.light]);
      if (activeZone.water) rows.push(["Water", activeZone.water]);
      rows.push(["Beds", String(props.beds.filter((bed) => bed.zone_id === activeZone.id).length)]);
    } else if (focus === "bed" && activeBed) {
      if (activeBed.sun) rows.push(["Sun", activeBed.sun]);
      if (activeBed.water) rows.push(["Water", activeBed.water]);
      if (activeBed.soil) rows.push(["Soil", activeBed.soil]);
      rows.push(["Plants", String(growing(props.plants.filter((plant) => plant.bed_id === activeBed.id)).length)]);
    } else if (focus === "plant" && activePlant) {
      rows.push(["Quantity", `${formatQuantity(activePlant.quantity)} growing`]);
      if (activePlant.planted_on) rows.push(["Planted", formatGardenDate(activePlant.planted_on)]);
      const stage = deriveLifecycleStage(activePlant);
      if (stage) rows.push(["Stage", stage.label]);
      const harvest = harvestReadiness(activePlant);
      const ph = activePlant.plant_profile;
      if (harvest) rows.push(["Harvest", harvest.label]);
      else if (ph?.perennial_first_harvest_label) rows.push(["Harvest", ph.perennial_first_harvest_label]);
      else if (ph?.harvest_window_label) rows.push(["Harvest", ph.harvest_window_label]);
      if (ph?.days_to_maturity_min) {
        const dmax = ph.days_to_maturity_max ?? ph.days_to_maturity_min;
        rows.push(["Days to maturity", ph.days_to_maturity_min === dmax ? `${dmax}` : `${ph.days_to_maturity_min}–${dmax}`]);
      }
      if (ph?.planting_window_label) rows.push(["Planting", ph.planting_window_label]);
      const plantTypeSummary = getPlantTypeSummary(activePlant.plant_profile);
      if (plantTypeSummary) rows.push(["Plant kind", plantTypeSummary]);
      rows.push(["Status", formatPlantStatus(activePlant.status)]);
    }

    const noteText =
      focus === "zone"
        ? activeZone?.notes
        : focus === "bed"
          ? activeBed?.notes
          : activePlant?.notes;

    const scopeMatch = (zoneId: string | null, bedId: string | null, plantId: string | null) => {
      if (focus === "zone") return zoneId === activeZone?.id;
      if (focus === "bed") return bedId === activeBed?.id;
      return plantId === activePlant?.id;
    };
    const scopedOpenTasks = props.tasks
      .filter((task) => scopeMatch(task.zone_id, task.bed_id, task.plant_instance_id))
      .filter((task) => task.status === "open")
      .sort((a, b) => (a.due_on ?? "9999").localeCompare(b.due_on ?? "9999"));
    const nextScopedTask = scopedOpenTasks[0] ?? null;
    const detailTitle =
      focus === "zone"
        ? activeZone?.name ?? "Place"
        : focus === "bed"
          ? activeBed?.name ?? "Bed"
          : activePlant
            ? getCatalogPlantName(activePlant)
            : "Garden";
    const detailMeta =
      focus === "zone"
        ? `${plural(props.beds.filter((bed) => bed.zone_id === activeZone?.id).length, "bed")} here`
        : focus === "bed"
          ? `${plural(growing(props.plants.filter((plant) => plant.bed_id === activeBed?.id)).length, "growing plant")} here`
          : [activeBed?.name, activeZone?.name].filter(Boolean).join(" · ") || "Plant in your garden";
    type TimelineEntry = { id: string; kind: "note" | "task"; date: string; title: string; note?: string; imagePath?: string | null; status?: string };
    const timeline: TimelineEntry[] = [
      ...props.observations
        .filter((o) => scopeMatch(o.zone_id, o.bed_id, o.plant_instance_id))
        .map((o) => ({ id: o.id, kind: "note" as const, date: (o.observed_at || o.created_at || "").slice(0, 10), title: "", note: o.note, imagePath: o.image_path })),
      ...props.tasks
        .filter((t) => scopeMatch(t.zone_id, t.bed_id, t.plant_instance_id))
        .map((t) => ({ id: t.id, kind: "task" as const, date: (t.completed_at || t.due_on || t.created_at || "").slice(0, 10), title: t.title, status: t.status }))
    ]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 12);

    const plantTimelineSuggestions =
      focus === "plant" && activePlant
        ? generateSuggestions({
            focus: "plant",
            property: activeProperty,
            zone: activeZone,
            bed: activeBed,
            plant: activePlant,
            zones: props.zones,
            beds: props.beds,
            plants: props.plants,
            season: deriveSeason(new Date().getMonth()),
            existingTaskTitles: props.tasks
              .filter((t) => t.status === "open" && t.plant_instance_id === activePlant.id)
              .map((t) => t.title),
            outcomes: props.outcomes,
          })
        : [];

    return (
      <div className="garden-drawer__section">
        <div className="garden-drawer__hero">
          <div>
            <h3>{detailTitle}</h3>
            <p>{detailMeta}</p>
          </div>
          {focus === "plant" && activePlant ? (
            <span className="garden-drawer__status">{formatPlantStatus(activePlant.status)}</span>
          ) : null}
        </div>
        <p className="garden-drawer__next">
          {nextScopedTask
            ? `This week: ${nextScopedTask.title}${nextScopedTask.due_on ? ` (${formatGardenDate(nextScopedTask.due_on)})` : ""}`
            : "No care waiting here this week."}
        </p>

        <dl className="garden-detail-list">
          {rows.map(([label, value]) => (
            <div className="garden-detail-list__row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {noteText ? (
          <MarginNote icon="journal" title="Notes">
            <p>{noteText}</p>
          </MarginNote>
        ) : null}

        {focus === "plant" && activePlant ? (
          <PlantTimeline
            plant={activePlant}
            observations={props.observations}
            tasks={props.tasks}
            outcomes={props.outcomes}
            suggestions={plantTimelineSuggestions}
            mediaUrls={props.mediaUrls}
            today={getTodayISO()}
            addTask={props.addTask}
            addPlantOutcome={props.addPlantOutcome}
            deletePlantOutcome={props.deletePlantOutcome}
            busy={busy}
            isReadOnly={isReadOnly}
          />
        ) : timeline.length > 0 ? (
          <div className="garden-timeline">
            <SpecimenLabel>Notes and care</SpecimenLabel>
            {timeline.map((entry) => (
              <div className={`garden-timeline__item garden-timeline__item--${entry.kind}`} key={`${entry.kind}-${entry.id}`}>
                <span className="garden-timeline__date">{entry.date ? formatGardenDate(entry.date) : "—"}</span>
                <div className="garden-timeline__body">
                  {entry.kind === "task" ? (
                    <p className="garden-timeline__text">
                      <span className="garden-timeline__tag">{entry.status === "done" ? "✓ done" : "care"}</span> {entry.title}
                    </p>
                  ) : (
                    <>
                      <p className="garden-timeline__text">{entry.note}</p>
                      {entry.imagePath && props.mediaUrls[entry.imagePath] ? (
                        <img className="garden-timeline__photo" src={props.mediaUrls[entry.imagePath]} alt={entry.note || "Garden photo"} />
                      ) : null}
                      {isReadOnly ? null : (
                        <button className="garden-link-button" type="button" onClick={() => props.deleteObservation(entry.id)} disabled={busy}>
                          Remove note
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isReadOnly ? null : (
          <details className="garden-drawer__manage" open={Boolean(confirmDelete)}>
            <summary>Change this {focusLabel(focus).toLowerCase()}</summary>
            {confirmDelete ? (
              <div className="garden-confirm">
                <p>{confirmDelete.message}</p>
                <div className="garden-confirm__actions">
                  <button className="folio-button" type="button" onClick={() => setConfirmDelete(null)}>Keep {focusLabel(focus).toLowerCase()}</button>
                  <button className="button button--danger" type="button" onClick={() => { confirmDelete.run(); setConfirmDelete(null); }} disabled={busy}>
                    Remove {focusLabel(focus).toLowerCase()}
                  </button>
                </div>
              </div>
            ) : (
              <div className="garden-drawer__manage-body">
                <div className="garden-drawer__actions-row">
                  <button className="folio-button" type="button" onClick={startEdit}>Edit this {focusLabel(focus).toLowerCase()}</button>
                  {focus === "plant" && activePlant ? (
                    <button className="folio-button" type="button" onClick={() => props.updatePlantStatus(activePlant, "archived")} disabled={busy}>
                      Move to past plants
                    </button>
                  ) : null}
                </div>
                <button className="garden-drawer__danger" type="button" onClick={requestDelete} disabled={busy}>
                  Remove this {focusLabel(focus).toLowerCase()}
                </button>
              </div>
            )}
          </details>
        )}
      </div>
    );
  };

  const renderTasks = () => {
    const scoped = props.tasks.filter((task) => {
      if (focus === "property") return true;
      if (focus === "zone") return task.zone_id === activeZone?.id;
      if (focus === "bed") return task.bed_id === activeBed?.id;
      return task.plant_instance_id === activePlant?.id;
    });
    const open = scoped
      .filter((task) => task.status === "open")
      .sort((a, b) => (a.due_on ?? "9999").localeCompare(b.due_on ?? "9999"));
    const done = scoped.filter((task) => task.status === "done").slice(0, 8);

    return (
      <div className="garden-drawer__section">
        {open.length === 0 ? <p className="garden-drawer__muted">No care waiting here right now.</p> : null}
        {open.map((task) => (
          <div className="garden-task-row" key={task.id}>
            {isReadOnly ? (
              <span className="garden-task-row__check" aria-hidden="true" />
            ) : (
              <button className="garden-task-row__check" type="button" aria-label="Mark care done" onClick={() => props.updateTaskStatus(task)} disabled={busy} />
            )}
            <div className="garden-task-row__body">
              <strong>{task.title}</strong>
              {task.due_on ? <span>{formatGardenDate(task.due_on)}</span> : null}
            </div>
            {isReadOnly ? null : (
            <button className="garden-link-button" type="button" onClick={() => props.deleteTask(task.id)} disabled={busy}>Remove from weekly care</button>
            )}
          </div>
        ))}

        {done.length > 0 ? (
          <details className="garden-done">
            <summary>Done ({done.length})</summary>
            {done.map((task) => (
              <div className="garden-task-row is-done" key={task.id}>
                {isReadOnly ? (
                  <span className="garden-task-row__check is-checked" aria-hidden="true" />
                ) : (
                  <button className="garden-task-row__check is-checked" type="button" aria-label="Put care back in the plan" onClick={() => props.updateTaskStatus(task)} disabled={busy} />
                )}
                <div className="garden-task-row__body">
                  <strong>{task.title}</strong>
                  <span>{formatGardenDate(task.completed_at?.slice(0, 10) ?? task.due_on)}</span>
                </div>
              </div>
            ))}
          </details>
        ) : null}

        {isReadOnly ? null : (
          <form
          className="garden-form garden-form--compact"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void props.addTask(taskDraft).then(() => setTaskDraft({ title: "", dueOn: getTodayISO(), notes: "" }));
          }}
          >
            <FieldText label="What needs doing?" required value={taskDraft.title} placeholder="Water tomatoes" onChange={(value) => setTaskDraft({ ...taskDraft, title: value })} />
            <FieldText label="When" type="date" value={taskDraft.dueOn} onChange={(value) => setTaskDraft({ ...taskDraft, dueOn: value })} />
            <button className="folio-button" type="submit" disabled={busy}>Add to weekly care</button>
          </form>
        )}
      </div>
    );
  };

  const renderActions = () => {
    const diagnoseContext =
      focus === "plant" && activePlant
        ? {
            name: getCatalogPlantName(activePlant),
            botanical: activePlant.plant_profile?.botanical_name_full ?? null,
            type: activePlant.plant_profile?.plant_type_code ?? null,
            stage: deriveLifecycleStage(activePlant)?.label ?? null,
            location: [activeZone?.name, activeBed?.name].filter(Boolean).join(" › ") || null,
            sun: activeBed?.sun ?? activePlant.plant_profile?.preferred_light ?? null,
            water: activeBed?.water ?? activePlant.plant_profile?.water_need_level ?? null,
            soil: activeBed?.soil ?? null,
            plantedOn: activePlant.planted_on ?? null,
            season: deriveSeason(new Date().getMonth()),
            hardinessZone: activeProperty.growing_zone ?? null,
            recentNotes: props.observations
              .filter((observation) => observation.plant_instance_id === activePlant.id)
              .slice(0, 5)
              .map((observation) => observation.note)
          }
        : null;
    return (
      <div className="garden-drawer__section">
        {focus === "property" ? (
          <form
            className="garden-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              void props.createZone(zoneDraft).then(() => setZoneDraft(EMPTY_ZONE));
            }}
          >
            <SpecimenLabel tone="clay">Name this place</SpecimenLabel>
            <FieldText label="Place name" required value={zoneDraft.name} placeholder="Kitchen garden" onChange={(value) => setZoneDraft({ ...zoneDraft, name: value })} />
            <FieldText label="Use" value={zoneDraft.purpose} placeholder="Vegetables, herbs, flowers..." onChange={(value) => setZoneDraft({ ...zoneDraft, purpose: value })} />
            <div className="garden-field-grid">
              <FieldSelect label="Light" value={zoneDraft.light} options={buildFieldOptions(LIGHT_OPTIONS, zoneDraft.light)} onChange={(value) => setZoneDraft({ ...zoneDraft, light: value })} />
              <FieldSelect label="Water" value={zoneDraft.water} options={buildFieldOptions(WATER_OPTIONS, zoneDraft.water)} onChange={(value) => setZoneDraft({ ...zoneDraft, water: value })} />
            </div>
            <button className="button" type="submit" disabled={busy}>Save this place</button>
          </form>
        ) : null}

        {focus === "zone" && activeZone ? (
          <form
            className="garden-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              void props.createBed(bedDraft).then(() => setBedDraft(EMPTY_BED));
            }}
          >
            <SpecimenLabel tone="clay">Name this bed</SpecimenLabel>
            <FieldText label="Bed name" required value={bedDraft.name} placeholder="Raised bed 2" onChange={(value) => setBedDraft({ ...bedDraft, name: value })} />
            <div className="garden-field-grid">
              <FieldSelect label="Sun" value={bedDraft.sun} options={buildFieldOptions(LIGHT_OPTIONS, bedDraft.sun)} onChange={(value) => setBedDraft({ ...bedDraft, sun: value })} />
              <FieldSelect label="Water" value={bedDraft.water} options={buildFieldOptions(WATER_OPTIONS, bedDraft.water)} onChange={(value) => setBedDraft({ ...bedDraft, water: value })} />
              <FieldSelect label="Soil" value={bedDraft.soil} options={buildFieldOptions(SOIL_OPTIONS, bedDraft.soil)} onChange={(value) => setBedDraft({ ...bedDraft, soil: value })} />
            </div>
            <button className="button" type="submit" disabled={busy}>Save this bed</button>
          </form>
        ) : null}

        {focus === "bed" && activeBed ? (
          <form
            className="garden-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              void props.addPlant(plantDraft).then(() => {
                setPlantDraft({ slug: props.plantProfiles[0]?.slug ?? plantDraft.slug, quantity: "1", plantedOn: getTodayISO(), notes: "" });
                setDrawerMode("tasks");
              });
            }}
          >
            <SpecimenLabel tone="clay">What&apos;s growing in {activeBed.name}?</SpecimenLabel>
            <label className="garden-field">
              <span>Plant name</span>
              <select className="input" value={plantDraft.slug} onChange={(event) => setPlantDraft({ ...plantDraft, slug: event.target.value })}>
                {props.plantProfiles.map((profile) => (
                  <option key={profile.slug} value={profile.slug}>{profile.display_name}</option>
                ))}
              </select>
            </label>
            <div className="garden-field-grid">
              <FieldText label="Quantity" type="number" value={plantDraft.quantity} onChange={(value) => setPlantDraft({ ...plantDraft, quantity: value })} />
              <FieldText label="Planted on" type="date" value={plantDraft.plantedOn} onChange={(value) => setPlantDraft({ ...plantDraft, plantedOn: value })} />
            </div>
            <button className="button" type="submit" disabled={busy || props.plantProfiles.length === 0}>Save this plant</button>
          </form>
        ) : null}

        {focus === "plant" && activePlant ? (
          <div className="garden-add-section">
            {diagnoseContext ? (
              <DiagnosePanel context={diagnoseContext} addTask={props.addTask} addObservation={props.addObservation} seed={diagnoseSeed} />
            ) : null}
          </div>
        ) : null}

        {focus !== "property" ? (
          <form
            className="garden-form garden-form--compact"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (!noteDraft.trim()) return;
              void props.addObservation(noteDraft).then(() => setNoteDraft(""));
            }}
          >
            <SpecimenLabel tone="olive">Keep a garden note</SpecimenLabel>
            <label className="garden-field">
              <span>Note</span>
              <textarea className="input garden-textarea" placeholder="First tomato, aphids on kale, rain soaked the beds..." value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} />
            </label>
            <div className="garden-note-actions">
              <button className="folio-button" type="submit" disabled={busy}>Keep in garden</button>
              {focus === "plant" && activePlant ? (
                <button
                  className="folio-button"
                  type="button"
                  disabled={busy || !noteDraft.trim()}
                  onClick={() => {
                    const text = noteDraft.trim();
                    if (!text) return;
                    void props.addObservation(text).then(() => {
                      setNoteDraft("");
                      setDiagnoseSeed((prev) => ({ text, nonce: prev.nonce + 1 }));
                    });
                  }}
                >
                  Save and get care help
                </button>
              ) : null}
            </div>
          </form>
        ) : null}
      </div>
    );
  };

  const renderIdeas = () => {
    const season = deriveSeason(new Date().getMonth());
    const existingTaskTitles = props.tasks.filter((task) => task.status === "open").map((task) => task.title);
    const ideas = generateSuggestions({
      focus,
      property: activeProperty,
      zone: activeZone,
      bed: activeBed,
      plant: activePlant,
      zones: props.zones,
      beds: props.beds,
      plants: props.plants,
      season,
      existingTaskTitles,
      outcomes: props.outcomes
    }).filter((idea) => !dismissedIdeas.has(idea.id));

    const acceptIdea = (idea: GardenSuggestion) => {
      void props.addTask({ title: idea.taskTitle, dueOn: dueDateISO(idea.dueInDays), notes: idea.rationale });
      setDismissedIdeas((prev) => new Set(prev).add(idea.id));
    };
    const dismissIdea = (id: string) => setDismissedIdeas((prev) => new Set(prev).add(id));

    // A live frost alert (if any) leads the list as a high-priority warning.
    const withFrost =
      frostAlert && !dismissedIdeas.has(frostAlert.id) ? [frostAlert, ...ideas] : ideas;

    if (withFrost.length === 0) {
      return (
        <div className="garden-drawer__section">
          <p className="garden-drawer__muted">No new care ideas for this {focusLabel(focus).toLowerCase()} right now. Add notes as the season changes.</p>
        </div>
      );
    }

    return (
      <div className="garden-drawer__section garden-ideas">
        {withFrost.map((idea) => (
          <article className={`garden-idea garden-idea--${idea.type}`} key={idea.id}>
            <div className="garden-idea__head">
              <span className="garden-idea__confidence">{formatSuggestionWindowLabel(idea.windowLabel)}</span>
              {idea.type === "suggestion" ? null : (
                <span className="garden-idea__type">{formatSuggestionType(idea.type)}</span>
              )}
            </div>
            <strong className="garden-idea__title">{idea.title}</strong>
            <p className="garden-idea__why">{idea.rationale}</p>
            {isReadOnly ? null : (
              <div className="garden-idea__actions">
                <button className="button" type="button" onClick={() => acceptIdea(idea)} disabled={busy}>Add to weekly care</button>
                <button className="folio-button" type="button" onClick={() => dismissIdea(idea.id)}>Skip</button>
              </div>
            )}
          </article>
        ))}
      </div>
    );
  };

  const gardenDrawer = (
    <aside className="garden-drawer" aria-label="Garden notebook">
      <div className="garden-drawer__scope">
        <InkStamp tone="olive">{focusLabel(focus)}</InkStamp>
        <span>{scopeLabel}</span>
      </div>
      {showDefaultGuide ? null : (
        <div className="garden-drawer__tabs" role="tablist">
          {(isReadOnly
            ? (["info", "tasks", "ideas"] as DrawerMode[])
            : (["info", "tasks", "ideas", "actions"] as DrawerMode[])
          ).map((mode) => (
            <button
              key={mode}
              role="tab"
              aria-selected={drawerMode === mode}
              className={`garden-drawer__tab ${drawerMode === mode ? "is-active" : ""}`}
              type="button"
              onClick={() => setDrawerMode(mode)}
            >
              {drawerTabLabel(mode, focus)}
            </button>
          ))}
        </div>
      )}
      <div className="garden-drawer__body">
        {drawerMode === "info" ? renderInfo() : null}
        {drawerMode === "tasks" ? renderTasks() : null}
        {drawerMode === "ideas" ? renderIdeas() : null}
        {drawerMode === "actions" ? renderActions() : null}
      </div>
    </aside>
  );

  // ---- Render ----------------------------------------------------------------

  return (
    <div className="garden-property">
      {setupIncomplete && setupWizardOpen ? (
        <SetupWizard
          progress={setupProgress}
          onClose={closeSetupWizard}
          onPrimaryAction={runSetupWizardAction}
        />
      ) : null}

      <section className="garden-plot">
        <header className="garden-plot__header">
          <div>
            <SpecimenLabel tone="olive">Your garden</SpecimenLabel>
            <h2 className="garden-plot__name">{activeProperty.name}</h2>
            <p className="garden-plot__meta">
              {[activeProperty.region, activeProperty.growing_zone ? `Growing zone ${activeProperty.growing_zone}` : null, activeProperty.season]
                .filter(Boolean)
                .join(" · ") || "Your land"}
            </p>
          </div>
          {isReadOnly ? null : (
            <div className="garden-plot__tools">
              {setupIncomplete ? (
                <button className="folio-button" type="button" onClick={openSetupWizard}>
                  Give one plant a home
                </button>
              ) : null}
              <button className="folio-button" type="button" onClick={() => goProperty("actions")}>Add place</button>
            </div>
          )}
        </header>

        {sortedZones.length === 0 ? (
          <div className="garden-plot__empty">
            <p>Start with one place, like a kitchen garden, orchard row, or shade border.</p>
            {isReadOnly ? null : (
              <button className="button" type="button" onClick={() => goProperty("actions")}>Add first place</button>
            )}
          </div>
        ) : (
          <div className="garden-plot__grid">
            {sortedZones.map((zone) => {
              const zoneFocused = activeZone?.id === zone.id;
              return (
                <article className={`garden-zone ${zoneFocused ? "is-active" : ""}`} key={zone.id}>
                  {renderZoneInner(zone)}
                </article>
              );
            })}

            {isReadOnly ? null : (
              <button className="garden-zone garden-zone--new" type="button" onClick={() => goProperty("actions")}>
                <span className="garden-zone__plus">+</span>
                <span>New place</span>
              </button>
            )}
          </div>
        )}
      </section>

      {gardenDrawer}
    </div>
  );
}
