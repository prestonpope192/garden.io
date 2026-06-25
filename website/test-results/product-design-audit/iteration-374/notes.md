# Product Design Audit Iteration 374

Date: 2026-06-24
Surface: Public plant detail pages

## Objective

Continue simplifying public plant detail copy so it helps a gardener decide whether a plant belongs in their garden, instead of reading like catalogue metadata.

## Finding

The public plant detail pages had a useful seasonal fact list, but the labels `Good for` and `Planting method` still sounded a little like catalogue fields. The rest of the page has moved toward direct guidance like `Where it belongs`, `Watch this season`, and `Grows as`.

## Changes

- `Good for` -> `Use it for`.
- `Planting method` -> `Start from`.
- Updated `public-catalogue-content.test.ts` to protect the new labels and reject the old labels.

## Evidence

- Focused tests passed: `npm test -- public-catalogue-content.test.ts`
- Full tests passed: `npm test` with 23 files and 130 tests.
- Production build passed: `npm run build`.
- Whitespace check passed: `git diff --check`.
- Live route probe against `http://127.0.0.1:3021/catalog/french-marigold` returned `200` and confirmed `hasUseItFor: true`, `hasGoodFor: false`, and `hasPlantingMethod: false`.
- Live route probe against `http://127.0.0.1:3021/catalog/cilantro` returned `200` and confirmed the same labels.

## Remaining Risk

- Screenshot capture was not available in this session, so visual spacing and wrapping for the changed labels were verified through tests, build, and live route text only.
- The `Start from` label only renders when propagation labels exist; the checked live routes did not expose that row, so the label is protected by source/test coverage.
