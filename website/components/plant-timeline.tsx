"use client";

import { useMemo, useState } from "react";
import { SpecimenLabel } from "@/components/journal-primitives";
import { buildPlantTimeline, type TimelineItem } from "@/lib/garden-timeline";
import { dueDateISO, type GardenSuggestion } from "@/lib/garden-suggestions";
import type {
  GardenObservation,
  GardenPlantInstance,
  GardenTask,
} from "@/lib/garden-app-types";

// Phase 3C · Slice 1 — shared render for the per-plant past → today → upcoming
// arc. Presentational + optimistic local state only; it builds the timeline
// from raw ingredients (so both call sites stay tiny) and delegates the real
// write back to the caller's addTask.

export type PlantTimelineProps = {
  plant: GardenPlantInstance;
  observations: GardenObservation[];
  tasks: GardenTask[];
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
  busy?: boolean;
};

function TimelineRow({
  item,
  mediaUrls,
  onCommit,
  onDismiss,
  busy,
}: {
  item: TimelineItem;
  mediaUrls: Record<string, string>;
  onCommit: (item: TimelineItem) => void;
  onDismiss: (id: string) => void;
  busy: boolean;
}) {
  const photo = item.imagePath ? mediaUrls[item.imagePath] : undefined;
  return (
    <div
      className={`beta-timeline__item beta-timeline__item--${item.kind}${
        item.projected ? " is-projected" : ""
      }`}
    >
      <span className="beta-timeline__date">{item.date || "—"}</span>
      <div className="beta-timeline__body">
        {item.kind === "milestone" ? (
          <p className="beta-timeline__text">
            <span className="beta-timeline__tag">
              {item.projected ? "expected" : "milestone"}
            </span>
            {item.title}
            {item.detail ? <span className="beta-timeline__detail"> · {item.detail}</span> : null}
          </p>
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

export function PlantTimeline({
  plant,
  observations,
  tasks,
  suggestions,
  mediaUrls,
  today,
  addTask,
  busy = false,
}: PlantTimelineProps) {
  // Optimistic: hide a suggestion the moment it is committed or dismissed,
  // before the snapshot refetch lands.
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const timeline = useMemo(
    () => buildPlantTimeline(plant, { observations, tasks, suggestions, today }),
    [plant, observations, tasks, suggestions, today]
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

  if (isEmpty) {
    return (
      <div className="beta-timeline">
        <SpecimenLabel>Timeline</SpecimenLabel>
        <p className="beta-drawer__muted">
          No timeline yet — set a planting date or log a note to start this plant&rsquo;s story.
        </p>
      </div>
    );
  }

  return (
    <div className="beta-timeline beta-timeline--arc">
      <SpecimenLabel>Timeline</SpecimenLabel>

      {timeline.past.map((item) => (
        <TimelineRow
          key={item.id}
          item={item}
          mediaUrls={mediaUrls}
          onCommit={commit}
          onDismiss={dismiss}
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
        <p className="beta-drawer__muted">Nothing scheduled ahead — check back as the season turns.</p>
      )}
    </div>
  );
}
