"use client";

import { FormEvent, useMemo, useState } from "react";
import { SpecimenLabel } from "@/components/journal-primitives";
import { buildPlantTimeline, type TimelineItem } from "@/lib/garden-timeline";
import { dueDateISO, type GardenSuggestion } from "@/lib/garden-suggestions";
import type {
  GardenObservation,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantOutcomeResult,
  GardenTask,
} from "@/lib/garden-app-types";

// Phase 3C · Slices 1+2 — shared render for the per-plant past → today →
// upcoming arc, plus outcome capture. Presentational + optimistic local state
// only; it builds the timeline from raw ingredients (so both call sites stay
// tiny) and delegates the real writes back to the caller's mutations.

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
};

function TimelineRow({
  item,
  mediaUrls,
  onCommit,
  onDismiss,
  onDeleteOutcome,
  busy,
}: {
  item: TimelineItem;
  mediaUrls: Record<string, string>;
  onCommit: (item: TimelineItem) => void;
  onDismiss: (id: string) => void;
  onDeleteOutcome?: (id: string) => void;
  busy: boolean;
}) {
  const photo = item.imagePath ? mediaUrls[item.imagePath] : undefined;
  const isOutcome = item.id.startsWith("outcome:");
  return (
    <div
      className={`beta-timeline__item beta-timeline__item--${item.kind}${
        item.projected ? " is-projected" : ""
      }${isOutcome ? " is-outcome" : ""}`}
    >
      <span className="beta-timeline__date">{item.date || "—"}</span>
      <div className="beta-timeline__body">
        {item.kind === "milestone" ? (
          <>
            <p className="beta-timeline__text">
              <span className="beta-timeline__tag">
                {item.projected ? "expected" : isOutcome ? "harvest" : "milestone"}
              </span>
              {item.title}
              {item.detail ? <span className="beta-timeline__detail"> · {item.detail}</span> : null}
            </p>
            {isOutcome && onDeleteOutcome ? (
              <button
                className="beta-link-button"
                type="button"
                disabled={busy}
                onClick={() => onDeleteOutcome(item.id.replace(/^outcome:/, ""))}
              >
                Remove
              </button>
            ) : null}
          </>
        ) : item.kind === "task" ? (
          <p className="beta-timeline__text">
            <span className="beta-timeline__tag">
              {item.status === "done" ? "✓ done" : "task"}
            </span>
            {item.title}
            {item.overdue ? (
              <span className="beta-timeline__badge beta-timeline__badge--overdue">overdue</span>
            ) : null}
          </p>
        ) : item.kind === "suggestion" && item.suggestion ? (
          <div className="beta-timeline__suggestion">
            <p className="beta-timeline__text">
              <span className="beta-timeline__tag beta-timeline__tag--suggestion">suggested</span>
              {item.title}
            </p>
            {item.detail ? <p className="beta-timeline__why">{item.detail}</p> : null}
            <div className="beta-timeline__actions">
              <button
                className="button"
                type="button"
                disabled={busy}
                onClick={() => onCommit(item)}
              >
                Add as task
              </button>
              <button
                className="folio-button"
                type="button"
                onClick={() => onDismiss(item.id)}
              >
                Not now
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="beta-timeline__text">{item.detail}</p>
            {photo ? (
              <img className="beta-timeline__photo" src={photo} alt={item.detail || "Garden photo"} />
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
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        className="folio-button beta-timeline__log-outcome"
        onClick={() => setOpen(true)}
      >
        + Log harvest / outcome
      </button>
    );
  }

  return (
    <form className="beta-form beta-form--compact beta-outcome-form" onSubmit={submit}>
      <SpecimenLabel tone="olive">Record an outcome</SpecimenLabel>
      <label className="beta-field">
        <span>Result</span>
        <select
          className="input"
          value={result}
          onChange={(e) => setResult(e.target.value as GardenPlantOutcomeResult | "")}
        >
          <option value="">—</option>
          <option value="success">Success</option>
          <option value="partial">Partial</option>
          <option value="failure">Failure</option>
        </select>
      </label>
      <div className="beta-outcome-form__row">
        <label className="beta-field">
          <span>Harvest qty</span>
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
        <label className="beta-field">
          <span>Unit</span>
          <input
            className="input"
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="kg, count…"
          />
        </label>
      </div>
      <div className="beta-outcome-form__row">
        <label className="beta-field">
          <span>Quality</span>
          <select className="input" value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}/5
              </option>
            ))}
          </select>
        </label>
        <label className="beta-field">
          <span>Harvested on</span>
          <input
            className="input"
            type="date"
            value={harvestedOn}
            onChange={(e) => setHarvestedOn(e.target.value)}
          />
        </label>
      </div>
      <label className="beta-field">
        <span>Notes</span>
        <textarea
          className="input beta-textarea"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What worked, what didn't…"
        />
      </label>
      <div className="beta-drawer__actions-row">
        <button className="button" type="submit" disabled={busy}>
          Save outcome
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
      // context (My Plants has its own selection state).
      propertyId: plant.property_id,
      zoneId: plant.zone_id,
      bedId: plant.bed_id,
      plantInstanceId: plant.id,
    });
  };
  const dismiss = (id: string) => setHidden((prev) => new Set(prev).add(id));
  const deleteOutcome = deletePlantOutcome
    ? (id: string) => {
        setHidden((prev) => new Set(prev).add(`outcome:${id}`));
        void Promise.resolve(deletePlantOutcome(id));
      }
    : undefined;

  return (
    <div className="beta-timeline beta-timeline--arc">
      <SpecimenLabel>Timeline</SpecimenLabel>

      {isEmpty ? (
        <p className="beta-drawer__muted">
          No timeline yet — set a planting date, log a note, or record an outcome to start this
          plant&rsquo;s story.
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
              />
            ))}

          <div className="beta-timeline__divider" role="separator">
            <span className="beta-timeline__now">Today</span>
            {timeline.currentStage ? (
              <span className="beta-timeline__stage">
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
              />
            ))
          ) : (
            <p className="beta-drawer__muted">
              Nothing scheduled ahead — check back as the season turns.
            </p>
          )}
        </>
      )}

      <OutcomeForm plant={plant} addPlantOutcome={addPlantOutcome} today={today} busy={busy} />
    </div>
  );
}
