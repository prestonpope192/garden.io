# Iteration 435 - Field Guide Memory Label

Date: 2026-06-24
Route focus:
- `/sample-garden/catalogue`
- signed-in Field Guide card component

## Scope

Continue simplifying the sample Field Guide so its plant cards read like gardener-facing decisions and reminders, not tracking-system prompts.

## Changes

- Changed Field Guide card label from `Keep notes on` to `Remember later`.
- Kept the card order intact: `Best spot`, `Sun`, `Water`, then the reminder prompt.
- Reused the same `Remember later` language already introduced in the public catalogue summary.

## Evidence

- Focused tests passed from the website package: `sample-garden.test.ts` and `catalogue-format.test.ts` - 2 files, 25 tests.
- Live `/sample-garden/catalogue` route-output probe found `Remember later` for Bell Pepper, Borage, and Bouquet Dill.
- Source scan found `Keep notes on` only in negative test assertions.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
