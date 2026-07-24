# Iteration 337 - Field Guide Fit Copy

Date: 2026-06-24
Surface: Field Guide/catalogue view in the app and sample garden
Health: Green

Goal: Make the Field Guide promise describe the gardener's real choice: matching plants to light, water, and beds.

Changes:
- Changed the Field Guide route subtitle from `Find plants that fit the beds you have.` to `Choose plants for your light, water, and beds.`
- Applied the same subtitle to the sample Field Guide override.
- Updated tests to require the new copy and reject the older broad `Find plants...` phrasing.

Files:
- `website/components/garden-app.tsx`
- `website/components/garden-app-preview.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design index, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts`, `catalogue-format.test.ts`, `public-catalogue-content.test.ts`, and `empty-state-content.test.ts` - 4 files, 43 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/catalogue` contains `Choose plants for your light, water, and beds.`
- Live `/sample-garden/catalogue` did not return `Find plants that fit the beds you have.` in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
