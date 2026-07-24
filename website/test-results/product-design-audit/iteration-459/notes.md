# Iteration 459 - Plant Journal Care Priority

Date: 2026-06-24

Surface focus:
- Sample garden Plant Journal route
- Authenticated Plant Journal shell and empty drawer copy

## Scope

Make the Plant Journal start with the user's immediate need: which plants need care now, while still keeping each plant record available when they want notes.

## Changes

- Changed the Plant Journal shell subtitle from `Open a plant to see what happened and what to do next.` to `Start with the plants that need care.`
- Changed the empty drawer copy from `4 plants in 3 beds. Open a plant to see what happened and what to do next.` to `4 plants in 3 beds. Start with the next check, or open any plant.`
- Changed the no-current-care fallback copy to `Open any plant when you want its notes.`
- Updated sample-garden and empty-state tests to protect the new care-first wording and keep the older abstract sentence out.

## Evidence

- Live `/sample-garden/plants` route-output probe found `Plant Journal`, `Start with the plants that need care.`, `4 plants in 3 beds. Start with the next check, or open any plant.`, and `4 plants to check this week.`
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus focused test verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
