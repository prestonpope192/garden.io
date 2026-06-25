# Iteration 311 - Field Guide Watch-For Copy

Date: 2026-06-23
Surface: `/sample-garden/catalogue`, in-app Field Guide cards
Health: Green

## Goal

Make the in-app Field Guide speak to a gardener choosing plants, not to a user being told what the product can save.

## Changes

- Changed the quick-fit label from `Remember` to `Watch for`.
- Changed herb note copy from `Save harvest timing, heat stress, and flavor notes.` to `Harvest timing, heat stress, and flavor.`
- Changed flower note copy from `Save bloom timing, pollinator visits, and deadheading notes.` to `Bloom timing, pollinator visits, and deadheading.`
- Changed vegetable/vine/fruit note copy from `Save watering, support, harvest, and pest notes.` to `Watering, support, harvest, and pests.`
- Renamed the expandable card action from `More details` to `Field notes`.
- Renamed the internal helper from `getMemoryNote` to `getWatchNote` so the code matches the user-facing concept.
- Updated catalogue tests to require the new wording and reject the older product-command phrasing.

## Files

- `website/components/views/catalogue-view.tsx`
- `website/tests/catalogue-format.test.ts`
- `website/tests/sample-garden.test.ts`

## Evidence

- Product Design audit, Product Design index, user-context preflight, critical overrides, and session-budget guidance were read during this pass.
- Product Design saved context preflight returned no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `catalogue-format.test.ts`, `sample-garden.test.ts`, `public-catalogue-content.test.ts`, and `app-flow-visual-css.test.ts` - 4 files, 45 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/sample-garden/catalogue` contains `Watch for`, `Bloom timing, pollinator visits, and deadheading`, `Harvest timing, heat stress, and flavor`, and `Watering, support, harvest, and pests`.
- Live `/sample-garden/catalogue` did not render the older `Remember` / `Save ... notes` phrases in the route probe.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- This pass covers the in-app Field Guide card copy, not a full public catalogue rewrite.
