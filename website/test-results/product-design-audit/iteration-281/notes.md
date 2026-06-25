# Iteration 281 - Mobile Find Plants Density

Scope: simplify the sample app `Find Plants` mobile screen so it behaves like a quick chooser instead of a plant profile page.

Audit mode: current mobile flow capture, visual inspection of accepted screenshots, responsive CSS change, focused tests, full test suite, production build, CDP mobile screenshot capture, and rendered card metrics.

Captured screens:
- `01-mobile-home.png` - current mobile homepage.
- `02-mobile-ask.png` - current mobile ask surface.
- `03-mobile-property.png` - current mobile My Garden.
- `04-mobile-calendar.png` - current mobile calendar.
- `05-mobile-plants.png` - current mobile My Plants.
- `06-mobile-catalogue.png` - mobile Find Plants before this pass.
- `07-mobile-public-catalogue.png` - current public catalogue.
- `08-mobile-catalogue-after.png` - mobile Find Plants after this pass.

Finding:
- The app flow is cleaner overall: current captures show no horizontal overflow across homepage, ask, garden, calendar, plants, sample catalogue, or public catalogue routes.
- `Find Plants` was the clearest remaining mobile friction. Its cards used the journal style well, but the first card was 442px tall and the second was 459px tall.
- That made the screen feel like a plant profile stack instead of a chooser; users could not compare the three sample plants at a glance.

Changed:
- Added mobile-only compact catalogue card rules under `@media (max-width: 760px)`.
- Changed sample app catalogue cards to a two-column mobile layout with a 96px image rail and compact content column.
- Reduced mobile card padding, heading scale, label padding, and detail-list spacing.
- Hid the long `Remember` row, metrics chips, and expandable field notes on mobile so `Fits`, `Light`, and `Water` stay visible first.
- Kept the underlying catalogue content in the DOM and preserved desktop/tablet rules.

Evidence:
- Before: first mobile Find Plants card height 442px; second card height 459px; route height 1731px; no horizontal overflow.
- After: first card height 207px; second card height 207px; third card height 223px; route height 1014px; no horizontal overflow.
- After: all three plant choices are visible in the first mobile viewport.
- Focused tests passed: `app-flow-visual-css.test.ts`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts` - 3 files, 24 tests.
- Full `npm test` passed: 23 files, 127 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.

Accessibility notes:
- The route still has no horizontal overflow at 390px.
- The mobile visual hierarchy now favors comparison and faster scanning.
- Because `Remember` is hidden visually on mobile, a later pass should decide whether that memory value belongs in a small always-visible line, a detail disclosure, or the next plant detail view.

Evidence limits:
- This pass verified the read-only sample `Find Plants` route. It did not exercise authenticated add-to-bed or wishlist actions.
- Screenshot and DOM metrics do not prove screen-reader or keyboard behavior.
