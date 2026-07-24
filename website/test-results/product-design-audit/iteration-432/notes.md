# Iteration 432 - Ask Flow Copy Cleanup

Date: 2026-06-24
Route focus:
- `/sample-garden/ask`
- `/app/my-plants` signed-out empty-start path

## Scope

Continue simplifying the Garden Check flow so the primary AI-assisted moment speaks to a gardener's felt need: show what changed, get one useful step, and save it with the right plant or bed.

## Changes

- Changed the Ask textarea label from `Garden note or photo description` to `What changed in your garden?`
- Changed the Ask submit button from `Ask with saved notes` to `Get care step`.
- Changed the loading button copy from `Checking saved notes...` to `Checking garden...`.
- Changed waiting lines from internal context-scanning language to simpler user-facing status copy:
  - `Checking your garden...`
  - `Reading recent notes and the season...`
  - `Looking for one useful next step...`
  - `Reading the photo with your garden notes...`
- Changed the composer hint from `Save what you noticed with the right plant or bed.` to `Add a note or photo. Save the answer with the right plant or bed.`
- Changed first-plant empty-start copy from `Put it in a bed once. Notes, photos, and care stay connected after that.` to `Give one plant a bed. Future checks remember it.`
- Changed the answer-save helper from `Save what you noticed with the right plant or bed so the next check starts in the right place.` to `Save this with the right plant or bed so the next check remembers it.`
- Carried the same first-plant empty-start copy into the signed-out auth gate and Plant Journal empty state.

## Evidence

- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused tests passed from the website package: `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, `auth-gate-content.test.ts`, and `empty-state-content.test.ts` - 4 files, 28 tests.
- Live `/sample-garden/ask` route-output probe found `What changed in your garden?`, `Get care step`, and `Add a note or photo. Save the answer with the right plant or bed.`
- Live `/app/my-plants` signed-out route-output probe found `Give one plant a bed. Future checks remember it.`
- Source scan found the older `Garden note or photo description`, `Ask with saved notes`, `Save what you noticed`, `Checking saved notes`, `Checking your garden notes`, `Put it in a bed once`, and `Notes, photos, and care stay connected` only in negative test assertions.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
