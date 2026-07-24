# Iteration 205 - My Garden Overview Copy

Date: 2026-06-22

## Scope

Simplify the mature My Garden overview so it explains the next action in gardener language instead of listing the app's record hierarchy.

## Changed

- Replaced `Pick an area, bed, or plant to see its notes and next care.` with `Pick a place or plant to see its notes and next care.`
- Kept the useful counts for areas, beds, and growing plants.
- Kept the first-run setup guide unchanged: empty gardens still get `Next: add one area`, `Next: add one bed`, or `Next: add one plant`.
- Added regression coverage for the simplified mature-garden copy and for keeping that mature-garden copy out of first-run setup states.

## Why

- `area, bed, or plant` exposes the app's data model.
- `place or plant` is closer to how a gardener thinks while looking at the garden.
- The overview now keeps the count detail but makes the next action easier to scan.

## Verification

- Focused `npm test -- sample-garden.test.ts empty-state-content.test.ts` passed from `website/`: 2 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- The same probe confirmed `/sample-garden/property` renders `Pick a place or plant to see its notes and next care.` and does not render the old `Pick an area, bed, or plant...` copy.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread, and Computer Use could not attach to a Chrome window in the previous capture attempt.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
