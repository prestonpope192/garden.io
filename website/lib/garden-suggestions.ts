import type {
  GardenBed,
  GardenPlantInstance,
  GardenProperty,
  GardenZone
} from "@/lib/garden-app-types";

// Heuristic suggestion engine (specs 05/06). No LLM / weather — this turns the
// grower's real plants + beds + season into context-scoped, actionable guidance
// with a plain-language rationale. Suggestions are ephemeral (computed each load)
// and can be converted into a real task; dismissal is session-local.

export type SuggestionType = "suggestion" | "insight" | "warning" | "opportunity";
export type SuggestionConfidence = "high" | "medium" | "low";
export type SuggestionSeason = "Spring" | "Summer" | "Autumn" | "Winter";
export type SuggestionFocus = "property" | "zone" | "bed" | "plant";

export type GardenSuggestion = {
  id: string;
  type: SuggestionType;
  title: string;
  rationale: string;
  confidence: SuggestionConfidence;
  taskTitle: string;
  windowLabel: string;
  dueInDays: number;
};

export function deriveSeason(month: number): SuggestionSeason {
  // month is 0-indexed (0 = January), Northern Hemisphere.
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

// ── Plant categorisation (keyword heuristics over name / type / use-cases) ──────

function plantText(plant: GardenPlantInstance): string {
  const p = plant.plant_profile;
  return [p?.display_name, p?.plant_type_code, p?.primary_use_cases, p?.botanical_name_full]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const has = (text: string, words: string[]) => words.some((w) => text.includes(w));

const isNightshade = (t: string) => has(t, ["tomato", "pepper", "eggplant", "aubergine"]);
const isAllium = (t: string) => has(t, ["garlic", "onion", "leek", "chive", "shallot", "allium"]);
const isLegume = (t: string) => has(t, ["bean", "pea ", "peas", "clover", "vetch", "lentil", "lupin", "nitrogen"]);
const isBerry = (t: string) => has(t, ["berry", "strawberr", "raspberr", "blackberr", "blueberr", "currant"]);
const isFruitTree = (t: string) =>
  has(t, ["apple", "pear", "peach", "plum", "cherry", "citrus", "lemon", "lime", "orange", "pawpaw", "pecan", "fig", "apricot", "nut tree", "orchard"]);
const isHerb = (t: string) => has(t, ["herb", "basil", "dill", "thyme", "mint", "oregano", "rosemary", "sage", "cilantro", "parsley", "chive"]);
const isPollinatorFlower = (t: string) =>
  has(t, ["calendula", "nasturtium", "borage", "bee balm", "marigold", "sunflower", "zinnia", "hellebore", "lavender", "pollinator", "flower"]);
const isBrassica = (t: string) => has(t, ["broccoli", "cabbage", "kale", "brassica", "cauliflower", "brussels", "collard"]);
const isLeafy = (t: string) => has(t, ["lettuce", "spinach", "greens", "chard", "arugula", "mesclun"]);

function isPerennial(plant: GardenPlantInstance): boolean {
  return (plant.plant_profile?.lifecycle_type ?? "").toLowerCase().includes("peren");
}

function plantName(plant: GardenPlantInstance): string {
  return plant.plant_profile?.display_name ?? "this plant";
}

// ── Engine ──────────────────────────────────────────────────────────────────

type EngineInput = {
  focus: SuggestionFocus;
  property: GardenProperty | null;
  zone: GardenZone | null;
  bed: GardenBed | null;
  plant: GardenPlantInstance | null;
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  season: SuggestionSeason;
  existingTaskTitles: string[]; // normalised (lowercased, trimmed) open task titles
};

const PRIORITY: Record<SuggestionType, number> = { warning: 0, opportunity: 1, suggestion: 2, insight: 3 };
const CONFIDENCE_RANK: Record<SuggestionConfidence, number> = { high: 0, medium: 1, low: 2 };

export function generateSuggestions(input: EngineInput): GardenSuggestion[] {
  const { focus, season } = input;
  const growing = input.plants.filter((p) => p.status === "growing");
  const raw: GardenSuggestion[] = [];
  const push = (s: GardenSuggestion) => raw.push(s);

  if (focus === "plant" && input.plant) {
    const plant = input.plant;
    const t = plantText(plant);
    const name = plantName(plant);
    const key = (k: string) => `plant:${plant.id}:${k}`;
    if (isNightshade(t) && season === "Summer") {
      push({ id: key("sucker"), type: "suggestion", title: `Prune suckers and scout ${name} for hornworms`, rationale: `${name} is in its summer push — pinching suckers and checking leaves now keeps fruit set strong.`, confidence: "high", taskTitle: `Prune suckers and check ${name} for hornworms`, windowLabel: "this week", dueInDays: 4 });
    } else if (isNightshade(t) && season === "Spring") {
      push({ id: key("stake"), type: "suggestion", title: `Stake or cage ${name} before it sprawls`, rationale: `Support goes in easiest while ${name} is still young.`, confidence: "high", taskTitle: `Stake or cage ${name}`, windowLabel: "this week", dueInDays: 5 });
    }
    if (isAllium(t) && season === "Autumn") {
      push({ id: key("plant-clove"), type: "opportunity", title: `Plant ${name} cloves now`, rationale: "Fall-planted alliums root before winter and size up for an early-summer harvest.", confidence: "high", taskTitle: `Plant ${name} cloves`, windowLabel: "this season", dueInDays: 14 });
    }
    if (isBerry(t) && season === "Summer") {
      push({ id: key("net"), type: "suggestion", title: `Net ${name} as the fruit colours up`, rationale: "Birds find ripening berries fast — netting now protects the harvest.", confidence: "medium", taskTitle: `Net ${name} against birds`, windowLabel: "this week", dueInDays: 5 });
    }
    if (isFruitTree(t) && season === "Winter") {
      push({ id: key("prune"), type: "suggestion", title: `Prune ${name} during dormancy`, rationale: "Bare structure makes shaping cuts clear, and dormant pruning reduces disease spread.", confidence: "high", taskTitle: `Prune ${name} (dormant season)`, windowLabel: "this season", dueInDays: 21 });
    }
    if (isLeafy(t) && season === "Summer") {
      push({ id: key("succession"), type: "opportunity", title: `Sow a fresh succession of ${name}`, rationale: "A small re-sow every couple of weeks avoids a glut-then-gap and beats the heat bolt.", confidence: "medium", taskTitle: `Sow a succession of ${name}`, windowLabel: "this week", dueInDays: 7 });
    }
    if (isPerennial(plant) && season === "Autumn") {
      push({ id: key("mulch-crown"), type: "suggestion", title: `Mulch the crown of ${name} before hard frost`, rationale: `${name} is a perennial — a mulch blanket protects the crown through winter.`, confidence: "medium", taskTitle: `Mulch ${name} crown for winter`, windowLabel: "this season", dueInDays: 14 });
    }
    if (plant.planted_on) {
      const days = daysSince(plant.planted_on);
      if (days >= 0 && days < 14) {
        push({ id: key("water-in"), type: "insight", title: `Keep ${name} evenly watered while it roots in`, rationale: `Planted ${days} day${days === 1 ? "" : "s"} ago — consistent moisture now sets up healthy establishment.`, confidence: "medium", taskTitle: `Water ${name} to settle it in`, windowLabel: "this week", dueInDays: 2 });
      }
    }
  }

  if (focus === "bed" && input.bed) {
    const bed = input.bed;
    const bedPlants = growing.filter((p) => p.bed_id === bed.id);
    const texts = bedPlants.map(plantText);
    const key = (k: string) => `bed:${bed.id}:${k}`;
    const hasNightshade = texts.some(isNightshade);
    const hasCompanionHerb = texts.some((t) => isHerb(t) || isPollinatorFlower(t));
    if (hasNightshade && !hasCompanionHerb) {
      push({ id: key("companion"), type: "opportunity", title: `Tuck basil or marigold into ${bed.name}`, rationale: "Basil and marigold are classic companions for tomatoes and peppers — they deter pests and draw beneficial insects.", confidence: "high", taskTitle: `Add basil or marigold to ${bed.name}`, windowLabel: "this season", dueInDays: 10 });
    }
    if (texts.some(isLegume)) {
      push({ id: key("legume-roots"), type: "insight", title: `Leave the roots when you clear the beans in ${bed.name}`, rationale: "Legume roots hold nitrogen-fixing nodules — leaving them feeds the next crop.", confidence: "medium", taskTitle: `Note: leave legume roots in ${bed.name}`, windowLabel: "later", dueInDays: 30 });
    }
    if (bedPlants.length >= 6) {
      push({ id: key("crowding"), type: "warning", title: `${bed.name} is filling up — watch for crowding`, rationale: `${bedPlants.length} plantings here. Thinning or pausing new additions keeps airflow up and disease down.`, confidence: "medium", taskTitle: `Thin or space plantings in ${bed.name}`, windowLabel: "this week", dueInDays: 7 });
    }
    if (season === "Summer" && bedPlants.length > 0) {
      push({ id: key("mulch"), type: "suggestion", title: `Mulch ${bed.name} to hold summer moisture`, rationale: "A mulch layer cuts evaporation and keeps roots cool through heat spells.", confidence: "medium", taskTitle: `Mulch ${bed.name}`, windowLabel: "this week", dueInDays: 6 });
    }
  }

  if (focus === "zone" && input.zone) {
    const zone = input.zone;
    const zonePlants = growing.filter((p) => p.zone_id === zone.id);
    const texts = zonePlants.map(plantText);
    const key = (k: string) => `zone:${zone.id}:${k}`;
    if (texts.some(isFruitTree) && !texts.some(isLegume)) {
      push({ id: key("nfixer"), type: "opportunity", title: `Add a nitrogen-fixer under the trees in ${zone.name}`, rationale: "Clover or beans beneath fruit trees feed the soil and cut the need for fertiliser.", confidence: "medium", taskTitle: `Plant a nitrogen-fixer in ${zone.name}`, windowLabel: "this season", dueInDays: 14 });
    }
    if (zonePlants.length > 0 && !texts.some(isPollinatorFlower)) {
      push({ id: key("pollinator"), type: "opportunity", title: `Add a pollinator flower to ${zone.name}`, rationale: "A patch of flowers pulls in bees and predatory insects that work the whole zone.", confidence: "medium", taskTitle: `Add a pollinator flower to ${zone.name}`, windowLabel: "this season", dueInDays: 14 });
    }
  }

  if (focus === "property" && input.property) {
    const allTexts = growing.map(plantText);
    const key = (k: string) => `property:${k}`;
    if (growing.length > 0 && !allTexts.some(isPollinatorFlower)) {
      push({ id: key("pollinator-patch"), type: "opportunity", title: "Start a small pollinator patch", rationale: "Even one bed of flowers lifts pollination and pest control across the whole garden — nothing here is drawing beneficials yet.", confidence: "high", taskTitle: "Plan a pollinator flower bed", windowLabel: "this season", dueInDays: 14 });
    }
    const seasonal: Record<SuggestionSeason, { title: string; rationale: string; task: string; days: number }> = {
      Spring: { title: "Prep beds with compost before the soil warms", rationale: "Spring is the window to build fertility before heavy planting.", task: "Top-dress beds with compost", days: 10 },
      Summer: { title: "Set a watering rhythm before the next heat spell", rationale: "A steady deep-watering habit prevents stress during summer peaks.", task: "Set up a watering schedule", days: 5 },
      Autumn: { title: "Plan garlic and cover crops for cleared beds", rationale: "Fall plantings and cover crops protect and feed soil over winter.", task: "Plan fall plantings and cover crops", days: 14 },
      Winter: { title: "Order seeds and map next season's rotations", rationale: "Quiet months are best for planning rotations and ordering before stock runs low.", task: "Plan next season's crop rotation", days: 21 }
    };
    const s = seasonal[season];
    push({ id: key(`seasonal-${season}`), type: "suggestion", title: s.title, rationale: s.rationale, confidence: "high", taskTitle: s.task, windowLabel: "this season", dueInDays: s.days });
    if (input.zones.length > 0 && input.beds.length < input.zones.length * 2) {
      push({ id: key("more-beds"), type: "insight", title: "Lay out more beds to make the most of your zones", rationale: "There's room to expand — more beds turn your zones into productive space.", confidence: "low", taskTitle: "Plan another bed", windowLabel: "later", dueInDays: 30 });
    }
  }

  // De-duplicate against existing open tasks (so accepted ones stop re-appearing).
  const taken = new Set(input.existingTaskTitles.map((t) => t.toLowerCase().trim()));
  const deduped = raw.filter((s) => {
    const tt = s.taskTitle.toLowerCase().trim();
    for (const existing of taken) {
      if (existing === tt || existing.includes(tt) || tt.includes(existing)) return false;
    }
    return true;
  });

  // Non-intrusive: sort by priority then confidence, cap at 4.
  deduped.sort((a, b) => PRIORITY[a.type] - PRIORITY[b.type] || CONFIDENCE_RANK[a.confidence] - CONFIDENCE_RANK[b.confidence]);
  return deduped.slice(0, 4);
}

function daysSince(iso: string): number {
  const then = new Date(`${iso}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((now.getTime() - then.getTime()) / 86400000);
}

export function dueDateISO(dueInDays: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dueInDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
