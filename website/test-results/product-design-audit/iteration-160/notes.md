# Iteration 160 Product Design Audit Notes

Scope: simplify selected-plant management language in the Plants screen.

Changed:
- Replaced both Plants drawer summaries labeled `Change plant status` with `Move this plant`.
- Kept the actual actions direct: `Move to past plants` for growing plants and `Mark as growing again` for past plants.
- Updated the app-copy regression test to require `Move this plant` and reject `Change plant status`.

Why:
- `Status` is app/accounting language.
- Gardeners are deciding what to do with a plant record: move it to past plants or bring it back into growing plants.
- The drawer now reads like a garden action instead of a data-management control.

Verification:
- Focused tests passed: `empty-state-content.test.ts`, `sample-garden.test.ts`, and `quick-log-content.test.ts`, 3 files, 19 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Source scan confirms `Change plant status` is gone from the component and only remains as a negative regression assertion.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
