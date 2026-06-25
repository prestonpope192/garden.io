"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { InkStamp, SpecimenLabel } from "@/components/journal-primitives";
import { CalendarView } from "@/components/views/calendar-view";
import { CatalogueView } from "@/components/views/catalogue-view";
import { GardenAskView, type GardenAskDiagnosis } from "@/components/views/garden-ask-view";
import { PlantsView } from "@/components/views/plants-view";
import { PropertyView } from "@/components/views/property-view";
import { getCatalogPlantName } from "@/components/views/shared";
import type {
  GardenBed,
  GardenPlantInstance,
  GardenPlantOutcome,
  GardenPlantStatus,
  GardenProperty,
  GardenSnapshot,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";

export type GardenAppView = "ask" | "property" | "calendar" | "plants" | "catalogue";

type GardenAppPreviewProps = {
  basePath?: string;
  view: GardenAppView;
  snapshot: GardenSnapshot;
};

export function getDemoSaveNotice(message: string) {
  return `Start your garden to ${message}.`;
}

type ViewTitle = { kicker: string; title: string; subtitle: string };

const viewTitles: Record<GardenAppView, ViewTitle> = {
  ask: {
    kicker: "Today",
    title: "Today",
    subtitle: "Add what changed. Get one next step."
  },
  property: {
    kicker: "Garden map",
    title: "My Garden",
    subtitle: "Places, beds, and plants in one view."
  },
  calendar: {
    kicker: "This week",
    title: "Weekly care",
    subtitle: "Start with what needs care. Let the rest wait."
  },
  plants: {
    kicker: "Your plants",
    title: "Plant Journal",
    subtitle: "Open a plant to see notes and care."
  },
  catalogue: {
    kicker: "For your beds",
    title: "Choose plants",
    subtitle: "Choose plants for the beds you have."
  }
};

const sampleViewTitles: Partial<Record<GardenAppView, ViewTitle>> = {
  ask: {
    kicker: "Sample garden",
    title: "Today",
    subtitle: "Sample data · your garden will have your own plants and notes."
  },
  property: {
    kicker: "Sample garden",
    title: "My Garden",
    subtitle: "Sample data · your garden will have your own places and beds."
  },
  calendar: {
    kicker: "Sample garden",
    title: "Weekly care",
    subtitle: "Sample data · your garden will have your own care tasks."
  },
  plants: {
    kicker: "Sample garden",
    title: "Plant Journal",
    subtitle: "Sample data · your garden will have your own plant history."
  },
  catalogue: {
    kicker: "Sample garden",
    title: "Choose plants",
    subtitle: "Sample data · your garden will have your own plant selections."
  }
};

const navItems: Array<{ view: GardenAppView; label: string }> = [
  { view: "ask", label: "Today" },
  { view: "property", label: "My Garden" },
  { view: "calendar", label: "Weekly care" },
  { view: "plants", label: "Plant Journal" },
  { view: "catalogue", label: "Choose plants" }
];

async function noop() {
  return undefined;
}

async function askSampleGarden(input: {
  symptoms: string;
  imageDataUrl: string | null;
}): Promise<GardenAskDiagnosis> {
  const question = input.symptoms.trim().toLowerCase();
  const photoLead = input.imageDataUrl ? "From the photo and garden notes: " : "";

  if (question.includes("rain") || question.includes("water")) {
    return {
      summary: `${photoLead}Feel the containers first; water only where the top inch is dry.`,
      causes: [
        {
          cause: "Container row dries unevenly",
          confidence: "high",
          detail: "Your garden notes say containers dry fast after warm nights, so a quick soil feel matters more than the calendar."
        },
        {
          cause: "Recent heat can mimic drought stress",
          confidence: "medium",
          detail: "Summer in Central Texas can wilt leaves even when deeper soil still has moisture."
        }
      ],
      actions: [
        "Feel the Container Row soil one inch down before watering.",
        "Water deeply at the root zone if the potting mix is dry.",
        "Add a note tonight if leaves are still wilting after shade returns."
      ],
      follow_up: "Look for leaves that recover after the afternoon heat breaks."
    };
  }

  if (question.includes("plant") || question.includes("basil")) {
    return {
      summary: `${photoLead}Plant one small herb near the kitchen bed.`,
      causes: [
        {
          cause: "Kitchen Garden is the best-fit place",
          confidence: "high",
          detail: "It is closest to daily notes and already holds herbs and cooking plants."
        },
        {
          cause: "Container Row may need extra water",
          confidence: "medium",
          detail: "Your garden notes say containers dry quickly, so basil would need a reliable watering rhythm."
        }
      ],
      actions: [
        "Choose the Kitchen Garden before the hotter Pollinator Edge.",
        "Plant one small batch and watch it for three evenings.",
        "Save a note if the leaves wilt after afternoon heat."
      ],
      follow_up: "Watch whether the spot gets morning sun without harsh late-day exposure."
    };
  }

  return {
    summary: `${photoLead}Start by looking closely before changing care.`,
    causes: [
      {
        cause: "Heat and watering are the first things to rule out",
        confidence: "medium",
        detail: "This garden is in summer and has containers, herbs, and bloom borders with different water needs."
      },
        {
          cause: "The exact plant and bed matter",
          confidence: "medium",
          detail: "Borage, Bouquet Dill, and Bell Pepper are in different beds, so useful care depends on place."
        }
      ],
      actions: [
        "Feel soil moisture before changing the watering rhythm.",
        "Inspect the most affected leaves for pests or spotting.",
        "Compare old leaves and new growth before pruning or feeding."
      ],
    follow_up: "Look for whether the issue is on old leaves, new growth, or the whole plant."
  };
}

export function GardenAppPreview({ basePath = "/sample-garden", view, snapshot }: GardenAppPreviewProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(snapshot.properties[0]?.id ?? "");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedBedId, setSelectedBedId] = useState("");
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [notice, setNotice] = useState("");

  const activeProperty =
    snapshot.properties.find((property) => property.id === selectedPropertyId) ?? snapshot.properties[0] ?? null;
  const propertyZones = activeProperty
    ? snapshot.zones.filter((zone) => zone.property_id === activeProperty.id)
    : [];
  const propertyBeds = activeProperty
    ? snapshot.beds.filter((bed) => bed.property_id === activeProperty.id)
    : [];
  const propertyPlants = activeProperty
    ? snapshot.plants.filter((plant) => plant.property_id === activeProperty.id)
    : [];
  const propertyTasks = activeProperty
    ? snapshot.tasks.filter((task) => task.property_id === activeProperty.id)
    : [];
  const propertyObservations = activeProperty
    ? snapshot.observations.filter((observation) => observation.property_id === activeProperty.id)
    : [];
  const propertyOutcomes = activeProperty
    ? snapshot.outcomes.filter((outcome) => outcome.property_id === activeProperty.id)
    : [];

  const activeZone = propertyZones.find((zone) => zone.id === selectedZoneId) ?? null;
  const activeBed = propertyBeds.find((bed) => bed.id === selectedBedId) ?? null;
  const activePlant = propertyPlants.find((plant) => plant.id === selectedPlantId) ?? null;
  const heading = sampleViewTitles[view] ?? viewTitles[view];
  const growingCount = propertyPlants.filter((plant) => plant.status === "growing").length;
  const plotSummary = activeProperty
    ? activeProperty.season?.trim() || `${propertyZones.length} places · ${growingCount} growing`
    : "New garden";

  const sampleSave = async (message: string) => {
    setNotice(getDemoSaveNotice(message));
  };

  const createProperty = async () => sampleSave("name one place");
  const updateProperty = async (_id: string, _patch: Partial<Pick<GardenProperty, "name" | "label" | "region" | "growing_zone" | "season" | "notes" | "latitude" | "longitude" | "location_label">>) =>
    sampleSave("update these garden details");
  const deleteProperty = async () => sampleSave("change your garden");
  const createZone = async () => sampleSave("name one place, then one bed");
  const updateZone = async (_id: string, _patch: Partial<Pick<GardenZone, "name" | "purpose" | "light" | "water" | "notes">>) =>
    sampleSave("update these place details");
  const deleteZone = async () => sampleSave("change your places");
  const createBed = async () => sampleSave("name one bed, then add a plant");
  const updateBed = async (_id: string, _patch: Partial<Pick<GardenBed, "name" | "sun" | "water" | "soil" | "notes">>) =>
    sampleSave("update these bed details");
  const deleteBed = async () => sampleSave("change your beds");
  const addPlant = async () => sampleSave("add this plant and note what you notice");
  const updatePlant = async (_id: string, _patch: Partial<Pick<GardenPlantInstance, "quantity" | "planted_on" | "notes">>) =>
    sampleSave("update these plant details");
  const deletePlant = async () => sampleSave("change this plant");
  const updatePlantStatus = async (_plant: GardenPlantInstance, status: GardenPlantStatus) =>
    sampleSave(status === "archived" ? "move this to past plants" : "mark this as growing again");
  const addObservation = async () => sampleSave("keep this note where it belongs");
  const deleteObservation = async () => sampleSave("change notes in your garden");
  const addTask = async () => sampleSave("add this to weekly care");
  const updateTaskStatus = async (task: GardenTask) => sampleSave(task.status === "done" ? "put this back in weekly care" : "mark this care done");
  const updateTask = async () => sampleSave("adjust this care");
  const deleteTask = async () => sampleSave("change weekly care");
  const addPlantOutcome = async () => sampleSave("keep this with the plant journal");
  const deletePlantOutcome = async () => sampleSave("change plant journal notes in your garden");
  const saveWishlist = async () => sampleSave("add this to plants to try");
  const removeWishlist = async () => sampleSave("change plants to try in your garden");
  const addPlantToBed = async () => sampleSave("add this plant and note what you notice");
  const logPlantObservation = async () => sampleSave("keep this note where it belongs");
  const quickLog = async () => sampleSave("keep this note where it belongs");

  const mediaUrls = useMemo(() => ({}), []);

  const isAskHome = view === "ask";

  return (
    <main className={`garden-app-shell ${isAskHome ? "garden-app-shell--ai" : ""}`}>
      <header className="garden-app-header">
        <div className="garden-app-header__identity">
          <Link className="journal-shell__brand" href={`${basePath}/ask`}>
            Garden.io
          </Link>
        </div>
        <nav aria-label="Garden sections" className="garden-app-header__nav">
          {navItems.map((item) => (
            <Link
              aria-current={view === item.view ? "page" : undefined}
              className={view === item.view ? "is-active" : undefined}
              href={`${basePath}/${item.view}`}
              key={item.view}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="garden-app-header__account">
          <Link aria-label="Start your garden" className="folio-button" href="/app">
            Start your garden
          </Link>
        </div>
      </header>

      <div className="garden-tour-banner" role="note">
        Exploring a sample garden ·{" "}
        <a href="/app" className="garden-tour-banner__cta">Start your own</a>
      </div>

      {isAskHome ? (
        <GardenAskView
          activeProperty={activeProperty}
          zones={propertyZones}
          beds={propertyBeds}
          plants={propertyPlants}
          observations={propertyObservations}
          tasks={propertyTasks}
          isSaving={false}
          quickLog={quickLog}
          addTask={addTask}
          updateTaskStatus={updateTaskStatus}
          askGarden={askSampleGarden}
          routes={{
            memory: `${basePath}/property`,
            care: `${basePath}/calendar`,
            guide: `${basePath}/catalogue`
          }}
        />
      ) : (
      <section className="garden-app-layout">
        <section className="garden-app-main">
          {activeZone || activeBed || activePlant ? (
            <nav aria-label="Current garden place" className="garden-breadcrumb">
              {activeProperty ? (
                <button
                  className="garden-breadcrumb__crumb"
                  type="button"
                  onClick={() => {
                    setSelectedZoneId("");
                    setSelectedBedId("");
                    setSelectedPlantId("");
                  }}
                >
                  {activeProperty.name}
                </button>
              ) : null}
              {activeZone ? (
                <>
                  <span aria-hidden="true" className="garden-breadcrumb__sep">›</span>
                  <button
                    className="garden-breadcrumb__crumb"
                    type="button"
                    onClick={() => {
                      setSelectedBedId("");
                      setSelectedPlantId("");
                    }}
                  >
                    {activeZone.name}
                  </button>
                </>
              ) : null}
              {activeBed ? (
                <>
                  <span aria-hidden="true" className="garden-breadcrumb__sep">›</span>
                  <button className="garden-breadcrumb__crumb" type="button" onClick={() => setSelectedPlantId("")}>
                    {activeBed.name}
                  </button>
                </>
              ) : null}
              {activePlant ? (
                <>
                  <span aria-hidden="true" className="garden-breadcrumb__sep">›</span>
                  <span className="garden-breadcrumb__crumb">{getCatalogPlantName(activePlant)}</span>
                </>
              ) : null}
            </nav>
          ) : null}

          <header className="garden-app-title">
            <div>
              <SpecimenLabel tone="olive">{heading.kicker}</SpecimenLabel>
              <h1>{heading.title}</h1>
              <p>{heading.subtitle}</p>
            </div>
            <InkStamp tone="charcoal">{plotSummary}</InkStamp>
          </header>

          {notice ? (
            <p className="garden-notice" role="status">
              {notice}
            </p>
          ) : null}

          {view === "property" ? (
            <PropertyView
              activeProperty={activeProperty}
              activeZone={activeZone}
              activeBed={activeBed}
              activePlant={activePlant}
              zones={propertyZones}
              beds={propertyBeds}
              plants={propertyPlants}
              plantProfiles={snapshot.plantProfiles}
              observations={propertyObservations}
              mediaUrls={mediaUrls}
              tasks={propertyTasks}
              outcomes={propertyOutcomes}
              selectedZoneId={selectedZoneId}
              selectedBedId={selectedBedId}
              selectedPlantId={selectedPlantId}
              setSelectedZoneId={setSelectedZoneId}
              setSelectedBedId={setSelectedBedId}
              setSelectedPlantId={setSelectedPlantId}
              isSaving={false}
              isLoading={false}
              createProperty={createProperty}
              updateProperty={updateProperty}
              deleteProperty={deleteProperty}
              createZone={createZone}
              updateZone={updateZone}
              deleteZone={deleteZone}
              createBed={createBed}
              updateBed={updateBed}
              deleteBed={deleteBed}
              addPlant={addPlant}
              updatePlant={updatePlant}
              deletePlant={deletePlant}
              updatePlantStatus={updatePlantStatus}
              addObservation={addObservation}
              deleteObservation={deleteObservation}
              addTask={addTask}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
              addPlantOutcome={addPlantOutcome}
              deletePlantOutcome={deletePlantOutcome}
              isReadOnly
            />
          ) : null}

          {view === "calendar" ? (
            <CalendarView
              tasks={propertyTasks}
              zones={propertyZones}
              beds={propertyBeds}
              plants={propertyPlants}
              updateTaskStatus={updateTaskStatus}
              updateTask={updateTask}
              addTask={addTask}
              season={activeProperty?.season ?? null}
              region={activeProperty?.region ?? null}
              property={activeProperty}
              isReadOnly
            />
          ) : null}

          {view === "plants" ? (
            <PlantsView
              beds={propertyBeds}
              zones={propertyZones}
              plants={propertyPlants}
              wishlist={snapshot.wishlist}
              tasks={propertyTasks}
              updatePlantStatus={updatePlantStatus}
              addPlantToBed={addPlantToBed}
              removeWishlist={removeWishlist}
              logPlantObservation={logPlantObservation}
              observations={propertyObservations}
              outcomes={propertyOutcomes}
              mediaUrls={mediaUrls}
              addTask={addTask}
              addPlantOutcome={addPlantOutcome}
              deletePlantOutcome={deletePlantOutcome}
              isReadOnly
            />
          ) : null}

          {view === "catalogue" ? (
            <CatalogueView
              activeBed={activeBed ?? propertyBeds[0] ?? null}
              plantProfiles={snapshot.plantProfiles}
              addCatalogPlantToBed={addPlantToBed}
              saveWishlist={saveWishlist}
              isReadOnly
            />
          ) : null}
        </section>
      </section>
      )}
    </main>
  );
}
