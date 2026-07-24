# Iteration 317 - Plant Journal Copy

Date: 2026-06-23
Surface: sample My Garden, Plants, and plant timeline surfaces
Health: Green

## Goal

Make plant-detail copy feel like a garden notebook instead of a historical record system.

## Changes

- Changed My Garden helper copy from `Open a place or plant for its notes, photos, and history.` to `Open a place or plant for its notes, photos, and care.`
- Changed the My Garden care action from `Open plant history` to `Open plant notes`.
- Changed Plants empty-drawer heading from `Plant history` to `Plant journal`.
- Changed Plants helper copy from `Pick one to see notes, photos, and history.` to `Pick one to see notes, photos, and care.`
- Changed no-plants copy from `care history together` to `care together`.
- Changed plant timeline labels from `Plant history` / `Save to plant history` / `No plant history yet...` to `Plant journal` / `Save to plant journal` / `No plant journal yet...`.
- Updated sample garden, plant timeline, and empty-state tests to require the new notebook-oriented language and reject the old history phrasing.

## Files

- `website/components/views/property-view.tsx`
- `website/components/views/plants-view.tsx`
- `website/components/plant-timeline.tsx`
- `website/tests/sample-garden.test.ts`
- `website/tests/plant-timeline-content.test.ts`
- `website/tests/empty-state-content.test.ts`

## Evidence

- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts`, `plant-timeline-content.test.ts`, and `empty-state-content.test.ts` - 3 files, 23 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/property` contains `Open a place or plant for its notes, photos, and care` and `Open plant notes`.
- Live `/sample-garden/plants` contains `Plant journal`.
- Live route probes did not return the older `Open plant history`, `Open a place or plant for its notes, photos, and history`, or visible `Plant history` phrases for the checked sample routes.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
