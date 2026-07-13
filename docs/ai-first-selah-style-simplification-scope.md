# AI-First Selah-Style Garden.io Simplification Scope

## Objective

Make Garden.io feel as simple and immediate as Selah: open the app, ask a question or upload a photo, receive a useful next step, and let the app use beds, zones, plants, notes, and care history under the hood.

The existing garden data model should remain the product memory. The visible app should stop leading with that model.

## Selah Patterns To Reuse

Evidence from `/Users/preston/Code/selah`:

- `src/components/AppShell.tsx` renders no persistent app chrome. The primary screen owns the experience.
- `tests/tab-free-home.test.ts` explicitly guards against bottom tabs and module-tab routing.
- `src/app/home/page.tsx` centers the first screen on one large prompt: "What are you carrying?"
- The first action is a single send orb, with shuffle/suggestion affordances as quiet helpers.
- Utility actions are small top-right controls: history, account, music, new session.
- After a response, in-page section jumps appear only for the generated content: Prayer, Scripture, Reflect.
- Secondary capture is contextual and docked: "Write a thought" appears after guidance exists.
- `src/app/globals.css` uses a narrow mobile-first frame, warm paper, large serif type, soft brown/gold accents, gentle motion, and low-noise panels.

The durable principle is not "copy Selah's spiritual content." It is:

> one calm primary input, no persistent module tabs, generated guidance first, structured memory second.

## Current Garden.io Friction

Evidence from current Garden.io files:

- `website/components/garden-app.tsx` exposes four top-level tabs: My Garden, This Week, My Plants, Find Plants.
- The authenticated shell leads with a side rail garden map plus record views.
- `website/components/quick-log.tsx` already supports note/photo capture, but it is a floating secondary action.
- `website/components/diagnose-panel.tsx` already supports text/photo AI help, but it is buried inside a selected plant's Actions drawer.
- `website/components/views/property-view.tsx` makes users understand area -> bed -> plant before they can reach the strongest AI flow.

The current app is useful once a grower understands the data model. It is not yet shaped around the user's natural first move: "What is wrong with this?" or "What should I do next?"

## Proposed Product Shape

### New First Screen

Replace the authenticated front door with a Selah-like Garden Home:

- Large, centered prompt:
  - "What are you seeing in the garden?"
  - or "Ask about your garden."
- Photo upload is a first-class sibling to text, not hidden in a drawer.
- One primary send action.
- Quiet ambient prompt examples:
  - "Leaves are yellowing on my tomato."
  - "What should I do after heavy rain?"
  - "Can I plant basil here?"
  - "What needs attention today?"
- No persistent top nav tabs.
- Small utility controls only:
  - garden memory
  - care list
  - history
  - account

### Generated Answer State

After the user asks, show one calm response page:

- User's question/photo summary.
- Clear answer in plain language.
- "Next step" as the lead action.
- "Why I think this" with the context used:
  - plant if known
  - bed/area if known
  - season/weather/location if known
  - recent notes/photos if known
- Actions:
  - Add to care list
  - Save as note
  - Attach to plant/bed
  - Ask a follow-up
- Optional in-page section jumps only after the answer exists:
  - Next
  - Context
  - Save

### Under-Hood Organization

Beds, zones, plants, and notes become the app's memory graph:

- The user should not need to choose an area/bed/plant before asking.
- If context is ambiguous, the response can offer a lightweight attachment step:
  - "Is this about one of these plants?"
  - "Save this to Tomato in Raised Bed 1?"
  - "Create a new plant from this photo?"
- The old area/bed/plant setup guide becomes an optional "organize this garden" path, not a blocking modal.
- The garden map, plant list, catalogue, and calendar remain available as deeper memory views.

## Information Architecture

### Primary

- `/app` and `/app/my-property` should land on the AI-first Garden Home.
- The first visible state is the composer, not the garden map.
- Existing route-level modules become secondary views, not persistent tabs.

### Secondary

- Garden Memory: a drawer or quiet route containing map, areas, beds, plants, and notes.
- Care List: a compact task view surfaced from answer actions and due items.
- Plant Guide: accessible from answer context and search, not a top-level default.
- Account: utility only.

### Suggested Component Direction

- Add a `GardenHomeView` or `GardenAskView` as the authenticated default.
- Keep `PropertyView`, `CalendarView`, `PlantsView`, and `CatalogueView` as drill-in tools.
- Generalize `DiagnosePanel` into a broader ask/photo composer instead of duplicating AI UI.
- Keep `QuickLog` logic, but move its note/photo capture into the primary composer and post-answer save actions.

## Visual Direction

Borrow Selah's simplicity, not its exact branding.

Keep from Garden.io:

- warm paper and ink palette
- field-notebook / botanical memory identity
- serif editorial type
- gentle specimen labels where they clarify content

Reduce:

- visible navigation density
- nested cards inside cards
- always-visible taxonomy labels
- stamps, panels, and notebook metaphors competing on every screen

Adopt from Selah:

- one mobile-first centered input
- large emotional/helpful prompt text
- tiny utility icon actions
- soft full-page background
- one primary action
- generated content sections only after an answer exists
- docked follow-up or save actions after value is delivered

## Implementation Phases

### Phase 1: Tab-Free AI Home Shell

- Create the AI-first authenticated home surface.
- Remove persistent `garden-app-header__nav` from the default app experience.
- Keep account/history/memory utilities as small controls.
- Redirect current authenticated app entry to the new AI home.
- Add tests mirroring Selah's `tab-free-home.test.ts` contract.

### Phase 2: Ask/Photo Composer

- Promote text + photo capture to the main first-screen composer.
- Use existing garden records as optional context.
- If no property exists, allow a general answer and offer to save/create garden context afterward.
- Avoid requiring first area/bed/plant before asking.

### Phase 3: Response Actions And Memory Attachment

- Lead with "Next step."
- Add one-tap actions:
  - add care task
  - save note/photo
  - attach to existing plant/bed
  - create lightweight plant record if needed
- Show the context used, but keep it secondary.

### Phase 4: Secondary Memory Views

- Move map, bed setup, plant list, catalogue, and calendar into secondary navigation.
- Keep the data-management paths intact for power users.
- Reframe setup wizard as an optional organizer, opened from Garden Memory or after the AI response needs missing context.

## Non-Goals For This Redesign Slice

- Do not remove the property/zone/bed/plant schema.
- Do not rebuild public marketing.
- Do not require a complete garden map before AI use.
- Do not make plant catalogue browsing the primary first-run path.
- Do not attempt full autonomous plant identification without clear confidence and user confirmation.

## Open Product Decisions

1. Should the first composer work before a garden/property exists, then create/save context afterward?
2. Should "upload photo only" be enough to ask, or should the UI nudge for a short symptom description?
3. Should Garden Memory be a drawer on the AI home or a separate route?
4. Should the care list be a top-right utility or appear only after AI creates/surfaces tasks?
5. How much Selah-style mobile framing should apply on desktop: centered phone-like frame, or calm full-width responsive page?

## Recommended V1 Direction

For the next build pass:

1. Make `/app/my-property` render a new AI-first Garden Home.
2. Keep the current Garden map reachable through a small "Garden memory" utility.
3. Put text/photo ask at the center of the first screen.
4. Let users ask before setup is complete.
5. Convert the setup wizard into optional organization guidance after the first useful answer.

This preserves the current Garden.io engine while changing the product promise from "set up your garden records" to "ask your garden what to do next."
