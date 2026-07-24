# Iteration 229 - Mobile Sample Header Simplification

Date: 2026-06-22
Surface: sample garden app shell at `http://127.0.0.1:3021/sample-garden/*`
Mode: focused product-design audit and build pass
Destination: local folder

## User Goal

- Open the sample garden and understand the working product quickly.
- See the main routes without a crowded header.
- Keep the "start my own garden" action visible on mobile.

## Accepted Screenshots

- `screenshots/mobile-sample-property-before.png` - mobile `My Garden` before this pass.
- `screenshots/mobile-sample-calendar-before.png` - mobile `This Week` before this pass.
- `screenshots/desktop-sample-property-before.png` - desktop `My Garden` before this pass.
- `screenshots/mobile-sample-property-after.png` - mobile `My Garden` after this pass.
- `screenshots/mobile-sample-calendar-after.png` - mobile `This Week` after this pass.
- `screenshots/desktop-sample-property-after.png` - desktop `My Garden` after this pass.

## Finding

- The sample garden header was still doing too much on mobile.
- The route labels used long product-ish names: `My Garden`, `My Plants`, and `Find Plants`.
- In the accepted before screenshots, the visible mobile header showed only three route labels and did not make the start action obvious.
- That fought the intended first read: "this is a simple garden record with this week's care."

## Changed

- Shortened sample route labels to `Garden`, `This Week`, `Plants`, and `Find`.
- Shortened the visible sample CTA to `Start` while keeping `aria-label="Start your garden"`.
- Tightened mobile header spacing, brand size, route pill size, and CTA size.
- Added regression coverage for the mobile header CSS and short sample route labels.

## Result

- Final mobile header fits within the measured viewport.
- Final header metrics at 390px viewport:
  - document scroll width: `375px`
  - header width: `375px`
  - nav width: `357.4px`
  - CTA right edge: `366.2px`
  - final route link right edge: `366.2px`
  - overflowing elements: `0`
- The sample now keeps the four routes visible while using simpler, user-facing labels.

## Verification

- Focused `npm test -- mobile-layout-css.test.ts sample-garden.test.ts app-flow-visual-css.test.ts` passed from `website/`: 3 files, 20 tests.
- Full `npm test` passed from `website/`: 22 files, 114 tests.
- `npm run build` passed from `website/`.
- Local standalone production server returned 200 for `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, and both current CSS chunks.
- Served HTML was checked and contains `Garden`, `This Week`, `Plants`, `Find`, and `Start`.
- Final accepted screenshots were captured through Chrome DevTools Protocol from the same measured viewport and saved locally.

## Evidence Limits

- This pass verifies the local production build and sample app shell, not a hosted deployment.
- Screenshot evidence does not prove keyboard order, screen reader behavior, or signed-in write paths.
- The authenticated app benefits from the same mobile header CSS, but the visual proof here uses the unauthenticated sample routes because they expose the full sample navigation without needing auth.

## Recommended Next Action

- Audit the authenticated AI-first garden home next: the composer, quick utility row, and "Garden.io used..." explanation should be checked for whether they read like user value rather than implementation detail.
