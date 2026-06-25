import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GardenAskView } from "@/components/views/garden-ask-view";
import type { GardenBed, GardenPlantInstance, GardenProperty, GardenZone } from "@/lib/garden-app-types";

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

describe("Today garden home", () => {
  it("opens on a text/photo composer instead of the bed and plant map", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAskView, {
        activeProperty: property,
        zones: [zone],
        beds: [bed],
        plants: [plant],
        observations: [],
        tasks: [],
        isSaving: false,
        quickLog: async () => undefined,
        addTask: async () => undefined,
        updateTaskStatus: async () => undefined
      })
    );

    expect(html).toContain("Today");
    expect(html).not.toContain("Garden Check</span><span>1 plant saved");
    expect(html).toContain("1 plant in 1 bed");
    expect(html).not.toContain("1 plant saved in 1 bed");
    expect(html).not.toContain("1 areas, 1 beds, 1 growing plants");
    expect(html).toContain("Yellow leaves, spots, storm damage...");
    expect(html).not.toContain("What are you seeing?");
    expect(html).toContain("Today");
    expect(html).not.toContain("Garden Check</span><span>Start by giving one plant a place.");
    expect(html).not.toContain("Garden Check");
    expect(html).toContain("Your garden, smarter.");
    expect(html.match(/Your garden, smarter\./g)?.length).toBe(1);
    expect(html).toContain("Add what changed. Get one next step.");
    expect(html).not.toContain("Add what changed. Keep what helped.");
    expect(html).not.toContain("Add a note or photo. Keep what helped with the right plant.");
    expect(html).not.toContain("Add a note or photo. Get one useful care step, then save it with the right plant or bed.");
    expect(html).not.toContain("Show what changed. Get one care step.");
    expect(html).toContain("What changed in your garden?");
    expect(html).not.toContain("Garden note or photo description");
    expect(html).not.toContain("Describe what changed. Save the care it needs.");
    expect(html).not.toContain("Describe what changed. Save the next care step.");
    expect(html).not.toContain("Describe what changed. Get a next step you can save.");
    expect(html).not.toContain("Notice what changed, then save what to try next with the plant.");
    expect(html).not.toContain("Notice what changed, then save one care step with the plant.");
    expect(html).not.toContain("One clear next step");
    expect(html).not.toContain("Describe the change. Get one care step you can save with the plant.");
    expect(html).not.toContain("Describe what changed. Get one clear care step from your garden notes.");
    expect(html).not.toContain("Show what changed. Get one care step using your garden notes.");
    expect(html).toContain("The answer can use the plants, places, and notes you have saved.");
    expect(html).not.toContain("Keep it where it belongs in your garden.");
    expect(html).not.toContain("Keep it with the plant or bed it belongs to.");
    expect(html).not.toContain("Save it with the plant or bed it belongs to.");
    expect(html).not.toContain("Save it so you remember what helped.");
    expect(html).not.toContain("Save the note so next time has context.");
    expect(html).not.toContain("Save it once. Future checks remember.");
    expect(html).not.toContain("The next check starts with what you save.");
    expect(html).not.toContain("Add a note or photo. Save the answer with the right plant or bed.");
    expect(html).not.toContain("Save what you noticed with the right plant or bed.");
    expect(html).not.toContain("Keep it with the right plant or bed.");
    expect(html).not.toContain("Keep it with the plant for next time.");
    expect(html).not.toContain("Save it with the plant for next time.");
    expect(html).not.toContain("Your note, photo, and care plan stay together.");
    expect(html).not.toContain("Your note, photo, and next care stay together.");
    expect(html).not.toContain("Your note, photo, and care step stay together.");
    expect(html).not.toContain("Save the note so next week is easier.");
    expect(html).not.toContain("Save what you notice now so next week is easier.");
    expect(html).toContain("Add a photo");
    expect(html).toContain("Add a note or photo");
    expect(html).not.toContain("<button class=\"garden-ai-send\" type=\"submit\" disabled=\"\">Get next step</button>");
    expect(html).not.toContain("Check this change");
    expect(html).not.toContain("Get one care step");
    expect(html).not.toContain("Get care guidance");
    expect(html).not.toContain("Get care step");
    expect(html).not.toContain("Ask with saved notes");
    expect(html).not.toContain("Check with notes");
    expect(html).not.toContain("Check garden");
    expect(html).not.toContain("Get a care step");
    expect(html).not.toContain("Ask from your garden");
    expect(html).not.toContain("Get guidance");
    expect(html).not.toContain("Photo selected for Garden.io");
    expect(html).toContain("Leaves are yellowing");
    expect(html).toContain("Storm came through");
    expect(html).not.toContain("Tomato leaves are yellowing");
    expect(html).not.toContain("Why are my tomato leaves yellowing?");
    expect(html).not.toContain("What should I do after heavy rain?");
    expect(html).not.toContain("Can basil grow in this bed?");
    expect(html).not.toContain("What should I check before the heat?");
    expect(html).toContain("My Garden");
    expect(html).not.toContain("See your garden");
    expect(html).toContain("Weekly care");
    expect(html).not.toContain("See next care");
    expect(html).toContain("Choose plants");
    expect(html).toContain('aria-label="Go to My Garden"');
    expect(html).not.toContain('aria-label="Open My Garden"');
    expect(html).not.toContain('aria-label="See your garden"');
    expect(html).toContain('aria-label="Go to weekly care"');
    expect(html).not.toContain('aria-label="Open weekly care"');
    expect(html).not.toContain('aria-label="See next care"');
    expect(html).toContain('aria-label="Choose plants"');
    expect(html).toContain('<h1 class="garden-ai-lead">Your garden, smarter.</h1>');
    expect(html).not.toContain("Garden notes");
    expect(html).not.toContain(">This Week</a>");
    expect(html).not.toContain(">This week</a>");
    expect(html).not.toContain("Field guide");
    expect(html).not.toContain("My garden");
    expect(html).not.toContain("See this week");
    expect(html).not.toContain("Beds, plants, and notes together.");
    expect(html).not.toContain("Watering, harvests, and checks in one place.");
    expect(html).not.toContain("Find plants for the beds you have.");
    expect(html).not.toContain("Start the garden map");
    expect(html).not.toContain("Garden utilities");
    expect(html).not.toContain("Keep the useful answer with the right plant, bed, or season.");
    expect(html).not.toContain("Answers can be saved with a plant, bed, or the whole garden.");
    expect(html).not.toContain("Know what to do next");
    expect(html).not.toContain("Ask with a quick note or photo");
    expect(html).not.toContain("The answer starts with your saved plants, beds, weather, and notes.");
    expect(html).not.toContain("Garden memory");
    expect(html).not.toContain("What needs attention today?");
    expect(html).not.toContain("The care that needs attention.");
    expect(html).not.toContain("Add a note or photo. Get a next step that knows your plants, beds, and season.");
    expect(html).not.toContain("Add a note or photo. Get one clear next step that uses your plants, beds, and season.");
    expect(html).not.toContain("Add a note or photo. Get help that already knows your plants, beds, weather, and history.");
    expect(html).not.toContain("Add a note or photo. Get help with the plants, beds, weather, and history already saved.");
    expect(html).not.toContain("Add a note or photo. Ask from the plants, beds, weather, and notes you already saved.");
    expect(html).not.toContain("The more you save, the more context your garden has.");
    expect(html).not.toContain("The more you save, the smarter your garden gets.");
    expect(html).not.toContain("Save useful notes so next time starts with what happened.");
    expect(html).not.toContain("Save the answer so future advice remembers what happened.");
    expect(html).not.toContain("Save useful answers so the next check starts with what happened.");
    expect(html).not.toContain("Save useful notes so the next visit starts with what happened.");
    expect(html).not.toContain("Save useful notes so the next visit starts with what you noticed.");
    expect(html).not.toContain("Show what changed. Get one useful care step from the garden you already saved.");
    expect(html).not.toContain("Ask your garden");
    expect(html).not.toContain("Ask Garden.io");
    expect(html).not.toContain("Garden.io answer");
    expect(html).not.toContain("Garden.io used");
    expect(html).not.toContain("Garden.io uses your plant records");
    expect(html).not.toContain("Garden layout");
    expect(html).not.toContain("Garden app navigation");
    const askViewSource = readFileSync(new URL("../components/views/garden-ask-view.tsx", import.meta.url), "utf8");
    expect(askViewSource).toContain("canAskGarden ? \"Get next step\" : \"Add a note or photo\"");
    expect(askViewSource).toContain("requestAnimationFrame(() => promptRef.current?.focus());");
    expect(askViewSource).toContain("Looking at what changed...");
    expect(askViewSource).toContain("Checking your notes and season...");
    expect(askViewSource).toContain("Looking through your garden history...");
    expect(askViewSource).toContain("Checking the photo with your garden notes...");
    expect(askViewSource).not.toContain("Reading your notes and season...");
    expect(askViewSource).not.toContain("Checking your garden...");
    expect(askViewSource).toContain("Looking closely...");
    expect(askViewSource).not.toContain("Reading notes...");
    expect(askViewSource).not.toContain("Checking garden...");
    expect(askViewSource).toContain("Get next step");
    expect(askViewSource).toContain("Add a note or photo");
    expect(askViewSource).not.toContain("Check this change");
    expect(askViewSource).not.toContain("Looking through your garden notes...");
    expect(askViewSource).not.toContain("Looking for what may help...");
    expect(askViewSource).not.toContain("Looking for one useful next step...");
    expect(askViewSource).not.toContain("Checking your garden notes...");
    expect(askViewSource).not.toContain("Checking saved notes...");
    expect(askViewSource).not.toContain("Checking notes...");
    expect(askViewSource).not.toContain("Looking across your garden memory...");
  });

  it("makes the signed-in no-garden state point to the first plant path", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAskView, {
        activeProperty: null,
        zones: [],
        beds: [],
        plants: [],
        observations: [],
        tasks: [],
        isSaving: false,
        quickLog: async () => undefined,
        addTask: async () => undefined,
        updateTaskStatus: async () => undefined
      })
    );

    expect(html).not.toContain("Garden Check");
    expect(html).toContain("Give one plant a home.");
    expect(html).toContain("Start small");
    expect(html).toContain("Start with one plant.");
    expect(html).toContain("Name where it grows so notes, photos, and care can stay together.");
    expect(html).not.toContain("Choose where it grows so notes and answers stay where they belong.");
    expect(html).not.toContain("Choose where it grows so notes stay where they belong.");
    expect(html).not.toContain("Choose where it grows so notes stay with the right spot.");
    expect(html).not.toContain("Add one plant to begin.");
    expect(html).not.toContain("First plant");
    expect(html).not.toContain("Give one plant a bed so notes stay with the right spot.");
    expect(html).not.toContain("Give one plant a bed. Future checks remember it.");
    expect(html).not.toContain("Put it in a bed once. Notes, photos, and care stay connected after that.");
    expect(html).not.toContain("Start by giving one plant a place.");
    expect(html).not.toContain("Start here");
    expect(html).not.toContain("Add where it lives once. Notes, photos, and care stay with the right spot.");
    expect(html).not.toContain("Add where it lives once. Future notes and care will stay with the right spot.");
    expect(html).toContain("Give one plant a home");
    expect(html).not.toContain("Add your first plant");
    expect(html).toContain('href="/app/garden-memory"');
    expect(html).not.toContain("Garden Check");
    expect(html).toContain("Your garden, smarter.");
    expect(html.match(/Your garden, smarter\./g)?.length).toBe(1);
    expect(html).toContain("Add what changed. Get one next step.");
    expect(html).not.toContain("Add what changed. Keep what helped.");
    expect(html).not.toContain("Add a note or photo. Keep what helped with the right plant.");
    expect(html).not.toContain("Add a note or photo. Get one useful care step, then save it with the right plant or bed.");
    expect(html).not.toContain("Show what changed. Get one care step.");
    expect(html).toContain("What changed in your garden?");
    expect(html).not.toContain("Garden note or photo description");
    expect(html).not.toContain("Describe what changed. Save the care it needs.");
    expect(html).not.toContain("Describe what changed. Save the next care step.");
    expect(html).not.toContain("Describe what changed. Get a next step you can save.");
    expect(html).not.toContain("Notice what changed, then save what to try next with the plant.");
    expect(html).not.toContain("Notice what changed, then save one care step with the plant.");
    expect(html).not.toContain("One clear next step");
    expect(html).not.toContain("Describe the change. Get one care step you can save with the plant.");
    expect(html).not.toContain("Describe what changed. Get one clear care step from your garden notes.");
    expect(html).not.toContain("Show what changed. Get one care step using your garden notes.");
    expect(html).not.toContain("Show what changed. Get one useful care step from the garden you already saved.");
    expect(html).toContain("The answer can use the plants, places, and notes you have saved.");
    expect(html).not.toContain("Keep it where it belongs in your garden.");
    expect(html).not.toContain("Keep it with the plant or bed it belongs to.");
    expect(html).not.toContain("Save it with the plant or bed it belongs to.");
    expect(html).not.toContain("Save it so you remember what helped.");
    expect(html).not.toContain("Save the note so next time has context.");
    expect(html).not.toContain("Save it once. Future checks remember.");
    expect(html).not.toContain("The next check starts with what you save.");
    expect(html).not.toContain("Add a note or photo. Save the answer with the right plant or bed.");
    expect(html).not.toContain("Save what you noticed with the right plant or bed.");
    expect(html).not.toContain("Keep it with the right plant or bed.");
    expect(html).not.toContain("Keep it with the plant for next time.");
    expect(html).not.toContain("Save it with the plant for next time.");
    expect(html).not.toContain("Your note, photo, and care plan stay together.");
    expect(html).not.toContain("Your note, photo, and next care stay together.");
    expect(html).not.toContain("Your note, photo, and care step stay together.");
    expect(html).not.toContain("Save the note so next week is easier.");
    expect(html).not.toContain("Save what you notice now so next week is easier.");
    expect(html).not.toContain("The answer starts with your saved plants, beds, weather, and notes.");
    expect(html).not.toContain("Add a note or photo. Get help with the plants, beds, weather, and history already saved.");
    expect(html).not.toContain("Start the garden map");
    expect(html).not.toContain("Start a garden memory before remembering answers or care.");
    expect(html).not.toContain("Ask now. Start a garden when you want to save notes.");
    expect(html).not.toContain("Start with one garden note");
    expect(html).not.toContain("Create my garden");
    expect(html).not.toContain("Answers get better once your first plant has a place.");
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
    expect(memoryRouteSource).toContain('view="property"');
  });

  it("reuses existing garden flows instead of adding duplicate creation forms", () => {
    const askViewSource = readFileSync(new URL("../components/views/garden-ask-view.tsx", import.meta.url), "utf8");
    const myPropertySource = readFileSync(new URL("../app/app/my-property/page.tsx", import.meta.url), "utf8");

    expect(askViewSource).toContain('fetch("/api/diagnose"');
    expect(askViewSource).toContain("props.quickLog");
    expect(askViewSource).toContain("props.addTask");
    expect(askViewSource).toContain("props.askGarden");
    expect(askViewSource).toContain("{!diagnosis ? (");
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
    expect(askViewSource).toContain("Give one plant a home.");
    expect(askViewSource).toContain("Start small");
    expect(askViewSource).toContain("Give one plant a home");
    expect(askViewSource).not.toContain("Add one plant to begin.");
    expect(askViewSource).not.toContain("First plant");
    expect(askViewSource).not.toContain("Start here");
    expect(askViewSource).not.toContain("Add your first plant");
    expect(askViewSource).toContain("garden-ai-shortcuts");
    expect(askViewSource).toContain("My Garden");
    expect(askViewSource).not.toContain("See your garden");
    expect(askViewSource).toContain("Weekly care");
    expect(askViewSource).not.toContain("See next care");
    expect(askViewSource).toContain("Choose plants");
    expect(askViewSource).not.toContain("This Week");
    expect(askViewSource).not.toContain("Field Guide");
    expect(askViewSource).not.toContain("Garden notes");
    expect(askViewSource).not.toContain("This week");
    expect(askViewSource).not.toContain("Field guide");
    expect(askViewSource).not.toContain("Plant guide");
    expect(askViewSource).toContain('aria-label="Go to My Garden"');
    expect(askViewSource).not.toContain('aria-label="Open My Garden"');
    expect(askViewSource).toContain('aria-label="Go to weekly care"');
    expect(askViewSource).not.toContain('aria-label="Open weekly care"');
    expect(askViewSource).not.toContain('aria-label="See next care"');
    expect(askViewSource).toContain('aria-label="Choose plants"');
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
    expect(askViewSource).toContain('memory: "/app/garden-memory"');
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
    expect(askViewSource).toContain("Noted:");
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
    expect(askViewSource).not.toContain("garden-ai-icon-button");
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
    expect(css).toContain(".garden-ai-home {");
    expect(css).toContain(".garden-ai-lead");
    expect(css).not.toContain(".garden-ai-memory-note");
    expect(css).toContain(".garden-ai-composer textarea");
    expect(css).toContain("min-height: clamp(132px, 24vh, 210px);");
    expect(css).toContain(".garden-ai-composer__hint");
    expect(css).toContain("max-width: 100%;");
    expect(css).toContain(".garden-ai-kicker span:not(.specimen-label)");
    expect(css).toContain("overflow-wrap: anywhere;");
    expect(css).toContain(".garden-ai-start-panel");
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
    expect(css).toContain(".garden-ai-shortcuts");
    expect(css).toContain(".garden-ai-shortcut");
    expect(css).toContain("display: inline-flex;");
    expect(css).toContain("min-height: 40px;");
    expect(css).toContain("border-radius: var(--radius-pill);");
    expect(css).toContain("background: rgba(251, 247, 239, 0.42);");
    expect(css).toContain(".garden-ai-shortcut:hover,");
    expect(css).toContain(".garden-ai-shortcut:focus-visible");
    expect(css).toContain(".garden-ai-photo-button:focus-visible");
    expect(css).toContain(".garden-ai-shortcut:focus-visible {\n  outline: 2px solid var(--olive);");
    expect(css).not.toContain("min-height: 86px;");
    expect(css).not.toContain("box-shadow: 0 0.65rem 1.4rem");
    expect(css).not.toContain(".garden-ai-shortcut span");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr);");
    expect(css).not.toContain(".garden-ai-utility-row");
    expect(css).not.toContain(".garden-ai-icon-button");
    expect(css).not.toContain(".garden-ai-panel");
    expect(css).not.toContain(".garden-ai-bottom-tabs");
  });
});
