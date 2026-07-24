# Iteration 400 Notes

Scope: align care-task actions with the simplified `This Week` language.

Changed:
- Changed saved-task feedback from `Added to your care list.` / `Back on your care list.` / `Removed from your care list.` to `Added to This Week.` / `Added back to This Week.` / `Removed from This Week.`
- Changed sample-garden task feedback to match the signed-in app.
- Changed visible action labels from `Add to care list`, `See care list`, and `Remove from care list` to `Add to This Week`, `See This Week`, and `Remove from This Week`.
- Updated content tests so the old internal `care list` wording stays out of visible UI labels.

Evidence:
- Product Design audit guidance, Product Design critical overrides, orchestratror-mode guidance, session-budget guidance, Garden.io memory, and current source were used.
- Source scan found the remaining `care list` hits only in tests that reject old wording or describe test scenarios.
- Focused tests passed from the website package: `garden-mutation-copy.test.ts`, `empty-state-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 4 files, 27 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask`, `/sample-garden/calendar`, and `/sample-garden/property` route-output probes found no `care list` text.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
