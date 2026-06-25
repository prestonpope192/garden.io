# Iteration 201 - Plant Question Language Consistency

Date: 2026-06-22

## Scope

Finish aligning homepage, calendar empty states, plant-question failure copy, and saved plant-question notes around the simpler `ask about this plant` mental model.

## Changed

- Replaced homepage `plant checks` copy with `questions`.
- Replaced calendar empty-state `plant checks` copy with `plant questions` and `questions about a plant`.
- Replaced plant-question API failure messages:
  - `We can't look at this plant right now. You can still save a note and try again later.`
  - `A lot of plant questions are queued right now. Please try again in a moment.`
  - `We couldn't finish looking at this plant. Please try again.`
  - `Please sign in to ask about this plant.`
  - `Add what you are seeing or a photo to ask about this plant.`
  - `Looking at this plant is taking too long. Please try again.`
- Replaced rate-limit copy with `plant question limit`.
- Replaced saved note/task text from `Plant check` / `From the plant check` to `Asked about this plant` / `From asking about...`.
- Updated comments and regression coverage so old `plant check` phrasing only remains in negative test assertions.

## Why

- The app now asks gardeners to `Ask about this plant`; surrounding copy should not switch back to `check` or `plant check`.
- `Questions` is closer to the user's felt need: something looks off, they want a next step.
- Failure and limit states should use the same simple language as the happy path.

## Verification

- Focused tests passed from `website/`: `homepage-content.test.ts`, `empty-state-content.test.ts`, `diagnose-panel-content.test.ts`, `diagnose-route-copy.test.ts`, and `quick-log-content.test.ts`, 5 files, 14 tests.
- Full `npm test` passed from `website/`: 18 files, 95 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered route checks returned 200 for `/`, `/sample-garden/calendar`, `/app/my-property`, `/catalog`, and `/catalog/french-marigold`.
- Rendered visible-text probes confirmed `/` contains `Photos, notes, harvests, questions, and next care all stay with the right plant.`
- Rendered visible-text probes found zero visible `plant checks` matches on `/`, `/sample-garden/calendar`, `/app/my-property`, `/catalog`, and `/catalog/french-marigold`.
- Source probe found old `plant check` wording only in negative test assertions.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread; Playwright was not used because explicit approval is required.
- Current proof is source, server-rendered/component tests, build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
