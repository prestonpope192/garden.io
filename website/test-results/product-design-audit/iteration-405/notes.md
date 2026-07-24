# Iteration 405 - Garden Check Save Hint

Date: 2026-06-24

## Scope

Make the Garden Check composer hint match the actual save model. The old hint said the answer stays with a plant, but the flow can save garden checks to the right plant, bed, area, or whole garden.

## Change

- Changed the Garden Check composer hint from `Keep it with the plant for next time.` to `Keep it with the right plant or bed.`
- Updated Garden Check content tests to require the broader user-facing hint and reject the old plant-only wording.

## Evidence

- Used orchestratror-mode to keep judgment in the main thread and use bounded route/source/test checks.
- Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask` route-output probe found `Keep it with the right plant or bed.` and did not find `Keep it with the plant for next time.`

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
