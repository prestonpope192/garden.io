# Iteration 222

Scope: continue simplifying the sample app's weekly-care flow.

Audit mode: focused UX, copy, responsive layout, and first-viewport evidence pass.

User goal:
- Open the app and immediately know what needs care this week.
- Trust that the app helps decide what matters now and what can wait.

Accepted screenshots:
- `screenshots/01-desktop-this-week-before.png` - desktop This Week before this pass.
- `screenshots/02-mobile-this-week-before.png` - mobile This Week before this pass.
- `screenshots/03-desktop-my-garden-context.png` - desktop My Garden context route.
- `screenshots/04-mobile-my-garden-context.png` - mobile My Garden context route.
- `screenshots/05-desktop-this-week-after.png` - desktop This Week after this pass.
- `screenshots/06-mobile-this-week-after.png` - mobile This Week after this pass.

Finding:
- The desktop This Week route hid the actual weekly care list below secondary material.
- A gardener opening the calendar to answer "what should I do today?" first saw the page title, seasonal context, later care, and later ideas, while the urgent care list was not in the first viewport.
- Mobile already surfaced the weekly care list, so the issue was a desktop-specific hierarchy regression.

Root cause:
- `.garden-cal2-attention` was hidden by default and only displayed in the mobile media query.
- The copy still used an explanatory sentence instead of a direct priority-setting promise.

Changed:
- Made `.garden-cal2-attention` visible by default on desktop and mobile.
- Gave the weekly-care area a quiet inset treatment so it reads as the primary work area without adding a new visual system.
- Added responsive weekly-care card columns with `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`.
- Replaced `Know what needs care this week and what can wait.` with `Start with this week's care. Let the rest wait.`
- Added tests to prevent the weekly-care panel from returning to `display: none` and to guard the simplified This Week copy.

Result:
- Desktop now shows `Care this week` in the first viewport before `This season`, `Later care`, or `Ideas for later`.
- Mobile remains focused on the same weekly-care list with no horizontal overflow.
- The route now starts with the user's immediate felt need: what to do next.

Verification:
- Focused `npm test -- sample-garden.test.ts app-flow-visual-css.test.ts empty-state-content.test.ts` passed from `website/`: 3 files, 21 tests.
- Full `npm test` passed from `website/`: 21 files, 103 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Clean local production server returned 200 for `/sample-garden/calendar` and `/app/calendar`.
- Chrome DevTools Protocol screenshots reported no horizontal overflow on desktop or mobile.
- After metrics: desktop `Care this week` appeared at text index 166, before `This season` at 747, `Later care` at 927, and `Ideas for later` at 1001.

Remaining risks:
- The mobile app header still consumes too much vertical space and should be a next audit target.
- Task cards remain somewhat text-heavy; a later pass should make action, plant/location, and date easier to scan.
- This pass did not prove authenticated signed-in behavior, keyboard flow, screen-reader behavior, successful magic-link delivery, or photo upload behavior.
