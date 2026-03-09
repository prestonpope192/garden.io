# System Architecture Overview

## Document Status and Scope

- Status: canonical Module 09 architecture blueprint.
- Effective date: March 9, 2026.
- Purpose: connect Modules 01-08 into a coherent product system.
- Scope: conceptual architecture, service boundaries, major data flows, and integration contracts.
- Non-goal: low-level engineering details (full schema, table DDL, infra code, index tuning specifics).

Reference sources:
- Cornell Small Farms Program crop planning: https://smallfarms.cornell.edu/resources/crop-planning/
- FAO crop planning tools: https://www.fao.org/land-water/databases-and-software/crop-planning
- USDA Plant Hardiness Zones: https://planthardiness.ars.usda.gov

## Architecture North Star

Garden.io is a knowledge + planning system built on three axes:
- space
- time
- knowledge

System design rule:
- every core behavior should be expressible as a combination of spatial context, temporal context, and knowledge context.

## Core Conceptual Model (Spatial Foundation)

The property hierarchy is the anchor model:

```txt
Property
  -> Zone
     -> Bed
        -> Plant Instance
           -> Tasks
           -> Observations
           -> Harvest Logs
           -> Photos
```

Architecture principle:
- all operational and intelligence signals attach to this hierarchy.

## Layered System Model

Layer 1: Spatial layer
- modules: My Property, My Plants
- entities: Property, Zone, Bed, Plant Instance

Layer 2: Temporal layer
- modules: Calendar, Task System
- entities: Task, Event, Lifecycle Stage, Weather Signal, Time Window

Layer 3: Knowledge layer
- modules: Plant Catalogue, AI Suggestion System, Community
- entities: Plant Species, Requirements, Companion Graph, Lifecycle Template, Community Signals

Layer coupling rule:
- spatial is source of place truth
- temporal is source of execution truth
- knowledge is source of recommendation truth

## Core Data Domains

Domain 1: Property domain
- entities: Property, Zone, Bed
- ownership: structure and location context

Domain 2: Plant instance domain
- entities: PlantInstance, Quantity, Stage, LocationRef
- relationship: references Plant Catalogue entities

Domain 3: Plant catalogue domain
- entities: PlantSpecies, Requirements, CompanionRules, LifecycleTemplates
- role: global knowledge base

Domain 4: Task domain
- entities: Task, TaskSource, TaskState, TaskAssignment, TaskWindow
- role: operational execution and history

Domain 5: Observation domain
- entities: Note, Photo, IssueReport, Observation
- role: learning and diagnosis input

Domain 6: Community domain
- entities: Comment, Rating, SharedTemplate, CommunityPhoto
- role: crowdsourced signal layer

Domain boundary rule:
- catalogue/community are global.
- property/plant-instance/task/observation are property-scoped private data.

## Service Topology

Service map:
- Property Service
- Plant Instance Service
- Catalogue Service
- Task Engine
- AI Engine
- Community Service
- WeatherIQ Service

Responsibilities:

Property Service
- property creation and settings
- zone/bed structure management
- collaborator membership scope hooks

Plant Instance Service
- plant instance lifecycle state
- placement and movement
- plant-level event capture

Catalogue Service
- search and plant page delivery
- generated entry creation and enrichment
- taxonomy and companion links

Task Engine
- task generation
- scheduling windows
- assignment state and history

AI Engine
- contextual suggestions
- diagnosis interpretation
- AI-to-task conversion logic

Community Service
- comments, ratings, and media contributions
- shared/community template publication

WeatherIQ Service
- weather ingest and normalization
- signal emission for task and AI layers

## Module-to-Service Mapping

Module mappings:
- My Property -> Property Service, Plant Instance Service, Task Engine, AI Engine
- Calendar -> Task Engine, WeatherIQ Service, AI Engine
- My Plants -> Plant Instance Service, Catalogue Service, Task Engine
- Plant Catalogue -> Catalogue Service, Community Service, AI Engine
- Task System -> Task Engine, WeatherIQ Service, AI Engine
- AI Suggestion System -> AI Engine, Catalogue Service, Task Engine, WeatherIQ Service
- User Management & Shared Access -> Property Service, Task Engine, Community Service

Integration rule:
- UI modules orchestrate state views; services own domain logic.

## Event and Signal Backbone (Conceptual)

System-level event pattern:
- domain actions emit events
- dependent services subscribe and derive downstream updates

Core event examples:
- plant.instance.created
- plant.stage.updated
- weather.signal.generated
- observation.logged
- task.completed
- suggestion.feedback.recorded

Benefits:
- decouples generation pipelines
- supports near-real-time updates across modules

## Task Generation Pipeline

Primary pipeline:

```txt
Plant lifecycle stage change
  -> Lifecycle evaluation
  -> Task candidate generation
  -> Task window + priority assignment
  -> Task persistence
  -> Calendar and My Property task surfaces refresh
```

Example:
- tomato enters flowering stage
- generated tasks: prune suckers, inspect pests

Additional inputs:
- templates
- weather signals
- manual user tasks
- accepted AI suggestions

## AI Suggestion Pipeline

Input context:
- property profile
- zone and bed environment
- plant species and stage
- weather signals
- historical outcomes
- community trend signals

Pipeline:

```txt
Context assembly
  + Knowledge retrieval
  + Signal ranking
  -> AI inference
  -> Suggestions/insights/warnings/opportunities
  -> Optional task conversion
```

Output surfaces:
- hierarchy recommendation panels
- Calendar insights
- AI widget responses

## Plant Catalogue Population Workflow

Found entry path:

```txt
User search -> existing plant found -> plant page
```

Missing entry path:

```txt
User search -> no match
  -> generate entry request
  -> AI research + extraction
  -> catalogue entry creation
  -> mark origin as community/AI generated
  -> publish with refinement pathways
```

Quality rule:
- generated entries remain clearly labeled and improvable through community/editorial feedback loops.

## Plant Instance Creation Flow (Knowledge to Action)

Operational flow:

```txt
User selects catalogue plant
  -> create plant instance in bed
  -> attach lifecycle template
  -> seed task candidates
  -> update Calendar and My Property contexts
```

Key system moment:
- this is where knowledge-layer data becomes temporal execution.

## Calendar Aggregation Data Flow

Calendar inputs:
- Task Engine tasks
- WeatherIQ signals
- seasonal lifecycle events
- manual tasks
- AI-derived opportunities

Aggregation flow:

```txt
Task + signal aggregation
  -> timeline normalization
  -> filter indexing (zone/bed/plant/type/assignment)
  -> weekly/monthly render
```

## Observation Learning Loop

Feedback loop:

```txt
User note/photo/issue
  -> AI interpretation/diagnosis
  -> suggested action/task
  -> user outcome log
  -> signal captured for future recommendation quality
```

Learning rule:
- outcomes should inform future suggestions without overriding local user control.

## Weather Integration Flow

Weather pipeline:

```txt
Weather provider feed
  -> WeatherIQ normalization
  -> weather signals
  -> task adjustment proposals + AI insights + calendar markers
```

Examples:
- rain forecast -> propose watering suppression
- cold snap -> frost protection warnings

## Community Signal Integration

Community signals:
- ratings
- comments
- regional success anecdotes
- template usage patterns

Pipeline:

```txt
Community inputs
  -> moderation and quality checks
  -> regional aggregation
  -> recommendation weighting inputs
```

Safety rule:
- community signals are advisory and should not silently overwrite authoritative guidance.

## Data Relationship Blueprint

High-level relationships:

```txt
PlantCatalogueEntry
  <- referenced by - PlantInstance
PlantInstance
  -> Task
  -> Observation
  -> HarvestLog
  -> Photo
PlantInstance
  -> Bed -> Zone -> Property
Property
  -> Membership/Role
```

Cardinality intent:
- one catalogue entry can map to many plant instances.
- one property can host many collaborators with role-scoped membership.

## Public vs Private Data Boundaries

Public data:
- catalogue pages
- community comments and ratings
- community templates (published)

Private data:
- property hierarchy and structure
- plant instances
- tasks and assignments
- notes, observations, and issue histories
- property activity feed

Boundary rule:
- enforce strict separation between public knowledge and private operational records.

## Access Control Architecture

Authorization model:
- property-scoped membership and role-based permissions.

Checks required for private mutations:
- membership exists for property
- role permits action
- source context belongs to selected property

Traceability:
- permission-sensitive actions should emit auditable activity events.

## Scalability and Performance Considerations

Design targets:
- large catalogue volumes
- high community signal throughput
- many concurrent properties and collaborators

Architecture strategies:
- separate global catalogue domain from property-scoped domains
- cache high-traffic catalogue pages and search results
- use event-driven propagation for task and suggestion updates
- precompute common calendar aggregations for responsiveness

## AI Architecture Considerations

AI capability families:
- knowledge generation
- image diagnosis
- contextual recommendation ranking

Suggested pattern:
- retrieval-augmented generation using:
  - catalogue knowledge
  - validated domain references
  - scoped community trends
  - property-local history

Governance principles:
- show rationale/confidence
- require user confirmation for impactful actions
- preserve override paths

## Client Architecture (Mobile and Desktop)

Backend parity:
- mobile and desktop share the same services and domain model.

Client differences:
- mobile emphasizes compact flows and slide panels.
- desktop emphasizes multi-pane visibility and parallel context.

Consistency rule:
- UI differences should not alter core business rules or data semantics.

## Future Expansion Paths

Planned extensibility points:
- sensor integration
- soil monitoring inputs
- advanced yield forecasting
- farm economics overlays
- supply/inventory tracking

Extension principle:
- new domains should attach to existing space/time/knowledge anchors rather than creating parallel disconnected models.

## Functional Requirements

FR-01 Architecture must center all operational data on property hierarchy context.
FR-02 Space/time/knowledge layers must have clear responsibilities and integration paths.
FR-03 Domain boundaries must separate global and property-scoped data.
FR-04 Service topology must map cleanly to module responsibilities.
FR-05 Task generation pipeline must connect lifecycle and execution surfaces.
FR-06 AI pipeline must consume contextual and knowledge signals and produce actionable outputs.
FR-07 Catalogue population workflow must support missing-entry generation and provenance labels.
FR-08 Plant instance creation must trigger lifecycle and task linkage.
FR-09 Calendar must aggregate tasks and signals from multiple sources coherently.
FR-10 Observation loop must feed future recommendation quality signals.
FR-11 Weather integration must emit reusable task and insight signals.
FR-12 Community data integration must support regional recommendation enrichment.
FR-13 Public/private boundaries must remain explicit and enforced.
FR-14 Access control must be property-scoped and role-aware.
FR-15 Architecture should support mobile/desktop parity with presentation-only differences.
FR-16 Architecture should remain extensible for future domains without redesigning core anchors.

## Non-Functional Requirements

Security:
- property data isolation and role-based authorization across all mutating endpoints.

Reliability:
- resilient event propagation between services for task and suggestion freshness.

Performance:
- responsive calendar and catalogue experience under expected growth.

Maintainability:
- bounded contexts and clear ownership to limit cross-domain coupling.

## Acceptance Criteria and Validation Scenarios

1. Layer coherence test  
Given any feature flow, when mapped to architecture, then it resolves through space/time/knowledge layers without ambiguity.

2. Domain boundary test  
Given data entity review, when categorized, then each entity maps to a single primary domain owner.

3. Service responsibility test  
Given major user actions, when traced, then service ownership is explicit and non-overlapping.

4. Task pipeline test  
Given lifecycle stage change, when processed, then downstream tasks appear in Calendar and My Property contexts.

5. AI pipeline test  
Given contextual inputs and signals, when AI inference runs, then outputs appear in defined surfaces with context.

6. Catalogue generation test  
Given missing plant search, when generation is approved, then entry is created with provenance labels.

7. Plant instance activation test  
Given add-plant flow completion, when instance is created, then lifecycle and task linkage are attached.

8. Calendar aggregation test  
Given mixed tasks and signals, when calendar is rendered, then data appears in coherent temporal views with filters.

9. Privacy boundary test  
Given public and private endpoints, when accessed, then private property records are not exposed publicly.

10. Access control test  
Given role variations, when performing protected actions, then authorization enforces property-scoped permissions.

11. Scalability readiness test  
Given projected growth assumptions, when reviewing architecture, then separation and caching strategies address bottlenecks.

12. Extensibility test  
Given future domain proposal (for example sensors), when integrated conceptually, then it can attach without breaking core anchors.

## Recommended Next Step

Implement migration sequencing and deployment controls from Module 10:
- migration versioning and rollout order
- backfill strategy for derived fields and search documents
- seed-data management for reference/lookup tables
- environment-level RLS validation and policy tests

Canonical database architecture:
- [10-database-architecture-postgres.md](10-database-architecture-postgres.md)
- [sql/10-garden-postgres-ddl.sql](sql/10-garden-postgres-ddl.sql)

## Open Questions Deferred to Module 11 (Data Migrations and Operations)

- how to run zero-downtime schema changes as volume grows
- how to manage partition rollout and retention policies by table
- how to validate RLS behavior in CI/CD and staging promotion gates
- how to monitor query plans and index health post-launch
