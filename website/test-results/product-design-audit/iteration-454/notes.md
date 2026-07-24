# Iteration 454 - Weekly Care Start Label

Date: 2026-06-24

Surface focus:
- Sample garden This Week route
- Weekly care attention section

## Scope

Make the weekly care screen answer the user's first question faster: what should I do first?

## Changes

- Changed the weekly attention section label from `Next care` to `Start here`.
- Updated sample-garden tests to keep `Next care` out of the weekly care route.

## Evidence

- Live `/sample-garden/calendar` route-output probe found `Start here`, `3 care steps this week`, `Today`, and `Later this week`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
