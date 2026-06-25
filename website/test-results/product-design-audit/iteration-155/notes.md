# Iteration 155 Notes

Scope: simplify homepage plant cards so real-photo showcase cards explain the tracking value instead of using the bold line for botanical names.

Changed:
- Replaced the French Marigold card's bold `Tagetes patula` line with `Bloom and companion notes`.
- Replaced the Autumn Sage card's bold `Salvia greggii` line with `Pruning and heat notes`.
- Replaced the Curry Leaf card's bold `Murraya koenigii` line with `Container watering notes`.
- Kept the real plant photos, common names, and plant-specific value notes.
- Updated homepage tests to require the practical record-focus labels and reject the old botanical labels on the homepage.

Why:
- The homepage has about three seconds to explain why a gardener should care.
- The real-photo cards now show what Garden.io remembers for each plant: blooms, pruning, heat stress, watering changes, and companion value.

Verification:
- Focused tests passed: `homepage-content.test.ts`, `public-catalogue-content.test.ts`, and `sample-garden.test.ts`, 3 files, 18 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route homepage scan passed for `/`.
- Rendered scan confirms `/` includes `Bloom and companion notes`, `Pruning and heat notes`, `Container watering notes`, `French Marigold`, `Autumn Sage`, and `Curry Leaf`.
- Rendered scan confirms `/` no longer shows `Tagetes patula`, `Salvia greggii`, `Murraya koenigii`, `/art/specimen-`, or `.svg`.
- Visible-text scan across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app` found no beta, early-access, prototype, working-product, internal, developer, waitlist, taxonomy, confidence, or signal language.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
