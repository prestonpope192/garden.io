import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { JournalShell } from "@/components/journal-primitives";

describe("HomePage", () => {
  it("renders user-facing garden notebook positioning", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("Garden.io");
    expect(html).toContain("Your garden, smarter.");
    expect(html).toContain("Save what you notice. Get care advice that remembers your plants.");
    expect(html).not.toContain("Note what changed. Keep what helped. See what works.");
    expect(html).not.toContain("Save what changed. Keep what helped. See what works.");
    expect(html).not.toContain("Save what changed. Get one care step. Remember what worked.");
    expect(html).not.toContain("Save what changed. Get the next care step. Remember what worked.");
    expect(html).not.toContain("Remember what you planted, what changed, and what to do next in one calm garden notebook.");
    expect(html).not.toContain("Keep plants, notes, photos, and care together in one calm garden notebook.");
    expect(html).not.toContain("Keep each plant, place, note, photo, and care plan in one calm garden notebook.");
    expect(html).not.toContain("Keep each plant, place, note, photo, and care step in one calm garden notebook.");
    expect(html).not.toContain(
      "A calm garden notebook for what you planted, where it lives, what changed, and what needs care next."
    );
    expect(html).not.toContain("what to care for now");
    expect(html).toContain("Start with one plant. Add more when the season gives you a reason.");
    expect(html).not.toContain("Start with one plant. Add notes as the season unfolds.");
    expect(html).toContain("A living notebook for your garden");
    expect(html).not.toContain("A simple garden journal that remembers");
    expect(html).not.toContain("Every note makes your garden smarter");
    expect(html).not.toContain("A living memory for your garden");
    expect(html).not.toContain("<h1>Garden.io</h1>");
    expect(html).not.toContain("Garden.io remembers your plants");
    expect(html).not.toContain("Know what to do next in your garden.");
    expect(html).not.toContain("helps you understand what changed, what matters, and what to do next");
    expect(html).not.toContain("Keep plants, photos, notes, and care in one place so every next step has context.");
    expect(html).not.toContain("Snap a photo, ask a question, and save the answer with the plant, bed, or season it belongs to.");
    expect(html).not.toContain("Ask with a quick note or photo. Keep the answer with the plant, bed, or season it belongs to.");
    expect(html).not.toContain("Built for busy gardeners who need a quick answer, not another spreadsheet.");
    expect(html).not.toContain("Built for gardeners who want help that remembers the garden they actually have.");
    expect(html).not.toContain("Know what you planted, where it is, and what needs care next.");
    expect(html).not.toContain("For gardeners who forget what worked");
    expect(html).not.toContain("For busy gardeners who want the next step to be obvious.");
    expect(html).not.toContain("what failed, and what needs care next");
    expect(html).not.toContain("what needs attention");
    expect(html).not.toContain("what needs attention next");
    expect(html).not.toContain("Living garden records");
    expect(html).not.toContain("Add a quick note or photo as you garden.");
    expect(html).not.toContain("The more you save, the more useful each answer becomes.");
  });

  it("keeps browser and share metadata aligned with the simple promise", () => {
    const source = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
    const shellSource = readFileSync(new URL("../components/journal-primitives.tsx", import.meta.url), "utf8");

    expect(source).toContain("Garden.io | Your Garden, Smarter");
    expect(source).toContain(
      "Save what you notice. Get care advice that remembers your plants."
    );
    expect(source).not.toContain(
      "Track changes, ask what they mean, and keep useful answers with the right plant."
    );
    expect(source).not.toContain(
      "Save garden notes, keep what helped, and see what works over time."
    );
    expect(source).not.toContain(
      "Save what changed, get one care step, and remember what worked."
    );
    expect(source).not.toContain(
      "Save what changed, get the next care step, and remember what worked."
    );
    expect(source).not.toContain(
      "Remember what you planted, what changed, and what to do next."
    );
    expect(source).not.toContain(
      "Keep a simple garden journal with plants, notes, photos, and care in one place."
    );
    expect(source).not.toContain("plant history");
    expect(source).not.toContain("smarter care guidance");
    expect(source).not.toContain("Garden.io | Know What Your Garden Needs");
    expect(source).not.toContain("Keep beds, plants, notes, photos, and next steps in one place.");
    expect(source).not.toContain("plant records");
    expect(shellSource).toContain("Remember what happened and what helped.");
    expect(shellSource).not.toContain("Remember what happened and what to do next.");
    expect(shellSource).not.toContain("Keep plants, notes, photos, and next care in one garden journal.");
    expect(shellSource).not.toContain("Keep your plants, notes, photos, and care in one garden journal.");
    expect(shellSource).not.toContain("care history");
  });

  it("keeps app shell navigation in journal language", () => {
    const html = renderToStaticMarkup(
      createElement(JournalShell, { currentPath: "/app/my-plants" }, createElement("div"))
    );

    expect(html).toContain("Plant Journal");
    expect(html).toContain("My Garden");
    expect(html).toContain("Weekly care");
    expect(html).not.toContain(">This Week</a>");
    expect(html).toContain("Choose plants");
    expect(html).not.toContain("Field Guide");
    expect(html).not.toContain(">Plants</a>");
    expect(html).not.toContain(">My Plants</a>");
  });

  it("renders garden and catalogue entry points without launch language", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("Start your garden");
    expect(html).toContain("Tour a garden journal");
    expect(html).not.toContain("Browse an example garden");
    expect(html).not.toContain("See a sample garden");
    expect(html).not.toContain(">Tour a garden</a>");
    expect(html).toContain("/tour");
    expect(html).not.toContain("/sample-garden");
    expect(html).toContain("Choose plants");
    expect(html).not.toContain("Find plants");
    expect(html.match(/Start your garden/g)?.length).toBe(1);
    expect(html.match(/Tour a garden journal/g)?.length).toBe(1);
    expect(html).toContain("Apple journal-style plant image");
    expect(html).not.toContain("Apple garden note");
    expect(html).toContain("Apple journal-style plant image.");
    expect(html).toContain("Borage journal-style plant image.");
    expect(html).toContain("Bouquet Dill journal-style plant image.");
    expect(html).not.toContain("Apple botanical plate.");
    expect(html).not.toContain("Borage botanical plate.");
    expect(html).not.toContain("Bouquet Dill botanical plate.");
    expect(html).not.toContain("Apple garden image.");
    expect(html).toContain("First bloom");
    expect(html).not.toContain("Apple field-guide plate");
    expect(html).not.toContain("Bloom note");
    expect(html).not.toContain("Blooming now");
    expect(html).toContain("Apr. 12. Compare fruit set and harvest later.");
    expect(html).not.toContain("Note the bloom date once. Compare fruit set and harvest later.");
    expect(html).not.toContain("Bloom note: compare this week&#x27;s flowers before deadheading.");
    expect(html).not.toContain("Field note: save bloom timing now, then compare it before deadheading.");
    expect(html).not.toContain("topbar-cta");
    expect(html).not.toContain("home-start-cta");
    expect(html).not.toContain("Start with the garden you already have.");
    expect(html).not.toContain("Add one plant today. When the season changes, the notes are already there.");
    expect(html).not.toContain("Garden note: record bloom timing now");
    expect(html).not.toContain("Next step:");
    expect(html).not.toContain("See it in action");
    expect(html).not.toContain("Look around");
    expect(html).not.toContain("Start tracking");
    expect(html).not.toContain("Waitlist");
    expect(html).not.toContain("early access");
    expect(html).not.toContain("Working product");
    expect(html).not.toContain("whole product");
    expect(html).not.toContain("homepage");
    expect(html).not.toContain("Garden tracking preview");
    expect(html).not.toContain("Explore plants");
    expect(html).not.toContain('href="#plants">Plants</a>');
    expect(html).not.toContain("How it works");
  });

  it("describes tracking and plant memory", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("Capture what changed");
    expect(html).toContain("Notes and photos stay with the right plant, bed, and season.");
    expect(html).not.toContain("Know what is where");
    expect(html).not.toContain("Give each plant a spot once, then every note has a home.");
    expect(html).not.toContain("Give each plant a home");
    expect(html).not.toContain("Choose where it grows once. Notes and photos stay where they belong.");
    expect(html).not.toContain("Place each plant");
    expect(html).not.toContain("Choose the bed once. Every note and photo stays with that spot.");
    expect(html).not.toContain("Give every plant a bed once. Notes stay where they belong.");
    expect(html).toContain("Ask from your own notes");
    expect(html).toContain("Advice can use what you planted, where it grows, and what happened before.");
    expect(html).not.toContain("Capture the moment");
    expect(html).not.toContain("Add the bloom, pest, rain, harvest, or yellow leaf while it is fresh.");
    expect(html).not.toContain("Notice what changed");
    expect(html).not.toContain("Jot the change while it is fresh: blooms, pests, rain, harvests, or yellow leaves.");
    expect(html).not.toContain("Add what changed while it is fresh, with the right plant or bed.");
    expect(html).not.toContain("Add what changed while it is fresh, with the plant or bed it belongs to.");
    expect(html).not.toContain("Save the change while it is fresh, with the plant or bed it belongs to.");
    expect(html).not.toContain("watering, weather, and photos while they are fresh");
    expect(html).toContain("Turn answers into care");
    expect(html).toContain("Save a useful step to weekly care or keep it in the plant journal.");
    expect(html).not.toContain("Ask with context");
    expect(html).not.toContain("When something looks off, the answer starts with the plant, place, season, and notes already here.");
    expect(html).not.toContain("See what worked");
    expect(html).not.toContain("Look back before you water, prune, replant, or ask for help.");
    expect(html).not.toContain("Keep the helpful note with the right plant or bed.");
    expect(html).not.toContain("Keep the helpful note with the plant or bed it belongs to.");
    expect(html).not.toContain("Keep what helped with the plant or bed it belongs to.");
    expect(html).not.toContain("Save useful care with the plant or bed it belongs to.");
    expect(html).not.toContain("Get one care step");
    expect(html).not.toContain("Get the next care step");
    expect(html).not.toContain("Start with where it grows and what you already noticed.");
    expect(html).not.toContain("Check with its notes");
    expect(html).not.toContain("When something looks off, the answer starts with where it grows and what you already noticed.");
    expect(html).not.toContain("Care from the plant record");
    expect(html).not.toContain("When something looks off, start with that plant&#x27;s place and notes.");
    expect(html).not.toContain("Know the next care step");
    expect(html).not.toContain("When something looks off, ask with the plant and what you already noticed.");
    expect(html).not.toContain("Ask from saved notes");
    expect(html).not.toContain("When something looks off, start with the plant and what you already noticed.");
    expect(html).toContain("Simple habit");
    expect(html).toContain("Care advice that starts with your garden.");
    expect(html).not.toContain("Simple garden habit");
    expect(html).not.toContain("A simple habit for fewer garden guesses.");
    expect(html).toContain("Keep notes, photos, beds, and plant history connected so every answer has context.");
    expect(html).not.toContain("A small habit for fewer garden guesses.");
    expect(html).not.toContain("Add the note now. Use it when the next decision comes.");
    expect(html).not.toContain("Notice the change before you act.");
    expect(html).not.toContain("Add a note or photo. Keep what helped with the right plant.");
    expect(html).not.toContain("Add a note or photo. Save the next step with the plant it belongs to.");
    expect(html).not.toContain("Add a note or photo. Save the useful answer with the plant it belongs to.");
    expect(html).not.toContain("Add a note or photo. Keep the care it needs with the plant it belongs to.");
    expect(html).not.toContain("Daily rhythm");
    expect(html).not.toContain("Add a note or photo. Keep the care step with the plant it belongs to.");
    expect(html).not.toContain("How it helps");
    expect(html).not.toContain("See what changed before you act.");
    expect(html).not.toContain("Describe what changed, then save the next step with the right plant.");
    expect(html).not.toContain("Notice what changed, then keep what to try next with the right plant.");
    expect(html).not.toContain("Notice what changed, then keep the useful care step with the right plant.");
    expect(html).not.toContain("Describe what changed, then keep the useful care step with the right plant.");
    expect(html).not.toContain("Show what changed, then keep the useful care step with the right plant.");
    expect(html).not.toContain("Know what happened before deciding what to do.");
    expect(html).not.toContain("Your next question starts with the plant, place, season, and notes already in the journal.");
    expect(html).not.toContain("Save the moment");
    expect(html).not.toContain("Ask from your garden");
    expect(html).not.toContain("When something looks off, the answer starts with that plant&#x27;s place, season, and notes.");
    expect(html).not.toContain("A garden notebook that remembers with you.");
    expect(html).not.toContain("Every note, photo, and harvest gives the next question more context.");
    expect(html).not.toContain("Ask from memory");
    expect(html).not.toContain("Every note, photo, and harvest gives the next question more memory.");
    expect(html).not.toContain("Every note, photo, and harvest makes later care easier.");
    expect(html).not.toContain("future guidance");
    expect(html).not.toContain("A garden journal that helps back.");
    expect(html).toContain("Each plant keeps its own story.");
    expect(html).not.toContain("See each plant&#x27;s season in one place.");
    expect(html).not.toContain("Remember what happened to each plant.");
    expect(html).not.toContain("Each plant keeps its place in the journal.");
    expect(html).toContain("The image is the cover. The useful part is the growing history you keep with it.");
    expect(html).not.toContain("Keep bloom dates, pests, harvests, and what helped as the season changes.");
    expect(html).not.toContain("Save bloom dates, pests, harvests, and what helped as the season changes.");
    expect(html).not.toContain("Each note helps you remember what happened and what helped.");
    expect(html).not.toContain("Notes, photos, harvests, and care stay with the plant they belong to.");
    expect(html).not.toContain("A journal for each plant&#x27;s season.");
    expect(html).not.toContain("Photos, notes, harvests, and care stay with the right plant.");
    expect(html).not.toContain("Photos, notes, harvests, and care history stay with the right plant.");
    expect(html).not.toContain("Keep beds, plants, notes, photos, and next steps in one place.");
    expect(html).not.toContain("Add a quick note now. Know what to do later.");
    expect(html).not.toContain("Add a quick note now. Find the useful answer later.");
    expect(html).not.toContain("A simple place to remember what happened and what to do next.");
    expect(html).not.toContain("Map what you have");
    expect(html).not.toContain("Get the next step");
    expect(html).not.toContain("Ask what to do next");
    expect(html).not.toContain("Small notes make better answers.");
    expect(html).not.toContain("Turn notes, photos, dates, and weather into clear steps");
    expect(html).not.toContain("water, check, prune, or watch.");
    expect(html).not.toContain("care items");
    expect(html).not.toContain("Check a plant with its history");
    expect(html).not.toContain("When leaves yellow or pests show up");
    expect(html).not.toContain("the check starts with its notes, bed, photo, and season");
    expect(html).not.toContain("Check plants with context");
    expect(html).not.toContain("use its notes, bed, season, and photo to decide what to try next");
    expect(html).not.toContain("Get help when something looks off");
    expect(html).not.toContain("Describe what you see or add a photo");
    expect(html).not.toContain("Your notes, photos, dates, and weather become simple care tips");
    expect(html).not.toContain("One place for what you planted");
    expect(html).not.toContain("Quick notes become a clear garden history and better next steps.");
    expect(html).not.toContain("See the full story of each plant");
    expect(html).not.toContain("Photos, notes, harvests, plant checks, and next care all stay with the right plant.");
    expect(html).not.toContain("Photos, notes, harvests, care items, and plant checks stay with the plant they belong to.");
    expect(html).not.toContain("Photos, notes, harvests, questions, and next care all stay with the right plant.");
    expect(html).not.toContain("Photos, notes, tasks");
    expect(html).not.toContain("Garden tracking example");
    expect(html).not.toContain("Plant memory");
    expect(html).not.toContain("Garden.io turns");
    expect(html).not.toContain("AI can use your notes");
    expect(html).not.toContain("AI turns your notes");
    expect(html).not.toContain("practical suggestions");
    expect(html).not.toContain("Get AI advice grounded in your garden");
    expect(html).not.toContain("Ask about one plant");
    expect(html).not.toContain("Suggestions use your notes, photos, timing, and weather");
    expect(html).not.toContain("Keep beds, plants, notes, photos, and next care in one place.");
    expect(html).not.toContain("what is actually happening outside");
    expect(html).not.toContain("Every plant gets its own living history");
    expect(html).not.toContain("Your garden map");
    expect(html).not.toContain("Garden areas");
    expect(html).toContain("Apple");
    expect(html).toContain("Borage");
    expect(html).toContain("Bouquet Dill");
    expect(html).toContain("Bloom, prune, harvest");
    expect(html).toContain("Pollinators and reseeding");
    expect(html).toContain("Remember where it bloomed, self-seeded, and brought bees.");
    expect(html).not.toContain("First bloom and fruit set");
    expect(html).not.toContain("Bees in the borage");
    expect(html).not.toContain("Note blooms, reseeding, companion planting, and pollinator visits.");
    expect(html).not.toContain("Track blooms, reseeding, companion planting, and pollinator visits.");
    expect(html).toContain("Cuttings and seed heads");
    expect(html).not.toContain("Sown, cut, gone to seed");
    expect(html).not.toContain("Blossom and fruit notes");
    expect(html).not.toContain("Pollinator notes");
    expect(html).not.toContain("Harvest timing");
    expect(html).toContain("Compare this year&#x27;s bloom and harvest before next year&#x27;s pruning.");
    expect(html).toContain("Know when to sow again, cut stems, and let seed form.");
    expect(html).not.toContain("Keep bloom dates, pruning notes, fruit set, and harvests together.");
    expect(html).not.toContain("Keep sowing dates, cut stems, flowers, seed heads, and next plantings.");
    expect(html).not.toContain("Save bloom dates, pruning notes, fruit set, and harvests together.");
    expect(html).not.toContain("Save sowing dates, cut stems, flowers, seed heads, and next plantings.");
    expect(html).not.toContain("one useful record");
    expect(html).not.toContain("Coriandrum sativum");
    expect(html).not.toContain("Capsicum annuum");
    expect(html).toContain("plant-art%2Fapple.jpg");
    expect(html).toContain("plant-art%2Fborage.jpg");
    expect(html).toContain("plant-art%2Fbouquet-dill.jpg");
    expect(html).not.toContain("plant-art%2Fcalendula.jpg");
    expect(html).not.toContain("plant-art%2Fcilantro.jpg");
    expect(html).not.toContain("plant-art%2Fbay-leaf.jpg");
    expect(html).not.toContain("plant-art%2Fcucumber.jpg");
    expect(html).not.toContain("plant-art%2Ffrench-marigold.jpg");
    expect(html).not.toContain("plant-art%2Ffoxglove.jpg");
    expect(html).not.toContain("plant-art%2Fcurry-leaf.jpg");
    expect(html).not.toContain("/art/specimen-");
    expect(html).not.toContain(".svg");
  });
});
