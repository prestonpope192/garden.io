export type PlantCatalogueEntry = {
  slug: string;
  commonName: string;
  latinName: string;
  family: string;
  summary: string;
  sun: string;
  water: string;
  soil: string;
  fitFor: string;
  publicNote: string;
  tags: string[];
  illustration: string;
};

export const plantCatalogueEntries: PlantCatalogueEntry[] = [
  {
    slug: "cherokee-purple-tomato",
    commonName: "Cherokee Purple Tomato",
    latinName: "Solanum lycopersicum",
    family: "Solanaceae",
    summary: "A full-flavor slicing tomato that rewards warm beds, deep feeding, and consistent pruning.",
    sun: "Full",
    water: "Medium",
    soil: "Rich, warm, mulched",
    fitFor: "Kitchen gardens, warm raised beds, succession planting",
    publicNote: "Popular starter profile because it shows how Garden.io links plant care, companion notes, and timing windows.",
    tags: ["Fruit", "Warm season", "Full sun"],
    illustration: "/art/specimen-tomato.svg"
  },
  {
    slug: "scarlet-runner-bean",
    commonName: "Scarlet Runner Bean",
    latinName: "Phaseolus coccineus",
    family: "Fabaceae",
    summary: "A climbing bean with strong pollinator value and a long visual season on fences and trellises.",
    sun: "Full to part",
    water: "Medium",
    soil: "Compost-rich, evenly moist",
    fitFor: "Fence lines, trellis beds, pollinator strips",
    publicNote: "Useful for growers balancing edible production with floral impact and pollinator traffic.",
    tags: ["Climber", "Pollinator", "Trellis"],
    illustration: "/art/specimen-bean-vine.svg"
  },
  {
    slug: "calendula",
    commonName: "Calendula",
    latinName: "Calendula officinalis",
    family: "Asteraceae",
    summary: "An easy seasonal flower for edges, pollinator support, and steady cut-and-come-again blooms.",
    sun: "Full to part",
    water: "Low to medium",
    soil: "Well-drained, forgiving",
    fitFor: "Pollinator borders, companion rows, reseeding beds",
    publicNote: "A strong entry point for visitors who want to browse the catalog without logging in.",
    tags: ["Flower", "Pollinator", "Reseeds"],
    illustration: "/art/specimen-calendar-bloom.svg"
  },
  {
    slug: "comfrey",
    commonName: "Comfrey",
    latinName: "Symphytum officinale",
    family: "Boraginaceae",
    summary: "A heavy-cut perennial often used in orchard guilds for mulch, nutrient cycling, and pollinator support.",
    sun: "Full to part",
    water: "Medium",
    soil: "Deep, moisture-retentive",
    fitFor: "Orchard circles, guild beds, chop-and-drop systems",
    publicNote: "Useful for regenerative-minded growers thinking in systems rather than isolated crops.",
    tags: ["Perennial", "Guild", "Soil building"],
    illustration: "/art/specimen-herbarium-sheet.svg"
  },
  {
    slug: "genovese-basil",
    commonName: "Genovese Basil",
    latinName: "Ocimum basilicum",
    family: "Lamiaceae",
    summary: "A kitchen-garden staple that pairs well with tomatoes and rewards regular pinching.",
    sun: "Full",
    water: "Medium",
    soil: "Rich, quick-draining",
    fitFor: "Companion plantings, warm containers, high-use herb beds",
    publicNote: "Included to highlight companion relationships and quick seasonal wins for new users.",
    tags: ["Herb", "Companion", "Warm season"],
    illustration: "/art/specimen-calendar-bloom.svg"
  },
  {
    slug: "blueberry-highbush",
    commonName: "Highbush Blueberry",
    latinName: "Vaccinium corymbosum",
    family: "Ericaceae",
    summary: "A perennial fruiting shrub that depends on acidity, mulch, and long-horizon care.",
    sun: "Full to light shade",
    water: "Medium",
    soil: "Acidic, organic, moisture-retentive",
    fitFor: "Perennial borders, orchard edges, berry rows",
    publicNote: "A good example of why place-based records matter over multiple seasons.",
    tags: ["Perennial", "Fruit", "Acid-loving"],
    illustration: "/art/specimen-herbarium-sheet.svg"
  },
  {
    slug: "dill",
    commonName: "Dill",
    latinName: "Anethum graveolens",
    family: "Apiaceae",
    summary: "A feathery herb that attracts beneficial insects and bridges the edible and pollinator garden.",
    sun: "Full",
    water: "Low to medium",
    soil: "Loose, well-drained",
    fitFor: "Pollinator strips, herb beds, edge plantings",
    publicNote: "Shows how the catalog can connect beneficial insect value to practical planting decisions.",
    tags: ["Herb", "Beneficial insects", "Fast growing"],
    illustration: "/art/specimen-bean-vine.svg"
  },
  {
    slug: "strawberry-june-bearing",
    commonName: "June-Bearing Strawberry",
    latinName: "Fragaria × ananassa",
    family: "Rosaceae",
    summary: "A compact fruiting crop that benefits from clean mulch, renewal notes, and bed-level memory.",
    sun: "Full",
    water: "Medium",
    soil: "Rich, moisture-consistent",
    fitFor: "Perennial rows, raised beds, family picking patches",
    publicNote: "Useful for demonstrating how recurring seasonal tasks attach to a stable place record.",
    tags: ["Fruit", "Perennial", "Mulch"],
    illustration: "/art/specimen-tomato.svg"
  },
  {
    slug: "meyer-lemon",
    commonName: "Meyer Lemon",
    latinName: "Citrus × meyeri",
    family: "Rutaceae",
    summary: "A container-friendly citrus for growers managing winter protection and seasonal movement.",
    sun: "Full",
    water: "Medium",
    soil: "Sharp-draining citrus mix",
    fitFor: "Containers, protected patios, greenhouse transitions",
    publicNote: "Highlights the kind of plant that benefits from schedule-aware reminders and move-in notes.",
    tags: ["Container", "Citrus", "Protected"],
    illustration: "/art/specimen-calendar-bloom.svg"
  },
  {
    slug: "garlic-hardneck",
    commonName: "Hardneck Garlic",
    latinName: "Allium sativum var. ophioscorodon",
    family: "Amaryllidaceae",
    summary: "A season-spanning crop where planting date, mulch depth, and harvest timing all matter.",
    sun: "Full",
    water: "Low to medium",
    soil: "Loose, fertile, well-drained",
    fitFor: "Fall planting plans, rotation beds, storage crops",
    publicNote: "A clear example of how calendar timing and plant records reinforce each other.",
    tags: ["Storage crop", "Cool season", "Rotation"],
    illustration: "/art/specimen-herbarium-sheet.svg"
  }
];

export function getPlantBySlug(slug: string) {
  return plantCatalogueEntries.find((entry) => entry.slug === slug);
}
