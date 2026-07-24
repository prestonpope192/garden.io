# Iteration 440 - Homepage Habit Copy

Date: 2026-06-24
Surface focus:
- Homepage simple habit section
- Garden Check value bridge

## Scope

Make the homepage habit copy describe the useful saved answer a gardener gets, instead of saying to keep abstract "care" with a plant.

## Changes

- Changed `Add a note or photo. Keep the care it needs with the plant it belongs to.` to `Add a note or photo. Save the useful answer with the plant it belongs to.`
- Kept the surrounding heading `Notice the change before you act.` because it is direct and user-facing.

## Evidence

- Live `/` route-output probe found `Notice the change before you act.` followed by `Add a note or photo. Save the useful answer with the plant it belongs to.`
- Focused tests passed from the website package: `homepage-content.test.ts` and `auth-gate-content.test.ts` - 2 files, 7 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
