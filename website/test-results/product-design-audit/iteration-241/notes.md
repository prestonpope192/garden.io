# Product Design Audit - Iteration 241

Date: 2026-06-23

Scope: continue the homepage and app cleanup with a focused pass on the public catalogue browse experience.

User need:
- The first catalogue browse should feel polished and trustworthy.
- Journal-style plant images should appear as real visual material, not empty frames.
- Public plant browsing should stay simple: search, scan, check fit.

Accepted screenshots:
- `screenshots/01-home-mobile-current.png` - homepage mobile after the latest copy cleanup.
- `screenshots/02-home-desktop-current.png` - homepage desktop after the latest copy cleanup.
- `screenshots/03-auth-mobile-current.png` - signed-out app entry.
- `screenshots/04-sample-ask-mobile-current.png` - sample Ask view.
- `screenshots/05-sample-plants-mobile-current.png` - sample My Plants view.
- `screenshots/06-sample-catalogue-mobile-current.png` - sample Find Plants view.
- `screenshots/07-public-catalogue-mobile-current.png` - public catalogue before this pass.
- `screenshots/08-sample-ask-desktop-current.png` - sample Ask desktop.
- `screenshots/07-public-catalogue-mobile-final.png` - public catalogue after the image-loading cleanup.

Finding:
- The initial public catalogue browse showed empty image frames for Acerola and Ackee in the full-page mobile capture.
- The image URLs were valid, but the rows were below the first viewport and stayed lazy/incomplete during the captured first browse.
- The result looked like missing content even though the database had real plant-art images.

Changed:
- Added failed-image state to the public catalogue client component so a failed image request can fall back to a clean text-only row instead of an empty frame.
- Changed the first visible catalogue batch to load eagerly with `priority={index < INITIAL_VISIBLE_COUNT}`.
- Added a regression assertion that keeps the failed-image fallback and first-batch priority behavior in place.

Result:
- The public catalogue initial browse now shows the first six plant-art images fully loaded in the accepted mobile screenshot.
- The page still has no SVG placeholder images, no `Unknown` fallback labels, no `Not listed` height fallback, and no horizontal overflow.

Evidence:
- Focused tests passed: `public-catalogue-content.test.ts` and `catalogue-format.test.ts`, 2 files, 20 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Final browser metrics on `/catalog` confirmed zero broken images, zero incomplete row images, zero blank preview frames, no `Not listed`, no `Unknown`, no old default images, and no horizontal overflow.

Evidence limits:
- This pass did not audit every catalogue search/filter path.
- Screenshots and DOM checks do not prove keyboard/focus behavior.
- The Ask view overflow reported by automated metrics came from screen-reader-only text and hidden file input mechanics, not visible overflow; focus behavior still deserves a later explicit accessibility pass.
