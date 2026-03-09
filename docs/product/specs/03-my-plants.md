# My Plants Module Spec

## Document Status and Scope

- Status: canonical Module 03 product specification.
- Effective date: March 9, 2026.
- Module role: plant-identity control center and plant-memory surface.
- Audience alignment: North America-first, multi-bed growers and homesteaders managing real seasonal complexity.
- Scope: product behavior, interface contracts, UX flows, and acceptance criteria.
- Out of scope in this document: backend schema, indexing strategy internals, and third-party integration implementation details.

## Module North Star and Relationship to Other Core Modules

`My Plants` is the plant-centric mirror of the other core modules:

| Module | Primary Lens | Secondary Lens |
| --- | --- | --- |
| My Property | Space | Time |
| Calendar | Time | Space |
| My Plants | Plant Identity | Space + Time |

North-star statement:
- users should be able to answer "what am I growing, what do I want to grow, and what worked here before" in one place.

Core outcomes:
- cross-property visibility of live plants
- simple intent capture for future plants
- historical performance memory for repeat decisions
- fast jump from plant identity to spatial context

## IA Contract and Navigation Placement

Global IA rule:
- `My Plants` is a primary navigation item.
- side placement can be responsive and layout-dependent, but primary-nav status is fixed.

Module role in navigation:
- do not replace spatial browsing in `My Property`.
- do not replace temporal planning in `Calendar`.
- provide plant-first entry and return paths into both modules.

## Core Tab Contract and Plant Relationship Lifecycle

Core tabs:

```txt
PlantLibraryTab = growing | wishlist | archived
```

Lifecycle intent:
- `growing`: plants currently active on property.
- `wishlist`: plants user intends to try later.
- `archived`: plants grown previously.

State-transition rules:
- wishlist -> growing occurs through Add Plant flow into a selected bed.
- growing -> archived occurs through archive or end-of-cycle actions.
- archived items are not deleted memory; they remain searchable.

## Shared State and Interface Contracts

Primary UI contracts:

```txt
PlantLibraryView = grid | list
MyPlantsDrawerModeCore = info | actions | filters
MyPlantsDrawerMode = MyPlantsDrawerModeCore | extension_mode
```

Spatial filter path contract:

```txt
SpatialFilterPath {
  zone_id?,
  bed_id?
}
```

Plant context contract:

```txt
PlantLibraryContext {
  property_id,
  tab,
  view,
  search_query?,
  spatial_filter_path?,
  drawer_mode
}
```

Plant record contract:

```txt
PlantRecordRef {
  plant_instance_id,
  catalogue_plant_id?,
  property_id,
  zone_id?,
  bed_id?
}
```

## Workspace Layout Contract (Left Hierarchy Rail, Main Plant Canvas, Right Drawer)

Desktop workspace regions:

1. Left hierarchy rail
- compact spatial filters and context anchors (zone and bed path).
- optimized for "where are these plants?" narrowing, not deep structural editing.

2. Main plant canvas
- tabbed plant library views with search and filters.
- plant cards shown in grid or list mode.

3. Right drawer
- mode-based utility area for info, actions, and filters.
- can also show quick preview when a plant card is selected.

Layout rule:
- preview behavior should not require route changes.

## Header and Global Controls

Header elements:
- module title
- quick search input
- tab switch (`Growing`, `Wishlist`, `Archived`)
- view toggle (`grid`, `list`)

Search should be instant-feedback and non-blocking for normal list sizes.

## Growing Tab Specification

Purpose:
- show all currently active plant records across the property.

Inclusion behavior:
- same species may appear multiple times if present in multiple beds.
- default display is plant-instance level, not species aggregation.

Example entries:
- Cherokee Purple Tomato, 6 plants, South Barn Bed
- Blueberry, 3 plants, Berry Bed
- Peach Tree, 1 plant, Orchard

Optional helper toggle:
- `Group by species` may be introduced later but is not required for v1.

## Plant Card Contract

Growing card fields:
- plant illustration
- plant name
- quantity
- location (`Bed -> Zone`)
- lifecycle stage
- next key task
- subtle status indicators

Example:
- Cherokee Purple Tomato
- 6 plants
- South Barn Bed -> South Barn Area
- Stage: Flowering
- Next: Prune suckers

Status indicator contract:

```txt
PlantStatusIndicator = task_due | issue_reported | harvest_window | dormant_stage
```

Indicator design rule:
- indicators must stay minimal and readable, not badge-heavy.

## Plant Card Interaction and Quick Actions

Primary click behavior:
- clicking a growing card opens the plant record in `My Property` at exact spatial context.

Quick actions:
- open plant
- log observation
- add note
- upload photo

Interaction rule:
- quick actions must execute without losing tab, search, and filter state in `My Plants`.

## Search and Filtering System

Search fields:
- plant name
- cultivar
- bed
- zone

Example queries:
- tomato
- peach
- orchard
- berry bed

Spatial filters:
- zone
- bed

Plant filters:
- plant type
- lifecycle stage
- companion type
- perennial vs annual

Task filters:
- plants needing attention (for example due this week, overdue, issue flagged)

Filter behavior rules:
- chip-based, immediate feedback
- active filter visibility always on
- search + filters compose predictably

## Plant Status and Time Awareness

Even as a plant-identity module, cards must show time-aware context:
- season stage
- next harvest window
- upcoming tasks

Example:
- Strawberry
- Harvest window: 7-10 days

Time-awareness rule:
- time indicators use calendar-derived windows but remain readable in plant-centric language.

## Wishlist Tab Specification

Purpose:
- capture and refine future planting intent.

Entry sources:
- plant catalogue browsing
- AI suggestions
- community recommendations

Card fields:
- plant illustration
- plant name
- plant type
- suitability summary

Example:
- Pomegranate
- Shrub
- Suitable for Zone 8

## Wishlist Actions and Property Transition

Supported actions:
- add notes
- move plant to property
- remove from wishlist

Transition rule:
- `move to property` always routes through Add Plant flow (requires selecting zone and bed context).

Optional preflight hints:
- suitable zones on property
- likely planting window

## Archived Tab and Historical Records

Purpose:
- preserve memory of previous plantings and outcomes.

Use cases:
- review past success and failure
- compare season outcomes
- plan next cycle with evidence

Archived card fields:
- plant name
- previous bed or zone
- season grown
- performance summary

Example:
- Cherokee Purple Tomato
- South Barn Bed
- Summer 2025
- Yield: 42 lb

## Plant History Record Specification

Archived detail view should include:
- photos
- notes
- harvest logs
- observations
- issue history

History integrity rule:
- archive retains context links and timestamps rather than flattening into summary text only.

## Performance Tracking and Trend Surfaces

Trend surfaces can summarize recurring outcomes:
- tomatoes consistently perform well in this bed
- broccoli struggled during late-spring heat

Presentation options:
- compact trend badges on cards
- richer insights in drawer info mode

Trust rule:
- trend statements should include a simple evidence cue (for example number of seasons or notes contributing).

## Spatial Context and My Property Integration

Growing cards must always display:
- zone
- bed

Deep-link behavior:
- selecting a plant opens the spatial record in `My Property`.
- return path should preserve prior `My Plants` tab, search, and filters where possible.

Context handshake contract:

```txt
MyPlantsLinkContext {
  property_id,
  tab,
  search_query?,
  spatial_filter_path?,
  selected_plant_instance_id?
}
```

## Calendar Integration and Temporal Signals

Calendar-driven signals used in `My Plants`:
- upcoming task urgency
- harvest windows
- seasonal stage cues

My Plants -> Calendar jump behavior:
- users can open date-relevant task context for a plant directly in Calendar.

Cross-module rule:
- plant card urgency and calendar urgency must not conflict for the same plant instance.

## Community Signal Integration

Optional community overlays on plant identity:
- community rating
- regional success signal

Example:
- highly successful in Zone 8 sandy soil

Display rule:
- community signals should augment, not override, local property history.

## Right Drawer Behavior (Info, Actions, Filters)

Core drawer modes:

```txt
info | actions | filters
```

`Info` mode:
- total active plants
- number of species
- perennial vs annual breakdown
- active beds containing plants
- selected plant quick preview when card is active

`Actions` mode:
- add plant to property
- add plant to wishlist
- archive plant
- export plant history

`Filters` mode:
- zone
- bed
- lifecycle stage
- plant type
- task urgency

Extensibility rule:
- preview-only or analytics modes may be added later through extension mode contract.

## Responsive Behavior (Desktop and Mobile)

### Desktop

Target structure:
- left hierarchy rail
- main grid/list plant canvas
- right drawer with info/actions/filters and preview

Optional list columns:
- plant
- location
- stage
- next task

### Mobile

Target structure:
- top search
- tab row
- swipeable filter chips
- single-column plant cards
- right-drawer behavior via slide-up panel

Mobile action rule:
- card tap prioritizes open record; quick actions remain available via overflow menu or swipe action.

## Empty States and Recovery Paths

Growing empty state:
- message: `No plants growing yet. Add your first plant to a bed to activate plant tracking.`
- primary action: `Add plant to property`

Wishlist empty state:
- message: `No wishlist plants yet. Save plants you want to try next.`
- primary action: `Browse catalogue`

Archived empty state:
- message: `No archived plants yet. Completed seasons will appear here.`
- primary action: `Learn how archiving works`

Filtered-empty state:
- clarify active filters and provide one-tap clear.

## Core User Flows

Flow 1: Review current plants
1. open `My Plants`
2. land on `Growing`
3. filter by zone
4. inspect plants needing attention
5. open target plant in `My Property`

Flow 2: Add to wishlist and move to property
1. discover plant in catalogue or suggestion
2. add to `Wishlist`
3. return later and select `Move to property`
4. complete Add Plant flow with target bed
5. verify plant appears in `Growing`

Flow 3: Review past plantings
1. open `Archived`
2. open prior season plant record
3. review yield, notes, and issues
4. use findings to inform new planting decisions

Flow 4: Log observation quickly
1. from `Growing`, open card quick actions
2. select `Log observation`
3. save note or photo
4. verify history updates for plant record

## Functional Requirements

FR-01 `My Plants` is a primary navigation module.
FR-02 Module supports three tabs: growing, wishlist, archived.
FR-03 Growing tab lists all active plant instances across property.
FR-04 Same species can appear multiple times when present in multiple beds.
FR-05 Card click opens plant record in `My Property` context.
FR-06 Quick actions support observation, note, and photo capture.
FR-07 Search supports plant name, cultivar, bed, and zone.
FR-08 Filters support zone, bed, plant attributes, and task urgency.
FR-09 Wishlist supports add notes, move to property, and remove.
FR-10 Move-to-property routes through Add Plant flow.
FR-11 Archived tab preserves seasonal and performance context.
FR-12 Archived details include media, notes, harvests, and issues.
FR-13 Plant cards show minimal status indicators and next-key-task context.
FR-14 Module displays plant-level temporal cues from Calendar context.
FR-15 Community signals are optional overlays and do not replace local data.
FR-16 Right drawer supports info/actions/filters core modes.
FR-17 Module preserves state (tab/search/filter) during deep-link round trips when possible.
FR-18 Empty states provide clear recovery actions.

## Non-Functional Requirements

Accessibility:
- card actions and filters are keyboard and assistive-tech accessible.
- status indicators include non-color semantics.
- list and grid modes maintain readable hierarchy and labels.

Performance:
- search and filter updates should feel immediate for normal library sizes.
- tab switches should not reset user context unless explicitly requested.
- card interactions should avoid full-page blocking transitions.

Clarity:
- card density remains scannable.
- wording stays non-technical and action-forward.
- location and next-action data should be visible without opening each plant.

## Paid vs Free Surface Behavior

Free tier:
- access to `Growing`, `Wishlist`, and `Archived` tabs
- baseline search and filters
- basic card-level status and next-task visibility
- community rating visibility where available

Paid tier:
- unlimited plant volume support
- richer performance trend insights
- deeper AI-assisted recommendations tied to local history
- advanced export and history analysis surfaces

Gating principle:
- core plant memory and navigation remain usable on free tier.
- paid adds foresight and analysis depth, not basic access.

## Out of Scope for Module 03

- global plant catalogue authoring and moderation mechanics
- detailed permissions model for collaborator edits
- financial yield accounting and farm ERP workflows
- external sensor ingestion implementation
- notification-delivery infrastructure internals

## Acceptance Criteria and Test Scenarios

1. Tab lifecycle test  
Given module open, when user switches tabs, then `Growing`, `Wishlist`, and `Archived` each render correct datasets.

2. Multi-instance test  
Given same species in two beds, when `Growing` is viewed, then both plant instances appear separately with distinct locations.

3. Card deep-link test  
Given a plant card in `Growing`, when clicked, then user lands in correct plant record in `My Property`.

4. Quick action test  
Given card quick action used for observation, when saved, then plant history reflects new entry.

5. Search test  
Given mixed plant set, when user searches by bed, zone, cultivar, and plant name, then relevant matches return instantly.

6. Filter test  
Given active filters, when spatial and lifecycle filters are applied together, then results update and active chips remain visible.

7. Wishlist transition test  
Given wishlist item, when user chooses `Move to property`, then Add Plant flow opens and item appears in `Growing` after completion.

8. Archive history test  
Given archived plant selected, when details open, then notes/photos/harvest/issues are available in historical context.

9. Trend insight test  
Given repeated past records, when trend insight appears, then evidence cue is shown.

10. Calendar coherence test  
Given plant urgency marker in `My Plants`, when corresponding item is opened in Calendar, then urgency context is consistent.

11. Responsive behavior test  
Given desktop and mobile layouts, when user performs core flows, then search/filter/card/action workflows remain usable.

12. Empty-state recovery test  
Given empty tabs, when user views each tab, then clear next-step actions are provided.

## Open Questions Deferred to Module 10 (Database Architecture)

- how multiple users should co-own plant records while preserving clear edit history
- how household or team members should leave plant-level notes without losing author context
- how shared wishlist workflows should handle duplicates and ownership intent
- how archived plant records should represent contributor attribution for historical entries
