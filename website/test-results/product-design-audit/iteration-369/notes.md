# Iteration 369 - Plant Journal Next Up Labels

## Objective

Make the Plant Journal cards read like a next action instead of a data-field label.

## Product Design Read

- Used Product Design audit routing and critical overrides.
- Ran saved Product Design context preflight.
- Used session-budget guidance for build-work verification.
- Used Garden.io memory for the living botanical notebook / smart companion tension.

## Finding

The live `/sample-garden/plants` route showed each plant's upcoming care as:

- `Care note: Water deeply before the hot afternoon`
- `Care note: Harvest cilantro before afternoon heat`

That sounds like a stored field rather than what the gardener should notice next. The Plants route is already organized around care priority, so the label can be simpler and more active.

## Change

- Changed Plant Journal card labels from `Care note:` to `Next up:`.
- Changed the Plant Journal table header from `Care note` to `Next up`.
- Updated focused tests to require the new wording and reject `Care note:` on the Plants route.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/plants` contains `Next up: Water deeply before the hot afternoon` and no longer contains `Care note:`.
- Live `/sample-garden/plants` keeps `Plant Journal` and the next-care plant ordering.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
