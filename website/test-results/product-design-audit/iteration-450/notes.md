# Iteration 450 - This Week Care Count

Date: 2026-06-24
Surface focus:
- Sample garden `This Week` route
- Weekly care attention header

## Scope

Make the weekly care count feel like garden care instead of a generic task list.

## Changes

- Changed the attention section count from `{count} to do this week` to `{count} care steps this week`.
- Changed the section accessible label from `What to do this week` to `Care steps this week`.
- Updated sample calendar tests to keep the generic `to do this week` wording out.

## Evidence

- Live `/sample-garden/calendar` route-output probe found `3 care steps this week`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
