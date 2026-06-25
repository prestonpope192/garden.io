# Iteration 457 - Plant Detail Fit Section

Date: 2026-06-24

Surface focus:
- Public plant detail route
- Plant fit guidance section

## Scope

Make the plant detail page frame its guidance as a practical pre-planting check.

## Changes

- Changed the plant detail fit section label from `Find the right spot` to `Before you plant`.
- Updated public catalogue tests to keep the old generic label out of source and rendered plant pages.

## Evidence

- Live `/catalog/apple` route-output probe found `Before you plant`, `Match it to the garden you have.`, and `Check sun, water, soil, and room before you plant.`
- Focused tests passed from the website package: `public-catalogue-content.test.ts` and `catalogue-format.test.ts` - 2 files, 22 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
