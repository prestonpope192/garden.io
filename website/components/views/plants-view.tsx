"use client";

import Image from "next/image";
import { useEffect, useState, useMemo, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FieldSelect, SpecimenLabel, InkStamp } from "@/components/journal-primitives";
import {
  formatGardenDate,
  getBedName,
  getZoneName,
  getTodayISO,
} from "@/lib/garden-app-helpers";
import type {
  GardenBed,
  GardenObservation,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenTask,
  GardenWishlistItem,
  GardenZone,
} from "@/lib/garden-app-types";
import { getJournalStylePlantImageUrl } from "@/lib/plant-images";
import { deriveLifecycleStage, harvestReadiness } from "@/lib/garden-phenology";
import { generateSuggestions, deriveSeason } from "@/lib/garden-suggestions";
import { PlantTimeline, type AddPlantOutcomeInput } from "@/components/plant-timeline";
import {
  getCatalogPlantName,
  formatQuantity,
  formatPlantTypeLabel,
} from "./shared";

// ─── Props contract ────────────────────────────────────────────────────────────

export type PlantsViewProps = {
  beds: GardenBed[];
  zones: GardenZone[];
  plants: GardenPlantInstance[];
  wishlist: GardenWishlistItem[];
  tasks: GardenTask[];
  updatePlantStatus: (
    plant: GardenPlantInstance,
    status: GardenPlantInstance["status"]
  ) => Promise<void>;
  addPlantToBed: (slug: string, bedId: string) => Promise<void>;
  removeWishlist: (plantProfileId: string) => Promise<void>;
  logPlantObservation: (
    plant: GardenPlantInstance,
    note: string
  ) => Promise<void>;
  observations: GardenObservation[];
  outcomes: GardenPlantOutcome[];
  mediaUrls: Record<string, string>;
  addTask: (input: { title: string; dueOn: string; notes: string }) => Promise<void>;
  addPlantOutcome: (plant: GardenPlantInstance, input: AddPlantOutcomeInput) => Promise<void>;
  deletePlantOutcome: (id: string) => Promise<void>;
  isReadOnly?: boolean;
};

// ─── Local types ───────────────────────────────────────────────────────────────

type StatusTab = "growing" | "archived" | "wishlist";
type GridView = "grid" | "list";
type DrawerTab = "info" | "timeline" | "filters" | "actions";
type PlantsDrawerVisibleTab = Exclude<DrawerTab, "filters">;

export const PLANTS_DRAWER_TAB_LABELS: Record<PlantsDrawerVisibleTab, string> = {
  info: "Details",
  timeline: "History",
  actions: "Update",
};

// ─── Date helpers ──────────────────────────────────────────────────────────────

/** Parse a YYYY-MM-DD string as local midnight */
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Days between two YYYY-MM-DD strings (positive = b is after a) */
function daysBetween(a: string, b: string): number {
  const ms = parseLocalDate(b).getTime() - parseLocalDate(a).getTime();
  return Math.round(ms / 86_400_000);
}

/** Format a planted date relative to today */
function formatDaysInGround(plantedOn: string, today: string): string {
  const days = daysBetween(plantedOn, today);
  if (days < 0) return `plants in ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "planted today";
  if (days === 1) return "1 day in ground";
  if (days < 7) return `${days} days in ground`;
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  if (rem === 0) return `${weeks} week${weeks === 1 ? "" : "s"} in ground`;
  return `${weeks} week${weeks === 1 ? "" : "s"}, ${rem} day${rem === 1 ? "" : "s"} in ground`;
}

/** Classify urgency of a task relative to today */
type Urgency = "overdue" | "soon" | "normal";

function getUrgency(dueOn: string | null, today: string): Urgency {
  if (!dueOn) return "normal";
  if (dueOn < today) return "overdue";
  const days = daysBetween(today, dueOn);
  return days <= 7 ? "soon" : "normal";
}

/** Get the soonest open task for a plant instance */
function getSoonestTask(
  plantId: string,
  tasks: GardenTask[]
): GardenTask | null {
  const open = tasks
    .filter((t) => t.status === "open" && t.plant_instance_id === plantId)
    .sort((a, b) => (a.due_on ?? "9999").localeCompare(b.due_on ?? "9999"));
  return open[0] ?? null;
}

function comparePlantsByNextCare(
  a: GardenPlantInstance,
  b: GardenPlantInstance,
  tasks: GardenTask[]
) {
  const aTask = getSoonestTask(a.id, tasks);
  const bTask = getSoonestTask(b.id, tasks);
  const aDue = aTask?.due_on ?? "9999-12-31";
  const bDue = bTask?.due_on ?? "9999-12-31";
  const dueCompare = aDue.localeCompare(bDue);
  if (dueCompare !== 0) return dueCompare;
  return getCatalogPlantName(a).localeCompare(getCatalogPlantName(b));
}

function formatPlantCount(quantity: number) {
  return `${formatQuantity(quantity)} ${Number(quantity) === 1 ? "plant" : "plants"}`;
}

/** Categorise lifecycle_type into Annual / Perennial / mixed or unknown */
function categoriseLifecycle(lc: string | undefined): "annual" | "perennial" | "other" {
  if (!lc) return "other";
  const lower = lc.toLowerCase();
  if (lower.includes("peren")) return "perennial";
  if (lower.includes("ann")) return "annual";
  return "other";
}

function getPlantScanLabel(plant: GardenPlantInstance | GardenWishlistItem) {
  const profile = plant.plant_profile;
  const type = profile?.plant_type_code ? formatPlantTypeLabel(profile.plant_type_code) : null;
  const lifecycle = categoriseLifecycle(profile?.lifecycle_type);
  const lifecycleLabel = lifecycle === "annual" ? "Annual" : lifecycle === "perennial" ? "Perennial" : null;
  return [type, lifecycleLabel].filter(Boolean).join(" · ");
}

// ─── Thumbnail ─────────────────────────────────────────────────────────────────

function getThumbSrc(
  plant: GardenPlantInstance | GardenWishlistItem
): string | null {
  const profile = plant.plant_profile;
  if (!profile) return null;
  return getJournalStylePlantImageUrl(profile.primary_image_url);
}

function PlantThumbnail({
  src,
  alt,
  size = 96,
}: {
  src: string | null | undefined;
  alt: string;
  size?: number;
}) {
  if (src) {
    return (
      <div
        className="garden-plants-thumb"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="garden-plants-thumb__img"
          unoptimized={src.startsWith("/")}
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden="true"
      className="garden-plants-thumb garden-plants-thumb--fallback"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <span className="garden-plants-thumb__initial">{alt.trim().charAt(0).toUpperCase() || "?"}</span>
    </div>
  );
}

// ─── Urgency marker ───────────────────────────────────────────────────────────

function UrgencyMarker({ urgency }: { urgency: Urgency }) {
  if (urgency === "overdue")
    return (
      <span className="garden-plants2-urgency garden-plants2-urgency--overdue" aria-label="Care overdue">
        Care overdue
      </span>
    );
  if (urgency === "soon")
    return (
      <span className="garden-plants2-urgency garden-plants2-urgency--soon" aria-label="Care this week">
        Care this week
      </span>
    );
  return null;
}

type PlantCardProps =
  | {
      variant: "growing";
      plant: GardenPlantInstance;
      beds: GardenBed[];
      zones: GardenZone[];
      tasks: GardenTask[];
      today: string;
      isSelected: boolean;
      onSelect: () => void;
      onDeepLink: () => void;
      isReadOnly?: boolean;
    }
  | {
      variant: "archived";
      plant: GardenPlantInstance;
      beds: GardenBed[];
      zones: GardenZone[];
      isSelected: boolean;
      onSelect: () => void;
      onDeepLink: () => void;
      isReadOnly?: boolean;
    }
  | {
      variant: "wishlist";
      item: GardenWishlistItem;
      isSelected: boolean;
      onSelect: () => void;
    };

function PlantCard(props: PlantCardProps) {
  const isWishlist = props.variant === "wishlist";
  const item = isWishlist ? props.item : props.plant;
  const name = getCatalogPlantName(item);
  const scanLabel = getPlantScanLabel(item);
  const selectsWholeCard = isWishlist || (!isWishlist && props.isReadOnly);
  const className = [
    "garden-plants-card",
    props.variant === "archived" && "garden-plants-card--archived",
    props.variant === "wishlist" && "garden-plants-card--wishlist",
    "garden-plants2-card",
    selectsWholeCard && "garden-plants2-card--selectable",
    props.isSelected && "is-selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={className}
      aria-label={selectsWholeCard ? `Select ${name}` : undefined}
      aria-selected={props.isSelected}
      role={selectsWholeCard ? "button" : undefined}
      tabIndex={selectsWholeCard ? 0 : undefined}
      onClick={selectsWholeCard ? props.onSelect : undefined}
      onKeyDown={
        selectsWholeCard
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                props.onSelect();
              }
            }
          : undefined
      }
    >
      {selectsWholeCard ? (
        <span className="garden-plants2-card__select-btn" aria-hidden="true">
          <PlantThumbnail src={getThumbSrc(item)} alt={name} />
        </span>
      ) : (
        <button
          type="button"
          className="garden-plants2-card__select-btn"
          aria-label={`Select ${name}`}
          onClick={props.onSelect}
        >
          <PlantThumbnail src={getThumbSrc(item)} alt={name} />
        </button>
      )}
      <div className="garden-plants-card__body">
        <div className="garden-plants-card__head">
          <strong className="garden-plants-card__name">{name}</strong>
          {props.variant === "archived" ? <SpecimenLabel>Past</SpecimenLabel> : null}
          {props.variant === "wishlist" ? <SpecimenLabel tone="clay">To try</SpecimenLabel> : null}
        </div>
        {scanLabel ? (
          <em className="garden-plants-card__botanical">
            {scanLabel}
          </em>
        ) : null}
        {props.variant === "wishlist" ? (
          <>
            {item.plant_profile?.plant_type_code ? (
              <p className="garden-plants-card__context">
                {formatPlantTypeLabel(item.plant_profile.plant_type_code)}
              </p>
            ) : null}
            {item.notes ? (
              <p className="garden-plants-card__meta">{item.notes}</p>
            ) : null}
          </>
        ) : (
          <PlantCardPlantDetails {...props} name={name} />
        )}
      </div>
    </article>
  );
}

type PlantCardPlantDetailsProps =
  | (Extract<PlantCardProps, { variant: "growing" }> & { name: string })
  | (Extract<PlantCardProps, { variant: "archived" }> & { name: string });

function PlantCardPlantDetails(props: PlantCardPlantDetailsProps) {
  const { variant, plant, beds, zones, name, onDeepLink } = props;
  const isReadOnly = props.isReadOnly ?? false;
  const nextTask = variant === "growing" ? getSoonestTask(plant.id, props.tasks) : null;
  const urgency = variant === "growing" && nextTask ? getUrgency(nextTask.due_on, props.today) : "normal";
  const stage = variant === "growing" ? deriveLifecycleStage(plant) : null;
  const harvest = variant === "growing" ? harvestReadiness(plant) : null;
  const plantMeta =
    variant === "growing"
      ? plant.planted_on
        ? ` · ${formatDaysInGround(plant.planted_on, props.today)}`
        : ""
      : plant.planted_on ? ` · planted ${formatGardenDate(plant.planted_on)}` : "";

  return (
    <>
      <p className="garden-plants-card__context">
        {getZoneName(zones, plant.zone_id)} &middot;{" "}
        {getBedName(beds, plant.bed_id)}
      </p>
      <p className="garden-plants-card__meta">
        {formatPlantCount(plant.quantity)}
        {plantMeta}
      </p>
      {(stage || harvest) && (
        <p className="garden-plants-stage-row">
          {stage && <span className="garden-plants-stage-chip">{stage.label}</span>}
          {harvest && (
            <span className={`garden-plants-harvest${harvest.ready ? " is-ready" : ""}`}>
              {harvest.label}
            </span>
          )}
        </p>
      )}
      {nextTask && (
        <div className="garden-plants2-card__task-row">
          {isReadOnly ? null : <UrgencyMarker urgency={urgency} />}
          <span className="garden-plants2-card__task-title">
            {urgency === "overdue" ? "Overdue:" : "This week:"}{" "}
            <span className="garden-plants2-card__task-name">
              {nextTask.title}
            </span>
            {!isReadOnly && nextTask.due_on ? ` (due ${formatGardenDate(nextTask.due_on)})` : ""}
          </span>
        </div>
      )}
      {isReadOnly ? null : (
        <div className="garden-plants-card__actions">
          <button
            className="folio-button"
            type="button"
            onClick={onDeepLink}
            aria-label={`Show where ${name} is planted in My Garden`}
          >
            Show in My Garden
          </button>
        </div>
      )}
    </>
  );
}

type PlantListRowProps =
  | {
      variant: "growing";
      plant: GardenPlantInstance;
      beds: GardenBed[];
      zones: GardenZone[];
      tasks: GardenTask[];
      today: string;
      isSelected: boolean;
      onSelect: () => void;
      onDeepLink: () => void;
      isReadOnly?: boolean;
    }
  | {
      variant: "archived";
      plant: GardenPlantInstance;
      beds: GardenBed[];
      zones: GardenZone[];
      today: string;
      isSelected: boolean;
      onSelect: () => void;
      onDeepLink: () => void;
      isReadOnly?: boolean;
    }
  | {
      variant: "wishlist";
      item: GardenWishlistItem;
      isSelected: boolean;
      onSelect: () => void;
      isReadOnly?: boolean;
    };

function PlantListRow(props: PlantListRowProps) {
  const isWishlist = props.variant === "wishlist";
  const item = isWishlist ? props.item : props.plant;
  const name = getCatalogPlantName(item);
  const scanLabel = getPlantScanLabel(item);
  const className = [
    "garden-plants2-list-row",
    props.variant === "archived" && "garden-plants2-list-row--archived",
    props.isSelected && "is-selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className={className} aria-selected={props.isSelected}>
      <td className="garden-plants2-list-col garden-plants2-list-col--name">
        <button
          type="button"
          className="garden-plants2-list-select-btn"
          onClick={props.onSelect}
          aria-label={`Select ${name}`}
        >
          {name}
        </button>
        {scanLabel ? (
          <span className="garden-plants2-list-botanical">
            {scanLabel}
          </span>
        ) : null}
      </td>
      {props.variant === "wishlist" ? (
        <WishlistListCells item={props.item} isReadOnly={props.isReadOnly} />
      ) : (
        <PlantListCells {...props} name={name} />
      )}
    </tr>
  );
}

type PlantListCellsProps =
  | (Extract<PlantListRowProps, { variant: "growing" }> & { name: string })
  | (Extract<PlantListRowProps, { variant: "archived" }> & { name: string });

function PlantListCells(props: PlantListCellsProps) {
  const { variant, plant, beds, zones, today, name, onDeepLink } = props;
  const isReadOnly = props.isReadOnly ?? false;
  const nextTask = variant === "growing" ? getSoonestTask(plant.id, props.tasks) : null;
  const urgency = nextTask ? getUrgency(nextTask.due_on, today) : "normal";

  return (
    <>
      <td className="garden-plants2-list-col garden-plants2-list-col--location">
        {getZoneName(zones, plant.zone_id)} &middot;{" "}
        {getBedName(beds, plant.bed_id)}
      </td>
      <td className="garden-plants2-list-col garden-plants2-list-col--planted">
        {variant === "growing"
          ? plant.planted_on
            ? formatDaysInGround(plant.planted_on, today)
            : "No date set"
          : plant.planted_on
            ? `Planted ${formatGardenDate(plant.planted_on)}`
            : "—"}
      </td>
      <td className="garden-plants2-list-col garden-plants2-list-col--task">
        {variant === "archived" ? (
          <span className="garden-plants2-list-empty">Past</span>
        ) : nextTask ? (
          <span className="garden-plants2-list-task">
            <UrgencyMarker urgency={urgency} />
            {nextTask.title}
            {nextTask.due_on ? (
              <span className="garden-plants2-list-task__due">
                {formatGardenDate(nextTask.due_on)}
              </span>
            ) : null}
          </span>
        ) : (
          <span className="garden-plants2-list-empty">—</span>
        )}
      </td>
      {isReadOnly ? null : (
        <td className="garden-plants2-list-col garden-plants2-list-col--actions">
          <button
            type="button"
            className="folio-button"
            onClick={onDeepLink}
            aria-label={`Show where ${name} is planted in My Garden`}
          >
            Show
          </button>
        </td>
      )}
    </>
  );
}

function WishlistListCells({
  item,
  isReadOnly = false,
}: {
  item: GardenWishlistItem;
  isReadOnly?: boolean;
}) {
  return (
    <>
      <td className="garden-plants2-list-col garden-plants2-list-col--location">
        {item.plant_profile?.plant_type_code ? formatPlantTypeLabel(item.plant_profile.plant_type_code) : "—"}
      </td>
      <td className="garden-plants2-list-col garden-plants2-list-col--planted">
        {item.notes ?? "—"}
      </td>
      <td className="garden-plants2-list-col garden-plants2-list-col--task">
        <span className="garden-plants2-list-empty">To try</span>
      </td>
      {isReadOnly ? null : <td className="garden-plants2-list-col garden-plants2-list-col--actions">—</td>}
    </>
  );
}

// ─── View toggle (Grid / List) ────────────────────────────────────────────────

function ViewToggle({
  active,
  onChange,
}: {
  active: GridView;
  onChange: (v: GridView) => void;
}) {
  return (
    <div className="garden-plants2-view-toggle" role="group" aria-label="View style">
      {(["grid", "list"] as GridView[]).map((v) => (
        <button
          key={v}
          type="button"
          className={`garden-plants2-view-toggle__btn${active === v ? " is-active" : ""}`}
          aria-pressed={active === v}
          onClick={() => onChange(v)}
        >
          {v === "grid" ? "Grid" : "List"}
        </button>
      ))}
    </div>
  );
}

// ─── Drawer: Info tab ─────────────────────────────────────────────────────────

function DrawerInfo({
  plants,
  tasks,
  today,
  selectedPlant,
  selectedWishlist,
  activeTab,
  beds,
  zones,
  isReadOnly = false,
}: {
  plants: GardenPlantInstance[];
  tasks: GardenTask[];
  today: string;
  selectedPlant: GardenPlantInstance | null;
  selectedWishlist: GardenWishlistItem | null;
  activeTab: StatusTab;
  beds: GardenBed[];
  zones: GardenZone[];
  isReadOnly?: boolean;
}) {
  const growing = plants.filter((p) => p.status === "growing");
  const distinctSpecies = new Set(growing.map((p) => p.plant_profile_id)).size;
  const perennialCount = growing.filter(
    (p) => categoriseLifecycle(p.plant_profile?.lifecycle_type) === "perennial"
  ).length;
  const annualCount = growing.filter(
    (p) => categoriseLifecycle(p.plant_profile?.lifecycle_type) === "annual"
  ).length;
  const bedsWithGrowing = new Set(growing.map((p) => p.bed_id)).size;

  const needsAttentionCount = growing.filter((p) => {
    const t = getSoonestTask(p.id, tasks);
    if (!t) return false;
    const u = getUrgency(t.due_on, today);
    return u === "overdue" || u === "soon";
  }).length;

  return (
    <div className="garden-drawer__section">
      <SpecimenLabel tone="olive">Plants you're growing</SpecimenLabel>
      <dl className="garden-detail-list" style={{ marginTop: "var(--space-2)" }}>
        <div className="garden-detail-list__row">
          <dt>Growing now</dt>
          <dd>{growing.length}</dd>
        </div>
        <div className="garden-detail-list__row">
          <dt>Kinds of plants</dt>
          <dd>{distinctSpecies}</dd>
        </div>
        <div className="garden-detail-list__row">
          <dt>Perennials</dt>
          <dd>{perennialCount}</dd>
        </div>
        <div className="garden-detail-list__row">
          <dt>Annuals</dt>
          <dd>{annualCount}</dd>
        </div>
        <div className="garden-detail-list__row">
          <dt>Beds planted</dt>
          <dd>{bedsWithGrowing}</dd>
        </div>
        {needsAttentionCount > 0 && (
          <div className="garden-detail-list__row">
            <dt>Care this week</dt>
            <dd>
              <span className="garden-plants2-urgency garden-plants2-urgency--soon">
                {needsAttentionCount}
              </span>
            </dd>
          </div>
        )}
      </dl>

      {(selectedPlant || selectedWishlist) && (
        <div className="garden-plants2-drawer-preview">
          <SpecimenLabel>Selected</SpecimenLabel>
          {selectedPlant && (
            <div className="garden-plants2-drawer-preview__body">
              <strong>{getCatalogPlantName(selectedPlant)}</strong>
              {getPlantScanLabel(selectedPlant) ? (
                <em className="garden-plants2-drawer-preview__botanical">
                  {getPlantScanLabel(selectedPlant)}
                </em>
              ) : null}
              <p>
                {getZoneName(zones, selectedPlant.zone_id)} &middot;{" "}
                {getBedName(beds, selectedPlant.bed_id)}
              </p>
              <p>
                {formatPlantCount(selectedPlant.quantity)}
                {selectedPlant.planted_on
                  ? ` · planted ${formatGardenDate(selectedPlant.planted_on)}`
                  : ""}
              </p>
            </div>
          )}
          {selectedWishlist && !selectedPlant && (
            <div className="garden-plants2-drawer-preview__body">
              <strong>{getCatalogPlantName(selectedWishlist)}</strong>
              {getPlantScanLabel(selectedWishlist) ? (
                <em className="garden-plants2-drawer-preview__botanical">
                  {getPlantScanLabel(selectedWishlist)}
                </em>
              ) : null}
              {selectedWishlist.notes ? <p>{selectedWishlist.notes}</p> : null}
            </div>
          )}
        </div>
      )}

      {!selectedPlant && !selectedWishlist && (
        <p className="garden-drawer__muted" style={{ marginTop: "var(--space-2)" }}>
          {isReadOnly
            ? activeTab === "growing"
              ? "Open a plant to see notes and care."
              : activeTab === "archived"
                ? "Choose a past plant to see what the last season taught you."
                : "Choose a plant to try and see where it might fit."
            : activeTab === "growing"
              ? "Choose a plant to keep a note or see what needs care."
              : activeTab === "archived"
                ? "Choose a past plant to review it or mark it growing again."
                : "Choose a plant to try and place it in a bed."}
        </p>
      )}
    </div>
  );
}

// ─── Drawer: Filters tab ──────────────────────────────────────────────────────

type FiltersState = {
  zoneId: string;
  bedId: string;
  plantTypeCode: string;
  lifecycle: "" | "annual" | "perennial" | "other";
  needsAttention: boolean;
};

const EMPTY_FILTERS: FiltersState = {
  zoneId: "",
  bedId: "",
  plantTypeCode: "",
  lifecycle: "",
  needsAttention: false,
};

function DrawerFilters({
  plants,
  wishlist,
  zones,
  beds,
  filters,
  onChange,
  onClear,
}: {
  plants: GardenPlantInstance[];
  wishlist: GardenWishlistItem[];
  zones: GardenZone[];
  beds: GardenBed[];
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
  onClear: () => void;
}) {
  const hasActive =
    filters.zoneId !== "" ||
    filters.bedId !== "" ||
    filters.plantTypeCode !== "" ||
    filters.lifecycle !== "" ||
    filters.needsAttention;

  // Zones that have plants
  const usedZoneIds = useMemo(() => {
    const ids = new Set(plants.map((p) => p.zone_id));
    return zones.filter((z) => ids.has(z.id));
  }, [plants, zones]);

  // Beds in selected zone
  const availableBeds = useMemo(() => {
    if (!filters.zoneId) return beds;
    return beds.filter((b) => b.zone_id === filters.zoneId);
  }, [filters.zoneId, beds]);

  // Distinct plant type codes
  const plantTypeCodes = useMemo(() => {
    const allProfiles = [
      ...plants.map((p) => p.plant_profile),
      ...wishlist.map((w) => w.plant_profile),
    ];
    const codes = new Set<string>();
    for (const profile of allProfiles) {
      if (profile?.plant_type_code) codes.add(profile.plant_type_code);
    }
    return Array.from(codes).sort();
  }, [plants, wishlist]);

  function setZone(id: string) {
    onChange({ ...filters, zoneId: id, bedId: "" });
  }

  return (
    <div className="garden-drawer__section">
      <FieldSelect
        label="Place"
        value={filters.zoneId}
        onChange={setZone}
      >
        <option value="">All places</option>
        {usedZoneIds.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name}
          </option>
        ))}
      </FieldSelect>

      <FieldSelect
        label="Bed"
        value={filters.bedId}
        onChange={(id) => onChange({ ...filters, bedId: id })}
      >
        <option value="">All beds</option>
        {availableBeds.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </FieldSelect>

      {plantTypeCodes.length > 0 && (
        <FieldSelect
          label="Plant type"
          value={filters.plantTypeCode}
          onChange={(v) => onChange({ ...filters, plantTypeCode: v })}
        >
          <option value="">All types</option>
          {plantTypeCodes.map((code) => (
            <option key={code} value={code}>
              {formatPlantTypeLabel(code)}
            </option>
          ))}
        </FieldSelect>
      )}

      <FieldSelect
        label="Lifecycle"
        value={filters.lifecycle}
        onChange={(v) =>
          onChange({
            ...filters,
            lifecycle: v as FiltersState["lifecycle"],
          })
        }
      >
        <option value="">All</option>
        <option value="annual">Annual</option>
        <option value="perennial">Perennial</option>
        <option value="other">Mixed or unknown</option>
      </FieldSelect>

      <label className="garden-plants2-toggle-row garden-field">
        <span>Care this week only</span>
        <input
          type="checkbox"
          checked={filters.needsAttention}
          onChange={(e) =>
            onChange({ ...filters, needsAttention: e.target.checked })
          }
        />
      </label>

      {hasActive && (
        <button
          type="button"
          className="folio-button"
          style={{ marginTop: "var(--space-2)" }}
          onClick={onClear}
        >
          Show all plants
        </button>
      )}
    </div>
  );
}

// ─── Drawer: Update tab ───────────────────────────────────────────────────────

function DrawerActions({
  activeTab,
  selectedPlant,
  selectedWishlist,
  beds,
  busy,
  setBusy,
  updatePlantStatus,
  addPlantToBed,
  removeWishlist,
  logPlantObservation,
  onDeepLink,
  clearSelected,
}: {
  activeTab: StatusTab;
  selectedPlant: GardenPlantInstance | null;
  selectedWishlist: GardenWishlistItem | null;
  beds: GardenBed[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  updatePlantStatus: PlantsViewProps["updatePlantStatus"];
  addPlantToBed: PlantsViewProps["addPlantToBed"];
  removeWishlist: PlantsViewProps["removeWishlist"];
  logPlantObservation: PlantsViewProps["logPlantObservation"];
  onDeepLink: (() => void) | null;
  clearSelected: () => void;
}) {
  const [noteDraft, setNoteDraft] = useState("");
  const [selectedBedId, setSelectedBedId] = useState("");

  async function handleArchive() {
    if (!selectedPlant) return;
    setBusy(true);
    try {
      await updatePlantStatus(selectedPlant, "archived");
      clearSelected();
    } finally {
      setBusy(false);
    }
  }

  async function handleRestore() {
    if (!selectedPlant) return;
    setBusy(true);
    try {
      await updatePlantStatus(selectedPlant, "growing");
      clearSelected();
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveUpdate(e: FormEvent) {
    e.preventDefault();
    if (!selectedPlant || !noteDraft.trim()) return;
    setBusy(true);
    try {
      await logPlantObservation(selectedPlant, noteDraft.trim());
      setNoteDraft("");
    } finally {
      setBusy(false);
    }
  }

  async function handleMoveToProperty(e: FormEvent) {
    e.preventDefault();
    if (!selectedWishlist || !selectedBedId) return;
    const slug = selectedWishlist.plant_profile?.slug;
    if (!slug) return;
    setBusy(true);
    try {
      await addPlantToBed(slug, selectedBedId);
      await removeWishlist(selectedWishlist.plant_profile_id);
      clearSelected();
      setSelectedBedId("");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveWishlist() {
    if (!selectedWishlist) return;
    setBusy(true);
    try {
      await removeWishlist(selectedWishlist.plant_profile_id);
      clearSelected();
    } finally {
      setBusy(false);
    }
  }

  // Growing selected
  if (activeTab === "growing" && selectedPlant) {
    return (
      <div className="garden-drawer__section">
        <form className="garden-form" onSubmit={handleSaveUpdate}>
          <SpecimenLabel tone="olive">Keep a garden note</SpecimenLabel>
          <label className="garden-field">
            <span>Note</span>
            <textarea
              className="input garden-textarea"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="First tomato, aphids on kale, rain soaked the beds..."
              rows={3}
            />
          </label>
          <button
            className="folio-button"
            type="submit"
            disabled={busy || !noteDraft.trim()}
          >
            Keep in garden
          </button>
        </form>

        {onDeepLink ? (
          <div className="garden-drawer__actions-row" style={{ marginTop: "var(--space-2)" }}>
            <button
              type="button"
              className="folio-button"
              onClick={onDeepLink}
              disabled={busy}
            >
              Show in My Garden
            </button>
          </div>
        ) : null}

        <details className="garden-drawer__manage">
          <summary>Move this plant</summary>
          <div className="garden-drawer__manage-body">
            <button
              type="button"
              className="folio-button"
              onClick={handleArchive}
              disabled={busy}
            >
              Move to past plants
            </button>
          </div>
        </details>
      </div>
    );
  }

  // Archived selected
  if (activeTab === "archived" && selectedPlant) {
    return (
      <div className="garden-drawer__section">
        {onDeepLink ? (
          <div className="garden-drawer__actions-row">
            <button
              type="button"
              className="folio-button"
              onClick={onDeepLink}
              disabled={busy}
            >
              Show in My Garden
            </button>
          </div>
        ) : null}

        <details className="garden-drawer__manage">
          <summary>Move this plant</summary>
          <div className="garden-drawer__manage-body">
            <button
              type="button"
              className="folio-button"
              onClick={handleRestore}
              disabled={busy}
            >
              Mark as growing again
            </button>
          </div>
        </details>
      </div>
    );
  }

  // Plant-to-try selected
  if (activeTab === "wishlist" && selectedWishlist) {
    return (
      <div className="garden-drawer__section">
        <form className="garden-form" onSubmit={handleMoveToProperty}>
          <SpecimenLabel tone="clay">Plant it in a bed</SpecimenLabel>
          <FieldSelect
            label="Choose a bed"
            value={selectedBedId}
            onChange={setSelectedBedId}
          >
            <option value="">Select a bed…</option>
            {beds.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </FieldSelect>
          <button
            className="button"
            type="submit"
            disabled={busy || !selectedBedId}
          >
            {busy ? "Planting…" : "Plant in this bed"}
          </button>
        </form>

        <details className="garden-drawer__manage">
          <summary>Change plant to try</summary>
          <div className="garden-drawer__manage-body">
            <button
              type="button"
              className="garden-drawer__danger"
              onClick={handleRemoveWishlist}
              disabled={busy}
            >
              Remove from plants to try
            </button>
          </div>
        </details>
      </div>
    );
  }

  // Nothing selected
  return (
    <div className="garden-drawer__section">
      <p className="garden-drawer__muted">
        {activeTab === "growing" ? (
          <>
            Choose a plant to keep a note or see where it grows.{" "}
            <a className="garden-link-button" href="/app/my-property">
              Add a plant ›
            </a>
          </>
        ) : activeTab === "archived" ? (
          "Choose a past plant to review it or mark it growing again."
        ) : (
          "Choose a plant to try and place it in a bed."
        )}
      </p>
    </div>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────

function EmptyGrowing({ isReadOnly = false }: { isReadOnly?: boolean }) {
  return (
    <div className="garden-plants-empty">
      <SpecimenLabel tone="olive">No plants yet</SpecimenLabel>
      <p>
        {isReadOnly
          ? "No plants are growing here yet."
          : "Give one plant a home so notes stay where they belong."}
      </p>
      {isReadOnly ? null : (
        <a className="folio-button" href="/app/my-property">
          Add one plant
        </a>
      )}
    </div>
  );
}

function EmptyWishlist({ isReadOnly = false }: { isReadOnly?: boolean }) {
  return (
    <div className="garden-plants-empty">
      <SpecimenLabel tone="clay">No plants to try yet</SpecimenLabel>
      <p>
        {isReadOnly
          ? "Plants to try would appear here before they move into a bed."
          : "Choose plants you might grow later. Plant one when you have a spot for it."}
      </p>
      {isReadOnly ? null : (
        <a className="folio-button" href="/app/plant-catalogue">
          Choose plants
        </a>
      )}
    </div>
  );
}

function EmptyArchived() {
  return (
    <div className="garden-plants-empty">
      <SpecimenLabel>No past plants yet</SpecimenLabel>
      <p>Past plants will show what grew, what struggled, and what to remember next time.</p>
    </div>
  );
}

function EmptyFiltered({ onClear }: { onClear: () => void }) {
  return (
    <div className="garden-plants-empty">
      <SpecimenLabel>No matches</SpecimenLabel>
      <p>No plants match that yet.</p>
      <button type="button" className="folio-button" onClick={onClear}>
        Show all plants
      </button>
    </div>
  );
}

// ─── Main PlantsView ──────────────────────────────────────────────────────────

export function PlantsView({
  beds,
  zones,
  plants,
  wishlist,
  tasks,
  updatePlantStatus,
  addPlantToBed,
  removeWishlist,
  logPlantObservation,
  observations,
  outcomes,
  mediaUrls,
  addTask,
  addPlantOutcome,
  deletePlantOutcome,
  isReadOnly = false,
}: PlantsViewProps) {
  const router = useRouter();
  const today = getTodayISO();

  // ── Tab / view state ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<StatusTab>("growing");
  const [gridView, setGridView] = useState<GridView>("grid");
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("info");
  const [showPlantFilters, setShowPlantFilters] = useState(false);
  useEffect(() => {
    if (isReadOnly && drawerTab === "actions") {
      setDrawerTab("info");
    }
  }, [drawerTab, isReadOnly]);

  // ── Search ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const q = searchQuery.trim().toLowerCase();

  // ── Filters (drawer) ──────────────────────────────────────────────────────
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);

  // ── Selected card ─────────────────────────────────────────────────────────
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);

  // ── Mutation busy ─────────────────────────────────────────────────────────
  const [busy, setBusy] = useState(false);

  // ── Tab counts (unfiltered) ───────────────────────────────────────────────
  const growingCount = plants.filter((p) => p.status === "growing").length;
  const archivedCount = plants.filter((p) => p.status === "archived").length;
  const wishlistCount = wishlist.length;
  const statusTabs = [
    { id: "growing", label: "Growing", count: growingCount },
    { id: "archived", label: "Past", count: archivedCount },
    { id: "wishlist", label: "To try", count: wishlistCount },
  ] as const;
  const visibleStatusTabs = statusTabs.filter((tab) => tab.count > 0 || tab.id === activeTab);

  // ── Search helpers ────────────────────────────────────────────────────────
  function matchesSearch(plant: GardenPlantInstance): boolean {
    if (!q) return true;
    const dn = (plant.plant_profile?.display_name ?? "").toLowerCase();
    const bn = (plant.plant_profile?.botanical_name_full ?? "").toLowerCase();
    const bed = getBedName(beds, plant.bed_id).toLowerCase();
    const zone = getZoneName(zones, plant.zone_id).toLowerCase();
    return dn.includes(q) || bn.includes(q) || bed.includes(q) || zone.includes(q);
  }

  function matchesWishlistSearch(item: GardenWishlistItem): boolean {
    if (!q) return true;
    const dn = (item.plant_profile?.display_name ?? "").toLowerCase();
    const bn = (item.plant_profile?.botanical_name_full ?? "").toLowerCase();
    return dn.includes(q) || bn.includes(q);
  }

  // ── Filter helpers ────────────────────────────────────────────────────────
  function matchesFilters(plant: GardenPlantInstance): boolean {
    if (filters.zoneId && plant.zone_id !== filters.zoneId) return false;
    if (filters.bedId && plant.bed_id !== filters.bedId) return false;
    if (
      filters.plantTypeCode &&
      plant.plant_profile?.plant_type_code !== filters.plantTypeCode
    )
      return false;
    if (filters.lifecycle) {
      const lc = categoriseLifecycle(plant.plant_profile?.lifecycle_type);
      if (lc !== filters.lifecycle) return false;
    }
    if (filters.needsAttention) {
      const t = getSoonestTask(plant.id, tasks);
      if (!t) return false;
      const u = getUrgency(t.due_on, today);
      if (u === "normal") return false;
    }
    return true;
  }

  // ── Filtered lists ────────────────────────────────────────────────────────
  const filteredGrowing = useMemo(
    () =>
      plants
        .filter(
          (p) =>
            p.status === "growing" && matchesSearch(p) && matchesFilters(p)
        )
        .sort((a, b) => comparePlantsByNextCare(a, b, tasks)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plants, q, filters, beds, zones, tasks]
  );

  const filteredArchived = useMemo(
    () =>
      plants.filter(
        (p) =>
          p.status === "archived" && matchesSearch(p) && matchesFilters(p)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plants, q, filters, beds, zones]
  );

  const filteredWishlist = useMemo(
    () => wishlist.filter((item) => matchesWishlistSearch(item)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wishlist, q]
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectedPlant =
    plants.find((p) => p.id === selectedPlantId) ?? null;
  const selectedWishlist =
    wishlist.find((w) => w.id === selectedWishlistId) ?? null;

  function selectPlant(id: string) {
    setSelectedPlantId((prev) => (prev === id ? null : id));
    setSelectedWishlistId(null);
    setDrawerTab("info");
  }

  function selectWishlist(id: string) {
    setSelectedWishlistId((prev) => (prev === id ? null : id));
    setSelectedPlantId(null);
    setDrawerTab("info");
  }

  function clearSelected() {
    setSelectedPlantId(null);
    setSelectedWishlistId(null);
  }

  // Tab change clears selection
  function changeTab(tab: StatusTab) {
    setActiveTab(tab);
    clearSelected();
    setShowPlantFilters(false);
  }

  // ── Deep link ─────────────────────────────────────────────────────────────
  function buildDeepLink(plant: GardenPlantInstance): string {
    const params = new URLSearchParams();
    params.set("zone", plant.zone_id);
    params.set("bed", plant.bed_id);
    params.set("plant", plant.id);
    return `/app/my-property?${params.toString()}`;
  }

  function deepLinkFor(plant: GardenPlantInstance) {
    router.push(buildDeepLink(plant));
  }

  // ── hasFilters ────────────────────────────────────────────────────────────
  const hasFilters =
    q.length > 0 ||
    filters.zoneId !== "" ||
    filters.bedId !== "" ||
    filters.plantTypeCode !== "" ||
    filters.lifecycle !== "" ||
    filters.needsAttention;
  const showFilterControls = !isReadOnly;

  function clearAll() {
    setSearchQuery("");
    setFilters(EMPTY_FILTERS);
  }

  // ── Total counts per tab ──────────────────────────────────────────────────
  const unfilteredGrowingCount = plants.filter((p) => p.status === "growing").length;
  const unfilteredArchivedCount = plants.filter((p) => p.status === "archived").length;

  const filteredCount =
    activeTab === "growing"
      ? filteredGrowing.length
      : activeTab === "archived"
      ? filteredArchived.length
      : filteredWishlist.length;

  const totalCount =
    activeTab === "growing"
      ? unfilteredGrowingCount
      : activeTab === "archived"
      ? unfilteredArchivedCount
      : wishlistCount;
  const showStatusTabs = statusTabs.some((t) => t.count > 0 && t.id !== "growing") || visibleStatusTabs.length > 1;
  const showViewToggle = totalCount > 6 || gridView === "list";
  const growingPlants = plants.filter((p) => p.status === "growing");
  const bedsWithGrowingCount = new Set(growingPlants.map((p) => p.bed_id)).size;
  const needsAttentionCount = growingPlants.filter((p) => {
    const task = getSoonestTask(p.id, tasks);
    if (!task) return false;
    const urgency = getUrgency(task.due_on, today);
    return urgency === "overdue" || urgency === "soon";
  }).length;
  const careThisWeekSummary =
    needsAttentionCount === 1
      ? "1 plant needs care this week."
      : `${needsAttentionCount} plants need care this week.`;
  const savedPlantsSummary = `${growingCount} ${growingCount === 1 ? "plant" : "plants"} in ${bedsWithGrowingCount} ${bedsWithGrowingCount === 1 ? "bed" : "beds"}`;
  const firstCareEntry = filteredGrowing
    .map((plant) => ({ plant, task: getSoonestTask(plant.id, tasks) }))
    .find(({ task }) => {
      if (!task) return false;
      const urgency = getUrgency(task.due_on, today);
      return urgency === "overdue" || urgency === "soon";
    }) ?? null;
  const hasSelection = Boolean(selectedPlant || selectedWishlist);

  // ── Render helpers ────────────────────────────────────────────────────────
  function renderGrowingGrid() {
    if (unfilteredGrowingCount === 0) return <EmptyGrowing isReadOnly={isReadOnly} />;
    if (filteredGrowing.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="garden-plants-card-grid garden-plants2-card-grid">
        {filteredGrowing.map((plant) => (
          <PlantCard
            key={plant.id}
            variant="growing"
            plant={plant}
            beds={beds}
            zones={zones}
            tasks={tasks}
            today={today}
            isSelected={selectedPlantId === plant.id}
            onSelect={() => selectPlant(plant.id)}
            onDeepLink={() => deepLinkFor(plant)}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>
    );
  }

  function renderGrowingList() {
    if (unfilteredGrowingCount === 0) return <EmptyGrowing isReadOnly={isReadOnly} />;
    if (filteredGrowing.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="garden-plants2-list-wrap">
        <table className="garden-plants2-list-table" aria-label="Growing plants">
          <thead>
            <tr>
              <th className="garden-plants2-list-th">Plant</th>
              <th className="garden-plants2-list-th">Location</th>
              <th className="garden-plants2-list-th">Time in ground</th>
              <th className="garden-plants2-list-th">Next up</th>
              {isReadOnly ? null : (
                <th className="garden-plants2-list-th">
                  <span className="sr-only">Show in My Garden</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredGrowing.map((plant) => (
              <PlantListRow
                key={plant.id}
                variant="growing"
                plant={plant}
                beds={beds}
                zones={zones}
                tasks={tasks}
                today={today}
                isSelected={selectedPlantId === plant.id}
                onSelect={() => selectPlant(plant.id)}
                onDeepLink={() => deepLinkFor(plant)}
                isReadOnly={isReadOnly}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderArchivedGrid() {
    if (unfilteredArchivedCount === 0) return <EmptyArchived />;
    if (filteredArchived.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="garden-plants-card-grid garden-plants2-card-grid">
        {filteredArchived.map((plant) => (
          <PlantCard
            key={plant.id}
            variant="archived"
            plant={plant}
            beds={beds}
            zones={zones}
            isSelected={selectedPlantId === plant.id}
            onSelect={() => selectPlant(plant.id)}
            onDeepLink={() => deepLinkFor(plant)}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>
    );
  }

  function renderArchivedList() {
    if (unfilteredArchivedCount === 0) return <EmptyArchived />;
    if (filteredArchived.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="garden-plants2-list-wrap">
        <table className="garden-plants2-list-table" aria-label="Past plants">
          <thead>
            <tr>
              <th className="garden-plants2-list-th">Plant</th>
              <th className="garden-plants2-list-th">Location</th>
              <th className="garden-plants2-list-th">Time in ground</th>
              <th className="garden-plants2-list-th">Status</th>
              {isReadOnly ? null : (
                <th className="garden-plants2-list-th">
                  <span className="sr-only">Show in My Garden</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredArchived.map((plant) => (
              <PlantListRow
                key={plant.id}
                variant="archived"
                plant={plant}
                beds={beds}
                zones={zones}
                today={today}
                isSelected={selectedPlantId === plant.id}
                onSelect={() => selectPlant(plant.id)}
                onDeepLink={() => deepLinkFor(plant)}
                isReadOnly={isReadOnly}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderWishlistGrid() {
    if (wishlistCount === 0) return <EmptyWishlist isReadOnly={isReadOnly} />;
    if (filteredWishlist.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="garden-plants-card-grid garden-plants2-card-grid">
        {filteredWishlist.map((item) => (
          <PlantCard
            key={item.id}
            variant="wishlist"
            item={item}
            isSelected={selectedWishlistId === item.id}
            onSelect={() => selectWishlist(item.id)}
          />
        ))}
      </div>
    );
  }

  function renderWishlistList() {
    if (wishlistCount === 0) return <EmptyWishlist isReadOnly={isReadOnly} />;
    if (filteredWishlist.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="garden-plants2-list-wrap">
        <table className="garden-plants2-list-table" aria-label="Plants to try">
          <thead>
            <tr>
              <th className="garden-plants2-list-th">Plant</th>
              <th className="garden-plants2-list-th">Type</th>
              <th className="garden-plants2-list-th">Notes</th>
              <th className="garden-plants2-list-th">Status</th>
              {isReadOnly ? null : (
                <th className="garden-plants2-list-th">
                  <span className="sr-only">Plant to try</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredWishlist.map((item) => (
              <PlantListRow
                key={item.id}
                variant="wishlist"
                item={item}
                isSelected={selectedWishlistId === item.id}
                onSelect={() => selectWishlist(item.id)}
                isReadOnly={isReadOnly}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Deep link for selected plant (for Actions drawer) ─────────────────────
  const selectedPlantDeepLink =
    selectedPlant ? () => deepLinkFor(selectedPlant) : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="garden-plants2-layout">
      {/* ── Canvas ────────────────────────────────────────────────────────── */}
      <div className="garden-plants2-canvas">
        {/* Toolbar */}
        <div className="garden-plants-toolbar garden-plants2-toolbar">
          <div className="garden-plants2-toolbar-top">
            <div className="garden-plants-search-wrap">
              <svg
                className="garden-plants-search-icon"
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <line
                  x1="10.5"
                  y1="10.5"
                  x2="14.5"
                  y2="14.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                className="garden-plants-search"
                type="search"
                aria-label="Search plants by name, bed, or place"
                placeholder="Search by name, bed, or place…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {showViewToggle ? <ViewToggle active={gridView} onChange={setGridView} /> : null}
          </div>
        </div>

        {/* Status tabs */}
        {showStatusTabs ? (
          <div className="garden-plants-tabs" role="tablist" aria-label="Plant status">
            {visibleStatusTabs.map(({ id, label, count }) => (
              <button
                key={id}
                role="tab"
                type="button"
                className={`garden-plants-tab${activeTab === id ? " is-active" : ""}`}
                aria-selected={activeTab === id}
                onClick={() => changeTab(id)}
              >
                {label}
                <span className="garden-plants-tab__count">{count}</span>
              </button>
            ))}
          </div>
        ) : null}

        {/* Results header */}
        {hasFilters && (
          <div className="garden-plants-results-header">
            <p className="garden-plants-results-count">
              Showing {filteredCount} of {totalCount}{" "}
              {activeTab === "wishlist" ? "plant to try" : "plant"}
              {totalCount !== 1 ? "s" : ""}
            </p>
            <button
              type="button"
              className="garden-plants-clear"
              onClick={clearAll}
            >
              {activeTab === "wishlist" ? "Show all plants to try" : "Show all plants"}
            </button>
          </div>
        )}

        {/* Tab panels */}
        {activeTab === "growing" && (
          <div
            role="tabpanel"
            aria-label="Growing plants"
            className="garden-plants-panel"
          >
            {gridView === "grid"
              ? renderGrowingGrid()
              : renderGrowingList()}
          </div>
        )}

        {activeTab === "archived" && (
          <div
            role="tabpanel"
            aria-label="Past plants"
            className="garden-plants-panel"
          >
            {gridView === "grid"
              ? renderArchivedGrid()
              : renderArchivedList()}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div
            role="tabpanel"
            aria-label="Plants to try"
            className="garden-plants-panel"
          >
            {gridView === "grid"
              ? renderWishlistGrid()
              : renderWishlistList()}
          </div>
        )}
      </div>

      {/* ── Right drawer ──────────────────────────────────────────────────── */}
      <aside className="garden-drawer garden-plants2-drawer" aria-label="Plant journal">
        <div className="garden-drawer__scope">
          <InkStamp tone="olive">Plant notes</InkStamp>
          {hasSelection ? (
            <span>
              {selectedPlant
                ? getCatalogPlantName(selectedPlant)
                : selectedWishlist
                  ? getCatalogPlantName(selectedWishlist)
                  : ""}
            </span>
          ) : null}
        </div>

        {!hasSelection ? (
          <div className="garden-drawer__body">
            <section className="garden-drawer__section garden-plants2-empty-guide">
              <SpecimenLabel tone="olive">
                Choose a plant
              </SpecimenLabel>
              {activeTab === "growing" && firstCareEntry ? (
                <>
                  <p>
                    {`Start with ${getCatalogPlantName(firstCareEntry.plant)}. Open any plant when you need its notes.`}
                  </p>
                  {needsAttentionCount > 0 ? (
                    <p className="garden-plants2-empty-guide__attention">
                      {careThisWeekSummary}
                    </p>
                  ) : null}
                </>
              ) : (
                <p>
                  {activeTab === "growing"
                    ? "Open any plant to see notes and care."
                    : activeTab === "archived"
                      ? "Choose a past plant to see what earlier seasons taught you."
                      : "Choose a plant to try and see why it might fit your garden."}
                </p>
              )}
              {showFilterControls ? (
                <div className="garden-plants2-empty-guide__actions">
                  {hasFilters ? (
                    <button type="button" className="folio-button" onClick={clearAll}>
                      Show all plants
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="folio-button"
                    aria-expanded={showPlantFilters}
                    onClick={() => setShowPlantFilters((value) => !value)}
                  >
                    {showPlantFilters ? "Hide filters" : "Filter plants"}
                  </button>
                </div>
              ) : null}
              {showFilterControls && showPlantFilters ? (
                <DrawerFilters
                  plants={plants}
                  wishlist={wishlist}
                  zones={zones}
                  beds={beds}
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters(EMPTY_FILTERS)}
                />
              ) : null}
            </section>
          </div>
        ) : (
          <>
            <div className="garden-drawer__tabs" role="tablist">
              {(isReadOnly
                ? (["info", "timeline"] as PlantsDrawerVisibleTab[])
                : (["info", "timeline", "actions"] as PlantsDrawerVisibleTab[])
              ).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  type="button"
                  aria-selected={drawerTab === tab}
                  className={`garden-drawer__tab${drawerTab === tab ? " is-active" : ""}`}
                  onClick={() => setDrawerTab(tab)}
                >
                  {PLANTS_DRAWER_TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            <div className="garden-drawer__body">
              {drawerTab === "info" && (
                <DrawerInfo
                  plants={plants}
                  tasks={tasks}
                  today={today}
                  selectedPlant={selectedPlant}
                  selectedWishlist={selectedWishlist}
                  activeTab={activeTab}
                  beds={beds}
                  zones={zones}
                  isReadOnly={isReadOnly}
                />
              )}
              {drawerTab === "timeline" && !selectedPlant && selectedWishlist ? (
                <div className="garden-drawer__section">
                  <p className="garden-drawer__muted">
                    Plant history appears once this variety is growing in a bed.
                  </p>
                </div>
              ) : null}
              {drawerTab === "timeline" && selectedPlant ? (
                <div className="garden-drawer__section">
                  <PlantTimeline
                    plant={selectedPlant}
                    observations={observations}
                    tasks={tasks}
                    outcomes={outcomes}
                    suggestions={generateSuggestions({
                      focus: "plant",
                      property: null,
                      zone: null,
                      bed: null,
                      plant: selectedPlant,
                      zones,
                      beds,
                      plants,
                      season: deriveSeason(new Date().getMonth()),
                      existingTaskTitles: tasks
                        .filter(
                          (t) =>
                            t.status === "open" &&
                            t.plant_instance_id === selectedPlant.id
                        )
                        .map((t) => t.title),
                      outcomes,
                    })}
                    mediaUrls={mediaUrls}
                    today={today}
                    addTask={addTask}
                    addPlantOutcome={addPlantOutcome}
                    deletePlantOutcome={deletePlantOutcome}
                    busy={busy}
                    isReadOnly={isReadOnly}
                  />
                </div>
              ) : null}
              {!isReadOnly && drawerTab === "actions" && (
                <DrawerActions
                  activeTab={activeTab}
                  selectedPlant={selectedPlant}
                  selectedWishlist={selectedWishlist}
                  beds={beds}
                  busy={busy}
                  setBusy={setBusy}
                  updatePlantStatus={updatePlantStatus}
                  addPlantToBed={addPlantToBed}
                  removeWishlist={removeWishlist}
                  logPlantObservation={logPlantObservation}
                  onDeepLink={selectedPlantDeepLink}
                  clearSelected={clearSelected}
                />
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
