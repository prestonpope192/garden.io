# Iteration 406 - My Garden Care CTA

Date: 2026-06-24

## Scope

Make the My Garden care prompt action more concrete. The previous action said `Open notes`, which sounded like a generic note archive even though the button opens the plant connected to the next care item.

## Change

- Changed the next-care plant action from `Open notes` to `Open {plant name}`.
- In the sample garden, the action now reads `Open Bell Pepper`.
- Updated the sample-garden content test to require the concrete plant action and reject the old vague label.

## Evidence

- Product Design audit/index/user-context guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused test passed from the website package: `sample-garden.test.ts` - 1 file, 13 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/property` route-output probe found `Open Bell Pepper` and did not find `Open notes`.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
