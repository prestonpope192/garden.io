"use client";

import { useState } from "react";
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
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the photo."));
    reader.readAsDataURL(file);
  });
}

export function DiagnosePanel({ context, addTask }: DiagnosePanelProps) {
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [added, setAdded] = useState<Set<number>>(new Set());

  function onFile(next: File | null) {
    setPreview((url) => {
      if (url) URL.revokeObjectURL(url);
      return next ? URL.createObjectURL(next) : null;
    });
    setFile(next);
  }

  async function run() {
    if (!symptoms.trim() && !file) return;
    setLoading(true);
    setError("");
    setResult(null);
    setAdded(new Set());
    try {
      const imageDataUrl = file ? await fileToDataUrl(file) : null;
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, symptoms, imageDataUrl })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message || "The assistant could not respond. Try again.");
      } else {
        setResult(data.diagnosis as Diagnosis);
      }
    } catch {
      setError("Something went wrong reaching the assistant.");
    } finally {
      setLoading(false);
    }
  }

  async function addAction(action: string, index: number) {
    await addTask({ title: action, dueOn: getTodayISO(), notes: `Suggested by the diagnosis assistant for ${context.name}.` });
    setAdded((prev) => new Set(prev).add(index));
  }

  return (
    <div className="beta-diagnose">
      <SpecimenLabel tone="olive">Ask the gardener</SpecimenLabel>
      <p className="beta-drawer__muted">
        Describe what you&rsquo;re seeing on {context.name} (a photo helps). The assistant reads this plant&rsquo;s record — stage, bed, season — to suggest likely causes and next steps.
      </p>
      <label className="beta-field">
        <span>What are you seeing?</span>
        <textarea
          className="input beta-textarea"
          placeholder="Yellowing lower leaves · spots on the fruit · wilting at midday…"
          value={symptoms}
          onChange={(event) => setSymptoms(event.target.value)}
        />
      </label>
      <label className="beta-field">
        <span>Photo (optional)</span>
        <input className="input" type="file" accept="image/*" onChange={(event) => onFile(event.target.files?.[0] ?? null)} />
      </label>
      {preview ? <img className="beta-diagnose__preview" src={preview} alt="Selected photo preview" /> : null}
      <button className="button" type="button" onClick={run} disabled={loading || (!symptoms.trim() && !file)}>
        {loading ? "Thinking…" : "Diagnose"}
      </button>
      {error ? <p className="beta-diagnose__error">{error}</p> : null}

      {result ? (
        <div className="beta-diagnose__result">
          <p className="beta-diagnose__summary">{result.summary}</p>
          {result.causes.map((cause, index) => (
            <div className="beta-diagnose__cause" key={index}>
              <div className="beta-diagnose__cause-head">
                <strong>{cause.cause}</strong>
                <span className={`beta-diagnose__conf beta-diagnose__conf--${cause.confidence}`}>{cause.confidence} confidence</span>
              </div>
              <p>{cause.detail}</p>
            </div>
          ))}
          {result.actions.length > 0 ? (
            <div className="beta-diagnose__group">
              <SpecimenLabel tone="clay">Suggested actions</SpecimenLabel>
              {result.actions.map((action, index) => (
                <div className="beta-diagnose__action" key={index}>
                  <span>{action}</span>
                  <button className="folio-button" type="button" disabled={added.has(index)} onClick={() => addAction(action, index)}>
                    {added.has(index) ? "Added ✓" : "Add as task"}
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {result.follow_up ? (
            <p className="beta-diagnose__followup"><span>Follow up:</span> {result.follow_up}</p>
          ) : null}
          <p className="beta-diagnose__disclaimer">A second opinion from an attentive gardener — trust your own eyes too.</p>
        </div>
      ) : null}
    </div>
  );
}
