# Iteration 261 - Plate-Style Plant Showcase

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Scope

Bring the homepage and sample app plant visuals closer to the Garden.io style spec: a living botanical notebook with botanical plates, field-journal surfaces, and restrained natural color.

## Accepted Screenshots

- `screenshots/01-homepage-before-full-mobile.png` - current homepage capture before the plant showcase swap.
- `screenshots/02-plant-section-before-mobile.png` - plant section before the final swap, with Cucumber still in the visual set.
- `screenshots/03-plant-section-after-mobile.png` - homepage plant section after switching to Bell Pepper and preserving full plate crops.
- `screenshots/04-sample-plants-after-mobile.png` - sample My Plants surface after switching the first care plant to Bell Pepper.
- `screenshots/05-sample-catalogue-after-mobile.png` - sample catalogue after switching to Bell Pepper and showing plate images without cover-cropping.

## Finding

The homepage was already using plant-art bucket images, not SVG placeholders. Calendula and Cilantro were strong public-domain botanical plates. Cucumber was a square AI-generated illustration, which was close in intent but less consistent with the field-journal plate direction.

The plant image slots also used cover-cropping. That made tall botanical plates behave like generic photos and, on Bell Pepper, could crop into mostly blank paper.

## Changed

- Replaced Cucumber with Bell Pepper in the homepage showcase.
- Replaced the sample garden fallback Cucumber profile with Bell Pepper.
- Replaced the sample My Plants first-care plant and sample catalogue feature set with Bell Pepper.
- Updated the public catalogue featured slugs to `calendula`, `cilantro`, and `bell-pepper`.
- Changed homepage and catalogue plant images from `object-fit: cover` to `object-fit: contain` so botanical plates remain visibly plate-like.
- Removed inline `objectFit: "cover"` overrides from catalogue image components.
- Updated tests to lock the new plate-backed feature set and reject the old Cucumber showcase image.

## Result

The public homepage and first sample app surfaces now lean more clearly into the garden-journal/specimen-plate direction. The visible feature trio is Flower, Herb, Vegetable, and all three use botanical plate-style images rather than generic full-color garden photos or old SVG specimen art.

## Evidence

- Live DOM check at `http://127.0.0.1:3021/?audit=261b#plants` confirmed Bell Pepper appears, Cucumber is absent, SVGs are absent, and homepage plant images use `object-fit: contain`.
- Live DOM check at `http://127.0.0.1:3021/sample-garden/plants?audit=261b` confirmed Bell Pepper appears as the first care plant and Cucumber is absent.
- Live DOM check at `http://127.0.0.1:3021/sample-garden/catalogue?audit=261b` confirmed Bell Pepper appears, Cucumber is absent, and catalogue plate images use `object-fit: contain`.
- Focused tests passed: `homepage-content.test.ts`, `sample-garden.test.ts`, `public-catalogue-content.test.ts`, `homepage-visual-css.test.ts`, and `app-flow-visual-css.test.ts`, 5 files, 35 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limits

This pass did not audit every plant image in the full catalogue. It focused on the homepage showcase and the sample app path that prospective users reach from the homepage.
