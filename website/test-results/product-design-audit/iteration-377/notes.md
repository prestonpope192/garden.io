# Iteration 377 Notes

Scope: simplify the homepage and signed-out promise so it reads as user value instead of product structure.

## Change

- Changed the shared promise from `Keep each plant, place, note, photo, and care plan in one calm garden notebook.` to `Keep plants, notes, photos, and care together in one calm garden notebook.`
- Changed the homepage `How it helps` support line from `Notice what changed, then keep what to try next with the right plant.` to `Describe what changed, then save the next step with the right plant.`
- Updated homepage and auth-gate tests to require the new copy and reject the old list-heavy phrasing.

## Rationale

The previous promise named too many internal objects and made `care plan` feel like a product structure. The new copy is shorter and closer to the felt need: keep the important garden context together so the next action is easier.

## Evidence

- Focused tests passed from the website package: `homepage-content.test.ts` and `auth-gate-content.test.ts` - 2 files, 6 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/` returned `200`, contains `Keep plants, notes, photos, and care together in one calm garden notebook.` and `Describe what changed, then save the next step with the right plant.`, and does not contain `Keep each plant, place, note, photo, and care plan in one calm garden notebook.` or `Notice what changed, then keep what to try next with the right plant.`
- Live `/app` returned `200`, contains the new shared promise, and does not contain the old list-heavy promise.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
