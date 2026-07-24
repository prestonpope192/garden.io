# Iteration 166 Product Design Audit Notes

Scope: make public Plant Guide search language describe what gardeners can type instead of abstract classification language.

Changed:
- Replaced `Search by sun, water, or purpose` with `Search by name, use, sun, or water`.
- Updated public catalogue regression coverage to require the new phrase and reject the old one.

Why:
- `Purpose` reads like an internal category, while `use` is shorter and closer to how gardeners search for plants.
- Adding `name` makes the search affordance clearer for people who already know the plant they want.
- The Plant Guide should help a prospective user immediately understand how to find a plant that fits a bed.

Verification:
- Focused tests passed from `website/`: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `homepage-content.test.ts`, 3 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Source scan confirms only the new phrase remains in component copy and tests.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.
- Rendered scan confirms `/catalog` includes `Search by name, use, sun, or water` and no longer includes `Search by sun, water, or purpose`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
