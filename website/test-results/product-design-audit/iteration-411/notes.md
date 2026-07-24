# Iteration 411 - This Week Count Labels

Date: 2026-06-24

## Scope

Make the This Week summary counts name the care work instead of using vague filler. The page said `3 things to check` and `2 more checks`; the rest of the app now talks about weekly care, so those labels were softened but under-specific.

## Change

- Changed the weekly summary count from `3 things to check` to `3 care checks`.
- Changed the later bucket count from `2 more checks` to `2 after today`.
- Updated sample calendar tests to require the new labels and reject the old vague counts.

## Evidence

- Product Design audit/user-context guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused test passed from the website package: `sample-garden.test.ts` - 1 file, 13 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/calendar` route-output probe found `3 care checks` and `2 after today`, and did not find `3 things to check`, `2 more checks`, or the clipped `2 later`.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
