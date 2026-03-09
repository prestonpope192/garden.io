# Calendar Module Spec

## Document Status and Scope

- Status: canonical Module 02 product specification.
- Effective date: March 9, 2026.
- Module role: temporal control center for the property.
- Audience alignment: North America-first, multi-bed growers and homesteaders using regenerative planning patterns.
- Scope: product behavior, interface contracts, and testable acceptance criteria.
- Out of scope in this document: backend schema, delivery infrastructure internals, and vendor selection.

Reference inputs:
- Cornell Small Farms Program crop planning guidance: https://smallfarms.cornell.edu/resources/crop-planning/
- FAO crop planning tool references: https://www.fao.org/land-water/databases-and-software/crop-planning
- USDA Plant Hardiness Zone mapping: https://planthardiness.ars.usda.gov

## Module North Star and Symmetry with My Property

Calendar is the temporal mirror of `My Property`.

Module lens symmetry:

| Module | Primary Lens | Secondary Lens |
| --- | --- | --- |
| My Property | Space | Time |
| Calendar | Time | Space |

North-star statement:
- users should feel like they are turning pages in a seasonal planner for their land, not operating a generic productivity calendar.

Core outcomes:
- know what matters today
- anticipate what matters next
- connect each time-based item back to place
- maintain calm and confidence under changing weather and seasonal conditions

## IA Contract and Navigation Placement

Global IA rule:
- `Calendar` is a primary navigation item.
- side placement can be responsive and layout-dependent, but primary-nav status is fixed.

Calendar module intent:
- temporal navigation is primary.
- spatial context appears through filters and deep links, not through replacing `My Property` hierarchy browsing.

## Shared Time Contract and Calendar View States

Shared time contract across modules:

```txt
TimeSlice = week | month_jump | seasonal_jump
```

Calendar-specific state contracts:

```txt
CalendarView = weekly_timeline | monthly_grid
CalendarEntryType = task | seasonal_signal | weather_signal
CalendarDrawerModeCore = tasks | events | insights | actions
CalendarDrawerMode = CalendarDrawerModeCore | extension_mode
```

Behavior rules:
- default open state: `TimeSlice=week`, `CalendarView=weekly_timeline`.
- `month_jump` sets `CalendarView=monthly_grid`.
- `seasonal_jump` updates seasonal context and lands on the target seasonal anchor.

## Workspace Layout Contract (Left Hierarchy, Main Timeline, Right Drawer, Right Insights Rail)

Calendar uses a four-region workspace on desktop:

1. Left hierarchy rail
- compact structure filter for Property -> Zone -> Bed -> Plant path anchoring.
- not a full replacement for `My Property` navigator.

2. Main timeline canvas
- primary weekly or monthly calendar visualization.

3. Right drawer
- dynamic mode drawer for `tasks`, `events`, `insights`, `actions`, and future extension modes.

4. Right insights rail
- persistent watch surfaces for upcoming changes and risk signals.

Layout rule:
- right drawer and right insights rail may stack within one right column but must remain visually distinct.

## Time Navigation Model (Week, Month Jump, Seasonal Jump)

Calendar time navigation is fluid and planner-like.

Primary control:
- horizontal timeline control near top of page.

Supported movements:
- week increments
- month jumps
- seasonal jumps

Expected update behavior on every time move:
- task windows refresh
- weather signals refresh
- plant-stage expectations refresh
- seasonal signals refresh

Animation guidance:
- transitions should evoke page turns through a seasonal planner.

## Spatial Filter Model (Zone -> Bed -> Plant Single Path)

Spatial filtering contract:

```txt
SpatialFilterPath {
  zone_id?,
  bed_id?,
  plant_id?
}
```

Rules:
- single active path only.
- selecting a bed implies and locks its parent zone.
- selecting a plant implies and locks parent bed and zone.
- changing to a different zone clears incompatible bed and plant selections.

Rationale:
- avoids ambiguous blends and preserves clear temporal-to-spatial context.

## Event Type Taxonomy and Visual Semantics

Calendar entries are grouped into three visual classes:

1. Tasks
- actionable cards
- examples: plant cucumbers, mulch fruit trees, prune raspberries

2. Seasonal signals
- non-action markers for timing windows
- examples: tomato planting window open, blueberry harvest window approaching

3. Weather signals
- soft alert markers from WeatherIQ
- examples: heavy rain expected, frost risk approaching

Event filter taxonomy:
- planting
- watering
- harvest
- maintenance
- inspection
- observation
- weather
- seasonal signal

## Weekly Timeline Default View

Default view is weekly timeline with day columns.

Weekly layout contract:
- one vertical column per day
- tasks as cards within day columns
- seasonal and weather markers appear inline without crowding task cards

Example representation:
- Monday: harvest spinach, inspect strawberries
- Tuesday: water herb bed
- Wednesday: rain expected
- Thursday: plant basil
- Friday: check tomato support stakes

## Monthly Grid View Triggered by Month Jump

When `month_jump` is used:
- switch to `monthly_grid` view.
- grid shows week rows and day cells for the target month.
- dense days summarize counts and top-priority markers.

Interaction rules in monthly grid:
- selecting a day opens day detail in the right drawer.
- selecting a week can jump back into weekly timeline for execution detail.
- seasonal and weather signals remain visible as lightweight markers.

## Task Card Contract and Inline Actions

Task card fields:
- task title
- source context (plant, bed, zone, or property)
- time window
- completion checkbox
- optional event icon

Inline actions:
- complete
- skip
- reschedule
- add note
- open source context

Post-complete prompt behavior:
- task completion can trigger contextual quick-log prompts.
- example: completing `Harvest tomatoes` prompts `How much did you harvest?`

## WeatherIQ Integration and Suggest-Confirm Automation

Weather surfaces:
- top weather strip with current conditions, 7-day forecast, and rainfall outlook
- inline timeline markers for significant weather events

Weather automation policy:
- never auto-apply task changes.
- create proposal cards requiring user confirmation.

Proposal contract:

```txt
WeatherAdjustmentProposal {
  task_id,
  proposed_action,
  reason,
  confidence,
  requires_user_confirmation=true
}
```

Example:
- if rain is likely during irrigation window, propose suppressing or rescheduling watering tasks.

## Right Insights Panel Contract

Right insights rail sections:
- upcoming watch list
- weather watch
- harvest watch

Section intent:
- upcoming watch list: near-term growth/lifecycle milestones
- weather watch: temperature/rain/frost/heat stress risk
- harvest watch: approaching harvest windows and volume cues

Insights panel must:
- remain contextual to current time slice and filter path
- provide direct links into task cards or source context

## Right Drawer Dynamic Modes Contract

Drawer is dynamic and extensible, with v1 core modes:
- tasks
- events
- insights
- actions

Core mode behavior:
- `tasks`: grouped lists (today, this week, next week, later)
- `events`: seasonal signal lists and window markers
- `insights`: recommendation lists and rationale snippets
- `actions`: quick-add utilities (manual task, note, reminder, schedule block)

Dynamic extension behavior:
- additional modes may appear by user tier, context, or future module integration.
- extension modes cannot remove v1 core mode availability.

## Calendar Filtering Chip System

Filter chips sit above the main timeline and must support fast toggling.

Chip groups:
- spatial path chips: zone, bed, plant (single path contract)
- event type chips
- status chips (open, completed, skipped)

Example:
- `Zone: Orchard`
- `Bed: Berry Bed`
- `Event: Harvest`

Filtering rules:
- chip updates are immediate and reversible.
- active filters are always visible.
- filter state persists while switching drawer modes.

## Calendar <-> My Property Deep-Link and Context Restoration

Every calendar item must deep-link back to spatial context.

Examples:
- click task -> open target bed or plant in `My Property`
- click harvest event -> open plant record
- click weather insight -> open relevant zone context

Deep-link context contract:

```txt
CalendarLinkContext {
  property_id,
  zone_id?,
  bed_id?,
  plant_id?,
  selected_date,
  selected_view
}
```

Restoration rules:
- returning from `My Property` to Calendar should preserve selected date range and active filters where possible.

## Seasonal Context Layer

A seasonal strip appears above timeline views.

Contents:
- current season phase label (for example: Early Spring)
- short highlight bullets for current phase priorities
- optional region-aware hardiness reminder

Purpose:
- provide orientation for beginners and reduce cognitive load when planning ahead.

## Weekly Garden Report (Paid): In-App and Email

Paid users receive a weekly summary with two delivery surfaces:
- in-app weekly report card inside Calendar
- email digest with same summary structure

Report sections:
- this week tasks
- weather watch
- harvest watch
- potential issues

Report behavior:
- generated from current property context and upcoming windows
- links from report items open source contexts in Calendar and My Property

## Responsive Behavior (Desktop and Mobile)

### Desktop

Target structure:
- left hierarchy rail
- center calendar grid or timeline
- right insights rail and right drawer

Requirements:
- preserve high information density without overwhelming scanability
- maintain one-click access to task actions and deep links

### Mobile

Target structure:
- top weather strip
- middle weekly timeline or month grid
- bottom task list and right-drawer access via slide-up panel
- swipeable filter chips row

Requirements:
- core daily check workflow must be executable one-handed
- mode changes and filter changes must not lose selected date context

## Empty States and Recovery Paths

Primary empty state:
- message: `No tasks yet. Add plants to your beds to generate a seasonal schedule.`

Recovery actions:
- open `My Property` at add-plant flow
- create manual task in Calendar `actions` mode
- remove filters if emptiness is filter-induced

No-results (filtered) state:
- message clarifies active filters and offers one-tap clear.

## Core User Flows

Flow 1: Morning garden check
1. open Calendar
2. review today tasks, weather strip, key insights
3. complete or reschedule tasks
4. log quick notes as needed

Flow 2: Planning ahead
1. jump forward two weeks or one month
2. review planting windows and weather shifts
3. adjust schedule or add manual tasks

Flow 3: Investigating a task
1. open task card
2. inspect source context
3. deep-link to bed or plant in `My Property`
4. complete task and capture observation

Flow 4: Weather-driven adjustment
1. weather signal creates adjustment proposal
2. user reviews reason and confidence
3. user confirms or dismisses proposal
4. task list updates with clear audit note

## Functional Requirements

FR-01 Calendar is a primary nav module for temporal planning.
FR-02 Default render is weekly timeline with day columns.
FR-03 Month jump must switch to monthly grid.
FR-04 Seasonal jump must update seasonal context and planning windows.
FR-05 Calendar aggregates tasks from plants, beds, zones, templates, manual entries, and AI-generated suggestions.
FR-06 Calendar renders three entry classes: task, seasonal signal, weather signal.
FR-07 Task cards support complete, skip, reschedule, add note, and open source context actions.
FR-08 Spatial filtering must follow single-path hierarchy semantics.
FR-09 Event-type filtering must support planting, watering, harvest, maintenance, inspection, observation, weather, seasonal signal.
FR-10 WeatherIQ appears in top strip and timeline markers.
FR-11 Weather-based task adjustments must use suggest-confirm proposals.
FR-12 Right drawer supports dynamic modes with v1 core defaults.
FR-13 Right insights rail shows upcoming watch list, weather watch, and harvest watch.
FR-14 Calendar items deep-link to My Property and restore context where possible.
FR-15 Weekly paid report is available in-app and by email.
FR-16 Empty states provide direct recovery paths.
FR-17 Free users retain core task execution workflow.
FR-18 Paid features add predictive insight depth without blocking baseline planning.

## Non-Functional Requirements

Accessibility:
- keyboard and assistive navigation support for timeline, cards, chips, and drawer modes
- non-color indicators for weather and risk status
- reduced-motion support for timeline transitions

Performance:
- week-to-week navigation should feel immediate in normal dataset sizes
- month jumps should not block primary interaction controls
- filter toggles should update visible data quickly and predictably

Clarity:
- action labels use plain language
- proposal cards explain reason before requesting confirmation
- temporal context and spatial context must always be visible together

## Paid vs Free Surface Behavior

Free:
- full weekly and monthly calendar navigation
- core task aggregation and actions
- baseline event markers and manual task management
- baseline weather visibility

Paid:
- advanced predictive WeatherIQ and HarvestIQ insights
- weekly report in-app plus email
- richer recommendation quality and prioritization

Gating principle:
- core planning utility remains available free; paid layers increase foresight and decision confidence.

## Out of Scope for Module 02

- full collaboration permissions and role modeling
- enterprise labor and cost management workflows
- notification infrastructure internals
- API and storage schema implementation details
- module 03 plant library and wishlist behavior details

## Acceptance Criteria and Test Scenarios

1. Symmetry test  
Given user moves between My Property and Calendar, when context changes, then temporal and spatial anchors remain coherent.

2. Time contract test  
Given Calendar is open, when user switches among week, month jump, and seasonal jump, then view and summaries update correctly.

3. Month jump test  
Given weekly view, when month jump is triggered, then Calendar switches to monthly grid.

4. Filter path test  
Given a spatial filter selection, when user selects plant, then parent bed and zone are implied and conflicting path options reset.

5. Task action test  
Given an actionable task card, when user completes, skips, or reschedules, then task state updates and source context remains linkable.

6. Weather confirm test  
Given weather impact conditions, when a task adjustment is proposed, then user confirmation is required before mutation.

7. Deep-link test  
Given any calendar entry, when user opens source context, then My Property opens at correct level and entity.

8. Drawer mode test  
Given right drawer modes, when user switches among core four modes, then selected date and filters persist.

9. Weekly report paid test  
Given paid tier user, when weekly report is generated, then report is visible in-app and available via email summary.

10. Free-tier guardrail test  
Given free user, when using Calendar, then baseline planning and task execution remain functional.

11. Responsive test  
Given desktop and mobile layouts, when user executes core flows, then weather strip, timeline/grid, filters, and drawer interactions remain usable.

12. Empty-state test  
Given no generated tasks, when Calendar loads, then clear path to add plants/beds or manual tasks is presented.

## Open Questions Deferred to Module 10 (Database Architecture)

- how shared calendars should represent collaborator ownership and edits without visual clutter
- how assignment or handoff states should appear in timeline cards for household or team workflows
- how shared reminder preferences should be managed across multiple users on one property
- how conflict resolution should work when two users reschedule the same task concurrently
