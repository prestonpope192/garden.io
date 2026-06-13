"use client";

import Image from "next/image";
import { useState, useMemo, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SpecimenLabel, InkStamp } from "@/components/journal-primitives";
import {
  getBedName,
  getZoneName,
  getTodayISO,
} from "@/lib/garden-app-helpers";
import type {
  GardenBed,
  GardenPlantInstance,
  GardenTask,
  GardenWishlistItem,
  GardenZone,
} from "@/lib/garden-app-types";
import { deriveLifecycleStage, harvestReadiness } from "@/lib/garden-phenology";
import {
  getCatalogPlantName,
  formatQuantity,
  getProfileIllustration,
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
};

// ─── Local types ───────────────────────────────────────────────────────────────

type StatusTab = "growing" | "archived" | "wishlist";
type GridView = "grid" | "list";
type DrawerTab = "info" | "filters" | "actions";

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
  if (days < 0) return `planted ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} from now`;
  if (days === 0) return "planted today";
  if (days === 1) return "1 day in ground";
  if (days < 7) return `${days} days in ground`;
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  if (rem === 0) return `${weeks} week${weeks === 1 ? "" : "s"} in ground`;
  return `${weeks}w ${rem}d in ground`;
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

/** Categorise lifecycle_type into Annual / Perennial / Other */
function categoriseLifecycle(lc: string | undefined): "annual" | "perennial" | "other" {
  if (!lc) return "other";
  const lower = lc.toLowerCase();
  if (lower.includes("peren")) return "perennial";
  if (lower.includes("ann")) return "annual";
  return "other";
}

// ─── Thumbnail ─────────────────────────────────────────────────────────────────

function getThumbSrc(
  plant: GardenPlantInstance | GardenWishlistItem
): string | null {
  const profile = plant.plant_profile;
  if (!profile) return null;
  if (profile.primary_image_url) return profile.primary_image_url;
  return getProfileIllustration(profile);
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
        className="beta-plants-thumb"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="beta-plants-thumb__img"
          unoptimized={src.startsWith("/")}
        />
      </div>
    );
  }
  return (
    <div
      className="beta-plants-thumb beta-plants-thumb--fallback"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <img
        src="/art/specimen-herbarium-sheet.svg"
        alt=""
        aria-hidden="true"
        className="beta-plants-thumb__img"
        width={size}
        height={size}
      />
    </div>
  );
}

// ─── Urgency marker ───────────────────────────────────────────────────────────

function UrgencyMarker({ urgency }: { urgency: Urgency }) {
  if (urgency === "overdue")
    return (
      <span className="beta-plants2-urgency beta-plants2-urgency--overdue" aria-label="Overdue">
        Overdue
      </span>
    );
  if (urgency === "soon")
    return (
      <span className="beta-plants2-urgency beta-plants2-urgency--soon" aria-label="Due soon">
        Due soon
      </span>
    );
  return null;
}

// ─── Field helpers (same pattern as property-view) ────────────────────────────

function FieldText(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="beta-field">
      <span>{props.label}</span>
      <input
        className="input"
        type={props.type ?? "text"}
        required={props.required}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

function FieldSelect(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="beta-field">
      <span>{props.label}</span>
      <select
        className="input"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.children}
      </select>
    </label>
  );
}

// ─── Growing plant card (grid view) ──────────────────────────────────────────

function GrowingCardGrid({
  plant,
  beds,
  zones,
  tasks,
  today,
  isSelected,
  onSelect,
  onDeepLink,
}: {
  plant: GardenPlantInstance;
  beds: GardenBed[];
  zones: GardenZone[];
  tasks: GardenTask[];
  today: string;
  isSelected: boolean;
  onSelect: () => void;
  onDeepLink: () => void;
}) {
  const nextTask = getSoonestTask(plant.id, tasks);
  const urgency = nextTask ? getUrgency(nextTask.due_on, today) : "normal";
  const name = getCatalogPlantName(plant);
  const stage = deriveLifecycleStage(plant);
  const harvest = harvestReadiness(plant);

  return (
    <article
      className={`beta-plants-card beta-plants2-card${isSelected ? " is-selected" : ""}`}
      aria-selected={isSelected}
    >
      <button
        type="button"
        className="beta-plants2-card__select-btn"
        aria-label={`Select ${name}`}
        onClick={onSelect}
      >
        <PlantThumbnail src={getThumbSrc(plant)} alt={name} />
      </button>
      <div className="beta-plants-card__body">
        <div className="beta-plants-card__head">
          <strong className="beta-plants-card__name">{name}</strong>
          <SpecimenLabel tone="olive">Growing</SpecimenLabel>
        </div>
        {plant.plant_profile?.botanical_name_full && (
          <em className="beta-plants-card__botanical">
            {plant.plant_profile.botanical_name_full}
          </em>
        )}
        <p className="beta-plants-card__context">
          {getZoneName(zones, plant.zone_id)} &middot;{" "}
          {getBedName(beds, plant.bed_id)}
        </p>
        <p className="beta-plants-card__meta">
          {formatQuantity(plant.quantity)} growing
          {plant.planted_on
            ? ` · ${formatDaysInGround(plant.planted_on, today)}`
            : ""}
        </p>
        {(stage || harvest) && (
          <p className="beta-plants-stage-row">
            {stage && <span className="beta-plants-stage-chip">{stage.label}</span>}
            {harvest && (
              <span className={`beta-plants-harvest${harvest.ready ? " is-ready" : ""}`}>
                {harvest.label}
              </span>
            )}
          </p>
        )}
        {nextTask && (
          <div className="beta-plants2-card__task-row">
            <UrgencyMarker urgency={urgency} />
            <span className="beta-plants2-card__task-title">
              Next:{" "}
              <span className="beta-plants2-card__task-name">
                {nextTask.title}
              </span>
              {nextTask.due_on ? ` (due ${nextTask.due_on})` : ""}
            </span>
          </div>
        )}
        <div className="beta-plants-card__actions">
          <button
            className="folio-button"
            type="button"
            onClick={onDeepLink}
            aria-label={`Open ${name} in My Property`}
          >
            Open ›
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Archived card (grid view) ────────────────────────────────────────────────

function ArchivedCardGrid({
  plant,
  beds,
  zones,
  isSelected,
  onSelect,
  onDeepLink,
}: {
  plant: GardenPlantInstance;
  beds: GardenBed[];
  zones: GardenZone[];
  isSelected: boolean;
  onSelect: () => void;
  onDeepLink: () => void;
}) {
  const name = getCatalogPlantName(plant);
  return (
    <article
      className={`beta-plants-card beta-plants-card--archived beta-plants2-card${isSelected ? " is-selected" : ""}`}
      aria-selected={isSelected}
    >
      <button
        type="button"
        className="beta-plants2-card__select-btn"
        aria-label={`Select ${name}`}
        onClick={onSelect}
      >
        <PlantThumbnail src={getThumbSrc(plant)} alt={name} />
      </button>
      <div className="beta-plants-card__body">
        <div className="beta-plants-card__head">
          <strong className="beta-plants-card__name">{name}</strong>
          <SpecimenLabel>Archived</SpecimenLabel>
        </div>
        {plant.plant_profile?.botanical_name_full && (
          <em className="beta-plants-card__botanical">
            {plant.plant_profile.botanical_name_full}
          </em>
        )}
        <p className="beta-plants-card__context">
          {getZoneName(zones, plant.zone_id)} &middot;{" "}
          {getBedName(beds, plant.bed_id)}
        </p>
        <p className="beta-plants-card__meta">
          {formatQuantity(plant.quantity)} specimen
          {Number(plant.quantity) !== 1 ? "s" : ""}
          {plant.planted_on ? ` · planted ${plant.planted_on}` : ""}
        </p>
        <div className="beta-plants-card__actions">
          <button
            className="folio-button"
            type="button"
            onClick={onDeepLink}
            aria-label={`Open ${name} in My Property`}
          >
            Open ›
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Wishlist card (grid view) ────────────────────────────────────────────────

function WishlistCardGrid({
  item,
  isSelected,
  onSelect,
}: {
  item: GardenWishlistItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const name = getCatalogPlantName(item);
  return (
    <article
      className={`beta-plants-card beta-plants-card--wishlist beta-plants2-card${isSelected ? " is-selected" : ""}`}
      aria-selected={isSelected}
    >
      <button
        type="button"
        className="beta-plants2-card__select-btn"
        aria-label={`Select ${name}`}
        onClick={onSelect}
      >
        <PlantThumbnail src={getThumbSrc(item)} alt={name} />
      </button>
      <div className="beta-plants-card__body">
        <div className="beta-plants-card__head">
          <strong className="beta-plants-card__name">{name}</strong>
          <SpecimenLabel tone="clay">Saved</SpecimenLabel>
        </div>
        {item.plant_profile?.botanical_name_full && (
          <em className="beta-plants-card__botanical">
            {item.plant_profile.botanical_name_full}
          </em>
        )}
        {item.plant_profile?.plant_type_code && (
          <p className="beta-plants-card__context">
            {item.plant_profile.plant_type_code}
          </p>
        )}
        <p className="beta-plants-card__meta">
          {item.notes ?? "Saved from catalogue"}
        </p>
      </div>
    </article>
  );
}

// ─── List-view rows ───────────────────────────────────────────────────────────

function GrowingListRow({
  plant,
  beds,
  zones,
  tasks,
  today,
  isSelected,
  onSelect,
  onDeepLink,
}: {
  plant: GardenPlantInstance;
  beds: GardenBed[];
  zones: GardenZone[];
  tasks: GardenTask[];
  today: string;
  isSelected: boolean;
  onSelect: () => void;
  onDeepLink: () => void;
}) {
  const nextTask = getSoonestTask(plant.id, tasks);
  const urgency = nextTask ? getUrgency(nextTask.due_on, today) : "normal";
  const name = getCatalogPlantName(plant);
  return (
    <tr
      className={`beta-plants2-list-row${isSelected ? " is-selected" : ""}`}
      aria-selected={isSelected}
    >
      <td className="beta-plants2-list-col beta-plants2-list-col--name">
        <button
          type="button"
          className="beta-plants2-list-select-btn"
          onClick={onSelect}
          aria-label={`Select ${name}`}
        >
          {name}
        </button>
        {plant.plant_profile?.botanical_name_full && (
          <span className="beta-plants2-list-botanical">
            {plant.plant_profile.botanical_name_full}
          </span>
        )}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--location">
        {getZoneName(zones, plant.zone_id)} &middot;{" "}
        {getBedName(beds, plant.bed_id)}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--planted">
        {plant.planted_on
          ? formatDaysInGround(plant.planted_on, today)
          : "Date TBD"}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--task">
        {nextTask ? (
          <span className="beta-plants2-list-task">
            <UrgencyMarker urgency={urgency} />
            {nextTask.title}
            {nextTask.due_on ? (
              <span className="beta-plants2-list-task__due">
                {nextTask.due_on}
              </span>
            ) : null}
          </span>
        ) : (
          <span className="beta-plants2-list-empty">—</span>
        )}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--actions">
        <button
          type="button"
          className="folio-button"
          onClick={onDeepLink}
          aria-label={`Open ${name} in My Property`}
        >
          Open ›
        </button>
      </td>
    </tr>
  );
}

function ArchivedListRow({
  plant,
  beds,
  zones,
  today,
  isSelected,
  onSelect,
  onDeepLink,
}: {
  plant: GardenPlantInstance;
  beds: GardenBed[];
  zones: GardenZone[];
  today: string;
  isSelected: boolean;
  onSelect: () => void;
  onDeepLink: () => void;
}) {
  const name = getCatalogPlantName(plant);
  return (
    <tr
      className={`beta-plants2-list-row beta-plants2-list-row--archived${isSelected ? " is-selected" : ""}`}
      aria-selected={isSelected}
    >
      <td className="beta-plants2-list-col beta-plants2-list-col--name">
        <button
          type="button"
          className="beta-plants2-list-select-btn"
          onClick={onSelect}
          aria-label={`Select ${name}`}
        >
          {name}
        </button>
        {plant.plant_profile?.botanical_name_full && (
          <span className="beta-plants2-list-botanical">
            {plant.plant_profile.botanical_name_full}
          </span>
        )}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--location">
        {getZoneName(zones, plant.zone_id)} &middot;{" "}
        {getBedName(beds, plant.bed_id)}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--planted">
        {plant.planted_on
          ? formatDaysInGround(plant.planted_on, today)
          : "—"}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--task">
        <span className="beta-plants2-list-empty">Archived</span>
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--actions">
        <button
          type="button"
          className="folio-button"
          onClick={onDeepLink}
          aria-label={`Open ${name} in My Property`}
        >
          Open ›
        </button>
      </td>
    </tr>
  );
}

function WishlistListRow({
  item,
  isSelected,
  onSelect,
}: {
  item: GardenWishlistItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const name = getCatalogPlantName(item);
  return (
    <tr
      className={`beta-plants2-list-row${isSelected ? " is-selected" : ""}`}
      aria-selected={isSelected}
    >
      <td className="beta-plants2-list-col beta-plants2-list-col--name">
        <button
          type="button"
          className="beta-plants2-list-select-btn"
          onClick={onSelect}
          aria-label={`Select ${name}`}
        >
          {name}
        </button>
        {item.plant_profile?.botanical_name_full && (
          <span className="beta-plants2-list-botanical">
            {item.plant_profile.botanical_name_full}
          </span>
        )}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--location">
        {item.plant_profile?.plant_type_code ?? "—"}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--planted">
        {item.notes ?? "—"}
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--task">
        <span className="beta-plants2-list-empty">Wishlist</span>
      </td>
      <td className="beta-plants2-list-col beta-plants2-list-col--actions">—</td>
    </tr>
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
    <div className="beta-plants2-view-toggle" role="group" aria-label="Card view">
      {(["grid", "list"] as GridView[]).map((v) => (
        <button
          key={v}
          type="button"
          className={`beta-plants2-view-toggle__btn${active === v ? " is-active" : ""}`}
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
}: {
  plants: GardenPlantInstance[];
  tasks: GardenTask[];
  today: string;
  selectedPlant: GardenPlantInstance | null;
  selectedWishlist: GardenWishlistItem | null;
  activeTab: StatusTab;
  beds: GardenBed[];
  zones: GardenZone[];
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
    <div className="beta-drawer__section">
      <SpecimenLabel tone="olive">Garden summary</SpecimenLabel>
      <dl className="beta-detail-list" style={{ marginTop: "var(--space-2)" }}>
        <div className="beta-detail-list__row">
          <dt>Active plants</dt>
          <dd>{growing.length}</dd>
        </div>
        <div className="beta-detail-list__row">
          <dt>Distinct species</dt>
          <dd>{distinctSpecies}</dd>
        </div>
        <div className="beta-detail-list__row">
          <dt>Perennials</dt>
          <dd>{perennialCount}</dd>
        </div>
        <div className="beta-detail-list__row">
          <dt>Annuals</dt>
          <dd>{annualCount}</dd>
        </div>
        <div className="beta-detail-list__row">
          <dt>Beds in use</dt>
          <dd>{bedsWithGrowing}</dd>
        </div>
        {needsAttentionCount > 0 && (
          <div className="beta-detail-list__row">
            <dt>Needs attention</dt>
            <dd>
              <span className="beta-plants2-urgency beta-plants2-urgency--soon">
                {needsAttentionCount}
              </span>
            </dd>
          </div>
        )}
      </dl>

      {(selectedPlant || selectedWishlist) && (
        <div className="beta-plants2-drawer-preview">
          <SpecimenLabel>Selected</SpecimenLabel>
          {selectedPlant && (
            <div className="beta-plants2-drawer-preview__body">
              <strong>{getCatalogPlantName(selectedPlant)}</strong>
              {selectedPlant.plant_profile?.botanical_name_full && (
                <em className="beta-plants2-drawer-preview__botanical">
                  {selectedPlant.plant_profile.botanical_name_full}
                </em>
              )}
              <p>
                {getZoneName(zones, selectedPlant.zone_id)} &middot;{" "}
                {getBedName(beds, selectedPlant.bed_id)}
              </p>
              <p>
                {formatQuantity(selectedPlant.quantity)} growing
                {selectedPlant.planted_on
                  ? ` · planted ${selectedPlant.planted_on}`
                  : ""}
              </p>
            </div>
          )}
          {selectedWishlist && !selectedPlant && (
            <div className="beta-plants2-drawer-preview__body">
              <strong>{getCatalogPlantName(selectedWishlist)}</strong>
              {selectedWishlist.plant_profile?.botanical_name_full && (
                <em className="beta-plants2-drawer-preview__botanical">
                  {selectedWishlist.plant_profile.botanical_name_full}
                </em>
              )}
              <p>{selectedWishlist.notes ?? "Saved from catalogue"}</p>
            </div>
          )}
        </div>
      )}

      {!selectedPlant && !selectedWishlist && (
        <p className="beta-drawer__muted" style={{ marginTop: "var(--space-2)" }}>
          {activeTab === "growing"
            ? "Select a plant card to see details and take action."
            : activeTab === "archived"
            ? "Select an archived plant to restore or open it."
            : "Select a wishlist plant to move it to a bed or remove it."}
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
    <div className="beta-drawer__section">
      <FieldSelect
        label="Zone"
        value={filters.zoneId}
        onChange={setZone}
      >
        <option value="">All zones</option>
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
              {code}
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
        <option value="other">Other</option>
      </FieldSelect>

      <label className="beta-plants2-toggle-row beta-field">
        <span>Needs attention only</span>
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
          Clear filters
        </button>
      )}
    </div>
  );
}

// ─── Drawer: Actions tab ──────────────────────────────────────────────────────

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

  async function handleLogNote(e: FormEvent) {
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
      <div className="beta-drawer__section">
        <form className="beta-form" onSubmit={handleLogNote}>
          <label className="beta-field">
            <span>Log a note</span>
            <textarea
              className="input beta-textarea"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="What did you observe?"
              rows={3}
            />
          </label>
          <button
            className="folio-button"
            type="submit"
            disabled={busy || !noteDraft.trim()}
          >
            Save note
          </button>
        </form>

        <div className="beta-drawer__actions-row" style={{ marginTop: "var(--space-2)" }}>
          {onDeepLink && (
            <button
              type="button"
              className="folio-button"
              onClick={onDeepLink}
              disabled={busy}
            >
              Open in My Property
            </button>
          )}
          <button
            type="button"
            className="folio-button"
            onClick={handleArchive}
            disabled={busy}
          >
            Archive
          </button>
        </div>
      </div>
    );
  }

  // Archived selected
  if (activeTab === "archived" && selectedPlant) {
    return (
      <div className="beta-drawer__section">
        <div className="beta-drawer__actions-row">
          <button
            type="button"
            className="folio-button"
            onClick={handleRestore}
            disabled={busy}
          >
            Restore to growing
          </button>
          {onDeepLink && (
            <button
              type="button"
              className="folio-button"
              onClick={onDeepLink}
              disabled={busy}
            >
              Open in My Property
            </button>
          )}
        </div>
      </div>
    );
  }

  // Wishlist selected
  if (activeTab === "wishlist" && selectedWishlist) {
    return (
      <div className="beta-drawer__section">
        <form className="beta-form" onSubmit={handleMoveToProperty}>
          <SpecimenLabel tone="clay">Move to property</SpecimenLabel>
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
            {busy ? "Moving…" : "Move to bed"}
          </button>
        </form>

        <div className="beta-drawer__actions-row" style={{ marginTop: "var(--space-2)" }}>
          <button
            type="button"
            className="beta-drawer__danger"
            onClick={handleRemoveWishlist}
            disabled={busy}
          >
            Remove from wishlist
          </button>
        </div>
      </div>
    );
  }

  // Nothing selected
  return (
    <div className="beta-drawer__section">
      <p className="beta-drawer__muted">
        {activeTab === "growing" ? (
          <>
            Select a growing plant to log a note, archive it, or open it in
            context.{" "}
            <a className="beta-link-button" href="/app/my-property">
              Add a plant ›
            </a>
          </>
        ) : activeTab === "archived" ? (
          "Select an archived plant to restore or open it."
        ) : (
          "Select a wishlist plant to move it to a bed or remove it."
        )}
      </p>
    </div>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────

function EmptyGrowing() {
  return (
    <div className="beta-plants-empty">
      <SpecimenLabel tone="olive">No plants yet</SpecimenLabel>
      <p>
        No plants growing yet. Add your first plant to a bed to start tracking.
      </p>
      <a className="folio-button" href="/app/my-property">
        Add a plant to a bed
      </a>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="beta-plants-empty">
      <SpecimenLabel tone="clay">Empty wishlist</SpecimenLabel>
      <p>No wishlist plants yet. Save plants you want to try next.</p>
      <a className="folio-button" href="/app/plant-catalogue">
        Browse the plant catalogue
      </a>
    </div>
  );
}

function EmptyArchived() {
  return (
    <div className="beta-plants-empty">
      <SpecimenLabel>No archived plants</SpecimenLabel>
      <p>No archived plants yet. Completed seasons will appear here.</p>
    </div>
  );
}

function EmptyFiltered({ onClear }: { onClear: () => void }) {
  return (
    <div className="beta-plants-empty">
      <SpecimenLabel>No matches</SpecimenLabel>
      <p>No plants match these filters.</p>
      <button type="button" className="folio-button" onClick={onClear}>
        Clear filters
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
}: PlantsViewProps) {
  const router = useRouter();
  const today = getTodayISO();

  // ── Tab / view state ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<StatusTab>("growing");
  const [gridView, setGridView] = useState<GridView>("grid");
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("info");

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
      plants.filter(
        (p) =>
          p.status === "growing" && matchesSearch(p) && matchesFilters(p)
      ),
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
  }

  function selectWishlist(id: string) {
    setSelectedWishlistId((prev) => (prev === id ? null : id));
    setSelectedPlantId(null);
  }

  function clearSelected() {
    setSelectedPlantId(null);
    setSelectedWishlistId(null);
  }

  // Tab change clears selection
  function changeTab(tab: StatusTab) {
    setActiveTab(tab);
    clearSelected();
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

  // ── Render helpers ────────────────────────────────────────────────────────
  function renderGrowingGrid() {
    if (unfilteredGrowingCount === 0) return <EmptyGrowing />;
    if (filteredGrowing.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="beta-plants-card-grid beta-plants2-card-grid">
        {filteredGrowing.map((plant) => (
          <GrowingCardGrid
            key={plant.id}
            plant={plant}
            beds={beds}
            zones={zones}
            tasks={tasks}
            today={today}
            isSelected={selectedPlantId === plant.id}
            onSelect={() => selectPlant(plant.id)}
            onDeepLink={() => deepLinkFor(plant)}
          />
        ))}
      </div>
    );
  }

  function renderGrowingList() {
    if (unfilteredGrowingCount === 0) return <EmptyGrowing />;
    if (filteredGrowing.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="beta-plants2-list-wrap">
        <table className="beta-plants2-list-table" aria-label="Growing plants">
          <thead>
            <tr>
              <th className="beta-plants2-list-th">Plant</th>
              <th className="beta-plants2-list-th">Location</th>
              <th className="beta-plants2-list-th">Time in ground</th>
              <th className="beta-plants2-list-th">Next task</th>
              <th className="beta-plants2-list-th">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGrowing.map((plant) => (
              <GrowingListRow
                key={plant.id}
                plant={plant}
                beds={beds}
                zones={zones}
                tasks={tasks}
                today={today}
                isSelected={selectedPlantId === plant.id}
                onSelect={() => selectPlant(plant.id)}
                onDeepLink={() => deepLinkFor(plant)}
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
      <div className="beta-plants-card-grid beta-plants2-card-grid">
        {filteredArchived.map((plant) => (
          <ArchivedCardGrid
            key={plant.id}
            plant={plant}
            beds={beds}
            zones={zones}
            isSelected={selectedPlantId === plant.id}
            onSelect={() => selectPlant(plant.id)}
            onDeepLink={() => deepLinkFor(plant)}
          />
        ))}
      </div>
    );
  }

  function renderArchivedList() {
    if (unfilteredArchivedCount === 0) return <EmptyArchived />;
    if (filteredArchived.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="beta-plants2-list-wrap">
        <table className="beta-plants2-list-table" aria-label="Archived plants">
          <thead>
            <tr>
              <th className="beta-plants2-list-th">Plant</th>
              <th className="beta-plants2-list-th">Location</th>
              <th className="beta-plants2-list-th">Time in ground</th>
              <th className="beta-plants2-list-th">Status</th>
              <th className="beta-plants2-list-th">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredArchived.map((plant) => (
              <ArchivedListRow
                key={plant.id}
                plant={plant}
                beds={beds}
                zones={zones}
                today={today}
                isSelected={selectedPlantId === plant.id}
                onSelect={() => selectPlant(plant.id)}
                onDeepLink={() => deepLinkFor(plant)}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderWishlistGrid() {
    if (wishlistCount === 0) return <EmptyWishlist />;
    if (filteredWishlist.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="beta-plants-card-grid beta-plants2-card-grid">
        {filteredWishlist.map((item) => (
          <WishlistCardGrid
            key={item.id}
            item={item}
            isSelected={selectedWishlistId === item.id}
            onSelect={() => selectWishlist(item.id)}
          />
        ))}
      </div>
    );
  }

  function renderWishlistList() {
    if (wishlistCount === 0) return <EmptyWishlist />;
    if (filteredWishlist.length === 0) return <EmptyFiltered onClear={clearAll} />;
    return (
      <div className="beta-plants2-list-wrap">
        <table className="beta-plants2-list-table" aria-label="Wishlist">
          <thead>
            <tr>
              <th className="beta-plants2-list-th">Plant</th>
              <th className="beta-plants2-list-th">Type</th>
              <th className="beta-plants2-list-th">Notes</th>
              <th className="beta-plants2-list-th">Status</th>
              <th className="beta-plants2-list-th">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredWishlist.map((item) => (
              <WishlistListRow
                key={item.id}
                item={item}
                isSelected={selectedWishlistId === item.id}
                onSelect={() => selectWishlist(item.id)}
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
    <div className="beta-plants2-layout">
      {/* ── Canvas ────────────────────────────────────────────────────────── */}
      <div className="beta-plants2-canvas">
        {/* Toolbar */}
        <div className="beta-plants-toolbar beta-plants2-toolbar">
          <div className="beta-plants2-toolbar-top">
            <div className="beta-plants-search-wrap">
              <svg
                className="beta-plants-search-icon"
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
                className="beta-plants-search"
                type="search"
                aria-label="Search plants by name, bed, or zone"
                placeholder="Search by name, bed, or zone…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ViewToggle active={gridView} onChange={setGridView} />
          </div>
        </div>

        {/* Status tabs */}
        <div className="beta-plants-tabs" role="tablist" aria-label="Plant status">
          {(
            [
              { id: "growing", label: "Growing", count: growingCount },
              { id: "archived", label: "Archived", count: archivedCount },
              { id: "wishlist", label: "Wishlist", count: wishlistCount },
            ] as const
          ).map(({ id, label, count }) => (
            <button
              key={id}
              role="tab"
              type="button"
              className={`beta-plants-tab${activeTab === id ? " is-active" : ""}`}
              aria-selected={activeTab === id}
              onClick={() => changeTab(id)}
            >
              {label}
              <span className="beta-plants-tab__count">{count}</span>
            </button>
          ))}
        </div>

        {/* Results header */}
        {hasFilters && (
          <div className="beta-plants-results-header">
            <p className="beta-plants-results-count">
              {filteredCount}{" "}
              {activeTab === "wishlist" ? "saved" : "specimen"}
              {filteredCount !== 1 ? "s" : ""}
              {filteredCount !== totalCount && (
                <> &middot; filtered from {totalCount}</>
              )}
            </p>
            <button
              type="button"
              className="beta-plants-clear"
              onClick={clearAll}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Tab panels */}
        {activeTab === "growing" && (
          <div
            role="tabpanel"
            aria-label="Growing plants"
            className="beta-plants-panel"
          >
            {gridView === "grid"
              ? renderGrowingGrid()
              : renderGrowingList()}
          </div>
        )}

        {activeTab === "archived" && (
          <div
            role="tabpanel"
            aria-label="Archived plants"
            className="beta-plants-panel"
          >
            {gridView === "grid"
              ? renderArchivedGrid()
              : renderArchivedList()}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div
            role="tabpanel"
            aria-label="Wishlist"
            className="beta-plants-panel"
          >
            {gridView === "grid"
              ? renderWishlistGrid()
              : renderWishlistList()}
          </div>
        )}
      </div>

      {/* ── Right drawer ──────────────────────────────────────────────────── */}
      <aside className="beta-drawer beta-plants2-drawer" aria-label="Plants utility">
        <div className="beta-drawer__scope">
          <InkStamp tone="olive">Plants</InkStamp>
          <span>
            {selectedPlant
              ? getCatalogPlantName(selectedPlant)
              : selectedWishlist
              ? getCatalogPlantName(selectedWishlist)
              : "My plants"}
          </span>
        </div>

        <div className="beta-drawer__tabs" role="tablist">
          {(["info", "filters", "actions"] as DrawerTab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={drawerTab === tab}
              className={`beta-drawer__tab${drawerTab === tab ? " is-active" : ""}`}
              onClick={() => setDrawerTab(tab)}
            >
              {tab === "info" ? "Info" : tab === "filters" ? "Filters" : "Actions"}
              {tab === "filters" && hasFilters ? (
                <span className="beta-plants2-filter-dot" aria-label="Filters active" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="beta-drawer__body">
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
            />
          )}
          {drawerTab === "filters" && (
            <DrawerFilters
              plants={plants}
              wishlist={wishlist}
              zones={zones}
              beds={beds}
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(EMPTY_FILTERS)}
            />
          )}
          {drawerTab === "actions" && (
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
      </aside>
    </div>
  );
}
