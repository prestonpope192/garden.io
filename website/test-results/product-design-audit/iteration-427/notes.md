# Iteration 427 - Homepage Hero Journal Note

Date: 2026-06-24

## Scope

Make the homepage hero plant card read like a journal example instead of a live status claim.

## Changed

- Changed the homepage hero panel label from `Blooming now` to `Bloom note`.
- Updated homepage content tests to require `Bloom note` and reject `Blooming now`.

## Evidence

- Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current homepage source/tests, and rendered local homepage output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused test passed from the website package: `homepage-content.test.ts` - 1 file, 5 tests.
- Live `/` route-output probe found `Bloom note` and did not find `Blooming now`.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source readback confirmed `Bloom note` in `app/page.tsx` and the new/old copy guards in `homepage-content.test.ts`.

## Limit

Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
