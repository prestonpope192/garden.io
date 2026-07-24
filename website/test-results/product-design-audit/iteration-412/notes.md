# Iteration 412 - Field Guide Choice Count

Date: 2026-06-24

## Scope

Make the Field Guide count read as catalogue options instead of garden inventory. Under the `Plant choices` label, the count `3 plants` could sound like plants already in the user's garden.

## Change

- Changed the Field Guide result count from `3 plants` to `3 plant choices`.
- Changed filtered counts to use `plant choices` as well.
- Updated sample and signed-in catalogue tests to require the new wording while leaving the public catalogue guide count unchanged.

## Evidence

- Product Design audit/user-context guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused tests passed from the website package: `catalogue-format.test.ts` and `sample-garden.test.ts` - 2 files, 25 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/catalogue` route-output probe found `3 plant choices` and did not find the old `Summer 3 plants Annual` sequence.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
