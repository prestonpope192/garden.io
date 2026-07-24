export type GardenProperty = {
  id: string;
  owner_user_id: string;
  name: string;
  label: string;
  region: string | null;
  growing_zone: string | null;
  season: string | null;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  location_label: string | null;
  created_at: string;
  updated_at: string;
};

export type GardenLayout = {
  layout_x?: number | null;
  layout_y?: number | null;
  layout_w?: number | null;
  layout_h?: number | null;
};

export type GardenZone = {
  id: string;
  property_id: string;
  name: string;
  purpose: string | null;
  light: string | null;
  water: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
} & GardenLayout;

export type GardenBed = {
  id: string;
  property_id: string;
  zone_id: string;
  name: string;
  sun: string | null;
  water: string | null;
  soil: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
} & GardenLayout;

export type GardenPlantStatus = "growing" | "wishlist" | "archived";

export type GardenPlantRequirementValue = string | number | boolean | null | GardenPlantRequirementValue[] | {
  [key: string]: GardenPlantRequirementValue;
};

export type GardenPlantGrowingRequirements = {
  sun?: Record<string, GardenPlantRequirementValue>;
  water?: Record<string, GardenPlantRequirementValue>;
  soil?: Record<string, GardenPlantRequirementValue>;
  habit?: Record<string, GardenPlantRequirementValue>;
  [key: string]: GardenPlantRequirementValue | undefined;
};

export type GardenPlantCultivarOverride = {
  field_key: string;
  override_scope: string;
  override_value: GardenPlantRequirementValue;
  evidence_strength_code: string | null;
  source_notes: string | null;
};

export type GardenPlantProfile = {
  plant_profile_id: string;
  slug: string;
  plant_taxon_id: string;
  plant_cultivar_id: string | null;
  display_name: string;
  plant_type_code: string;
  lifecycle_type: string;
  generation_status?: string;
  is_published?: boolean;
  review_status?: string;
  confidence_score?: string | number | null;
  evidence_count?: number | null;
  source_count?: number | null;
  human_verified?: boolean;
  family_name?: string | null;
  genus_name?: string | null;
  species_name?: string | null;
  botanical_name_full: string | null;
  primary_common_name: string | null;
  short_description: string | null;
  why_plant_it: string | null;
  pros_summary?: string | null;
  cons_summary?: string | null;
  primary_use_cases: string | null;
  notes_for_homestead?: string | null;
  notes_for_small_garden?: string | null;
  notes_for_container_growing?: string | null;
  preferred_light: string | null;
  mature_height_min_in?: string | number | null;
  mature_height_max_in?: string | number | null;
  mature_width_min_in?: string | number | null;
  mature_width_max_in?: string | number | null;
  growth_rate_code?: string | null;
  growth_habit?: string | null;
  days_to_maturity_min?: number | null;
  days_to_maturity_max?: number | null;
  maturity_basis?: string | null;
  planting_window_label?: string | null;
  harvest_window_label?: string | null;
  perennial_first_harvest_label?: string | null;
  water_need_level: string | null;
  frost_tender?: boolean | null;
  propagation_methods: Record<string, GardenPlantRequirementValue>[];
  drainage_requirement: string | null;
  fertility_need?: string | null;
  texture_preferences: Record<string, GardenPlantRequirementValue>;
  preferred_soil_texture_codes: string[];
  soil_texture_summary: string | null;
  primary_image_url: string | null;
  image_attribution?: string | null;
  ratings: Record<string, GardenPlantRequirementValue>;
  cultivar_name?: string | null;
  market_name?: string | null;
  cultivar_description?: string | null;
  cultivar_overrides?: GardenPlantCultivarOverride[];
};

export type GardenPlantInstance = {
  id: string;
  property_id: string;
  zone_id: string;
  bed_id: string;
  plant_profile_id: string;
  plant_profile: GardenPlantProfile | null;
  quantity: number;
  status: GardenPlantStatus;
  planted_on: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GardenObservation = {
  id: string;
  property_id: string;
  zone_id: string | null;
  bed_id: string | null;
  plant_instance_id: string | null;
  note: string;
  image_path: string | null;
  observed_at: string;
  created_at: string;
  updated_at: string;
};

export type GardenTaskStatus = "open" | "done";

export type GardenTask = {
  id: string;
  property_id: string;
  zone_id: string | null;
  bed_id: string | null;
  plant_instance_id: string | null;
  title: string;
  notes: string | null;
  due_on: string | null;
  status: GardenTaskStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GardenPlantOutcomeResult = "success" | "partial" | "failure";

export type GardenPlantOutcome = {
  id: string;
  property_id: string;
  plant_instance_id: string;
  result: GardenPlantOutcomeResult | null;
  harvest_quantity: number | null;
  harvest_unit: string | null;
  quality_rating: number | null;
  harvested_on: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GardenWishlistItem = {
  id: string;
  owner_user_id: string;
  plant_profile_id: string;
  plant_profile: GardenPlantProfile | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GardenSnapshot = {
  plantProfiles: GardenPlantProfile[];
  properties: GardenProperty[];
  zones: GardenZone[];
  beds: GardenBed[];
  plants: GardenPlantInstance[];
  observations: GardenObservation[];
  tasks: GardenTask[];
  outcomes: GardenPlantOutcome[];
  wishlist: GardenWishlistItem[];
};
