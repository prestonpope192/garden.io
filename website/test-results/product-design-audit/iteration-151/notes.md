# Product Design Audit Iteration 151

Date: 2026-06-22
Surface: public plant detail pages
Preview: http://localhost:3020/catalog/french-marigold

## Finding

The public plant detail page had useful content, but its labels still made the user translate the page structure. Phrases like `Fit check`, `Good to know`, and `What to remember` were serviceable, but less direct than the gardener's real task: decide before planting, then save useful notes for later.

## Change

- Changed the hero eyebrow to `Before planting`.
- Changed `Plant facts` to `Quick facts`.
- Changed `Good to know` to `Plant type`.
- Changed `Fit check` to `Before you plant`.
- Changed the fit headline to `Choose the right spot.`
- Changed the fit helper to `Check light, water, soil, and room before planting.`
- Changed `What to remember` to `What to save`.
- Changed the next-season note copy to `Save bloom timing, weather, photos, and care notes for next season.`
- Changed the save prompt to `Save it with the right bed.` and `Choose a bed, then keep notes, photos, weather, and care with this plant.`
- Added tests that reject the older plant-detail copy.

## Verification

- `npm test -- public-catalogue-content.test.ts catalogue-format.test.ts` passed.
- `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered scans of `/catalog/french-marigold` and `/catalog/autumn-sage` passed with required copy present and stale detail-page copy absent.
- Visible-text scan across the main public and sample routes found no beta-era or internal product language.

## Evidence Limit

No fresh screenshots were captured because Browser/Chrome capture tools are not available in this thread and Playwright requires explicit approval. This iteration is validated through source checks, component tests, production build, and rendered-route visible-text scans.
