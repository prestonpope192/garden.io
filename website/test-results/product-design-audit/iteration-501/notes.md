# Iteration 501 - Homepage Botanical Plate Treatment

Date: 2026-06-24
Surface: homepage showcase imagery
Health: Green

## Goal

Make the homepage showcase images feel more like a gardening journal / botanical notebook, using the real plant-art images already available instead of glossy photo-card treatment or old SVG placeholders.

## Change

- Changed homepage hero/card alt and aria language from generic `garden image` / `garden note` wording to `botanical plate`.
- Applied the existing specimen-art visual treatment to homepage showcase images:
  - `object-fit: contain`
  - paper-like padding
  - subtle plate border
  - softened `saturate(0.78) contrast(0.96)` filter
- Kept the current plant-art set: Apple, Borage, and Bouquet Dill. Local inspection confirmed these are botanical plates, not ordinary full-color garden photos.

## Files

- `website/app/page.tsx`
- `website/app/globals.css`
- `website/tests/homepage-content.test.ts`
- `website/tests/homepage-visual-css.test.ts`

## Evidence

- Product Design audit guidance, Product Design critical overrides, user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Saved and inspected current homepage showcase assets:
  - `iteration-501/images/apple.jpg`
  - `iteration-501/images/borage.jpg`
  - `iteration-501/images/bouquet-dill.jpg`
- Route probe of `/` found `Apple botanical plate`, `plant-art%2Fapple.jpg`, `plant-art%2Fborage.jpg`, and `plant-art%2Fbouquet-dill.jpg`; it did not find `Apple garden image`, `/art/specimen-`, or `.svg`.
- Route probe of `/sample-garden/plants` found `plant-art%2Fborage.jpg` and `plant-art%2Fbouquet-dill.jpg`; it did not find `/art/specimen-` or `.svg`.
- Focused homepage tests passed: `homepage-content.test.ts` and `homepage-visual-css.test.ts` - 2 files, 7 tests.
- Broader image/copy tests passed: `homepage-content.test.ts`, `homepage-visual-css.test.ts`, `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `sample-garden.test.ts` - 5 files, 42 tests.
- Full `npm test` passed: 23 files, 131 tests.
- `npm run build` passed.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- This pass improves the homepage presentation of existing plant-art assets. It does not yet audit every plant image surfaced deeper in signed-in flows.
