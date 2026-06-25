"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SpecimenLabel } from "@/components/journal-primitives";
import {
  formatGardenDate,
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
import {
  dueDateISO,
  formatSuggestionWindowLabel,
  generateSuggestions,
  type GardenSuggestion
} from "@/lib/garden-suggestions";

// ─── Props contract (matches CalendarView call site in garden-app.tsx) ──

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
  isReadOnly?: boolean;
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
  watering: "Water",
  harvest: "Harvest",
  maintenance: "Care",
  inspection: "Check",
  observation: "Note",
  other: "General",
};

function classifyTask(title: string): EventType {
  const t = title.toLowerCase();
  if (/plant|sow|transplant/.test(t)) return "planting";
  if (/water|irrigat/.test(t)) return "watering";
  if (/harvest|pick/.test(t)) return "harvest";
  if (/prune|trim|deadhead|pinch|mulch|compost|weed|fertiliz|stake|trellis/.test(t)) return "maintenance";
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
    "Start tender seedlings under cover, then harden them off before they go outside.",
    "Top-dress beds with compost before the soil warms.",
    "Check leaves for aphids and tender starts for slug damage.",
  ],
  Summer: [
    "Sow small batches of quick crops every couple of weeks.",
    "Water deeply at the root zone during heat spells.",
    "Check leafy greens for bolting and heat stress.",
  ],
  Autumn: [
    "Harvest tender crops before the first hard frost.",
    "Plant garlic and spring bulbs for an early start next year.",
    "Mulch open beds to protect the soil over winter.",
  ],
  Winter: [
    "Order seeds early while favorite varieties are still available.",
    "Turn and feed the compost pile when weather allows.",
    "Plan bed rotations before planting starts again.",
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
    <label className="garden-field">
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
  const zoneName = task.zone_id ? getZoneName(zones, task.zone_id) : "";
  const bedName = task.bed_id ? getBedName(beds, task.bed_id) : "";
  const plantName = task.plant_instance_id
    ? getPlantName(plants, task.plant_instance_id)
    : "";

  if (plantName && bedName && zoneName) {
    return `${plantName} in ${bedName}, ${zoneName}`;
  }
  if (plantName && bedName) return `${plantName} in ${bedName}`;
  if (plantName && zoneName) return `${plantName} in ${zoneName}`;
  if (bedName && zoneName) return `${bedName} in ${zoneName}`;
  return plantName || bedName || zoneName || "Garden";
}

// ─── Task card ────────────────────────────────────────────────────────────────

type TaskCardProps = {
  task: GardenTask;
  todayISO?: string;
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  updateTaskStatus: (task: GardenTask) => Promise<void>;
  updateTask: (
    id: string,
    patch: Partial<Pick<GardenTask, "title" | "due_on" | "notes">>
  ) => Promise<void>;
  compact?: boolean;
  featured?: boolean;
  isReadOnly?: boolean;
};

function TaskCard({
  task,
  todayISO,
  zones,
  beds,
  plants,
  updateTaskStatus,
  updateTask,
  compact = false,
  featured = false,
  isReadOnly = false,
}: TaskCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rescheduleTo, setRescheduleTo] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);

  const isDone = task.status === "done";
  const isOverdue = !isDone && Boolean(todayISO) && Boolean(task.due_on) && (task.due_on ?? "") < todayISO!;
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
      className={`garden-cal2-card${isDone ? " garden-cal2-card--done" : ""}${compact ? " garden-cal2-card--compact" : ""}${featured ? " garden-cal2-card--featured" : ""}`}
    >
      <div className="garden-cal2-card__top">
        {isReadOnly ? (
          <span className={`garden-cal2-card__check${isDone ? " is-checked" : ""}`} aria-hidden="true" />
        ) : (
          <button
            className={`garden-cal2-card__check${isDone ? " is-checked" : ""}`}
            type="button"
            aria-label={isDone ? "Put care back in the plan" : "Mark care done"}
            disabled={busy}
            onClick={handleToggle}
          />
        )}
        <div className="garden-cal2-card__body">
          <span className="garden-cal2-card__title">{task.title}</span>
          <span className="garden-cal2-card__context">{context}</span>
        </div>
        <span className={`garden-cal2-type-tag garden-cal2-type-tag--${eventType}`}>
          {EVENT_TYPE_LABELS[eventType]}
        </span>
      </div>

      {!compact && task.notes ? (
        <p className="garden-cal2-card__notes">{task.notes}</p>
      ) : null}

      <div className="garden-cal2-card__footer">
        {task.due_on ? (
          <span className="garden-cal2-card__due">{formatGardenDate(task.due_on)}</span>
        ) : null}
        {isOverdue ? (
          <span className="garden-timeline__badge garden-timeline__badge--overdue">Overdue</span>
        ) : null}
        {isReadOnly ? null : (
          <div className="garden-cal2-card__actions">
            {!compact && !isDone && task.due_on ? (
              <button
                className="folio-button garden-cal2-card__btn"
                type="button"
                aria-label="Move one week later"
                disabled={busy}
                onClick={handlePlusOneWeek}
              >
                +1 week
              </button>
            ) : null}
            {!compact && !isDone ? (
              <button
                className="folio-button garden-cal2-card__btn"
                type="button"
                disabled={busy}
                onClick={() => setShowReschedule((v) => !v)}
              >
                Reschedule
              </button>
            ) : null}
            <button
              className="folio-button garden-cal2-card__btn"
              type="button"
              onClick={handleDeepLink}
            >
              {compact ? "Show" : "Show in My Garden"}
            </button>
          </div>
        )}
      </div>

      {!isReadOnly && !compact && showReschedule && !isDone ? (
        <form
          className="garden-cal2-card__reschedule"
          onSubmit={handleReschedule}
        >
          <label className="garden-field">
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
    <div className="garden-cal2-season-strip">
      <div className="garden-cal2-season-strip__head">
        <SpecimenLabel tone="olive">This season</SpecimenLabel>
        <span className="garden-cal2-season-strip__region">{derived}</span>
        {showUserSeason ? (
          <span className="garden-cal2-season-strip__region">Your season: {userSeason}</span>
        ) : null}
        {region ? (
          <span className="garden-cal2-season-strip__region">{region}</span>
        ) : null}
      </div>
      <ul className="garden-cal2-season-strip__bullets">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
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
  const [expanded, setExpanded] = useState(false);
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

  const activeFilterCount = [
    zoneId,
    bedId,
    plantId,
    eventTypes.size < ALL_EVENT_TYPES.length ? "type" : "",
    status !== "open" ? "status" : "",
  ].filter(Boolean).length;

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
    <section className={`garden-cal2-filters${expanded ? " is-expanded" : ""}`}>
      <div className="garden-cal2-filters__summary">
        <div>
          <SpecimenLabel>Show only</SpecimenLabel>
          <p>
            {hasActiveFilters
              ? `${activeFilterCount} choice${activeFilterCount === 1 ? "" : "s"} active`
              : "All care shown"}
          </p>
        </div>
        <div className="garden-cal2-filters__summary-actions">
          {hasActiveFilters ? (
            <button className="folio-button garden-cal2-filters__clear" type="button" onClick={clearAll}>
              Show everything
            </button>
          ) : null}
          <button
            className="folio-button"
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Hide care choices" : "Choose what to show"}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="garden-cal2-filters__controls">
          <div className="garden-cal2-filters__row">
            <SpecimenLabel>Location</SpecimenLabel>
            <label className="garden-field garden-cal2-filters__select">
              <span className="sr-only">Place</span>
              <select
                className="input"
                value={zoneId}
                onChange={(e) => setZone(e.target.value)}
                aria-label="Choose place"
              >
                <option value="">All places</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="garden-field garden-cal2-filters__select">
              <span className="sr-only">Bed</span>
              <select
                className="input"
                value={bedId}
                onChange={(e) => setBed(e.target.value)}
                aria-label="Choose bed"
              >
                <option value="">All beds</option>
                {availableBeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="garden-field garden-cal2-filters__select">
              <span className="sr-only">Plant</span>
              <select
                className="input"
                value={plantId}
                onChange={(e) => setPlant(e.target.value)}
                aria-label="Choose plant"
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

          <div className="garden-cal2-filters__row">
            <SpecimenLabel>Type</SpecimenLabel>
            <div className="garden-cal2-filters__chips">
              {ALL_EVENT_TYPES.map((et) => (
                <button
                  key={et}
                  type="button"
                  className={`garden-chip${eventTypes.has(et) ? " is-active" : ""}`}
                  onClick={() => toggleEventType(et)}
                  aria-pressed={eventTypes.has(et)}
                >
                  {EVENT_TYPE_LABELS[et]}
                </button>
              ))}
            </div>
          </div>

          <div className="garden-cal2-filters__row">
            <SpecimenLabel>Status</SpecimenLabel>
            <div className="garden-cal2-filters__chips">
              {(["open", "done", "all"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`garden-chip${status === s ? " is-active" : ""}`}
                  aria-pressed={status === s}
                  onClick={() => onChange({ ...filterState, status: s })}
                >
                  {s === "open" ? "To do" : s === "done" ? "Done" : "All"}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
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

function tasksForWeek(tasks: GardenTask[], weekMonday: Date): GardenTask[] {
  const weekSunday = addDays(weekMonday, 6);
  const weekMondayISO = toISODate(weekMonday);
  const weekSundayISO = toISODate(weekSunday);

  return tasks
    .filter((task) => task.due_on && task.due_on >= weekMondayISO && task.due_on <= weekSundayISO)
    .sort((a, b) => (a.due_on ?? "").localeCompare(b.due_on ?? ""));
}

function upcomingTasks(tasks: GardenTask[], todayISO: string, days = 14): GardenTask[] {
  const windowEndISO = toISODate(addDays(new Date(`${todayISO}T00:00:00`), days));
  return tasks
    .filter(
      (task) =>
        task.status === "open" &&
        task.due_on &&
        task.due_on <= windowEndISO
    )
    .sort((a, b) => {
      const aOverdue = (a.due_on ?? "") < todayISO;
      const bOverdue = (b.due_on ?? "") < todayISO;
      // Overdue tasks sort before non-overdue
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return (a.due_on ?? "").localeCompare(b.due_on ?? "");
    });
}

type WeekAttentionListProps = {
  weekTasks: GardenTask[];
  nextTasks?: GardenTask[];
  todayISO: string;
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  updateTaskStatus: (task: GardenTask) => Promise<void>;
  updateTask: (
    id: string,
    patch: Partial<Pick<GardenTask, "title" | "due_on" | "notes">>
  ) => Promise<void>;
  isReadOnly?: boolean;
};

function WeekAttentionList({
  weekTasks,
  nextTasks = [],
  todayISO,
  zones,
  beds,
  plants,
  updateTaskStatus,
  updateTask,
  isReadOnly = false,
}: WeekAttentionListProps) {
  const fallbackTasks = isReadOnly && weekTasks.length === 0 ? nextTasks.slice(0, 1) : [];
  const displayTasks = weekTasks.length ? weekTasks : fallbackTasks;
  const isShowingUpcoming = weekTasks.length === 0 && fallbackTasks.length > 0;
  const firstTask = displayTasks[0] ?? null;
  const laterThisWeek = displayTasks.slice(1);
  const firstLabel = firstTask?.due_on && firstTask.due_on < todayISO
    ? "Overdue"
    : firstTask?.due_on === todayISO
      ? "Today"
      : "Next up";

  return (
    <section className="garden-cal2-attention" aria-label="Care for this week">
      <div className="garden-cal2-attention__head">
        <SpecimenLabel tone="olive">First up</SpecimenLabel>
        <span>
          {isShowingUpcoming
            ? "After this week"
            : weekTasks.length === 0
              ? "All clear this week"
              : weekTasks.length === 1
                ? "1 thing needs care this week"
                : `${weekTasks.length} things need care this week`}
        </span>
      </div>
      {displayTasks.length === 0 ? (
        <p className="garden-cal2-attention__empty">
          {isReadOnly
            ? "Nothing is due this week. Upcoming care is below."
            : "Nothing is due this week. Add care when you notice it."}
        </p>
      ) : (
        <div className="garden-cal2-attention__flow">
          {firstTask ? (
            <div className="garden-cal2-attention__focus">
              <SpecimenLabel tone="clay">{firstLabel}</SpecimenLabel>
              <TaskCard
                task={firstTask}
                todayISO={todayISO}
                zones={zones}
                beds={beds}
                plants={plants}
                updateTaskStatus={updateTaskStatus}
                updateTask={updateTask}
                featured
                isReadOnly={isReadOnly}
              />
            </div>
          ) : null}
          {laterThisWeek.length > 0 ? (
            <div className="garden-cal2-attention__upcoming">
              <div className="garden-cal2-attention__subhead">
                <SpecimenLabel tone="olive">Later this week</SpecimenLabel>
              </div>
              <div className="garden-cal2-attention__cards">
                {laterThisWeek.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    todayISO={todayISO}
                    zones={zones}
                    beds={beds}
                    plants={plants}
                    updateTaskStatus={updateTaskStatus}
                    updateTask={updateTask}
                    compact
                    isReadOnly={isReadOnly}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
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
  isReadOnly?: boolean;
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
  isReadOnly = false,
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
    <div className="garden-cal2-week-grid">
      {WEEKDAY_ABBREVS.map((abbrev, i) => {
        const colDate = addDays(weekMonday, i);
        const iso = toISODate(colDate);
        const isToday = iso === todayISO;
        const dayTasks = weekDayTasks[i];
        const dayClasses = [
          "garden-cal2-day-col",
          isToday ? "garden-cal2-day-col--today" : "",
          dayTasks.length === 0 ? "garden-cal2-day-col--empty" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={abbrev} className={dayClasses}>
            <div className="garden-cal2-day-col__head">
              <span className="garden-cal2-day-abbrev">{abbrev}</span>
              <strong
                className={`garden-cal2-day-num${isToday ? " garden-cal2-day-num--today" : ""}`}
              >
                {colDate.getDate()}
              </strong>
            </div>
            <div className="garden-cal2-day-col__entries">
              {dayTasks.length === 0 ? (
                <p className="garden-cal2-empty-day">—</p>
              ) : (
                dayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    todayISO={todayISO}
                    zones={zones}
                    beds={beds}
                    plants={plants}
                    updateTaskStatus={updateTaskStatus}
                    updateTask={updateTask}
                    compact
                    isReadOnly={isReadOnly}
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
  weekMonday: Date;
  isReadOnly?: boolean;
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
  weekMonday,
  isReadOnly = false,
}: InsightsRailProps) {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState(getTodayISO());
  const [adding, setAdding] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const weekSundayISO = toISODate(addDays(weekMonday, 6));
  const laterCare = upcomingTasks(allTasks, todayISO)
    .filter((task) => (task.due_on ?? "") > weekSundayISO)
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
    <aside className="garden-cal2-rail">
      {/* Care after the current week */}
      <section className="garden-cal2-rail__section">
        <SpecimenLabel tone="olive">After this week</SpecimenLabel>
        {laterCare.length === 0 ? (
          <p className="garden-cal2-rail__empty">
            Nothing planned after this week.
          </p>
        ) : (
          <ul className="garden-cal2-upcoming-list">
            {laterCare.map((task) => (
              <li key={task.id} className="garden-cal2-upcoming-item">
                <span className="garden-cal2-upcoming-item__due">
                  {formatGardenDate(task.due_on)}
                </span>
                <span className="garden-cal2-upcoming-item__title">
                  {task.title}
                </span>
                <span className="garden-cal2-upcoming-item__ctx">
                  {buildTaskContext(task, zones, beds, plants)}
                </span>
                {isReadOnly ? null : (
                  <button
                    className="garden-link-button"
                    type="button"
                    onClick={() => router.push(deepLinkForTask(task))}
                  >
                    Show in My Garden
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Open tasks with no date set */}
      {undated.length > 0 ? (
        <section className="garden-cal2-rail__section">
          <SpecimenLabel tone="clay">Needs a date</SpecimenLabel>
          <ul className="garden-cal2-upcoming-list">
            {undated.map((task) => (
              <li key={task.id} className="garden-cal2-upcoming-item">
                <span className="garden-cal2-upcoming-item__due">No date yet</span>
                <span className="garden-cal2-upcoming-item__title">{task.title}</span>
                <span className="garden-cal2-upcoming-item__ctx">{buildTaskContext(task, zones, beds, plants)}</span>
                {isReadOnly ? null : (
                  <button className="garden-link-button" type="button" onClick={() => router.push(deepLinkForTask(task))}>
                    Show in My Garden
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Optional care ideas from plant + season context */}
      <section className="garden-cal2-rail__section">
        <SpecimenLabel tone="olive">Care ideas</SpecimenLabel>
        {suggestions.length === 0 ? (
          <p className="garden-cal2-rail__empty">No new care ideas right now.</p>
        ) : (
          <div className="garden-ideas">
            {suggestions.map((s) => (
              <article className={`garden-idea garden-idea--${s.type}`} key={s.id}>
                <div className="garden-idea__head">
                  <span className="garden-idea__confidence">{formatSuggestionWindowLabel(s.windowLabel)}</span>
                </div>
                <strong className="garden-idea__title">{s.title}</strong>
                <p className="garden-idea__why">{s.rationale}</p>
                {isReadOnly ? null : (
                  <div className="garden-idea__actions">
                    <button className="button" type="button" onClick={() => acceptSuggestion(s)}>
                      Add to weekly care
                    </button>
                    <button className="folio-button" type="button" onClick={() => setDismissed((prev) => new Set(prev).add(s.id))}>
                      Skip
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {isReadOnly ? null : (
        <section className="garden-cal2-rail__section">
          <SpecimenLabel>Add care</SpecimenLabel>
          <form className="garden-form garden-form--compact" onSubmit={handleAddTask}>
            <FieldText
              label="What needs doing?"
              required
              value={taskTitle}
              placeholder="Stake tomatoes"
              onChange={setTaskTitle}
            />
            <FieldText
              label="When"
              type="date"
              value={taskDue}
              onChange={setTaskDue}
            />
            <button className="button" type="submit" disabled={adding}>
              {adding ? "Adding…" : "Add to weekly care"}
            </button>
          </form>
        </section>
      )}
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
  isReadOnly = false,
}: CalendarViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = toISODate(today);

  // Week navigation
  const [weekMonday, setWeekMonday] = useState<Date>(() =>
    getWeekMonday(today)
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
  const weekTasks = tasksForWeek(filteredTasks, weekMonday);
  const nextTasks = upcomingTasks(filteredTasks, todayISO);

  // Navigation
  function goToToday() {
    setWeekMonday(getWeekMonday(today));
  }

  function goPrev() {
    setWeekMonday((d) => addDays(d, -7));
  }

  function goNext() {
    setWeekMonday((d) => addDays(d, 7));
  }

  // Current label
  const navLabel = weekLabel(weekMonday);

  // Empty states
  const hasNoTasksAtAll = tasks.length === 0;
  const filtersHideAll = !hasNoTasksAtAll && filteredTasks.length === 0;
  const showCalendarGrid = !isReadOnly;

  return (
    <div className="garden-cal2-layout">
      {/* Left / center column */}
      <div className="garden-cal2-main">
        {/* Header: view toggle + nav */}
        <div className="garden-cal2-toolbar">
          {isReadOnly ? null : (
            <>
              <nav className="garden-cal2-nav" aria-label="Week navigation">
                <button
                  className="folio-button garden-cal2-nav__btn"
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous week"
                >
                  ← Prev
                </button>
                <button
                  className="folio-button garden-cal2-nav__btn garden-cal2-nav__btn--today"
                  type="button"
                  onClick={goToToday}
                >
                  Today
                </button>
                <button
                  className="folio-button garden-cal2-nav__btn"
                  type="button"
                  onClick={goNext}
                  aria-label="Next week"
                >
                  Next →
                </button>
              </nav>
            </>
          )}
          <h2 className="garden-cal2-period-label">{navLabel}</h2>
        </div>

        {/* Empty states */}
        {hasNoTasksAtAll ? (
          <div className="garden-cal2-empty-state">
            {plants.length === 0 ? (
              <>
                <p>Give one plant a home. Then watering, pruning, and harvests have a place to live.</p>
                <a className="folio-button" href="/app/my-property">
                  Add one plant
                </a>
              </>
            ) : (
              <p>Nothing needs care this week. Add watering, pruning, or harvest plans as they come up.</p>
            )}
          </div>
        ) : filtersHideAll ? (
          <div className="garden-cal2-empty-state">
            <p>Nothing matches those choices.</p>
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
              Show everything
            </button>
          </div>
        ) : null}

        {!hasNoTasksAtAll && !filtersHideAll ? (
          <WeekAttentionList
            weekTasks={weekTasks}
            nextTasks={nextTasks}
            todayISO={todayISO}
            zones={zones}
            beds={beds}
            plants={plants}
            updateTaskStatus={updateTaskStatus}
            updateTask={updateTask}
            isReadOnly={isReadOnly}
          />
        ) : null}

        {/* Timeline */}
        {!hasNoTasksAtAll && !filtersHideAll && showCalendarGrid ? (
          <WeekView
            weekMonday={weekMonday}
            todayISO={todayISO}
            filteredTasks={filteredTasks}
            zones={zones}
            beds={beds}
            plants={plants}
            updateTaskStatus={updateTaskStatus}
            updateTask={updateTask}
            isReadOnly={isReadOnly}
          />
        ) : null}

        {isReadOnly ? null : (
          <FilterChips
            filterState={filterState}
            zones={zones}
            beds={beds}
            plants={plants}
            onChange={setFilterState}
          />
        )}

        {isReadOnly ? null : <SeasonStrip season={season} region={region} />}
      </div>

      {/* Right column */}
      {isReadOnly ? null : (
        <InsightsRail
          allTasks={tasks}
          todayISO={todayISO}
          season={derivedSeason}
          zones={zones}
          beds={beds}
          plants={plants}
          addTask={addTask}
          property={property}
          weekMonday={weekMonday}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  );
}
