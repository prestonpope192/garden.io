# Iteration 402 Notes

Scope: align Garden Check shortcut labels with the app's main section names.

Changed:
- Changed Garden Check shortcut labels from `Garden notes`, `This week`, and `Field guide` to `My Garden`, `This Week`, and `Field Guide`.
- Updated shortcut aria labels to match the visible section names.
- Updated Garden Check and sample-garden tests to require the unified app vocabulary and reject the old mixed-case shortcut copy.

Evidence:
- Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask` route-output probe found `My Garden`, `This Week`, and `Field Guide`; it found no `Garden notes`, `This week`, or `Field guide`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
