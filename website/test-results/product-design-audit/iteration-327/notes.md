# Iteration 327 - Plants Route Metadata Consistency

Date: 2026-06-24
Surface: Plants route configuration and sample Plants route
Health: Green

Goal: Remove stale Plants route metadata that still used the older generic list-sorting copy.

Changes:
- Changed the Plants route subtitle in `GardenApp` from `Plants with care due soon appear first. Open one for notes and photos.` to `Start with plants that need care. Open one for notes and photos.`
- Updated the sample garden Plants test to inspect the app route config directly, so the stale phrase cannot remain hidden in source while rendered sample copy is clean.

Files:
- `website/components/garden-app.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, orchestratror-mode guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `ai-first-garden-home.test.tsx` - 3 files, 26 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/plants` contains `Start with plants that need care. Open one for notes and photos.`
- Live `/sample-garden/plants` did not return `Plants with care due soon` in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
