# Iteration 442 - This Week Count Copy

Date: 2026-06-24
Surface focus:
- Sample garden `This Week` route
- Weekly care attention count

## Scope

Remove internal task-status language from the weekly care summary.

## Changes

- Changed `{count} open this week` to `{count} to do this week`.
- Kept the existing `Next care` header and `Today`/`Later this week` flow.

## Evidence

- Live `/sample-garden/calendar` route-output probe found `Next care` followed by `3 to do this week`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
