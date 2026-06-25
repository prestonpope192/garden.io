# Iteration 143: Catalogue Action Language

Date: 2026-06-22
Route focus: `/catalog`

## Scope

Simplify the public catalogue browse actions so choosing a plant feels direct and useful, not like opening a documentation page.

## Changed

- Replaced the featured plant CTA `Read care guide` with `View plant`.
- Replaced result-row CTAs `Read guide` with `View plant`.
- Replaced side-preview CTA `Read full guide` with `View plant`.
- Replaced the result-section label `Matching plants` with `Plants to choose from`.
- Replaced the default count label `plants in the guide` with `plants to browse`.
- Replaced the hidden search label `Search plant guide` with `Search plants`.
- Reworded the expanded `All` filter description from `Everything in the plant guide` to `Every plant you can browse`.
- Added regression coverage that rejects the old guide/care-guide action language in the public catalogue.

## Why

A gardener scanning the catalogue is trying to choose a plant that fits a bed, not decide which document to read. `View plant` is shorter, clearer, and matches the cleaned plant detail page better.

## Verification

- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `sample-garden.test.ts`, 3 files, 25 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for `/`, `/catalog`, `/catalog/french-marigold`, `/app`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, and `/sample-garden/catalogue`.
- Rendered scan confirms `/catalog` includes `Plants to choose from`, `plants to browse`, `View plant`, and `Good place to start`.
- Rendered scan confirms stale guide/care-guide actions are absent from the scanned routes.

## Evidence limit

No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
