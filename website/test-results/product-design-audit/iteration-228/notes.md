# Iteration 228 - Compact Mobile Weekly Care

Scope: continue simplifying the first-value app flow, focused on mobile `This Week` scanability.

Audit mode: focused UX, responsive layout, screenshot, route, and build verification pass.

User goal:
- Open `This Week` and immediately know what needs attention.
- Scan all current care tasks without heavy scrolling.
- Keep the weekly plan simple enough that the user can act first and read deeper context later.

Accepted screenshots:
- `screenshots/mobile-this-week-before.png` - mobile This Week before this pass.
- `screenshots/desktop-this-week-before.png` - desktop This Week before this pass.
- `screenshots/mobile-plants-regression-before.png` - mobile My Plants before this pass.
- `screenshots/mobile-property-regression-before.png` - mobile My Garden before this pass.
- `screenshots/mobile-this-week-after.png` - mobile This Week after this pass.
- `screenshots/desktop-this-week-after.png` - desktop This Week regression check after this pass.
- `screenshots/mobile-plants-regression-after.png` - mobile My Plants regression check after this pass.
- `screenshots/mobile-property-regression-after.png` - mobile My Garden regression check after this pass.

Rejected evidence:
- The first attempted capture used a stale `next start` preview against an `output: standalone` build and showed the page without CSS.
- That screenshot was rejected, the standalone server was restarted with copied static chunks, CSS chunk URLs were probed, and the styled baseline was recaptured before auditing.

Finding:
- On mobile, `This Week` was correctly prioritized before secondary calendar context, but every care item still looked like a full note card.
- The four current care cards measured 129-147px tall each, so the care panel ran to 932px on an 844px viewport.
- This made the screen feel heavier than the user's actual question: "what should I do this week?"

Changed:
- Added mobile-only compact styling for `garden-cal2-card` rows inside the current calendar surface.
- Kept the checkbox, task title, plant/location context, care type, and due date visible.
- Hid long task notes on phone widths so the first scan stays action-oriented.
- Tightened mobile weekly-care spacing while leaving desktop care cards visually unchanged.
- Added CSS regression coverage so mobile weekly care cards stay compact.

Result:
- Mobile `Care this week` panel height dropped from 667px to 470px.
- The panel bottom moved from 932px to 735px, bringing all four tasks into the first mobile viewport.
- The seasonal context now starts at 751px instead of 948px, so the next section peeks into the first viewport.
- Each mobile task card dropped by about 45px.
- Desktop This Week stayed in the richer planning-card layout.
- Mobile My Plants and My Garden regression screenshots showed no document-level horizontal overflow.

Verification:
- Focused `npm test -- app-flow-visual-css.test.ts mobile-layout-css.test.ts sample-garden.test.ts` passed from `website/`: 3 files, 20 tests.
- Full `npm test` passed from `website/`: 22 files, 114 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed.
- Local standalone production server returned 200 for `/sample-garden/calendar`, `/sample-garden/plants`, and `/app/my-plants`.
- Current CSS chunk probes returned 200 after copying static assets into the standalone runtime folder and restarting the server.
- Chrome DevTools Protocol screenshots and metrics were captured from `http://127.0.0.1:3021`.

Evidence limits:
- This pass used local Chrome screenshots, source tests, full tests, build, route probes, and CSS chunk probes.
- It did not prove production deployment, signed-in writes, magic-link delivery, keyboard flow, or assistive-technology behavior.
- Hiding long notes on mobile improves first-scan clarity, but a later interaction pass should make sure users can still reach task details naturally when they need them.

Recommended next action:
- Audit the mobile app shell/header next; the repeated large brand/nav area still consumes a lot of first-screen space across app routes.
