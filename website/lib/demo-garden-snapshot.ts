import type {
  GardenBed,
  GardenObservation,
  GardenPlantInstance,
  GardenPlantProfile,
  GardenPlantStatus,
  GardenProperty,
  GardenSnapshot,
  GardenTask,
  GardenZone
} from "@/lib/garden-app-types";
import { getJournalStylePlantImageUrl } from "@/lib/plant-images";

const preferredDemoSlugs = [
  "borage",
  "bouquet-dill",
  "bell-pepper",
  "apple",
  "calendula",
  "cilantro"
];

const fallbackProfiles: GardenPlantProfile[] = [
  makeFallbackProfile({
    slug: "borage",
    displayName: "Borage",
    botanicalName: "Borago officinalis",
    plantType: "flower",
    lifecycle: "annual",
    imageUrl: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/borage.jpg",
    imageAttribution: "Unknown artist · Public domain · Wikimedia Commons",
    description: "A pollinator-friendly herb where blooms, reseeding, and companion planting notes are useful.",
    primaryUseCases: "Pollinator Support, Companion Plant, Edible Flowers",
    bestSpot: "Sunny bed edges where pollinator visits and reseeding are easy to watch.",
    light: "Full sun",
    water: "Moderate"
  }),
  makeFallbackProfile({
    slug: "bouquet-dill",
    displayName: "Bouquet Dill",
    botanicalName: "Anethum graveolens",
    plantType: "herb",
    lifecycle: "annual",
    imageUrl: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/bouquet-dill.jpg",
    imageAttribution: "Prof. Dr. Otto Wilhelm Thomé · Public domain · Wikimedia Commons",
    description: "A kitchen herb where sowing dates, cut stems, flowers, and seed heads are worth remembering.",
    primaryUseCases: "Fresh Herb, Pollinator Support, Seed Heads",
    bestSpot: "A sunny herb bed where repeat sowings and harvest timing stay visible.",
    light: "Full sun",
    water: "Moderate"
  }),
  makeFallbackProfile({
    slug: "bell-pepper",
    displayName: "Bell Pepper",
    botanicalName: "Capsicum annuum",
    plantType: "vegetable",
    lifecycle: "annual",
    imageUrl: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/bell-pepper.jpg",
    imageAttribution: "Franz Eugen Köhler, Köhler's Medizinal-Pflanzen · Public domain · Wikimedia Commons",
    description: "A warm-season vegetable where steady water, blossom set, and harvest timing matter.",
    primaryUseCases: "Fresh Eating, Containers, Summer Harvest",
    bestSpot: "Warm containers or bed edges where watering and heat stress are easy to notice.",
    light: "Full sun",
    water: "High"
  })
];

function makeFallbackProfile(input: {
  slug: string;
  displayName: string;
  botanicalName: string;
  plantType: string;
  lifecycle: string;
  imageUrl: string;
  imageAttribution?: string;
  description: string;
  primaryUseCases: string;
  bestSpot: string;
  light: string;
  water: string;
}): GardenPlantProfile {
  return {
    plant_profile_id: `demo-profile-${input.slug}`,
    slug: input.slug,
    plant_taxon_id: `demo-taxon-${input.slug}`,
    plant_cultivar_id: null,
    display_name: input.displayName,
    plant_type_code: input.plantType,
    lifecycle_type: input.lifecycle,
    is_published: true,
    family_name: null,
    genus_name: input.botanicalName.split(" ")[0] ?? null,
    species_name: input.botanicalName.split(" ")[1] ?? null,
    botanical_name_full: input.botanicalName,
    primary_common_name: input.displayName,
    short_description: input.description,
    why_plant_it: input.description,
    primary_use_cases: input.primaryUseCases,
    notes_for_homestead: null,
    notes_for_small_garden: input.bestSpot,
    notes_for_container_growing: null,
    preferred_light: input.light,
    water_need_level: input.water,
    propagation_methods: [],
    drainage_requirement: "Well-drained soil",
    texture_preferences: {},
    preferred_soil_texture_codes: [],
    soil_texture_summary: "Loose, well-drained soil",
    primary_image_url: input.imageUrl,
    image_attribution: input.imageAttribution ?? "Garden photo",
    ratings: {}
  };
}

function chooseDemoProfiles(profiles: GardenPlantProfile[]) {
  const journalProfiles = profiles.filter((profile) => getJournalStylePlantImageUrl(profile.primary_image_url));
  const bySlug = new Map(journalProfiles.map((profile) => [profile.slug, profile]));
  const selected: GardenPlantProfile[] = [];

  for (const slug of preferredDemoSlugs) {
    const profile = bySlug.get(slug) ?? fallbackProfiles.find((fallback) => fallback.slug === slug);
    if (profile && !selected.some((item) => item.slug === profile.slug)) selected.push(profile);
  }

  if (selected.length >= 3) return selected;

  return selected.length >= 3 ? selected.slice(0, 3) : fallbackProfiles;
}

function isoWithOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function stamp(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function profileAt(profiles: GardenPlantProfile[], index: number) {
  return profiles[index] ?? fallbackProfiles[index % fallbackProfiles.length];
}

function plantInstance(
  profile: GardenPlantProfile,
  input: {
    id: string;
    zoneId: string;
    bedId: string;
    quantity: number;
    plantedOn: string | null;
    notes: string;
    status?: GardenPlantStatus;
  }
): GardenPlantInstance {
  return {
    id: input.id,
    property_id: "demo-property",
    zone_id: input.zoneId,
    bed_id: input.bedId,
    plant_profile_id: profile.plant_profile_id,
    plant_profile: profile,
    quantity: input.quantity,
    status: input.status ?? "growing",
    planted_on: input.plantedOn,
    notes: input.notes,
    created_at: stamp(25),
    updated_at: stamp(1)
  };
}

function task(input: {
  id: string;
  title: string;
  notes?: string;
  dueOffset: number | null;
  zoneId?: string | null;
  bedId?: string | null;
  plantId?: string | null;
  status?: "open" | "done";
}): GardenTask {
  return {
    id: input.id,
    property_id: "demo-property",
    zone_id: input.zoneId ?? null,
    bed_id: input.bedId ?? null,
    plant_instance_id: input.plantId ?? null,
    title: input.title,
    notes: input.notes ?? null,
    due_on: input.dueOffset === null ? null : isoWithOffset(input.dueOffset),
    status: input.status ?? "open",
    completed_at: input.status === "done" ? stamp(1) : null,
    created_at: stamp(10),
    updated_at: stamp(1)
  };
}

export function buildDemoGardenSnapshot(profiles: GardenPlantProfile[]): GardenSnapshot {
  const plantProfiles = chooseDemoProfiles(profiles);
  const calendula = profileAt(plantProfiles, 0);
  const cilantro = profileAt(plantProfiles, 1);
  const bellPepper = profileAt(plantProfiles, 2);

  const property: GardenProperty = {
    id: "demo-property",
    owner_user_id: "demo-user",
    name: "Backyard Garden",
    label: "Home garden",
    region: "Central Texas",
    growing_zone: "8b",
    season: "Summer",
    notes: "A compact garden with herbs, pollinator flowers, and a few food crops.",
    latitude: null,
    longitude: null,
    location_label: null,
    created_at: stamp(35),
    updated_at: stamp(1)
  };

  const zones: GardenZone[] = [
    {
      id: "demo-zone-kitchen",
      property_id: property.id,
      name: "Kitchen Garden",
      purpose: "Herbs and daily cooking plants",
      light: "Morning sun",
      water: "Hand watered",
      notes: "Closest to the house, so it gets looked at most often.",
      sort_order: 0,
      layout_x: 0.06,
      layout_y: 0.08,
      layout_w: 0.46,
      layout_h: 0.4,
      created_at: stamp(30),
      updated_at: stamp(1)
    },
    {
      id: "demo-zone-pollinator",
      property_id: property.id,
      name: "Pollinator Edge",
      purpose: "Flowers, perennial color, and beneficial insects",
      light: "Full sun",
      water: "Drip line",
      notes: "High heat in the afternoon, but excellent bloom visibility.",
      sort_order: 1,
      layout_x: 0.54,
      layout_y: 0.18,
      layout_w: 0.38,
      layout_h: 0.52,
      created_at: stamp(29),
      updated_at: stamp(1)
    }
  ];

  const beds: GardenBed[] = [
    {
      id: "demo-bed-herbs",
      property_id: property.id,
      zone_id: "demo-zone-kitchen",
      name: "Herb Bed",
      sun: "Morning sun",
      water: "Moderate",
      soil: "Compost-rich",
      notes: "Quick notes here prevent repeated over-watering.",
      sort_order: 0,
      layout_x: 0.1,
      layout_y: 0.18,
      layout_w: 0.32,
      layout_h: 0.28,
      created_at: stamp(26),
      updated_at: stamp(1)
    },
    {
      id: "demo-bed-pots",
      property_id: property.id,
      zone_id: "demo-zone-kitchen",
      name: "Container Row",
      sun: "Bright shade",
      water: "Frequent",
      soil: "Potting mix",
      notes: "Containers dry fast after warm nights.",
      sort_order: 1,
      layout_x: 0.5,
      layout_y: 0.2,
      layout_w: 0.38,
      layout_h: 0.24,
      created_at: stamp(26),
      updated_at: stamp(1)
    },
    {
      id: "demo-bed-border",
      property_id: property.id,
      zone_id: "demo-zone-pollinator",
      name: "Bloom Border",
      sun: "Full sun",
      water: "Low",
      soil: "Well drained",
      notes: "This place gets bloom and pollinator observations.",
      sort_order: 0,
      layout_x: 0.12,
      layout_y: 0.14,
      layout_w: 0.74,
      layout_h: 0.34,
      created_at: stamp(26),
      updated_at: stamp(1)
    }
  ];

  const plants = [
    plantInstance(calendula, {
      id: "demo-plant-calendula",
      zoneId: "demo-zone-pollinator",
      bedId: "demo-bed-border",
      quantity: 6,
      plantedOn: isoWithOffset(-33),
      notes: "Blooming hard after the last deep watering."
    }),
    plantInstance(cilantro, {
      id: "demo-plant-cilantro",
      zoneId: "demo-zone-kitchen",
      bedId: "demo-bed-herbs",
      quantity: 4,
      plantedOn: isoWithOffset(-21),
      notes: "Still tender in morning shade; watch for bolting after hot days."
    }),
    plantInstance(bellPepper, {
      id: "demo-plant-bell-pepper",
      zoneId: "demo-zone-kitchen",
      bedId: "demo-bed-pots",
      quantity: 1,
      plantedOn: isoWithOffset(-58),
      notes: "First blossoms held after the last deep watering."
    }),
    plantInstance(calendula, {
      id: "demo-plant-calendula-herb",
      zoneId: "demo-zone-kitchen",
      bedId: "demo-bed-herbs",
      quantity: 2,
      plantedOn: isoWithOffset(-21),
      notes: "A small companion planting near the herbs."
    })
  ];

  const observations: GardenObservation[] = [
    {
      id: "demo-observation-calendula",
      property_id: property.id,
      zone_id: "demo-zone-pollinator",
      bed_id: "demo-bed-border",
      plant_instance_id: "demo-plant-calendula",
      note: "First strong bloom after two hot days. Bees active before noon.",
      image_path: null,
      observed_at: stamp(1),
      created_at: stamp(1),
      updated_at: stamp(1)
    },
    {
      id: "demo-observation-bell-pepper",
      property_id: property.id,
      zone_id: "demo-zone-kitchen",
      bed_id: "demo-bed-pots",
      plant_instance_id: "demo-plant-bell-pepper",
      note: "First blossoms held after a deep watering.",
      image_path: null,
      observed_at: stamp(3),
      created_at: stamp(3),
      updated_at: stamp(3)
    }
  ];

  const tasks: GardenTask[] = [
    task({
      id: "demo-task-water",
      title: "Water deeply before the hot afternoon",
      notes: "Focus on the bell pepper container and newly planted herbs.",
      dueOffset: 0,
      zoneId: "demo-zone-kitchen",
      bedId: "demo-bed-pots",
      plantId: "demo-plant-bell-pepper"
    }),
    task({
      id: "demo-task-cilantro",
      title: "Harvest dill before afternoon heat",
      notes: "Cut stems before the next hot stretch pushes the plant toward seed heads.",
      dueOffset: 2,
      zoneId: "demo-zone-kitchen",
      bedId: "demo-bed-herbs",
      plantId: "demo-plant-cilantro"
    }),
    task({
      id: "demo-task-calendula",
      title: "Note bloom duration",
      notes: "Notice how long this flush lasts before deadheading.",
      dueOffset: 4,
      zoneId: "demo-zone-pollinator",
      bedId: "demo-bed-border",
      plantId: "demo-plant-calendula"
    }),
    task({
      id: "demo-task-mulch",
      title: "Refresh mulch on exposed soil",
      notes: "Keep roots cooler and hold soil moisture through the next hot stretch.",
      dueOffset: 7,
      zoneId: "demo-zone-kitchen",
      bedId: "demo-bed-herbs"
    }),
    task({
      id: "demo-task-herbs",
      title: "Check the herb bed after afternoon heat",
      notes: "Add a note if leaves are still wilting by evening.",
      dueOffset: 5,
      zoneId: "demo-zone-kitchen",
      bedId: "demo-bed-herbs",
      plantId: "demo-plant-calendula-herb"
    })
  ];

  return {
    plantProfiles,
    properties: [property],
    zones,
    beds,
    plants,
    observations,
    tasks,
    outcomes: [],
    wishlist: []
  };
}
