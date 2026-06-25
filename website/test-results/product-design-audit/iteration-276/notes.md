# Iteration 276 Product Design Audit

Scope: mobile homepage first impression and first-viewport clarity.

Audit mode: mobile screenshot capture, device-emulated layout measurement, scoped CSS simplification, regression tests, full test suite, production build, and accepted screenshot review.

Captured screens:
- `01-mobile-home-before.png` - narrow Chrome window capture before this pass.
- `02-mobile-sample-ask-before.png` - sample Ask screen before this pass.
- `03-mobile-sample-property-before.png` - sample Property screen before this pass.
- `04-mobile-home-emulated-before.png` - device-emulated mobile homepage before the final tightening.
- `05-mobile-home-after.png` - first mobile homepage pass after hiding the extra fit note.
- `06-mobile-home-after-final.png` - accepted device-emulated mobile homepage after final tightening.

Finding:
- The cropped narrow-window screenshot made the homepage look horizontally clipped, but device-emulated measurements showed the real mobile viewport had no horizontal overflow.
- The actual mobile problem was first-viewport height: the homepage hero consumed the whole first viewport, so the next section was barely discoverable.
- The extra `Start with one plant...` reassurance repeated the same value already in the hero copy and cost meaningful vertical space on phones.

Changed:
- Hid `.home-fit-note` on mobile.
- Fixed the mobile hero media block to `height: 300px` with no inherited min-height, preserving the botanical plate while shortening the first screen.
- Kept the desktop homepage unchanged.
- Updated homepage visual CSS tests to lock the mobile behavior.

Evidence:
- Focused tests passed: `homepage-visual-css.test.ts`, `mobile-layout-css.test.ts`, and `homepage-content.test.ts` - 3 files, 8 tests.
- Full `npm test` passed: 23 files, 127 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Device-emulated metrics for `/` after the final change: viewport 390, document scroll width 390, hero bottom 660px, next section top 684px, image height 300px, and `.home-fit-note` display `none`.
- Accepted screenshot `06-mobile-home-after-final.png` shows the homepage promise, primary CTA, sample link, image card, and the beginning of `How it helps` inside the first mobile viewport.
- Preview restarted at `http://127.0.0.1:3021`.

Evidence limits:
- This pass verified the homepage mobile first viewport and sampled the Ask/Property mobile screens before editing. It did not perform a full mobile interaction pass through saving notes, uploading photos, or authenticated setup.
