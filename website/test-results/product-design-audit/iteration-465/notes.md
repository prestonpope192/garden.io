# Iteration 465 - Ask CTA Care-Step Alignment

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/sample-garden/ask`

## Audit Read

The Garden Check screen promised `Show what changed. Get one care step you can save.`, but the primary submit button still said `Get next step`. That made the core value feel less specific right at the action point.

## Change

- Changed the Ask submit button from `Get next step` to `Get one care step`.
- Changed the loading line from `Looking for one useful next step...` to `Looking for one useful care step...`.
- Updated sample-garden and AI-home tests to protect the tighter care-step wording and keep the generic next-step wording out.

## Evidence

- Live route-output probe for `/sample-garden/ask` found `Your garden, smarter.`, `Show what changed. Get one care step you can save.`, `Get one care step`, and `Saved notes help the next check remember.`
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. This pass used source inspection, server-rendered route text, focused tests, full tests, and build verification.
