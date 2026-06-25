# Iteration 463 - Field Guide Fit Count

Date: 2026-06-24

Surface focus:
- Sample garden Field Guide route
- Authenticated Field Guide result count

## Scope

Make the Field Guide result count speak to the user's planting decision: which plants fit the beds they have.

## Changes

- Changed the Field Guide result count from `plants to consider` to `plants that fit`.
- Updated sample-garden and catalogue-format tests to protect the fit-first wording and keep the older `to consider` phrasing out.

## Evidence

- Live `/sample-garden/catalogue` route-output probe found `Field Guide`, `Choose plants for the beds you have.`, `3 plants that fit`, `Best spot`, and `Good to remember`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `catalogue-format.test.ts` - 2 files, 25 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus focused test verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
