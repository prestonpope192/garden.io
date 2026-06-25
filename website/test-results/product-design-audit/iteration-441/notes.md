# Iteration 441 - Plant Journal Weekly Summary

Date: 2026-06-24
Surface focus:
- Sample garden `Plant Journal` route
- Empty drawer weekly-care summary

## Scope

Make the Plant Journal weekly summary sound like a concrete gardener action instead of the awkward phrase "plants have care."

## Changes

- Changed `1 plant has care this week.` to `1 plant to check this week.`
- Changed `{count} plants have care this week.` to `{count} plants to check this week.`

## Evidence

- Live `/sample-garden/plants` route-output probe found `4 plants to check this week.`
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
