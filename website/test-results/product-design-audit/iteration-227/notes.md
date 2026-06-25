# Iteration 227 - Compact Mobile Plant Records

Scope: continue simplifying the app flow around the first-value path, focused on mobile `My Plants` scanability.

Audit mode: focused UX, responsive layout, screenshot, route, and build verification pass.

User goal:
- Open `My Plants` and quickly recognize it as a useful record list, not a photo gallery.
- Compare multiple plants without heavy scrolling.
- Keep real plant images visible enough for recognition while foregrounding notes, locations, and next steps.

Accepted screenshots:
- `screenshots/mobile-sample-plants-before.png` - mobile My Plants before this pass.
- `screenshots/desktop-sample-plants-before.png` - desktop My Plants before this pass.
- `screenshots/mobile-sample-calendar-before.png` - mobile This Week before this pass.
- `screenshots/mobile-sample-property-before.png` - mobile My Garden before this pass.
- `screenshots/mobile-sample-plants-after-390.png` - matched-width mobile My Plants after this pass.
- `screenshots/mobile-sample-plants-after.png` - 375px mobile My Plants after this pass.
- `screenshots/desktop-sample-plants-after.png` - desktop My Plants regression check after this pass.
- `screenshots/mobile-sample-calendar-regression.png` - mobile This Week regression check after this pass.
- `screenshots/mobile-sample-property-regression.png` - mobile My Garden regression check after this pass.

Finding:
- On phone widths, the current `My Plants` screen still felt heavier than the actual task.
- The old 520px responsive rule turned every plant thumbnail into a full-width 150px image.
- That made each plant record 340px tall on a 390px mobile capture, so only one record fit after the guide and search.
- The real photos were valuable, but the oversized treatment made the list read like image browsing instead of garden tracking.

Changed:
- Scoped the old full-width mobile thumbnail rule away from current `.garden-plants2-card` records.
- Added a compact mobile record layout for `.garden-plants2-card`: 84px real thumbnail, tighter spacing, and smaller secondary text.
- Preserved desktop card sizing and real image rendering.
- Added CSS regression coverage so current mobile My Plants records stay compact while older non-v2 cards can still use the full-width image rule.

Result:
- Matched-width mobile first plant card dropped from 340px tall to 131px tall.
- First plant image dropped from 313x150 to an 84x84 real thumbnail.
- The first two plant records now fit in the first mobile viewport after the guide and search.
- Desktop first plant card stayed effectively unchanged at about 174px tall.
- Fresh image checks showed Supabase plant photos loading through `next/image`.
- Mobile My Plants, This Week, and My Garden regression screenshots reported no document-level horizontal overflow.

Verification:
- Focused `npm test -- app-flow-visual-css.test.ts mobile-layout-css.test.ts sample-garden.test.ts` passed from `website/`: 3 files, 19 tests.
- Full `npm test` passed from `website/`: 21 files, 109 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed.
- Local production server returned 200 for `/sample-garden/plants`, `/sample-garden/calendar`, and `/app/my-plants`.
- Chrome DevTools Protocol screenshots and metrics were captured from the rebuilt local production server at `http://127.0.0.1:3021`.

Evidence limits:
- This pass used local Chrome DevTools screenshots, source tests, full tests, build, and HTTP route probes.
- It did not prove production deployment, signed-in writes, image upload, magic-link delivery, keyboard flow, or assistive-technology behavior.

Recommended next action:
- Audit the mobile `This Week` task cards next; they now remain useful, but the row density and large typography may still make weekly care feel heavier than the task requires.
