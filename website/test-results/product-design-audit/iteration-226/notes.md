# Iteration 226 - Mobile My Plants Guide

Scope: continue simplifying the app flow around the first-value path, focused on the mobile `My Plants` screen.

Audit mode: focused UX, responsive layout, screenshot, route, and build verification pass.

User goal:
- Open `My Plants` and immediately understand what the screen is for.
- Search or pick a plant with enough context to know why the list matters.
- Keep the plant record flow tied to notes, photos, and next steps instead of making the user infer the page purpose from cards alone.

Accepted screenshots:
- `screenshots/desktop-home-before.png` - desktop homepage context before this pass.
- `screenshots/mobile-home-before.png` - mobile homepage context before this pass.
- `screenshots/desktop-auth-property-before.png` - desktop auth boundary context before this pass.
- `screenshots/mobile-auth-property-before.png` - mobile auth boundary context before this pass.
- `screenshots/desktop-sample-property-before.png` - desktop My Garden context before this pass.
- `screenshots/mobile-sample-property-before.png` - mobile My Garden context before this pass.
- `screenshots/desktop-sample-plants-before.png` - desktop My Plants before this pass.
- `screenshots/mobile-sample-plants-before.png` - mobile My Plants before this pass.
- `screenshots/desktop-sample-calendar-before.png` - desktop This Week context before this pass.
- `screenshots/mobile-sample-calendar-before.png` - mobile This Week context before this pass.
- `screenshots/mobile-sample-plants-after.png` - mobile My Plants after this pass.
- `screenshots/desktop-sample-plants-after.png` - desktop My Plants regression check after this pass.
- `screenshots/mobile-sample-calendar-regression.png` - mobile This Week regression check after this pass.
- `screenshots/mobile-sample-property-regression.png` - mobile My Garden regression check after this pass.

Finding:
- On mobile, `My Plants` showed the search field and a long stack of plant cards before the guidance card.
- The guidance card explained the page's job: `4 growing plants across 3 beds. Pick one to see notes, photos, and next steps.`
- Before this pass, that guide was below the full list at top 1746px, so it was effectively invisible during the first decision.
- The desktop drawer position was useful, so this was a mobile layout-order problem rather than a content problem.

Changed:
- On phone widths, moved the `My Plants` drawer/guide before the plant list using responsive order.
- Hid the duplicate drawer scope label on phone so the guide reads as a compact instruction card rather than a second title block.
- Tightened mobile guide spacing and radius while leaving desktop layout stable.
- Added CSS regression coverage so the mobile guide stays before the list.

Result:
- Mobile guide moved from top 1746px to top 250px.
- Mobile guide height dropped from 230px to 158px.
- Search starts at top 433px, and the first plant card still starts inside the first viewport at top 499px.
- Desktop `My Plants` remained unchanged: drawer stayed on the right and plant cards stayed at the previous first-viewport position.
- Mobile `This Week` and `My Garden` regression screenshots showed no document-level horizontal overflow.

Accessibility risks:
- The visual order now matches the intended mobile reading path, but direct keyboard and screen-reader traversal still need testing.
- The plant cards remain large on mobile because they include real photos; future passes may decide whether thumbnails should become more compact.

Verification:
- Focused `npm test -- sample-garden.test.ts app-flow-visual-css.test.ts mobile-layout-css.test.ts` passed from `website/`: 3 files, 18 tests.
- Full `npm test` passed from `website/`: 21 files, 108 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed.
- Local production server returned 200 for `/sample-garden/plants`, `/sample-garden/calendar`, and `/app/my-plants`.
- Fresh CSS chunk probes returned 200 after restarting the local preview.
- Chrome DevTools Protocol screenshots and metrics reported no horizontal document overflow on the checked after routes.

Evidence limits:
- This pass used local Chrome DevTools screenshots, source tests, full tests, build, and HTTP route probes.
- It did not prove production deployment, signed-in writes, image upload, magic-link delivery, keyboard flow, or assistive-technology behavior.
