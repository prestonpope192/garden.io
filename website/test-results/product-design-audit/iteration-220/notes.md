# Iteration 220

Scope: fix the mobile first-use surfaces so the simplified product promise is not undermined by clipped text, cropped CTAs, or sideways app navigation.

Accepted screenshots:
- `screenshots/01-mobile-homepage.png` — initial mobile homepage capture showing clipped hero copy and CTA row.
- `screenshots/02-mobile-auth-start.png` — initial mobile signed-out start screen showing clipped panel content.
- `screenshots/03-mobile-sample-property.png` — initial mobile sample My Garden capture showing the app header action clipped.
- `screenshots/09-cdp-mobile-homepage-after.png` — measured Chrome DevTools screenshot after homepage mobile fit fix.
- `screenshots/10-cdp-mobile-auth-after.png` — measured Chrome DevTools screenshot after auth panel fit fix.
- `screenshots/11-cdp-mobile-sample-property-after.png` — measured Chrome DevTools screenshot after app header nav wrap.
- `screenshots/12-cdp-mobile-catalog-after.png` — measured Chrome DevTools screenshot confirming the catalog route renders cleanly.

Rejected capture:
- `screenshots/04-mobile-catalog.png` showed a stale dev-server React Server Components overlay. The production build and clean local server both returned `/catalog` as 200, and `screenshots/12-cdp-mobile-catalog-after.png` confirms the rendered catalog route.
- `screenshots/05-mobile-homepage-after.png` through `08-mobile-catalog-after.png` were command-line Chrome screenshots with a misleading crop. Chrome DevTools Protocol metrics showed no overflow, so the measured CDP captures are the accepted visual evidence.

Finding:
- The homepage, auth gate, and app shell were conceptually much simpler, but the mobile layout still felt rough because primary copy and actions could be clipped at the right edge.
- The root cause was shared layout behavior: grid children and pill controls were allowed to size from their widest content, and the app header used horizontal nav scrolling on a phone.
- This made the app feel less trustworthy at the exact moment a prospective user is deciding whether it is simple enough to use.

Changed:
- Added `min-width: 0` to shared card/grid content containers so text and control rows can shrink before their parent overflows.
- Made `.folio-link`, `.folio-button`, and `.folio-tab` predictable `inline-flex` controls with `max-width: 100%`.
- Added mobile rules that stack topbar actions, homepage CTAs, start CTAs, and catalog filter actions into one clear decision per row.
- Tightened the mobile homepage hero card, hero media, and overlay panel dimensions.
- Tightened the signed-out auth panel at phone width and made the form controls fill the card cleanly.
- Reworked the phone app header into a wrapped two-column nav, so `My Garden`, `This Week`, `My Plants`, and `Find Plants` are all visible without horizontal scrolling.
- Added `mobile-layout-css.test.ts` to guard the shared mobile shrink/stack behavior.

Result:
- The homepage now wraps the one-sentence promise and shows one CTA per row.
- The signed-out start screen fits as a clean card with readable copy, email field, button, and secondary links.
- The sample app header now presents all primary app sections without clipped labels or sideways motion.
- The public catalog no longer shows the stale dev overlay in the accepted verification pass.

Verification:
- Focused `npm test -- homepage-visual-css.test.ts mobile-layout-css.test.ts homepage-content.test.ts auth-gate-content.test.ts sample-garden.test.ts public-catalogue-content.test.ts` passed from `website/`: 6 files, 24 tests.
- Focused `npm test -- mobile-layout-css.test.ts homepage-visual-css.test.ts sample-garden.test.ts` passed from `website/`: 3 files, 13 tests.
- Full `npm test` passed from `website/`: 20 files, 100 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Clean local production server returned 200 for `/`, `/app/my-property`, `/sample-garden/property`, and `/catalog`.
- Chrome DevTools Protocol measured screenshots at 390px width reported no overflow offenders for `/`, `/app/my-property`, `/sample-garden/property`, and `/catalog`.

Evidence limits:
- The accepted screenshots are measured local Chrome DevTools captures against a clean local production server.
- This is still not a full authenticated signed-in browser pass.
- Keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
