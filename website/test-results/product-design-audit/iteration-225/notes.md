# Iteration 225 - Mobile Homepage First Screen

Scope: continue simplifying the prospective-user homepage, focused on the mobile first screen.

Audit mode: focused UX, visual hierarchy, responsive layout, screenshot, route, and build verification pass.

User goal:
- Land on the homepage and understand the promise in a few seconds.
- See one clear primary path into the garden record.
- See real plant context quickly enough to trust that the app is about actual garden use, not a brochure.

Accepted screenshots:
- `screenshots/desktop-home-before.png` - desktop homepage before this pass.
- `screenshots/mobile-home-before.png` - mobile homepage before this pass.
- `screenshots/desktop-property-before.png` - desktop My Garden context before this pass.
- `screenshots/mobile-property-before.png` - mobile My Garden context before this pass.
- `screenshots/desktop-calendar-before.png` - desktop This Week context before this pass.
- `screenshots/mobile-calendar-before.png` - mobile This Week context before this pass.
- `screenshots/desktop-plants-before.png` - desktop My Plants context before this pass.
- `screenshots/mobile-plants-before.png` - mobile My Plants context before this pass.
- `screenshots/desktop-catalogue-before.png` - desktop Find Plants context before this pass.
- `screenshots/mobile-catalogue-before.png` - mobile Find Plants context before this pass.
- `screenshots/desktop-home-after.png` - desktop homepage after this pass.
- `screenshots/mobile-home-after.png` - mobile homepage after this pass.
- `screenshots/mobile-calendar-regression.png` - mobile This Week regression check after this pass.
- `screenshots/mobile-plants-regression.png` - mobile My Plants regression check after this pass.

Finding:
- The mobile homepage still used two large stacked cards before the user saw the real garden record.
- The topbar had a large framed treatment and repeated the same `Start your garden` CTA that appeared again inside the hero.
- The hero's three mobile actions were all rendered as large stacked buttons, so secondary exploration choices competed with the primary action.
- Before this pass, the mobile hero started at 196px and ended at 1072px on an 844px viewport; the next section did not start until 1096px.

Changed:
- Simplified the mobile marketing topbar into a plain brand + `Find plants` row.
- Hid the topbar CTA on the mobile marketing homepage, leaving the hero as the single primary entry point.
- Kept the primary `Start your garden` action as a button and changed secondary hero actions to simple text links on mobile.
- Reduced mobile hero type scale, spacing, and image height while keeping a real plant image and note visible.
- Added CSS regression coverage for the mobile homepage first-screen hierarchy.

Result:
- Mobile topbar now measures 46px tall.
- Mobile hero now starts at 63px and ends at 701px, down from 196px to 1072px before this pass.
- The real plant record begins at 423px and is visible well before the bottom of the first viewport.
- The `How it helps` section now starts at 725px, so the next section peeks into the first mobile viewport.
- Desktop homepage remained visually stable.
- Mobile This Week and My Plants regression screenshots kept their prior first-viewport positions and no horizontal document overflow was found.

Accessibility risks:
- Secondary hero actions are now text links on mobile; they need direct keyboard and screen-reader testing to confirm focus order and link affordance are clear.
- The audit still relies on screenshots and DOM metrics, not a full WCAG pass.

Verification:
- Focused `npm test -- homepage-content.test.ts homepage-visual-css.test.ts` passed from `website/`: 2 files, 5 tests.
- Full `npm test` passed from `website/`: 21 files, 107 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed.
- Local production server returned 200 for `/`, `/sample-garden/calendar`, and `/app/my-property`.
- Fresh CSS chunk probes returned 200 after restarting the local preview.
- Chrome DevTools Protocol screenshots and metrics reported no horizontal document overflow on the checked after routes.

Evidence limits:
- This pass used local Chrome DevTools screenshots, source tests, full tests, build, and HTTP route probes.
- It did not prove production deployment, signed-in writes, image upload, magic-link delivery, keyboard flow, or assistive-technology behavior.
- A stale local preview initially served a missing CSS chunk; that capture was rejected, the preview was restarted, and only the styled recapture was used as audit evidence.
