"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { InkStamp, SpecimenLabel } from "@/components/journal-primitives";
import {
  getBedName,
  getPlantName,
  getTodayISO,
  getZoneName,
} from "@/lib/garden-app-helpers";
import type {
  GardenBed,
  GardenPlantInstance,
  GardenProperty,
  GardenTask,
  GardenZone,
} from "@/lib/garden-app-types";
import { generateSuggestions, dueDateISO, type GardenSuggestion } from "@/lib/garden-suggestions";

// ─── Props contract (matches CalendarView call site in private-beta-app.tsx) ──

export type CalendarViewProps = {
  tasks: GardenTask[];
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  updateTaskStatus: (task: GardenTask) => Promise<void>;
  updateTask: (
    id: string,
    patch: Partial<Pick<GardenTask, "title" | "due_on" | "notes">>
  ) => Promise<void>;
  addTask: (input: {
    title: string;
    dueOn: string;
    notes: string;
  }) => Promise<void>;
  season: string | null;
  region: string | null;
  property: GardenProperty | null;
};

// ─── Event type classification ────────────────────────────────────────────────

type EventType =
  | "planting"
  | "watering"
  | "harvest"
  | "maintenance"
  | "inspection"
  | "observation"
  | "other";

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  planting: "Planting",
  watering: "Watering",
  harvest: "Harvest",
  maintenance: "Maintenance",
  inspection: "Inspection",
  observation: "Observation",
  other: "Other",
};

function classifyTask(title: string): EventType {
  const t = title.toLowerCase();
  if (/plant|sow|transplant/.test(t)) return "planting";
  if (/water|irrigat/.test(t)) return "watering";
  if (/harvest|pick/.test(t)) return "harvest";
  if (/prune|mulch|weed|fertiliz|stake|trellis/.test(t)) return "maintenance";
  if (/inspect|check|scout/.test(t)) return "inspection";
  if (/note|observ|log/.test(t)) return "observation";
  return "other";
}

// ─── Date helpers (no external libraries) ────────────────────────────────────

/** Format a local Date as YYYY-MM-DD */
function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Return the Monday of the week containing `date` (local time). */
function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Add `days` calendar days to a Date (returns new Date). */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Format a week range label, e.g. "June 8–14, 2026" */
function weekLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long" });
  const yearFmt = new Intl.DateTimeFormat("en-US", { year: "numeric" });
  const startMonth = monthFmt.format(monday);
  const endMonth = monthFmt.format(sunday);
  const year = yearFmt.format(sunday);
  const startDay = monday.getDate();
  const endDay = sunday.getDate();
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

/** Format a month label, e.g. "June 2026" */
function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Get the first day of the month (local time) */
function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Get the first day of the next month */
function getNextMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

/** Get the Monday on or before the first of the month */
function getMonthGridStart(monthStart: Date): Date {
  return getWeekMonday(monthStart);
}

const WEEKDAY_ABBREVS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Seasonal context ─────────────────────────────────────────────────────────

type SeasonName = "Spring" | "Summer" | "Autumn" | "Winter";

function deriveSeason(month: number): SeasonName {
  // month: 0-indexed (0=Jan)
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

const SEASON_BULLETS: Record<SeasonName, string[]> = {
  Spring: [
    "Start tender seedlings under cover; harden off before planting out.",
    "Prepare beds — top-dress with compost before the soil warms.",
    "Watch for aphids and slugs as temperatures climb.",
  ],
  Summer: [
    "Succession-sow fast crops (radish, lettuce) every two weeks.",
    "Water deeply at the root zone during heat spells.",
    "Watch for heat stress and bolting in leafy greens.",
  ],
  Autumn: [
    "Harvest before the first hard frost; cure squash and roots in a warm spot.",
    "Plant garlic and spring bulbs now for early colour.",
    "Mulch beds to protect soil structure over winter.",
  ],
  Winter: [
    "Order seeds early; popular varieties sell out by February.",
    "Turn and feed the compost pile to keep it active.",
    "Plan crop rotations before the growing season begins.",
  ],
};

const SEASON_SIGNALS: Record<SeasonName, string[]> = {
  Spring: [
    "Soil temperature check: aim for ≥ 10 °C before sowing warm-season crops.",
    "First frost risk easing — watch the extended forecast before planting out.",
  ],
  Summer: [
    "Succession-sow greens every two weeks to avoid a glut-then-gap cycle.",
    "Watch for heat stress: wilting at midday often recovers; wilting at dusk does not.",
  ],
  Autumn: [
    "First frost window approaching — move tender pots under cover.",
    "Cover crops now will feed the soil and suppress weeds all winter.",
  ],
  Winter: [
    "Low light limits growth; prioritise hardy greens in any covered space.",
    "Seed ordering season: plan bed rotations before stock runs low.",
  ],
};

// ─── Shared field helpers ─────────────────────────────────────────────────────

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

// ─── Task context helper ──────────────────────────────────────────────────────

function buildTaskContext(
  task: GardenTask,
  zones: GardenZone[],
  beds: GardenBed[],
  plants: GardenPlantInstance[]
): string {
  const parts: string[] = [];
  if (task.zone_id) parts.push(getZoneName(zones, task.zone_id));
  if (task.bed_id) parts.push(getBedName(beds, task.bed_id));
  if (task.plant_instance_id)
    parts.push(getPlantName(plants, task.plant_instance_id));
  return parts.join(" · ") || "Property";
}

// ─── Task card ────────────────────────────────────────────────────────────────

type TaskCardProps = {
  task: GardenTask;
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  updateTaskStatus: (task: GardenTask) => Promise<void>;
  updateTask: (
    id: string,
    patch: Partial<Pick<GardenTask, "title" | "due_on" | "notes">>
  ) => Promise<void>;
  compact?: boolean;
};

function TaskCard({
  task,
  zones,
  beds,
  plants,
  updateTaskStatus,
  updateTask,
  compact = false,
}: TaskCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rescheduleTo, setRescheduleTo] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);

  const isDone = task.status === "done";
  const eventType = classifyTask(task.title);
  const context = buildTaskContext(task, zones, beds, plants);

  async function handleToggle() {
    setBusy(true);
    try {
      await updateTaskStatus(task);
    } finally {
      setBusy(false);
    }
  }

  async function handlePlusOneWeek() {
    if (!task.due_on) return;
    const newDate = addDays(new Date(task.due_on + "T00:00:00"), 7);
    setBusy(true);
    try {
      await updateTask(task.id, { due_on: toISODate(newDate) });
    } finally {
      setBusy(false);
    }
  }

  async function handleReschedule(e: FormEvent) {
    e.preventDefault();
    if (!rescheduleTo) return;
    setBusy(true);
    try {
      await updateTask(task.id, { due_on: rescheduleTo });
      setShowReschedule(false);
      setRescheduleTo("");
    } finally {
      setBusy(false);
    }
  }

  function handleDeepLink() {
    const params = new URLSearchParams();
    if (task.zone_id) params.set("zone", task.zone_id);
    if (task.bed_id) params.set("bed", task.bed_id);
    if (task.plant_instance_id) params.set("plant", task.plant_instance_id);
    const qs = params.toString();
    router.push(`/app/my-property${qs ? `?${qs}` : ""}`);
  }

  return (
    <article
      className={`beta-cal2-card${isDone ? " beta-cal2-card--done" : ""}${compact ? " beta-cal2-card--compact" : ""}`}
    >
      <div className="beta-cal2-card__top">
        <button
          className={`beta-cal2-card__check${isDone ? " is-checked" : ""}`}
          type="button"
          aria-label={isDone ? "Reopen task" : "Complete task"}
          disabled={busy}
          onClick={handleToggle}
        />
        <div className="beta-cal2-card__body">
          <span className="beta-cal2-card__title">{task.title}</span>
          <span className="beta-cal2-card__context">{context}</span>
        </div>
        <span className={`beta-cal2-type-tag beta-cal2-type-tag--${eventType}`}>
          {EVENT_TYPE_LABELS[eventType]}
        </span>
      </div>

      {!compact && task.notes ? (
        <p className="beta-cal2-card__notes">{task.notes}</p>
      ) : null}

      <div className="beta-cal2-card__footer">
        {task.due_on ? (
          <span className="beta-cal2-card__due">{task.due_on}</span>
        ) : null}
        <div className="beta-cal2-card__actions">
          {!compact && !isDone && task.due_on ? (
            <button
              className="folio-button beta-cal2-card__btn"
              type="button"
              aria-label="Reschedule +1 week"
              disabled={busy}
              onClick={handlePlusOneWeek}
            >
              +1 wk
            </button>
          ) : null}
          {!compact && !isDone ? (
            <button
              className="folio-button beta-cal2-card__btn"
              type="button"
              disabled={busy}
              onClick={() => setShowReschedule((v) => !v)}
            >
              Reschedule
            </button>
          ) : null}
          <button
            className="folio-button beta-cal2-card__btn"
            type="button"
            onClick={handleDeepLink}
          >
            {compact ? "Open ›" : "Open in My Property"}
          </button>
        </div>
      </div>

      {!compact && showReschedule && !isDone ? (
        <form
          className="beta-cal2-card__reschedule"
          onSubmit={handleReschedule}
        >
          <label className="beta-field">
            <span>New due date</span>
            <input
              className="input"
              type="date"
              value={rescheduleTo}
              onChange={(e) => setRescheduleTo(e.target.value)}
              required
            />
          </label>
          <button className="folio-button" type="submit" disabled={busy}>
            Set date
          </button>
        </form>
      ) : null}
    </article>
  );
}

// ─── Seasonal context strip ───────────────────────────────────────────────────

type SeasonStripProps = {
  season: string | null;
  region: string | null;
};

function SeasonStrip({ season, region }: SeasonStripProps) {
  const today = new Date();
  // The date-derived season is authoritative for the guidance bullets, so the
  // headline matches them. The grower's own stated season is shown as context.
  const derived = deriveSeason(today.getMonth());
  const bullets = SEASON_BULLETS[derived];
  const userSeason = season?.trim();
  const showUserSeason = Boolean(userSeason) && userSeason!.toLowerCase() !== derived.toLowerCase();

  return (
    <div className="beta-cal2-season-strip">
      <div className="beta-cal2-season-strip__head">
        <SpecimenLabel tone="olive">{derived}</SpecimenLabel>
        {showUserSeason ? (
          <span className="beta-cal2-season-strip__region">you noted: {userSeason}</span>
        ) : null}
        {region ? (
          <span className="beta-cal2-season-strip__region">{region}</span>
        ) : null}
      </div>
      <ul className="beta-cal2-season-strip__bullets">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

// ─── View toggle ──────────────────────────────────────────────────────────────

type CalView = "week" | "month";

type ViewToggleProps = {
  active: CalView;
  onChange: (view: CalView) => void;
};

function ViewToggle({ active, onChange }: ViewToggleProps) {
  return (
    <div className="beta-cal2-view-toggle" role="group" aria-label="Calendar view">
      {(["week", "month"] as CalView[]).map((v) => (
        <button
          key={v}
          type="button"
          className={`beta-cal2-view-toggle__btn${active === v ? " is-active" : ""}`}
          aria-pressed={active === v}
          onClick={() => onChange(v)}
        >
          {v === "week" ? "Week" : "Month"}
        </button>
      ))}
    </div>
  );
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

const ALL_EVENT_TYPES: EventType[] = [
  "planting",
  "watering",
  "harvest",
  "maintenance",
  "inspection",
  "observation",
  "other",
];

type FilterState = {
  zoneId: string;
  bedId: string;
  plantId: string;
  eventTypes: Set<EventType>;
  status: "open" | "done" | "all";
};

type FilterChipsProps = {
  filterState: FilterState;
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  onChange: (next: FilterState) => void;
};

function FilterChips({
  filterState,
  zones,
  beds,
  plants,
  onChange,
}: FilterChipsProps) {
  const { zoneId, bedId, plantId, eventTypes, status } = filterState;

  const growingPlants = plants.filter((p) => p.status === "growing");

  // Beds in the selected zone (or all beds)
  const availableBeds = zoneId
    ? beds.filter((b) => b.zone_id === zoneId)
    : beds;

  // Plants in the selected bed (or all growing plants)
  const availablePlants = bedId
    ? growingPlants.filter((p) => p.bed_id === bedId)
    : growingPlants;

  const hasActiveFilters =
    zoneId !== "" ||
    bedId !== "" ||
    plantId !== "" ||
    eventTypes.size < ALL_EVENT_TYPES.length ||
    status !== "open";

  function clearAll() {
    onChange({
      zoneId: "",
      bedId: "",
      plantId: "",
      eventTypes: new Set(ALL_EVENT_TYPES),
      status: "open",
    });
  }

  function setZone(id: string) {
    onChange({ ...filterState, zoneId: id, bedId: "", plantId: "" });
  }

  function setBed(id: string) {
    const bed = beds.find((b) => b.id === id);
    onChange({
      ...filterState,
      zoneId: bed ? bed.zone_id : filterState.zoneId,
      bedId: id,
      plantId: "",
    });
  }

  function setPlant(id: string) {
    const plant = plants.find((p) => p.id === id);
    const bed = plant ? beds.find((b) => b.id === plant.bed_id) : null;
    onChange({
      ...filterState,
      zoneId: bed ? bed.zone_id : filterState.zoneId,
      bedId: plant ? plant.bed_id : filterState.bedId,
      plantId: id,
    });
  }

  function toggleEventType(et: EventType) {
    const next = new Set(eventTypes);
    if (next.has(et)) {
      next.delete(et);
    } else {
      next.add(et);
    }
    onChange({ ...filterState, eventTypes: next });
  }

  return (
    <div className="beta-cal2-filters">
      {/* Spatial path */}
      <div className="beta-cal2-filters__row">
        <SpecimenLabel>Location</SpecimenLabel>
        <label className="beta-field beta-cal2-filters__select">
          <span className="sr-only">Zone</span>
          <select
            className="input"
            value={zoneId}
            onChange={(e) => setZone(e.target.value)}
            aria-label="Filter by zone"
          >
            <option value="">All zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </label>
        <label className="beta-field beta-cal2-filters__select">
          <span className="sr-only">Bed</span>
          <select
            className="input"
            value={bedId}
            onChange={(e) => setBed(e.target.value)}
            aria-label="Filter by bed"
          >
            <option value="">All beds</option>
            {availableBeds.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label className="beta-field beta-cal2-filters__select">
          <span className="sr-only">Plant</span>
          <select
            className="input"
            value={plantId}
            onChange={(e) => setPlant(e.target.value)}
            aria-label="Filter by plant"
          >
            <option value="">All plants</option>
            {availablePlants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.plant_profile?.display_name ?? "Unknown plant"}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Event type chips */}
      <div className="beta-cal2-filters__row">
        <SpecimenLabel>Type</SpecimenLabel>
        <div className="beta-cal2-filters__chips">
          {ALL_EVENT_TYPES.map((et) => (
            <button
              key={et}
              type="button"
              className={`beta-chip${eventTypes.has(et) ? " is-active" : ""}`}
              onClick={() => toggleEventType(et)}
              aria-pressed={eventTypes.has(et)}
            >
              {EVENT_TYPE_LABELS[et]}
            </button>
          ))}
        </div>
      </div>

      {/* Status chips */}
      <div className="beta-cal2-filters__row">
        <SpecimenLabel>Status</SpecimenLabel>
        <div className="beta-cal2-filters__chips">
          {(["open", "done", "all"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`beta-chip${status === s ? " is-active" : ""}`}
              aria-pressed={status === s}
              onClick={() => onChange({ ...filterState, status: s })}
            >
              {s === "open" ? "Open" : s === "done" ? "Completed" : "All"}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters ? (
        <button
          className="folio-button beta-cal2-filters__clear"
          type="button"
          onClick={clearAll}
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

// ─── Task filter logic ────────────────────────────────────────────────────────

function applyFilters(
  tasks: GardenTask[],
  filterState: FilterState
): GardenTask[] {
  return tasks.filter((task) => {
    // Status
    if (filterState.status === "open" && task.status !== "open") return false;
    if (filterState.status === "done" && task.status !== "done") return false;

    // Spatial
    if (filterState.zoneId && task.zone_id !== filterState.zoneId) return false;
    if (filterState.bedId && task.bed_id !== filterState.bedId) return false;
    if (
      filterState.plantId &&
      task.plant_instance_id !== filterState.plantId
    )
      return false;

    // Event type
    const et = classifyTask(task.title);
    if (!filterState.eventTypes.has(et)) return false;

    return true;
  });
}

// ─── Week view ────────────────────────────────────────────────────────────────

type WeekViewProps = {
  weekMonday: Date;
  todayISO: string;
  filteredTasks: GardenTask[];
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  updateTaskStatus: (task: GardenTask) => Promise<void>;
  updateTask: (
    id: string,
    patch: Partial<Pick<GardenTask, "title" | "due_on" | "notes">>
  ) => Promise<void>;
};

function WeekView({
  weekMonday,
  todayISO,
  filteredTasks,
  zones,
  beds,
  plants,
  updateTaskStatus,
  updateTask,
}: WeekViewProps) {
  const weekSunday = addDays(weekMonday, 6);
  const weekMondayISO = toISODate(weekMonday);
  const weekSundayISO = toISODate(weekSunday);

  // Bucket tasks into 7 day columns (Mon=0 … Sun=6)
  const weekDayTasks: GardenTask[][] = [[], [], [], [], [], [], []];
  for (const task of filteredTasks) {
    if (!task.due_on) continue;
    if (task.due_on < weekMondayISO || task.due_on > weekSundayISO) continue;
    const dayDate = new Date(task.due_on + "T00:00:00");
    const colIndex = (dayDate.getDay() + 6) % 7;
    weekDayTasks[colIndex].push(task);
  }

  return (
    <div className="beta-cal2-week-grid">
      {WEEKDAY_ABBREVS.map((abbrev, i) => {
        const colDate = addDays(weekMonday, i);
        const iso = toISODate(colDate);
        const isToday = iso === todayISO;
        const dayTasks = weekDayTasks[i];
        return (
          <div
            key={abbrev}
            className={`beta-cal2-day-col${isToday ? " beta-cal2-day-col--today" : ""}`}
          >
            <div className="beta-cal2-day-col__head">
              <span className="beta-cal2-day-abbrev">{abbrev}</span>
              <strong
                className={`beta-cal2-day-num${isToday ? " beta-cal2-day-num--today" : ""}`}
              >
                {colDate.getDate()}
              </strong>
            </div>
            <div className="beta-cal2-day-col__entries">
              {dayTasks.length === 0 ? (
                <p className="beta-cal2-empty-day">—</p>
              ) : (
                dayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    zones={zones}
                    beds={beds}
                    plants={plants}
                    updateTaskStatus={updateTaskStatus}
                    updateTask={updateTask}
                    compact
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Month view ───────────────────────────────────────────────────────────────

type MonthViewProps = {
  focusDate: Date;
  todayISO: string;
  filteredTasks: GardenTask[];
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  updateTaskStatus: (task: GardenTask) => Promise<void>;
  updateTask: (
    id: string,
    patch: Partial<Pick<GardenTask, "title" | "due_on" | "notes">>
  ) => Promise<void>;
  onJumpToWeek: (monday: Date) => void;
};

function MonthView({
  focusDate,
  todayISO,
  filteredTasks,
  zones,
  beds,
  plants,
  updateTaskStatus,
  updateTask,
  onJumpToWeek,
}: MonthViewProps) {
  const [selectedDayISO, setSelectedDayISO] = useState<string | null>(null);

  const monthStart = getMonthStart(focusDate);
  const nextMonthStart = getNextMonthStart(focusDate);
  const gridStart = getMonthGridStart(monthStart);

  // Build all day cells for the grid
  const dayCells: Date[] = [];
  let cursor = new Date(gridStart);
  while (cursor < nextMonthStart || dayCells.length % 7 !== 0) {
    dayCells.push(new Date(cursor));
    cursor = addDays(cursor, 1);
    if (dayCells.length > 42) break; // safety: max 6 weeks
  }

  // Group days into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < dayCells.length; i += 7) {
    weeks.push(dayCells.slice(i, i + 7));
  }

  // Build a map of ISO date → tasks
  const tasksByDay = new Map<string, GardenTask[]>();
  for (const task of filteredTasks) {
    if (!task.due_on) continue;
    const existing = tasksByDay.get(task.due_on) ?? [];
    existing.push(task);
    tasksByDay.set(task.due_on, existing);
  }

  const selectedDayTasks = selectedDayISO
    ? (tasksByDay.get(selectedDayISO) ?? [])
    : [];

  const isInMonth = (d: Date) =>
    d.getMonth() === monthStart.getMonth() &&
    d.getFullYear() === monthStart.getFullYear();

  return (
    <div className="beta-cal2-month">
      {/* Day-of-week header */}
      <div className="beta-cal2-month-header">
        {WEEKDAY_ABBREVS.map((a) => (
          <div key={a} className="beta-cal2-month-header__cell">
            {a}
          </div>
        ))}
      </div>

      {/* Week rows */}
      <div className="beta-cal2-month-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="beta-cal2-month-week">
            <button
              className="beta-cal2-month-week__label"
              type="button"
              title={`Go to week of ${toISODate(week[0])}`}
              aria-label={`Jump to week view for week of ${toISODate(week[0])}`}
              onClick={() => onJumpToWeek(week[0])}
            >
              W{wi + 1}
            </button>
            {week.map((day) => {
              const iso = toISODate(day);
              const dayTasks = tasksByDay.get(iso) ?? [];
              const isToday = iso === todayISO;
              const inMonth = isInMonth(day);
              const isSelected = iso === selectedDayISO;
              return (
                <button
                  key={iso}
                  type="button"
                  className={[
                    "beta-cal2-month-day",
                    isToday ? "beta-cal2-month-day--today" : "",
                    !inMonth ? "beta-cal2-month-day--out" : "",
                    isSelected ? "beta-cal2-month-day--selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-label={`${iso}${dayTasks.length ? `, ${dayTasks.length} task${dayTasks.length === 1 ? "" : "s"}` : ""}`}
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedDayISO(iso === selectedDayISO ? null : iso)
                  }
                >
                  <span className="beta-cal2-month-day__num">
                    {day.getDate()}
                  </span>
                  {dayTasks.length > 0 ? (
                    <span className="beta-cal2-month-day__count">
                      {dayTasks.length}
                    </span>
                  ) : null}
                  {dayTasks.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className={`beta-cal2-month-day__dot beta-cal2-month-day__dot--${classifyTask(t.title)}`}
                      aria-hidden="true"
                    />
                  ))}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected day tasks */}
      {selectedDayISO ? (
        <div className="beta-cal2-month-detail">
          <div className="beta-cal2-month-detail__head">
            <SpecimenLabel tone="clay">{selectedDayISO}</SpecimenLabel>
            {selectedDayTasks.length === 0 ? (
              <span className="beta-cal2-empty-day">No tasks on this day.</span>
            ) : null}
          </div>
          <div className="beta-cal2-month-detail__cards">
            {selectedDayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                zones={zones}
                beds={beds}
                plants={plants}
                updateTaskStatus={updateTaskStatus}
                updateTask={updateTask}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Right column: Insights rail ──────────────────────────────────────────────

type InsightsRailProps = {
  allTasks: GardenTask[];
  todayISO: string;
  season: SeasonName;
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  addTask: (input: {
    title: string;
    dueOn: string;
    notes: string;
  }) => Promise<void>;
  property: GardenProperty | null;
};

function InsightsRail({
  allTasks,
  todayISO,
  season,
  zones,
  beds,
  plants,
  addTask,
  property,
}: InsightsRailProps) {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState(getTodayISO());
  const [adding, setAdding] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Upcoming = open tasks due within the next 14 days
  const in14ISO = toISODate(addDays(new Date(todayISO + "T00:00:00"), 14));
  const upcoming = allTasks
    .filter(
      (t) =>
        t.status === "open" &&
        t.due_on &&
        t.due_on >= todayISO &&
        t.due_on <= in14ISO
    )
    .sort((a, b) => (a.due_on ?? "").localeCompare(b.due_on ?? ""))
    .slice(0, 8);

  const undated = allTasks
    .filter((t) => t.status === "open" && !t.due_on)
    .slice(0, 6);

  const existingTaskTitles = allTasks.filter((t) => t.status === "open").map((t) => t.title);
  const suggestions = generateSuggestions({
    focus: "property",
    property,
    zone: null,
    bed: null,
    plant: null,
    zones,
    beds,
    plants,
    season,
    existingTaskTitles,
  }).filter((s) => !dismissed.has(s.id));

  const acceptSuggestion = (s: GardenSuggestion) => {
    void addTask({ title: s.taskTitle, dueOn: dueDateISO(s.dueInDays), notes: s.rationale });
    setDismissed((prev) => new Set(prev).add(s.id));
  };

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setAdding(true);
    try {
      await addTask({ title: taskTitle.trim(), dueOn: taskDue, notes: "" });
      setTaskTitle("");
      setTaskDue(getTodayISO());
    } finally {
      setAdding(false);
    }
  }

  function deepLinkForTask(task: GardenTask): string {
    const params = new URLSearchParams();
    if (task.zone_id) params.set("zone", task.zone_id);
    if (task.bed_id) params.set("bed", task.bed_id);
    if (task.plant_instance_id) params.set("plant", task.plant_instance_id);
    const qs = params.toString();
    return `/app/my-property${qs ? `?${qs}` : ""}`;
  }

  return (
    <aside className="beta-cal2-rail">
      {/* Upcoming */}
      <section className="beta-cal2-rail__section">
        <SpecimenLabel tone="olive">Upcoming (14 days)</SpecimenLabel>
        {upcoming.length === 0 ? (
          <p className="beta-cal2-rail__empty">
            No tasks due in the next 14 days.
          </p>
        ) : (
          <ul className="beta-cal2-upcoming-list">
            {upcoming.map((task) => (
              <li key={task.id} className="beta-cal2-upcoming-item">
                <span className="beta-cal2-upcoming-item__due">
                  {task.due_on}
                </span>
                <span className="beta-cal2-upcoming-item__title">
                  {task.title}
                </span>
                <span className="beta-cal2-upcoming-item__ctx">
                  {buildTaskContext(task, zones, beds, plants)}
                </span>
                <button
                  className="beta-link-button"
                  type="button"
                  onClick={() => router.push(deepLinkForTask(task))}
                >
                  Open
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Undated tasks — open tasks with no date set */}
      {undated.length > 0 ? (
        <section className="beta-cal2-rail__section">
          <SpecimenLabel tone="clay">Undated</SpecimenLabel>
          <ul className="beta-cal2-upcoming-list">
            {undated.map((task) => (
              <li key={task.id} className="beta-cal2-upcoming-item">
                <span className="beta-cal2-upcoming-item__due">no date</span>
                <span className="beta-cal2-upcoming-item__title">{task.title}</span>
                <span className="beta-cal2-upcoming-item__ctx">{buildTaskContext(task, zones, beds, plants)}</span>
                <button className="beta-link-button" type="button" onClick={() => router.push(deepLinkForTask(task))}>
                  Open
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Suggested for you — heuristic, plant + season derived */}
      <section className="beta-cal2-rail__section">
        <SpecimenLabel tone="olive">Suggested for you</SpecimenLabel>
        {suggestions.length === 0 ? (
          <p className="beta-cal2-rail__empty">No new suggestions right now.</p>
        ) : (
          <div className="beta-ideas">
            {suggestions.map((s) => (
              <article className={`beta-idea beta-idea--${s.type}`} key={s.id}>
                <div className="beta-idea__head">
                  <span className="beta-idea__type">{s.type}</span>
                  <span className="beta-idea__confidence">{s.confidence} confidence</span>
                </div>
                <strong className="beta-idea__title">{s.title}</strong>
                <p className="beta-idea__why">
                  <span>Why:</span> {s.rationale}
                </p>
                <div className="beta-idea__actions">
                  <button className="button" type="button" onClick={() => acceptSuggestion(s)}>
                    Add as task
                  </button>
                  <button className="folio-button" type="button" onClick={() => setDismissed((prev) => new Set(prev).add(s.id))}>
                    Not now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Locked: WeatherIQ */}
      <section className="beta-cal2-locked-card">
        <div className="beta-cal2-locked-card__head">
          <InkStamp tone="charcoal">Premium</InkStamp>
          <span className="beta-cal2-locked-card__lock" aria-hidden="true">
            ⌀
          </span>
        </div>
        <strong className="beta-cal2-locked-card__name">WeatherIQ</strong>
        <p className="beta-cal2-locked-card__benefit">
          Frost &amp; heat-risk alerts on your week — coming with WeatherIQ.
        </p>
      </section>

      {/* Locked: HarvestIQ */}
      <section className="beta-cal2-locked-card">
        <div className="beta-cal2-locked-card__head">
          <InkStamp tone="charcoal">Premium</InkStamp>
          <span className="beta-cal2-locked-card__lock" aria-hidden="true">
            ⌀
          </span>
        </div>
        <strong className="beta-cal2-locked-card__name">HarvestIQ</strong>
        <p className="beta-cal2-locked-card__benefit">
          Know when each bed is ready to pick — coming with HarvestIQ.
        </p>
      </section>

      {/* Actions: quick-add task */}
      <section className="beta-cal2-rail__section">
        <SpecimenLabel>Add a task</SpecimenLabel>
        <form className="beta-form beta-form--compact" onSubmit={handleAddTask}>
          <FieldText
            label="Task title"
            required
            value={taskTitle}
            placeholder="Stake tomatoes"
            onChange={setTaskTitle}
          />
          <FieldText
            label="Due date"
            type="date"
            value={taskDue}
            onChange={setTaskDue}
          />
          <button className="button" type="submit" disabled={adding}>
            {adding ? "Adding…" : "Add task"}
          </button>
        </form>
      </section>
    </aside>
  );
}

// ─── Main CalendarView component ──────────────────────────────────────────────

export function CalendarView({
  tasks,
  zones,
  beds,
  plants,
  updateTaskStatus,
  updateTask,
  addTask,
  season,
  region,
  property,
}: CalendarViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = toISODate(today);

  // View mode: week | month
  const [calView, setCalView] = useState<CalView>("week");

  // Week navigation
  const [weekMonday, setWeekMonday] = useState<Date>(() =>
    getWeekMonday(today)
  );

  // Month navigation (independent from week; stays in sync when jumping)
  const [monthFocus, setMonthFocus] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // Filters
  const [filterState, setFilterState] = useState<FilterState>({
    zoneId: "",
    bedId: "",
    plantId: "",
    eventTypes: new Set(ALL_EVENT_TYPES),
    status: "open",
  });

  // Derive season name for signals/bullets
  const derivedSeason = deriveSeason(today.getMonth());

  // Filtered task set
  const filteredTasks = applyFilters(tasks, filterState);

  // Navigation
  function goToToday() {
    setWeekMonday(getWeekMonday(today));
    setMonthFocus(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function goPrev() {
    if (calView === "week") {
      setWeekMonday((d) => addDays(d, -7));
    } else {
      setMonthFocus((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
  }

  function goNext() {
    if (calView === "week") {
      setWeekMonday((d) => addDays(d, 7));
    } else {
      setMonthFocus((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }
  }

  function handleJumpToWeek(monday: Date) {
    setWeekMonday(monday);
    setCalView("week");
  }

  // Current label
  const navLabel =
    calView === "week" ? weekLabel(weekMonday) : monthLabel(monthFocus);

  // Empty states
  const hasNoTasksAtAll = tasks.length === 0;
  const filtersHideAll = !hasNoTasksAtAll && filteredTasks.length === 0;

  return (
    <div className="beta-cal2-layout">
      {/* Left / center column */}
      <div className="beta-cal2-main">
        {/* Seasonal strip */}
        <SeasonStrip season={season} region={region} />

        {/* Header: view toggle + nav */}
        <div className="beta-cal2-toolbar">
          <ViewToggle active={calView} onChange={setCalView} />
          <nav className="beta-cal2-nav" aria-label="Calendar navigation">
            <button
              className="folio-button beta-cal2-nav__btn"
              type="button"
              onClick={goPrev}
              aria-label={calView === "week" ? "Previous week" : "Previous month"}
            >
              ‹ Prev
            </button>
            <button
              className="folio-button beta-cal2-nav__btn beta-cal2-nav__btn--today"
              type="button"
              onClick={goToToday}
            >
              Today
            </button>
            <button
              className="folio-button beta-cal2-nav__btn"
              type="button"
              onClick={goNext}
              aria-label={calView === "week" ? "Next week" : "Next month"}
            >
              Next ›
            </button>
          </nav>
          <h2 className="beta-cal2-period-label">{navLabel}</h2>
        </div>

        {/* Filter chips */}
        <FilterChips
          filterState={filterState}
          zones={zones}
          beds={beds}
          plants={plants}
          onChange={setFilterState}
        />

        {/* Empty states */}
        {hasNoTasksAtAll ? (
          <div className="beta-cal2-empty-state">
            <p>
              No tasks yet. Add plants to your beds to generate a seasonal
              schedule.
            </p>
            <a className="folio-button" href="/app/my-property">
              Go to My Property
            </a>
          </div>
        ) : filtersHideAll ? (
          <div className="beta-cal2-empty-state">
            <p>No tasks match these filters.</p>
            <button
              className="folio-button"
              type="button"
              onClick={() =>
                setFilterState({
                  zoneId: "",
                  bedId: "",
                  plantId: "",
                  eventTypes: new Set(ALL_EVENT_TYPES),
                  status: "open",
                })
              }
            >
              Clear filters
            </button>
          </div>
        ) : null}

        {/* Timeline */}
        {!hasNoTasksAtAll && !filtersHideAll ? (
          <>
            {calView === "week" ? (
              <WeekView
                weekMonday={weekMonday}
                todayISO={todayISO}
                filteredTasks={filteredTasks}
                zones={zones}
                beds={beds}
                plants={plants}
                updateTaskStatus={updateTaskStatus}
                updateTask={updateTask}
              />
            ) : (
              <MonthView
                focusDate={monthFocus}
                todayISO={todayISO}
                filteredTasks={filteredTasks}
                zones={zones}
                beds={beds}
                plants={plants}
                updateTaskStatus={updateTaskStatus}
                updateTask={updateTask}
                onJumpToWeek={handleJumpToWeek}
              />
            )}
          </>
        ) : null}
      </div>

      {/* Right column */}
      <InsightsRail
        allTasks={tasks}
        todayISO={todayISO}
        season={derivedSeason}
        zones={zones}
        beds={beds}
        plants={plants}
        addTask={addTask}
        property={property}
      />
    </div>
  );
}
