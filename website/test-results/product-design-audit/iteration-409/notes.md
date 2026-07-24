# Iteration 409 - My Garden Bed Guidance

Date: 2026-06-24

## Scope

Make the My Garden guide sentence read like a natural user instruction. The previous line, `Open any bed for notes and photos.`, was short but clipped; it sounded more like an internal action label than plain guidance.

## Change

- Changed `Open any bed for notes and photos.` to `Open any bed to see notes and photos.`
- Updated the sample-garden content test to require the more natural line and reject the old phrasing.

## Evidence

- Product Design audit/index/user-context guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused test passed from the website package: `sample-garden.test.ts` - 1 file, 13 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/property` route-output probe found `Open any bed to see notes and photos.` and did not find `Open any bed for notes and photos.`

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
