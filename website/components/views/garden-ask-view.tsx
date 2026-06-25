"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { SpecimenLabel } from "@/components/journal-primitives";
import { getTodayISO, getZoneName, getBedName } from "@/lib/garden-app-helpers";
import type {
  GardenBed,
  GardenObservation,
  GardenPlantInstance,
  GardenProperty,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";
import { getCatalogPlantName } from "./shared";

type AskTarget =
  | { kind: "property"; id: "property" }
  | { kind: "zone"; id: string }
  | { kind: "bed"; id: string }
  | { kind: "plant"; id: string };

type GardenAskCause = {
  cause: string;
  confidence: "high" | "medium" | "low";
  detail: string;
};

export type GardenAskDiagnosis = {
  summary: string;
  causes: GardenAskCause[];
  actions: string[];
  follow_up: string;
};

type GardenAskContext = ReturnType<typeof buildGardenContext>;

type QuickLogInput = {
  note: string;
  file: File | null;
  zoneId: string | null;
  bedId: string | null;
  plantInstanceId: string | null;
};

export type GardenAskViewProps = {
  activeProperty: GardenProperty | null;
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  observations: GardenObservation[];
  tasks: GardenTask[];
  isSaving: boolean;
  quickLog: (input: QuickLogInput) => Promise<void>;
  addTask: (input: {
    title: string;
    dueOn: string;
    notes: string;
    propertyId?: string;
    zoneId?: string | null;
    bedId?: string | null;
    plantInstanceId?: string | null;
  }) => Promise<void>;
  updateTaskStatus: (task: GardenTask) => Promise<void>;
  askGarden?: (input: {
    context: GardenAskContext;
    symptoms: string;
    imageDataUrl: string | null;
  }) => Promise<GardenAskDiagnosis>;
  routes?: {
    memory: string;
    care: string;
    guide: string;
  };
};

const PROMPT_EXAMPLES = [
  "Leaves are yellowing",
  "Storm came through"
];

const WAITING_LINES = [
  "Looking at what changed...",
  "Checking your notes and season...",
  "Looking through your garden history...",
  "Checking the photo with your garden notes..."
];

const MAX_IMAGE_DIM = 1024;

function targetValue(target: AskTarget) {
  return `${target.kind}:${target.id}`;
}

function parseTarget(value: string): AskTarget {
  const [kind, id] = value.split(":");
  if (kind === "zone" && id) return { kind, id };
  if (kind === "bed" && id) return { kind, id };
  if (kind === "plant" && id) return { kind, id };
  return { kind: "property", id: "property" };
}

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

function confidenceLabel(confidence: GardenAskCause["confidence"]) {
  if (confidence === "high") return "Most likely";
  if (confidence === "medium") return "Possible";
  return "Worth a look";
}

function buildGardenContext(props: GardenAskViewProps) {
  const growingPlants = props.plants.filter((plant) => plant.status === "growing");
  const plantNames = growingPlants.slice(0, 8).map((plant) => getCatalogPlantName(plant));
  const recentNotes = props.observations.slice(0, 6).map((observation) => observation.note);
  return {
    name: props.activeProperty?.name ? `${props.activeProperty.name} garden` : "this garden",
    type: plantNames.length ? `Growing: ${plantNames.join(", ")}` : null,
    location: [
      props.activeProperty?.region,
      props.zones.length ? `Places: ${props.zones.map((zone) => zone.name).join(", ")}` : null,
      props.beds.length ? `Beds: ${props.beds.map((bed) => bed.name).join(", ")}` : null
    ].filter(Boolean).join(" | ") || null,
    season: props.activeProperty?.season ?? null,
    hardinessZone: props.activeProperty?.growing_zone ?? null,
    recentNotes
  };
}

function targetScope(
  target: AskTarget,
  zones: GardenZone[],
  beds: GardenBed[],
  plants: GardenPlantInstance[]
): Pick<QuickLogInput, "zoneId" | "bedId" | "plantInstanceId"> {
  if (target.kind === "plant") {
    const plant = plants.find((candidate) => candidate.id === target.id);
    return {
      zoneId: plant?.zone_id ?? null,
      bedId: plant?.bed_id ?? null,
      plantInstanceId: plant?.id ?? null
    };
  }
  if (target.kind === "bed") {
    const bed = beds.find((candidate) => candidate.id === target.id);
    return {
      zoneId: bed?.zone_id ?? null,
      bedId: bed?.id ?? null,
      plantInstanceId: null
    };
  }
  if (target.kind === "zone") {
    const zone = zones.find((candidate) => candidate.id === target.id);
    return {
      zoneId: zone?.id ?? null,
      bedId: null,
      plantInstanceId: null
    };
  }
  return { zoneId: null, bedId: null, plantInstanceId: null };
}

function targetLabel(target: AskTarget, zones: GardenZone[], beds: GardenBed[], plants: GardenPlantInstance[]) {
  if (target.kind === "plant") {
    const plant = plants.find((candidate) => candidate.id === target.id);
    return plant ? getCatalogPlantName(plant) : "Plant";
  }
  if (target.kind === "bed") {
    const bed = beds.find((candidate) => candidate.id === target.id);
    return bed ? bed.name : "Bed";
  }
  if (target.kind === "zone") {
    const zone = zones.find((candidate) => candidate.id === target.id);
    return zone ? zone.name : "Place";
  }
  return "Whole garden";
}

function answerNote(prompt: string, _diagnosis: GardenAskDiagnosis) {
  return prompt.trim() || "Photo note";
}

function cleanFollowUp(followUp: string) {
  return followUp.trim().replace(/^(look|watch)\s+for:?\s*/i, "");
}

export function GardenAskView(props: GardenAskViewProps) {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [diagnosis, setDiagnosis] = useState<GardenAskDiagnosis | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [saveTarget, setSaveTarget] = useState<AskTarget>({ kind: "property", id: "property" });
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const [savedActions, setSavedActions] = useState<Set<number>>(new Set());
  const [waitingIndex, setWaitingIndex] = useState(0);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const routes = props.routes ?? {
    memory: "/app/garden-memory",
    care: "/app/calendar",
    guide: "/app/plant-catalogue"
  };
  const followUp = diagnosis ? cleanFollowUp(diagnosis.follow_up) : "";

  const growingPlants = props.plants.filter((plant) => plant.status === "growing");
  const plantCount = `${growingPlants.length} ${growingPlants.length === 1 ? "plant" : "plants"}`;
  const bedCount = `${props.beds.length} ${props.beds.length === 1 ? "bed" : "beds"}`;
  const contextSummary = props.activeProperty
    ? `${plantCount} in ${bedCount}`
    : "No garden yet";
  const canAskGarden = Boolean(prompt.trim() || file);
  const targetOptions = useMemo(() => {
    const options: Array<{ value: string; label: string }> = [
      { value: targetValue({ kind: "property", id: "property" }), label: "Whole garden" }
    ];
    for (const zone of props.zones) options.push({ value: targetValue({ kind: "zone", id: zone.id }), label: `${zone.name} place` });
    for (const bed of props.beds) options.push({ value: targetValue({ kind: "bed", id: bed.id }), label: `${bed.name} in ${getZoneName(props.zones, bed.zone_id)}` });
    for (const plant of growingPlants) options.push({ value: targetValue({ kind: "plant", id: plant.id }), label: `${getCatalogPlantName(plant)} in ${getBedName(props.beds, plant.bed_id)}` });
    return options;
  }, [growingPlants, props.beds, props.zones]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (!loading) return;
    const interval = window.setInterval(() => {
      setWaitingIndex((index) => (index + 1) % WAITING_LINES.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, [loading]);

  function onFile(next: File | null) {
    setPreview((url) => {
      if (url) URL.revokeObjectURL(url);
      return next ? URL.createObjectURL(next) : null;
    });
    setFile(next);
  }

  async function getDiagnosis(cleanPrompt: string, imageDataUrl: string | null) {
    const context = buildGardenContext(props);
    if (props.askGarden) {
      return props.askGarden({
        context,
        symptoms: cleanPrompt,
        imageDataUrl
      });
    }

    const response = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context,
        symptoms: cleanPrompt,
        imageDataUrl
      })
    });
    const payload = (await response.json()) as { ok?: boolean; message?: string; diagnosis?: GardenAskDiagnosis };
    if (!response.ok || !payload.ok || !payload.diagnosis) {
      throw new Error(payload.message || "We couldn't look at your garden right now.");
    }
    return payload.diagnosis;
  }

  async function submitGardenQuestion(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt && !file) return;
    setLoading(true);
    setError("");
    setMessage("");
    setDiagnosis(null);
    setSavedNote(false);
    setSavedActions(new Set());
    setShowTargetPicker(false);
    setSubmittedPrompt(cleanPrompt || "Photo note");
    try {
      const imageDataUrl = file ? await compressImage(file) : null;
      setDiagnosis(await getDiagnosis(cleanPrompt, imageDataUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't look at your garden right now.");
    } finally {
      setLoading(false);
    }
  }

  async function saveAnswerToGarden() {
    if (!diagnosis || !props.activeProperty || savedNote) return;
    await props.quickLog({
      note: answerNote(submittedPrompt, diagnosis),
      file,
      ...targetScope(saveTarget, props.zones, props.beds, props.plants)
    });
    setSavedNote(true);
    setShowTargetPicker(false);
    setMessage(`Kept with ${targetLabel(saveTarget, props.zones, props.beds, props.plants)}.`);
  }

  async function addActionToCareList(action: string, index: number) {
    if (!props.activeProperty || savedActions.has(index)) return;
    const scope = targetScope(saveTarget, props.zones, props.beds, props.plants);
    await props.addTask({
      title: action,
      dueOn: getTodayISO(),
      notes: diagnosis ? `From this garden note: ${diagnosis.summary}` : "From this garden note.",
      propertyId: props.activeProperty.id,
      zoneId: scope.zoneId,
      bedId: scope.bedId,
      plantInstanceId: scope.plantInstanceId
    });
    setSavedActions((items) => new Set(items).add(index));
    setMessage("Added to weekly care.");
  }

  function startFollowUp() {
    setPrompt(submittedPrompt ? `${submittedPrompt}\n\nFollow-up: ` : "");
    setDiagnosis(null);
    setMessage("");
    setError("");
    requestAnimationFrame(() => promptRef.current?.focus());
  }

  return (
    <section className="garden-ai-home" data-state={diagnosis ? "answered" : loading ? "loading" : "empty"}>
      {!diagnosis ? (
        <div className="garden-ai-entry">
          <div className="garden-ai-kicker">
            <SpecimenLabel tone="olive">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</SpecimenLabel>
            <span>{contextSummary}</span>
          </div>
          <h1 className="garden-ai-lead">Your garden, smarter.</h1>
          <p className="garden-ai-sublead">
            Add what changed. Get one next step.
          </p>
          <form className="garden-ai-composer" onSubmit={submitGardenQuestion}>
            {!props.activeProperty && (
              <div className="garden-notice" role="note">
                Set up your garden to save notes and care tasks from your answers.{' '}
                <a href="/app/garden-memory" className="garden-link-button">Get started</a>
              </div>
            )}
            <label className="sr-only" htmlFor="garden-ai-question">What changed in your garden?</label>
            <textarea
              id="garden-ai-question"
              ref={promptRef}
              value={prompt}
              rows={5}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Yellow leaves, spots, storm damage..."
            />
            {preview ? (
              <div className="garden-ai-photo-preview">
                <img src={preview} alt="Photo added to this garden note" />
                <button type="button" onClick={() => onFile(null)}>
                  Remove photo
                </button>
              </div>
            ) : null}
            <div className="garden-ai-composer__actions">
              <button
                aria-label="Add a photo"
                className="garden-ai-photo-button"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Add a photo
              </button>
              <input
                ref={fileInputRef}
                aria-hidden="true"
                className="garden-ai-photo-input"
                tabIndex={-1}
                type="file"
                accept="image/*"
                onChange={(event) => onFile(event.target.files?.[0] ?? null)}
              />
              <button className="garden-ai-send" type="submit" disabled={loading || !canAskGarden}>
                {loading ? "Looking closely..." : "Get next step"}
              </button>
            </div>
            <p className="garden-ai-composer__hint">
              The answer can use the plants, places, and notes you have saved.
            </p>
          </form>
          {!props.activeProperty ? (
            <section className="garden-ai-start-panel" aria-labelledby="garden-ai-start-title">
              <SpecimenLabel tone="clay">Start small</SpecimenLabel>
              <h2 id="garden-ai-start-title">Start with one plant.</h2>
              <p>Name where it grows so notes, photos, and care can stay together.</p>
              <Link className="folio-link" href={routes.memory}>
                Give one plant a home
              </Link>
            </section>
          ) : null}
          {!prompt.trim() && !file ? (
            <div className="garden-ai-prompts" aria-label="Suggested garden notes">
              {PROMPT_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setPrompt(example);
                    requestAnimationFrame(() => promptRef.current?.focus());
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="garden-ai-loading" aria-live="polite">
          <span aria-hidden="true" />
          <p>{WAITING_LINES[waitingIndex]}</p>
        </div>
      ) : null}

      {error ? <p className="garden-ai-message garden-ai-message--error" role="alert">{error}</p> : null}
      {message ? <p className="garden-ai-message" role="status">{message}</p> : null}

      {diagnosis ? (
        <article className="garden-ai-answer" aria-label="Garden answer">
          <p className="garden-ai-question-memory">"{submittedPrompt}"</p>
          <h2 className="garden-ai-answer__summary">{diagnosis.summary}</h2>

          {diagnosis.actions.length ? (
            <section className="garden-ai-answer__section">
              <SpecimenLabel tone="clay">Do this first</SpecimenLabel>
              <div className="garden-ai-action-list" aria-label="Suggested care ideas">
                <div className="garden-ai-action garden-ai-action--primary">
                  <span>{diagnosis.actions[0]}</span>
                  <button
                    className="folio-button"
                    type="button"
                    disabled={!props.activeProperty || props.isSaving || savedActions.has(0)}
                    onClick={() => addActionToCareList(diagnosis.actions[0], 0)}
                  >
                    {savedActions.has(0) ? "Added" : "Add to weekly care"}
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {followUp ? (
            <section className="garden-ai-answer__section garden-ai-followup-section">
              <p className="garden-ai-followup">
                <span>Watch for:</span> {followUp}
              </p>
            </section>
          ) : null}

          <section className="garden-ai-answer__section garden-ai-save">
            <div>
              <SpecimenLabel tone="clay">Remember this</SpecimenLabel>
              <p>Keep it with the right plant or bed so it is easy to find later.</p>
            </div>
            <div className="garden-ai-save-target">
              <span>Keep with</span>
              <strong>{targetLabel(saveTarget, props.zones, props.beds, props.plants)}</strong>
              <button
                aria-controls="ask-save-target-select"
                aria-expanded={showTargetPicker}
                type="button"
                onClick={() => setShowTargetPicker((value) => !value)}
              >
                {showTargetPicker ? "Done" : "Change"}
              </button>
            </div>
            {showTargetPicker ? (
              <label htmlFor="ask-save-target-select">
                <span>Choose where to keep it</span>
                <select id="ask-save-target-select" value={targetValue(saveTarget)} onChange={(event) => setSaveTarget(parseTarget(event.target.value))}>
                  {targetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <div className="garden-ai-save__actions">
              <button className="folio-button" type="button" onClick={startFollowUp}>
                Add more detail
              </button>
              <button
                className="button"
                type="button"
                disabled={!props.activeProperty || props.isSaving || savedNote}
                onClick={saveAnswerToGarden}
              >
                {savedNote ? "Kept" : "Keep note"}
              </button>
            </div>
            {!props.activeProperty ? (
              <p className="garden-ai-save__hint">
                Start your garden to keep notes where they belong.
              </p>
            ) : null}
          </section>

          <section className="garden-ai-answer__section garden-ai-why-section">
            <details className="garden-ai-why">
              <summary>
                <SpecimenLabel tone="clay">Why this step fits</SpecimenLabel>
                <span>See the notes and season behind this step.</span>
              </summary>
              {diagnosis.causes.length ? (
                <div className="garden-ai-cause-list">
                  {diagnosis.causes.map((cause) => (
                    <div className="garden-ai-cause" key={`${cause.cause}-${cause.confidence}`}>
                      <div>
                        <strong>{cause.cause}</strong>
                        <span>{confidenceLabel(cause.confidence)}</span>
                      </div>
                      <p>{cause.detail}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="garden-ai-why__fallback">From your notes and season.</p>
              )}
            </details>
          </section>

          {diagnosis.actions.length > 1 ? (
            <section className="garden-ai-answer__section garden-ai-more-section">
              <details className="garden-ai-more-checks">
                <summary>
                  <SpecimenLabel tone="clay">More care ideas</SpecimenLabel>
                  <span>More care ideas if the first one is not enough.</span>
                </summary>
                <div className="garden-ai-secondary-actions" aria-label="More care ideas">
                  {diagnosis.actions.slice(1, 4).map((action, offset) => {
                    const actionIndex = offset + 1;
                    return (
                      <div className="garden-ai-secondary-action" key={action}>
                        <p>{action}</p>
                        <button
                          type="button"
                          disabled={!props.activeProperty || props.isSaving || savedActions.has(actionIndex)}
                          onClick={() => addActionToCareList(action, actionIndex)}
                        >
                          {savedActions.has(actionIndex) ? "Added" : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </details>
            </section>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
