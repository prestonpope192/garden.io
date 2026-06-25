# Iteration 223

Scope: simplify the mobile app shell so users reach the garden work faster.

Audit mode: focused mobile UX, responsive layout, copy, and screenshot evidence pass.

User goal:
- Open the sample app and immediately understand where to go.
- Reach the garden layout, weekly care, or plant records without losing the first screen to navigation chrome.

Accepted screenshots:
- `screenshots/01-mobile-property-before.png` - mobile My Garden before this pass.
- `screenshots/02-mobile-calendar-before.png` - mobile This Week before this pass.
- `screenshots/03-mobile-plants-before.png` - mobile My Plants before this pass.
- `screenshots/04-desktop-calendar-before.png` - desktop This Week baseline.
- `screenshots/09-mobile-property-final.png` - mobile My Garden after this pass.
- `screenshots/10-mobile-calendar-final.png` - mobile This Week after this pass.
- `screenshots/11-mobile-plants-final.png` - mobile My Plants after this pass.
- `screenshots/12-desktop-calendar-final.png` - desktop This Week regression check.

Diagnostic screenshots:
- `screenshots/05-mobile-property-after.png` through `screenshots/08-desktop-calendar-after.png` captured the header-only intermediate state before the app-title compaction.

Finding:
- The mobile app header was acting like a menu screen. At 390 x 844, it was 204px tall, or about 24.2% of the viewport, before the user reached their garden.
- The page title block then added another oversized ornamental layer, so the calendar's actual `Care this week` panel started much later than it needed to.
- Desktop was already acceptable, so the issue was specifically the phone app-shell hierarchy.

Changed:
- Reworked the phone header into a compact two-row structure: brand + action on the first row, four app destinations on one row below.
- Shortened the sample app CTA from `Start your garden` to `Start yours`, while keeping `aria-label="Start your garden"` for clarity.
- Replaced the old two-column wrapped nav buttons with four equal-width phone nav targets.
- Compacted the mobile app title: smaller label, smaller H1, tighter subtitle, and smaller season stamp.
- Added mobile CSS guards so the old two-row nav and full-width CTA do not return unnoticed.

Result:
- Mobile app header height dropped from 204px to 97px.
- Header viewport share dropped from 24.2% to 11.5%.
- On mobile This Week, the `Care this week` panel now starts at about 265px from the top and multiple care tasks are visible in the first screenshot.
- All four app sections remain visible on phone: `My Garden`, `This Week`, `My Plants`, and `Find Plants`.
- Desktop This Week remained stable at a 73px header with no horizontal overflow.

Verification:
- Focused `npm test -- sample-garden.test.ts mobile-layout-css.test.ts app-flow-visual-css.test.ts` passed from `website/`: 3 files, 15 tests.
- Full `npm test` passed from `website/`: 21 files, 103 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Clean local production server returned 200 for `/sample-garden/calendar` and `/app/calendar`.
- Chrome DevTools Protocol screenshots reported no horizontal overflow on mobile or desktop.
- Final metrics: mobile nav links were 89px wide and 34px tall; mobile header was 97px tall; mobile calendar care panel started at top 265px.

Remaining risks:
- Phone nav targets are visibly tappable and meet basic minimum size, but direct touch testing and keyboard/focus testing are still needed.
- The app still uses a decorative editorial visual system; later passes should keep reducing ornament where it delays task completion.
- This pass did not prove authenticated signed-in behavior, screen-reader behavior, successful magic-link delivery, or photo upload behavior.
