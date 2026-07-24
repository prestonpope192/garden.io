# Iteration 312 - Public Plant Detail Seasonal Copy

Date: 2026-06-23
Surface: `/catalog/[slug]`, public plant detail page
Health: Green

## Goal

Align the public plant detail page with the simplified Field Guide direction: help the gardener decide where a plant fits and what to watch for, without speaking like a product data-capture prompt.

## Changes

- Changed `What to remember` to `Watch this season`.
- Changed `Save bloom timing, weather, photos, and care notes for next season.` to `Bloom timing, weather shifts, pests, and care that helped.`
- Changed the grow callout headline from `Give it a bed.` to `Plant it in the right place.`
- Changed the grow callout support copy from `Once it is planted, keep notes, photos, weather, and care with it.` to `Then keep its notes, photos, weather, and care together.`
- Updated public catalogue tests to require the new copy and reject the previous `Save ... notes` detail-page phrasing.

## Files

- `website/app/catalog/[slug]/page.tsx`
- `website/tests/public-catalogue-content.test.ts`

## Evidence

- Product Design audit, Product Design index, user-context preflight, critical overrides, design-audit framework, and session-budget guidance were read during this pass.
- Product Design saved context preflight returned no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, `sample-garden.test.ts`, and `homepage-content.test.ts` - 4 files, 39 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/catalog/calendula` contains `Watch this season`, `Bloom timing, weather shifts, pests, and care that helped`, `Plant it in the right place`, and `Then keep its notes, photos, weather, and care together`.
- Live `/catalog/calendula` did not render the older `What to remember`, `Save bloom timing...`, `Give it a bed`, or `Once it is planted...` phrases in the route probe.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- This pass covers public plant detail copy only, not a visual layout rewrite.
