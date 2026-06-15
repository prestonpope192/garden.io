import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Observation & diagnosis assistant (Phase 3B). The OpenAI key stays server-side.
// The client assembles the plant's personal context (real record data) and posts
// it here; we ask a vision model for grounded, honest, actionable guidance.

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
    actions: { type: "array", items: { type: "string" }, description: "Concrete next actions, most useful first." },
    follow_up: { type: "string", description: "A short inspection/check to confirm, or empty string." }
  },
  required: ["summary", "causes", "actions", "follow_up"]
};

const SYSTEM_PROMPT = [
  "You are an experienced, calm gardener advising a grower about THEIR specific plant.",
  "Ground every answer in the plant context provided — species, stage, bed conditions, season, zone, recent notes.",
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
    `Plant: ${ctx.name}${ctx.botanical ? ` (${ctx.botanical})` : ""}`,
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
    return NextResponse.json({ ok: false, message: "The AI assistant is not configured." }, { status: 503 });
  }

  let body: DiagnoseBody;
  try {
    body = (await request.json()) as DiagnoseBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!body?.context?.name || (!body.symptoms?.trim() && !body.imageDataUrl)) {
    return NextResponse.json({ ok: false, message: "Add a description or a photo to diagnose." }, { status: 400 });
  }

  const userContent: Array<Record<string, unknown>> = [
    {
      type: "text",
      text:
        `${buildContextText(body.context)}\n\n` +
        `What I'm seeing: ${body.symptoms?.trim() || "(see the attached photo)"}\n\n` +
        "Give likely causes with confidence and a short why-for-this-plant, concrete next actions, and one follow-up check."
    }
  ];
  if (body.imageDataUrl) {
    userContent.push({ type: "image_url", image_url: { url: body.imageDataUrl } });
  }

  let openaiResponse: Response;
  try {
    openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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
  } catch {
    return NextResponse.json({ ok: false, message: "Could not reach the AI service." }, { status: 502 });
  }

  if (!openaiResponse.ok) {
    const detail = (await openaiResponse.text()).slice(0, 300);
    return NextResponse.json({ ok: false, message: "The AI request failed.", detail }, { status: 502 });
  }

  const payload = (await openaiResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ ok: false, message: "The AI returned no result." }, { status: 502 });
  }

  try {
    const diagnosis = JSON.parse(content);
    return NextResponse.json({ ok: true, diagnosis });
  } catch {
    return NextResponse.json({ ok: false, message: "Could not parse the AI result." }, { status: 502 });
  }
}
