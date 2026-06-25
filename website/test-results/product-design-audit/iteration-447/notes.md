# Iteration 447 - Homepage Hero Promise

Date: 2026-06-24
Surface focus:
- Homepage hero
- Browser/share metadata

## Scope

Make the homepage's first value prop faster to understand for a prospective gardener.

## Changes

- Changed the hero lead from the longer notebook sentence to `Save what changed. Get the next care step. Remember what worked.`
- Updated metadata descriptions to the same promise: `Save what changed, get the next care step, and remember what worked.`
- Kept the existing `Your garden, smarter.` headline and the botanical-notebook visual structure.

## Evidence

- Live `/` route-output probe found `Save what changed. Get the next care step. Remember what worked.`
- Focused homepage test passed from the website package: `homepage-content.test.ts` - 1 file, 5 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
