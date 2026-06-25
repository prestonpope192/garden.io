# Iteration 408 - Garden Check CTA

Date: 2026-06-24

## Scope

Make the Garden Check submit action explain the AI-assisted value in one short phrase. The homepage already says users can check a plant with its notes, but the actual Ask button said `Check garden`, which was more generic than the product promise.

## Change

- Changed the Garden Check submit button from `Check garden` to `Check with notes`.
- Changed the loading label from `Checking...` to `Checking notes...`.
- Updated Garden Check content tests to require the new button label and reject the old generic label.

## Evidence

- Product Design audit/index/user-context guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask` route-output probe found `Check with notes` and did not find `Check garden`.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
