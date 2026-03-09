# My Property Module Spec

## Document Status and Scope

- Status: canonical Module 01 product specification.
- Effective date: March 9, 2026.
- Audience alignment: North America-first, multi-bed growers with regenerative and long-horizon planning intent.
- Module goal: define a decision-complete experience contract for `My Property` without backend schema or implementation details.
- This document covers:
  - information architecture
  - layout and interaction patterns
  - level-specific behavior (Property, Zone, Bed, Plant)
  - contextual creation and editing flows
  - free vs paid surface behavior
  - acceptance criteria and test scenarios

## Module North Star and Experience Principles

`My Property` is the core of Garden.io. Users should feel like they are moving through land and living systems, not screens and forms.

Experience principles:
- Land-first: spatial hierarchy comes before utility screens.
- Context always visible: users should always know where they are and what belongs here.
- Calm over clutter: progressive disclosure and concise summaries prevent overload.
- Intelligence in place: suggestions appear where decisions happen, not in detached chat flows.
- Seasonal continuity: week-by-week movement with seasonal jumps supports planning and memory.
- Personal and beautiful: visuals are botanical and notebook-like while staying quick to scan.

Emotional outcomes:
- calm
- confidence
- continuity
- trust

## IA Contract and Naming

Global module naming rule:
- primary header nav label is fixed as `My Property`.
- user-selected property type and name appear in-page (for example: `Preston Homestead` and `Homestead`).

Placement:
- `My Property` is a primary nav destination in the primary header navigation area.

Hierarchy and navigation contract:
- canonical browse path: `Property -> Zone -> Bed -> Plant`.
- navigation depth is explicit in left hierarchy rail and breadcrumb.

UI state contract:

```txt
HierarchyLevel = property | zone | bed | plant
DrawerMode = info | tasks | actions
TimeSlice = week | month_jump | seasonal_jump
TaskScope = current_level | descendants | plant_only
```

Navigation context contract:

```txt
NavigationContext {
  property_id,
  zone_id?,
  bed_id?,
  plant_id?,
  time_slice,
  drawer_mode
}
```

Hard rules:
- changing `DrawerMode` must not change `HierarchyLevel`.
- changing `TimeSlice` must preserve location context.
- deep links into level views must reconstruct the breadcrumb and left-hierarchy-rail highlight.

## Core Hierarchy Definitions (Property -> Zone -> Bed -> Plant)

### Property

Top-level user container for land context.

Examples:
- Preston Homestead
- River Garden
- Back Orchard
- Main Property

### Zone

Meaningful sub-area in a property, usually grouped by function, microclimate, or infrastructure.

Examples:
- Orchard
- West Shade Garden
- Chicken Run Edge
- Greenhouse
- Raised Bed Garden
- South Barn Bed Area

### Bed

Manageable planting unit inside a zone.

Examples:
- Blueberry Bed
- Tomato Bed 1
- Apple Guild Bed
- Herb Strip
- East Swale Bed

Supported bed types:
- raised
- in-ground
- row
- container group
- trellis run
- orchard circle
- perennial patch
- wild zone section

### Plant

Live growing record in a bed. Can represent an individual plant, grouped planting, or crop occurrence.

Examples:
- 3 Cherokee Purple tomatoes
- 1 Meyer lemon
- patch of dill
- row of onions
- 6 strawberry plants

## Workspace Layout Contract (Left Hierarchy Rail, Main Canvas, Right Drawer)

`My Property` uses a three-part workspace that keeps location, content, and action visible in one view.

### Left Hierarchy Rail: Structure Navigator

Purpose:
- map of the property even when GIS map is absent
- rapid context switching across levels
- structural awareness at all times

Required behaviors:
- expand and collapse per node
- current context highlight
- breadcrumb parity with selected node
- optional filter and search within tree
- level icons or illustrations
- persistent on desktop; collapsible panel on smaller viewports

### Main Canvas: Level-Specific Content

Purpose:
- primary reading, planning, and decision surface

Required behaviors:
- renders one of four level states: Property, Zone, Bed, Plant
- prioritizes scan-first summary blocks before deep detail
- always includes contextual recommendations section
- supports time-slice updates without route context loss

### Right Drawer: Contextual Utility

Purpose:
- mode switching without navigation away from current level

Modes:
- `Info`: attributes and notes for current level
- `Tasks`: due, active, and historical task context
- `Actions`: create and update actions scoped to current level

Required behaviors:
- mode switch preserves scroll and location state
- task filters available per level
- action list is context-sensitive and never offers invalid parent-child actions

## Cross-Level Shared Interaction Patterns

### Breadcrumb Contract

Always visible at every level.

Example:
`Preston Homestead / Orchard / North Row / Apple Tree 1`

### Suggestions Contract

Recommendations exist at every level:
- Property: portfolio-level and near-term seasonal suggestions
- Zone: composition and maintenance suggestions
- Bed: companion, spacing, water, and rotation suggestions
- Plant: care, issue, harvest, and maintenance suggestions

### Notes and Media Contract

All levels support:
- add note
- upload photo
- record observation

### Time Navigation Contract

Time is first-class at every level:
- default: weekly page-turning
- alternate: month jump and seasonal jump

Expected behavior when time changes:
- task due windows update
- growth and lifecycle expectations update
- weather and risk alerts update
- harvest expectations update

### Progressive Disclosure Contract

To reduce overload:
- summary first, details on demand
- show top 1-3 recommendations before full lists
- collapse secondary data behind explicit user action

## Level Specs: Property View

Purpose:
- whole-property orientation, priorities, and seasonal direction

### Main Canvas Sections

1. Property header
- property name
- user-selected property type label
- region and hardiness summary
- quick stats
- seasonal status line

Example:
`Preston Homestead`  
`Homestead - Zone 8b - Early Spring`

2. Property hero visual
- stylized whole-place representation
- GIS map is optional
- acceptable forms:
  - zone tiles
  - illustrated map
  - notebook spread
  - visual landscape cards

3. Zone cards
- zone name
- purpose
- number of beds
- number of plants
- next key task
- key seasonal note
- status marker

4. Suggestions panel
- property-level planning prompts
- examples:
  - add a pollinator zone
  - review next two weeks for frost-sensitive plants
  - prep summer beds

5. Seasonal overview strip
- this week
- next week
- weather watch
- planting window
- harvest watch

### Right Drawer Behavior (Property)

`Info` mode:
- property description
- user goals
- climate region
- totals for zones, beds, plants
- season summary
- property notes

`Tasks` mode:
- aggregate from all descendant levels
- filters:
  - due soon
  - overdue
  - this week
  - completed

`Actions` mode:
- add zone
- add bed
- add note
- import template
- invite collaborator (interface exposure only)
- add manual task

## Level Specs: Zone View

Purpose:
- strategic planning unit for purpose, microclimate, composition, and shared maintenance

### Main Canvas Sections

1. Zone header
- zone name
- purpose
- zone notes
- environmental tags

Example:
`Orchard`  
`Fruit production, pollinator support, perennial understory`  
`Full sun - moderate slope - soaker irrigation`

2. Zone visual canvas
- stylized bed map, card cluster, or notebook layout
- must make bed relationships and composition readable

3. Bed summary cards
- bed name
- bed type
- dominant plants
- seasonal stage
- next task
- issue indicator

4. Zone recommendations area
- companion additions
- missing support plants
- template applications
- future bed use suggestions

5. Zone timeline strip
- current week focus
- next key planting or harvest window
- weather note
- maintenance note

### Right Drawer Behavior (Zone)

`Info` mode:
- zone purpose
- environmental profile
- sun and shade summary
- irrigation type
- soil notes
- seasonal goals
- custom notes

`Tasks` mode:
- only zone tasks and descendant bed and plant tasks
- grouping options:
  - by bed
  - by task type
  - by due date

`Actions` mode:
- add bed
- add plant to bed
- apply template
- add note or photo
- create recurring task
- archive bed
- duplicate bed layout

## Level Specs: Bed View

Purpose:
- operational center for day-to-day growing decisions

### Main Canvas Sections

1. Bed header
- bed name
- parent zone
- bed type
- dimensions
- sunlight
- soil profile
- irrigation method

Example:
`South Barn Bed`  
`South Barn Area - In-ground perennial bed`  
`Full sun - sandy loam - drip line`

2. Bed visual composition
- preferred modes:
  - illustrated layout
  - top-down arrangement
  - layered card stack
  - seasonal plant portrait
- must clearly show:
  - what plants are present
  - rough placement
  - dominant structure
  - occupancy level

3. Plant layer
- supports toggle: `visual layout` vs `list`
- each plant entry shows:
  - name
  - quantity
  - stage
  - performance marker
  - next event

4. Recommendations section
- contextual recommendations embedded inline
- examples:
  - missing companions
  - overcrowding alert
  - succession opportunity
  - harvest timing warning
  - watering adjustment
  - rotation suggestion

5. Bed insights strip
- optional premium indicators:
  - WaterIQ
  - WeatherIQ
  - HarvestIQ
  - rotation notes

Example:
- WaterIQ: no watering needed for 4 days
- WeatherIQ: warm spell may accelerate bolting
- HarvestIQ: lettuce likely ready in 7-10 days

### Right Drawer Behavior (Bed)

`Info` mode:
- bed description
- physical characteristics
- occupancy
- purpose
- notes
- season summary

`Tasks` mode:
- this bed tasks
- all descendant plant tasks
- manual bed tasks
- filters:
  - all
  - plant-generated
  - manual
  - overdue
  - complete

`Actions` mode:
- add plant
- remove plant
- move plant
- apply template
- add observation
- upload photo
- ask for suggestion
- add watering event
- add harvest event
- add issue
- add manual task

## Level Specs: Plant View

Purpose:
- detailed live plant record at the property level

Boundary:
- this is not the global catalogue entry view
- this is the grower-specific in-place plant record

### Main Canvas Sections

1. Plant header
- plant name
- cultivar
- quantity
- current stage
- bed and zone
- planted date
- source type if known

Example:
`Cherokee Purple Tomato`  
`6 plants - flowering`  
`South Barn Bed -> South Barn Area`  
`Planted March 20`

2. Plant visual section
- illustration
- optional user photos
- growth progress markers
- issue markers

3. Current plant status
- lifecycle stage
- recent observations
- next milestone
- health summary
- season expectations

4. Plant-specific recommendations
- prune suckers this week
- watch for hornworms
- add basil nearby
- harvest window opening soon

5. History and observations feed
- notes
- photos
- issue reports
- harvest logs
- maintenance events

### Right Drawer Behavior (Plant)

`Info` mode:
- user notes
- planted date
- count
- source
- lifecycle stage
- current health
- linked catalogue entry

`Tasks` mode:
- plant-only task list
- examples:
  - fertilize
  - prune
  - inspect
  - harvest
  - save seed

`Actions` mode:
- add note
- upload photo
- report issue
- add harvest
- add maintenance event
- ask AI about this plant
- archive plant
- mark failed
- split or propagate if relevant

## Add Flows (Zone, Bed, Plant)

Creation happens in context. Users should not leave `My Property` for standard add flows.

### Add Zone Flow

Entry points:
- Property view actions drawer

Steps:
1. choose zone name
2. choose purpose
3. optionally choose environmental tags
4. optionally add description
5. create

Post-create:
- left hierarchy rail expands to show new zone
- focus lands on new zone view
- prompt for first bed

### Add Bed Flow

Entry points:
- Property actions drawer
- Zone actions drawer

Steps:
1. choose parent zone
2. enter bed name
3. choose bed type
4. set dimensions
5. choose sunlight profile
6. choose irrigation type
7. save

Post-create:
- bed appears in zone canvas and left hierarchy rail
- prompt for add plant or apply template

### Add Plant Flow

Entry points:
- Bed actions drawer (primary)
- Zone actions drawer with bed selector (secondary)

Steps:
1. open plant search
2. select from catalogue or generate new entry (if eligible tier)
3. set quantity
4. choose planting method
5. set planted date
6. optionally add placement note
7. save into bed

Post-create:
- plant appears in bed composition and list
- tasks and recommendations regenerate for current context

Validation rules:
- plant cannot be saved without parent bed
- quantity must be positive
- planted date defaults to today but is editable

## Empty States and First-Value Moments

Property empty state:
- message: `Start your first zone.`
- primary action: `Add Zone`

Zone empty state:
- message: `Add your first bed.`
- primary action: `Add Bed`

Bed empty state:
- message: `Add your first plant or apply a template.`
- primary actions: `Add Plant` and `Apply Template`

Plant sparse state:
- encourage first note, first photo, first observation log

First-value moment:
- achieved when first plant is added to first bed
- immediate outputs:
  - first generated task list
  - first contextual recommendations
  - week-level planning visibility

## Responsive Behavior (Desktop and Mobile)

### Desktop

Target behavior:
- immersive workspace
- left hierarchy rail fixed
- center canvas dominant
- right drawer fixed or collapsible

Minimum desktop interaction requirements:
- keyboard reachable drawer mode toggles
- quick left-hierarchy-rail traversal without losing scroll context
- stable breadcrumb visibility

### Mobile

Target behavior:
- full-width main body
- left hierarchy rail as slide-out structure panel
- right drawer as bottom sheet or slide-out contextual panel

Minimum mobile interaction requirements:
- hierarchy browsing is reachable within one tap from any level
- `Info / Tasks / Actions` switch is persistent and thumb-accessible
- add flows remain short and context-preserving

## Critical User Flows and Success Moments

### Flow 1: New User Creates First Structure

1. open `My Property`
2. create Property
3. add first Zone
4. add first Bed
5. add first Plant
6. view first generated tasks and suggestions

Success moment:
- product feels alive after first plant is added.

### Flow 2: Existing User Checks Bed Priorities

1. open `My Property`
2. navigate to target Zone
3. open Bed
4. switch drawer to `Tasks`
5. review due items
6. complete or defer task
7. review bed recommendations

Success moment:
- user exits with clear next actions and updated status.

### Flow 3: Existing User Browses for Context

1. open `My Property`
2. move through zones
3. open one Zone
4. compare bed summaries
5. drill into a Plant
6. log observation

Success moment:
- user captures memory in context without route switching.

### Flow 4: Existing User Adds New Crop

1. navigate to target Bed
2. open `Actions`
3. select `Add Plant`
4. search plant
5. set quantity and date
6. save
7. review updated tasks and recommendations

Success moment:
- updated plan appears immediately in-place.

## Functional Requirements

FR-01 Hierarchical browsing:
- system supports Property -> Zone -> Bed -> Plant traversal with visible parent-child context.

FR-02 Persistent structural navigation:
- left hierarchy rail must present full hierarchy and current-node highlight.

FR-03 Contextual utility modes:
- right drawer supports `info`, `tasks`, `actions` at every hierarchy level.

FR-04 Context-safe mode switching:
- changing drawer mode cannot change hierarchy location.

FR-05 Time-aware browsing:
- weekly navigation, month jump, and seasonal jump are available at all levels.

FR-06 Contextual creation:
- add zone, add bed, add plant flows launch and complete in-context.

FR-07 Embedded tasks:
- each level has scoped task visibility with level-appropriate filters.

FR-08 Embedded recommendations:
- each level includes recommendations relevant to that level.

FR-09 Embedded notes and media:
- notes and photos attach at Property, Zone, Bed, and Plant levels.

FR-10 Plant record separation:
- plant live record view is distinct from global catalogue knowledge view.

FR-11 Optional map model:
- map view may exist, but non-map spatial understanding is required baseline.

FR-12 Collaborator entrypoint:
- invite collaborator action is visible at Property level.
- roles, permissions, and sharing policy are deferred.

FR-13 Free and paid clarity:
- premium surfaces are visible in context without blocking core free workflows.

FR-14 Cross-module context emission:
- module provides context-qualified tasks and events to Calendar surfaces.

FR-15 Cross-module context consumption:
- module consumes weather and seasonal window cues from Calendar services.

## Non-Functional Requirements (Accessibility, Performance, Clarity)

Accessibility:
- keyboard navigation for primary controls and hierarchy traversal.
- visible focus states on interactive elements.
- color and status indicators must include text or icon redundancy.
- motion should honor reduced-motion preferences.

Performance:
- context switch between hierarchy nodes should feel immediate for normal usage.
- drawer mode switch should not trigger full-page reload behavior.
- weekly time-slice shift should update key strips and recommendations without disorienting layout jumps.

Clarity:
- language remains plain and non-technical.
- recommendation copy must be actionable and concise.
- each level should expose top priorities first and secondary data on demand.

## Paid vs Free Surface Behavior

Free tier behavior in this module:
- full hierarchy browsing
- create and manage Property, Zone, Bed, Plant
- baseline notes, media, and task logging
- baseline contextual recommendations without advanced intelligence engines

Paid tier behavior in this module:
- WaterIQ, WeatherIQ, HarvestIQ insight strip on relevant levels
- deeper planning intelligence and proactive suggestion quality
- advanced context-sensitive recommendations
- more robust cross-level planning support over time

Gating rules:
- do not block basic planning actions behind paywall
- show premium surfaces as additive enhancements
- locked premium elements should explain practical benefit in one line

## Calendar Handshake Contract

`My Property -> Calendar` publishes:
- context-qualified tasks with hierarchy ids
- contextual events (planting, watering, harvest, maintenance)
- due windows tied to current and future time slices

`Calendar -> My Property` provides:
- weather watch signals
- seasonal windows
- risk flags (for example: frost or heat-stress periods)
- schedule-level recommendations for upcoming week

Shared behavior rules:
- deep links from Calendar back into `My Property` must restore `NavigationContext`.
- time-slice selection should remain coherent across modules.
- recommendations should not contradict current level context.

Data contract sketch for cross-module surfaces:

```txt
ContextTaskEvent {
  source_level,
  property_id,
  zone_id?,
  bed_id?,
  plant_id?,
  event_type,
  due_window_start?,
  due_window_end?,
  status
}
```

## Out of Scope for This Module

- full Calendar page and monthly planning interaction model
- collaboration roles and permission matrix
- enterprise farm operations workflows (labor planning, finance, compliance)
- catalogue governance and moderation systems
- mandatory GIS or satellite mapping implementation
- backend schema, storage model, and service infrastructure details

## Acceptance Criteria and Test Scenarios

1. Hierarchy clarity  
Given a user is on any level, when they view the screen, then breadcrumb and left-hierarchy-rail highlight both identify current location and parent chain.

2. Context integrity  
Given a user on any level, when they switch `Info`, `Tasks`, and `Actions`, then hierarchy location remains unchanged.

3. Property-level aggregation  
Given a populated property, when user opens Property `Tasks`, then due soon, overdue, this week, and completed filters are available.

4. Zone planning utility  
Given a zone with multiple beds, when user opens Zone view, then shared maintenance and composition recommendations are visible.

5. Bed operational utility  
Given a bed with plants, when user opens Bed view, then add, move, remove plant and watering and harvest logging are available.

6. Plant record integrity  
Given a plant entry in a bed, when user opens Plant view, then live growing record is shown and distinguished from catalogue entry.

7. Time travel behavior  
Given any level with future tasks, when user changes time slice from current week to future, then tasks and forecast-aware indicators update without location loss.

8. Empty-state progression  
Given empty Property, Zone, and Bed states, when user sees each state, then clear next action appears (`Add Zone`, `Add Bed`, `Add Plant`).

9. Mobile parity  
Given mobile viewport, when user navigates hierarchy and switches drawer modes, then core browse and add flows remain usable.

10. Paid gating clarity  
Given free-tier context with premium insight strip, when user views premium element, then core workflow remains available and premium value is explained.

11. Audience fit  
Given module copy and structure, when reviewed against target audience, then emphasis is on multi-bed regenerative planning, not ornamental micro-use.

12. Calendar readiness  
Given this module spec, when Calendar Module 02 is authored, then cross-module contracts are explicit enough to avoid reinterpretation.

## Open Questions for Calendar and Future Modules

- quarter-level and year-level planning views in Calendar
- canonical recurrence logic and task rollover policies
- weather provider source-of-truth and update cadence
- calendar-specific conflict and overlap handling
