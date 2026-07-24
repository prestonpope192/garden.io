# Iteration 383 Notes

Scope: make the Plant Journal support copy directly describe the user action.

## Change

- Changed the Plant Journal route subtitle from `See what needs care, then keep notes and photos with the right plant.` to `Pick a plant to see notes, photos, and next care.`
- Changed the Plant Journal empty drawer support line to use the same `Pick a plant to see notes, photos, and next care.` phrasing after the plant/bed count.
- Updated focused sample and empty-state tests to require the new line and reject the older abstract wording.

## Rationale

The older line explained the product loop. The new line tells the gardener what to do on the screen and what they will get by opening a plant.

## Evidence

- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/plants` returned `200`, contains `Pick a plant to see notes, photos, and next care.`, and does not contain `See what needs care, then keep notes and photos with the right plant.`

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
