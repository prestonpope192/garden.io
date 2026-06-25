# Iteration 452 - Ask Promise Simplification

Date: 2026-06-24

Surface focus:
- Sample garden Ask route
- Garden Check shared app title copy

## Scope

Make the Ask entry read like a fast user promise instead of product-facing explanation.

## Changes

- Changed the Ask lead from `Add a note or photo. Get one useful care step, then save it with the right plant or bed.` to `Show what changed. Get the next care step.`
- Changed the submit action from `Get one care step` to `Get next step`.
- Changed the composer hint from `The next check starts with what you save.` to `Save what happened so next time starts there.`
- Changed the shared Garden Check subtitle to `Show what changed. Save the next care step.`
- Updated Ask tests to keep the older answer/care-step phrasing out.

## Evidence

- Live `/sample-garden/ask` route-output probe found `Your garden, smarter.`, `Show what changed. Get the next care step.`, `Get next step`, and `Save what happened so next time starts there.`
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx` and `sample-garden.test.ts` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
