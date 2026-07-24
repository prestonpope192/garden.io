# Iteration 445 - Ask Home User Promise

Date: 2026-06-24
Surface focus:
- Sample garden `Garden Check` / Ask route
- Authenticated app Ask home shared copy

## Scope

Make the Ask home opening read like a gardener-facing promise instead of an internal feature label, while keeping the existing note/photo-to-care-step workflow.

## Changes

- Changed the first visible Ask home heading to `Your garden, smarter.`
- Added a short value sentence: `Add a note or photo. Get one useful care step, then save it with the right plant or bed.`
- Replaced the lower composer hint with `The next check starts with what you save.`
- Updated the shared app shell subtitle for Garden Check to `Ask with a note or photo. Save the useful answer.`
- Promoted the Ask home promise to a real visible `h1` and adjusted the existing journal-style heading CSS.

## Evidence

- Live `/sample-garden/ask` route-output probe found `Your garden, smarter.` followed by the new value sentence and the new save-memory hint.
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
