import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GardenAskView } from "@/components/views/garden-ask-view";
import type {
  GardenBed,
  GardenObservation,
  GardenPlantInstance,
  GardenProperty,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";

const property: GardenProperty = {
  id: "property-1",
  owner_user_id: "user-1",
  name: "Backyard Garden",
  label: "Garden",
  region: "Central Texas",
  growing_zone: "8b",
  season: "Summer",
  notes: null,
  latitude: null,
  longitude: null,
  location_label: null,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

const zone: GardenZone = {
  id: "zone-1",
  property_id: property.id,
  name: "Kitchen Garden",
  purpose: "Vegetables and herbs",
  light: "Morning sun",
  water: null,
  notes: null,
  sort_order: 0,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

const bed: GardenBed = {
  id: "bed-1",
  property_id: property.id,
  zone_id: zone.id,
  name: "Herb Bed",
  sun: "Full sun",
  water: null,
  soil: null,
  notes: null,
  sort_order: 0,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

const plant: GardenPlantInstance = {
  id: "plant-1",
  property_id: property.id,
  zone_id: zone.id,
  bed_id: bed.id,
  plant_profile_id: "profile-1",
  plant_profile: {
    plant_profile_id: "profile-1",
    slug: "cherokee-purple-tomato",
    plant_taxon_id: "taxon-1",
    plant_cultivar_id: null,
    display_name: "Cherokee Purple Tomato",
    plant_type_code: "vegetable",
    lifecycle_type: "annual",
    botanical_name_full: "Solanum lycopersicum",
    primary_common_name: "Cherokee Purple Tomato",
    short_description: null,
    why_plant_it: null,
    primary_use_cases: null,
    preferred_light: "Full sun",
    water_need_level: "medium",
    propagation_methods: [],
    drainage_requirement: null,
    texture_preferences: {},
    preferred_soil_texture_codes: [],
    soil_texture_summary: null,
    primary_image_url: null,
    ratings: {}
  },
  quantity: 1,
  status: "growing",
  planted_on: "2026-05-01",
  notes: null,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

const observation: GardenObservation = {
  id: "observation-1",
  property_id: property.id,
  zone_id: zone.id,
  bed_id: bed.id,
  plant_instance_id: plant.id,
  note: "First strong bloom after two hot days.",
  image_path: null,
  observed_at: "2026-06-03T00:00:00Z",
  created_at: "2026-06-03T00:00:00Z",
  updated_at: "2026-06-03T00:00:00Z"
};

function todayLocalISO() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const task: GardenTask = {
  id: "task-1",
  property_id: property.id,
  zone_id: zone.id,
  bed_id: bed.id,
  plant_instance_id: plant.id,
  title: "Water deeply before afternoon heat",
  notes: null,
  due_on: todayLocalISO(),
  status: "open",
  completed_at: null,
  created_at: "2026-06-03T00:00:00Z",
  updated_at: "2026-06-03T00:00:00Z"
};

describe("Today garden home", () => {
  it("opens on a simple text/photo composer with top shortcuts", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAskView, {
        activeProperty: property,
        zones: [zone],
        beds: [bed],
        plants: [plant],
        observations: [observation],
        tasks: [task],
        isSaving: false,
        quickLog: async () => undefined,
        addTask: async () => undefined,
        updateTaskStatus: async () => undefined
      })
    );
    const askViewSource = readFileSync(new URL("../components/views/garden-ask-view.tsx", import.meta.url), "utf8");

    expect(html).toContain('aria-label="Garden shortcuts"');
    expect(html).toContain('aria-label="Chat history"');
    expect(html).toContain('aria-label="Open plant catalogue"');
    expect(html).toContain('aria-label="Search garden and catalogue"');
    expect(html).toContain('aria-label="Open my garden"');
    expect(html).toContain('aria-label="Open weekly care"');
    expect(html).toContain('aria-label="Garden memory snapshot"');
    expect(html).toContain("Backyard Garden");
    expect(html).toContain("Central Texas");
    expect(html).toContain("1 growing plant");
    expect(html).toContain("1 place");
    expect(html).toContain("1 care item today");
    expect(html).toContain("Latest note:");
    expect(html).toContain("First strong bloom after two hot days.");
    expect(html).toContain("Open garden memory");
    expect(html).toContain('data-tooltip="Chat history"');
    expect(html).toContain('data-tooltip="Plant catalogue"');
    expect(html).toContain('data-tooltip="Search"');
    expect(html).toContain('data-tooltip="My garden"');
    expect(html).toContain('data-tooltip="Weekly care"');
    expect(html).toContain('href="/app/plant-catalogue"');
    expect(html).toContain('href="/app/my-garden"');
    expect(html).toContain('href="/app/calendar"');
    expect(html).toContain("Ask Garden.io");
    expect(html).toContain("Ask about your garden...");
    expect(html).toContain('aria-label="Add attachment"');
    expect(html).toContain("Add file");
    expect(html).toContain("Add photo");
    expect(html).toContain("Take photo");
    expect(html).toContain('capture="environment"');
    expect(html).toContain('aria-label="Send"');
    expect(html).toContain("When did we get rain last?");
    expect(html).not.toContain("Your garden, smarter.");
    expect(html).not.toContain("Add what changed. Get one next step.");
    expect(html).not.toContain("The answer can use the plants, places, and notes you have saved.");
    expect(html).not.toContain("1 plant in 1 bed");
    expect(html).not.toContain("Yellow leaves, spots, storm damage...");

    expect(askViewSource).toContain("GardenAiIcon");
    expect(askViewSource).toContain("What's wrong with this plant?");
    expect(askViewSource).toContain("Can I plant pomegranate here?");
    expect(askViewSource).toContain("When should my fava beans get harvested?");
    expect(askViewSource).toContain("Are these ready to pick?");
    expect(askViewSource).toContain("shufflePromptExamples");
    expect(askViewSource).toContain("setInterval(() =>");
    expect(askViewSource).toContain("5000");
    expect(askViewSource).toContain("requestAnimationFrame(() => promptRef.current?.focus());");
    expect(askViewSource).toContain("disabled={loading || !canAskGarden}");
    expect(askViewSource).not.toContain("garden-ai-shortcuts");
    expect(askViewSource).not.toContain('memory: "/app/garden-memory"');
  });

  it("keeps the garden map as a secondary route instead of persistent module tabs", () => {
    const gardenAppSource = readFileSync(new URL("../components/garden-app.tsx", import.meta.url), "utf8");
    const myPropertySource = readFileSync(new URL("../app/app/my-property/page.tsx", import.meta.url), "utf8");
    const memoryRouteSource = readFileSync(new URL("../app/app/garden-memory/page.tsx", import.meta.url), "utf8");

    expect(gardenAppSource).toContain("GardenAskView");
    expect(gardenAppSource).toContain('view === "ask"');
    expect(gardenAppSource).toContain('href="/app/my-property"');
    expect(gardenAppSource).toContain('title: "Today"');
    expect(gardenAppSource).toContain('subtitle: "Add what changed. Get one next step."');
    expect(gardenAppSource).not.toContain('subtitle: "Add what changed. Keep what helped."');
    expect(gardenAppSource).not.toContain('title: "Garden Check"');
    expect(gardenAppSource).not.toContain('subtitle: "Show what changed. Save one care step."');
    expect(gardenAppSource).toContain('title: "My Garden"');
    expect(gardenAppSource).not.toContain('title: "Garden Memory"');
    expect(gardenAppSource).not.toContain('aria-label="Garden app navigation"');
    expect(gardenAppSource).not.toContain('href="/app/calendar">This Week</Link>');
    expect(gardenAppSource).not.toContain('href="/app/my-plants">My Plants</Link>');
    expect(gardenAppSource).not.toContain('href="/app/plant-catalogue">Find Plants</Link>');
    expect(gardenAppSource).toContain('title: "Choose plants"');
    expect(gardenAppSource).toContain('subtitle: "Choose plants for the beds you have."');
    expect(gardenAppSource).not.toContain('subtitle: "Choose plants for your light, water, and beds."');
    expect(gardenAppSource).not.toContain('title: "Plant Guide"');
    expect(myPropertySource).toContain('view={shouldOpenMemory ? "property" : "ask"}');
    expect(memoryRouteSource).toContain("redirect('/app/my-garden')");
  });

  it("reuses existing garden flows instead of adding duplicate creation forms", () => {
    const askViewSource = readFileSync(new URL("../components/views/garden-ask-view.tsx", import.meta.url), "utf8");
    const myPropertySource = readFileSync(new URL("../app/app/my-property/page.tsx", import.meta.url), "utf8");

    expect(askViewSource).toContain('fetch("/api/diagnose"');
    expect(askViewSource).toContain("props.quickLog");
    expect(askViewSource).toContain("props.addTask");
    expect(askViewSource).toContain("props.askGarden");
    expect(askViewSource).toContain("conversationStarted");
    expect(askViewSource).toContain("garden-ai-thread");
    expect(askViewSource).toContain("garden-ai-message-bubble--user");
    expect(askViewSource).toContain("garden-ai-message-bubble--assistant");
    expect(askViewSource).toContain("renderComposer(\"chat\")");
    expect(askViewSource).toContain("identifyPlantContexts");
    expect(askViewSource).toContain("garden-ai-context-chip");
    expect(askViewSource).toContain("Do this first");
    expect(askViewSource).toContain("Add to weekly care");
    expect(askViewSource).toContain("Added to weekly care.");
    expect(askViewSource).not.toContain("Add to this week");
    expect(askViewSource).not.toContain("Added to this week.");
    expect(askViewSource).not.toContain("Added to your care plan.");
    expect(askViewSource).toContain("More care ideas");
    expect(askViewSource).not.toContain("More checks");
    expect(askViewSource).not.toContain("Other helpful checks");
    expect(askViewSource).toContain("garden-ai-action--primary");
    expect(askViewSource).toContain("garden-ai-secondary-action");
    expect(askViewSource).toContain('className="garden-ai-more-checks"');
    expect(askViewSource).toContain("More care ideas if the first one is not enough.");
    expect(askViewSource).not.toContain("Optional care checks if the first check is not enough.");
    expect(askViewSource).toContain('aria-label="Suggested care ideas"');
    expect(askViewSource).toContain('aria-label="More care ideas"');
    expect(askViewSource).not.toContain("Optional care tasks if the first check is not enough.");
    expect(askViewSource).not.toContain("Suggested next steps");
    expect(askViewSource).not.toContain("Next step:");
    expect(askViewSource).toContain("showTargetPicker");
    expect(askViewSource).toContain("setShowTargetPicker(false);");
    expect(askViewSource).toContain('className="garden-ai-answer__summary"');
    expect(askViewSource).toContain("cleanFollowUp");
    expect(askViewSource).toContain("Watch for:");
    expect(askViewSource).not.toContain("Look for:");
    expect(askViewSource).not.toContain("To check:");
    expect(askViewSource).toContain("Worth a look");
    expect(askViewSource).not.toContain("Worth checking");
    expect(askViewSource).toContain('className="garden-ai-why"');
    expect(askViewSource).toContain("Why this step fits");
    expect(askViewSource).toContain("See the notes and season behind this step.");
    expect(askViewSource).not.toContain("See the notes, season, and garden details behind it.");
    expect(askViewSource).not.toContain("What I used");
    expect(askViewSource).not.toContain("Show the notes, season, and garden details behind this.");
    expect(askViewSource).not.toContain("Why this answer");
    expect(askViewSource).not.toContain("Show the garden context behind this answer.");
    expect(askViewSource).not.toContain("<h1>{diagnosis.summary}</h1>");
    expect(askViewSource).not.toContain("Look for: {diagnosis.follow_up}");
    expect(askViewSource).toContain("Remember this");
    expect(askViewSource).not.toContain("Keep this note");
    expect(askViewSource).not.toContain("Give one plant a home.");
    expect(askViewSource).not.toContain("Start small");
    expect(askViewSource).not.toContain("Give one plant a home");
    expect(askViewSource).not.toContain("Add one plant to begin.");
    expect(askViewSource).not.toContain("First plant");
    expect(askViewSource).not.toContain("Start here");
    expect(askViewSource).not.toContain("Add your first plant");
    expect(askViewSource).not.toContain("garden-ai-shortcuts");
    expect(askViewSource).not.toContain("See your garden");
    expect(askViewSource).not.toContain("See next care");
    expect(askViewSource).not.toContain("This Week");
    expect(askViewSource).not.toContain("Field Guide");
    expect(askViewSource).not.toContain("Garden notes");
    expect(askViewSource).not.toContain("Field guide");
    expect(askViewSource).not.toContain("Plant guide");
    expect(askViewSource).not.toContain('aria-label="Open My Garden"');
    expect(askViewSource).toContain('aria-label="Open my garden"');
    expect(askViewSource).toContain('aria-label="Open weekly care"');
    expect(askViewSource).not.toContain('aria-label="See next care"');
    expect(askViewSource).not.toContain('aria-label="See your garden"');
    expect(askViewSource).not.toContain("Beds, plants, and notes together.");
    expect(askViewSource).not.toContain("<strong>Find plants</strong>");
    expect(askViewSource).toContain("Keep with");
    expect(askViewSource).not.toContain("Save with");
    expect(askViewSource).toContain("Places:");
    expect(askViewSource).not.toContain("Areas:");
    expect(askViewSource).toContain("return zone ? zone.name : \"Place\"");
    expect(askViewSource).not.toContain("return zone ? zone.name : \"Area\"");
    expect(askViewSource).toContain("`${zone.name} place`");
    expect(askViewSource).not.toContain("`${zone.name} area`");
    expect(askViewSource).toContain("Choose where to keep it");
    expect(askViewSource).not.toContain("Choose the plant or bed");
    expect(askViewSource).not.toContain("Where should this note live?");
    expect(askViewSource).toContain("Keep it with the right plant or bed so it is easy to find later.");
    expect(askViewSource).not.toContain("Keep this where it belongs so you can find it later.");
    expect(askViewSource).not.toContain("Keep this with the right plant or bed so you can find it later.");
    expect(askViewSource).not.toContain("Save this with the right plant or bed so you can find it later.");
    expect(askViewSource).not.toContain("Save this with the right plant or bed so the next check remembers it.");
    expect(askViewSource).not.toContain("Save what you noticed with the right plant or bed so the next check starts in the right place.");
    expect(askViewSource).not.toContain("Save the answer with the right plant or bed so the next check starts in the right place.");
    expect(askViewSource).not.toContain("Keep it with the right plant or bed so the next check starts in the right place.");
    expect(askViewSource).toContain("garden-ai-save-target");
    expect(askViewSource).toContain("Keep note");
    expect(askViewSource).not.toContain("Save note");
    expect(askViewSource).toContain("Kept");
    expect(askViewSource).toContain("Kept with");
    expect(askViewSource).not.toContain("Saved with");
    expect(askViewSource).not.toContain("for next time");
    expect(askViewSource).toContain("routes.memory");
    expect(askViewSource).toContain("routes.care");
    expect(askViewSource).toContain("routes.guide");
    expect(askViewSource).toContain('memory: "/app/my-garden"');
    expect(askViewSource).toContain("Start your garden to keep notes where they belong.");
    expect(askViewSource).not.toContain("Start your garden to keep notes with the right plant.");
    expect(askViewSource).not.toContain("Start your garden to save notes with the right plant.");
    expect(askViewSource).not.toContain("Start your garden to keep notes and care like this.");
    expect(askViewSource).not.toContain("Start your garden before saving notes or care.");
    expect(askViewSource).toContain("From your notes and season.");
    expect(askViewSource).not.toContain("From your notes, season, and garden details.");
    expect(askViewSource).not.toContain("Based on what you shared, your season, and recent garden notes.");
    expect(askViewSource).toContain("From this garden note:");
    expect(askViewSource).not.toContain("From this garden check:");
    expect(askViewSource).not.toContain("From this care step:");
    expect(askViewSource).not.toContain("Noted:");
    expect(askViewSource).not.toContain("Checked:");
    expect(askViewSource).toContain("Add more detail");
    expect(askViewSource).not.toContain("Add follow-up");
    expect(askViewSource).not.toContain("Check again");
    expect(askViewSource).toContain('aria-label="Suggested garden notes"');
    expect(askViewSource).toContain('aria-label="Garden answer"');
    expect(askViewSource).not.toContain('aria-label="Garden note result"');
    expect(askViewSource).not.toContain('aria-label="Suggested garden checks"');
    expect(askViewSource).not.toContain('aria-label="Garden check result"');
    expect(askViewSource).toContain("Photo added to this garden note");
    expect(askViewSource).not.toContain("Photo added for this plant check");
    expect(askViewSource).not.toContain("Asked:");
    expect(askViewSource).not.toContain("Ask follow-up");
    expect(askViewSource).not.toContain('aria-label="Suggested garden questions"');
    expect(askViewSource).not.toContain("Start your garden before saving answers or care.");
    expect(askViewSource).not.toContain("From this garden answer:");
    expect(askViewSource).not.toContain("Garden question:");
    expect(askViewSource).not.toContain("Future answers will remember this for");
    expect(askViewSource).not.toContain("From saved garden answer:");
    expect(askViewSource).not.toContain("From garden guidance:");
    expect(askViewSource).not.toContain("Save this to your garden");
    expect(askViewSource).not.toContain("Remember this answer");
    expect(askViewSource).not.toContain("Make future help smarter");
    expect(askViewSource).not.toContain("Start a garden memory before remembering answers or care.");
    expect(askViewSource).not.toContain("Ask now. Start a garden when you want to save notes.");
    expect(askViewSource).not.toContain("Save useful answers so future questions have more to work with.");
    expect(askViewSource).not.toContain("Save to memory");
    expect(askViewSource).not.toContain("Keep the answer with the right place so future questions have more to work with.");
    expect(askViewSource).not.toContain("Choose where this belongs");
    expect(askViewSource).not.toContain("garden-ai-utility-row");
    expect(askViewSource).toContain("garden-ai-icon-button");
    expect(askViewSource).not.toContain("garden-ai-panel");
    expect(askViewSource).not.toContain("Garden utilities");
    expect(askViewSource).not.toContain("From Garden.io answer");
    expect(askViewSource).not.toContain("Asked Garden.io");
    expect(askViewSource).not.toContain("Garden.io could not answer");
    expect(askViewSource).not.toContain("Garden.io uses your plant records");
    expect(askViewSource).not.toContain("createZone(");
    expect(askViewSource).not.toContain("createBed(");
    expect(askViewSource).not.toContain("addPlant(");

    expect(myPropertySource).toContain("resolvedSearchParams?.zone");
    expect(myPropertySource).toContain("resolvedSearchParams?.bed");
    expect(myPropertySource).toContain("resolvedSearchParams?.plant");
  });

  it("defines a dedicated Selah-style Garden.io surface in CSS", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".garden-app-shell--ai");
    expect(css).toContain(".garden-app-shell--ai .garden-app-header");
    expect(css).toContain(".garden-ai-home {");
    expect(css).toContain(".garden-ai-topbar");
    expect(css).toContain(".garden-ai-brand,");
    expect(css).toContain(".garden-ai-icon-button");
    expect(css).toContain(".garden-ai-icon-button::before,");
    expect(css).toContain(".garden-ai-icon-button::after");
    expect(css).toContain("content: attr(data-tooltip);");
    expect(css).not.toContain(".garden-ai-lead");
    expect(css).not.toContain(".garden-ai-memory-note");
    expect(css).toContain(".garden-ai-composer textarea");
    expect(css).toContain("min-height: 11.5rem;");
    expect(css).toContain("font-family: var(--font-body), \"Palatino Linotype\", serif;");
    expect(css).toContain("font-size: 2.75rem;");
    expect(css).toContain("font-weight: 400;");
    expect(css).toContain("text-align: center;");
    expect(css).not.toContain(".garden-ai-composer__hint");
    expect(css).toContain("max-width: 100%;");
    expect(css).not.toContain(".garden-ai-kicker span:not(.specimen-label)");
    expect(css).toContain(".garden-ai-prompts button {");
    expect(css).toContain("font-family: var(--font-script);");
    expect(css).toContain("font-size: 2.05rem;");
    expect(css).toContain("animation: garden-ai-prompt-fade 5s ease-in-out both;");
    expect(css).toContain("@keyframes garden-ai-prompt-fade");
    expect(css).not.toContain(".garden-ai-start-panel");
    expect(css).toContain(".garden-ai-answer {");
    expect(css).toContain(".garden-ai-answer__summary");
    expect(css).toContain("font-size: clamp(1.65rem, 5vw, 2.65rem);");
    expect(css).not.toContain(".garden-ai-answer h1");
    expect(css).toContain(".garden-ai-action--primary");
    expect(css).toContain(".garden-ai-secondary-actions");
    expect(css).toContain(".garden-ai-why,");
    expect(css).toContain(".garden-ai-more-checks {");
    expect(css).toContain(".garden-ai-followup span");
    expect(css).toContain(".garden-ai-save-target");
    expect(css).not.toContain(".garden-ai-shortcuts");
    expect(css).not.toContain(".garden-ai-shortcut");
    expect(css).toContain("display: inline-flex;");
    expect(css).toContain("min-height: 4.25rem;");
    expect(css).toContain("border-radius: 50%;");
    expect(css).toContain(".garden-ai-attachment-button:focus-visible,");
    expect(css).toContain(".garden-ai-attachment-menu button:focus-visible");
    expect(css).toContain(".garden-ai-brand:focus-visible,\n.garden-ai-icon-button:focus-visible");
    expect(css).not.toContain("min-height: 86px;");
    expect(css).not.toContain("box-shadow: 0 0.65rem 1.4rem");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr);");
    expect(css).not.toContain(".garden-ai-utility-row");
    expect(css).not.toContain(".garden-ai-panel");
    expect(css).not.toContain(".garden-ai-bottom-tabs");
  });
});
