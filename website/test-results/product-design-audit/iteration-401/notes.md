# Iteration 401 Notes

Scope: remove remaining `care step` product phrasing from the homepage and Garden Check promise.

Changed:
- Changed the Garden Check subtitle from `Describe what changed. Save the next care step.` to `Describe what changed. Save the care it needs.`
- Changed the homepage daily-rhythm copy from `Keep the care step with the plant it belongs to.` to `Keep the care it needs with the plant it belongs to.`
- Updated `docs/current-state.md` so the cold-start app description says users save useful notes or care with the right garden record.
- Updated homepage and Garden Check content tests to require the new wording and reject the old `care step` phrase.

Evidence:
- Product Design audit/index/user-context guidance, Product Design critical overrides, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused tests passed from the website package: `homepage-content.test.ts`, `sample-garden.test.ts`, and `ai-first-garden-home.test.tsx` - 3 files, 23 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/` route-output probe found `Keep the care it needs` and no `care step`.
- Live `/sample-garden/ask` route-output probe found `Save the care it needs` and no `next care step`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
