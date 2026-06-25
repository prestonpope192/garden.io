import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GardenAppPreview, getDemoSaveNotice } from "@/components/garden-app-preview";
import { PropertyView } from "@/components/views/property-view";
import { buildDemoGardenSnapshot } from "@/lib/demo-garden-snapshot";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => undefined
  })
}));

const ORIGINAL_ENV = { ...process.env };
vi.useFakeTimers();
vi.setSystemTime(new Date("2026-06-23T12:00:00-05:00"));

function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

afterAll(() => {
  vi.useRealTimers();
});

describe("sample garden route gating", () => {
  it("keeps the sample garden available by default in production", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "production",
      NEXT_PUBLIC_DISABLE_SAMPLE_GARDEN: undefined
    };

    const { isSampleGardenEnabled } = await import("@/lib/sample-garden");

    expect(isSampleGardenEnabled()).toBe(true);
  });

  it("can explicitly hide the sample garden", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "production",
      NEXT_PUBLIC_DISABLE_SAMPLE_GARDEN: "true"
    };

    const { isSampleGardenEnabled } = await import("@/lib/sample-garden");

    expect(isSampleGardenEnabled()).toBe(false);
  });
});

describe("sample garden content", () => {
  const snapshot = buildDemoGardenSnapshot([]);
  const noop = async () => undefined;

  it("uses journal-style plant art for the sample garden instead of ordinary photos", () => {
    const photoOnlySnapshot = buildDemoGardenSnapshot([
      {
        ...snapshot.plants[0].plant_profile,
        slug: "borage",
        primary_image_url: "https://example.com/borage-garden-photo.jpg"
      },
      {
        ...snapshot.plants[1].plant_profile,
        slug: "bouquet-dill",
        primary_image_url: "https://example.com/bouquet-dill-garden-photo.jpg"
      },
      {
        ...snapshot.plants[2].plant_profile,
        slug: "bell-pepper",
        primary_image_url: "https://example.com/bell-pepper-garden-photo.jpg"
      }
    ]);

    expect(
      photoOnlySnapshot.plants.map((plant) => plant.plant_profile.primary_image_url)
    ).toEqual(
      expect.arrayContaining([
        "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/borage.jpg",
        "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/bouquet-dill.jpg",
        "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/bell-pepper.jpg"
      ])
    );
    expect(photoOnlySnapshot.plants.map((plant) => plant.plant_profile.primary_image_url).join(" ")).not.toContain(
      "example.com"
    );
    expect(readFileSync(new URL("../lib/demo-garden-snapshot.ts", import.meta.url), "utf8")).not.toContain(
      "realPhotoProfiles"
    );
  });

  it("opens the sample garden on the Today surface", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAppPreview, {
        basePath: "/sample-garden",
        snapshot,
        view: "ask"
      })
    );
    const sampleRoutesSource = readFileSync(new URL("../lib/sample-garden.ts", import.meta.url), "utf8");
    const samplePageSource = readFileSync(new URL("../app/sample-garden/page.tsx", import.meta.url), "utf8");
    const tourPageSource = readFileSync(new URL("../app/tour/page.tsx", import.meta.url), "utf8");
    const tourViewPageSource = readFileSync(new URL("../app/tour/[view]/page.tsx", import.meta.url), "utf8");
    const previewSource = readFileSync(new URL("../components/garden-app-preview.tsx", import.meta.url), "utf8");
    const appSource = readFileSync(new URL("../components/garden-app.tsx", import.meta.url), "utf8");

    expect(previewSource).toContain('aria-label="Current garden place"');
    expect(previewSource).not.toContain('aria-label="Active context"');
    expect(previewSource).toContain('title: "Today"');
    expect(appSource).toContain('title: "Today"');
    expect(previewSource).not.toContain('title: "Garden Check"');
    expect(appSource).not.toContain('title: "Garden Check"');
    expect(previewSource).not.toContain('title: "Your garden, smarter"');
    expect(appSource).not.toContain('title: "Your garden, smarter"');
    expect(previewSource).toContain('subtitle: "Add what changed. Get one next step."');
    expect(appSource).toContain('subtitle: "Add what changed. Get one next step."');
    expect(previewSource).not.toContain('subtitle: "Add what changed. Keep what helped."');
    expect(appSource).not.toContain('subtitle: "Add what changed. Keep what helped."');
    expect(previewSource).not.toContain('subtitle: "Show what changed. Save one care step."');
    expect(appSource).not.toContain('subtitle: "Show what changed. Save one care step."');
    expect(previewSource).not.toContain('subtitle: "Ask with a note or photo. Save the useful answer."');
    expect(appSource).not.toContain('subtitle: "Ask with a note or photo. Save the useful answer."');
    expect(previewSource).not.toContain('subtitle: "Show what changed. Save the next care step."');
    expect(appSource).not.toContain('subtitle: "Show what changed. Save the next care step."');
    expect(previewSource).not.toContain('subtitle: "Show what changed. Get one care step."');
    expect(appSource).not.toContain('subtitle: "Show what changed. Get one care step."');
    expect(previewSource).not.toContain('subtitle: "What changed in your garden?"');
    expect(appSource).not.toContain('subtitle: "What changed in your garden?"');
    expect(previewSource).not.toContain('subtitle: "Describe what changed. Save the care it needs."');
    expect(appSource).not.toContain('subtitle: "Describe what changed. Save the care it needs."');
    expect(previewSource).not.toContain('subtitle: "Describe what changed. Save the next care step."');
    expect(appSource).not.toContain('subtitle: "Describe what changed. Save the next care step."');
    expect(previewSource).not.toContain('subtitle: "Describe what changed. Get a next step you can save."');
    expect(appSource).not.toContain('subtitle: "Describe what changed. Get a next step you can save."');
    expect(previewSource).not.toContain('subtitle: "Notice what changed, then save what to try next with the plant."');
    expect(appSource).not.toContain('subtitle: "Notice what changed, then save what to try next with the plant."');
    expect(previewSource).not.toContain('subtitle: "Notice what changed, then save one care step with the plant."');
    expect(appSource).not.toContain('subtitle: "Notice what changed, then save one care step with the plant."');
    expect(previewSource).not.toContain('subtitle: "Describe the change. Get one care step you can save with the plant."');
    expect(appSource).not.toContain('subtitle: "Describe the change. Get one care step you can save with the plant."');
    expect(previewSource).not.toContain('subtitle: "Describe what changed. Get one clear care step from your garden notes."');
    expect(appSource).not.toContain('subtitle: "Describe what changed. Get one clear care step from your garden notes."');
    expect(previewSource).not.toContain('subtitle: "Show what changed. Get one care step using your garden notes."');
    expect(appSource).not.toContain('subtitle: "Show what changed. Get one care step using your garden notes."');
    expect(previewSource).not.toContain('subtitle: "Show what changed. Get one useful care step from the garden you already saved."');
    expect(appSource).not.toContain('subtitle: "Show what changed. Get one useful care step from the garden you already saved."');
    expect(previewSource).not.toContain("Write a garden note or add a photo. Keep what matters with the right plant, bed, and season.");
    expect(appSource).not.toContain("Write a garden note or add a photo. Keep what matters with the right plant, bed, and season.");
    expect(html).toContain("Today");
    expect(html).not.toContain("Garden Check</span><span>4 plants saved");
    expect(html).not.toContain("4 plants in 3 beds. Start with Bell Pepper. Choose any plant when you want its notes.");
    expect(html).not.toContain("4 plants saved in 3 beds");
    expect(html).not.toContain("2 areas, 3 beds, 4 growing plants");
    expect(html).toContain("Yellow leaves, spots, storm damage...");
    expect(html).not.toContain("What are you seeing?");
    expect(html).not.toContain("Garden Check");
    expect(html).toContain("Your garden, smarter.");
    expect(html.match(/Your garden, smarter\./g)?.length).toBe(1);
    expect(html).toContain("Add what changed. Get one next step.");
    expect(html).not.toContain("Add what changed. Keep what helped.");
    expect(html).not.toContain("Add a note or photo. Keep what helped with the right plant.");
    expect(html).not.toContain("Add a note or photo. Get one useful care step, then save it with the right plant or bed.");
    expect(html).not.toContain("Show what changed. Get the next care step.");
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
    expect(html).not.toContain("Save what happened so next time starts there.");
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
    expect(html).not.toContain("Save useful notes so the next visit starts with what you noticed.");
    expect(html).toContain("Add a photo");
    expect(html).toContain('aria-label="Add a photo"');
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
    expect(html).toContain("Leaves are yellowing");
    expect(html).toContain("Storm came through");
    expect(html).not.toContain("Tomato leaves are yellowing");
    expect(html).not.toContain("Why are my tomato leaves yellowing?");
    expect(html).not.toContain("What should I do after heavy rain?");
    expect(html).not.toContain("Ask from your garden");
    expect(html).not.toContain("Get guidance");
    expect(html).not.toContain("Photo selected for Garden.io");
    expect(html).toContain("My Garden");
    expect(html).not.toContain("See your garden");
    expect(html).toContain("Weekly care");
    expect(html).not.toContain("See next care");
    expect(html).toContain("Choose plants");
    expect(html).toContain("Plant Journal");
    expect(html).not.toContain("Field Guide");
    expect(html).toContain('aria-label="Garden sections"');
    expect(html).toContain('aria-current="page" class="is-active" href="/sample-garden/ask">Today</a>');
    expect(html).toContain('aria-label="Go to My Garden"');
    expect(html).not.toContain('aria-label="Open My Garden"');
    expect(html).not.toContain('aria-label="See your garden"');
    expect(html).toContain('aria-label="Go to weekly care"');
    expect(html).not.toContain('aria-label="Open weekly care"');
    expect(html).not.toContain('aria-label="See next care"');
    expect(html).toContain('aria-label="Choose plants"');
    expect(html).not.toContain(">This Week</a>");
    expect(html).not.toContain("Garden notes");
    expect(html).not.toContain(">This week</a>");
    expect(html).not.toContain("Field guide");
    expect(html).not.toContain("See this week");
    expect(html).not.toContain("Beds, plants, and notes together.");
    expect(html).not.toContain("Watering, harvests, and checks in one place.");
    expect(html).not.toContain("Find plants for the beds you have.");
    expect(html).not.toContain("Beds, plants, and notes in one place.");
    expect(html).not.toContain("Garden utilities");
    expect(html).not.toContain("What needs attention today?");
    expect(html).not.toContain("The care that needs attention.");
    expect(html).not.toContain("Add a note or photo. Get a next step that knows your plants, beds, and season.");
    expect(html).not.toContain("Add a note or photo. Get one clear next step that uses your plants, beds, and season.");
    expect(html).not.toContain("Looking for one useful next step...");
    expect(html).not.toContain("Add a note or photo. Get help that already knows your plants, beds, weather, and history.");
    expect(html).not.toContain("Add a note or photo. Get help with the plants, beds, weather, and history already saved.");
    expect(html).not.toContain("Add a note or photo. Ask from the plants, beds, weather, and notes you already saved.");
    expect(html).not.toContain("The more you save, the more context your garden has.");
    expect(html).not.toContain("The more you save, the smarter your garden gets.");
    expect(html).not.toContain("Save the answer so future advice remembers what happened.");
    expect(html).not.toContain("Save useful answers so the next check starts with what happened.");
    expect(html).not.toContain("Save useful notes so the next visit starts with what happened.");
    expect(html).toContain("Start your garden");
    expect(html).not.toContain("Look around");
    expect(html).not.toContain("Keep the useful answer with the right plant, bed, or season.");
    expect(html).not.toContain("Answers can be saved with a plant, bed, or the whole garden.");
    expect(html).not.toContain("Know what to do next");
    expect(html).not.toContain("Ask with a quick note or photo");
    expect(html).not.toContain("Garden memory");
    expect(html).not.toContain("Ask Garden.io");
    expect(html).not.toContain("Garden.io uses your plant records");
    expect(html).not.toContain('aria-label="Garden app navigation"');
    expect(html).not.toContain(">Garden</a>");
    expect(html).not.toContain(">Plants</a>");
    expect(html).not.toContain(">Find</a>");
    expect(sampleRoutesSource).toContain('"ask"');
    expect(samplePageSource).toContain('redirect("/tour/ask")');
    expect(tourPageSource).toContain('redirect("/tour/ask")');
    expect(tourViewPageSource).toContain('basePath="/tour"');
    expect(previewSource).toContain("askSampleGarden");
    expect(previewSource).toContain("Compare old leaves and new growth before pruning or feeding.");
    expect(previewSource).not.toContain("Remember which plant or bed this happened in so next time starts with more context.");
    expect(previewSource).not.toContain("Save one note with the plant or bed so the next answer has more to work with.");
    expect(previewSource).toContain("GardenAskView");
    expect(previewSource).not.toContain("gardenNavLinks");
  });

  it("renders the tour from local garden data instead of blocking on the database", () => {
    const tourViewPageSource = readFileSync(
      new URL("../app/tour/[view]/page.tsx", import.meta.url),
      "utf8"
    );
    const sampleViewPageSource = readFileSync(
      new URL("../app/sample-garden/[view]/page.tsx", import.meta.url),
      "utf8"
    );

    expect(tourViewPageSource).toContain("buildDemoGardenSnapshot([])");
    expect(tourViewPageSource).not.toContain("@/lib/plant-profile-service");
    expect(tourViewPageSource).not.toContain("getPlantProfiles");
    expect(sampleViewPageSource).toContain("redirect(`/tour/${view}`)");
    expect(sampleViewPageSource).not.toContain("buildDemoGardenSnapshot([])");
  });

  it("presents the sample as browse-only in My Garden", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAppPreview, {
        basePath: "/sample-garden",
        snapshot,
        view: "property"
      })
    );
    const appSource = readFileSync(new URL("../components/garden-app.tsx", import.meta.url), "utf8");
    const plantsSource = readFileSync(new URL("../components/views/plants-view.tsx", import.meta.url), "utf8");
    const previewSource = readFileSync(new URL("../components/garden-app-preview.tsx", import.meta.url), "utf8");
    const propertySource = readFileSync(new URL("../components/views/property-view.tsx", import.meta.url), "utf8");
    const text = visibleText(html);

    expect(html).toContain("Start your garden");
    expect(html).toContain(">Start your garden</a>");
    expect(html).not.toContain("Look around");
    expect(html).not.toContain("Start yours");
    expect(html).not.toContain(">Start</a>");
    expect(html).toContain(">Today</a>");
    expect(html).toContain(">My Garden</a>");
    expect(html).toContain(">Weekly care</a>");
    expect(html).toContain(">Plant Journal</a>");
    expect(html).toContain(">Choose plants</a>");
    expect(html).toContain('aria-label="Garden sections"');
    expect(html).toContain('aria-current="page" class="is-active" href="/sample-garden/property">My Garden</a>');
    expect(html).not.toContain(">Garden Check</a>");
    expect(html).not.toContain(">Check</a>");
    expect(html).not.toContain(">Ask</a>");
    expect(html).not.toContain(">Ask garden</a>");
    expect(html).not.toContain(">Garden</a>");
    expect(html).not.toContain(">This Week</a>");
    expect(html).not.toContain(">Plants</a>");
    expect(html).not.toContain(">Find</a>");
    expect(html).not.toContain(">My Plants</a>");
    expect(html).not.toContain(">Plant Guide</a>");
    expect(html).not.toContain(">Find Plants</a>");
    expect(html).not.toContain(">Find plants</a>");
    expect(html).not.toContain("Try it first");
    expect(html).not.toContain("Start your own garden");
    expect(html).not.toContain("Example garden");
    expect(html).not.toContain("Sample garden");
    expect(html).not.toContain("garden-rail-name");
    expect(html).not.toContain('aria-label="Active context"');
    expect(html).toContain("Garden map");
    expect(html).not.toContain("Beds and areas");
    expect(appSource).toContain('kicker: "Garden map"');
    expect(appSource).not.toContain('kicker: "Where things grow"');
    expect(appSource).not.toContain('kicker: "Beds and areas"');
    expect(appSource).toContain('kicker: "This week"');
    expect(appSource).toContain('title: "Weekly care"');
    expect(appSource).toContain('kicker: "Your plants"');
    expect(appSource).toContain('kicker: "For your beds"');
    expect(appSource).not.toContain('kicker: "Plant choices"');
    expect(previewSource).toContain('kicker: "Garden map"');
    expect(previewSource).not.toContain('kicker: "Where things grow"');
    expect(previewSource).not.toContain('kicker: "Beds and areas"');
    expect(previewSource).toContain('kicker: "This week"');
    expect(previewSource).toContain('title: "Weekly care"');
    expect(previewSource).toContain('kicker: "Your plants"');
    expect(previewSource).toContain('kicker: "For your beds"');
    expect(previewSource).not.toContain('kicker: "Plant choices"');
    expect(appSource).not.toContain("<SpecimenLabel tone=\"olive\">Garden journal</SpecimenLabel>");
    expect(previewSource).not.toContain("<SpecimenLabel tone=\"olive\">Garden journal</SpecimenLabel>");
    expect(appSource).not.toContain("<SpecimenLabel tone=\"olive\">Garden journal</SpecimenLabel>");
    expect(previewSource).not.toContain("<SpecimenLabel tone=\"olive\">Garden journal</SpecimenLabel>");
    expect(text).not.toContain("Home garden");
    expect(text).not.toContain("Home garden Backyard Garden Kitchen Garden");
    expect(text).not.toContain("Backyard Garden Home garden My Garden");
    expect(text).not.toContain("Your garden My Garden");
    expect(text).not.toContain("Garden journal Plant Journal");
    expect(html).toContain("Places, beds, and plants in one view.");
    expect(appSource).toContain('subtitle: "Places, beds, and plants in one view."');
    expect(previewSource).toContain('subtitle: "Places, beds, and plants in one view."');
    expect(html).not.toContain("See what grows where, and what happened there.");
    expect(appSource).not.toContain('subtitle: "See what grows where, and what happened there."');
    expect(previewSource).not.toContain('subtitle: "See what grows where, and what happened there."');
    expect(html).not.toContain("See what grows where, with notes, photos, and next care in one place.");
    expect(appSource).not.toContain('subtitle: "See what grows where, with notes, photos, and next care in one place."');
    expect(previewSource).not.toContain('subtitle: "See what grows where, with notes, photos, and next care in one place."');
    expect(html).not.toContain("See each bed, what grows there, and this week&#x27;s care.");
    expect(appSource).not.toContain(`subtitle: "See each bed, what grows there, and this week's care."`);
    expect(previewSource).not.toContain(`subtitle: "See each bed, what grows there, and this week's care."`);
    expect(html).not.toContain("See each bed, what grows there, and what needs care next.");
    expect(appSource).not.toContain('subtitle: "See each bed, what grows there, and what needs care next."');
    expect(previewSource).not.toContain('subtitle: "See each bed, what grows there, and what needs care next."');
    expect(html).not.toContain("See what grows where, with notes and care in one place.");
    expect(appSource).not.toContain('subtitle: "See what grows where, with notes and care in one place."');
    expect(previewSource).not.toContain('subtitle: "See what grows where, with notes and care in one place."');
    expect(appSource).not.toContain("See where each plant lives, with its notes and care.");
    expect(previewSource).not.toContain("See where each plant lives, with its notes and care.");
    expect(html).not.toContain("See where each plant lives, with its notes and care.");
    expect(appSource).not.toContain("See where each plant lives and what happened there.");
    expect(previewSource).not.toContain("See where each plant lives and what happened there.");
    expect(html).not.toContain("See where each plant lives and what happened there.");
    expect(html).not.toContain("See each area, bed, plant, and note by place.");
    expect(html).not.toContain("See your areas, beds, plants, and notes in one place.");
    expect(html).not.toContain("Find each area, bed, plant, and note by place.");
    expect(html).toContain('<span class="garden-zone__name">Kitchen Garden</span>');
    expect(html).toContain('<span class="garden-zone__name">Pollinator Edge</span>');
    expect(html).toContain('<span class="garden-zone__tag">2 beds</span>');
    expect(html).toContain('<span class="garden-zone__tag">1 bed</span>');
    expect(html).not.toContain('aria-label="Kitchen Garden place, 2 beds"');
    expect(html).not.toContain('aria-label="Pollinator Edge place, 1 bed"');
    expect(html).not.toContain("garden-tree__count");
    expect(html).toContain("This week");
    expect(html).not.toContain("Check first");
    expect(html).not.toContain("First plant to check");
    expect(html).not.toContain("First place to check");
    expect(html).toContain("Garden map");
    expect(html.indexOf("Garden map")).toBeLessThan(html.indexOf("This week"));
    expect(html).not.toContain("Beds and areas");
    expect(html).not.toContain("Garden places");
    expect(html).not.toContain("Garden layout");
    expect(html).not.toContain("What needs care next");
    expect(html).not.toContain("Care at a glance");
    expect(html).not.toContain("What needs attention");
    expect(html).toContain("4 plants in 3 beds");
    expect(html).not.toContain("4 plants saved in 3 beds");
    expect(html).not.toContain("2 areas, 3 beds, 4 growing plants");
    expect(html).toContain("Start with Bell Pepper. Read its notes before you act.");
    expect(html).not.toContain("Start with Bell Pepper. View its notes when you need context.");
    expect(html).not.toContain("Start with Bell Pepper. Open it when you want its notes.");
    expect(html).not.toContain("Start with care for Bell Pepper. Open the plant if you need its notes.");
    expect(html).not.toContain("Open Bell Pepper to see what happened there.");
    expect(html).not.toContain("Open a bed to see what happened there.");
    expect(html).not.toContain("Open any bed to see notes, photos, and care.");
    expect(html).not.toContain("Open any bed to see notes and photos.");
    expect(html).not.toContain("Open any bed for notes and photos.");
    expect(html).not.toContain("Start here, or open any bed for notes and photos.");
    expect(html).not.toContain("Start with the next plant to check, or open any bed for notes and photos.");
    expect(html).not.toContain("Start with the next plant to check, or open any bed for notes.");
    expect(html).not.toContain("Open a place or plant for its notes, photos, and care.");
    expect(propertySource).toContain("Choose a bed or plant when you want its notes.");
    expect(propertySource).not.toContain("Open a bed or plant when you want its notes.");
    expect(propertySource).not.toContain("Open a bed or plant to see what happened there.");
    expect(propertySource).not.toContain("Open any bed or plant for notes, photos, and care.");
    expect(propertySource).not.toContain("Open any bed or plant for notes and photos.");
    expect(html).not.toContain("Pick a place or plant to see its notes and next step.");
    expect(html).not.toContain("Pick an area, bed, or plant to see its notes and next care.");
    expect(html).toContain("Bell Pepper");
    expect(html).toContain("Water deeply before the hot afternoon");
    expect(html).toContain("Container Row · Kitchen Garden");
    expect(html).toContain("View Bell Pepper notes");
    expect(html).not.toContain("Open Bell Pepper");
    expect(html).not.toContain("Open notes");
    expect(html).not.toContain("Open plant notes");
    expect(html).not.toContain("Open plant history");
    expect(html).not.toContain("Open plant record");
    expect(html).not.toContain("Next step: Water deeply before the hot afternoon");
    expect(html).not.toContain("Pick a place or plant to see its notes and next care.");
    expect(html).not.toContain("Choose a place to see what happened there and what needs care next.");
    expect(html).not.toContain("Next care item: Water deeply before the hot afternoon");
    expect(html).not.toContain("Add to map");
    expect(html).not.toContain("Next care task:");
    expect(html).not.toContain("Next care: Water deeply before the hot afternoon");
    expect(html).toMatch(/Jun 23(, 2026)?/);
    expect(html).not.toContain("2026-06-23");
    expect(html).not.toContain("Pick any place");
    expect(html).not.toContain(">Overview<");
    expect(html).not.toContain(">Tasks<");
    expect(html).not.toContain(">Next steps<");
    expect(html).not.toContain(">Info<");
    expect(html).not.toContain("Care timeline");
    expect(html).not.toContain("Field note");
    expect(html).not.toContain("Browse the sample");
    expect(html).not.toContain("About this sample garden");
    expect(html).not.toContain("AI suggestions");
    expect(html).not.toContain("Remove");
    expect(html).not.toContain("Edit");
    expect(html).not.toContain("Delete this");
    expect(html).not.toContain("Add task here");
    expect(previewSource).not.toContain("showRailHeader");
    expect(previewSource).not.toContain("Choose garden");
    expect(appSource).not.toContain("showRailHeader");
    expect(appSource).not.toContain("Choose garden");
    expect(propertySource).not.toContain("persistZoneLayout");
    expect(propertySource).not.toContain("persistBedLayout");
    expect(propertySource).not.toContain("garden-plot__canvas");
    expect(propertySource).not.toContain("garden-zone--placed");
    expect(propertySource).not.toContain("garden-bed--placed");
    expect(propertySource).not.toContain("onPointerDown");
    expect(propertySource).not.toContain("resize its corner");
    expect(propertySource).not.toContain("Arrange");
    expect(propertySource).not.toContain("Add to map");
    expect(propertySource).toContain('aria-label="Mark care done"');
    expect(propertySource).toContain('aria-label="Put care back in the plan"');
    expect(propertySource).not.toContain('aria-label="Put care back on the list"');
    expect(propertySource).not.toContain('aria-label="Mark care item done"');
    expect(propertySource).not.toContain('aria-label="Put care item back on the list"');
    expect(propertySource).toContain('focus !== "property" ? (');
  });

  it("keeps the reusable sample helper focused on starting your own garden", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAppPreview, {
        snapshot,
        view: "property"
      })
    );

    expect(html).toContain("Start your garden");
    expect(html).not.toContain("Look around");
    expect(html).not.toContain("Try it first");
    expect(getDemoSaveNotice("keep this note where it belongs")).toBe("Start your garden to keep this note where it belongs.");
    expect(getDemoSaveNotice("adjust this care")).toBe("Start your garden to adjust this care.");
    expect(getDemoSaveNotice("adjust this care")).not.toContain("then you can");
    expect(getDemoSaveNotice("adjust this care")).not.toContain("future checks remember");
    expect(getDemoSaveNotice("adjust this care")).not.toContain("Start your garden to keep notes like these.");
    expect(getDemoSaveNotice("keep this note where it belongs")).not.toContain("save changes");
    expect(getDemoSaveNotice("adjust this care")).not.toContain("Care item");
    expect(html).not.toContain("Example garden");
    expect(html).not.toContain("Sample garden");
    expect(html).not.toContain("Preview garden");
    expect(html).not.toContain("Demo garden");
    expect(getDemoSaveNotice("keep this note where it belongs")).not.toContain("This sample stays unchanged.");
    expect(getDemoSaveNotice("keep this note where it belongs")).not.toContain("This preview stays unchanged.");
    const previewSource = readFileSync(
      new URL("../components/garden-app-preview.tsx", import.meta.url),
      "utf8"
    );
    expect(previewSource).toContain('sampleSave("adjust this care")');
    expect(previewSource).not.toContain('sampleSave("update this care note")');
    expect(previewSource).toContain('sampleSave("change weekly care")');
    expect(previewSource).not.toContain('sampleSave("change this care in your garden")');
    expect(previewSource).not.toContain('sampleSave("change weekly care in your garden")');
    expect(previewSource).not.toContain('sampleSave("Care kept on your list.")');
    expect(previewSource).not.toContain('sampleSave("Care kept in your plan.")');
    expect(previewSource).toContain('sampleSave("name one place")');
    expect(previewSource).not.toContain('sampleSave("name one area next")');
    expect(previewSource).toContain('sampleSave("name one place, then one bed")');
    expect(previewSource).not.toContain('sampleSave("name one area")');
    expect(previewSource).not.toContain('sampleSave("name one area, then one bed")');
    expect(previewSource).toContain('sampleSave("name one bed, then add a plant")');
    expect(previewSource).toContain('sampleSave("keep this note where it belongs")');
    expect(previewSource).not.toContain('sampleSave("keep this note with the right plant")');
    expect(previewSource).not.toContain('sampleSave("save this note with the right plant")');
    expect(previewSource).not.toContain('sampleSave("Try');
    expect(previewSource).not.toContain('sampleSave("Your garden is saved. Now name one area.")');
    expect(previewSource).not.toContain('sampleSave("Area saved. Now name one bed.")');
    expect(previewSource).not.toContain('sampleSave("Bed saved. Now add the plant.")');
    expect(previewSource).not.toContain('sampleSave("Plant saved to your garden. Add a note when you notice something.")');
    expect(previewSource).not.toContain('sampleSave("Note saved to your garden.")');
    expect(previewSource).not.toContain('sampleSave("Your garden is saved. Now add a place to grow.")');
    expect(previewSource).not.toContain('sampleSave("Area saved. Now add a bed.")');
    expect(previewSource).not.toContain('sampleSave("Bed saved. Now add a plant.")');
    expect(previewSource).not.toContain("Add the first area next");
    expect(previewSource).not.toContain("Add the first bed next");
    expect(previewSource).not.toContain("Add the first plant next");
    expect(previewSource).toContain("From the photo and garden notes");
    expect(previewSource).toContain("Your garden notes say containers dry fast");
    expect(previewSource).not.toContain("saved garden notes");
    expect(previewSource).toContain("Feel the containers first");
    expect(previewSource).toContain("Plant one small herb near the kitchen bed.");
    expect(previewSource).toContain("Start by looking closely before changing care.");
    expect(previewSource).not.toContain("Try one small herb planting");
    expect(previewSource).not.toContain("Check containers first");
    expect(previewSource).not.toContain("direct soil check");
    expect(previewSource).not.toContain("daily checks");
    expect(previewSource).not.toContain("Start with one close check");
    expect(previewSource).toContain("Borage, Bouquet Dill, and Bell Pepper are in different beds");
    expect(previewSource).not.toContain("From the photo and sample garden notes");
    expect(previewSource).not.toContain("The sample garden notes say containers dry fast");
    expect(previewSource).not.toContain("French Marigold, Foxglove, and Curry Leaf");
    expect(previewSource).not.toContain("Care item updated.");
    expect(previewSource).not.toContain("Care item kept on your list.");
  });

  it("keeps selected plant timelines read-only in My Garden", () => {
    const activePlant = snapshot.plants[0];
    const activeZone = snapshot.zones.find((zone) => zone.id === activePlant.zone_id) ?? null;
    const activeBed = snapshot.beds.find((bed) => bed.id === activePlant.bed_id) ?? null;

    const html = renderToStaticMarkup(
      createElement(PropertyView, {
        activeProperty: snapshot.properties[0],
        activeZone,
        activeBed,
        activePlant,
        zones: snapshot.zones,
        beds: snapshot.beds,
        plants: snapshot.plants,
        plantProfiles: snapshot.plantProfiles,
        observations: snapshot.observations,
        tasks: snapshot.tasks,
        outcomes: snapshot.outcomes,
        selectedZoneId: activeZone?.id ?? "",
        selectedBedId: activeBed?.id ?? "",
        selectedPlantId: activePlant.id,
        setSelectedZoneId: () => undefined,
        setSelectedBedId: () => undefined,
        setSelectedPlantId: () => undefined,
        isSaving: false,
        isLoading: false,
        createProperty: noop,
        updateProperty: noop,
        deleteProperty: noop,
        createZone: noop,
        updateZone: noop,
        deleteZone: noop,
        mediaUrls: {},
        createBed: noop,
        updateBed: noop,
        deleteBed: noop,
        addPlant: noop,
        updatePlant: noop,
        deletePlant: noop,
        updatePlantStatus: noop,
        addObservation: noop,
        deleteObservation: noop,
        addTask: noop,
        updateTaskStatus: noop,
        deleteTask: noop,
        addPlantOutcome: noop,
        deletePlantOutcome: noop,
        isReadOnly: true
      })
    );

    expect(html).not.toContain('aria-label="Active context"');
    expect(html).toContain("Plant journal");
    expect(html).toContain("Status</dt><dd>Growing</dd>");
    expect(html).toContain("Notes");
    expect(html).not.toContain("Add task");
    expect(html).not.toContain("Not now");
    expect(html).not.toContain("Log harvest");
    expect(html).not.toContain("Add harvest or result");
    expect(html).not.toContain("try next");
    expect(html).not.toContain("Remove");
    expect(html).not.toContain("Check a plant problem");
    expect(html).not.toContain("<dd>growing</dd>");
    expect(html).not.toContain("Field note");
  });

  it("keeps the sample Plants default drawer focused on choosing a plant", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAppPreview, {
        basePath: "/sample-garden",
        snapshot,
        view: "plants"
      })
    );
    const appSource = readFileSync(new URL("../components/garden-app.tsx", import.meta.url), "utf8");
    const plantsSource = readFileSync(new URL("../components/views/plants-view.tsx", import.meta.url), "utf8");

    expect(html).toContain("Plant Journal");
    expect(html).not.toContain("Plant records");
    expect(html).not.toContain("Plant history");
    expect(html).toContain("Your plants");
    expect(html).toContain("Plant notes");
    expect(html).toContain("Choose a plant");
    expect(html).toContain("Open a plant to see notes and care.");
    expect(html).not.toContain("Pick a plant");
    expect(html).not.toContain("My Plants");
    expect(appSource).toContain('title: "Plant Journal"');
    expect(appSource).not.toContain('title: "Plants"');
    expect(html).toContain("Open a plant to see notes and care.");
    expect(html).not.toContain("Choose one plant to see what happened and what helped.");
    expect(appSource).toContain('subtitle: "Open a plant to see notes and care."');
    expect(appSource).not.toContain('subtitle: "Choose one plant to see what happened and what helped."');
    expect(html).not.toContain("Start with the plants that need care.");
    expect(appSource).not.toContain('subtitle: "Start with the plants that need care."');
    expect(appSource).not.toContain('subtitle: "Open a plant to see what happened and what to do next."');
    expect(plantsSource).toContain("Choose a plant to keep a note or see what needs care.");
    expect(plantsSource).toContain("Choose a plant to keep a note or see where it grows.");
    expect(plantsSource).not.toContain("Choose a plant to save a note or see what needs care.");
    expect(plantsSource).not.toContain("Choose a plant to save a note or see where it grows.");
    expect(html).not.toContain("Pick a plant to see notes, photos, and this week&#x27;s care.");
    expect(appSource).not.toContain('subtitle: "Pick a plant to see notes, photos, and this week\'s care."');
    expect(html).not.toContain("Pick a plant to see notes, photos, and next care.");
    expect(appSource).not.toContain('subtitle: "Pick a plant to see notes, photos, and next care."');
    expect(html).not.toContain("See what needs care, then keep notes and photos with the right plant.");
    expect(appSource).not.toContain('subtitle: "See what needs care, then keep notes and photos with the right plant."');
    expect(appSource).not.toContain("See what needs care and keep every note and photo with the right plant.");
    expect(html).not.toContain("See what needs care and keep every note and photo with the right plant.");
    expect(appSource).not.toContain("Check plants that need care first. Keep notes and photos together.");
    expect(html).not.toContain("Check plants that need care first. Keep notes and photos together.");
    expect(appSource).not.toContain("Start with plants that need care. Open one for notes and photos.");
    expect(html).not.toContain("Start with plants that need care. Open one for notes and photos.");
    expect(appSource).not.toContain("Plants with care due soon appear first. Open one for notes and photos.");
    expect(html).not.toContain("Plants with care due soon appear first. Open one for notes and photos.");
    expect(html).not.toContain("Plants needing care this week appear first. Open any plant for notes, photos, and history.");
    expect(html).not.toContain("First plant to check");
    expect(html).not.toContain("Start with the next plant to check, then open any plant record.");
    expect(html).not.toContain("open any plant record");
    expect(html).not.toContain("Choose a plant to see its notes, photos, and next steps.");
    expect(html).not.toContain("Choose a plant to see where it lives, what happened, and what needs care next.");
    expect(html).not.toContain("Choose a plant to see its notes, photos, and next care.");
    expect(html).not.toContain("Plants</span><span>Plant journal");
    expect(html).not.toContain('garden-drawer__scope"><span class="ink-stamp ink-stamp--olive">Your plants</span>');
    expect(html).not.toContain("See what is growing, where it lives, and what needs care next.");
    expect(html).toContain("4 plants need care this week.");
    expect(html).not.toContain("4 saved plants in 3 beds");
    expect(html).not.toContain("4 growing plants across 3 beds");
    expect(html).toContain("Start with Bell Pepper. Open any plant when you need its notes.");
    expect(html).not.toContain("4 plants in 3 beds. Start with Bell Pepper. Choose any plant when you want its notes.");
    expect(html).not.toContain("Start with the next check, or open any plant.");
    expect(html).not.toContain("Open a plant to see what happened and what to do next.");
    expect(html).not.toContain("Pick a plant to see notes, photos, and this week&#x27;s care.");
    expect(html).not.toContain("Pick a plant to see notes, photos, and next care.");
    expect(html).not.toContain("See what needs care, then keep notes and photos with the right plant.");
    expect(html).not.toContain("See what needs care and keep every note and photo with the right plant.");
    expect(html).not.toContain("Check plants that need care first.");
    expect(html).not.toContain("Keep notes and photos together.");
    expect(html).not.toContain("Plants with care due soon appear first.");
    expect(html).not.toContain("Plants with care this week appear first.");
    expect(html).not.toContain("Open any plant for notes, photos, and history.");
    expect(html).not.toContain("The list starts with the next plant to check.");
    expect(html).not.toContain("The first record is the next plant to check.");
    expect(html).not.toContain("Open any plant for its notes, photos, and history.");
    expect(html).not.toContain("Pick one to see notes, photos, and next steps.");
    expect(html).not.toContain("Pick one to see notes, photos, and next care.");
    expect(html).toContain("4 plants need care this week.");
    expect(html).not.toContain("4 plants have care this week.");
    expect(html).not.toContain("4 plants to check this week.");
    expect(html).not.toContain("Pick one to see what happened and what needs care next.");
    expect(html).toContain("6 plants · 4 weeks, 5 days in ground");
    expect(html).toContain("4 plants · 3 weeks in ground");
    expect(html).toContain("1 plant · 8 weeks, 2 days in ground");
    expect(html).toContain("2 plants · 3 weeks in ground");
    expect(html).toContain("Flower · Annual");
    expect(html).toContain("Flower");
    expect(html).not.toContain("Calendula officinalis");
    expect(html).not.toContain("Coriandrum sativum");
    expect(html).not.toContain("Capsicum annuum");
    expect(html).toContain("4 weeks, 5 days in ground");
    expect(html).toContain("8 weeks, 2 days in ground");
    expect(html).toContain("3 weeks in ground");
    expect(html).toContain("This week:");
    expect(html).not.toContain("Care:");
    expect(html).not.toContain("Next:");
    expect(html).not.toContain("Next care:");
    expect(html).not.toContain("Care note:");
    expect(html).not.toContain("Next step:");
    expect(html).not.toContain("Next up:");
    expect(html).toContain("Water deeply before the hot afternoon");
    expect(html.indexOf("Bell Pepper")).toBeLessThan(html.indexOf("Bouquet Dill"));
    expect(html.indexOf("Water deeply before the hot afternoon")).toBeLessThan(
      html.indexOf("Harvest dill before afternoon heat")
    );
    expect(html).not.toContain("4w 5d in ground");
    expect(html).not.toContain("11w 5d in ground");
    expect(html).not.toContain("8w 2d in ground");
    expect(html).not.toContain("6 growing ·");
    expect(html).not.toContain("2 growing ·");
    expect(html).not.toContain("1 growing ·");
    expect(html).not.toContain("planted 2026-");
    expect(html).not.toContain("what needs attention next");
    expect(html).not.toContain("need care soon");
    expect(html).not.toContain("Track what is growing now, what you saved for later, and what you learned from past seasons.");
    expect(html).not.toContain("next care signal");
    expect(html).not.toContain("timeline and next care signal");
    expect(html).not.toContain("Due soon");
    expect(html).not.toContain("Next step:");
    expect(html).not.toContain("(due 2026");
    expect(html).not.toContain("Filter plants");
    expect(html).not.toContain("Narrow plants");
    expect(html).not.toContain("Plants at a glance");
    expect(html).not.toContain("Active plants");
    expect(html).not.toContain("Distinct species");
    expect(html).not.toContain("Beds in use");
    expect(html).not.toContain(">Grid<");
    expect(html).not.toContain(">List<");
    expect(html).not.toContain("Calendula</strong><span");
    expect(html).not.toContain("Cilantro</strong><span");
    expect(html).not.toContain("garden-plants2-empty-guide__focus");
    expect(html).not.toContain(">Growing</span>");
    expect(html).not.toContain("Archived<span");
    expect(html).not.toContain("Saved<span");
    expect(html).not.toContain(">Info<");
    expect(html).not.toContain(">Timeline<");
    expect(html).not.toContain(">History<");
    expect(html).not.toContain(">Filters<");
    expect(html).not.toContain("All areas");
    expect(html).not.toContain("All beds");
  });

  it("formats planted dates before showing them in plant summaries", () => {
    const source = readFileSync(
      new URL("../components/views/plants-view.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain("planted ${formatGardenDate(plant.planted_on)}");
    expect(source).toContain("planted ${formatGardenDate(selectedPlant.planted_on)}");
    expect(source).toContain("due ${formatGardenDate(nextTask.due_on)}");
    expect(source).toContain("{formatGardenDate(nextTask.due_on)}");
    expect(source).not.toContain("planted ${plant.planted_on}");
    expect(source).not.toContain("planted ${selectedPlant.planted_on}");
    expect(source).not.toContain("due ${nextTask.due_on}");
    expect(source).not.toContain("{nextTask.due_on}");
    expect(source).toContain("Maybe later");
    expect(source).not.toContain("Saved for later");
    expect(source).not.toContain("Saved as an idea");
  });

  it("does not describe hidden add or save actions in sample plant chooser", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAppPreview, {
        basePath: "/sample-garden",
        snapshot,
        view: "catalogue"
      })
    );

    expect(html).toContain("Choose plants");
    expect(html).toContain("For your beds");
    expect(html).not.toContain("Plant choices");
    expect(html).toContain("Choose plants for the beds you have.");
    expect(html).not.toContain("Choose plants for your light, water, and beds.");
    expect(html).not.toContain("Find plants that fit the beds you have.");
    expect(html).not.toContain("Plant Guide");
    expect(html).not.toContain("Choose plants that fit the beds you have.");
    expect(html).toContain("3 plants to choose from");
    expect(html).not.toContain("3 plants that fit");
    expect(html).not.toContain("3 plants to consider");
    expect(html).not.toContain("3 plant choices");
    expect(html).toContain("planting notes");
    expect(html).not.toContain("quick fit");
    expect(html).toContain("Sun");
    expect(html).not.toContain(">Light<");
    expect(html).toContain("Best spot");
    expect(html).toContain("Good to remember");
    expect(html).not.toContain("Remember later");
    expect(html).not.toContain("Keep notes on");
    expect(html).not.toContain("Fits");
    expect(html).not.toContain("Watch for");
    expect(html).toContain("Sunny bed edges where pollinator visits and reseeding are easy to watch.");
    expect(html).toContain("A sunny herb bed where repeat sowings and harvest timing stay visible.");
    expect(html).toContain("Warm containers or bed edges where watering and heat stress are easy to notice.");
    expect(html).not.toContain("Warm containers or bed edges where watering and heat notes are easy to track.");
    expect(html).toContain("Bloom timing, pollinator visits, and deadheading.");
    expect(html).toContain("Harvest timing, heat stress, and flavor.");
    expect(html).toContain("Watering, support, harvest, and pests.");
    expect(html.indexOf("Best spot")).toBeLessThan(html.indexOf("Sun"));
    expect(html.indexOf("Best spot")).toBeLessThan(html.indexOf("Good to remember"));
    expect(html).not.toContain("Save bloom timing, pollinator visits, and deadheading notes.");
    expect(html).not.toContain("Save harvest timing, heat stress, and flavor notes.");
    expect(html).not.toContain("Save watering, support, harvest, and pest notes.");
    expect(html).not.toContain("Not listed");
    expect(html).not.toContain("Calendula officinalis");
    expect(html).not.toContain("Coriandrum sativum");
    expect(html).not.toContain("Capsicum annuum");
    expect(html).not.toContain("UNKNOWN");
    expect(html).not.toContain("Unknown");
    expect(html).not.toContain("<dt>Height</dt>");
    expect(html).not.toContain("Garden tracking demo");
    expect(html).not.toContain("Tracking Demo");
    expect(html).not.toContain("Demo plant image");
    expect(html).not.toContain("Good fit for a small, closely watched planting.");
    expect(html).not.toContain("Compare sun, water, and space before you choose what to grow.");
    expect(html).not.toContain("3 plants to compare");
    expect(html).not.toContain("Care guide");
    expect(html).not.toContain("Find Plants");
    expect(html).not.toContain("Choose plants that fit your beds.");
    expect(html).not.toContain("Check care needs and garden fit before you choose what to grow.");
    expect(html).not.toContain("garden fit");
    expect(html).not.toContain("Care effort");
    expect(html).not.toContain("Find plants that fit your garden, then keep them tied to a bed and season.");
    expect(html).not.toContain("Compare care needs");
    expect(html).not.toContain("plants with care notes");
    expect(html).not.toContain("Care notes");
    expect(html).not.toContain("Plant profile");
    expect(html).not.toContain("Showing all plant types");
    expect(html).not.toContain("Filter plants");
    expect(html).not.toContain("Narrow choices");
    expect(html).not.toContain("then add them to a bed or save them for later");
    expect(html).not.toContain("start your own record");
    expect(html).not.toContain("before adding it to your own record");
    expect(html).not.toContain("Keep a record");
    expect(html).not.toContain("All <small>3</small>");
    expect(html).not.toContain("Sort</label>");
    expect(html).not.toContain("<dt>Fit</dt>");
    expect(html).not.toContain("Field notes");
    expect(html).not.toContain("Care snapshot");
    expect(html).not.toContain("Why grow it");
    expect(html).not.toContain("Primary uses");
    expect(html).not.toContain("Small garden notes");
    expect(html).not.toContain("Add to");
    expect(html).not.toContain("Save for later");
  });

  it("uses simple weekly care labels in the sample calendar", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAppPreview, {
        basePath: "/sample-garden",
        snapshot,
        view: "calendar"
      })
    );

    expect(html).toContain("Start with what needs care. Let the rest wait.");
    expect(html).toContain("This week");
    expect(html).toContain("Weekly care");
    expect(html).not.toContain(">This Week<");
    expect(html).not.toContain("Do the first care step. Let the rest wait.");
    expect(html).not.toContain("Start with the next care check. Let the rest wait.");
    expect(html).not.toContain("Start with today&#x27;s care. Let the rest wait.");
    expect(html).not.toContain("Start with this week&#x27;s care. Let the rest wait.");
    expect(html).toContain("First up");
    expect(html).not.toContain("Start here");
    expect(html).not.toContain("Next care");
    expect(html).not.toContain("This week&#x27;s care");
    expect(html).not.toContain("Care this week</");
    expect(html).toContain('aria-label="Care for this week"');
    expect(html).toMatch(/\d+ things need care this week/);
    expect(html).not.toContain('aria-label="Care notes this week"');
    expect(html).not.toMatch(/\d+ care notes this week/);
    expect(html).not.toContain('aria-label="Garden jobs this week"');
    expect(html).not.toMatch(/\d+ garden jobs this week/);
    expect(html).not.toMatch(/\d+ care steps this week/);
    expect(html).not.toMatch(/\d+ to do this week/);
    expect(html).not.toMatch(/\d+ open this week/);
    expect(html).not.toMatch(/\d+ care checks?/);
    expect(html).not.toMatch(/\d+ things? to check/);
    expect(html).not.toMatch(/\d+ care jobs?/);
    expect(html).toContain("Today");
    expect(html).toContain("Later this week");
    expect(html).not.toMatch(/\d+ later this week/);
    expect(html).not.toMatch(/\d+ after today/);
    expect(html).not.toMatch(/\d+ more checks?/);
    expect(html).not.toContain("First today");
    expect(html).not.toContain("Coming up");
    expect(html).not.toMatch(/\d+ more this week/);
    expect(html).not.toMatch(/\d+ care checks? later this week/);
    expect(html).not.toMatch(/\d+ care jobs? later this week/);
    expect(html).toContain("Harvest dill before afternoon heat");
    expect(html).toContain("Note bloom duration");
    expect(html).toMatch(/garden-cal2-type-tag--watering[^>]*>Water</);
    expect(html).toMatch(/garden-cal2-type-tag--inspection[^>]*>Check</);
    expect(html).toMatch(/garden-cal2-type-tag--observation[^>]*>Note</);
    expect(html).not.toContain("Maintenance");
    expect(html.match(/Water deeply before the hot afternoon/g) ?? []).toHaveLength(1);
    expect(html.match(/Harvest dill before afternoon heat/g) ?? []).toHaveLength(1);
    expect(html).not.toContain("Ideas for later");
    expect(html).not.toContain("This season");
    expect(html).not.toContain("Later care");
    expect(html).not.toContain("Refresh mulch on exposed soil");
    expect(html).not.toContain("What to do next");
    expect(html).not.toContain("Care suggestions should keep this tied");
    expect(html).not.toContain("Do first");
    expect(html).not.toContain("Worth considering");
    expect(html).not.toContain("From your garden");
    expect(html).not.toContain("Suggested next steps");
    expect(html).not.toContain("Track how long this flush lasts before deadheading.");
    expect(html).not.toContain("Suggested step");
    expect(html).not.toContain("Recommended");
    expect(html).not.toContain("Next care steps");
    expect(html).not.toContain("Upcoming (14 days)");
    expect(html).not.toContain("Pattern spotted");
    expect(html).not.toContain("Needs attention");
    expect(html).not.toContain(">later<");
    expect(html).not.toContain(">this season<");
    expect(html).not.toContain(">suggestion<");
    expect(html).not.toContain(">insight<");
    expect(html).not.toContain("Why:");
    expect(html).not.toContain(">Other<");
    expect(html).not.toContain("Maintenance");
    expect(html).not.toContain("Watering");
    expect(html).not.toContain("Inspection");
    expect(html).not.toContain("Observation");
    const sampleSource = readFileSync(
      new URL("../lib/demo-garden-snapshot.ts", import.meta.url),
      "utf8"
    );
    expect(sampleSource).toContain("Keep roots cooler and hold soil moisture through the next hot stretch.");
    expect(sampleSource).not.toContain("Care suggestions should keep this tied");
  });

  it("keeps sample calendar focused on this week's care", () => {
    const html = renderToStaticMarkup(
      createElement(GardenAppPreview, {
        basePath: "/sample-garden",
        snapshot,
        view: "calendar"
      })
    );

    expect(html).toMatch(/After this week|\d+ things need care this week/);
    expect(html).not.toMatch(/\d+ garden jobs this week/);
    expect(html).not.toMatch(/\d+ care notes this week/);
    expect(html).not.toMatch(/\d+ care steps this week/);
    expect(html).not.toMatch(/\d+ to do this week/);
    expect(html).not.toMatch(/\d+ open this week/);
    expect(html).not.toContain("Care is coming up after this week.");
    expect(html).not.toMatch(/\d+ things? this week/);
    expect(html).not.toMatch(/\d+ care checks?/);
    expect(html).not.toMatch(/\d+ things? to check/);
    expect(html).not.toMatch(/\d+ care jobs?/);
    expect(html).not.toContain("things to do");
    expect(html).not.toContain("2 care checks later this week");
    expect(html).not.toMatch(/\d+ later this week/);
    expect(html).not.toContain("2 after today");
    expect(html).not.toContain("Next task coming up.");
    expect(html).not.toContain("A next step is coming up.");
    expect(html).not.toContain("Know what needs care this week and what can wait.");
    expect(html).not.toContain("Start with this week&#x27;s care. Let the rest wait.");
    expect(html).not.toContain("Next care item coming up.");
    expect(html).not.toContain("Next care is coming up.");
    expect(html).not.toContain("The next care task is below.");
    expect(html).not.toContain("Nothing urgent this week. The next step is below.");
    expect(html).not.toContain("Nothing urgent this week.");
    expect(html).not.toContain("care items");
    expect(html).not.toContain("care item");
    expect(html).toContain("Water deeply before the hot afternoon");
    expect(html).toContain("Bell Pepper in Container Row, Kitchen Garden");
    expect(html).toContain("Bouquet Dill in Herb Bed, Kitchen Garden");
    expect(html).toContain("Borage in Herb Bed, Kitchen Garden");
    expect(html.indexOf("Today")).toBeLessThan(html.indexOf("Later this week"));
    expect(html.indexOf("Water deeply before the hot afternoon")).toBeLessThan(
      html.indexOf("Harvest dill before afternoon heat")
    );
    expect(html).not.toContain("Kitchen Garden · Container Row · Bell Pepper");
    expect(html).not.toContain("Kitchen Garden · Herb Bed · Cilantro");
    expect(html).toMatch(/Jun 23(, 2026)?/);
    expect(html).toMatch(/Jun 25(, 2026)?/);
    expect(html).toMatch(/Jun 27(, 2026)?/);
    expect(html).not.toContain("2026-06-23");
    expect(html).not.toContain("2026-06-25");
    expect(html).not.toContain("2026-06-27");
    expect(html).not.toContain("garden-cal2-week-grid");
    expect(html).not.toContain("garden-cal2-day-col");
    expect(html).not.toContain("Showing all open tasks");
    expect(html).not.toContain("Needs attention");
    expect(html).not.toContain("Filter tasks");
    expect(html).not.toContain("Check the upcoming list below");
    expect(html).not.toContain(">Week<");
    expect(html).not.toContain(">Month<");
    expect(html).not.toContain("‹ Prev");
    expect(html).not.toContain("Next ›");
    expect(html).not.toContain("Use Next to look ahead");
    expect(html).not.toContain("add a task below");
    expect(html).not.toContain("All areas");
    expect(html).not.toContain("All beds");
    expect(html).not.toContain("All plants");
    expect(html).not.toContain("Completed");
  });
});
