# Iteration 376 Notes

Scope: simplify the Garden Check entry copy so it explains the core user value in one quick read.

## Change

- Changed the Ask-screen lead from `Notice what changed, then save what to try next with the plant.` to `Describe what changed. Get a next step you can save.`
- Changed the composer hint from `Your note, photo, and care plan stay together.` to `Save it with the plant for next time.`
- Changed the no-garden start panel from `Give one plant a place.` to `Start with one plant.`
- Changed the no-garden support copy to `Add where it lives once. Notes, photos, and care stay with the right spot.`
- Aligned the app and sample-app route subtitles with the new Garden Check lead.
- Updated focused tests to require the new copy and reject the old product-like phrasing.

## Rationale

The previous Garden Check copy was close, but it still made the user parse the product loop. The new version says the task and payoff directly: describe what changed, get a next step, and save it with the plant for next time.

## Evidence

- Focused tests passed from the website package: `ai-first-garden-home.test.tsx` and `sample-garden.test.ts` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask` returned `200`, contains `Describe what changed. Get a next step you can save.` and `Save it with the plant for next time.`, and does not contain `Notice what changed, then save what to try next with the plant.` or `Your note, photo, and care plan stay together.`
- Live `/app` returned `200` and still contains the signed-out `Start with one plant` gate copy from iteration 375.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
