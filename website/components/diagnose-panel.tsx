"use client";

import { useEffect, useRef, useState } from "react";
import { SpecimenLabel } from "@/components/journal-primitives";
import { getTodayISO } from "@/lib/garden-app-helpers";

export type DiagnoseContext = {
  name: string;
  botanical?: string | null;
  type?: string | null;
  stage?: string | null;
  location?: string | null;
  sun?: string | null;
  water?: string | null;
  soil?: string | null;
  plantedOn?: string | null;
  season?: string | null;
  hardinessZone?: string | null;
  recentNotes?: string[];
};

type Cause = { cause: string; confidence: "high" | "medium" | "low"; detail: string };
type Diagnosis = { summary: string; causes: Cause[]; actions: string[]; follow_up: string };

type DiagnosePanelProps = {
  context: DiagnoseContext;
  addTask: (input: { title: string; dueOn: string; notes: string }) => Promise<void>;
  addObservation: (note: string) => Promise<void>;
  // When `nonce` increments, seed the symptoms with `text` and ask for care help.
  // Used by "Save and get care help" on a just-logged note.
  seed?: { text: string; nonce: number };
};

function diagnosisToNote(diagnosis: Diagnosis): string {
  const top = diagnosis.causes[0];
  const lines = [`Plant note — ${diagnosis.summary}`];
  if (top) lines.push(`Possible cause: ${top.cause}.`);
  if (diagnosis.actions.length) lines.push(`Try first: ${diagnosis.actions.slice(0, 2).join("; ")}.`);
  return lines.join("\n");
}

function formatCauseSignal(confidence: Cause["confidence"]) {
  if (confidence === "high") return "Most likely";
  if (confidence === "medium") return "Possible";
  return "Needs a closer look";
}

const MAX_IMAGE_DIM = 1024;

export const DIAGNOSE_COPY = {
  unavailableFallback: "We couldn't look at this plant right now. Try again in a moment.",
  networkError: "We couldn't look at this plant right now. You can still keep a note and try again.",
  previewAlt: "Photo you added for this plant",
  saveHint: "Kept with this plant so you remember what helped."
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the photo."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the photo."));
    image.src = src;
  });
}

// Downscale photos to ~1024px JPEG before upload. Cuts payload size and the
// vision-model token cost dramatically, with no meaningful loss for plant questions.
async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) return fileToDataUrl(file);
  try {
    const original = await fileToDataUrl(file);
    const image = await loadImage(original);
    const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(image.width, image.height));
    if (scale === 1 && file.size < 600_000) return original;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return fileToDataUrl(file);
  }
}

export function DiagnosePanel({ context, addTask, addObservation, seed }: DiagnosePanelProps) {
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Fix 4: Scroll result into view after a successful diagnosis
  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  function onFile(next: File | null) {
    setPreview((url) => {
      if (url) URL.revokeObjectURL(url);
      return next ? URL.createObjectURL(next) : null;
    });
    setFile(next);
  }

  async function run(symptomsOverride?: string) {
    const text = (symptomsOverride ?? symptoms).trim();
    if (!text && !file) return;
    setLoading(true);
    setError("");
    setResult(null);
    setAdded(new Set());
    setSaved(false);
    try {
      const imageDataUrl = file ? await compressImage(file) : null;
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, symptoms: text, imageDataUrl })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message || DIAGNOSE_COPY.unavailableFallback);
      } else {
        setResult(data.diagnosis as Diagnosis);
      }
    } catch {
      setError(DIAGNOSE_COPY.networkError);
    } finally {
      setLoading(false);
    }
  }

  // "Save and get care help" on a just-logged note: seed symptoms and run automatically.
  useEffect(() => {
    if (!seed || seed.nonce === 0 || !seed.text.trim()) return;
    setSymptoms(seed.text);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    void run(seed.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed?.nonce]);

  async function addAction(action: string, index: number) {
    await addTask({ title: action, dueOn: getTodayISO(), notes: `From this plant note: ${context.name}.` });
    setAdded((prev) => new Set(prev).add(index));
  }

  async function saveToRecord() {
    if (!result) return;
    await addObservation(diagnosisToNote(result));
    setSaved(true);
  }

  return (
    <div className="garden-diagnose" ref={rootRef}>
      <SpecimenLabel tone="olive">Ask about this plant</SpecimenLabel>
      <p className="garden-drawer__muted">
        Add what changed on {context.name}. A little context makes the answer more useful.
      </p>
      {/* Fix 3: explicit id/htmlFor pairs on both inputs */}
      <label className="garden-field" htmlFor="diagnose-prompt">
        <span>What changed on this plant?</span>
        <textarea
          id="diagnose-prompt"
          className="input garden-textarea"
          placeholder="Yellowing lower leaves · spots on the fruit · wilting at midday…"
          value={symptoms}
          onChange={(event) => setSymptoms(event.target.value)}
        />
      </label>
      <label className="garden-field" htmlFor="diagnose-photo">
        <span>Add a photo (optional)</span>
        <input id="diagnose-photo" className="input" type="file" accept="image/*" onChange={(event) => onFile(event.target.files?.[0] ?? null)} />
      </label>
      {preview ? <img className="garden-diagnose__preview" src={preview} alt={DIAGNOSE_COPY.previewAlt} /> : null}
      {/* Fix 6: static disclaimer above the submit button */}
      <p className="garden-diagnose__disclaimer">AI suggestions — always verify with your own observation.</p>
      {/* Fix 5: more descriptive button label using context.name */}
      <button className="button" type="button" onClick={() => run()} disabled={loading || (!symptoms.trim() && !file)}>
        {loading ? "Looking closely..." : `Ask about ${context.name}`}
      </button>
      {/* Fix 2: role="alert" so screen readers announce the error */}
      {error ? <p className="garden-diagnose__error" role="alert">{error}</p> : null}

      {/* Fix 1: remove aria-label from skeleton container; move aria-live to the paragraph */}
      {loading ? (
        <div className="garden-diagnose__skeleton">
          <span className="garden-diagnose__skel-line garden-diagnose__skel-line--wide" />
          <span className="garden-diagnose__skel-line" />
          <span className="garden-diagnose__skel-line garden-diagnose__skel-line--short" />
          <p aria-live="polite" className="garden-diagnose__skel-note">Looking over {context.name}...</p>
        </div>
      ) : null}

      {/* Fix 4: resultRef attached here for smooth scroll-into-view */}
      {result ? (
        <div className="garden-diagnose__result" ref={resultRef}>
          <p className="garden-diagnose__summary">{result.summary}</p>
          {result.causes.map((cause, index) => (
            <div className="garden-diagnose__cause" key={index}>
              <div className="garden-diagnose__cause-head">
                <strong>{cause.cause}</strong>
                <span className={`garden-diagnose__conf garden-diagnose__conf--${cause.confidence}`}>{formatCauseSignal(cause.confidence)}</span>
              </div>
              <p>{cause.detail}</p>
            </div>
          ))}
          {result.actions.length > 0 ? (
            <div className="garden-diagnose__group">
              <SpecimenLabel tone="clay">Try first</SpecimenLabel>
              {result.actions.map((action, index) => (
                <div className="garden-diagnose__action" key={index}>
                  <span>{action}</span>
                  <button className="folio-button" type="button" disabled={added.has(index)} onClick={() => addAction(action, index)}>
                    {added.has(index) ? "Added" : "Add to weekly care"}
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {result.follow_up ? (
            <p className="garden-diagnose__followup"><span>Watch for:</span> {result.follow_up}</p>
          ) : null}
          <div className="garden-diagnose__save">
            <button className="folio-button" type="button" onClick={saveToRecord} disabled={saved}>
              {saved ? "Kept" : "Keep with this plant"}
            </button>
            <span className="garden-diagnose__save-hint">{DIAGNOSE_COPY.saveHint}</span>
          </div>
          <p className="garden-diagnose__disclaimer">Use this as a second opinion. Look closely before you act.</p>
        </div>
      ) : null}
    </div>
  );
}
