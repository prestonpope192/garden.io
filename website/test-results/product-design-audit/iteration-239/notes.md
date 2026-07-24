# Product Design Audit - Iteration 239

Date: 2026-06-23

Scope: clean up the public catalogue first impression after the homepage/app simplification pass.

User need:
- Public plant browsing should feel curated and useful, not like a database export.
- Missing facts should not appear as visible raw fallback copy.
- The first few records should reinforce the simple journal-style direction.

Accepted screenshots:
- `screenshots/01-home-mobile-current.png` - homepage mobile at the start of the pass.
- `screenshots/02-auth-mobile-current.png` - signed-out app entry at the start of the pass.
- `screenshots/03-sample-ask-mobile-current.png` - sample Ask view.
- `screenshots/04-sample-plants-mobile-current.png` - sample My Plants view.
- `screenshots/05-sample-calendar-mobile-current.png` - sample Calendar view.
- `screenshots/06-sample-catalogue-mobile-current.png` - sample Find Plants view.
- `screenshots/07-public-catalogue-mobile-current.png` - public catalogue before the metric cleanup.
- `screenshots/08-home-desktop-current.png` - homepage desktop.
- `screenshots/09-sample-ask-desktop-current.png` - sample Ask desktop.
- `screenshots/07-public-catalogue-mobile-final.png` - public catalogue after hiding missing height facts.

Finding:
- The first public catalogue card showed `Height` as `Not listed`, which made the page feel like a raw database table instead of a helpful plant guide.

Changed:
- Public catalogue cards now omit the Height fact when mature height is not known.
- Kept useful visible facts such as Sun and Water in place.
- Added a regression test so `Height` does not render with `Not listed`.

Result:
- The first public catalogue card now reads as a concise plant recommendation instead of exposing missing data.
- The browse page keeps the journal-style image direction and avoids old SVG placeholders.

Evidence:
- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `sample-garden.test.ts`, 3 files, 30 tests.
- Full `npm test` passed: 22 files, 118 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Final DOM screenshot probe on `/catalog` confirmed no `Not listed`, no `Unknown`, no old default images, and no horizontal overflow in the sampled viewport.

Evidence limits:
- This pass focused on the public catalogue default state, not every filter/search state.
- Screenshots and DOM checks do not prove keyboard/focus behavior.
