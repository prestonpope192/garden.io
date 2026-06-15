"use client";

import { useEffect, useState } from "react";
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

export function QuickLog({ zones, beds, plants, activeZoneId, activeBedId, activePlantId, busy, onLog }: QuickLogProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [target, setTarget] = useState("property");

  const growing = plants.filter((plant) => plant.status === "growing");

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
      <button className="beta-quicklog-fab" type="button" onClick={openPanel} aria-label="Quick log a note or photo">
        <span aria-hidden="true" className="beta-quicklog-fab__mark">✎</span>
        <span className="beta-quicklog-fab__label">Log</span>
      </button>
    );
  }

  return (
    <div className="beta-quicklog">
      <div className="beta-quicklog__panel" role="dialog" aria-label="Quick log">
        <div className="beta-quicklog__head">
          <SpecimenLabel tone="olive">Quick log</SpecimenLabel>
          <button className="beta-quicklog__close" type="button" onClick={() => setOpen(false)} aria-label="Close quick log">✕</button>
        </div>

        <label className="beta-field">
          <span>What did you notice?</span>
          <textarea
            className="input beta-textarea"
            autoFocus
            placeholder="First blossoms · aphids on the kale · soaked after rain…"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>

        <label className="beta-field">
          <span>Photo (optional)</span>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(event) => onFile(event.target.files?.[0] ?? null)}
          />
        </label>
        {preview ? <img className="beta-quicklog__preview" src={preview} alt="Selected photo preview" /> : null}

        <label className="beta-field">
          <span>Attach to</span>
          <select className="input" value={target} onChange={(event) => setTarget(event.target.value)}>
            <option value="property">Whole garden</option>
            {zones.map((zone) => (
              <option key={zone.id} value={`zone:${zone.id}`}>Zone · {zone.name}</option>
            ))}
            {beds.map((bed) => (
              <option key={bed.id} value={`bed:${bed.id}`}>Bed · {getZoneName(zones, bed.zone_id)} › {bed.name}</option>
            ))}
            {growing.map((plant) => (
              <option key={plant.id} value={`plant:${plant.id}`}>Plant · {getCatalogPlantName(plant)} ({getBedName(beds, plant.bed_id)})</option>
            ))}
          </select>
        </label>

        <div className="beta-quicklog__actions">
          <button className="folio-button" type="button" onClick={() => setOpen(false)}>Cancel</button>
          <button className="button" type="button" onClick={save} disabled={busy || (!note.trim() && !file)}>
            {busy ? "Saving…" : "Log it"}
          </button>
        </div>
      </div>
    </div>
  );
}
