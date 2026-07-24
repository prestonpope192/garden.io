# Iteration 162 Product Design Audit Notes

Scope: soften past-plant and planting-history wording so saved garden history feels useful instead of punitive.

Changed:
- Replaced the Past plants empty-state line `what failed` with `what struggled`.
- Changed the planting outcome option `Some problems` to `Struggled`.
- Changed compact result wording from `did not work` to `didn't work`.
- Updated performance summaries so failed planting counts use the same conversational wording.
- Updated focused tests to require the new wording and reject the older harsher phrases.

Why:
- Gardeners need to remember what happened without the app sounding judgmental.
- `Struggled` keeps the practical learning value while fitting the product promise: remember the season and know what to adjust next.
- Consistent wording matters because the same saved result can appear in plant history, performance summaries, and future suggestions.

Verification:
- Focused tests passed: `plant-timeline-content.test.ts`, `garden-timeline.test.ts`, `garden-performance.test.ts`, and `empty-state-content.test.ts`, 4 files, 31 tests.
- Full `npm test` passed: 18 files, 90 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Source scan confirms `what failed`, `Some problems`, `Did not work`, and user-facing `did not work` are gone from app copy.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
