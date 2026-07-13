"use client";

import Link from "next/link";
import { FormEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";
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

type GardenPlantContext = {
  id: string;
  name: string;
  location: string;
  href: string;
};

type GardenChatTurn = {
  id: string;
  prompt: string;
  diagnosis: GardenAskDiagnosis;
  plantContexts: GardenPlantContext[];
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
  /** Override the rotating example prompts (the tour passes questions its
      canned answers can actually honor). */
  promptExamples?: string[];
};

const PROMPT_EXAMPLES = [
  "When did we get rain last?",
  "What's wrong with this plant?",
  "Can I plant pomegranate here?",
  "When should my fava beans get harvested?",
  "Are these ready to pick?",
  "Why are these leaves yellowing?",
  "Did last night's storm damage anything?",
  "Should I water today or wait?",
  "What should I plant in this empty bed?",
  "Can basil grow next to these tomatoes?",
  "Is this powdery mildew?",
  "What ate these leaves?",
  "Are these peppers sunscalded?",
  "When should I prune this fig?",
  "Can I move this rosemary now?",
  "What should I succession sow this week?",
  "Is this bed too shady for eggplant?",
  "When should I start fall carrots?",
  "Are these tomatoes ripe enough?",
  "Why did this seedling collapse?",
  "Should I cut off these damaged leaves?",
  "What can I plant after garlic?",
  "When should I harvest potatoes?",
  "Is this blossom end rot?",
  "Do these beans need a trellis?",
  "Can I plant citrus here?",
  "Which bed should get lettuce next?",
  "What should I do before the heat wave?",
  "Did the cold snap hurt my seedlings?",
  "Should I fertilize this week?",
  "What is causing these brown spots?",
  "Are these squash ready?",
  "Can I plant asparagus here?",
  "When should I harvest garlic?",
  "Should I thin these carrots?",
  "What herbs can handle this sun?",
  "Is this normal new growth?",
  "How often should I water this container?",
  "Can I grow blueberries in this soil?",
  "What should I check after heavy rain?",
  "Are these cucumbers overripe?",
  "Should I pinch basil flowers?",
  "When should I divide these irises?",
  "Can I plant strawberries in this bed?",
  "What's the best mulch for this area?",
  "Why are my seedlings leggy?",
  "Is this pest damage or disease?",
  "What should I plant before frost?",
  "Are these onions ready to cure?",
  "Can I plant lavender here?",
  "When should I harvest dill seed?",
  "Should I remove this volunteer tomato?",
  "What's a good companion for peppers?",
  "Can I direct sow peas now?",
  "Why are these leaves curling?",
  "Is this too much nitrogen?",
  "What should I do with bolting lettuce?",
  "When did I last fertilize this bed?",
  "Can this plant survive winter here?",
  "Are these figs ready?",
  "Should I deadhead these flowers?",
  "What is growing in this pot?",
  "Can I plant fava beans now?",
  "When should I harvest sweet potatoes?",
  "Why are my tomato flowers dropping?",
  "Do these plants need more support?",
  "What should I do after hail?",
  "Can I grow artichokes here?",
  "Are these melons ripe?",
  "Should I shade cloth this bed?",
  "When should I sow cover crop?",
  "What can go in this wet spot?",
  "Is this compost ready to use?",
  "Can I plant cilantro again now?",
  "Why are the lower leaves dying?",
  "Should I prune suckers on this tomato?",
  "What should I harvest this week?",
  "When did this plant start fruiting?",
  "Can I plant raspberries here?",
  "Are these seed pods mature?",
  "Should I split this overcrowded clump?",
  "What's the best spot for mint?",
  "Can I save seeds from this?",
  "Why is this plant not flowering?",
  "Should I water after adding mulch?",
  "What disease pressure should I watch?",
  "Can I plant kale in this heat?",
  "Are these roots healthy?",
  "When should I stop watering onions?",
  "What should I do with yellow cucumber leaves?",
  "Can I grow grapes along this fence?",
  "Are these seedlings ready to transplant?",
  "Should I remove fruit from a young tree?",
  "What bed had tomatoes last year?",
  "Can I plant potatoes here again?",
  "Why are these herbs bitter?",
  "When should I harvest pomegranates?",
  "What's next for this bed after harvest?",
  "Are these flowers attracting pollinators?",
  "Should I net these berries?",
  "What can I plant for winter greens?",
  "Did we get enough rain for new transplants?",
  "Can I grow ginger here?",
  "Are these leaves nutrient deficient?",
  "When should I cut back asparagus ferns?",
  "What should I do with this bare patch?"
];

const WAITING_LINES = [
  "Looking at what changed...",
  "Checking your notes and season...",
  "Looking through your garden history...",
  "Checking the photo with your garden notes..."
];

const MAX_IMAGE_DIM = 1024;

function shufflePromptExamples(source: string[] = PROMPT_EXAMPLES) {
  const prompts = [...source];
  for (let index = prompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [prompts[index], prompts[swapIndex]] = [prompts[swapIndex], prompts[index]];
  }
  return prompts;
}

type GardenAiIconName = "history" | "book" | "search" | "garden" | "calendar" | "send";

function GardenAiIcon({ name }: { name: GardenAiIconName }) {
  if (name === "history") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M4 12a8 8 0 1 0 2.35-5.65" />
        <path d="M4 5.5v4h4" />
        <path d="M12 8v4.4l3 1.8" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M5 4.5h5.25A2.75 2.75 0 0 1 13 7.25V20a2.5 2.5 0 0 0-2.5-2.5H5Z" />
        <path d="M19 4.5h-5.25A2.75 2.75 0 0 0 11 7.25V20a2.5 2.5 0 0 1 2.5-2.5H19Z" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <circle cx="10.5" cy="10.5" r="5.8" />
        <path d="m15 15 4.5 4.5" />
      </svg>
    );
  }
  if (name === "garden") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M4.5 19.5h15" />
        <path d="M7 19.5v-5.25a4.75 4.75 0 0 1 9.5 0v5.25" />
        <path d="M12 14.75V6" />
        <path d="M12 8.5c-2.75 0-4.5-1.2-5.25-3.6C9.35 4.55 11.1 5.75 12 8.5Z" />
        <path d="M12 10.5c2.75 0 4.5-1.2 5.25-3.6C14.65 6.55 12.9 7.75 12 10.5Z" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M7 3.5v3" />
        <path d="M17 3.5v3" />
        <rect x="4.5" y="5.5" width="15" height="14" rx="2" />
        <path d="M4.5 9.5h15" />
        <path d="M8 13h3" />
        <path d="M13.5 13h2.5" />
        <path d="M8 16h3" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M4 12.5 20 4l-6.5 16-2.75-6.75Z" />
      <path d="m10.75 13.25 4.6-4.6" />
    </svg>
  );
}

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

// Open care due today OR still waiting from earlier — an overdue task is more
// urgent than a today task, not less, so it must count toward the chip.
function dueOrOverdue(tasks: GardenTask[]) {
  const today = getTodayISO();
  return tasks.filter(
    (task) => task.status !== "done" && Boolean(task.due_on) && (task.due_on as string) <= today
  );
}

function mostRecentObservation(observations: GardenObservation[]) {
  return observations[0]?.note ?? null;
}

function trimMemoryNote(note: string) {
  return note.length > 92 ? `${note.slice(0, 89).trim()}...` : note;
}

function cleanFollowUp(followUp: string) {
  return followUp.trim().replace(/^(look|watch)\s+for:?\s*/i, "");
}

function normalizePlantText(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pluralVariants(term: string) {
  const variants = new Set([term]);
  if (term.endsWith("y")) variants.add(`${term.slice(0, -1)}ies`);
  variants.add(`${term}s`);
  variants.add(`${term}es`);
  return Array.from(variants);
}

function haystackIncludesTerm(haystack: string, term: string) {
  const normalizedTerm = normalizePlantText(term);
  if (!normalizedTerm) return false;
  return pluralVariants(normalizedTerm).some((variant) => haystack.includes(variant));
}

function plantTerms(plant: GardenPlantInstance) {
  const profile = plant.plant_profile;
  const values = [
    getCatalogPlantName(plant),
    profile?.primary_common_name,
    profile?.display_name,
    profile?.botanical_name_full,
    profile?.slug?.replace(/-/g, " ")
  ];
  const terms = new Set<string>();
  for (const value of values) {
    const normalized = normalizePlantText(value);
    if (!normalized) continue;
    terms.add(normalized);
    for (const word of normalized.split(" ")) {
      if (word.length >= 4) terms.add(word);
    }
  }
  return Array.from(terms).filter((term) => !["plant", "herb", "tree", "bush"].includes(term));
}

function isContextualFollowUp(haystack: string) {
  return /\b(it|its|this|that|these|those|they|them|same|plant|leaves|leaf|fruit|blooms|flowers|ready|prune|harvest|water)\b/.test(haystack);
}

function identifyPlantContexts(
  input: {
    prompt: string;
    diagnosis: GardenAskDiagnosis;
    plants: GardenPlantInstance[];
    beds: GardenBed[];
    zones: GardenZone[];
    memoryRoute: string;
    previousPlantContexts?: GardenPlantContext[];
  }
): GardenPlantContext[] {
  const promptHaystack = normalizePlantText(input.prompt);
  if (!promptHaystack) return [];

  const growingPlants = input.plants.filter((plant) => plant.status === "growing");
  const matchedPlants: GardenPlantInstance[] = [];
  const matchedIds = new Set<string>();

  const includePlantContext = (plant: GardenPlantInstance) => {
    if (matchedIds.has(plant.id)) return;
    matchedIds.add(plant.id);
    matchedPlants.push(plant);
  };

  for (const plant of growingPlants) {
    if (plantTerms(plant).some((term) => haystackIncludesTerm(promptHaystack, term))) {
      includePlantContext(plant);
    }
  }

  for (const bed of input.beds) {
    if (!haystackIncludesTerm(promptHaystack, bed.name)) continue;
    for (const plant of growingPlants.filter((candidate) => candidate.bed_id === bed.id)) {
      includePlantContext(plant);
    }
  }

  for (const zone of input.zones) {
    if (!haystackIncludesTerm(promptHaystack, zone.name)) continue;
    for (const plant of growingPlants.filter((candidate) => candidate.zone_id === zone.id)) {
      includePlantContext(plant);
    }
  }

  if (!matchedPlants.length && input.previousPlantContexts?.length && isContextualFollowUp(promptHaystack)) {
    return input.previousPlantContexts.slice(0, 5);
  }

  return matchedPlants
    .slice(0, 5)
    .map((plant) => {
      const bedName = getBedName(input.beds, plant.bed_id);
      const zoneName = getZoneName(input.zones, plant.zone_id);
      const location = [bedName, zoneName].filter(Boolean).join(", ") || "Garden";
      return {
        id: plant.id,
        name: getCatalogPlantName(plant),
        location,
        href: `${input.memoryRoute}?plant=${encodeURIComponent(plant.id)}`
      };
    });
}

export function GardenAskView(props: GardenAskViewProps) {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<GardenChatTurn[]>([]);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [saveTarget, setSaveTarget] = useState<AskTarget>({ kind: "property", id: "property" });
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [savedNotes, setSavedNotes] = useState<Set<string>>(new Set());
  const [savedActions, setSavedActions] = useState<Set<string>>(new Set());
  const [waitingIndex, setWaitingIndex] = useState(0);
  const [promptExamples, setPromptExamples] = useState(props.promptExamples ?? PROMPT_EXAMPLES);
  const [promptExampleIndex, setPromptExampleIndex] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const routes = props.routes ?? {
    memory: "/app/my-garden",
    care: "/app/calendar",
    guide: "/app/plant-catalogue"
  };

  const growingPlants = props.plants.filter((plant) => plant.status === "growing");
  const canAskGarden = Boolean(prompt.trim() || file);
  const conversationStarted = conversation.length > 0 || loading;
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
    setPromptExamples(shufflePromptExamples(props.promptExamples));
  }, []);

  useEffect(() => {
    if (prompt.trim() || file) return;
    const interval = window.setInterval(() => {
      setPromptExampleIndex((index) => (index + 1) % promptExamples.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [file, prompt, promptExamples.length]);

  useEffect(() => {
    setPromptExampleIndex(0);
  }, [promptExamples]);

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
    setShowAttachmentMenu(false);
  }

  function openAttachmentInput(ref: RefObject<HTMLInputElement | null>) {
    setShowAttachmentMenu(false);
    ref.current?.click();
  }

  function focusComposer() {
    requestAnimationFrame(() => promptRef.current?.focus());
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
    const turnPrompt = cleanPrompt || "Photo note";
    setLoading(true);
    setError("");
    setMessage("");
    setShowTargetPicker(false);
    setPendingPrompt(turnPrompt);
    try {
      const imageDataUrl = file ? await compressImage(file) : null;
      const nextDiagnosis = await getDiagnosis(cleanPrompt, imageDataUrl);
      setConversation((turns) => [
        ...turns,
        {
          id: `${Date.now()}-${turns.length}`,
          prompt: turnPrompt,
          diagnosis: nextDiagnosis,
          plantContexts: identifyPlantContexts({
            prompt: turnPrompt,
            diagnosis: nextDiagnosis,
            plants: props.plants,
            beds: props.beds,
            zones: props.zones,
            memoryRoute: routes.memory,
            previousPlantContexts: turns.at(-1)?.plantContexts
          })
        }
      ]);
      setPrompt("");
      onFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't look at your garden right now.");
    } finally {
      setLoading(false);
      setPendingPrompt("");
    }
  }

  async function saveAnswerToGarden(turn: GardenChatTurn) {
    if (!props.activeProperty || savedNotes.has(turn.id)) return;
    await props.quickLog({
      note: answerNote(turn.prompt, turn.diagnosis),
      file,
      ...targetScope(saveTarget, props.zones, props.beds, props.plants)
    });
    setSavedNotes((items) => new Set(items).add(turn.id));
    setShowTargetPicker(false);
    setMessage(`Kept with ${targetLabel(saveTarget, props.zones, props.beds, props.plants)}.`);
  }

  async function addActionToCareList(turn: GardenChatTurn, action: string, index: number) {
    const actionKey = `${turn.id}:${index}`;
    if (!props.activeProperty || savedActions.has(actionKey)) return;
    const scope = targetScope(saveTarget, props.zones, props.beds, props.plants);
    await props.addTask({
      title: action,
      dueOn: getTodayISO(),
      notes: `From this garden note: ${turn.diagnosis.summary}`,
      propertyId: props.activeProperty.id,
      zoneId: scope.zoneId,
      bedId: scope.bedId,
      plantInstanceId: scope.plantInstanceId
    });
    setSavedActions((items) => new Set(items).add(actionKey));
    setMessage("Added to weekly care.");
  }

  function startFollowUp() {
    setPrompt("");
    setMessage("");
    setError("");
    requestAnimationFrame(() => promptRef.current?.focus());
  }

  function renderMemoryStrip() {
    if (!props.activeProperty) return null;

    const todayTasks = dueOrOverdue(props.tasks);
    const todayISO = getTodayISO();
    const overdueCount = todayTasks.filter((task) => (task.due_on as string) < todayISO).length;
    const recentObservation = mostRecentObservation(props.observations);
    const growingCount = growingPlants.length;
    const placeCount = props.zones.length;

    return (
      <section className="garden-ai-memory-strip" aria-label="Garden memory snapshot">
        <div className="garden-ai-memory-strip__header">
          <span>{props.activeProperty.name}</span>
          <strong>{props.activeProperty.region || props.activeProperty.season || "Garden memory"}</strong>
        </div>
        <div className="garden-ai-memory-strip__facts">
          <span>{growingCount} growing plant{growingCount === 1 ? "" : "s"}</span>
          <span>{placeCount} place{placeCount === 1 ? "" : "s"}</span>
          <span>
            {todayTasks.length === 0
              ? "No urgent care today"
              : overdueCount > 0
                ? `${todayTasks.length} care item${todayTasks.length === 1 ? "" : "s"} waiting`
                : `${todayTasks.length} care item${todayTasks.length === 1 ? "" : "s"} today`}
          </span>
        </div>
        {recentObservation ? (
          <p>
            Latest note: <span>{trimMemoryNote(recentObservation)}</span>
          </p>
        ) : null}
        <Link className="garden-ai-memory-strip__link" href={routes.memory}>
          Open garden memory
        </Link>
      </section>
    );
  }

  function renderComposer(mode: "empty" | "chat") {
    return (
      <form className={`garden-ai-composer${mode === "chat" ? " garden-ai-composer--chat" : ""}`} onSubmit={submitGardenQuestion}>
        {!props.activeProperty && (
          <div className="garden-notice" role="note">
            Set up your garden to save notes and care tasks from your answers.{' '}
            <a href="/app/my-garden" className="garden-link-button">Get started</a>
          </div>
        )}
        <label className="sr-only" htmlFor="garden-ai-question">Ask about your garden</label>
        <textarea
          id="garden-ai-question"
          ref={promptRef}
          value={prompt}
          rows={mode === "chat" ? 2 : 3}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={mode === "chat" ? "Ask a follow-up..." : "Ask about your garden..."}
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
          <div className="garden-ai-attachment">
            <button
              aria-controls="garden-ai-attachment-menu"
              aria-expanded={showAttachmentMenu}
              aria-label="Add attachment"
              className="garden-ai-attachment-button"
              type="button"
              onClick={() => setShowAttachmentMenu((value) => !value)}
            >
              +
            </button>
            <div
              id="garden-ai-attachment-menu"
              className="garden-ai-attachment-menu"
              role="menu"
              hidden={!showAttachmentMenu}
            >
              <button type="button" role="menuitem" onClick={() => openAttachmentInput(fileInputRef)}>
                Add file
              </button>
              <button
                aria-label="Add a photo"
                type="button"
                role="menuitem"
                onClick={() => openAttachmentInput(photoInputRef)}
              >
                Add photo
              </button>
              <button
                className="garden-ai-attachment-menu__camera"
                type="button"
                role="menuitem"
                onClick={() => openAttachmentInput(cameraInputRef)}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                  <path d="M8.5 6.5 10 4.5h4l1.5 2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h3.5Z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                <span>Take photo</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              aria-hidden="true"
              className="garden-ai-photo-input"
              tabIndex={-1}
              type="file"
              accept="image/*"
              onChange={(event) => onFile(event.target.files?.[0] ?? null)}
            />
            <input
              ref={photoInputRef}
              aria-hidden="true"
              className="garden-ai-photo-input"
              tabIndex={-1}
              type="file"
              accept="image/*"
              onChange={(event) => onFile(event.target.files?.[0] ?? null)}
            />
            <input
              ref={cameraInputRef}
              aria-hidden="true"
              className="garden-ai-photo-input"
              tabIndex={-1}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => onFile(event.target.files?.[0] ?? null)}
            />
          </div>
          <button
            aria-label={loading ? "Looking closely" : "Send"}
            className="garden-ai-send"
            type="submit"
            disabled={loading || !canAskGarden}
          >
            {loading ? (
              <span className="garden-ai-send__busy" aria-hidden="true" />
            ) : (
              <GardenAiIcon name="send" />
            )}
          </button>
        </div>
      </form>
    );
  }

  function renderContextChips(turn: GardenChatTurn) {
    if (!turn.plantContexts.length) return null;
    return (
      <div className="garden-ai-context-strip" aria-label="Plant context used">
        <span>Context</span>
        {turn.plantContexts.map((plant) => (
          <Link
            className="garden-ai-context-chip"
            data-tooltip={`${plant.name} · ${plant.location}`}
            href={plant.href}
            key={plant.id}
          >
            {plant.name}
          </Link>
        ))}
      </div>
    );
  }

  function renderAssistantTurn(turn: GardenChatTurn) {
    const turnFollowUp = cleanFollowUp(turn.diagnosis.follow_up);
    const noteSaved = savedNotes.has(turn.id);
    return (
      <article className="garden-ai-message-bubble garden-ai-message-bubble--assistant" aria-label="Garden answer" key={`${turn.id}-assistant`}>
        <div className="garden-ai-answer">
          <h2 className="garden-ai-answer__summary">{turn.diagnosis.summary}</h2>
          {renderContextChips(turn)}

          {turn.diagnosis.actions.length ? (
            <section className="garden-ai-answer__section">
              <SpecimenLabel tone="clay">Do this first</SpecimenLabel>
              <div className="garden-ai-action-list" aria-label="Suggested care ideas">
                <div className="garden-ai-action garden-ai-action--primary">
                  <span>{turn.diagnosis.actions[0]}</span>
                  <button
                    className="folio-button"
                    type="button"
                    disabled={!props.activeProperty || props.isSaving || savedActions.has(`${turn.id}:0`)}
                    onClick={() => addActionToCareList(turn, turn.diagnosis.actions[0], 0)}
                  >
                    {savedActions.has(`${turn.id}:0`) ? "Added" : "Add to weekly care"}
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {turnFollowUp ? (
            <section className="garden-ai-answer__section garden-ai-followup-section">
              <p className="garden-ai-followup">
                <span>Watch for:</span> {turnFollowUp}
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
                disabled={!props.activeProperty || props.isSaving || noteSaved}
                onClick={() => saveAnswerToGarden(turn)}
              >
                {noteSaved ? "Kept" : "Keep note"}
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
              {turn.diagnosis.causes.length ? (
                <div className="garden-ai-cause-list">
                  {turn.diagnosis.causes.map((cause) => (
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

          {turn.diagnosis.actions.length > 1 ? (
            <section className="garden-ai-answer__section garden-ai-more-section">
              <details className="garden-ai-more-checks">
                <summary>
                  <SpecimenLabel tone="clay">More care ideas</SpecimenLabel>
                  <span>More care ideas if the first one is not enough.</span>
                </summary>
                <div className="garden-ai-secondary-actions" aria-label="More care ideas">
                  {turn.diagnosis.actions.slice(1, 4).map((action, offset) => {
                    const actionIndex = offset + 1;
                    const actionKey = `${turn.id}:${actionIndex}`;
                    return (
                      <div className="garden-ai-secondary-action" key={action}>
                        <p>{action}</p>
                        <button
                          type="button"
                          disabled={!props.activeProperty || props.isSaving || savedActions.has(actionKey)}
                          onClick={() => addActionToCareList(turn, action, actionIndex)}
                        >
                          {savedActions.has(actionKey) ? "Added" : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </details>
            </section>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <section className="garden-ai-home" data-state={conversationStarted ? "chat" : "empty"}>
      <nav className="garden-ai-topbar" aria-label="Garden shortcuts">
        <Link className="garden-ai-brand" href="/app/my-property" aria-label="Garden.io home">
          G
        </Link>
        <div className="garden-ai-topbar__actions">
          <button className="garden-ai-icon-button" type="button" aria-label="Chat history" data-tooltip="Chat history" onClick={focusComposer}>
            <GardenAiIcon name="history" />
          </button>
          <Link className="garden-ai-icon-button" href={routes.guide} aria-label="Open plant catalogue" data-tooltip="Plant catalogue">
            <GardenAiIcon name="book" />
          </Link>
          <button className="garden-ai-icon-button" type="button" aria-label="Search garden and catalogue" data-tooltip="Search" onClick={focusComposer}>
            <GardenAiIcon name="search" />
          </button>
          <Link className="garden-ai-icon-button" href={routes.memory} aria-label="Open my garden" data-tooltip="My garden">
            <GardenAiIcon name="garden" />
          </Link>
          <Link className="garden-ai-icon-button" href={routes.care} aria-label="Open weekly care" data-tooltip="Weekly care">
            <GardenAiIcon name="calendar" />
          </Link>
        </div>
      </nav>

      {!conversationStarted ? (
        <div className="garden-ai-entry">
          <h1 className="sr-only">Ask Garden.io</h1>
          {renderMemoryStrip()}
          {renderComposer("empty")}
          {!prompt.trim() && !file ? (
            <div className="garden-ai-prompts" aria-label="Suggested garden notes">
              <button
                key={promptExamples[promptExampleIndex]}
                type="button"
                onClick={() => {
                  setPrompt(promptExamples[promptExampleIndex]);
                  requestAnimationFrame(() => promptRef.current?.focus());
                }}
              >
                {promptExamples[promptExampleIndex]}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="garden-ai-chat-shell">
          <div className="garden-ai-thread" aria-label="Garden chat thread">
            {conversation.map((turn) => (
              <div className="garden-ai-turn" key={turn.id}>
                <div className="garden-ai-message-bubble garden-ai-message-bubble--user">
                  <p>{turn.prompt}</p>
                </div>
                {renderAssistantTurn(turn)}
              </div>
            ))}
            {loading ? (
              <div className="garden-ai-turn garden-ai-turn--pending">
                {pendingPrompt ? (
                  <div className="garden-ai-message-bubble garden-ai-message-bubble--user">
                    <p>{pendingPrompt}</p>
                  </div>
                ) : null}
                <div className="garden-ai-message-bubble garden-ai-message-bubble--assistant garden-ai-message-bubble--loading" aria-live="polite">
                  <span aria-hidden="true" />
                  <p>{WAITING_LINES[waitingIndex]}</p>
                </div>
              </div>
            ) : null}
          </div>

          {error ? <p className="garden-ai-message garden-ai-message--error" role="alert">{error}</p> : null}
          {message ? <p className="garden-ai-message" role="status">{message}</p> : null}

          <div className="garden-ai-chat-composer">
            {renderComposer("chat")}
          </div>
        </div>
      )}
    </section>
  );
}
