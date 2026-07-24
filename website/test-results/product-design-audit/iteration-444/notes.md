# Iteration 444 - My Garden Next Action Copy

Date: 2026-06-24
Surface focus:
- Sample garden `My Garden` route
- Property drawer next-care guide sentence

## Scope

Make the My Garden guide sentence match the actual next action, so it does not tell the user to open a bed when the visible action opens a plant.

## Changes

- Changed the next-care guide sentence from a fixed `Open a bed to see what happened there.` to dynamic copy that names the next plant, bed, area, or garden.
- In the sample garden, this now reads `4 plants in 3 beds. Open Bell Pepper to see what happened there.`

## Evidence

- Live `/sample-garden/property` route-output probe found `4 plants in 3 beds. Open Bell Pepper to see what happened there.`
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
