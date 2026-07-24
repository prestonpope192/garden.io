# Iteration 157 Notes

Scope: simplify the in-app Plants screen so plant cards show practical garden identity before botanical names.

Changed:
- Replaced visible botanical-name secondary text on growing, archived, wishlist, list-row, and selected-drawer plant summaries with type/lifecycle labels such as `Flower · Annual` and `Shrub · Perennial`.
- Kept botanical names searchable through the existing filter logic and still available in catalogue/detail contexts.
- Updated fallback demo plant data so sample plants carry separate practical plant type and lifecycle values.
- Updated sample garden regression tests to require practical labels and reject Latin names in the Plants screen fast-scan list.

Why:
- The Plants screen is a daily care surface, not a plant encyclopedia.
- A gardener choosing what to check next benefits more from `Flower · Annual`, `Shrub · Perennial`, location, and next care than from a Latin name.

Verification:
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `plant-timeline-content.test.ts`, 3 files, 18 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route Plants scan passed for `/sample-garden/plants`.
- Rendered scan confirms `/sample-garden/plants` includes `Flower · Annual`, `Shrub · Perennial`, `French Marigold`, `Autumn Sage`, and `Curry Leaf`.
- Rendered scan confirms `/sample-garden/plants` no longer shows `Tagetes patula`, `Salvia greggii`, or `Murraya koenigii`.
- Visible-text scan across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app` found no beta, early-access, prototype, working-product, internal, developer, waitlist, taxonomy, confidence, or signal language.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
