# Iteration 203 - First-Run Setup Guide

Date: 2026-06-22

## Scope

Make the first-run My Garden path guide the actual next setup step instead of asking users to pick records that do not exist yet.

## Changed

- Added a record-derived setup guide to My Garden:
  - no areas -> `Next: add one area`
  - areas but no beds -> `Next: add one bed`
  - beds but no growing plants -> `Next: add one plant`
- Each setup state now shows one concrete CTA: `Add first area`, `Add first bed`, or `Add first plant`.
- Hid the generic `Care at a glance` count/pick copy until the garden has a growing plant.
- Kept the mature/sample garden state unchanged: once records exist, it still shows `Care at a glance`, counts, next care, and normal navigation.
- Added regression coverage for the three first-run setup states.

## Why

- A new gardener should not be told to pick an area, bed, or plant before any exist.
- The app's first value moment is record-derived: garden -> area -> bed -> plant.
- This keeps onboarding inside the existing app shell and actions form instead of adding a separate onboarding subsystem.

## Verification

- Focused `npm test -- empty-state-content.test.ts` passed from `website/`: 1 file, 8 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/catalog`, and `/catalog/french-marigold`.
- Source probe confirmed the new setup labels exist and the old generic pick copy remains only for mature gardens/sample-garden coverage.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread; Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
