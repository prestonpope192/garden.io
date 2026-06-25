# Iteration 221

Scope: continue simplifying the prospective-user path and the sample app's core plant-record view.

Audit mode: combined UX and accessibility screenshot audit.

User goal:
- Understand in a few seconds what Garden.io helps with.
- See that the app keeps a useful record of plants and makes the next care step easy to find.

Accepted screenshots:
- `screenshots/01-desktop-home.png` — homepage before this pass.
- `screenshots/02-desktop-catalog.png` — public catalogue current state.
- `screenshots/03-desktop-sample-property.png` — sample My Garden current state.
- `screenshots/04-desktop-sample-plants.png` — sample My Plants before this pass.
- `screenshots/05-desktop-sample-calendar.png` — sample This Week current state.
- `screenshots/06-mobile-home.png` — mobile homepage before this pass.
- `screenshots/07-mobile-catalog.png` — mobile catalogue current state.
- `screenshots/08-mobile-auth.png` — mobile signed-out start screen current state.
- `screenshots/09-mobile-sample-property.png` — mobile sample My Garden current state.
- `screenshots/10-mobile-sample-plants.png` — mobile sample My Plants before this pass.
- `screenshots/11-desktop-home-after.png` — desktop homepage after positioning change.
- `screenshots/12-desktop-sample-plants-after.png` — desktop My Plants after card layout change.
- `screenshots/13-mobile-home-after.png` — mobile homepage after positioning change.
- `screenshots/14-mobile-sample-plants-after.png` — mobile My Plants regression check.

Strengths:
- The sample My Garden route now has a clear basic loop: garden structure on the left, next care step on the right.
- The catalogue route uses real plant photos and a clear search-first entry point.
- The signed-out start screen is short, direct, and no longer feels like beta access or developer-facing setup.

UX risks found:
- The homepage hero repeated the brand name as the largest text, so the first three seconds did not spend enough attention on the user's felt need.
- The desktop My Plants cards used three narrow columns, which made a simple plant record feel cramped and harder to scan.

Accessibility risks found:
- The narrow desktop plant cards forced more awkward line breaks and increased reading effort.
- Screenshot evidence showed no horizontal overflow, but keyboard focus order and screen-reader behavior still require direct interaction testing.

Changed:
- Replaced the homepage H1 `Garden.io` with `Know what to do next in your garden.`
- Replaced the homepage lead with `Keep plants, photos, notes, and care in one place so every next step has context.`
- Replaced the homepage fit note with `Built for busy gardeners who need a quick answer, not another spreadsheet.`
- Increased `.home-hero h1` width from `10ch` to `12ch`.
- Increased the desktop My Plants card-grid minimum from `220px` to `min(100%, 360px)`, so plant cards read as records instead of narrow columns.
- Added `app-flow-visual-css.test.ts` to guard the homepage hero width and desktop plant-card grid.
- Updated `homepage-content.test.ts` so the old brand-as-headline hero cannot come back unnoticed.

Result:
- The homepage now leads with the outcome a prospective user is looking for: knowing what to do next.
- The desktop My Plants view now presents each plant as a wider, scan-friendly record with photo, type, location, age, and next step.
- Mobile homepage and mobile My Plants remained clean with no overflow offenders.

Verification:
- Focused `npm test -- homepage-content.test.ts app-flow-visual-css.test.ts sample-garden.test.ts` passed from `website/`: 3 files, 15 tests.
- Full `npm test` passed from `website/`: 21 files, 102 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Clean local production server returned 200 for `/`, `/sample-garden/plants`, `/catalog`, and `/app/my-property`.
- Chrome DevTools Protocol screenshots reported no overflow offenders for `/` and `/sample-garden/plants` on desktop and mobile.

Evidence limits:
- This pass used local Chrome DevTools screenshots, source tests, full tests, build, and HTTP route probes.
- It did not prove authenticated signed-in behavior, keyboard flow, screen-reader behavior, successful magic-link delivery, or photo upload behavior.
