# Iteration 575 app image-style pass

Scope: continue the clean/simple application goal by checking the signed-in app entry, the tour app surfaces, and Plant Journal image behavior against the botanical notebook direction.

Findings:
- Local `/app/*` routes are auth-gated in this browser session, so they currently prove the sign-in screen rather than signed-in live-data states.
- The auth gate, tour Today, tour Plant Journal, and tour Choose plants routes had no forbidden beta/prototype/waitlist/Field Guide/developer-facing copy in the DOM sweep.
- The checked desktop and mobile routes had no horizontal overflow.
- Source review found that Plant Journal still accepted any real photo URL through `getRealPlantPhotoUrl()`, which could reintroduce full-color garden photos into the app even though the catalogue and sample garden already prefer journal-style plant-art images.

Changed:
- Plant Journal thumbnails now use `getJournalStylePlantImageUrl()` so only the database-backed `/plant-art/` botanical images render in the plant record list.
- Ordinary full-color plant photos now fall back to the quiet paper thumbnail placeholder in Plant Journal instead of breaking the notebook feel.
- Added a regression test that renders Plant Journal with an ordinary photo URL, rejects that URL in the HTML, confirms the fallback thumbnail appears, and confirms journal-style plant-art images still render.

Evidence:
- `app-dom-sweep.json` records the desktop/mobile app-route sweep before the fix. In this local session, every `/app/*` route resolved to the auth gate.
- `post-fix-dom-sweep.json` records the desktop/mobile post-fix sweep across the auth-gated app entry and tour routes. Tour Plant Journal shows four visible images, no image issues, no full-color image URLs, and no overflow.
- The in-app Browser repeatedly timed out on screenshot capture for this route set, so this iteration uses DOM/browser-state evidence plus tests/build instead of screenshot evidence.

Verification:
- Focused app image/style tests passed: 3 files, 33 tests.
- Full `npm test` passed: 24 files, 135 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass improves the app's image-style consistency and verifies local auth/tour DOM states. The overall active goal should remain open because authenticated live-data states and full signed-in keyboard traversal are still not proven.
