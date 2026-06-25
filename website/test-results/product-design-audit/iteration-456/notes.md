# Iteration 456 - Public Field Guide Fit Promise

Date: 2026-06-24

Surface focus:
- Public catalogue route
- Field guide hero lead

## Scope

Make the public field guide explain its value as planting fit, not search mechanics.

## Changes

- Changed the public field guide lead from `Search by sun, water, space, and use before you plant.` to `Check sun, water, soil, and room before you plant.`
- Updated public catalogue tests to keep the old search-mechanics lead out.

## Evidence

- Live `/catalog` route-output probe found `Choose the right plant for the right spot.`, `Check sun, water, soil, and room before you plant.`, and `Match the spot`.
- Focused tests passed from the website package: `public-catalogue-content.test.ts` and `catalogue-format.test.ts` - 2 files, 22 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
