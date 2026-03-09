# Task System Module Spec

## Document Status and Scope

- Status: canonical Module 05 product specification.
- Effective date: March 9, 2026.
- Module role: operational engine for seasonal work orchestration.
- Product position: not a top-level navigation module.
- Primary surface: Calendar.
- Secondary surface: My Property (contextual right drawer).
- Scope: task generation, lifecycle, visibility, interaction, and history behavior across modules.
- Out of scope: notification infrastructure implementation details, background-job architecture, and model-training internals.

Reference sources:
- Cornell Small Farms Program crop planning: https://smallfarms.cornell.edu/resources/crop-planning/
- USDA Plant Hardiness Zones: https://planthardiness.ars.usda.gov
- FAO crop planning tools: https://www.fao.org/land-water/databases-and-software/crop-planning

## Module North Star and Product Role

The task system should feel like seasonal guidance emerging from the garden, not a ticketing queue.

North-star statement:
- users should always know the next meaningful garden actions without feeling pressured by rigid productivity mechanics.

Role in product architecture:
- generated and managed by task system contracts
- rendered temporally in Calendar
- rendered spatially in My Property
- reflected per-plant context in My Plants

## IA Contract and Surface Placement

Task system placement rules:
- `Tasks` is a system module and interaction layer, not a standalone top-level page.
- Calendar is the default primary task workspace.
- My Property shows task context scoped to current location.

Layout consistency rule:
- all task drawer experiences use standardized right-drawer patterns across modules.
- references to older left-panel language are superseded by right-drawer standardization.

## Core Principles and Voice Contract

Task system must feel:
- calm
- seasonal
- contextual
- non-intrusive
- intelligent

Tone contract:
- phrase tasks as practical guidance.
- avoid punitive overdue language.

Examples:
- preferred: `Inspect tomatoes for hornworms this week.`
- avoid: `Task overdue: tomato pest inspection.`

## Task Type Taxonomy

Core taxonomy:

```txt
TaskType =
  lifecycle |
  maintenance |
  watering |
  seasonal |
  observation |
  manual |
  ai_suggested
```

Type definitions:
- `lifecycle`: stage-driven actions (sow, transplant, thin, prune, harvest).
- `maintenance`: recurring care routines (mulch, fertilize, support, inspect).
- `watering`: WaterIQ-driven irrigation adjustments and events.
- `seasonal`: transition-based work (winter prep, spring prep, pruning windows).
- `observation`: follow-up checks from notes/issues.
- `manual`: user-authored tasks not generated automatically.
- `ai_suggested`: recommendation-derived tasks accepted by user.

## Task Source Contract

Every task must include explicit source context.

```txt
TaskSourceType =
  plant |
  bed |
  zone |
  property |
  template |
  weather_signal |
  manual_user |
  ai_suggestion
```

Task source envelope:

```txt
TaskSourceRef {
  source_type,
  property_id,
  zone_id?,
  bed_id?,
  plant_id?,
  template_id?,
  weather_signal_id?,
  suggestion_id?
}
```

Context rule:
- source context must always be available for deep-link and history traceability.

## Task State, Window, and Priority Contracts

Lifecycle state contract:

```txt
TaskState = suggested | scheduled | completed | skipped | expired
```

Time window contract:

```txt
TaskWindow {
  window_start_date?,
  window_end_date?,
  window_label,
  is_flexible=true
}
```

Priority contract:

```txt
TaskPriority = focus | standard | low
```

Task model contract:

```txt
TaskRecord {
  task_id,
  title,
  task_type,
  source_ref,
  state,
  priority,
  task_window,
  created_by_type,   // system | user | ai
  notes_count,
  completion_log?
}
```

## Task Lifecycle Semantics

State meanings:
- `suggested`: recommendation available, not yet user-confirmed.
- `scheduled`: active task with recommended window.
- `completed`: done and optionally logged with outcome details.
- `skipped`: user intentionally did not execute.
- `expired`: window passed without completion or explicit skip.

Lifecycle behavior:
- suggested tasks may be accepted into scheduled.
- skipped tasks do not trigger punitive UI.
- expired tasks remain visible in history and can be rescheduled.

## Time Window Model (Guidance over Deadlines)

Task windows are recommended ranges, not strict deadlines.

Examples:
- `Thin carrots` -> window: this week
- `Harvest lettuce` -> window: next 5-10 days

Window behavior:
- labels should be human-readable (`today`, `this week`, `next 5-10 days`).
- date bounds still exist internally for sorting and visibility.

## Task Generation Engine Contract

Generation inputs:
- plant lifecycle data
- maintenance templates
- weather and risk signals
- seasonal transitions
- user notes and issue observations
- AI suggestions
- manual task creation

Generation rules:
- tasks are context-bound to source entities.
- generated tasks should de-duplicate by source, type, and window overlap.
- confidence-aware suggestions should start as `suggested` when uncertainty is high.

Generation output contract:

```txt
GeneratedTaskCandidate {
  candidate_id,
  task_type,
  title,
  source_ref,
  proposed_window,
  confidence,
  requires_user_confirmation
}
```

## Weather and Environmental Adaptation

Weather-aware behavior:
- task visibility and timing adjust based on weather context.
- weather-triggered mutations use suggest-confirm pattern (no silent destructive changes).

Examples:
- forecast rain -> propose suppressing or delaying watering.
- unexpected cold -> propose frost protection actions.

Proposal contract:

```txt
TaskAdjustmentProposal {
  task_id,
  proposed_action,   // suppress | delay | advance | split
  reason,
  confidence,
  requires_user_confirmation=true
}
```

## Prioritization and Task Bundling

Prioritization goal:
- avoid overwhelming users with full task volume.

Weekly focus behavior:
- surface top `focus` tasks prominently.
- keep secondary tasks available but visually de-emphasized.

Bundling behavior:
- related tasks in same bed/zone can be grouped into work bundles.

Bundle contract:

```txt
TaskBundle {
  bundle_id,
  source_ref,
  task_ids[],
  bundle_title,
  suggested_execution_window
}
```

Example bundle:
- Berry Bed
- harvest strawberries
- inspect pests
- remove runners

## Calendar Surface Contract (Primary)

Calendar is the primary temporal task view.

Task card fields in timeline:
- task title
- source location
- recommended window
- quick complete action

Supported inline actions:
- complete
- skip
- reschedule
- add note
- open source context

Calendar grouping options:
- today
- this week
- next week
- later

## My Property Surface Contract (Secondary)

My Property exposes tasks contextually by level.

Scope rules:
- property level: aggregate across property.
- zone level: tasks scoped to zone descendants.
- bed level: tasks scoped to bed and plant descendants.
- plant level: tasks scoped to specific plant.

Context rendering behavior:
- task lists stay in right drawer tasks mode.
- source labels remain explicit for each entry.

## Right Drawer Task Mode Contract

Drawer mode support:
- My Property: `info | tasks | actions`
- Calendar: dynamic modes including `tasks` core mode

Task mode sections:
- today
- this week
- upcoming
- completed

Filter support:
- zone
- bed
- plant
- task type
- urgency
- state

Drawer behavior rules:
- filter and sort state persists while switching views where feasible.
- selecting a task should never lose current spatial or temporal anchor unexpectedly.

## Completion, Logging, and Outcome Capture

Completion methods:
- quick checkbox completion
- completion with optional note
- completion with structured logging prompt for relevant task types

Structured prompt examples:
- harvest task -> `How much did you harvest?`
- watering task -> `How much water applied?` (optional)

Completion log contract:

```txt
TaskCompletionLog {
  completed_at,
  note?,
  quantity_value?,
  quantity_unit?,
  observed_issues?
}
```

## Skip, Delay, and Reschedule Behavior

Users can:
- skip task
- delay task
- move task to specific future day/window

Behavior rules:
- skip is neutral and not penalized.
- delayed and rescheduled tasks retain source continuity.
- repeated deferrals may lower focus priority automatically.

## Manual and Recurring Task Creation

Manual task creation flow:
1. open actions
2. choose add task
3. enter title
4. optionally link source context (zone, bed, plant)
5. choose time window
6. save

Recurring task support:
- recurring frequency options (for example weekly, monthly)
- recurring instances appear automatically with source linkage

Recurring contract:

```txt
RecurringTaskRule {
  rule_id,
  title,
  source_ref?,
  frequency,
  next_instance_date
}
```

## Notifications and Delivery Surfaces

Free tier notifications:
- monthly email task summary

Paid tier notifications:
- weekly garden report
- optional SMS reminders
- in-app notifications

Notification principle:
- reminders should reinforce calm planning, not urgency anxiety.

## Task History and Insight Feedback Loop

History behavior:
- completed, skipped, and expired tasks remain traceable by source record.
- task history appears in plant and bed records as care timeline entries.

Example history:
- March 20 planted
- April 10 fertilized
- May 5 pruned
- June 15 first harvest

Insight loop:
- aggregated task outcomes inform later recommendations and prioritization confidence.

## Responsive Behavior (Desktop and Mobile)

### Desktop

Target task workspace:
- timeline plus task list plus insights context
- high visibility of source and scheduling windows

### Mobile

Target behavior:
- simplified weekly timeline and task cards
- swipe actions for complete and reschedule
- fast logging actions with minimal taps

Mobile gestures:
- swipe left -> complete
- swipe right -> reschedule

## Core User Flows

Flow 1: Morning garden check
1. open Calendar
2. review today tasks
3. complete tasks
4. log observations

Flow 2: Bed work review
1. open My Property
2. navigate to bed
3. open right drawer tasks mode
4. complete context tasks

Flow 3: Add manual task
1. open actions
2. add task
3. link bed or zone context
4. schedule for next week
5. save

Flow 4: Weather adjustment
1. weather signal proposes task change
2. user confirms or dismisses
3. timeline and task list update accordingly

## Functional Requirements

FR-01 Task system is not a top-level module and is surfaced through Calendar and My Property.
FR-02 Task taxonomy includes lifecycle, maintenance, watering, seasonal, observation, manual, and ai_suggested types.
FR-03 Every task must have a source reference.
FR-04 Task lifecycle supports suggested, scheduled, completed, skipped, and expired states.
FR-05 Tasks use flexible windows rather than rigid deadlines.
FR-06 Calendar renders primary timeline task views and inline actions.
FR-07 My Property renders spatially scoped task lists per hierarchy level.
FR-08 Right-drawer task mode supports sectioned lists and contextual filters.
FR-09 Completing tasks supports structured logging where relevant.
FR-10 Users can skip, delay, and reschedule without punitive behavior.
FR-11 Recurring manual tasks generate future instances automatically.
FR-12 Weather-driven task adjustments require suggest-confirm interaction.
FR-13 System can bundle related tasks by context.
FR-14 Prioritization highlights a limited weekly focus set.
FR-15 Task history persists in related plant and bed records.
FR-16 Notification surfaces respect free/paid tier rules.
FR-17 Task status and urgency remain coherent across Calendar and My Property.
FR-18 AI suggested tasks can be promoted from suggested to scheduled via user action.

## Non-Functional Requirements

Accessibility:
- task cards and controls are keyboard and assistive-tech accessible.
- swipe-only actions must have equivalent tap/keyboard actions.
- status and urgency indicators are not color-only.

Performance:
- task lists should update quickly when filters or windows change.
- completion and logging interactions should feel immediate.
- weather adjustment proposals should appear in near-real-time with forecast refresh.

Clarity:
- language remains guidance-oriented.
- source context and time windows are always visible.
- focus tasks are emphasized without hiding secondary tasks.

## Paid vs Free Surface Behavior

Free:
- core task generation and completion workflows
- manual task creation
- monthly email summary

Paid:
- AI suggested task generation surfaces
- weekly report delivery
- optional SMS reminders
- deeper predictive prioritization quality

Gating principle:
- baseline task utility remains available free.
- paid adds predictive depth and delivery convenience.

## Out of Scope for Module 05

- full AI suggestion orchestration logic across all modules
- model-selection and inference pipeline internals
- sensor hardware integrations
- enterprise labor assignment workflows
- push/SMS provider implementation specifics

## Acceptance Criteria and Test Scenarios

1. Task source test  
Given generated or manual task, when viewed, then source context is present and linkable.

2. Lifecycle state test  
Given task transitions, when user actions occur, then state changes follow allowed lifecycle semantics.

3. Window model test  
Given active tasks, when rendered, then flexible window labels appear and strict deadline language is avoided.

4. Calendar primary test  
Given Calendar view, when tasks are listed, then timeline cards include title, source, window, and quick complete action.

5. My Property scope test  
Given user at property/zone/bed/plant levels, when viewing tasks mode, then only correct scoped tasks are shown.

6. Completion logging test  
Given harvest completion, when marked complete, then structured outcome prompt appears and saves with history.

7. Reschedule test  
Given scheduled task, when delayed or moved, then updated window persists and source remains unchanged.

8. Weather suggest-confirm test  
Given rainy forecast impacts watering task, when proposal appears, then user confirmation is required before change.

9. Bundling test  
Given multiple related bed tasks, when rendered, then bundle view can group them without losing individual actions.

10. Focus prioritization test  
Given many tasks, when weekly focus renders, then only a constrained set is elevated as focus tasks.

11. Notification tier test  
Given free and paid users, when notification schedules run, then free receives monthly summary and paid receives configured premium reminders.

12. Cross-module coherence test  
Given task viewed in Calendar and My Property, when comparing status and urgency, then values remain consistent.

## Open Questions Deferred to Module 10 (Database Architecture)

- how tasks should support assignees across household and farm-team contexts
- how role permissions should control who can complete, skip, or reschedule shared tasks
- how assignment notifications should be handled when multiple collaborators are active
- how task history should attribute actions to specific users for shared accountability
