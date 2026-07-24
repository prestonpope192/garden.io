# Iteration 470 - App Primary Surface Naming

Date: 2026-06-24
Surface: sample app and signed-in app wrappers around Garden Check

## Scope

Align the app-level name of the primary daily flow with the simplified user-facing screen copy. The visible flow had moved toward a simple garden habit, but the wrapper still called it `Garden Check` and used the older `Show what changed. Save one care step.` subtitle.

## Changed

- Renamed the app-level primary flow title from `Garden Check` to `Today`.
- Changed the app-level primary flow subtitle from `Show what changed. Save one care step.` to `Add what changed. Keep what helped.`
- Changed the app-header return link from `Garden Check` to `Today` in both the signed-in app and the sample garden preview.
- Updated tests to protect `Today`, reject the old `Garden Check` title, and reject the old care-step subtitle.

## Evidence

- Live `/sample-garden/ask` route-output probe found `Today`, `Your garden, smarter.`, `Add a note or photo. Keep what helped with the right plant.`, and `Check this change`.
- Live `/sample-garden/property` route-output probe found `Today`, `Start your garden`, and `My Garden`.
- Focused tests passed from the website package: `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, and `homepage-content.test.ts` - 3 files, 23 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

## Limit

Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
