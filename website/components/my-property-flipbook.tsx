"use client";

import React from "react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FieldIcon } from "@/components/field-icons";
import { InkStamp, MarginNote, SpecimenLabel } from "@/components/journal-primitives";

type PlantRecord = {
  id: string;
  name: string;
  latinName: string;
  subtitle: string;
  summary: string;
  illustration: string;
  notes: string[];
  schedule: string[];
  sun: string;
  water: string;
  soil: string;
  companion: string;
};

type BedRecord = {
  id: string;
  name: string;
  subtitle: string;
  summary: string;
  illustration: string;
  notes: string[];
  schedule: string[];
  sun: string;
  water: string;
  soil: string;
  plants: PlantRecord[];
};

type ZoneRecord = {
  id: string;
  name: string;
  subtitle: string;
  summary: string;
  illustration: string;
  notes: string[];
  schedule: string[];
  purpose: string;
  water: string;
  light: string;
  beds: BedRecord[];
};

type PropertyRecord = {
  id: string;
  name: string;
  subtitle: string;
  summary: string;
  illustration: string;
  notes: string[];
  schedule: string[];
  region: string;
  season: string;
  zones: ZoneRecord[];
};

type LevelName = "property" | "zone" | "bed" | "plant";

type NotebookItem = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  illustration: string;
  facts: string[];
  focus: string;
};

type EditDraft = {
  name: string;
  subtitle: string;
  summary: string;
  notes: string;
  schedule: string;
  region?: string;
  season?: string;
  purpose?: string;
  water?: string;
  light?: string;
  sun?: string;
  soil?: string;
  latinName?: string;
  companion?: string;
};

const initialProperties: PropertyRecord[] = [
  {
    id: "oak-orchard",
    name: "Oak Orchard",
    subtitle: "Homestead ledger · Zone 8b",
    summary: "A mixed-use homestead property with orchard circles, a kitchen garden, and a pollinator edge.",
    illustration: "/art/specimen-herbarium-sheet.svg",
    notes: [
      "This property carries the widest spread of perennial and annual work.",
      "North row and kitchen beds are doing most of the weekly heavy lifting right now.",
      "Mulch continuity is the biggest property-level improvement opportunity this month."
    ],
    schedule: [
      "Review orchard circles for mulch gaps before Saturday wind.",
      "Check irrigation pressure on the north run before the next hot spell.",
      "Review upcoming harvest timing across strawberries, herbs, and tomatoes."
    ],
    region: "Central Texas",
    season: "Early summer",
    zones: [
      {
        id: "north-row",
        name: "North Row",
        subtitle: "Fruit corridor · Wind-sheltered edge",
        summary: "A productive mixed zone with herbs, fruiting plants, and a reliable morning-light profile.",
        illustration: "/art/specimen-bean-vine.svg",
        notes: [
          "The stone edging warms quickly and stretches the useful basil window.",
          "Bee traffic peaks near the dill and calendula patch mid-morning.",
          "The coolest pocket at the end of the row is still the best place for tender greens."
        ],
        schedule: [
          "Tie the runner bean trellis before the next gust front.",
          "Inspect tomato support stakes and prune split stems.",
          "Top up compost around the herb edge where the path dries first."
        ],
        purpose: "Mixed fruit, herb, and pollinator production",
        water: "Even moisture with one dry edge",
        light: "Morning to mid-day sun",
        beds: [
          {
            id: "tree-03-circle",
            name: "Tree 03 Circle",
            subtitle: "Apple guild bed",
            summary: "A tree ring with comfrey, chives, clover, and mulch built around long-horizon orchard care.",
            illustration: "/art/specimen-calendar-bloom.svg",
            notes: [
              "The south-facing side is still the driest arc after wind exposure.",
              "Comfrey is shading well but needs one cut before crowding the ring.",
              "Mulch depth is inconsistent after the last storm."
            ],
            schedule: [
              "Refresh mulch on the south arc.",
              "Prune suckers and log new fruit-set notes.",
              "Capture a post-rain moisture note to compare retention."
            ],
            sun: "6+ hours",
            water: "Deep soak only",
            soil: "Mulched clay loam",
            plants: [
              {
                id: "cherokee-purple",
                name: "Cherokee Purple Tomato",
                latinName: "Solanum lycopersicum",
                subtitle: "Live plant record · First fruit set",
                summary: "A vigorous tomato plant moving into fruit set with strong basil companionship and steady pruning needs.",
                illustration: "/art/specimen-tomato.svg",
                notes: [
                  "Lower suckers are returning quickly after warm weather.",
                  "Fruit shoulders have stayed clean after mulching.",
                  "This is the strongest candidate for the bed's reference tomato record."
                ],
                schedule: [
                  "Prune lower stems before Friday heat.",
                  "Log basil pairing success after the next harvest.",
                  "Review watering rhythm if the dry wind continues."
                ],
                sun: "Full",
                water: "Medium",
                soil: "Rich and mulched",
                companion: "Basil"
              },
              {
                id: "genovese-basil",
                name: "Genovese Basil",
                latinName: "Ocimum basilicum",
                subtitle: "Companion herb",
                summary: "A warm-season herb anchoring the understory around the tomato and suppressing splashback.",
                illustration: "/art/specimen-calendar-bloom.svg",
                notes: [
                  "Pinching is keeping the habit bushy and productive.",
                  "The south side is taking the strongest heat load."
                ],
                schedule: ["Pinch flowering tips.", "Harvest a light cut for kitchen use."],
                sun: "Full",
                water: "Medium",
                soil: "Rich and quick-draining",
                companion: "Tomato"
              }
            ]
          },
          {
            id: "pollinator-strip",
            name: "Pollinator Strip",
            subtitle: "Edge planting bed",
            summary: "A narrow mixed bed that supports pollinators and softens the path edge with herbs and flowers.",
            illustration: "/art/specimen-calendar-bloom.svg",
            notes: [
              "Calendula is reseeding better near the stone edge than expected.",
              "Dill is holding beneficial insect traffic through the afternoon."
            ],
            schedule: [
              "Thin calendula volunteers near the path.",
              "Cut back one dill section to keep visibility clean."
            ],
            sun: "Full to part",
            water: "Low to medium",
            soil: "Fast-draining edge soil",
            plants: [
              {
                id: "calendula",
                name: "Calendula",
                latinName: "Calendula officinalis",
                subtitle: "Reseeding flower",
                summary: "A forgiving flower keeping color and pollinator value in the edge planting.",
                illustration: "/art/specimen-calendar-bloom.svg",
                notes: ["Best reseeding is happening nearest the warm stone border."],
                schedule: ["Thin crowded volunteers.", "Deadhead one flush to extend bloom."],
                sun: "Full to part",
                water: "Low to medium",
                soil: "Well-drained",
                companion: "Dill"
              },
              {
                id: "dill",
                name: "Dill",
                latinName: "Anethum graveolens",
                subtitle: "Beneficial insect draw",
                summary: "A feathery herb helping the strip stay useful for pollinators and beneficial insects.",
                illustration: "/art/specimen-bean-vine.svg",
                notes: ["Bee traffic is heaviest around 10 a.m. near the flowering stalks."],
                schedule: ["Cut back one stalk cluster after seed set starts."],
                sun: "Full",
                water: "Low to medium",
                soil: "Loose and well-drained",
                companion: "Calendula"
              }
            ]
          }
        ]
      },
      {
        id: "kitchen-garden",
        name: "Kitchen Garden",
        subtitle: "Raised bed cluster",
        summary: "A high-frequency work zone where harvest, pruning, and succession planting happen almost daily in season.",
        illustration: "/art/specimen-tomato.svg",
        notes: [
          "This zone gets the most frequent touchpoints and needs the clearest weekly planning.",
          "Harvest windows stack quickly here if notes fall behind."
        ],
        schedule: [
          "Review basil succession and replant any thin gaps.",
          "Harvest fast greens before the next heat stretch."
        ],
        purpose: "High-turnover edible production",
        water: "Regular and tracked",
        light: "Full sun",
        beds: [
          {
            id: "herb-bed",
            name: "Herb Bed",
            subtitle: "Warm culinary strip",
            summary: "A fast-moving herb bed built for regular cutting, companion use, and kitchen access.",
            illustration: "/art/specimen-calendar-bloom.svg",
            notes: ["This bed wants lighter, more frequent harvest notes than the orchard beds."],
            schedule: ["Harvest basil and dill.", "Replant thin herb pockets."],
            sun: "Full",
            water: "Medium",
            soil: "Rich, friable",
            plants: [
              {
                id: "thai-basil",
                name: "Thai Basil",
                latinName: "Ocimum basilicum var. thyrsiflora",
                subtitle: "Warm herb planting",
                summary: "An aromatic basil holding strong growth in the warmest edge of the kitchen bed.",
                illustration: "/art/specimen-calendar-bloom.svg",
                notes: ["Heat tolerance is higher here than in the orchard companion bed."],
                schedule: ["Pinch tops for branching.", "Harvest for kitchen use."],
                sun: "Full",
                water: "Medium",
                soil: "Rich",
                companion: "Peppers"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "river-garden",
    name: "River Garden",
    subtitle: "Garden property · Zone 7a",
    summary: "A cooler mixed garden with berry rows, annual beds, and more moisture-retentive soil than Oak Orchard.",
    illustration: "/art/specimen-herbarium-sheet.svg",
    notes: [
      "This property is slower and cooler, which makes timing notes especially valuable.",
      "Berry timing and mulch retention are the key recurring themes."
    ],
    schedule: [
      "Check blueberry mulch depth before the weekend dries out.",
      "Review garlic harvest timing against last year's notes."
    ],
    region: "Western North Carolina",
    season: "Late spring",
    zones: [
      {
        id: "berry-row",
        name: "Berry Row",
        subtitle: "Perennial fruit line",
        summary: "A perennial zone focused on blueberry and strawberry production with a strong mulch and acidity emphasis.",
        illustration: "/art/specimen-herbarium-sheet.svg",
        notes: ["This is the cleanest example of long-horizon plant memory paying off."],
        schedule: ["Check acidity notes.", "Plan harvest watch for early berries."],
        purpose: "Perennial berry production",
        water: "Medium",
        light: "Full sun with cooler mornings",
        beds: [
          {
            id: "blueberry-row",
            name: "Blueberry Row",
            subtitle: "Acid-loving perennial bed",
            summary: "A fruiting bed where mulch, acidity, and harvest timing matter more than daily intervention.",
            illustration: "/art/specimen-herbarium-sheet.svg",
            notes: ["Mulch consistency remains the strongest indicator of berry performance here."],
            schedule: ["Refresh mulch.", "Review harvest approach notes."],
            sun: "Full to light shade",
            water: "Medium",
            soil: "Acidic and organic",
            plants: [
              {
                id: "highbush-blueberry",
                name: "Highbush Blueberry",
                latinName: "Vaccinium corymbosum",
                subtitle: "Perennial fruit shrub",
                summary: "A longer-horizon plant record where seasonal comparison matters as much as this week's tasks.",
                illustration: "/art/specimen-herbarium-sheet.svg",
                notes: ["Berry timing is tracking five days earlier than last season."],
                schedule: ["Review harvest watch.", "Log fruit set against last season."],
                sun: "Full to light shade",
                water: "Medium",
                soil: "Acidic, mulch-heavy",
                companion: "Strawberry"
              }
            ]
          }
        ]
      }
    ]
  }
];

const levelOrder: LevelName[] = ["property", "zone", "bed", "plant"];

function clamp(index: number, max: number) {
  if (max <= 0) return 0;
  if (index < 0) return 0;
  if (index > max - 1) return max - 1;
  return index;
}

function countBeds(property: PropertyRecord) {
  return property.zones.reduce((total, zone) => total + zone.beds.length, 0);
}

function countPlants(property: PropertyRecord) {
  return property.zones.reduce(
    (total, zone) => total + zone.beds.reduce((bedTotal, bed) => bedTotal + bed.plants.length, 0),
    0
  );
}

function countPlantsInZone(zone: ZoneRecord) {
  return zone.beds.reduce((total, bed) => total + bed.plants.length, 0);
}

type ContextBundle = {
  level: LevelName;
  property: PropertyRecord;
  zone: ZoneRecord;
  bed: BedRecord;
  plant: PlantRecord;
  notebookTitle: string;
  notebookHelper: string;
  notebookItems: NotebookItem[];
};

function buildNotebookItemsForProperty(property: PropertyRecord): NotebookItem[] {
  return property.zones.map((zone) => ({
    id: zone.id,
    title: zone.name,
    subtitle: zone.subtitle,
    summary: zone.summary,
    illustration: zone.illustration,
    facts: [`${zone.beds.length} beds`, `${countPlantsInZone(zone)} plants`, zone.light],
    focus: zone.schedule[0] ?? "Review this zone's next action."
  }));
}

function buildNotebookItemsForZone(zone: ZoneRecord): NotebookItem[] {
  return zone.beds.map((bed) => ({
    id: bed.id,
    title: bed.name,
    subtitle: bed.subtitle,
    summary: bed.summary,
    illustration: bed.illustration,
    facts: [`${bed.plants.length} plants`, bed.sun, bed.water],
    focus: bed.schedule[0] ?? "Review this bed's next action."
  }));
}

function buildNotebookItemsForBed(bed: BedRecord): NotebookItem[] {
  return bed.plants.map((plant) => ({
    id: plant.id,
    title: plant.name,
    subtitle: plant.subtitle,
    summary: plant.summary,
    illustration: plant.illustration,
    facts: [plant.sun, plant.water, `Companion: ${plant.companion}`],
    focus: plant.schedule[0] ?? "Review this plant's next action."
  }));
}

function buildContextBundle(
  properties: PropertyRecord[],
  propertyIndex: number,
  zoneIndex: number,
  bedIndex: number,
  plantIndex: number,
  level: LevelName
): ContextBundle {
  const property = properties[propertyIndex];
  const zone = property.zones[clamp(zoneIndex, property.zones.length)];
  const bed = zone.beds[clamp(bedIndex, zone.beds.length)];
  const plant = bed.plants[clamp(plantIndex, bed.plants.length)];

  if (level === "property") {
    return {
      level,
      property,
      zone,
      bed,
      plant,
      notebookTitle: `Zones in ${property.name}`,
      notebookHelper: "Swipe left and right to move across zones. Swipe up and down to move through the hierarchy.",
      notebookItems: buildNotebookItemsForProperty(property)
    };
  }

  if (level === "zone") {
    return {
      level,
      property,
      zone,
      bed,
      plant,
      notebookTitle: `Beds in ${zone.name}`,
      notebookHelper: "Swipe left and right to move across beds in this zone. Swipe up and down to move through the hierarchy.",
      notebookItems: buildNotebookItemsForZone(zone)
    };
  }

  if (level === "bed") {
    return {
      level,
      property,
      zone,
      bed,
      plant,
      notebookTitle: `Plants in ${bed.name}`,
      notebookHelper: "Swipe left and right to move across plants in this bed. Swipe up and down to move through the hierarchy.",
      notebookItems: buildNotebookItemsForBed(bed)
    };
  }

  return {
    level,
    property,
    zone,
    bed,
    plant,
    notebookTitle: `Plants in ${bed.name}`,
    notebookHelper: "Swipe left and right to compare plants in this bed, or move up the hierarchy with the breadcrumb and level controls.",
    notebookItems: buildNotebookItemsForBed(bed)
  };
}

function toMultiline(items: string[]) {
  return items.join("\n");
}

function fromMultiline(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createEditDraft(level: LevelName, context: ContextBundle): EditDraft {
  if (level === "property") {
    return {
      name: context.property.name,
      subtitle: context.property.subtitle,
      summary: context.property.summary,
      region: context.property.region,
      season: context.property.season,
      notes: toMultiline(context.property.notes),
      schedule: toMultiline(context.property.schedule)
    };
  }

  if (level === "zone") {
    return {
      name: context.zone.name,
      subtitle: context.zone.subtitle,
      summary: context.zone.summary,
      purpose: context.zone.purpose,
      water: context.zone.water,
      light: context.zone.light,
      notes: toMultiline(context.zone.notes),
      schedule: toMultiline(context.zone.schedule)
    };
  }

  if (level === "bed") {
    return {
      name: context.bed.name,
      subtitle: context.bed.subtitle,
      summary: context.bed.summary,
      sun: context.bed.sun,
      water: context.bed.water,
      soil: context.bed.soil,
      notes: toMultiline(context.bed.notes),
      schedule: toMultiline(context.bed.schedule)
    };
  }

  return {
    name: context.plant.name,
    subtitle: context.plant.subtitle,
    latinName: context.plant.latinName,
    summary: context.plant.summary,
    sun: context.plant.sun,
    water: context.plant.water,
    soil: context.plant.soil,
    companion: context.plant.companion,
    notes: toMultiline(context.plant.notes),
    schedule: toMultiline(context.plant.schedule)
  };
}

function cloneProperties(properties: PropertyRecord[]) {
  return structuredClone(properties);
}

type ArchiveRow = {
  label: string;
  value: string;
};

function buildArchiveLabel(level: LevelName) {
  if (level === "property") return "Property ledger";
  if (level === "zone") return "Zone archive";
  if (level === "bed") return "Bed folio";
  return "Plant specimen";
}

function buildArchiveKicker(level: LevelName, context: ContextBundle) {
  if (level === "property") {
    return `${context.property.region} · ${context.property.season}`;
  }

  if (level === "zone") {
    return `${context.property.name} · ${context.zone.purpose}`;
  }

  if (level === "bed") {
    return `${context.zone.name} · ${context.bed.subtitle}`;
  }

  return `${context.bed.name} · ${context.plant.latinName}`;
}

function buildArchiveTrail(level: LevelName, context: ContextBundle) {
  if (level === "property") {
    return `Archive trail: ${context.property.name}`;
  }

  if (level === "zone") {
    return `Archive trail: ${context.property.name} / ${context.zone.name}`;
  }

  if (level === "bed") {
    return `Archive trail: ${context.property.name} / ${context.zone.name} / ${context.bed.name}`;
  }

  return `Archive trail: ${context.property.name} / ${context.zone.name} / ${context.bed.name} / ${context.plant.name}`;
}

function buildArchiveFolio(level: LevelName, propertyIndex: number, zoneIndex: number, bedIndex: number, plantIndex: number) {
  const prefix = level === "property" ? "P" : level === "zone" ? "Z" : level === "bed" ? "B" : "S";

  return `${prefix}-${String(propertyIndex + 1).padStart(2, "0")}.${String(zoneIndex + 1).padStart(2, "0")}.${String(
    bedIndex + 1
  ).padStart(2, "0")}.${String(plantIndex + 1).padStart(2, "0")}`;
}

function buildArchiveRows(level: LevelName, context: ContextBundle): ArchiveRow[] {
  if (level === "property") {
    return [
      { label: "Region", value: context.property.region },
      { label: "Season", value: context.property.season },
      { label: "Zones logged", value: String(context.property.zones.length) },
      { label: "Living records", value: String(countPlants(context.property)) }
    ];
  }

  if (level === "zone") {
    return [
      { label: "Parent property", value: context.property.name },
      { label: "Purpose", value: context.zone.purpose },
      { label: "Light profile", value: context.zone.light },
      { label: "Water pattern", value: context.zone.water }
    ];
  }

  if (level === "bed") {
    return [
      { label: "Parent zone", value: context.zone.name },
      { label: "Bed type", value: context.bed.subtitle },
      { label: "Soil profile", value: context.bed.soil },
      { label: "Irrigation", value: context.bed.water }
    ];
  }

  return [
    { label: "Latin name", value: context.plant.latinName },
    { label: "Companion", value: context.plant.companion },
    { label: "Growing bed", value: context.bed.name },
    { label: "Water pattern", value: context.plant.water }
  ];
}

function buildCompositionEntries(level: LevelName, context: ContextBundle) {
  if (level === "property") {
    return context.property.zones.map((zone, index) => `Area ${index + 1}: ${zone.name} · ${zone.subtitle}`);
  }

  if (level === "zone") {
    return context.zone.beds.map((bed, index) => `Bed ${index + 1}: ${bed.name} · ${bed.sun} · ${bed.water}`);
  }

  if (level === "bed") {
    return context.bed.plants.map((plant, index) => `Specimen ${index + 1}: ${plant.name} · Companion ${plant.companion}`);
  }

  return [
    `Parent bed: ${context.bed.name}`,
    `Field position: ${context.zone.name}`,
    `Companion link: ${context.plant.companion}`
  ];
}

function buildCompositionTitle(level: LevelName) {
  if (level === "property") return "Zone register";
  if (level === "zone") return "Bed register";
  if (level === "bed") return "Plant register";
  return "Placement record";
}

export function MyPropertyFlipbook() {
  const [properties, setProperties] = useState<PropertyRecord[]>(() => cloneProperties(initialProperties));
  const [levelIndex, setLevelIndex] = useState(0);
  const [propertyIndex, setPropertyIndex] = useState(0);
  const [zoneIndex, setZoneIndex] = useState(0);
  const [bedIndex, setBedIndex] = useState(0);
  const [plantIndex, setPlantIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentLevel = levelOrder[levelIndex];
  const context = useMemo(
    () => buildContextBundle(properties, propertyIndex, zoneIndex, bedIndex, plantIndex, currentLevel),
    [bedIndex, currentLevel, plantIndex, properties, propertyIndex, zoneIndex]
  );

  const notebookCursor =
    currentLevel === "property" ? zoneIndex : currentLevel === "zone" ? bedIndex : plantIndex;

  const notebookItems = context.notebookItems;
  const activeNotebookItem = notebookItems[clamp(notebookCursor, notebookItems.length)];
  const pageStart = Math.floor(notebookCursor / itemsPerPage) * itemsPerPage;
  const visibleNotebookItems = notebookItems.slice(pageStart, pageStart + itemsPerPage);

  useEffect(() => {
    const syncItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 760 ? 4 : 1);
    };

    syncItemsPerPage();
    window.addEventListener("resize", syncItemsPerPage);

    return () => window.removeEventListener("resize", syncItemsPerPage);
  }, []);

  useEffect(() => {
    setIsEditing(false);
    setDraft(null);
  }, [bedIndex, levelIndex, plantIndex, propertyIndex, zoneIndex]);

  const setNotebookCursor = (nextIndex: number) => {
    const clamped = clamp(nextIndex, notebookItems.length);

    if (currentLevel === "property") {
      setZoneIndex(clamped);
      setBedIndex(0);
      setPlantIndex(0);
      return;
    }

    if (currentLevel === "zone") {
      setBedIndex(clamped);
      setPlantIndex(0);
      return;
    }

    setPlantIndex(clamped);
  };

  const moveHorizontal = (direction: -1 | 1) => {
    setNotebookCursor(pageStart + direction * itemsPerPage);
  };

  const moveLevel = (direction: -1 | 1) => {
    const nextLevelIndex = clamp(levelIndex + direction, levelOrder.length);

    if (nextLevelIndex === levelIndex) {
      return;
    }

    if (direction > 0) {
      if (currentLevel === "property") {
        setBedIndex(0);
        setPlantIndex(0);
      }

      if (currentLevel === "zone") {
        setPlantIndex(0);
      }
    }

    setLevelIndex(nextLevelIndex);
  };

  const selectProperty = (nextPropertyIndex: number) => {
    setPropertyIndex(nextPropertyIndex);
    setZoneIndex(0);
    setBedIndex(0);
    setPlantIndex(0);
    setLevelIndex(0);
  };

  const startEditing = () => {
    setDraft(createEditDraft(currentLevel, context));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(null);
    setIsEditing(false);
  };

  const updateDraft = (key: keyof EditDraft, value: string) => {
    setDraft((currentDraft) => ({
      ...(currentDraft ?? createEditDraft(currentLevel, context)),
      [key]: value
    }));
  };

  const saveEditing = () => {
    if (!draft) {
      return;
    }

    setProperties((currentProperties) => {
      const nextProperties = cloneProperties(currentProperties);
      const property = nextProperties[propertyIndex];
      const zone = property.zones[zoneIndex];
      const bed = zone.beds[bedIndex];
      const plant = bed.plants[plantIndex];

      if (currentLevel === "property") {
        property.name = draft.name;
        property.subtitle = draft.subtitle;
        property.summary = draft.summary;
        property.region = draft.region ?? property.region;
        property.season = draft.season ?? property.season;
        property.notes = fromMultiline(draft.notes);
        property.schedule = fromMultiline(draft.schedule);
      } else if (currentLevel === "zone") {
        zone.name = draft.name;
        zone.subtitle = draft.subtitle;
        zone.summary = draft.summary;
        zone.purpose = draft.purpose ?? zone.purpose;
        zone.water = draft.water ?? zone.water;
        zone.light = draft.light ?? zone.light;
        zone.notes = fromMultiline(draft.notes);
        zone.schedule = fromMultiline(draft.schedule);
      } else if (currentLevel === "bed") {
        bed.name = draft.name;
        bed.subtitle = draft.subtitle;
        bed.summary = draft.summary;
        bed.sun = draft.sun ?? bed.sun;
        bed.water = draft.water ?? bed.water;
        bed.soil = draft.soil ?? bed.soil;
        bed.notes = fromMultiline(draft.notes);
        bed.schedule = fromMultiline(draft.schedule);
      } else {
        plant.name = draft.name;
        plant.subtitle = draft.subtitle;
        plant.latinName = draft.latinName ?? plant.latinName;
        plant.summary = draft.summary;
        plant.sun = draft.sun ?? plant.sun;
        plant.water = draft.water ?? plant.water;
        plant.soil = draft.soil ?? plant.soil;
        plant.companion = draft.companion ?? plant.companion;
        plant.notes = fromMultiline(draft.notes);
        plant.schedule = fromMultiline(draft.schedule);
      }

      return nextProperties;
    });

    setIsEditing(false);
    setDraft(null);
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];

    if (!start || !touch) {
      return;
    }

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    touchStartRef.current = null;

    if (absX < 48 && absY < 72) {
      return;
    }

    if (absY > absX * 1.35 && absY > 84) {
      moveLevel(dy < 0 ? 1 : -1);
      return;
    }

    if (absX > absY && absX > 64) {
      moveHorizontal(dx < 0 ? 1 : -1);
    }
  };

  const stats =
    currentLevel === "property"
      ? [
          { label: "Zones", value: String(context.property.zones.length), icon: "journal" as const },
          { label: "Beds", value: String(countBeds(context.property)), icon: "leaf" as const },
          { label: "Plants", value: String(countPlants(context.property)), icon: "sprout" as const },
          { label: "This week", value: String(context.property.schedule.length), icon: "calendar" as const }
        ]
      : currentLevel === "zone"
        ? [
            { label: "Beds", value: String(context.zone.beds.length), icon: "journal" as const },
            { label: "Plants", value: String(countPlantsInZone(context.zone)), icon: "leaf" as const },
            { label: "Water", value: context.zone.water, icon: "water" as const },
            { label: "Light", value: context.zone.light, icon: "sun" as const }
          ]
        : currentLevel === "bed"
          ? [
              { label: "Plants", value: String(context.bed.plants.length), icon: "sprout" as const },
              { label: "Sun", value: context.bed.sun, icon: "sun" as const },
              { label: "Water", value: context.bed.water, icon: "water" as const },
              { label: "Soil", value: context.bed.soil, icon: "soil" as const }
            ]
          : [
              { label: "Sun", value: context.plant.sun, icon: "sun" as const },
              { label: "Water", value: context.plant.water, icon: "water" as const },
              { label: "Soil", value: context.plant.soil, icon: "soil" as const },
              { label: "Companion", value: context.plant.companion, icon: "leaf" as const }
            ];

  const description =
    currentLevel === "property"
      ? context.property.summary
      : currentLevel === "zone"
        ? context.zone.summary
        : currentLevel === "bed"
          ? context.bed.summary
          : context.plant.summary;

  const schedule =
    currentLevel === "property"
      ? context.property.schedule
      : currentLevel === "zone"
        ? context.zone.schedule
        : currentLevel === "bed"
          ? context.bed.schedule
          : context.plant.schedule;

  const notes =
    currentLevel === "property"
      ? context.property.notes
      : currentLevel === "zone"
        ? context.zone.notes
        : currentLevel === "bed"
          ? context.bed.notes
          : context.plant.notes;

  const currentTitle =
    currentLevel === "property"
      ? context.property.name
      : currentLevel === "zone"
        ? context.zone.name
        : currentLevel === "bed"
          ? context.bed.name
          : context.plant.name;

  const currentSubtitle =
    currentLevel === "property"
      ? `${context.property.subtitle} · ${context.property.region} · ${context.property.season}`
      : currentLevel === "zone"
        ? `${context.zone.subtitle} · ${context.zone.purpose}`
        : currentLevel === "bed"
          ? `${context.bed.subtitle} · ${context.bed.sun}`
          : `${context.plant.subtitle} · ${context.plant.latinName}`;

  const archiveLabel = buildArchiveLabel(currentLevel);
  const archiveKicker = buildArchiveKicker(currentLevel, context);
  const archiveTrail = buildArchiveTrail(currentLevel, context);
  const archiveFolio = buildArchiveFolio(currentLevel, propertyIndex, zoneIndex, bedIndex, plantIndex);
  const archiveRows = buildArchiveRows(currentLevel, context);
  const compositionEntries = buildCompositionEntries(currentLevel, context);
  const compositionTitle = buildCompositionTitle(currentLevel);
  const marginalNote = notes[0] ?? schedule[0] ?? description;

  return (
    <section className="property-browser">
      <div className="property-browser__toolbar">
        <div>
          <p className="property-browser__eyebrow">Spatial archive</p>
          <p className="property-browser__note">Field observations</p>
        </div>
        <button className="button property-browser__action" onClick={isEditing ? cancelEditing : startEditing} type="button">
          {isEditing ? "Close editor" : "Edit folio"}
        </button>
      </div>

      <div className="property-archive-list">
        <SpecimenLabel tone="olive">Properties</SpecimenLabel>
        <div className="property-archive-list__items">
          {properties.map((property, index) => (
            <button
              key={property.id}
              className={`property-archive-list__item ${index === propertyIndex ? "is-active" : ""}`}
              onClick={() => selectProperty(index)}
              type="button"
            >
              <strong>{property.name}</strong>
              <span>
                {property.zones.length} zones · {countBeds(property)} beds
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="property-breadcrumbs">
        <button className={`property-breadcrumb ${levelIndex === 0 ? "is-active" : ""}`} onClick={() => setLevelIndex(0)} type="button">
          {context.property.name}
        </button>
        {levelIndex >= 1 ? (
          <button className={`property-breadcrumb ${levelIndex === 1 ? "is-active" : ""}`} onClick={() => setLevelIndex(1)} type="button">
            {context.zone.name}
          </button>
        ) : null}
        {levelIndex >= 2 ? (
          <button className={`property-breadcrumb ${levelIndex === 2 ? "is-active" : ""}`} onClick={() => setLevelIndex(2)} type="button">
            {context.bed.name}
          </button>
        ) : null}
        {levelIndex >= 3 ? (
          <button className={`property-breadcrumb ${levelIndex === 3 ? "is-active" : ""}`} onClick={() => setLevelIndex(3)} type="button">
            {context.plant.name}
          </button>
        ) : null}
      </div>

      <nav aria-label="Hierarchy levels" className="property-hierarchy-nav">
        {levelOrder.map((levelName, index) => (
          <React.Fragment key={levelName}>
            {index > 0 ? <span className="property-hierarchy-nav__separator">→</span> : null}
            <button
              aria-current={index === levelIndex ? "page" : undefined}
              className={`property-hierarchy-nav__link ${index === levelIndex ? "is-current" : ""} ${index > levelIndex ? "is-disabled" : ""}`}
              disabled={index >= levelIndex}
              onClick={() => setLevelIndex(index)}
              type="button"
            >
              {levelName}
            </button>
          </React.Fragment>
        ))}
      </nav>

      <div className="property-workspace">
        <section className="property-notebook-pane">
          <div className="property-notebook-pane__header">
            <div>
              <h2 className="property-notebook-pane__title">{context.notebookTitle}</h2>
            </div>
            <div className="property-notebook-pane__level-controls">
              <button className="folio-button" disabled={levelIndex === 0} onClick={() => moveLevel(-1)} type="button">
                ↑ Up a level
              </button>
              <button className="folio-button" disabled={levelIndex === levelOrder.length - 1} onClick={() => moveLevel(1)} type="button">
                ↓ Down a level
              </button>
            </div>
          </div>

          <div className="property-notebook" onTouchEnd={onTouchEnd} onTouchStart={onTouchStart}>
            <div className="property-notebook__page">
              <div className="property-notebook__page-head">
                <div className="property-notebook__page-head-copy">
                  <SpecimenLabel>Archive index</SpecimenLabel>
                  <span className="property-notebook__page-caption">{context.notebookTitle}</span>
                </div>
                <div className="property-notebook__page-head-copy property-notebook__page-head-copy--right">
                  <span className="property-notebook__folio">Sheet {Math.floor(pageStart / itemsPerPage) + 1}</span>
                  <span>
                    {notebookItems.length > 0 ? pageStart + 1 : 0}-{Math.min(pageStart + itemsPerPage, notebookItems.length)} /{" "}
                    {notebookItems.length}
                  </span>
                </div>
              </div>

              {activeNotebookItem ? (
                <div className="property-notebook__page-body property-notebook__page-body--grid">
                  {visibleNotebookItems.map((item, index) => {
                    const absoluteIndex = pageStart + index;

                    return (
                      <button
                        className={`property-child-card ${absoluteIndex === notebookCursor ? "is-active" : ""}`}
                        key={item.id}
                        onClick={() => setNotebookCursor(absoluteIndex)}
                        type="button"
                      >
                        <div className="property-child-card__meta">
                          <SpecimenLabel tone={absoluteIndex === notebookCursor ? "olive" : "default"}>
                            Entry {String(absoluteIndex + 1).padStart(2, "0")}
                          </SpecimenLabel>
                          <span>{item.facts.join(" · ")}</span>
                        </div>
                        <div className="property-child-card__body">
                          <div className="property-child-card__art">
                            <Image alt={item.title} className="specimen-art specimen-art--small" height={160} src={item.illustration} width={120} />
                          </div>
                          <div className="property-child-card__copy">
                            <h3>{item.title}</h3>
                            <p className="property-notebook__subtitle">{item.subtitle}</p>
                            <p>{item.summary}</p>
                            <p className="property-child-card__focus">Observation: {item.focus}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="property-notebook__empty">
                  <p>No child entries at this level yet.</p>
                </div>
              )}
            </div>

            <div className="property-notebook__footer">
              <button className="folio-button" disabled={notebookCursor === 0} onClick={() => moveHorizontal(-1)} type="button">
                ← Previous page
              </button>
              <p className="property-notebook__helper">{context.notebookHelper}</p>
              <button
                className="folio-button"
                disabled={pageStart + itemsPerPage >= notebookItems.length}
                onClick={() => moveHorizontal(1)}
                type="button"
              >
                Next page →
              </button>
            </div>
          </div>
        </section>

        <aside className="property-info-panel">
          <div className="property-info-panel__header">
            <div className="property-info-panel__header-top">
              <div className="property-info-panel__header-meta">
                <SpecimenLabel tone="clay">{archiveLabel}</SpecimenLabel>
                <p className="property-info-panel__kicker">{archiveKicker}</p>
              </div>
              <button
                aria-label={isEditing ? "Editing current item" : "Edit current item"}
                className={`property-edit-button ${isEditing ? "is-active" : ""}`}
                onClick={isEditing ? undefined : startEditing}
                type="button"
              >
                ✎
              </button>
            </div>
            {isEditing && draft ? (
              <div className="property-edit-form">
                <div className="property-field-grid">
                  <label className="property-field">
                    <span>Name</span>
                    <input className="input" onChange={(event) => updateDraft("name", event.target.value)} value={draft.name} />
                  </label>
                  <label className="property-field">
                    <span>Subtitle</span>
                    <input className="input" onChange={(event) => updateDraft("subtitle", event.target.value)} value={draft.subtitle} />
                  </label>
                  {currentLevel === "property" ? (
                    <>
                      <label className="property-field">
                        <span>Region</span>
                        <input className="input" onChange={(event) => updateDraft("region", event.target.value)} value={draft.region ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Season</span>
                        <input className="input" onChange={(event) => updateDraft("season", event.target.value)} value={draft.season ?? ""} />
                      </label>
                    </>
                  ) : null}
                  {currentLevel === "zone" ? (
                    <>
                      <label className="property-field">
                        <span>Purpose</span>
                        <input className="input" onChange={(event) => updateDraft("purpose", event.target.value)} value={draft.purpose ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Light</span>
                        <input className="input" onChange={(event) => updateDraft("light", event.target.value)} value={draft.light ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Water</span>
                        <input className="input" onChange={(event) => updateDraft("water", event.target.value)} value={draft.water ?? ""} />
                      </label>
                    </>
                  ) : null}
                  {currentLevel === "bed" ? (
                    <>
                      <label className="property-field">
                        <span>Sun</span>
                        <input className="input" onChange={(event) => updateDraft("sun", event.target.value)} value={draft.sun ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Water</span>
                        <input className="input" onChange={(event) => updateDraft("water", event.target.value)} value={draft.water ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Soil</span>
                        <input className="input" onChange={(event) => updateDraft("soil", event.target.value)} value={draft.soil ?? ""} />
                      </label>
                    </>
                  ) : null}
                  {currentLevel === "plant" ? (
                    <>
                      <label className="property-field">
                        <span>Latin name</span>
                        <input className="input" onChange={(event) => updateDraft("latinName", event.target.value)} value={draft.latinName ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Sun</span>
                        <input className="input" onChange={(event) => updateDraft("sun", event.target.value)} value={draft.sun ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Water</span>
                        <input className="input" onChange={(event) => updateDraft("water", event.target.value)} value={draft.water ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Soil</span>
                        <input className="input" onChange={(event) => updateDraft("soil", event.target.value)} value={draft.soil ?? ""} />
                      </label>
                      <label className="property-field">
                        <span>Companion</span>
                        <input className="input" onChange={(event) => updateDraft("companion", event.target.value)} value={draft.companion ?? ""} />
                      </label>
                    </>
                  ) : null}
                </div>

                <label className="property-field">
                  <span>Summary</span>
                  <textarea className="input property-textarea" onChange={(event) => updateDraft("summary", event.target.value)} value={draft.summary} />
                </label>

                <label className="property-field">
                  <span>Scheduling</span>
                  <textarea className="input property-textarea" onChange={(event) => updateDraft("schedule", event.target.value)} value={draft.schedule} />
                </label>

                <label className="property-field">
                  <span>Notes</span>
                  <textarea className="input property-textarea" onChange={(event) => updateDraft("notes", event.target.value)} value={draft.notes} />
                </label>

                <div className="property-info-actions">
                  <button className="folio-button" onClick={cancelEditing} type="button">
                    Cancel
                  </button>
                  <button className="button" onClick={saveEditing} type="button">
                    Save changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="property-record-sheet__hero">
                  <div className="property-record-sheet__copy">
                    <p className="property-info-panel__folio-line">Folio {archiveFolio}</p>
                    <h2>{currentTitle}</h2>
                    <p className="property-info-panel__subtitle">{currentSubtitle}</p>
                    <p className="property-record-sheet__lead">{description}</p>
                  </div>
                  <div className="property-record-sheet__plate">
                    <Image
                      alt={currentTitle}
                      className="specimen-art"
                      height={300}
                      src={
                        currentLevel === "property"
                          ? context.property.illustration
                          : currentLevel === "zone"
                            ? context.zone.illustration
                            : currentLevel === "bed"
                              ? context.bed.illustration
                              : context.plant.illustration
                      }
                      width={220}
                    />
                    <p className="property-record-sheet__plate-note">Field plate attached to this record for seasonal comparison.</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {isEditing ? null : (
            <div className="property-record-sheet">
              <div className="property-record-sheet__ledger">
                {stats.map((stat) => (
                  <div className="property-ledger-entry" key={stat.label}>
                    <span className="property-ledger-entry__label">
                      <FieldIcon className="field-icon" name={stat.icon} />
                      {stat.label}
                    </span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>

              <div className="property-record-sheet__columns">
                <section className="property-manuscript-section">
                  <div className="property-manuscript-section__head">
                    <SpecimenLabel>Archive record</SpecimenLabel>
                    <span className="property-manuscript-section__rule" />
                  </div>
                  <dl className="detail-list">
                    {archiveRows.map((row) => (
                      <div className="detail-list__row" key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <MarginNote className="property-record-sheet__margin-note" icon="journal" title="Field annotation">
                  <p>{marginalNote}</p>
                </MarginNote>
              </div>

              <section className="property-manuscript-section">
                <div className="property-manuscript-section__head">
                  <SpecimenLabel tone="olive">{compositionTitle}</SpecimenLabel>
                  <span className="property-manuscript-section__rule" />
                </div>
                <ul className="note-list">
                  {compositionEntries.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <div className="property-record-sheet__columns">
                <section className="property-manuscript-section">
                  <div className="property-manuscript-section__head">
                    <SpecimenLabel>Upcoming actions</SpecimenLabel>
                    <span className="property-manuscript-section__rule" />
                  </div>
                  <ul className="note-list">
                    {schedule.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="property-manuscript-section">
                  <div className="property-manuscript-section__head">
                    <SpecimenLabel>Observed notes</SpecimenLabel>
                    <span className="property-manuscript-section__rule" />
                  </div>
                  <ul className="note-list">
                    {notes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              {currentLevel === "property" ? (
                <section className="property-manuscript-section">
                  <div className="property-manuscript-section__head">
                    <SpecimenLabel tone="olive">Property index</SpecimenLabel>
                    <span className="property-manuscript-section__rule" />
                  </div>
                  <div className="property-roster">
                    {properties.map((property, index) => (
                      <button
                        key={property.id}
                        className={`property-roster__item ${index === propertyIndex ? "is-active" : ""}`}
                        onClick={() => selectProperty(index)}
                        type="button"
                      >
                        <strong>{property.name}</strong>
                        <span>
                          {property.zones.length} zones · {countBeds(property)} beds · {countPlants(property)} plants
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="property-record-sheet__footer">
                <InkStamp tone="charcoal">Collector archive</InkStamp>
                <p>{archiveTrail}</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
