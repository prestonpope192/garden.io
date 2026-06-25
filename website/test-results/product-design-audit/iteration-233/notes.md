# Iteration 233 - This Week Care Readability

Date: 2026-06-22
Destination: local folder
Capture source: current local app at `http://127.0.0.1:3021`
Audit mode: combined UX, responsive, and accessibility-risk pass

## Scope

Continue simplifying the sample app experience, focused on the `This Week` care flow. The user goal is to understand what needs doing, where it needs doing, and what can wait without decoding clipped metadata.

## Accepted screenshots

- `screenshots/01-this-week-mobile-before.png` - mobile before this pass.
- `screenshots/04-this-week-mobile-final.png` - mobile after this pass.
- `screenshots/05-this-week-desktop-final.png` - desktop after this pass.

Intermediate screenshots `02-this-week-mobile-after.png` and `03-this-week-desktop-after.png` were useful for checking the first fix. They were superseded by final captures after the lower `Later care` row was cleaned up too.

## Finding

The `This Week` cards answered the right question, but the location context was styled as uppercase metadata with `white-space: nowrap`, hidden overflow, and ellipsis. On a phone, the important place and plant were clipped, for example `KITCHEN GARDEN - CONTAI...`. The lower `Later care` row had the same clipping pattern on the task title.

## Changed

- Rewrote care context from metadata order to user-facing location phrasing: `Curry Leaf in Container Row, Kitchen Garden`.
- Removed uppercase, letter-spaced, single-line clipping from the main care-card context.
- Let `Later care` task titles and locations wrap instead of truncating.
- Changed the mobile `Later care` row to two columns so the date stays visible while the task and location remain readable.
- Added regression tests for the new calendar copy and wrapping CSS.

## Result

The care list now reads like plain garden instructions instead of implementation metadata. The main cards show the task, the exact plant/place, and the date without truncation. The lower `Later care` row now shows `Refresh mulch on exposed soil` and `Herb Bed in Kitchen Garden` in full.

## Evidence

- Focused tests passed: `app-flow-visual-css.test.ts`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts`, 3 files, 21 tests.
- Full `npm test` passed: 22 files, 117 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Route probe passed with `200` for `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, and `/app/my-property`.
- Final mobile CDP metrics at 390px: document/body scroll width `390px`, no overflowing elements, card contexts `whiteSpace: normal`, `overflow: visible`, `textOverflow: clip`.
- Final desktop CDP metrics at 1280px: document/body scroll width `1280px`, no overflowing elements, care and later-care context text fully visible.

## Evidence limits

- Screenshots and computed layout metrics do not prove full keyboard/focus behavior.
- This pass did not exercise authenticated task toggles, rescheduling, or add-care submission.
- The `This Week` flow is cleaner, but a separate interaction pass should still test real write behavior.

