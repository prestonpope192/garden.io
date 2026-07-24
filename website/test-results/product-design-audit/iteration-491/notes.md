# Iteration 491 Notes

Scope: make the sample Plants card task label more directly useful for gardeners.

Changed:
- Changed the plant-card task label from `Care:` to `This week:`.
- Updated sample and empty-state content tests to require `This week:` and reject `Care:`.

Evidence:
- Used Product Design audit guidance, Product Design critical overrides, Product Design user-context preflight, current route text, focused tests, full tests, build verification, and Garden.io brand memory.
- Live `/sample-garden/plants` route-output probe found `Plant Journal`, `This week:`, `Water deeply before the hot afternoon`, and `Open one plant to see what happened and what helped.`
- The route probe found `This week:` 4 times and `Care:` 0 times.
- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, `app-flow-visual-css.test.ts`, and `mobile-layout-css.test.ts` - 4 files, 33 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Browser screenshot capture was not available in this thread. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
