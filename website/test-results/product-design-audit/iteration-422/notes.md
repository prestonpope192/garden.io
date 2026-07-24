# Iteration 422 - Ask Screen Saved-Notes Button

Date: 2026-06-24

## Scope

Make the Garden Check submit action match the homepage promise that useful answers start from saved garden notes.

## Changed

- Changed the Garden Check submit button from `Check with notes` to `Ask with saved notes`.
- Changed the loading button text from `Checking notes...` to `Checking saved notes...`.
- Updated direct Garden Check and sample-garden tests to require the new phrase and reject the old button wording.

## Evidence

- Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, current Ask screen source/tests, and rendered local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused test passed from the website package: `ai-first-garden-home.test.tsx` and `sample-garden.test.ts` - 2 files, 18 tests.
- Live `/sample-garden/ask` route-output probe found `Ask with saved notes` and did not find `Check with notes`.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source readback confirmed `Ask with saved notes` and `Checking saved notes...` in the Garden Check submit button.

## Limit

Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use is blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
