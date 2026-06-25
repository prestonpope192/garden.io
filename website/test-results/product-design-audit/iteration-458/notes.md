# Iteration 458 - Garden Check Copy Loop

Date: 2026-06-24

Surface focus:
- Sample garden Ask route
- Authenticated Garden Check route copy

## Scope

Make the Ask screen explain the garden loop in one simple user-facing breath: show what changed, get one useful care step, and save the note so the next check has memory.

## Changes

- Changed the Ask page sublead from `Show what changed. Get the next care step.` to `Show what changed. Get one care step you can save.`
- Changed the Ask composer helper from `Save what happened so next time starts there.` to `Saved notes help the next check remember.`
- Aligned the Garden Check shell subtitle from `Show what changed. Save the next care step.` to `Show what changed. Save one care step.`
- Updated focused Ask/sample-garden tests to protect the new copy and keep the older wording out.

## Evidence

- Live `/sample-garden/ask` route-output probe found `Your garden, smarter.`, `Show what changed. Get one care step you can save.`, `Get next step`, and `Saved notes help the next check remember.`
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus focused test verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
