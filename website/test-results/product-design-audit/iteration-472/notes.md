# Iteration 472 - This Week Subtitle Copy

Date: 2026-06-24
Surface: `/sample-garden/calendar`, signed-in and sample app wrappers

## Scope

Simplify the This Week section subtitle so it speaks to the gardener's need instead of sounding like task-app mechanics.

## Changed

- Changed the This Week subtitle from `Do the first care step. Let the rest wait.` to `Start with what needs care. Let the rest wait.`
- Updated the sample calendar content test to protect the new wording and reject the older care-step phrasing.

## Evidence

- Live `/sample-garden/calendar` route-output probe found `Weekly care`, `This Week`, `Start with what needs care. Let the rest wait.`, `3 care steps this week`, `Today`, and `Later this week`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

## Limit

Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
