# Iteration 461 - Homepage One Care Step Promise

Date: 2026-06-24

Surface focus:
- Public homepage hero
- Homepage simple habit section
- Browser/share metadata

## Scope

Make the public homepage match the simpler app promise: save what changed, get one care step, and remember what worked.

## Changes

- Changed the hero lead from `Save what changed. Get the next care step. Remember what worked.` to `Save what changed. Get one care step. Remember what worked.`
- Changed the simple-habit copy from `Add a note or photo. Save the next step with the plant it belongs to.` to `Add a note or photo. Save one care step with the plant it belongs to.`
- Changed the tracking loop card title from `Get the next care step` to `Get one care step.`
- Updated browser/share metadata from `get the next care step` to `get one care step.`
- Updated homepage tests to protect the sharper one-care-step promise and keep the older wording out.

## Evidence

- Live `/` route-output probe found `Your garden, smarter.`, `Save what changed. Get one care step. Remember what worked.`, `Add a note or photo. Save one care step with the plant it belongs to.`, and `Get one care step.`
- Focused tests passed from the website package: `homepage-content.test.ts` and `homepage-visual-css.test.ts` - 2 files, 7 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus focused test verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
