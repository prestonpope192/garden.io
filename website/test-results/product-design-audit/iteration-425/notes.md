# Iteration 425 - Field Guide Header Context

Date: 2026-06-24

## Scope

Reduce repeated Field Guide header language and make the page context more directly tied to the gardener's beds.

## Changed

- Changed the Field Guide page kicker from `Plant choices` to `For your beds`.
- Applied the same label in the authenticated app shell and sample preview shell.
- Kept the useful list count `3 plant choices`.
- Updated sample-garden tests to require `For your beds` and reject the old repeated `Plant choices` header.

## Evidence

- Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current route text, and current source/tests were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused test passed from the website package: `sample-garden.test.ts` - 1 file, 13 tests.
- Live `/sample-garden/catalogue` route-output probe found `For your beds`, did not find the old header `Plant choices`, and still found `3 plant choices`.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source readback confirmed `kicker: "For your beds"` in `garden-app.tsx` and `garden-app-preview.tsx`.

## Limit

Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
