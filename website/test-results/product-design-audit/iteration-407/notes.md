# Iteration 407 - Plant Journal Care Copy

Date: 2026-06-24

## Scope

Align Plant Journal with the simpler `This Week` care model. The previous line said `next care`, which sounded like product workflow language and no longer matched the visible `This week:` labels on plant cards.

## Change

- Changed the Plant Journal subtitle from `Pick a plant to see notes, photos, and next care.` to `Pick a plant to see notes, photos, and this week's care.`
- Applied the same line in the signed-in app title config, sample app title config, and Plant Journal empty drawer guidance.
- Updated sample-garden and empty-state content tests to require the new line and reject the old `next care` phrase.

## Evidence

- Product Design audit/user-context guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/plants` route-output probe found `Pick a plant to see notes, photos, and this week's care.` and did not find `Pick a plant to see notes, photos, and next care.`

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
