# Iteration 448 - Homepage Habit Loop Copy

Date: 2026-06-24
Surface focus:
- Homepage `Simple garden habit` section
- Tracking loop cards

## Scope

Make the supporting homepage habit loop match the simpler hero promise and avoid abstract `useful answer` wording.

## Changes

- Changed `Add a note or photo. Save the useful answer with the plant it belongs to.` to `Add a note or photo. Save the next step with the plant it belongs to.`
- Changed `Get one care step` to `Get the next care step`.
- Changed the third card description from the longer answer-framing sentence to `Start with where it grows and what you already noticed.`

## Evidence

- Live `/` route-output probe found `Add a note or photo. Save the next step with the plant it belongs to.`, `Get the next care step`, and `Start with where it grows and what you already noticed.`
- Focused homepage test passed from the website package: `homepage-content.test.ts` - 1 file, 5 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
