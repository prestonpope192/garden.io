# Iteration 282 - Public Catalogue Mobile Entry

Scope: simplify the public catalogue mobile path so prospective users reach real plant choices faster.

Audit mode: current mobile public catalogue screenshot, source/CSS inspection, responsive CSS change, focused tests, full test suite, production build, CDP mobile screenshot capture, and rendered layout metrics.

Captured screens:
- `01-mobile-public-catalogue-after.png` - intermediate capture after the first hero/row compaction pass.
- `02-mobile-public-catalogue-final.png` - final accepted mobile public catalogue screenshot.

Finding:
- The public catalogue is a prospective-user path, but the mobile page still felt heavier than the simplified app.
- Before this pass, the first public catalogue card was the hero at 577px tall, the first plant row started around 790px, and the first plant row was 629px tall.
- That meant a user saw mostly search chrome and only the top of one plant instead of quickly comparing choices.

Changed:
- Tightened the mobile public catalogue hero padding, headline scale, lead spacing, search height, and filter summary.
- Hid the secondary uppercase helper line on mobile while keeping the core `Find plants that fit your garden` promise.
- Compacted public catalogue rows on mobile into a 90px image rail plus quick facts.
- Hid botanical taxonomy and long description text on mobile rows so `Sun`, `Water`, `Height`, and `Check fit` surface first.
- Changed mobile public catalogue metrics into a two-column grid.
- Made `getTodayISO()` use local calendar dates so garden-day logic does not flip at the UTC boundary.
- Froze the sample-garden test clock at a local date before snapshot construction, making relative demo dates stable.

Evidence:
- Before: public catalogue hero height 577px; first plant row top 790px; first plant row height 629px; route height 5369px; no horizontal overflow.
- After: hero height 347px; plant list top 444px; first plant row height 183px; second and third rows 219px; route height 2044px; no horizontal overflow.
- Focused tests passed: `app-flow-visual-css.test.ts`, `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `mobile-layout-css.test.ts` - 4 files, 34 tests.
- Full `npm test` passed: 23 files, 128 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.

Accessibility notes:
- The route still has no horizontal overflow at 390px.
- Search remains visible before the plant list.
- The compact mobile row hides long explanatory text visually; the plant detail link remains the path for deeper reading.

Evidence limits:
- This pass verified the public catalogue mobile route. It did not test filter interaction by tapping in a real browser session.
- Screenshot and DOM metrics do not prove screen-reader or keyboard behavior.
