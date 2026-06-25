# Iteration 574 desktop/mobile route sweep and catalogue alt text

Scope: continue the clean/simple app goal with a fresh desktop and mobile route sweep across the homepage, tour app routes, public catalogue, and signed-out app gate.

Findings:
- The checked routes had no forbidden beta/prototype/waitlist/Field Guide/developer copy.
- The checked desktop and mobile routes had no horizontal overflow and no tiny visible controls.
- The public catalogue list loaded journal-style plant images, but row thumbnails had empty `alt` text. Because those images identify the plant in a browse list, silence was weaker than simple plant-specific alt text.

Changed:
- Public catalogue row thumbnails now use plant-specific alt text, e.g. `Calendula plant image`.
- Added a regression test that renders a journal-style image and rejects empty row-image alt text.

Evidence:
- `route-sweep.json` records the desktop/mobile sweep before the fix.
- `catalog-alt-after.json` records the desktop/mobile catalogue recapture after the fix; both viewports show no image issues.
- Screenshots saved in this folder include desktop and mobile captures for homepage, tour routes, catalogue, and app gate, plus `desktop-catalog-after.png` and `mobile-catalog-after.png`.

Verification:
- Focused catalogue tests passed: 3 files, 34 tests.
- Full `npm test` passed: 24 files, 134 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass improves local public/tour/catalogue accessibility and verifies the checked routes on desktop and mobile. The active goal should remain open because authenticated live-data states and full signed-in keyboard traversal are still not fully proven.
