# Iteration 238 - Journal-Style Plant Imagery And Auth Copy

Date: 2026-06-23
Destination: local folder
Capture source: local production preview at http://127.0.0.1:3021

## Scope

Continue simplifying the public homepage, sample garden, public catalogue, and signed-out app entry so the experience feels more like a gardening journal and less like a mixed marketing/gallery page.

## User Need

- Prospective users should understand the app quickly: ask about the garden, save useful answers, and keep notes tied to plants and places.
- The plant imagery should match the warm paper / field notebook style.
- Public and sample surfaces should avoid raw database labels like `Unknown`.

## Accepted Screenshots

- `screenshots/01-home-mobile-final.png` - homepage mobile after the plant image correction.
- `screenshots/02-home-desktop-final.png` - homepage desktop after the plant image correction.
- `screenshots/03-sample-plants-mobile-final.png` - sample My Plants with journal-style plant images.
- `screenshots/04-sample-catalogue-mobile-final.png` - sample Find Plants with `Flower` instead of `Unknown`.
- `screenshots/05-public-catalogue-mobile-final.png` - public catalogue default ordering with journal-style plant images first.
- `screenshots/06-auth-mobile-final.png` - signed-out app entry with `Your garden, smarter.`

## Findings

1. Homepage and sample garden imagery had shifted too far toward full-color garden photos.
   - Full-color photos made the page feel more like generic plant cards than a garden journal.
   - The Calendula, Cilantro, and Cucumber plant-art JPGs better match the specimen-record direction.

2. Sample catalogue exposed raw metadata on Calendula.
   - `UNKNOWN` appeared as a visible badge.
   - That reads like an internal data state, not useful gardener-facing copy.

3. The signed-out ask page headline was too procedural.
   - `Know what to do next.` explained function, but did not feel like a simple product promise.
   - `Your garden, smarter.` better matches the user-facing value suggested in review.

## Changes

- Replaced default homepage showcase plants with Calendula, Cilantro, and Cucumber.
- Updated the demo garden snapshot to use those same plants, notes, and care tasks.
- Updated default public catalogue ordering and fallback catalogue profiles to prioritize the journal-style plant-art JPGs.
- Added catalogue formatting helpers so unknown lifecycle values are omitted from public summary lines and app catalogue badges.
- Changed the signed-out app entry headline to `Your garden, smarter.`
- Changed supporting auth copy to `Ask with a quick note or photo. Save the answer with the plant, bed, or season it belongs to.`
- Updated regression tests for homepage, sample garden, public catalogue, auth copy, and catalogue formatting.

## Evidence

- Focused tests passed: `auth-gate-content.test.ts`, `homepage-content.test.ts`, `sample-garden.test.ts`, `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `app-flow-visual-css.test.ts` - 6 files, 44 tests.
- Full `npm test` passed - 22 files, 118 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Live route checks confirmed:
  - `/app/my-property` contains `Your garden, smarter.` and no old `Know what to do next.` auth headline.
  - `/sample-garden/catalogue` contains `Flower` for Calendula and no `UNKNOWN` badge.
  - Homepage, sample garden, and public catalogue surfaces use Calendula/Cilantro/Cucumber plant-art JPGs with zero old French Marigold/Foxglove/Curry Leaf default image URLs.
- Screenshot capture confirmed:
  - Homepage mobile and desktop use the journal-style plant images.
  - Sample My Plants and Find Plants use the same image direction.
  - Public catalogue shows journal-style plant images first.
  - Auth gate shows the revised headline.

## Limits

- Screenshot review does not prove keyboard/focus behavior.
- This pass did not test the real magic-link email flow.
- Public catalogue still contains other plant records and image styles below the initial showcase; this pass focused default first-impression surfaces.
