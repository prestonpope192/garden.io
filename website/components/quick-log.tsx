"use client";

import { useEffect, useRef, useState } from "react";
import { SpecimenLabel } from "@/components/journal-primitives";
import { getZoneName, getBedName } from "@/lib/garden-app-helpers";
import type { GardenBed, GardenPlantInstance, GardenZone } from "@/lib/garden-app-types";
import { getCatalogPlantName } from "@/components/views/shared";

type QuickLogInput = {
  note: string;
  file: File | null;
  zoneId: string | null;
  bedId: string | null;
  plantInstanceId: string | null;
};

type QuickLogProps = {
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  activeZoneId: string;
  activeBedId: string;
  activePlantId: string;
  busy: boolean;
  onLog: (input: QuickLogInput) => Promise<void>;
};

export const QUICK_LOG_COPY = {
  fabAria: "Add a garden note or photo",
  fabLabel: "Add note",
  dialogLabel: "Keep a garden note",
  heading: "Keep a garden note",
  closeAria: "Close this form",
  noteLabel: "What did you notice?",
  placeholder: "First tomato, aphids on kale, rain soaked the beds...",
  photoLabel: "Add a photo (optional)",
  previewAlt: "Photo you selected",
  attachLabel: "Keep with",
  wholeGarden: "Whole garden",
  saveLabel: "Keep in garden",
  savingLabel: "Keeping..."
};

export function QuickLog({ zones, beds, plants, activeZoneId, activeBedId, activePlantId, busy, onLog }: QuickLogProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [target, setTarget] = useState("property");
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const growing = plants.filter((plant) => plant.status === "growing");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      fabRef.current?.focus();
    };
  }, [open]);

  const defaultTarget = () => {
    if (activePlantId) return `plant:${activePlantId}`;
    if (activeBedId) return `bed:${activeBedId}`;
    if (activeZoneId) return `zone:${activeZoneId}`;
    return "property";
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function openPanel() {
    setTarget(defaultTarget());
    setOpen(true);
  }

  function reset() {
    setNote("");
    setFile(null);
    setPreview((url) => {
      if (url) URL.revokeObjectURL(url);
      return null;
    });
  }

  function onFile(next: File | null) {
    setPreview((url) => {
      if (url) URL.revokeObjectURL(url);
      return next ? URL.createObjectURL(next) : null;
    });
    setFile(next);
  }

  function decodeTarget(): { zoneId: string | null; bedId: string | null; plantInstanceId: string | null } {
    if (target.startsWith("plant:")) {
      const plant = plants.find((candidate) => candidate.id === target.slice(6));
      return { zoneId: plant?.zone_id ?? null, bedId: plant?.bed_id ?? null, plantInstanceId: plant?.id ?? null };
    }
    if (target.startsWith("bed:")) {
      const bed = beds.find((candidate) => candidate.id === target.slice(4));
      return { zoneId: bed?.zone_id ?? null, bedId: bed?.id ?? null, plantInstanceId: null };
    }
    if (target.startsWith("zone:")) {
      return { zoneId: target.slice(5), bedId: null, plantInstanceId: null };
    }
    return { zoneId: null, bedId: null, plantInstanceId: null };
  }

  async function save() {
    if (!note.trim() && !file) return;
    await onLog({ note, file, ...decodeTarget() });
    reset();
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="garden-quicklog-fab" ref={fabRef} type="button" onClick={openPanel} aria-label={QUICK_LOG_COPY.fabAria}>
        <span aria-hidden="true" className="garden-quicklog-fab__mark">✎</span>
        <span className="garden-quicklog-fab__label">{QUICK_LOG_COPY.fabLabel}</span>
      </button>
    );
  }

  return (
    <div className="garden-quicklog">
      <div className="garden-quicklog__panel" ref={panelRef} role="dialog" aria-modal="true" aria-label={QUICK_LOG_COPY.dialogLabel}>
        <div className="garden-quicklog__head">
          <SpecimenLabel tone="olive">{QUICK_LOG_COPY.heading}</SpecimenLabel>
          <button className="garden-quicklog__close" type="button" onClick={() => setOpen(false)} aria-label={QUICK_LOG_COPY.closeAria}>✕</button>
        </div>

        <label className="garden-field">
          <span>{QUICK_LOG_COPY.noteLabel}</span>
          <textarea
            className="input garden-textarea"
            autoFocus
            placeholder={QUICK_LOG_COPY.placeholder}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>

        <label className="garden-field">
          <span>{QUICK_LOG_COPY.photoLabel}</span>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(event) => onFile(event.target.files?.[0] ?? null)}
          />
        </label>
        {preview ? <img className="garden-quicklog__preview" src={preview} alt={QUICK_LOG_COPY.previewAlt} /> : null}

        <label className="garden-field">
          <span>{QUICK_LOG_COPY.attachLabel}</span>
          <select className="input" value={target} onChange={(event) => setTarget(event.target.value)}>
            <option value="property">{QUICK_LOG_COPY.wholeGarden}</option>
            {zones.map((zone) => (
              <option key={zone.id} value={`zone:${zone.id}`}>{zone.name} place</option>
            ))}
            {beds.map((bed) => (
              <option key={bed.id} value={`bed:${bed.id}`}>{bed.name} in {getZoneName(zones, bed.zone_id)}</option>
            ))}
            {growing.map((plant) => (
              <option key={plant.id} value={`plant:${plant.id}`}>{getCatalogPlantName(plant)} in {getBedName(beds, plant.bed_id)}</option>
            ))}
          </select>
        </label>

        <div className="garden-quicklog__actions">
          <button className="folio-button" type="button" onClick={() => setOpen(false)}>Cancel</button>
          <button className="button" type="button" onClick={save} disabled={busy || (!note.trim() && !file)}>
            {busy ? QUICK_LOG_COPY.savingLabel : QUICK_LOG_COPY.saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
