# Product Design Audit Iteration 149

Date: 2026-06-22
Surface: homepage
Preview: http://localhost:3020/

## Finding

The homepage had become much simpler than the original, but it still repeated the same memory and next-care promise several times. The strongest remaining issue was copy density: the page made users read similar phrasing instead of giving them one clear reason to care.

## Change

- Changed the hero promise to `Know what you planted, where it is, and what needs care next.`
- Changed the fit note to `For busy gardeners who want the next step to be obvious.`
- Changed the main value headline to `Keep beds, plants, notes, photos, and next care in one place.`
- Changed the three promise cards to `Map what you have`, `Save quick notes`, and `Get the next step`.
- Changed the plant-memory headline to `Each plant keeps its own story.`
- Updated metadata to `Garden.io | Know What Your Garden Needs`.
- Added tests that reject the older repetitive homepage language.

## Verification

- `npm test -- homepage-content.test.ts auth-gate-content.test.ts public-catalogue-content.test.ts sample-garden.test.ts` passed.
- `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered homepage scan passed with required copy present and stale homepage copy absent.
- Visible-text scan across the main public and sample routes found no beta-era or internal product language.

## Evidence Limit

No fresh screenshots were captured because Browser/Chrome capture tools are not available in this thread and Playwright requires explicit approval. This iteration is validated through source checks, component tests, production build, and rendered-route visible-text scans.
