# Iteration 318 - Public Catalogue Plant Copy

Date: 2026-06-23
Surface: public catalogue highlighted plant and side preview
Health: Green

## Goal

Keep the public catalogue plant-facing even when database `why_plant_it` copy contains internal visitor or catalogue rationale.

## Changes

- Changed the highlighted plant card to use `getCareSummary(previewProfile)` instead of preferring `previewProfile.why_plant_it`.
- Changed the side preview copy to use `getCareSummary(previewProfile)` instead of preferring `previewProfile.why_plant_it`.
- Added a regression where `why_plant_it` contains internal copy about visitors and logging in while `short_description` contains gardener-facing plant value.
- Updated public catalogue tests to require the plant summary and reject the internal visitor/log-in wording.

## Files

- `website/components/public-catalogue-browser.tsx`
- `website/tests/public-catalogue-content.test.ts`

## Evidence

- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `public-catalogue-content.test.ts` and `catalogue-format.test.ts` - 2 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/catalog` contains `Plant plate`, `Calendula`, and `An easy seasonal flower for edges, pollinator support, and steady cut-and-come-again blooms`.
- Live `/catalog` did not return the older internal `A strong entry point for visitors` or `logging in` phrases.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
