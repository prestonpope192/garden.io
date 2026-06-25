# Iteration 235 - Find Plants Quick Fit

Date: 2026-06-22
Destination: local folder
Capture source: current local app at `http://127.0.0.1:3021`
Audit mode: combined UX, responsive, and accessibility-risk pass

## Scope

Continue simplifying the prospective-user flow, focused on `Find Plants` inside the sample garden. The user goal is to quickly understand which plants fit their beds without reading a dense fact sheet.

## Accepted screenshots

- `screenshots/01-find-plants-mobile-before.png` - mobile before this pass.
- `screenshots/02-find-plants-desktop-before.png` - desktop before this pass.
- `screenshots/03-find-plants-mobile-final.png` - mobile after this pass.
- `screenshots/04-find-plants-desktop-final.png` - desktop after this pass.

## Finding

The plant cards used real photos and were stable, but the quick facts led with `Light`, `Water`, and an empty `Height: Not listed` value before the practical fit. A gardener scanning the card had to read past missing data before seeing where the plant belongs.

## Changed

- Moved `Best spot` to the first quick-fit row.
- Made `Best spot` span the card width so the practical fit sentence is easier to scan.
- Kept `Light` and `Water` as secondary quick facts.
- Hid `Height` when the catalogue has no real height value instead of showing `Not listed`.
- Added regression tests for quick-fit order and missing-value removal.

## Result

`Find Plants` now leads each card with the useful question: where would this plant fit? The sample catalogue still stays simple, but the first scan is now practical rather than database-like.

## Evidence

- Focused tests passed: `sample-garden.test.ts`, `app-flow-visual-css.test.ts`, `public-catalogue-content.test.ts`, and `catalogue-format.test.ts`, 4 files, 38 tests.
- Full `npm test` passed: 22 files, 117 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Route probe passed with `200` for `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, and `/app/my-property`.
- Final mobile CDP metrics at 390px: document/body scroll width `390px`, no overflowing elements, labels ordered `Best spot`, `Light`, `Water`, and `Not listed` absent.
- Final desktop CDP metrics at 1280px: document/body scroll width `1280px`, no overflowing elements, labels ordered `Best spot`, `Light`, `Water`, and `Not listed` absent.

## Evidence limits

- Screenshots and DOM metrics do not prove keyboard/focus behavior.
- This pass did not exercise signed-in add-to-bed or save-for-later actions.
- The public `/catalog` interactive search/filter flow should still get a separate interaction pass.

