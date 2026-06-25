"use client";

import { FormEvent, useMemo, useState } from "react";
import { SpecimenLabel } from "@/components/journal-primitives";
import { formatGardenDate } from "@/lib/garden-app-helpers";
import { buildPlantTimeline, type TimelineItem } from "@/lib/garden-timeline";
import { dueDateISO, type GardenSuggestion } from "@/lib/garden-suggestions";
import type {
  GardenObservation,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantOutcomeResult,
  GardenTask,
} from "@/lib/garden-app-types";

// Shared render for the per-plant past → today → upcoming arc, plus outcome
// capture. Presentational + optimistic local state only; it builds the timeline
// from raw ingredients and delegates the real writes back to the caller's mutations.

export type AddPlantOutcomeInput = {
  result: GardenPlantOutcomeResult | null;
  harvestQuantity: number | null;
  harvestUnit: string | null;
  qualityRating: number | null;
  harvestedOn: string | null;
  notes: string;
};

export type PlantTimelineProps = {
  plant: GardenPlantInstance;
  observations: GardenObservation[];
  tasks: GardenTask[];
  outcomes: GardenPlantOutcome[];
  suggestions: GardenSuggestion[];
  mediaUrls: Record<string, string>;
  today: string;
  addTask: (input: {
    title: string;
    dueOn: string;
    notes: string;
    propertyId?: string;
    zoneId?: string | null;
    bedId?: string | null;
    plantInstanceId?: string | null;
  }) => Promise<void> | void;
  addPlantOutcome: (plant: GardenPlantInstance, input: AddPlantOutcomeInput) => Promise<void> | void;
  deletePlantOutcome?: (id: string) => Promise<void> | void;
  busy?: boolean;
  isReadOnly?: boolean;
};

export const PLANT_TIMELINE_COPY = {
  removeOutcome: "Remove entry",
  addOutcome: "Add harvest or lesson",
  outcomeHeading: "How did this planting go?",
  saveOutcome: "Keep in plant journal",
  empty: "No plant journal yet. Keep a note, photo, harvest, or lesson so you remember what happened.",
  nothingPlanned: "No care planned yet."
};

function TimelineRow({
  item,
  mediaUrls,
  onCommit,
  onDismiss,
  onDeleteOutcome,
  busy,
  isReadOnly,
}: {
  item: TimelineItem;
  mediaUrls: Record<string, string>;
  onCommit: (item: TimelineItem) => void;
  onDismiss: (id: string) => void;
  onDeleteOutcome?: (id: string) => void;
  busy: boolean;
  isReadOnly: boolean;
}) {
  const photo = item.imagePath ? mediaUrls[item.imagePath] : undefined;
  const isOutcome = item.id.startsWith("outcome:");
  return (
    <div
      className={`garden-timeline__item garden-timeline__item--${item.kind}${
        item.projected ? " is-projected" : ""
      }${isOutcome ? " is-outcome" : ""}`}
    >
      <span className="garden-timeline__date">{item.date ? formatGardenDate(item.date) : "—"}</span>
      <div className="garden-timeline__body">
        {item.kind === "milestone" ? (
          <>
            <p className="garden-timeline__text">
              <span className="garden-timeline__tag">
                {item.projected ? "expected" : isOutcome ? "harvest" : "planting"}
              </span>
              {item.title}
              {item.detail ? <span className="garden-timeline__detail"> · {item.detail}</span> : null}
            </p>
            {!isReadOnly && isOutcome && onDeleteOutcome ? (
              <button
                className="garden-link-button"
                type="button"
                disabled={busy}
                onClick={() => onDeleteOutcome(item.id.replace(/^outcome:/, ""))}
              >
                {PLANT_TIMELINE_COPY.removeOutcome}
              </button>
            ) : null}
          </>
        ) : item.kind === "task" ? (
          <p className="garden-timeline__text">
            <span className="garden-timeline__tag">
              {item.status === "done" ? "✓ done" : "care"}
            </span>
            {item.title}
            {item.overdue ? (
              <span className="garden-timeline__badge garden-timeline__badge--overdue">overdue</span>
            ) : null}
          </p>
        ) : item.kind === "suggestion" && item.suggestion ? (
          <div className="garden-timeline__suggestion">
            <p className="garden-timeline__text">
              <span className="garden-timeline__tag garden-timeline__tag--suggestion">care idea</span>
              {item.title}
            </p>
            {item.detail ? <p className="garden-timeline__why">{item.detail}</p> : null}
            {isReadOnly ? null : (
              <div className="garden-timeline__actions">
                <button
                  className="button"
                  type="button"
                  disabled={busy}
                  onClick={() => onCommit(item)}
                >
                  Add to weekly care
                </button>
                <button
                  className="folio-button"
                  type="button"
                  onClick={() => onDismiss(item.id)}
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="garden-timeline__text">{item.detail}</p>
            {photo ? (
              <img className="garden-timeline__photo" src={photo} alt={item.detail || "Garden photo"} />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function OutcomeForm({
  plant,
  addPlantOutcome,
  today,
  busy,
}: {
  plant: GardenPlantInstance;
  addPlantOutcome: PlantTimelineProps["addPlantOutcome"];
  today: string;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<GardenPlantOutcomeResult | "">("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const [quality, setQuality] = useState("");
  const [harvestedOn, setHarvestedOn] = useState(today);
  const [notes, setNotes] = useState("");

  const reset = () => {
    setResult("");
    setQty("");
    setUnit("");
    setQuality("");
    setHarvestedOn(today);
    setNotes("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!result && !qty.trim() && !quality && !notes.trim()) return; // need something
    void Promise.resolve(
      addPlantOutcome(plant, {
        result: result || null,
        harvestQuantity: qty.trim() ? Number(qty) : null,
        harvestUnit: unit.trim() || null,
        qualityRating: quality ? Number(quality) : null,
        harvestedOn: harvestedOn || null,
        notes,
      })
    ).then(() => {
      reset();
      setOpen(false);
    }).catch(() => {
      // The parent mutation already surfaces the save error; keep the form open.
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        className="folio-button garden-timeline__log-outcome"
        onClick={() => setOpen(true)}
      >
        {PLANT_TIMELINE_COPY.addOutcome}
      </button>
    );
  }

  return (
    <form className="garden-form garden-form--compact garden-outcome-form" onSubmit={submit}>
      <SpecimenLabel tone="olive">{PLANT_TIMELINE_COPY.outcomeHeading}</SpecimenLabel>
      <label className="garden-field">
        <span>What happened</span>
        <select
          className="input"
          value={result}
          onChange={(e) => setResult(e.target.value as GardenPlantOutcomeResult | "")}
        >
          <option value="">—</option>
          <option value="success">Grew well</option>
          <option value="partial">Struggled</option>
          <option value="failure">Didn&apos;t work</option>
        </select>
      </label>
      <div className="garden-outcome-form__row">
        <label className="garden-field">
          <span>Harvest amount</span>
          <input
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="3.5"
          />
        </label>
        <label className="garden-field">
          <span>Unit</span>
          <input
            className="input"
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="lb, count..."
          />
        </label>
      </div>
      <div className="garden-outcome-form__row">
        <label className="garden-field">
          <span>Harvest quality</span>
          <select className="input" value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}/5
              </option>
            ))}
          </select>
        </label>
        <label className="garden-field">
          <span>Harvested on</span>
          <input
            className="input"
            type="date"
            value={harvestedOn}
            onChange={(e) => setHarvestedOn(e.target.value)}
          />
        </label>
      </div>
      <label className="garden-field">
        <span>Notes</span>
        <textarea
          className="input garden-textarea"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What worked, what to change..."
        />
      </label>
      <div className="garden-drawer__actions-row">
        <button className="button" type="submit" disabled={busy}>
          {PLANT_TIMELINE_COPY.saveOutcome}
        </button>
        <button
          className="folio-button"
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function PlantTimeline({
  plant,
  observations,
  tasks,
  outcomes,
  suggestions,
  mediaUrls,
  today,
  addTask,
  addPlantOutcome,
  deletePlantOutcome,
  busy = false,
  isReadOnly = false,
}: PlantTimelineProps) {
  // Optimistic: hide a suggestion the moment it is committed or dismissed,
  // before the snapshot refetch lands.
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const timeline = useMemo(
    () => buildPlantTimeline(plant, { observations, tasks, outcomes, suggestions, today }),
    [plant, observations, tasks, outcomes, suggestions, today]
  );

  const upcoming = timeline.upcoming.filter((i) => !hidden.has(i.id));
  const isEmpty = timeline.past.length === 0 && upcoming.length === 0;

  const commit = (item: TimelineItem) => {
    const s = item.suggestion;
    if (!s) return;
    setHidden((prev) => new Set(prev).add(item.id));
    void addTask({
      title: s.taskTitle,
      // Use the timeline's own (deterministic) date; fall back if absent.
      dueOn: item.date || dueDateISO(s.dueInDays),
      notes: s.rationale,
      // Scope the task to THIS plant explicitly, not the app-level active
      // context (Plants has its own selection state).
      propertyId: plant.property_id,
      zoneId: plant.zone_id,
      bedId: plant.bed_id,
      plantInstanceId: plant.id,
    });
  };
  const dismiss = (id: string) => setHidden((prev) => new Set(prev).add(id));
  const deleteOutcome = deletePlantOutcome
    ? (id: string) => {
        const itemId = `outcome:${id}`;
        setHidden((prev) => new Set(prev).add(itemId));
        void Promise.resolve(deletePlantOutcome(id)).catch(() => {
          setHidden((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        });
      }
    : undefined;

  return (
    <div className="garden-timeline garden-timeline--arc">
      <SpecimenLabel>Plant journal</SpecimenLabel>

      {isEmpty ? (
        <p className="garden-drawer__muted">
          {PLANT_TIMELINE_COPY.empty}
        </p>
      ) : (
        <>
          {timeline.past
            .filter((i) => !hidden.has(i.id))
            .map((item) => (
              <TimelineRow
                key={item.id}
                item={item}
                mediaUrls={mediaUrls}
                onCommit={commit}
                onDismiss={dismiss}
                onDeleteOutcome={deleteOutcome}
                busy={busy}
                isReadOnly={isReadOnly}
              />
            ))}

          <div className="garden-timeline__divider" role="separator">
            <span className="garden-timeline__now">Today</span>
            {timeline.currentStage ? (
              <span className="garden-timeline__stage">
                {timeline.currentStage.label}
                {timeline.currentStage.progress !== null
                  ? ` · ${Math.round(timeline.currentStage.progress * 100)}% to maturity`
                  : ""}
              </span>
            ) : null}
          </div>

          {upcoming.length > 0 ? (
            upcoming.map((item) => (
              <TimelineRow
                key={item.id}
                item={item}
                mediaUrls={mediaUrls}
                onCommit={commit}
                onDismiss={dismiss}
                busy={busy}
                isReadOnly={isReadOnly}
              />
            ))
          ) : (
            <p className="garden-drawer__muted">
              {PLANT_TIMELINE_COPY.nothingPlanned}
            </p>
          )}
        </>
      )}

      {isReadOnly ? null : (
        <OutcomeForm plant={plant} addPlantOutcome={addPlantOutcome} today={today} busy={busy} />
      )}
    </div>
  );
}
