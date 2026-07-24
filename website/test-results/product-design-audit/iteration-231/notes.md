# Iteration 231 - Public First-Run Flow

Date: 2026-06-22
Destination: local folder
Capture source: current local app at http://127.0.0.1:3021
Audit mode: combined UX, visual, responsive, and reliability pass

## Scope

Flow audited:
1. Homepage first impression.
2. Public plant catalogue from the homepage.
3. Public plant detail from homepage/catalogue plant cards.
4. Sample garden preview as the main "try the product" path.

User goal:
- Understand in a few seconds that Garden.io helps them know what to do next.
- Browse useful real-photo plant records before committing.
- Open the sample garden and see how plants, beds, notes, and next steps stay connected.

Accessibility target:
- Public pages should reflow at phone width without horizontal scrolling.
- Primary actions should remain visible, readable, and large enough to tap.
- Public routes should not fail into server errors when database env is unavailable.

## Accepted Screenshots

- `screenshots/01-homepage-desktop.png` - homepage desktop.
- `screenshots/02-catalogue-desktop.png` - public catalogue desktop.
- `screenshots/03-french-marigold-detail-desktop.png` - public plant detail desktop.
- `screenshots/04-homepage-mobile.png` - homepage mobile, captured through Chrome DevTools device emulation.
- `screenshots/05-sample-garden-desktop.png` - sample garden desktop.

Rejected evidence:
- Plain headless Chrome at `390x900` clipped the mobile homepage because it did not use a reliable mobile layout viewport. Replaced with Chrome DevTools device emulation.

## Findings

Strengths:
- Homepage copy is now user-facing and direct: know what to do next, keep plants/photos/notes/care together, and avoid another spreadsheet.
- Public plant surfaces use real plant photos for French Marigold, Autumn Sage, and Curry Leaf rather than SVG-style placeholders.
- The sample garden now feels like a working product preview, with simple navigation labels and a visible next step tied to an actual garden area.

UX risks found:
- The homepage "Find plants that fit" and plant cards pointed users into public catalogue routes that could fail without database env.
- The mobile homepage first screen had a responsive capture risk: a plain headless capture showed horizontal clipping, and the CTA row was close enough to warrant a safer stacked mobile layout.

Accessibility risks found:
- A horizontally clipped hero would make the first value proposition and CTA hard to read at phone widths.
- The screenshot pass does not prove keyboard order, focus visibility, or screen-reader naming across the whole flow.

## Changes Implemented

- Added a public fallback for `/catalog` using the existing real-photo demo plant profiles when `getPlantProfiles()` throws.
- Added the same fallback for `/catalog/[slug]`, so homepage plant cards like French Marigold remain usable without database env.
- Marked fallback demo profiles as published.
- Changed the mobile homepage CTA area to one full-width primary action with compact secondary text links below it.
- Added regression tests for catalogue/detail fallback behavior and the mobile hero CTA layout.

## Verification

- Focused tests passed: `homepage-content.test.ts`, `homepage-visual-css.test.ts`, `public-catalogue-content.test.ts`, and `sample-garden.test.ts` - 4 files, 23 tests.
- Full `npm test` passed: 22 files, 116 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Route probe passed with `200` for `/`, `/catalog`, `/catalog/french-marigold`, and `/sample-garden/property`.
- Final mobile CDP metrics showed no horizontal overflow:
  - `innerWidth`: 390
  - `docScrollWidth`: 390
  - `bodyScrollWidth`: 390
  - `.home-hero` right edge: 382
  - `h1` right edge: 366
  - `.home-hero__media` right edge: 366

## Step Health

1. Homepage first impression - healthy after the responsive CTA fix. Clear value, real photo, primary action visible, no mobile overflow in CDP metrics.
2. Public catalogue - improved. Now remains usable when DB access is unavailable and showcases real-photo plants with simple fit copy.
3. Public plant detail - improved. Homepage plant cards no longer lead to a DB-env failure in local/preview and the page stays focused on fit before planting.
4. Sample garden preview - healthy for a desktop first look. It presents the app as a simple garden record with a visible next step.

## Remaining Limits

- Screenshots alone do not prove full accessibility compliance.
- Authenticated signed-in flows still need a fresh keyboard/focus pass.
- Public catalogue search/filter interactions were not exhaustively exercised in screenshots during this iteration.
