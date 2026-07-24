# Iteration 215 - Calendar Empty-State Next Steps

Date: 2026-06-22

## Scope

Make empty calendar states describe care next steps instead of plant-question mechanics.

## Changed

- Replaced `plant questions have a place to go` with `next steps have a place to go`.
- Replaced `questions about a plant` with `next steps`.
- Kept the empty-calendar paths unchanged:
  - no plants: prompt users to add the first plant
  - plants but no tasks: explain that the care list is empty
- Added regression coverage so the older phrases do not return.

## Why

- `Plant questions` and `questions about a plant` describe the feature category.
- `Next steps` matches the felt need: what should I do next for this garden?
- The calendar empty state now uses the same language as the homepage, My Garden overview, and plant-help panel.

## Verification

- Focused `npm test -- empty-state-content.test.ts` passed from `website/`: 1 file, 8 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- Source probe confirmed `website/components/views/calendar-view.tsx` contains `watering, pruning, harvests, and next steps have a place to go`.
- Source probe confirmed `website/components/views/calendar-view.tsx` contains `Add watering, pruning, harvests, or next steps as they come up.`
- Source probe confirmed `website/components/views/calendar-view.tsx` no longer contains `plant questions have a place` or `questions about a plant`.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed for this pass; no new screenshot capture was attempted.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
