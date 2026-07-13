import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { CalendarView } from "@/components/views/calendar-view";
import { PLANTS_DRAWER_TAB_LABELS, PlantsView } from "@/components/views/plants-view";
import { PropertyView } from "@/components/views/property-view";
import { buildDemoGardenSnapshot } from "@/lib/demo-garden-snapshot";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => undefined
  })
}));

const noop = async () => undefined;

describe("empty state content", () => {
  it("makes the first garden setup feel like a simple record", () => {
    const html = renderToStaticMarkup(
      createElement(PropertyView, {
        activeProperty: null,
        activeZone: null,
        activeBed: null,
        activePlant: null,
        zones: [],
        beds: [],
        plants: [],
        plantProfiles: [],
        observations: [],
        tasks: [],
        outcomes: [],
        selectedZoneId: "",
        selectedBedId: "",
        selectedPlantId: "",
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
        deletePlantOutcome: noop
      })
    );

    expect(html).toContain("First step");
    expect(html).toContain("Start with the place you grow.");
    expect(html).toContain("Name your garden. Then add one place, one bed, and one plant.");
    expect(html).toContain("Start your garden");
    expect(html).toContain("Backyard garden");
    expect(html).not.toContain("First garden");
    expect(html).not.toContain("Start with the garden you have");
    expect(html).not.toContain("Just give it a name. Add location, beds, and plants as you go.");
    expect(html).not.toContain("Create garden");
    expect(html).not.toContain("Save garden");
    expect(html).not.toContain("Backyard Garden");
    expect(html).not.toContain("Add where you garden (optional)");
    expect(html).not.toContain("Kind of garden");
    expect(html).not.toContain("after you are inside");
    expect(html).not.toContain("What kind of place is it?");
    expect(html).not.toContain("Location or region");
    expect(html).not.toContain("Central Texas");
    expect(html).not.toContain("Growing zone");
    expect(html).not.toContain("7a, if you know it");
    expect(html).not.toContain("Current season");
    expect(html).not.toContain("<details class=\"garden-form__optional\">");
    expect(html).not.toContain("<details class=\"garden-form__optional\" open=\"\"");
    expect(html).not.toContain("Areas, beds, plants, and care reminders can grow from there.");
    expect(html).not.toContain("Add region, zone, and season");
    expect(html).not.toContain("USDA zone");
    expect(html).not.toContain("Thornfield Garden");
    expect(html).not.toContain("What do you call it?");
    expect(html).not.toContain("Give your garden a name and a few details");
    expect(html).not.toContain("Create my garden");
    expect(html).not.toContain("Start my garden");
    expect(html).not.toContain("Name it first");
    const appSource = readFileSync(new URL("../components/garden-app.tsx", import.meta.url), "utf8");
    const previewSource = readFileSync(new URL("../components/garden-app-preview.tsx", import.meta.url), "utf8");
    const propertySource = readFileSync(new URL("../components/views/property-view.tsx", import.meta.url), "utf8");
    expect(propertySource).toContain("Add one place, one bed, and one plant so your notes have a home.");
    expect(appSource).not.toContain("No places yet. Add one place to begin.");
    expect(previewSource).not.toContain("No places yet. Add one place to begin.");
    expect(appSource).not.toContain("No areas yet. Add your first area.");
    expect(previewSource).not.toContain("No areas yet. Add your first area.");
    expect(appSource).toContain("Place added. Now give the first plant a bed.");
    expect(appSource).not.toContain("Area added. Now give the first plant a bed.");
    expect(previewSource).toContain('sampleSave("name one place, then one bed")');
    expect(previewSource).not.toContain("Try naming one area, then one bed.");
    expect(previewSource).not.toContain('sampleSave("name one area, then one bed")');
    expect(previewSource).not.toContain("Area added. Now give the first plant a bed.");
    expect(appSource).not.toContain("Area saved. Now name one bed.");
    expect(appSource).not.toContain("No areas yet. Add one area to start your map.");
    expect(previewSource).not.toContain("No areas yet. Add one area to start your map.");
    expect(appSource).not.toContain("Add the first bed next");
    expect(previewSource).not.toContain("Add the first bed next");
    expect(appSource).not.toContain("Area saved. Now add a bed.");
    expect(previewSource).not.toContain("Area saved. Now add a bed.");
    expect(appSource).not.toContain("Area saved. Add one bed next.");
    expect(previewSource).not.toContain("Area saved. Add one bed next.");
    expect(propertySource).toContain("No beds here yet.");
    expect(propertySource).toContain("Add your first bed");
    expect(propertySource).not.toContain("No beds in this area yet.");
  });

  it("guides the first place, bed, and plant without fake choices", () => {
    const snapshot = buildDemoGardenSnapshot([]);
    const property = snapshot.properties[0];
    const firstZone = snapshot.zones[0]!;
    const firstBed = snapshot.beds[0]!;
    const baseProps: Parameters<typeof PropertyView>[0] = {
      activeProperty: property,
      activeZone: null,
      activeBed: null,
      activePlant: null,
      zones: [],
      beds: [],
      plants: [],
      plantProfiles: snapshot.plantProfiles,
      observations: [],
      tasks: [],
      outcomes: [],
      selectedZoneId: "",
      selectedBedId: "",
      selectedPlantId: "",
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
      deletePlantOutcome: noop
    };
    const renderProperty = (overrides: Partial<Parameters<typeof PropertyView>[0]> = {}) =>
      renderToStaticMarkup(createElement(PropertyView, { ...baseProps, ...overrides }));

    const noAreaHtml = renderProperty();
    const noBedHtml = renderProperty({ zones: [firstZone] });
    const noPlantHtml = renderProperty({ zones: [firstZone], beds: [firstBed] });

    expect(noAreaHtml).toContain("Give one plant a home");
    expect(noAreaHtml).toContain("Place");
    expect(noAreaHtml).toContain("Name where it grows");
    expect(noAreaHtml).toContain("Choose the part of the garden you can picture first");
    expect(noAreaHtml).toContain("Add place");
    expect(noAreaHtml).toContain("Start with one place, like a kitchen garden, orchard row, or shade border.");
    expect(noAreaHtml).toContain("Add first place");
    expect(noAreaHtml).not.toContain("Add area");
    expect(noAreaHtml).not.toContain("Add first area");
    expect(noAreaHtml).not.toContain("Start with one area");
    expect(noAreaHtml).not.toContain("Start with one plant");
    expect(noAreaHtml).not.toContain("Name one area");
    expect(noAreaHtml).not.toContain("Pick an area, bed, or plant to see its notes and next care.");
    expect(noAreaHtml).not.toContain("Pick a place or plant to see its notes and next care.");
    expect(noBedHtml).toContain("Name its bed");
    expect(noBedHtml).toContain("Give your first plant a clear home");
    expect(noBedHtml).not.toContain("Name one bed");
    expect(noBedHtml).not.toContain("Give that plant a clear home");
    expect(noBedHtml).toContain("Add bed");
    expect(noPlantHtml).toContain("Choose the plant");
    expect(noPlantHtml).not.toContain("Add the plant");
    expect(noPlantHtml).toContain("Put one plant in that bed so notes stay where they belong.");
    expect(noPlantHtml).not.toContain("Put one plant in that bed so notes stay with the right spot.");
    expect(noPlantHtml).not.toContain("future checks remember");
    expect(noPlantHtml).not.toContain("Put one plant in that bed so future notes, photos, and care stay in the right place.");
    expect(noPlantHtml).toContain("Add plant");
    expect(noAreaHtml + noBedHtml + noPlantHtml).toContain("Finish later");
    expect(noAreaHtml + noBedHtml + noPlantHtml).toContain("Add one place, one bed, and one plant so your notes have a home.");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Add one area, one bed, and one plant so your notes have a home.");
    expect(noAreaHtml + noBedHtml + noPlantHtml).toContain("You can fill in the rest later.");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("First plant path");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Follow the path");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("placed cleanly");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Setup guide");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Garden setup");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Garden setup progress");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Use the setup guide");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("future suggestions");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Next: add one area");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Next: add one bed");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Next: add one plant");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("Care at a glance");
    expect(noAreaHtml + noBedHtml + noPlantHtml).not.toContain("What needs care next");
  });

  it("explains empty plant and calendar states without setup jargon", () => {
    const plantsHtml = renderToStaticMarkup(
      createElement(PlantsView, {
        beds: [],
        zones: [],
        plants: [],
        wishlist: [],
        tasks: [],
        updatePlantStatus: noop,
        addPlantToBed: noop,
        removeWishlist: noop,
        logPlantObservation: noop,
        observations: [],
        outcomes: [],
        mediaUrls: {},
        addTask: noop,
        addPlantOutcome: noop,
        deletePlantOutcome: noop
      })
    );
    const readOnlyPlantsHtml = renderToStaticMarkup(
      createElement(PlantsView, {
        beds: [],
        zones: [],
        plants: [],
        wishlist: [],
        tasks: [],
        updatePlantStatus: noop,
        addPlantToBed: noop,
        removeWishlist: noop,
        logPlantObservation: noop,
        observations: [],
        outcomes: [],
        mediaUrls: {},
        addTask: noop,
        addPlantOutcome: noop,
        deletePlantOutcome: noop,
        isReadOnly: true
      })
    );
    const calendarHtml = renderToStaticMarkup(
      createElement(CalendarView, {
        tasks: [],
        zones: [],
        beds: [],
        plants: [],
        updateTaskStatus: noop,
        updateTask: noop,
        addTask: noop,
        season: null,
        region: null,
        property: null
      })
    );
    const calendarSource = readFileSync(
      new URL("../components/views/calendar-view.tsx", import.meta.url),
      "utf8"
    );

    expect(plantsHtml).toContain("No plants yet");
    expect(plantsHtml).toContain("Give one plant a home so notes stay where they belong.");
    expect(plantsHtml).not.toContain("Give one plant a home so notes stay with the right spot.");
    expect(plantsHtml).not.toContain("Future checks remember it.");
    expect(plantsHtml).not.toContain("Notes, photos, and care stay connected after that.");
    expect(plantsHtml).toContain("Add one plant");
    expect(plantsHtml).not.toContain("Add your first plant to a bed");
    expect(plantsHtml).not.toContain("Add your first plant");
    expect(plantsHtml).not.toContain("care history together");
    expect(plantsHtml).not.toContain("save notes, photos, and what needs care next");
    expect(plantsHtml).not.toContain("No plants yet. Add one plant");
    expect(plantsHtml).not.toContain("future planting ideas");
    expect(plantsHtml).not.toContain("start tracking");
    expect(readOnlyPlantsHtml).toContain("No plants are growing here yet.");
    expect(readOnlyPlantsHtml).not.toContain("this sample");
    expect(calendarHtml).toContain("Give one plant a home.");
    expect(calendarHtml).toContain("watering, pruning, and harvests have a place to live");
    expect(calendarHtml).not.toContain("watering, pruning, harvests, and care notes have a place to live");
    expect(calendarHtml).toContain("Add one plant");
    expect(calendarHtml).not.toContain("Add your first plant.");
    expect(calendarHtml).not.toContain("Add your first plant</a>");
    expect(plantsHtml + calendarHtml).not.toContain("Add one plant to begin.");
    expect(plantsHtml + calendarHtml).not.toContain("Add one plant to a bed so notes stay with the right spot.");
    expect(calendarSource).toContain("After this week");
    expect(calendarSource).not.toContain("Care is coming up after this week.");
    expect(calendarSource).not.toContain("Care is coming up.");
    expect(calendarSource).toContain("Upcoming care is below.");
    expect(calendarHtml).not.toContain("watering, pruning, harvests, and next steps have a place to go");
    expect(calendarHtml).not.toContain("Add one plant first.");
    expect(calendarSource).not.toContain("A next step is coming up.");
    expect(calendarSource).not.toContain("Nothing urgent this week. The next step is below.");
    expect(calendarHtml).not.toContain("watering, pruning, harvests, and plant checks have a place to go");
    expect(calendarHtml).not.toContain("watering, pruning, harvests, and plant questions have a place to go");
    expect(calendarHtml).not.toContain("Add a plant</a>");
    expect(calendarHtml).not.toContain("Then you can track watering");
    expect(calendarHtml).not.toContain("generate a seasonal schedule");
    expect(calendarHtml).not.toContain("Go to My Garden");
    expect(calendarHtml).not.toContain("care reminders will appear here");
    expect(calendarHtml).not.toContain("Open My Garden");
  });

  it("does not tell users with plants to add a plant when only the care list is empty", () => {
    const snapshot = buildDemoGardenSnapshot([]);
    const calendarHtml = renderToStaticMarkup(
      createElement(CalendarView, {
        tasks: [],
        zones: snapshot.zones,
        beds: snapshot.beds,
        plants: snapshot.plants,
        updateTaskStatus: noop,
        updateTask: noop,
        addTask: noop,
        season: null,
        region: null,
        property: snapshot.properties[0]
      })
    );

    expect(calendarHtml).toContain("Nothing needs care this week.");
    expect(calendarHtml).toContain("Add watering, pruning, or harvest plans as they come up.");
    expect(calendarHtml).not.toContain("No care notes are waiting this week.");
    expect(calendarHtml).not.toContain("Add watering, pruning, or harvest notes as they come up.");
    expect(calendarHtml).not.toContain("Nothing is on your care list yet.");
    expect(calendarHtml).not.toContain("Add watering, pruning, harvests, or next steps as they come up.");
    expect(calendarHtml).not.toContain("Add watering, pruning, harvests, or plant checks");
    expect(calendarHtml).not.toContain("Add watering, pruning, harvests, or questions about a plant");
    expect(calendarHtml).not.toContain("Add one plant to begin.");
    expect(calendarHtml).not.toContain("Add one plant</a>");
  });

  it("keeps calendar task copy about garden care instead of interface mechanics", () => {
    const calendarSource = readFileSync(
      new URL("../components/views/calendar-view.tsx", import.meta.url),
      "utf8"
    );
    const calendarHtml = renderToStaticMarkup(
      createElement(CalendarView, {
        tasks: [
          {
            id: "future-task",
            property_id: "property-1",
            zone_id: null,
            bed_id: null,
            plant_instance_id: null,
            title: "Refresh compost around tomatoes",
            notes: null,
            due_on: "2099-01-15",
            status: "open",
            completed_at: null,
            created_at: "2026-06-01T00:00:00Z",
            updated_at: "2026-06-01T00:00:00Z"
          }
        ],
        zones: [],
        beds: [],
        plants: [],
        updateTaskStatus: noop,
        updateTask: noop,
        addTask: noop,
        season: null,
        region: null,
        property: null
      })
    );

    expect(calendarHtml).toContain("All care shown");
    expect(calendarHtml).not.toContain("Everything coming up");
    expect(calendarHtml).toContain("All clear this week");
    expect(calendarHtml).toContain("Nothing is due this week.");
    expect(calendarHtml).not.toContain("No care is due this week.");
    expect(calendarHtml).not.toContain("Nothing waiting");
    expect(calendarHtml).not.toContain("Nothing waiting");
    expect(calendarHtml).not.toContain("Nothing urgent this week.");
    expect(calendarHtml).toContain("Add care when you notice it.");
    expect(calendarHtml).toContain("After this week");
    expect(calendarHtml).not.toContain("Later care");
    expect(calendarHtml).toContain("Nothing planned after this week.");
    expect(calendarHtml).not.toContain("No care planned after this week.");
    expect(calendarSource).toContain("Needs a date");
    expect(calendarSource).not.toContain("Choose a date");
    expect(calendarHtml).toContain("Care ideas");
    expect(calendarHtml).not.toContain("Try later");
    expect(calendarHtml).not.toContain("Ideas for later");
    expect(calendarHtml).toContain("No new care ideas right now.");
    expect(calendarHtml).not.toContain("No extra ideas right now.");
    expect(calendarHtml).toContain("Add care");
    expect(calendarHtml).toContain("What needs doing?");
    expect(calendarHtml).toContain("When");
    expect(calendarHtml).toContain("Add to weekly care");
    expect(calendarHtml).not.toContain("Add to This Week");
    expect(calendarHtml).not.toContain("Add to care plan");
    expect(calendarHtml).not.toContain("Add a care item");
    expect(calendarHtml).not.toContain("care items");
    expect(calendarHtml).not.toContain("care item");
    expect(calendarSource).toContain("Nothing planned after this week.");
    expect(calendarSource).not.toContain("No care planned after this week.");
    expect(calendarSource).toContain("Show in My Garden");
    expect(calendarSource).not.toContain("Show in map");
    expect(calendarSource).toContain("Hide care choices");
    expect(calendarSource).toContain('aria-label="Choose place"');
    expect(calendarSource).toContain('aria-label="Choose bed"');
    expect(calendarSource).toContain('aria-label="Choose plant"');
    expect(calendarSource).not.toContain("Hide choices");
    expect(calendarSource).not.toContain('aria-label="Choose area"');
    expect(calendarSource).not.toContain('aria-label="Filter by area"');
    expect(calendarSource).not.toContain('aria-label="Filter by bed"');
    expect(calendarSource).not.toContain('aria-label="Filter by plant"');
    expect(calendarSource).not.toContain("MonthView");
    expect(calendarSource).not.toContain("ViewToggle");
    expect(calendarSource).not.toContain('aria-label="Previous month"');
    expect(calendarSource).not.toContain('aria-label="Next month"');
    expect(calendarSource).not.toContain(">Month<");
    expect(calendarSource).not.toContain("monthFocus");
    expect(calendarSource).not.toContain("calView");
    expect(calendarSource).not.toContain("See place");
    expect(calendarHtml).not.toContain("Showing all open tasks");
    expect(calendarHtml).not.toContain("All upcoming care");
    expect(calendarHtml).not.toContain("No open tasks this week");
    expect(calendarHtml).not.toContain("Next task coming up.");
    expect(calendarHtml).not.toContain("The next care task is below.");
    expect(calendarHtml).not.toContain("Nothing needs attention this week");
    expect(calendarHtml).not.toContain("Nothing is due in this week view");
    expect(calendarHtml).not.toContain("Nothing else to try right now.");
    expect(calendarHtml).not.toContain("Use Next to look ahead");
    expect(calendarHtml).not.toContain("add a task below");
    expect(calendarHtml).not.toContain("Upcoming (14 days)");
    expect(calendarHtml).not.toContain("Next care steps");
    expect(calendarHtml).not.toContain("Coming up");
    expect(calendarHtml).not.toContain("What to do next");
    expect(calendarHtml).not.toContain("Task title");
    expect(calendarHtml).not.toContain("Due date");
    expect(calendarHtml).not.toContain("Add something when it comes up.");
    expect(calendarHtml).not.toContain("Add something to do");
    expect(calendarHtml).not.toContain(">Other<");
    expect(calendarHtml).not.toContain("See place");
    expect(calendarHtml).not.toContain(">Week<");
    expect(calendarHtml).not.toContain(">Month<");
    expect(calendarHtml).not.toContain("Previous month");
    expect(calendarHtml).not.toContain("Next month");
  });

  it("uses calm weekly-care wording for plants that need work", () => {
    const snapshot = buildDemoGardenSnapshot([]);
    const plantsHtml = renderToStaticMarkup(
      createElement(PlantsView, {
        beds: snapshot.beds,
        zones: snapshot.zones,
        plants: snapshot.plants,
        wishlist: snapshot.wishlist,
        tasks: snapshot.tasks,
        updatePlantStatus: noop,
        addPlantToBed: noop,
        removeWishlist: noop,
        logPlantObservation: noop,
        observations: snapshot.observations,
        outcomes: snapshot.outcomes,
        mediaUrls: {},
        addTask: noop,
        addPlantOutcome: noop,
        deletePlantOutcome: noop
      })
    );
    const source = readFileSync(
      new URL("../components/views/plants-view.tsx", import.meta.url),
      "utf8"
    );
    const appSource = readFileSync(
      new URL("../components/garden-app.tsx", import.meta.url),
      "utf8"
    );

    expect(plantsHtml).toContain("plants need care this week");
    expect(plantsHtml).not.toContain("plants have care this week");
    expect(plantsHtml).not.toContain("plants to check this week");
    expect(source).toContain("Care this week only");
    expect(plantsHtml).toContain("To try");
    expect(plantsHtml).not.toContain("Needs attention");
    expect(plantsHtml).not.toContain("Needs attention only");
    expect(plantsHtml).not.toContain("need attention soon");
    expect(plantsHtml).not.toContain("need care soon");
    expect(plantsHtml).not.toContain("Needs care soon");
    expect(plantsHtml).not.toContain("Needs care soon only");
    expect(plantsHtml).not.toContain("Narrow plants");
    expect(plantsHtml).toContain("Filter plants");
  });

  it("keeps Plant Journal thumbnails in the journal-style image system", () => {
    const snapshot = buildDemoGardenSnapshot([]);
    const ordinaryPhotoUrl = "https://example.com/tomato-garden-photo.jpg";
    const plants = snapshot.plants.map((plant, index) =>
      index === 0
        ? {
            ...plant,
            plant_profile: {
              ...plant.plant_profile!,
              primary_image_url: ordinaryPhotoUrl
            }
          }
        : plant
    );
    const plantsHtml = renderToStaticMarkup(
      createElement(PlantsView, {
        beds: snapshot.beds,
        zones: snapshot.zones,
        plants,
        wishlist: snapshot.wishlist,
        tasks: snapshot.tasks,
        updatePlantStatus: noop,
        addPlantToBed: noop,
        removeWishlist: noop,
        logPlantObservation: noop,
        observations: snapshot.observations,
        outcomes: snapshot.outcomes,
        mediaUrls: {},
        addTask: noop,
        addPlantOutcome: noop,
        deletePlantOutcome: noop
      })
    );
    const source = readFileSync(
      new URL("../components/views/plants-view.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain("getJournalStylePlantImageUrl");
    expect(source).not.toContain("getRealPlantPhotoUrl");
    expect(plantsHtml).not.toContain(ordinaryPhotoUrl);
    expect(plantsHtml).toContain("garden-plants-thumb--fallback");
    expect(plantsHtml).toContain("plant-art%2Fbouquet-dill.jpg");
  });

  it("uses gardener-facing labels for editable app controls", () => {
    const snapshot = buildDemoGardenSnapshot([]);
    const activePlant = snapshot.plants[0];
    const activeZone = snapshot.zones.find((zone) => zone.id === activePlant.zone_id) ?? null;
    const activeBed = snapshot.beds.find((bed) => bed.id === activePlant.bed_id) ?? null;

    const plantsHtml = renderToStaticMarkup(
      createElement(PlantsView, {
        beds: snapshot.beds,
        zones: snapshot.zones,
        plants: snapshot.plants,
        wishlist: snapshot.wishlist,
        tasks: snapshot.tasks,
        updatePlantStatus: noop,
        addPlantToBed: noop,
        removeWishlist: noop,
        logPlantObservation: noop,
        observations: snapshot.observations,
        outcomes: snapshot.outcomes,
        mediaUrls: {},
        addTask: noop,
        addPlantOutcome: noop,
        deletePlantOutcome: noop
      })
    );
    const propertyHtml = renderToStaticMarkup(
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
        deletePlantOutcome: noop
      })
    );
    const source = readFileSync(
      new URL("../components/views/plants-view.tsx", import.meta.url),
      "utf8"
    );
    const appSource = readFileSync(
      new URL("../components/garden-app.tsx", import.meta.url),
      "utf8"
    );
    const propertySource = readFileSync(
      new URL("../components/views/property-view.tsx", import.meta.url),
      "utf8"
    );

    expect(plantsHtml).toContain("Show in My Garden");
    expect(plantsHtml).toContain("This week:");
    expect(plantsHtml).not.toContain("Care:");
    expect(plantsHtml).not.toContain("Next:");
    expect(plantsHtml).not.toContain("Next care");
    expect(plantsHtml).not.toContain("Next up");
    expect(plantsHtml).not.toContain("Care note:");
    expect(plantsHtml).not.toContain("Next step");
    expect(plantsHtml).toContain("Start with Bell Pepper. Open any plant when you need its notes.");
    expect(plantsHtml).not.toContain("Start with Bell Pepper. Choose any plant when you want its notes.");
    expect(plantsHtml).not.toContain("Start with the next check, or open any plant.");
    expect(appSource).toContain("Open a plant to see notes and care.");
    expect(appSource).not.toContain("Choose one plant to see what happened and what helped.");
    expect(appSource).not.toContain("Start with the plants that need care.");
    expect(source).not.toContain("Start with the plants that need care.");
    expect(source).toContain("Open any plant when you need its notes.");
    expect(source).not.toContain("Choose any plant when you want its notes.");
    expect(plantsHtml).not.toContain("Open a plant to see what happened and what to do next.");
    expect(plantsHtml).not.toContain("Pick a plant to see notes, photos, and this week&#x27;s care.");
    expect(plantsHtml).not.toContain("Pick a plant to see notes, photos, and next care.");
    expect(plantsHtml).not.toContain("See what needs care, then keep notes and photos with the right plant.");
    expect(plantsHtml).not.toContain("See what needs care and keep every note and photo with the right plant.");
    expect(plantsHtml).not.toContain("Check plants that need care first.");
    expect(plantsHtml).not.toContain("Keep notes and photos together.");
    expect(plantsHtml).not.toContain("Start with plants that need care.");
    expect(plantsHtml).not.toContain("Open one for notes and photos.");
    expect(plantsHtml).not.toContain("Plants with care due soon appear first.");
    expect(plantsHtml).not.toContain("Plants with care this week appear first.");
    expect(plantsHtml).not.toContain("Open any plant for notes, photos, and history.");
    expect(plantsHtml).not.toContain("The list starts with the next plant to check.");
    expect(plantsHtml).not.toContain("The first record is the next plant to check.");
    expect(plantsHtml).not.toContain("Open any plant for its notes, photos, and history.");
    expect(plantsHtml).not.toContain("Pick one to see notes, photos, and next steps.");
    expect(plantsHtml).not.toContain("Pick one to see notes, photos, and next care.");
    expect(plantsHtml).not.toContain("Pick one to see what happened and what needs care next.");
    expect(plantsHtml).toContain('aria-label="Show where Borage is planted in My Garden"');
    expect(source).toContain("Mixed or unknown");
    expect(source).toContain("Hide filters");
    expect(source).not.toContain("Hide field guide");
    expect(source).toContain("Showing {filteredCount} of {totalCount}");
    expect(source).toContain("Show all plants");
    expect(source).toContain("Plants you're growing");
    expect(source).not.toContain("Garden plants");
    expect(source).toContain("Growing now");
    expect(source).toContain("Kinds of plants");
    expect(source).toContain("Beds planted");
    expect(source).toContain('aria-label="Plant journal"');
    expect(source).toContain("<InkStamp tone=\"olive\">Plant notes</InkStamp>");
    expect(source).not.toContain("<InkStamp tone=\"olive\">Your plants</InkStamp>");
    expect(source).toContain("Choose a plant");
    expect(source).toContain("Open a plant to see notes and care.");
    expect(source).not.toContain("Pick a plant");
    expect(source).not.toContain('aria-label="Plants"');
    expect(source).not.toContain("<InkStamp tone=\"olive\">Plants</InkStamp>");
    expect(source).not.toContain('aria-label="My plants"');
    expect(source).toContain("Show in My Garden");
    expect(source).toContain("Choose plants");
    expect(source).not.toContain("Open field guide");
    expect(source).not.toContain(">Find plants<");
    expect(source).not.toContain("Browse plant guide");
    expect(source).toContain("Plant to try");
    expect(source).toContain("Plants to try");
    expect(source).toContain("No plants to try yet");
    expect(source).toContain("Choose plants you might grow later. Plant one when you have a spot for it.");
    expect(source).toContain("To try");
    expect(source).toContain("To try");
    expect(source).not.toContain("Saved plant");
    expect(source).not.toContain("Saved plants");
    expect(source).not.toContain("Nothing saved yet");
    expect(source).not.toContain("Save plants you might grow later.");
    expect(source).not.toContain("Saved for later");
    expect(source).not.toContain("Saved plant choice");
    expect(source).toContain("Move this plant");
    expect(source).toContain("Past plants will show what grew, what struggled, and what to remember next time.");
    expect(source).not.toContain(">Other</option>");
    expect(source).not.toContain("Narrow plants");
    expect(source).not.toContain("Plants at a glance");
    expect(source).not.toContain("Active plants");
    expect(source).not.toContain("Distinct species");
    expect(source).not.toContain("Beds in use");
    expect(source).not.toContain("filtered from");
    expect(source).not.toContain(">Clear all<");
    expect(source).not.toContain('aria-label="Plants utility"');
    expect(source).not.toContain("Plant place</span>");
    expect(source).not.toContain("Saved plant option");
    expect(source).not.toContain("Change plant status");
    expect(source).not.toContain("Past plants will show what grew, what failed, and what to remember next time.");
    expect(PLANTS_DRAWER_TAB_LABELS).toEqual({
      info: "Details",
      timeline: "History",
      actions: "Update"
    });
    expect(propertyHtml).toContain(">Details<");
    expect(propertyHtml).toContain(">Weekly care<");
    expect(propertyHtml).toContain(">Suggestions<");
    expect(propertyHtml).toContain(">Update<");
    expect(propertyHtml).toContain("<h3>Borage</h3>");
    expect(propertyHtml).toContain("This week:");
    expect(propertyHtml).not.toContain("Next care:");
    expect(propertyHtml).not.toContain("Care note:");
    expect(propertyHtml).not.toContain("Next step:");
    expect(propertyHtml).not.toContain("Next up:");
    expect(propertyHtml).toContain("<dt>Plant kind</dt><dd>Flower · Annual</dd>");
    expect(propertyHtml).not.toContain("<dt>Plant type</dt><dd>Flower · Annual</dd>");
    expect(propertyHtml).not.toContain("<dt>Botanical</dt>");
    expect(propertyHtml).not.toContain("Calendula officinalis");
    expect(propertyHtml).toContain("Change this plant");
    expect(propertyHtml).toContain("Edit this plant");
    expect(propertyHtml).toContain('aria-label="Garden notebook"');
    expect(propertyHtml).not.toContain("Edit details");
    expect(propertyHtml).not.toContain('aria-label="Garden details"');
    expect(propertySource).toContain("Edit this {focusLabel(focus).toLowerCase()}");
    expect(propertySource).toContain("No care waiting this week.");
    expect(propertySource).toContain("No care waiting here this week.");
    expect(propertySource).toContain("No care waiting here right now.");
    expect(propertySource).not.toContain("No care saved here right now.");
    expect(propertySource).toContain("No new care ideas for this {focusLabel(focus).toLowerCase()} right now.");
    expect(propertySource).toContain("Add notes as the season changes.");
    expect(propertySource).toContain("See weekly care");
    expect(propertySource).not.toContain("See This Week");
    expect(propertySource).not.toContain("Nothing urgent right now.");
    expect(propertySource).not.toContain("Nothing urgent here right now.");
    expect(propertySource).not.toContain("Nothing to do here right now.");
    expect(propertySource).not.toContain("Nothing to try right now");
    expect(propertySource).not.toContain("Check back as the season changes.");
    expect(propertyHtml).toContain("Move to past plants");
    expect(propertyHtml).toContain("Remove this plant");
    expect(propertySource).toContain("Name where it grows");
    expect(propertySource).toContain('placeholder="Kitchen garden"');
    expect(propertySource).toContain('placeholder="Vegetables, herbs, flowers..."');
    expect(propertySource).toContain("Save this place");
    expect(propertySource).not.toContain("Name this area");
    expect(propertySource).not.toContain("Save this area");
    expect(propertySource).toContain("Name this bed");
    expect(propertySource).toContain('placeholder="Raised bed 2"');
    expect(propertySource).toContain("Save this bed");
    expect(propertySource).not.toContain(">Add an area<");
    expect(propertySource).not.toContain("Add a bed to {activeZone.name}");
    expect(propertySource).not.toContain("Raised Bed 2");
    expect(propertySource).not.toContain("Vegetables, orchard, shade border");
    expect(propertySource).toContain("What&apos;s growing in {activeBed.name}?");
    expect(propertySource).toContain("<span>Plant name</span>");
    expect(propertySource).toContain("Save this plant");
    expect(propertySource).toContain("<SpecimenLabel>Notes and care</SpecimenLabel>");
    expect(propertySource).not.toContain("<SpecimenLabel>Care history</SpecimenLabel>");
    expect(propertySource).not.toContain("Add a plant to {activeBed.name}");
    expect(propertySource).not.toContain("<span>Plant</span>");
    expect(propertySource).not.toContain(">Add plant</button>");
    expect(propertySource).toContain('FieldText label="Use" value={editDraft.purpose ?? ""}');
    expect(propertySource).toContain('rows.push(["Use", activeZone.purpose])');
    expect(propertySource).toContain('FieldText label="Use" value={zoneDraft.purpose}');
    expect(propertySource).not.toContain('label="Purpose"');
    expect(propertySource).not.toContain('["Purpose", activeZone.purpose]');
    expect(plantsHtml + propertyHtml).not.toContain("See place");
    expect(plantsHtml + propertyHtml).not.toContain("See plant place");
    expect(plantsHtml + propertyHtml).not.toContain("Choose a plant to log a note");
    expect(plantsHtml + propertyHtml).not.toContain("Choose a saved plant to plant it in a bed or remove it.");
    expect(plantsHtml + propertyHtml).not.toContain("Choose a saved plant to place it in a bed.");
    expect(source).toContain("Choose a plant to try and place it in a bed.");
    expect(source).toContain('label="Place"');
    expect(source).toContain("All places");
    expect(source).toContain('aria-label="Search plants by name, bed, or place"');
    expect(source).toContain('placeholder="Search by name, bed, or place…');
    expect(source).not.toContain('label="Area"');
    expect(source).not.toContain("All areas");
    expect(source).not.toContain("Search plants by name, bed, or area");
    expect(source).not.toContain("Search by name, bed, or area");
    expect(plantsHtml + propertyHtml).not.toContain("Remove plant idea");
    expect(plantsHtml + propertyHtml).not.toContain("Mark finished");
    expect(plantsHtml + propertyHtml).not.toContain("Return to growing");
    expect(propertyHtml).not.toContain("Next: ");
    expect(propertyHtml).not.toContain("Delete this");
    expect(propertyHtml).not.toContain(">Overview<");
    expect(propertyHtml).not.toContain(">Tasks<");
    expect(propertyHtml).not.toContain(">Try<");
    expect(propertyHtml).not.toContain(">Next<");
    expect(propertyHtml).not.toContain(">Next steps<");
    expect(propertyHtml).not.toContain(">Ideas<");
    expect(propertyHtml).not.toContain(">Actions<");
    expect(propertyHtml).not.toContain(">Log<");
    expect(propertyHtml).not.toContain(">Edit<");
    expect(propertyHtml).not.toContain(">Add<");
  });

  it("keeps destructive plant warnings plain about kept plant notes", () => {
    const source = readFileSync(
      new URL("../components/views/property-view.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain("Notes and care kept with this plant will be removed too.");
    expect(source).toContain("Notes you already kept stay in your garden.");
    expect(source).not.toContain("Notes and care saved with this plant will be removed too.");
    expect(source).not.toContain("Notes you already saved stay in your garden.");
    expect(source).not.toContain("care history stay in your garden history");
    expect(source).not.toContain("saved history will be removed too");
    expect(source).not.toContain("results will be removed too");
  });
});
