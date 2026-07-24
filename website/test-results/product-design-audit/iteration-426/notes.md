# Iteration 426 - This Week Count Copy

Date: 2026-06-24

## Scope

Make the This Week care count read like a simple weekly garden list instead of an internal care-check category.

## Changed

- Changed the weekly count from `{n} care checks` to `{n} things this week`.
- Updated sample-garden calendar tests to require the new count and reject the old `care checks` phrasing.

## Evidence

- Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current route text, and current source/tests were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused test passed from the website package: `sample-garden.test.ts` - 1 file, 13 tests.
- Live `/sample-garden/calendar` route-output probe found `3 things this week` and did not find `3 care checks`.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source readback confirmed the new count in `calendar-view.tsx` and the new/old copy guards in `sample-garden.test.ts`.

## Limit

Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
