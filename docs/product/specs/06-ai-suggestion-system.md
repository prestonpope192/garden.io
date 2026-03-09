# AI Suggestion System Module Spec

## Document Status and Scope

- Status: canonical Module 06 product specification.
- Effective date: March 9, 2026.
- Module role: ambient intelligence layer across Garden.io.
- Product position: not a primary navigation module.
- Scope: suggestion surfaces, trigger logic, diagnosis workflows, task conversion, and interaction contracts.
- Out of scope: model serving infrastructure, prompt-ops internals, and vendor-specific ML implementation details.

Reference sources:
- Cornell Small Farms Program crop planning: https://smallfarms.cornell.edu/resources/crop-planning/
- USDA Plant Hardiness Zones: https://planthardiness.ars.usda.gov
- FAO crop planning tools: https://www.fao.org/land-water/databases-and-software/crop-planning

## Module North Star and Ambient Role

AI should feel like an experienced gardener quietly advising the user while they work.

North-star statement:
- guidance appears as contextual annotations and timely nudges, not a chat-first interface.

Interaction hierarchy:
1. embedded suggestions, insights, warnings, opportunities
2. contextual actions (add task, add plant, add note)
3. lightweight direct AI interaction when user requests it

## Core Philosophy Contract

The AI system follows three mandatory rules:

1. Context first  
AI uses current context: property, zone, bed, plant, season, weather, region.

2. Minimal chat  
Primary surfaces are panels and inline recommendation cards; chat is secondary.

3. Actionable advice  
Suggestions must recommend concrete next actions, not just descriptive facts.

Tone examples:
- preferred: `Consider planting basil with tomatoes to deter pests.`
- avoid: `Tomatoes and basil are companion plants.`

## AI Surface and Entry-Point Contracts

AI entry points:
- recommendation panels at each hierarchy level
- insight notifications from weather and seasonal changes
- plant health diagnosis flow from photo upload
- AI task suggestions and task conversion actions
- persistent AI widget for quick interactions

System positioning rule:
- AI appears within user workflows in `My Property`, `Calendar`, `My Plants`, and `Plant Catalogue` rather than requiring module switching.

## Shared Context and Suggestion Object Contracts

Context envelope:

```txt
AISuggestionContext {
  property_id,
  zone_id?,
  bed_id?,
  plant_id?,
  time_slice?,
  region_profile?,
  weather_snapshot?,
  season_phase?
}
```

Suggestion contract:

```txt
AISuggestion {
  suggestion_id,
  suggestion_type,     // suggestion | insight | warning | opportunity
  title,
  rationale,
  recommended_action,
  source_signals[],
  confidence,
  context,
  created_at
}
```

Confidence display rule:
- low-confidence guidance must be phrased as possibility with suggested verification step.

## Recommendation Panels by Hierarchy Level

### Property-level

Focus:
- high-level system opportunities and portfolio patterns.

Examples:
- add a pollinator zone
- identify partial-shade beds suitable for selected herbs
- regional suitability suggestions tied to soil and climate

### Zone-level

Focus:
- microclimate, infrastructure, and composition patterns.

Examples:
- add groundcover in orchard zones
- introduce nitrogen fixers near fruit trees
- fill pollinator-support gaps

### Bed-level

Focus:
- highest-value tactical recommendations.

Examples:
- add companion plants
- reduce crowding via thinning
- apply mulch for moisture retention

### Plant-level

Focus:
- plant-specific care timing and risk signals.

Examples:
- stake soon
- inspect for pest risks next warm week
- harvest window approaching

## Trigger and Timing Model

AI should appear at meaningful moments, not continuously.

Primary triggers:
- lifecycle stage transitions
- weather shifts and alerts
- season transitions
- user observations and issues
- task completions and outcomes

Trigger contract:

```txt
AISuggestionTrigger {
  trigger_type,
  trigger_source_id?,
  context,
  generated_suggestions[]
}
```

Frequency rule:
- throttle repeated suggestions unless context changes materially.

## AI-to-Task Conversion Contract

Any actionable suggestion can be converted into a task by user action.

Flow:
1. AI shows suggestion
2. user selects `Add as task`
3. system creates task with source `ai_suggestion`
4. task appears in Calendar and scoped My Property task views

Conversion contract:

```txt
AIDerivedTask {
  task_id,
  suggestion_id,
  source_type="ai_suggestion",
  state="scheduled",
  task_window,
  context
}
```

## Plant Health Diagnosis Workflow

Entry points:
- AI widget photo action
- plant-level `Report Issue` action

Workflow:
1. user uploads photo
2. user can add optional text description
3. AI evaluates visual patterns and contextual signals
4. system returns likely causes, confidence, and next steps
5. user can create follow-up tasks

Diagnosis output contract:

```txt
PlantDiagnosisResult {
  diagnosis_id,
  probable_causes[],
  confidence,
  recommended_actions[],
  follow_up_window?
}
```

Example:
- possible nitrogen deficiency
- actions: add compost, monitor for one week

## Observation Interpretation Workflow

Observation note handling:
- user enters textual observation
- AI proposes possible causes, checks, and preventative steps
- user can accept, dismiss, or convert advice into tasks

Interpretation contract:

```txt
ObservationInterpretation {
  observation_id,
  candidate_causes[],
  inspection_steps[],
  preventative_actions[],
  confidence
}
```

## WeatherIQ, WaterIQ, and HarvestIQ Integration

WeatherIQ signals:
- rain patterns
- temperature swings
- frost risk
- heat waves

WaterIQ signals:
- estimated next watering window
- suppression/adjustment recommendations from rainfall context

HarvestIQ signals:
- predicted harvest windows
- yield prompt suggestions

Integration rule:
- IQ systems emit explainable signals that map to user-facing AI suggestions and optional task generation.

## Rotation and Companion Intelligence

Rotation guidance:
- analyzes prior bed history and recommends next crops for soil and pest balance.

Companion guidance:
- analyzes current bed composition and recommends beneficial additions or conflict avoidance.

Examples:
- after tomatoes: suggest beans, lettuce, carrots
- with tomatoes/peppers: suggest basil and marigold

## AI Widget Contract

Widget behavior:
- persistent minimal widget in lower screen corner.
- available across app surfaces.

Widget quick actions:
- ask a question
- upload plant photo
- add observation
- generate plant entry (eligible users only)

Interaction rule:
- widget must not obscure primary workflow controls.

## Learning and Personalization Loop

AI learns from:
- plant success and failure patterns
- yield and task outcomes
- user notes and feedback
- regional and community trend signals

Example personalized insight:
- tomatoes consistently yield well in this bed
- lettuce repeatedly struggles in late-summer heat in this zone

Personalization guardrail:
- local property history should be weighted above generic global averages when enough local evidence exists.

## Suggestion Feedback Contract

Users can respond to suggestions with:
- helpful
- not relevant
- dismiss

Feedback contract:

```txt
SuggestionFeedback {
  suggestion_id,
  feedback_type,    // helpful | not_relevant | dismissed
  user_id,
  created_at
}
```

Feedback rule:
- dismissed suggestions reduce repetition in similar context.

## Community Data Integration

Community signals can inform AI recommendations:
- regional success trends
- common companion practices
- context-rich comments

Usage rule:
- community-derived signals are advisory and must remain distinguishable from authoritative agronomic guidance.

## Paid vs Free AI Scope

Free tier:
- limited baseline suggestions and annotations
- no advanced diagnosis workflow
- no AI-generated plant entries

Paid tier:
- plant health diagnosis
- AI-generated plant entries
- advanced contextual suggestions
- predictive harvest and WaterIQ depth
- richer cross-module proactive insights

Gating principle:
- free users still receive lightweight guidance; paid unlocks depth and predictive functionality.

## Safety, Trust, and User-Control Guardrails

Required controls:
- clear confidence and rationale language
- non-alarmist warning tone
- always provide user override path
- avoid continuous noisy alerts

Trust rule:
- AI recommendations should include brief "why this is suggested here" context.

## Responsive Behavior (Desktop and Mobile)

### Desktop

Desktop emphasis:
- richer suggestion panels and side insights
- embedded recommendation cards in context sections

### Mobile

Mobile emphasis:
- compact suggestion cards
- one-tap widget menu
- very low-friction photo upload and quick task conversion

## Core User Flows

Flow 1: Companion suggestion to action
1. user opens bed
2. AI panel shows companion recommendation
3. user opens suggested plant in catalogue
4. user adds plant to wishlist or property

Flow 2: Plant health diagnosis
1. user uploads plant photo
2. AI returns likely causes and actions
3. user accepts follow-up task
4. task appears in Calendar and bed context

Flow 3: Planting advice query
1. user opens widget and asks contextual question
2. AI evaluates zone and seasonal context
3. AI returns practical options
4. user saves selected plant to wishlist

Flow 4: Weather-driven guidance
1. weather shift detected
2. AI emits warning/opportunity suggestion
3. user confirms related task adjustments
4. task plan updates without overload

## Functional Requirements

FR-01 AI is ambient and embedded, not a top-level navigation module.
FR-02 AI suggestions are context-scoped by property/zone/bed/plant/time/weather/region signals.
FR-03 Suggestion surfaces exist at property, zone, bed, and plant levels.
FR-04 Suggestion types include suggestion, insight, warning, and opportunity.
FR-05 Trigger system supports lifecycle, weather, seasonal, observation, and task-outcome events.
FR-06 AI suggestions can convert into tasks with source traceability.
FR-07 Plant diagnosis supports photo plus optional note inputs.
FR-08 Observation interpretation supports note-to-action recommendations.
FR-09 WeatherIQ/WaterIQ/HarvestIQ outputs integrate into AI suggestion surfaces.
FR-10 Rotation and companion guidance is available at bed and zone context.
FR-11 Persistent AI widget supports quick actions across modules.
FR-12 Suggestion feedback controls include helpful, not relevant, and dismiss.
FR-13 Community data can inform recommendations with clear source distinction.
FR-14 Paid/free capabilities follow the defined gating policy.
FR-15 AI must remain non-intrusive with throttled and contextual delivery.
FR-16 User can ignore, dismiss, or override AI-driven recommendations.
FR-17 Suggestion rationale and confidence are visible for trust.
FR-18 Cross-module task and suggestion state remains coherent after conversions.

## Non-Functional Requirements

Accessibility:
- suggestion cards and widget actions are keyboard and assistive-tech accessible.
- alerts and status cues are not color-only.
- diagnosis and recommendation text is readable and plain-language.

Performance:
- suggestion rendering should feel immediate at page load and context switches.
- photo diagnosis feedback should return in acceptable interactive time.
- widget interactions should not block primary navigation.

Clarity:
- advice is specific and actionable.
- avoid generic educational-only statements in action contexts.
- include concise rationale without verbosity.

## Out of Scope for Module 06

- full visual brand system and motion language
- global design token architecture
- advanced experimentation framework details
- ML model training data governance implementation internals
- enterprise advisory and compliance workflows

## Acceptance Criteria and Test Scenarios

1. Context relevance test  
Given user at bed level, when AI suggestions render, then recommendations reference bed-specific composition and conditions.

2. Minimal chat test  
Given normal workflow, when user navigates modules, then AI appears primarily in panels/cards rather than full chat.

3. Actionability test  
Given any suggestion, when displayed, then it includes a concrete next action and rationale.

4. Trigger timing test  
Given lifecycle or weather event, when trigger fires, then relevant suggestion appears without duplicate spam.

5. Task conversion test  
Given suggestion with `Add as task`, when user confirms, then task is created and visible in Calendar + My Property context.

6. Photo diagnosis test  
Given uploaded plant photo, when analysis completes, then user receives likely causes, confidence, and actionable steps.

7. Observation interpretation test  
Given observation note input, when interpreted, then candidate causes and preventative steps are returned.

8. IQ integration test  
Given WeatherIQ/WaterIQ/HarvestIQ signals, when context updates, then corresponding AI insights update coherently.

9. Feedback loop test  
Given suggestion dismissed as not relevant, when similar context recurs, then repetition frequency is reduced.

10. Paid boundary test  
Given free and paid users, when using AI features, then gating follows defined scope.

11. Mobile widget test  
Given mobile viewport, when user taps widget, then quick actions are accessible and photo upload is low-friction.

12. Trust and control test  
Given AI recommendation, when user reviews it, then confidence, rationale, and override path are visible.

## Open Questions Deferred to Module 10 (Database Architecture)

- how AI suggestions should be scoped when multiple collaborators share one property
- how AI should handle role-based visibility for sensitive diagnostics or recommendations
- how user-specific feedback should influence shared vs personal suggestion streams
- how AI-generated tasks should assign defaults in multi-user household and team settings
