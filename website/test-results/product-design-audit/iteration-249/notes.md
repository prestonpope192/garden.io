# Iteration 249 Notes

Scope: simplify the in-app Find Plants / Guide cards.

Audit mode: UX, content, responsive, and accessibility-risk pass.

User need:
- Decide quickly whether a plant fits a bed.
- See what to remember after planting.
- Avoid reading a catalogue or database record inside the working garden app.

Accepted screenshots:
- `screenshots/mobile-guide.png` - current mobile Guide before the card cleanup.
- `screenshots/mobile-final-clean-guide.png` - final mobile Guide after the card cleanup.
- `screenshots/desktop-final-clean-guide.png` - final desktop Guide after the card cleanup.

Finding:
- The Guide cards showed Latin names, long fit paragraphs, and optional height/fact rows before the core gardener decision.
- The header link said `Ask garden`, which felt awkward and made the app shell less polished.

Changed:
- Removed the visible botanical name from in-app Guide cards.
- Replaced `Best spot` with `Fits`.
- Removed the optional `Height` row from the quick-fit card.
- Added `Remember` as a first-class row so the card connects plant choice to future garden memory.
- Added short memory prompts by plant type, such as bloom timing, harvest timing, heat stress, watering, trellis support, and pest notes.
- Shortened long small-garden prose before showing it in the card.
- Changed the sample/app header link from `Ask garden` to `Ask`.

Result:
- The Guide screen now reads as a gardener's decision aid rather than a plant database.
- Mobile cards scan as: image, plant, `Fits`, `Light`, `Water`, `Remember`.
- The sample Guide keeps journal-style botanical images while focusing copy on real usage.

Evidence:
- Focused tests passed: `catalogue-format.test.ts`, `sample-garden.test.ts`, `app-flow-visual-css.test.ts`, `public-catalogue-content.test.ts`, and `ai-first-garden-home.test.tsx`, 5 files, 44 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed.
- `git diff --check` passed for touched files.
- Browser metrics confirmed `Ask`, `Fits`, `Light`, `Water`, and `Remember` are present; old `Ask garden`, `Best spot`, Latin names, `Height`, `Not listed`, and `Unknown` are absent from the Guide surface; and no visible overflow appears on mobile or desktop.

Evidence limits:
- This pass covered the sample in-app Guide screen, not the public catalogue detail page.
- Screenshot and DOM checks do not prove complete keyboard/focus behavior.
- Calendar and My Plants still need deeper cleanup passes.
