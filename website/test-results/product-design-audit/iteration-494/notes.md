# Iteration 494 - Calendar Weekly Count Copy

Scope: make the sample Calendar weekly count faster to understand for gardeners.

Changed:
- Changed the Calendar attention count from `1 thing needs care this week` / `3 things need care this week` to `1 garden job this week` / `3 garden jobs this week`.
- Changed the section aria-label from `Things needing care this week` to `Garden jobs this week`.
- Updated sample garden content tests to require the new wording and reject the old `things need care` phrasing.

Why:
- `Things need care` is vague and reads like internal placeholder language.
- `Garden jobs this week` is shorter, concrete, and fits a gardener's weekly planning mental model.

Evidence:
- Product Design user-context preflight ran. Saved context exists but has no entries, so this pass used route output, source, tests, build output, and Garden.io brand memory.
- Live `/sample-garden/calendar` route-output probe found `3 garden jobs this week`.
- The route probe did not find `3 things need care this week`.
- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, `app-flow-visual-css.test.ts`, and `mobile-layout-css.test.ts` - 4 files, 33 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
