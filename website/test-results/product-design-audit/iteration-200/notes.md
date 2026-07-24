# Iteration 200 - Plant Question Copy And Sample Care Data

Date: 2026-06-22

## Scope

Make the AI-assisted plant problem flow read like a simple gardener action and remove an internal-sounding care note from sample data.

## Changed

- Renamed the plant problem panel label from `Check this plant` to `Ask about this plant`.
- Changed the panel's primary button from `Check this plant` to `Get a next step`.
- Changed the note shortcut from `Save and check this plant` to `Save and ask about this plant`.
- Replaced plant-check unavailable/photo copy with less product-y wording:
  - `We couldn't look at this plant right now. Try again in a moment.`
  - `Photo you added for this plant`
- Replaced sample data note `Care suggestions should keep this tied to heat and soil moisture.` with `Keep roots cooler and hold soil moisture through the next hot stretch.`
- Updated regression coverage for plant-question copy, quick note copy, and sample calendar/source copy.

## Why

- The homepage now promises `Ask about one plant`; the signed-in plant surface should use the same simple mental model.
- `Get a next step` says what the gardener receives, without talking about AI, diagnostics, or internal systems.
- The sample garden should read like a believable garden, not implementation guidance.

## Verification

- Focused tests passed from `website/`: `sample-garden.test.ts`, `diagnose-panel-content.test.ts`, `quick-log-content.test.ts`, and `empty-state-content.test.ts`, 4 files, 20 tests.
- Follow-up focused tests passed after comment cleanup: `diagnose-panel-content.test.ts`, `quick-log-content.test.ts`, and `sample-garden.test.ts`, 3 files, 13 tests.
- Full `npm test` passed from `website/`: 18 files, 95 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Local route checks returned 200 for `/`, `/catalog`, `/catalog/french-marigold`, `/app/my-property`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, and `/sample-garden/catalogue`.
- Rendered visible-text probes confirmed `/sample-garden/calendar`, `/catalog`, and `/app/my-property` have zero visible matches for `Care suggestions should keep this tied`.
- Source probe found old plant-question phrases only in negative test assertions.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread; Playwright was not used because explicit approval is required.
- Current proof is source, server-rendered/component tests, build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
