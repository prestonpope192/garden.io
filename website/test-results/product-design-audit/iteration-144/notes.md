# Iteration 144: Sample Plant Guide Fit Language

Date: 2026-06-22
Route focus: `/sample-garden/catalogue` and shared in-app Plant Guide copy

## Scope

Simplify the sample and app Plant Guide so it feels like choosing plants for real beds, not comparing catalogue data.

## Changed

- Replaced the shared Plant Guide subtitle `Compare sun, water, and space before you choose what to grow.` with `Choose plants that fit your beds.`
- Applied the same subtitle to the sample garden Plant Guide.
- Replaced the plant-card `Fit` row label with `Best spot`.
- Reworded the fit fallback from `Match by light, water, and available space.` to `Choose a spot with the right light, water, and room.`
- Reworded the care fallback from `Check care needs and garden fit before choosing a spot.` to `Check light, water, and space before choosing a spot.`
- Added regression coverage that rejects the old compare-heavy subtitle and `Fit` row label.

## Why

The sample garden should show a prospective gardener the simple job: choose plants that fit the beds they already have. `Compare` made the page sound like an analysis workflow, while `Best spot` points directly to the practical decision.

## Verification

- Focused tests passed: `sample-garden.test.ts`, `catalogue-format.test.ts`, and `public-catalogue-content.test.ts`, 3 files, 25 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for `/sample-garden/catalogue`, `/sample-garden/plants`, `/sample-garden/calendar`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/`.
- Rendered scan confirms `/sample-garden/catalogue` includes `Choose plants that fit your beds.`, `Best spot`, and `3 plants`.
- Rendered scan confirms stale compare/care-guide language is absent from the scanned routes.

## Evidence limit

No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
