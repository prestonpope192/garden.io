"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { InkStamp, MarginNote, SpecimenLabel } from "@/components/journal-primitives";
import { getTodayISO, sortByCreatedAt } from "@/lib/garden-app-helpers";
import { generateSuggestions, deriveSeason, dueDateISO, type GardenSuggestion } from "@/lib/garden-suggestions";
import { deriveLifecycleStage, harvestReadiness } from "@/lib/garden-phenology";
import type {
  GardenBed,
  GardenObservation,
  GardenPlantInstance,
  GardenPlantProfile,
  GardenProperty,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";
import {
  buildFieldOptions,
  formatQuantity,
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
  selectedZoneId: string;
  selectedBedId: string;
  selectedPlantId: string;
  setSelectedZoneId: (value: string) => void;
  setSelectedBedId: (value: string) => void;
  setSelectedPlantId: (value: string) => void;
  isSaving: boolean;
  isLoading: boolean;
  createProperty: (input: PropertyInput) => Promise<void>;
  updateProperty: (id: string, patch: Partial<Pick<GardenProperty, "name" | "label" | "region" | "growing_zone" | "season" | "notes">>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  createZone: (input: ZoneInput) => Promise<void>;
  updateZone: (id: string, patch: Partial<Pick<GardenZone, "name" | "purpose" | "light" | "water" | "notes">>) => Promise<void>;
  deleteZone: (id: string) => Promise<void>;
  persistZoneLayout: (id: string, layout: { layout_x: number; layout_y: number; layout_w: number; layout_h: number }) => Promise<void>;
  persistBedLayout: (id: string, layout: { layout_x: number; layout_y: number; layout_w: number; layout_h: number }) => Promise<void>;
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
};

type FocusLevel = "property" | "zone" | "bed" | "plant";
type DrawerMode = "info" | "tasks" | "ideas" | "actions";

// Normalized (0–1) plot geometry for the draggable Arrange mode.
type ZoneBox = { x: number; y: number; w: number; h: number };
type DragState = { id: string; kind: "zone" | "bed"; mode: "move" | "resize"; startX: number; startY: number; orig: ZoneBox; box?: ZoneBox; moved: boolean };
const DEFAULT_ZONE_W = 0.46;
const DEFAULT_ZONE_H = 0.42;
const clampTo = (value: number, max: number) => Math.max(0, Math.min(value, max));

const EMPTY_PROPERTY: PropertyInput = { name: "", label: "Garden", region: "", growingZone: "", season: "" };
const EMPTY_ZONE: ZoneInput = { name: "", purpose: "", light: "", water: "" };
const EMPTY_BED: BedInput = { name: "", sun: "", water: "", soil: "" };

function growing(plants: GardenPlantInstance[]) {
  return plants.filter((plant) => plant.status === "growing");
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function FieldText(props: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string }) {
  return (
    <label className="beta-field">
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
    <label className="beta-field">
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
  const focus: FocusLevel = activePlant ? "plant" : activeBed ? "bed" : activeZone ? "zone" : "property";
  const focusKey = `${focus}:${activeProperty?.id ?? ""}:${activeZone?.id ?? ""}:${activeBed?.id ?? ""}:${activePlant?.id ?? ""}`;

  const [drawerMode, setDrawerMode] = useState<DrawerMode>("info");
  const [dismissedIdeas, setDismissedIdeas] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ message: string; run: () => void } | null>(null);
  const [arranging, setArranging] = useState(false);
  const [arrangeBedsZoneId, setArrangeBedsZoneId] = useState<string | null>(null);
  const [liveLayout, setLiveLayout] = useState<Record<string, ZoneBox>>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const [propertyDraft, setPropertyDraft] = useState<PropertyInput>(EMPTY_PROPERTY);
  const [zoneDraft, setZoneDraft] = useState<ZoneInput>(EMPTY_ZONE);
  const [bedDraft, setBedDraft] = useState<BedInput>(EMPTY_BED);
  const [plantDraft, setPlantDraft] = useState<PlantInput>({ slug: "", quantity: "1", plantedOn: getTodayISO(), notes: "" });
  const [noteDraft, setNoteDraft] = useState("");
  const [taskDraft, setTaskDraft] = useState<TaskInput>({ title: "", dueOn: getTodayISO(), notes: "" });
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});

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

  const zoneBox = (zone: GardenZone, index: number): ZoneBox => {
    const live = liveLayout[zone.id];
    if (live) return live;
    if (zone.layout_x != null && zone.layout_y != null) {
      return { x: zone.layout_x, y: zone.layout_y, w: zone.layout_w ?? DEFAULT_ZONE_W, h: zone.layout_h ?? DEFAULT_ZONE_H };
    }
    const col = index % 2;
    const row = Math.floor(index / 2);
    return { x: 0.03 + col * 0.5, y: 0.03 + row * 0.46, w: DEFAULT_ZONE_W, h: DEFAULT_ZONE_H };
  };

  const bedBox = (bed: GardenBed, index: number): ZoneBox => {
    const live = liveLayout[bed.id];
    if (live) return live;
    if (bed.layout_x != null && bed.layout_y != null) {
      return { x: bed.layout_x, y: bed.layout_y, w: bed.layout_w ?? 0.42, h: bed.layout_h ?? 0.26 };
    }
    const col = index % 2;
    const row = Math.floor(index / 2);
    return { x: 0.04 + col * 0.48, y: 0.04 + row * 0.3, w: 0.42, h: 0.26 };
  };

  const beginDrag = (event: ReactPointerEvent<HTMLElement>, kind: "zone" | "bed", item: GardenZone | GardenBed, index: number) => {
    if (!arranging) return;
    const isResize = (event.target as HTMLElement).dataset.resize === "1";
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* pointer capture is an enhancement, not required */
    }
    dragRef.current = {
      id: item.id,
      kind,
      mode: isResize ? "resize" : "move",
      startX: event.clientX,
      startY: event.clientY,
      orig: kind === "zone" ? zoneBox(item as GardenZone, index) : bedBox(item as GardenBed, index),
      moved: false
    };
  };

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dx = (event.clientX - drag.startX) / rect.width;
    const dy = (event.clientY - drag.startY) / rect.height;
    if (Math.abs(event.clientX - drag.startX) > 3 || Math.abs(event.clientY - drag.startY) > 3) drag.moved = true;
    const o = drag.orig;
    const box: ZoneBox =
      drag.mode === "move"
        ? { ...o, x: clampTo(o.x + dx, 1 - o.w), y: clampTo(o.y + dy, 1 - o.h) }
        : { ...o, w: Math.max(0.18, Math.min(o.w + dx, 1 - o.x)), h: Math.max(0.14, Math.min(o.h + dy, 1 - o.y)) };
    drag.box = box;
    setLiveLayout((prev) => ({ ...prev, [drag.id]: box }));
  };

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* pointer already released */
    }
    const clearLive = () =>
      setLiveLayout((prev) => {
        const next = { ...prev };
        delete next[drag.id];
        return next;
      });
    if (!drag.moved || !drag.box) {
      clearLive();
      // A click (no drag) on a zone in arrange mode opens its bed layout.
      if (drag.kind === "zone") setArrangeBedsZoneId(drag.id);
      return;
    }
    const round = (v: number) => Math.round(v * 100) / 100;
    const layout = {
      layout_x: round(drag.box.x),
      layout_y: round(drag.box.y),
      layout_w: round(drag.box.w),
      layout_h: round(drag.box.h)
    };
    const persist = drag.kind === "zone" ? props.persistZoneLayout : props.persistBedLayout;
    void persist(drag.id, layout).finally(clearLive);
  };

  const renderZoneInner = (zone: GardenZone) => {
    const zoneBeds = sortByCreatedAt(props.beds.filter((bed) => bed.zone_id === zone.id));
    return (
      <>
        <button className="beta-zone__head" type="button" onClick={() => goZone(zone, "info")}>
          <span className="beta-zone__name">{zone.name}</span>
          <span className="beta-zone__tag">{zoneBeds.length} {zoneBeds.length === 1 ? "bed" : "beds"}</span>
        </button>
        {zone.light || zone.purpose ? (
          <p className="beta-zone__sub">{[zone.purpose, zone.light].filter(Boolean).join(" · ")}</p>
        ) : null}
        <div className="beta-zone__beds">
          {zoneBeds.length === 0 ? (
            <button className="beta-bed beta-bed--empty" type="button" onClick={() => goZone(zone, "actions")}>
              Add your first bed
            </button>
          ) : (
            zoneBeds.map((bed) => {
              const bedPlants = growing(props.plants.filter((plant) => plant.bed_id === bed.id));
              const bedFocused = activeBed?.id === bed.id;
              return (
                <div className={`beta-bed ${bedFocused ? "is-active" : ""}`} key={bed.id}>
                  <button className="beta-bed__head" type="button" onClick={() => goBed(bed, "info")}>
                    <span className="beta-bed__name">{bed.name}</span>
                    <span className="beta-bed__count">{bedPlants.length}</span>
                  </button>
                  <div className="beta-bed__plants">
                    {bedPlants.slice(0, 4).map((plant) => (
                      <button
                        className={`beta-chip ${activePlant?.id === plant.id ? "is-active" : ""}`}
                        key={plant.id}
                        type="button"
                        onClick={() => goPlant(plant, "info")}
                      >
                        {getCatalogPlantName(plant)}
                        {plant.quantity > 1 ? ` ·${formatQuantity(plant.quantity)}` : ""}
                      </button>
                    ))}
                    {bedPlants.length > 4 ? <span className="beta-chip beta-chip--more">+{bedPlants.length - 4}</span> : null}
                    <button className="beta-chip beta-chip--add" type="button" onClick={() => goBed(bed, "actions")}>+ plant</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button className="beta-zone__add" type="button" onClick={() => goZone(zone, "actions")}>+ add bed</button>
      </>
    );
  };

  // ---- No property yet: a single, calm first-run prompt ----------------------
  if (!activeProperty) {
    return (
      <div className="beta-plot beta-plot--solo">
        {props.isLoading ? (
          <p className="beta-plot__loading">Opening your garden…</p>
        ) : (
          <div className="beta-plot__firstrun">
            <SpecimenLabel tone="olive">First plate</SpecimenLabel>
            <h2>Name your garden</h2>
            <p>Give your land a name and a few details. Everything else — zones, beds, and plants — grows from here.</p>
            <form
              className="beta-form"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                void props.createProperty(propertyDraft).then(() => setPropertyDraft(EMPTY_PROPERTY));
              }}
            >
              <FieldText label="Garden name" required value={propertyDraft.name} placeholder="Thornfield Garden" onChange={(value) => setPropertyDraft({ ...propertyDraft, name: value })} />
              <FieldText label="What do you call it?" value={propertyDraft.label} placeholder="Garden, Homestead, Orchard…" onChange={(value) => setPropertyDraft({ ...propertyDraft, label: value })} />
              <div className="beta-field-grid">
                <FieldText label="Region" value={propertyDraft.region} placeholder="Western North Carolina" onChange={(value) => setPropertyDraft({ ...propertyDraft, region: value })} />
                <FieldText label="Growing zone" value={propertyDraft.growingZone} placeholder="7a" onChange={(value) => setPropertyDraft({ ...propertyDraft, growingZone: value })} />
              </div>
              <FieldText label="Current season" value={propertyDraft.season} placeholder="Late spring" onChange={(value) => setPropertyDraft({ ...propertyDraft, season: value })} />
              <button className="button" type="submit" disabled={busy}>
                {busy ? "Creating…" : "Create my garden"}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  const sortedZones = sortByCreatedAt(props.zones);
  const hasGeometry = sortedZones.some((zone) => zone.layout_x != null);
  const bedArrangeZone = arrangeBedsZoneId ? sortedZones.find((zone) => zone.id === arrangeBedsZoneId) ?? null : null;

  // ---- Drawer body builders --------------------------------------------------

  const scopeLabel =
    focus === "plant"
      ? `Plant · ${getCatalogPlantName(activePlant)}`
      : focus === "bed"
        ? `Bed · ${activeBed?.name}`
        : focus === "zone"
          ? `Zone · ${activeZone?.name}`
          : `${activeProperty.label?.trim() || "Garden"} · ${activeProperty.name}`;

  const startEdit = () => {
    if (focus === "property") {
      setEditDraft({
        name: activeProperty.name,
        label: activeProperty.label ?? "",
        region: activeProperty.region ?? "",
        growing_zone: activeProperty.growing_zone ?? "",
        season: activeProperty.season ?? "",
        notes: activeProperty.notes ?? ""
      });
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
        notes: editDraft.notes?.trim() || null
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
        message: `Delete “${activeProperty.name}” and everything in it — ${plural(z, "zone")}, ${plural(b, "bed")}, ${plural(p, "plant")}? This cannot be undone.`,
        run: () => void props.deleteProperty(activeProperty.id)
      });
    } else if (focus === "zone" && activeZone) {
      const b = props.beds.filter((bed) => bed.zone_id === activeZone.id).length;
      const p = growing(props.plants.filter((plant) => plant.zone_id === activeZone.id)).length;
      setConfirmDelete({
        message: `Delete zone “${activeZone.name}”? Its ${plural(b, "bed")} and ${plural(p, "plant")} are removed with it. Notes and tasks are kept.`,
        run: () => void props.deleteZone(activeZone.id)
      });
    } else if (focus === "bed" && activeBed) {
      const p = growing(props.plants.filter((plant) => plant.bed_id === activeBed.id)).length;
      setConfirmDelete({
        message: `Delete bed “${activeBed.name}”? Its ${plural(p, "plant")} ${p === 1 ? "is" : "are"} removed with it. Notes and tasks are kept.`,
        run: () => void props.deleteBed(activeBed.id)
      });
    } else if (focus === "plant" && activePlant) {
      setConfirmDelete({
        message: `Remove ${getCatalogPlantName(activePlant)} from ${activeBed?.name ?? "this bed"}? This deletes the plant record.`,
        run: () => void props.deletePlant(activePlant.id)
      });
    }
  };

  const renderInfo = () => {
    if (isEditing) {
      return (
        <div className="beta-drawer__section">
          <div className="beta-field-grid">
            {focus === "property" ? (
              <>
                <FieldText label="Name" value={editDraft.name ?? ""} onChange={(value) => setEditDraft({ ...editDraft, name: value })} />
                <FieldText label="Type label" value={editDraft.label ?? ""} onChange={(value) => setEditDraft({ ...editDraft, label: value })} />
                <FieldText label="Region" value={editDraft.region ?? ""} onChange={(value) => setEditDraft({ ...editDraft, region: value })} />
                <FieldText label="Growing zone" value={editDraft.growing_zone ?? ""} onChange={(value) => setEditDraft({ ...editDraft, growing_zone: value })} />
                <FieldText label="Season" value={editDraft.season ?? ""} onChange={(value) => setEditDraft({ ...editDraft, season: value })} />
              </>
            ) : null}
            {focus === "zone" ? (
              <>
                <FieldText label="Name" value={editDraft.name ?? ""} onChange={(value) => setEditDraft({ ...editDraft, name: value })} />
                <FieldText label="Purpose" value={editDraft.purpose ?? ""} onChange={(value) => setEditDraft({ ...editDraft, purpose: value })} />
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
          <label className="beta-field">
            <span>Notes</span>
            <textarea className="input beta-textarea" value={editDraft.notes ?? ""} onChange={(event) => setEditDraft({ ...editDraft, notes: event.target.value })} />
          </label>
          <div className="beta-drawer__actions-row">
            <button className="folio-button" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="button" type="button" onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
          </div>
        </div>
      );
    }

    const rows: Array<[string, string]> = [];
    if (focus === "property") {
      if (activeProperty.region) rows.push(["Region", activeProperty.region]);
      if (activeProperty.growing_zone) rows.push(["Growing zone", activeProperty.growing_zone]);
      if (activeProperty.season) rows.push(["Season", activeProperty.season]);
      rows.push(["Zones", String(props.zones.length)]);
      rows.push(["Beds", String(props.beds.length)]);
      rows.push(["Plants", String(growing(props.plants).length)]);
    } else if (focus === "zone" && activeZone) {
      if (activeZone.purpose) rows.push(["Purpose", activeZone.purpose]);
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
      if (activePlant.planted_on) rows.push(["Planted", activePlant.planted_on]);
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
      if (activePlant.plant_profile?.botanical_name_full) rows.push(["Botanical", activePlant.plant_profile.botanical_name_full]);
      rows.push(["Status", activePlant.status]);
    }

    const noteText =
      focus === "property"
        ? activeProperty.notes
        : focus === "zone"
          ? activeZone?.notes
          : focus === "bed"
            ? activeBed?.notes
            : activePlant?.notes;

    const scopedNotes = props.observations.filter((observation) => {
      if (focus === "property") return !observation.zone_id && !observation.bed_id && !observation.plant_instance_id;
      if (focus === "zone") return observation.zone_id === activeZone?.id && !observation.bed_id && !observation.plant_instance_id;
      if (focus === "bed") return observation.bed_id === activeBed?.id && !observation.plant_instance_id;
      return observation.plant_instance_id === activePlant?.id;
    });

    return (
      <div className="beta-drawer__section">
        <dl className="beta-detail-list">
          {rows.map(([label, value]) => (
            <div className="beta-detail-list__row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {noteText ? (
          <MarginNote icon="journal" title="Field note">
            <p>{noteText}</p>
          </MarginNote>
        ) : null}

        {scopedNotes.length > 0 ? (
          <div className="beta-note-feed">
            <SpecimenLabel>Observations</SpecimenLabel>
            {scopedNotes.slice(0, 6).map((observation) => (
              <div className="beta-note-feed__item" key={observation.id}>
                <p>{observation.note}</p>
                <button className="beta-link-button" type="button" onClick={() => props.deleteObservation(observation.id)} disabled={busy}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="beta-drawer__actions-row">
          <button className="folio-button" type="button" onClick={startEdit}>Edit</button>
          {focus === "plant" && activePlant ? (
            <button className="folio-button" type="button" onClick={() => props.updatePlantStatus(activePlant, "archived")} disabled={busy}>
              Archive
            </button>
          ) : null}
        </div>

        {confirmDelete ? (
          <div className="beta-confirm">
            <p>{confirmDelete.message}</p>
            <div className="beta-confirm__actions">
              <button className="folio-button" type="button" onClick={() => setConfirmDelete(null)}>Keep it</button>
              <button className="button button--danger" type="button" onClick={() => { confirmDelete.run(); setConfirmDelete(null); }} disabled={busy}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button className="beta-drawer__danger" type="button" onClick={requestDelete} disabled={busy}>
            Delete this {focus}
          </button>
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
      <div className="beta-drawer__section">
        {open.length === 0 ? <p className="beta-drawer__muted">No open tasks here.</p> : null}
        {open.map((task) => (
          <div className="beta-task-row" key={task.id}>
            <button className="beta-task-row__check" type="button" aria-label="Complete task" onClick={() => props.updateTaskStatus(task)} disabled={busy} />
            <div className="beta-task-row__body">
              <strong>{task.title}</strong>
              <span>{task.due_on ?? "No date"}</span>
            </div>
            <button className="beta-link-button" type="button" onClick={() => props.deleteTask(task.id)} disabled={busy}>Remove</button>
          </div>
        ))}

        {done.length > 0 ? (
          <details className="beta-done">
            <summary>Completed ({done.length})</summary>
            {done.map((task) => (
              <div className="beta-task-row is-done" key={task.id}>
                <button className="beta-task-row__check is-checked" type="button" aria-label="Reopen task" onClick={() => props.updateTaskStatus(task)} disabled={busy} />
                <div className="beta-task-row__body">
                  <strong>{task.title}</strong>
                  <span>{task.completed_at?.slice(0, 10) ?? task.due_on ?? ""}</span>
                </div>
              </div>
            ))}
          </details>
        ) : null}

        <form
          className="beta-form beta-form--compact"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void props.addTask(taskDraft).then(() => setTaskDraft({ title: "", dueOn: getTodayISO(), notes: "" }));
          }}
        >
          <FieldText label="New task" required value={taskDraft.title} placeholder="Water tomatoes" onChange={(value) => setTaskDraft({ ...taskDraft, title: value })} />
          <FieldText label="Due" type="date" value={taskDraft.dueOn} onChange={(value) => setTaskDraft({ ...taskDraft, dueOn: value })} />
          <button className="folio-button" type="submit" disabled={busy}>Add task here</button>
        </form>
      </div>
    );
  };

  const renderActions = () => {
    return (
      <div className="beta-drawer__section">
        {focus === "property" ? (
          <form
            className="beta-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              void props.createZone(zoneDraft).then(() => setZoneDraft(EMPTY_ZONE));
            }}
          >
            <SpecimenLabel tone="clay">Add a zone</SpecimenLabel>
            <FieldText label="Zone name" required value={zoneDraft.name} placeholder="Kitchen Garden" onChange={(value) => setZoneDraft({ ...zoneDraft, name: value })} />
            <FieldText label="Purpose" value={zoneDraft.purpose} placeholder="High-turnover edible production" onChange={(value) => setZoneDraft({ ...zoneDraft, purpose: value })} />
            <div className="beta-field-grid">
              <FieldSelect label="Light" value={zoneDraft.light} options={buildFieldOptions(LIGHT_OPTIONS, zoneDraft.light)} onChange={(value) => setZoneDraft({ ...zoneDraft, light: value })} />
              <FieldSelect label="Water" value={zoneDraft.water} options={buildFieldOptions(WATER_OPTIONS, zoneDraft.water)} onChange={(value) => setZoneDraft({ ...zoneDraft, water: value })} />
            </div>
            <button className="button" type="submit" disabled={busy}>Add zone</button>
          </form>
        ) : null}

        {focus === "property" ? (
          <section className="beta-share-card">
            <div className="beta-share-card__head">
              <SpecimenLabel tone="olive">Shared gardens</SpecimenLabel>
              <span className="beta-share-card__soon">Coming soon</span>
            </div>
            <p>Invite household or plot-mates to tend {activeProperty.name} with you — shared beds, notes, and tasks. We&rsquo;ll open this up during the private beta.</p>
            <button className="folio-button" type="button" disabled aria-disabled="true">Invite a collaborator</button>
          </section>
        ) : null}

        {focus === "zone" && activeZone ? (
          <form
            className="beta-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              void props.createBed(bedDraft).then(() => setBedDraft(EMPTY_BED));
            }}
          >
            <SpecimenLabel tone="clay">Add a bed to {activeZone.name}</SpecimenLabel>
            <FieldText label="Bed name" required value={bedDraft.name} placeholder="Raised Bed 2" onChange={(value) => setBedDraft({ ...bedDraft, name: value })} />
            <div className="beta-field-grid">
              <FieldSelect label="Sun" value={bedDraft.sun} options={buildFieldOptions(LIGHT_OPTIONS, bedDraft.sun)} onChange={(value) => setBedDraft({ ...bedDraft, sun: value })} />
              <FieldSelect label="Water" value={bedDraft.water} options={buildFieldOptions(WATER_OPTIONS, bedDraft.water)} onChange={(value) => setBedDraft({ ...bedDraft, water: value })} />
              <FieldSelect label="Soil" value={bedDraft.soil} options={buildFieldOptions(SOIL_OPTIONS, bedDraft.soil)} onChange={(value) => setBedDraft({ ...bedDraft, soil: value })} />
            </div>
            <button className="button" type="submit" disabled={busy}>Add bed</button>
          </form>
        ) : null}

        {focus === "bed" && activeBed ? (
          <form
            className="beta-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              void props.addPlant(plantDraft).then(() => setPlantDraft({ slug: props.plantProfiles[0]?.slug ?? plantDraft.slug, quantity: "1", plantedOn: getTodayISO(), notes: "" }));
            }}
          >
            <SpecimenLabel tone="clay">Add a plant to {activeBed.name}</SpecimenLabel>
            <label className="beta-field">
              <span>Plant</span>
              <select className="input" value={plantDraft.slug} onChange={(event) => setPlantDraft({ ...plantDraft, slug: event.target.value })}>
                {props.plantProfiles.map((profile) => (
                  <option key={profile.slug} value={profile.slug}>{profile.display_name}</option>
                ))}
              </select>
            </label>
            <div className="beta-field-grid">
              <FieldText label="Quantity" type="number" value={plantDraft.quantity} onChange={(value) => setPlantDraft({ ...plantDraft, quantity: value })} />
              <FieldText label="Planted on" type="date" value={plantDraft.plantedOn} onChange={(value) => setPlantDraft({ ...plantDraft, plantedOn: value })} />
            </div>
            <button className="button" type="submit" disabled={busy || props.plantProfiles.length === 0}>Add plant</button>
          </form>
        ) : null}

        {focus === "plant" && activePlant ? (
          <div className="beta-form">
            <p className="beta-drawer__muted">Plant actions live here. Use the buttons below to file this specimen.</p>
            <button className="folio-button" type="button" onClick={() => props.updatePlantStatus(activePlant, "archived")} disabled={busy}>Archive plant</button>
          </div>
        ) : null}

        <form
          className="beta-form beta-form--compact"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!noteDraft.trim()) return;
            void props.addObservation(noteDraft).then(() => setNoteDraft(""));
          }}
        >
          <label className="beta-field">
            <span>Add a note here</span>
            <textarea className="input beta-textarea" placeholder="What did you notice?" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} />
          </label>
          <button className="folio-button" type="submit" disabled={busy}>Save note</button>
        </form>
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
      existingTaskTitles
    }).filter((idea) => !dismissedIdeas.has(idea.id));

    const acceptIdea = (idea: GardenSuggestion) => {
      void props.addTask({ title: idea.taskTitle, dueOn: dueDateISO(idea.dueInDays), notes: idea.rationale });
      setDismissedIdeas((prev) => new Set(prev).add(idea.id));
    };
    const dismissIdea = (id: string) => setDismissedIdeas((prev) => new Set(prev).add(id));

    if (ideas.length === 0) {
      return (
        <div className="beta-drawer__section">
          <p className="beta-drawer__muted">No new ideas right now — this {focus} looks well-tended. Check back as the season turns.</p>
        </div>
      );
    }

    return (
      <div className="beta-drawer__section beta-ideas">
        {ideas.map((idea) => (
          <article className={`beta-idea beta-idea--${idea.type}`} key={idea.id}>
            <div className="beta-idea__head">
              <span className="beta-idea__type">{idea.type}</span>
              <span className="beta-idea__confidence">{idea.confidence} confidence</span>
            </div>
            <strong className="beta-idea__title">{idea.title}</strong>
            <p className="beta-idea__why"><span>Why:</span> {idea.rationale}</p>
            <p className="beta-idea__window">Suggested window · {idea.windowLabel}</p>
            <div className="beta-idea__actions">
              <button className="button" type="button" onClick={() => acceptIdea(idea)} disabled={busy}>Add as task</button>
              <button className="folio-button" type="button" onClick={() => dismissIdea(idea.id)}>Not now</button>
            </div>
          </article>
        ))}
      </div>
    );
  };

  // ---- Render ----------------------------------------------------------------

  return (
    <div className="beta-property">
      <section className="beta-plot">
        <header className="beta-plot__header">
          <div>
            <SpecimenLabel tone="olive">The plot</SpecimenLabel>
            <h2 className="beta-plot__name">{activeProperty.name}</h2>
            <p className="beta-plot__meta">
              {[activeProperty.label, activeProperty.region, activeProperty.growing_zone ? `Zone ${activeProperty.growing_zone}` : null, activeProperty.season]
                .filter(Boolean)
                .join(" · ") || "Your land"}
            </p>
          </div>
          <div className="beta-plot__tools">
            {sortedZones.length > 0 ? (
              <button
                className="folio-button"
                type="button"
                aria-pressed={arranging}
                onClick={() => {
                  setArranging((value) => !value);
                  setArrangeBedsZoneId(null);
                }}
              >
                {arranging ? "Done" : "Arrange"}
              </button>
            ) : null}
            <button className="folio-button" type="button" onClick={() => goProperty("actions")}>+ Zone</button>
            <span aria-hidden="true" className="beta-plot__compass">N</span>
          </div>
        </header>

        {sortedZones.length === 0 ? (
          <div className="beta-plot__empty">
            <p>Your plot is empty. Lay out the first zone — a bed area, an orchard row, a shade border.</p>
            <button className="button" type="button" onClick={() => goProperty("actions")}>Start your first zone</button>
          </div>
        ) : bedArrangeZone ? (
          <>
            <div className="beta-plot__subnav">
              <button className="folio-button" type="button" onClick={() => setArrangeBedsZoneId(null)}>← Back to zones</button>
              <span className="beta-plot__subnav-title">Arranging beds in {bedArrangeZone.name}</span>
            </div>
            <p className="beta-plot__hint">Drag a bed to move it; drag its corner to resize. Changes save as you go.</p>
            <div className="beta-plot__canvas is-arranging" ref={canvasRef}>
              {(() => {
                const beds = sortByCreatedAt(props.beds.filter((bed) => bed.zone_id === bedArrangeZone.id));
                if (beds.length === 0) {
                  return <p className="beta-plot__empty-note">No beds here yet. Add one from this zone&rsquo;s Actions.</p>;
                }
                return beds.map((bed, index) => {
                  const box = bedBox(bed, index);
                  const bedPlants = growing(props.plants.filter((plant) => plant.bed_id === bed.id));
                  return (
                    <article
                      key={bed.id}
                      className="beta-bed beta-bed--placed is-arranging"
                      style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%` }}
                      onPointerDown={(event) => beginDrag(event, "bed", bed, index)}
                      onPointerMove={moveDrag}
                      onPointerUp={endDrag}
                    >
                      <span className="beta-bed__name">{bed.name}</span>
                      <span className="beta-bed__count">{bedPlants.length}</span>
                      <span className="beta-zone__resize" data-resize="1" aria-hidden="true" />
                    </article>
                  );
                });
              })()}
            </div>
          </>
        ) : arranging || hasGeometry ? (
          <>
            {arranging ? (
              <p className="beta-plot__hint">Drag a zone to move it or resize its corner; click a zone to arrange its beds.</p>
            ) : null}
            <div className={`beta-plot__canvas ${arranging ? "is-arranging" : ""}`} ref={canvasRef}>
              {sortedZones.map((zone, index) => {
                const box = zoneBox(zone, index);
                const zoneFocused = activeZone?.id === zone.id;
                return (
                  <article
                    key={zone.id}
                    className={`beta-zone beta-zone--placed ${zoneFocused ? "is-active" : ""} ${arranging ? "is-arranging" : ""}`}
                    style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%` }}
                    onPointerDown={arranging ? (event) => beginDrag(event, "zone", zone, index) : undefined}
                    onPointerMove={arranging ? moveDrag : undefined}
                    onPointerUp={arranging ? endDrag : undefined}
                  >
                    {renderZoneInner(zone)}
                    {arranging ? <span className="beta-zone__resize" data-resize="1" aria-hidden="true" /> : null}
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="beta-plot__grid">
            {sortedZones.map((zone) => {
              const zoneFocused = activeZone?.id === zone.id;
              return (
                <article className={`beta-zone ${zoneFocused ? "is-active" : ""}`} key={zone.id}>
                  {renderZoneInner(zone)}
                </article>
              );
            })}

            <button className="beta-zone beta-zone--new" type="button" onClick={() => goProperty("actions")}>
              <span className="beta-zone__plus">+</span>
              <span>New zone</span>
            </button>
          </div>
        )}
      </section>

      <aside className="beta-drawer" aria-label="Contextual utility">
        <div className="beta-drawer__scope">
          <InkStamp tone="olive">{focus}</InkStamp>
          <span>{scopeLabel}</span>
        </div>
        <div className="beta-drawer__tabs" role="tablist">
          {(["info", "tasks", "ideas", "actions"] as DrawerMode[]).map((mode) => (
            <button
              key={mode}
              role="tab"
              aria-selected={drawerMode === mode}
              className={`beta-drawer__tab ${drawerMode === mode ? "is-active" : ""}`}
              type="button"
              onClick={() => setDrawerMode(mode)}
            >
              {mode === "info" ? "Info" : mode === "tasks" ? "Tasks" : mode === "ideas" ? "Ideas" : "Actions"}
            </button>
          ))}
        </div>
        <div className="beta-drawer__body">
          {drawerMode === "info" ? renderInfo() : null}
          {drawerMode === "tasks" ? renderTasks() : null}
          {drawerMode === "ideas" ? renderIdeas() : null}
          {drawerMode === "actions" ? renderActions() : null}
        </div>
      </aside>
    </div>
  );
}
