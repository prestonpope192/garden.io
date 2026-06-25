# Iteration 159 Product Design Audit Notes

Scope: simplify first garden setup so a new gardener starts with one obvious action instead of optional setup fields.

Changed:
- Removed the optional first-run section for garden kind, location/region, growing zone, and current season.
- Rewrote the first-run helper line to `Just give it a name. Add location, beds, and plants as you go.`
- Left location, growing zone, season, and garden-kind editing available after the garden exists.
- Removed the now-unused optional-first-run CSS.
- Updated empty-state tests to require the single-field first garden setup and reject the removed optional setup fields.

Why:
- The first use moment should not feel like configuration.
- A prospective user trying the app needs one clear next step: name the garden, then build the actual garden record one piece at a time.
- Weather/location details still matter, but they are easier to understand after the user has a garden surface to attach them to.

Verification:
- Focused tests passed: `empty-state-content.test.ts`, `garden-mutation-copy.test.ts`, and `sample-garden.test.ts`, 3 files, 18 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Source scan confirms the removed first-run phrases are absent from app/source code except for negative regression assertions.
- Refined rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.
- Confirmed `/app/my-property` still renders the simple sign-in gate for signed-out users.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
