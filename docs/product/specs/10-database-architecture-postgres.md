# Database Architecture and PostgreSQL Schema

## Document Status and Scope

- Status: canonical Module 10 schema specification.
- Effective date: March 9, 2026.
- Scope: complete relational model, FK topology, indexing/RLS strategy, and implementation-ready PostgreSQL DDL.
- Non-goals: application code, migration runner config, infrastructure provisioning.

Primary DDL source of truth:
- [`sql/10-garden-postgres-ddl.sql`](sql/10-garden-postgres-ddl.sql)

## Design Locks and Risk Fixes Applied

This schema explicitly implements the high-risk fixes identified in prior planning:

1. Species facts are separated from environment behavior.
- `catalog.plant_taxa`, `catalog.plant_profiles` store stable identity and user-facing profile data.
- `catalog.plant_zone_profiles`, `catalog.phenology_templates`, `catalog.phenology_events` store region/season behavior.

2. Cultivar differences are first-class and overrideable.
- `catalog.plant_cultivars` for cultivar identity.
- `catalog.plant_cultivar_overrides` for scoped trait/climate/yield/phenology overrides.

3. Lifecycle is modeled as phenology + management events, not fixed date blobs.
- `catalog.lifecycle_stage_types`
- `catalog.phenology_templates`
- `catalog.phenology_events`
- `catalog.plant_care_events`

4. Water is modeled in layered form (trait + establishment + seasonal).
- `catalog.plant_water_profiles`
- `catalog.plant_water_establishment_profiles`
- `catalog.plant_water_seasonal_profiles`

5. Evidence/provenance is claim-level, not implied.
- `catalog.plant_sources`
- `catalog.plant_claims`
- evidence strength, review status, confidence, conflict flags, region/cultivar scope.

6. Boolean overload is reduced via normalized tags and scored fields.
- use/relationship/safety/tolerance tables and reference codes.
- confidence and evidence fields where claims vary by source quality.

7. Property-scoped multi-tenant security is built into the schema.
- `core.property_memberships` as authorization anchor.
- RLS policies on private operational tables.

## Schema Boundaries

Schemas used:

- `core`: private operational data (properties, zones, beds, plant instances, tasks, observations, harvest, weather, memberships).
- `catalog`: global plant knowledge and phenology model.
- `community`: public contributions, comments, ratings, shared templates, data flags.
- `ai`: generation, diagnosis, recommendation logs, embeddings.
- `audit`: append-only audit/event trails.
- `ops`: notifications, reports, job/webhook/cron operational tables.
- `reporting`: read-oriented reporting views.

## Conventions and Contracts

Global table conventions (applied broadly):
- `id uuid primary key default gen_random_uuid()`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()` (mutable tables)
- `version int not null default 1` for optimistic concurrency and change tracking
- soft-delete columns (`deleted_at`) where history matters

Platform features used:
- extensions: `pgcrypto`, `vector`
- JSONB for variable payloads only (templates, AI payloads, map/editor payloads, metadata)
- generated search document + GIN index for catalog full-text search
- partial indexes for hot operational paths (open tasks)
- RLS policy enforcement for private property-scoped data

## Cardinality and Foreign-Key Map

The DDL file is the exact FK source of truth. The following is the explicit cardinality summary.

### Core tenancy and space model

- `core.accounts (1) -> (N) core.users` via `core.users.account_id`
- `core.accounts (1) -> (N) core.properties` via `core.properties.account_id`
- `core.properties (1) -> (N) core.property_memberships` via `core.property_memberships.property_id`
- `core.users (1) -> (N) core.property_memberships` via `core.property_memberships.user_id`
- `core.properties (1) -> (N) core.property_invitations` via `core.property_invitations.property_id`
- `core.properties (1) -> (N) core.zones` via `core.zones.property_id`
- `core.zones (1) -> (N) core.beds` via `core.beds.zone_id`
- `core.properties (1) -> (N) core.beds` via `core.beds.property_id`

### Catalog identity and profile model

- `catalog.plant_taxa (1) -> (N) catalog.plant_names` via `catalog.plant_names.plant_taxon_id`
- `catalog.plant_taxa (1) -> (N) catalog.plant_cultivars` via `catalog.plant_cultivars.plant_taxon_id`
- `catalog.plant_taxa (1) -> (N) catalog.plant_profiles` via `catalog.plant_profiles.plant_taxon_id`
- `catalog.plant_cultivars (1) -> (N) catalog.plant_profiles` via `catalog.plant_profiles.plant_cultivar_id`
- `catalog.plant_profiles (1) -> (N) catalog.plant_profile_aesthetic_styles`
- `catalog.plant_profiles (1) -> (N) catalog.plant_profile_uses`
- `catalog.plant_profiles (1) -> (1) catalog.plant_climate_profiles`
- `catalog.plant_profiles (1) -> (1) catalog.plant_growth_profiles`
- `catalog.plant_profiles (1) -> (1) catalog.plant_propagation_profiles`
- `catalog.plant_profiles (1) -> (N) catalog.plant_propagation_methods`
- `catalog.plant_profiles (1) -> (1) catalog.plant_flowering_profiles`
- `catalog.plant_profiles (1) -> (1) catalog.plant_fruiting_profiles`
- `catalog.plant_profiles (1) -> (1) catalog.plant_soil_profiles`
- `catalog.plant_profiles (1) -> (N) catalog.plant_soil_texture_preferences`
- `catalog.plant_profiles (1) -> (1) catalog.plant_water_profiles`
- `catalog.plant_profiles (1) -> (N) catalog.plant_water_establishment_profiles`
- `catalog.plant_profiles (1) -> (N) catalog.plant_water_seasonal_profiles`
- `catalog.plant_profiles (1) -> (1) catalog.plant_ecology_profiles`
- `catalog.plant_profiles (1) -> (1) catalog.plant_maintenance_profiles`
- `catalog.plant_profiles (1) -> (N) catalog.plant_safety_profiles`
- `catalog.plant_profiles (1) -> (N) catalog.plant_relationships` (self-relationship graph)
- `catalog.plant_profiles (1) -> (N) catalog.phenology_templates`
- `catalog.phenology_templates (1) -> (N) catalog.phenology_events`
- `catalog.plant_profiles (1) -> (N) catalog.plant_zone_profiles`
- `catalog.plant_profiles (1) -> (N) catalog.plant_care_events`
- `catalog.plant_cultivars (1) -> (N) catalog.plant_cultivar_overrides`
- `catalog.plant_profiles (1) -> (N) catalog.plant_claims`
- `catalog.plant_profiles (1) -> (N) catalog.plant_images`
- `catalog.plant_sources (1) -> (N) catalog.plant_claims`
- `catalog.plant_sources (1) -> (N) catalog.plant_images`

### Property-side plant operations

- `core.properties (1) -> (N) core.plant_instances`
- `core.zones (1) -> (N) core.plant_instances`
- `core.beds (1) -> (N) core.plant_instances`
- `catalog.plant_profiles (1) -> (N) core.plant_instances`
- `catalog.plant_cultivars (1) -> (N) core.plant_instances`
- `core.plant_instances (1) -> (N) core.plant_instance_stage_history`
- `core.plant_instances (1) -> (N) core.plant_instance_seasons`
- `core.users (1) -> (N) core.user_plant_wishlist`
- `catalog.plant_profiles (1) -> (N) core.user_plant_wishlist`

### Task and execution model

- `core.properties (1) -> (N) core.tasks`
- `core.zones (1) -> (N) core.tasks` (optional scoped)
- `core.beds (1) -> (N) core.tasks` (optional scoped)
- `core.plant_instances (1) -> (N) core.tasks` (optional scoped)
- `core.users (1) -> (N) core.tasks` via `assigned_user_id`
- `core.tasks (1) -> (N) core.weather_adjustment_proposals`
- `core.properties (1) -> (N) core.recurring_task_templates`
- `catalog.plant_profiles (1) -> (N) core.recurring_task_templates`

### Observations, media, health, harvest

- `core.properties (1) -> (N) core.observations`
- `core.plant_instances (1) -> (N) core.observations`
- `core.observations (1) -> (N) core.media_assets` (optional)
- `core.plant_instances (1) -> (N) core.media_assets` (optional)
- `core.plant_instances (1) -> (N) core.plant_health_issues`
- `core.observations (1) -> (N) core.plant_health_issues` (optional)
- `core.properties (1) -> (N) core.harvest_events`
- `core.plant_instances (1) -> (N) core.harvest_events` (optional)

### Community

- `community.shared_templates (1) -> (N) community.template_ratings`
- `catalog.plant_profiles (1) -> (N) community.plant_comments`
- `catalog.plant_profiles (1) -> (N) community.plant_ratings`
- `catalog.plant_profiles (1) -> (N) community.plant_photo_submissions`
- `core.media_assets (1) -> (N) community.plant_photo_submissions`
- `catalog.plant_profiles (1) -> (N) community.plant_data_flags`

### AI, audit, and ops

- `ai.generation_jobs (1) -> (N) ai.generated_plant_payloads`
- `core.plant_instances (1) -> (N) ai.diagnosis_runs`
- `core.tasks (1) -> (N) ai.diagnosis_runs` (optional created task)
- `core.properties (1) -> (N) ai.recommendation_logs`
- `core.tasks (1) -> (N) audit.task_events`
- `core.properties (1) -> (N) audit.entity_events`
- `core.properties (1) -> (N) audit.collaboration_events`
- `core.properties (1) -> (N) ops.generated_reports`
- `core.users (1) -> (N) ops.notifications`

## Plant Field Coverage Checklist

The schema covers all requested plant-data buckets and missing-field additions:

- Taxonomy/identity: `plant_taxa`, `plant_names`, `plant_cultivars`, `plant_profiles`.
- Summary/positioning: `plant_profiles` narrative and fit fields.
- Functional uses with evidence strength: `plant_profile_uses` + `evidence_strength_levels`.
- Climate/tolerance: `plant_climate_profiles`.
- Size/habit/root/spread/support: `plant_growth_profiles`.
- Reproduction/propagation: `plant_propagation_profiles`, `plant_propagation_methods`.
- Flowering/fruiting/yield: `plant_flowering_profiles`, `plant_fruiting_profiles`.
- Soil/chemistry: `plant_soil_profiles`, `plant_soil_texture_preferences`.
- Water layered model: `plant_water_profiles`, `plant_water_establishment_profiles`, `plant_water_seasonal_profiles`.
- Safety/toxicity by subject: `plant_safety_profiles`, `safety_subject_types`, `safety_levels`.
- Plant relationships: `plant_relationships`, `relationship_types`.
- Phenology + management calendar: `lifecycle_stage_types`, `phenology_templates`, `phenology_events`, `plant_care_events`.
- Zone-specific behavior: `plant_zone_profiles`.
- Claim-level provenance/confidence/review: `plant_sources`, `plant_claims`.
- Cultivar-specific overrides: `plant_cultivar_overrides`.
- Image/media knowledge assets: `plant_images`.

## Indexing and Performance Notes

Implemented in DDL:
- hot-path indexes for hierarchy and task execution queries.
- partial index for open tasks (`suggested`, `scheduled`).
- GIN full-text index on `catalog.plant_profiles.search_document`.
- uniqueness and scope indexes for zone/cultivar/seasonal profiles.

Planned after production load is known:
- partitioning for high-volume time-series (`core.tasks`, `audit.entity_events`, `core.weather_daily`, `core.harvest_events`).
- materialized views for heavy reporting surfaces.

## Security Model

Private operational tables in `core` use RLS.

Policy model:
- membership-driven access via `core.property_memberships`.
- helper functions:
  - `core.current_user_id()`
  - `core.current_account_id()`
  - `core.user_has_property_access()`
  - `core.user_has_property_role()`
- role-scoped writes:
  - owner/manager for structure-level edits
  - contributor included for operational logging surfaces

Important operational rule:
- DB roles with `BYPASSRLS` must be tightly restricted.

## Implementation Order

Recommended migration phases:

1. Foundations
- schemas, extensions, utility functions, reference tables.

2. Core private model
- accounts/users/properties/memberships/zones/beds/plant instances.

3. Catalog intelligence model
- taxa/cultivars/profiles + trait tables + phenology + claims/sources.

4. Operations model
- tasks/observations/media/harvest/weather.

5. Community + AI + ops/audit
- sharing, ratings/comments, generation/diagnosis logs, notification/reporting queues.

## Canonical Artifacts

- Full DDL: [`sql/10-garden-postgres-ddl.sql`](sql/10-garden-postgres-ddl.sql)
- System context predecessor: [`09-system-architecture-overview.md`](09-system-architecture-overview.md)
