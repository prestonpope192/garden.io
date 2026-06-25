# Iteration 322 - My Garden Subtitle

Date: 2026-06-23
Surface: sample app My Garden route
Health: Green

Goal: Make the My Garden subtitle explain the useful daily value of the screen: plants, notes, and care stay with their place.

Changes:
- Changed the My Garden subtitle from `See where each plant lives and what happened there.` to `See where each plant lives, with its notes and care.`
- Updated sample garden tests to require the new subtitle and reject the older passive phrasing.

Files:
- `website/components/garden-app-preview.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused test passed: `sample-garden.test.ts` - 1 file, 13 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/property` contains `See where each plant lives, with its notes and care.`
- Live `/sample-garden/property` did not return old `See where each plant lives and what happened there.` phrase in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
