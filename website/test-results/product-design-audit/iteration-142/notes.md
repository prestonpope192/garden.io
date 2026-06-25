# Iteration 142: Plant Detail Fit Check

Date: 2026-06-22
Route focus: `/catalog/[slug]`, verified with `/catalog/french-marigold`

## Scope

Simplify the public plant detail page so it reads like a fast garden decision aid instead of an internal plant-profile record.

## Changed

- Reduced the plant detail header to one browse link and one primary `Start your garden` action.
- Removed the duplicate hero CTA row that repeated the same browse/start actions above the fold.
- Replaced `Care needs and garden fit` with `Light, water, size, and care`.
- Replaced `Care guide` with `Plant facts` in the photo/facts card.
- Reframed the main section from `Before you plant it` / `Check the fit in under a minute.` to `Fit check` / `Choose a spot that matches this plant.`
- Replaced `What to notice` with `What to remember`.
- Reframed the save card around keeping details with the bed instead of explaining the product record.
- Added regression coverage that rejects the stale detail-page phrases.

## Why

Prospective gardeners need to know three things quickly: whether the plant fits their bed, what details are worth remembering, and how Garden.io keeps those details connected after planting. The previous detail page repeated actions and used internal-sounding labels that made the page feel heavier than the actual job.

## Verification

- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `sample-garden.test.ts`, 3 files, 25 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for `/`, `/catalog`, `/catalog/french-marigold`, and `/sample-garden`.
- Rendered scan confirms `/catalog/french-marigold` includes `Light, water, size, and care`, `Fit check`, `Choose a spot that matches this plant.`, `What to remember`, and `Keep the details with the bed.`
- Rendered scan confirms the stale phrases are absent and the old duplicate `Browse plants Start your garden Browse plants Start your garden` header sequence is gone.

## Evidence limit

No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
