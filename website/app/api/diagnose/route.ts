import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/supabase-server";
import { checkDiagnoseRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Guardrails. Each call hits a paid vision model, so we cap input size and the
// time we'll wait on OpenAI.
const MAX_SYMPTOMS_LEN = 2000;
const MAX_IMAGE_DATA_URL_LEN = 7_000_000; // ~5 MB image encoded as base64
const ALLOWED_IMAGE_MIME = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i;
const OPENAI_TIMEOUT_MS = 45_000;
const DIAGNOSIS_UNAVAILABLE_MESSAGE =
  "We can't look at your garden right now. You can still keep a note and try again later.";
const DIAGNOSIS_BUSY_MESSAGE = "A lot of garden help is queued right now. Please try again in a moment.";
const DIAGNOSIS_RETRY_MESSAGE = "We couldn't finish looking at your garden. Please try again.";

// Garden care-help endpoint. The OpenAI key stays server-side.
// The client assembles the garden or plant context (real record data) and posts
// it here; we use a vision model for grounded, honest, actionable care guidance.

type DiagnoseContext = {
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

type DiagnoseBody = {
  context: DiagnoseContext;
  symptoms?: string;
  imageDataUrl?: string | null;
};

const DIAGNOSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", description: "One calm sentence framing what's likely going on." },
    causes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          cause: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          detail: { type: "string", description: "Why this is plausible for THIS plant/context." }
        },
        required: ["cause", "confidence", "detail"]
      }
    },
    actions: { type: "array", items: { type: "string" }, description: "Concrete care steps, most useful first." },
    follow_up: { type: "string", description: "A short thing to watch for or confirm, or empty string." }
  },
  required: ["summary", "causes", "actions", "follow_up"]
};

const SYSTEM_PROMPT = [
  "You are an experienced, calm gardener advising a grower about THEIR specific garden or plant.",
  "Ground every answer in the context provided — plants, stage, bed conditions, season, zone, recent notes.",
  "Be concrete and actionable. Prefer organic / regenerative practices.",
  "Be honest about uncertainty: when unsure, say so plainly, lower the confidence, and recommend an inspection step instead of guessing.",
  "Never be alarmist. Keep it brief and practical."
].join(" ");

function buildContextText(ctx: DiagnoseContext): string {
  const conditions = [
    ctx.sun ? `sun ${ctx.sun}` : null,
    ctx.water ? `water ${ctx.water}` : null,
    ctx.soil ? `soil ${ctx.soil}` : null
  ].filter(Boolean).join(", ");
  return [
    `Context: ${ctx.name}${ctx.botanical ? ` (${ctx.botanical})` : ""}`,
    ctx.type ? `Type: ${ctx.type}` : null,
    ctx.stage ? `Stage: ${ctx.stage}` : null,
    ctx.location ? `Location: ${ctx.location}` : null,
    conditions ? `Bed conditions: ${conditions}` : null,
    ctx.plantedOn ? `Planted on: ${ctx.plantedOn}` : null,
    ctx.season ? `Season: ${ctx.season}` : null,
    ctx.hardinessZone ? `USDA hardiness zone: ${ctx.hardinessZone}` : null,
    ctx.recentNotes && ctx.recentNotes.length ? `Recent notes: ${ctx.recentNotes.join("; ")}` : null
  ].filter(Boolean).join("\n");
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, message: DIAGNOSIS_UNAVAILABLE_MESSAGE }, { status: 503 });
  }

  // Auth gate: only signed-in users may spend diagnosis budget.
  const { configured, user } = await getRequestUser(request);
  if (!configured) {
    return NextResponse.json({ ok: false, message: DIAGNOSIS_UNAVAILABLE_MESSAGE }, { status: 503 });
  }
  if (!user) {
    return NextResponse.json({ ok: false, message: "Please sign in to ask about your garden." }, { status: 401 });
  }

  // Per-user rate limit.
  const limited = checkDiagnoseRateLimit(user.id);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, message: limited.message }, { status: limited.status });
  }

  let body: DiagnoseBody;
  try {
    body = (await request.json()) as DiagnoseBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Add what changed or a photo, then try again." }, { status: 400 });
  }

  if (!body?.context?.name || (!body.symptoms?.trim() && !body.imageDataUrl)) {
    return NextResponse.json({ ok: false, message: "Add what you are seeing or a photo to ask about your garden." }, { status: 400 });
  }

  // Input caps.
  const symptoms = body.symptoms?.trim().slice(0, MAX_SYMPTOMS_LEN) || "";
  if (body.imageDataUrl) {
    if (!ALLOWED_IMAGE_MIME.test(body.imageDataUrl)) {
      return NextResponse.json({ ok: false, message: "That image format isn't supported. Use a JPEG, PNG, or WebP." }, { status: 400 });
    }
    if (body.imageDataUrl.length > MAX_IMAGE_DATA_URL_LEN) {
      return NextResponse.json({ ok: false, message: "That photo is too large — please use one under ~5 MB." }, { status: 413 });
    }
  }

  const userContent: Array<Record<string, unknown>> = [
    {
      type: "text",
      text:
        `${buildContextText(body.context)}\n\n` +
        `What I'm seeing: ${symptoms || "(see the attached photo)"}\n\n` +
        "Give likely causes with confidence, a short why-for-this-context, concrete care steps, and one thing to watch or confirm."
    }
  ];
  if (body.imageDataUrl) {
    userContent.push({ type: "image_url", image_url: { url: body.imageDataUrl } });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  let openaiResponse: Response;
  try {
    openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o",
        temperature: 0.3,
        max_tokens: 800,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent }
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "plant_diagnosis", strict: true, schema: DIAGNOSIS_SCHEMA }
        }
      })
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { ok: false, message: aborted ? "Looking at this plant is taking too long. Please try again." : DIAGNOSIS_UNAVAILABLE_MESSAGE },
      { status: aborted ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!openaiResponse.ok) {
    // Pass rate limiting / overload through as a friendly retryable message.
    if (openaiResponse.status === 429 || openaiResponse.status === 503) {
      return NextResponse.json({ ok: false, message: DIAGNOSIS_BUSY_MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ ok: false, message: DIAGNOSIS_RETRY_MESSAGE }, { status: 502 });
  }

  const payload = (await openaiResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ ok: false, message: DIAGNOSIS_RETRY_MESSAGE }, { status: 502 });
  }

  try {
    const diagnosis = JSON.parse(content);
    return NextResponse.json({ ok: true, diagnosis });
  } catch {
    return NextResponse.json({ ok: false, message: DIAGNOSIS_RETRY_MESSAGE }, { status: 502 });
  }
}
