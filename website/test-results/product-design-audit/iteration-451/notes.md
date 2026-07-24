# Iteration 451 - Field Guide Memory Label

Date: 2026-06-24

Surface focus:
- Sample garden Field Guide route
- Public catalogue hero summary
- Plant recommendation cards

## Scope

Make the repeated Field Guide memory label read like helpful garden memory instead of vague save/action language.

## Changes

- Changed `Remember later` to `Good to remember` on signed-in Field Guide plant cards.
- Changed the public catalogue summary label from `Remember later` to `Good to remember`.
- Updated catalogue tests to keep the old label out of sample and public catalogue surfaces.

## Evidence

- Live `/sample-garden/catalogue` route-output probe found `Good to remember` on all three plant cards and no `Remember later`.
- Live `/catalog` route-output probe found `Good to remember` in the public catalogue summary and no `Remember later`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `public-catalogue-content.test.ts` - 2 files, 23 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
