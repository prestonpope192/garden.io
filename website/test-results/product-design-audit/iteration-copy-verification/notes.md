# Copy Verification Pass

Date: 2026-06-24

## Scope

- Homepage `/`
- Signed-out app gate `/app/my-property`
- Tour Today `/tour/ask`
- Tour My Garden `/tour/property`
- Desktop viewport: 1280 x 900
- Mobile viewport: 390 x 844

## Current-state Finding

- The previous copy pass made the app more direct, but the regression tests still protected older language like `Add a note or photo. Keep what helps for later.`
- First-use setup copy still had tests expecting generic record language instead of the clearer path: one garden, one place, one bed, one plant.

## Changes Verified

- Homepage hero now says: `Save what you notice. Get care advice that remembers your plants.`
- Homepage support copy now frames the loop as:
  - `Capture what changed`
  - `Ask from your own notes`
  - `Turn answers into care`
- Auth gate now matches the homepage value proposition and prompts users to start with one plant.
- Today composer now says: `Add what changed. Get one next step.`
- Today disabled CTA now says: `Add a note or photo`.
- Today active CTA now says: `Get next step`.
- First garden setup now says: `Start with the place you grow.`

## Screenshot Evidence

- `desktop-home.png`
- `mobile-home.png`
- `desktop-auth-or-app.png`
- `mobile-auth-or-app.png`
- `desktop-tour-ask.png`
- `mobile-tour-ask.png`
- `desktop-tour-property.png`
- `mobile-tour-property.png`

## Rendered Checks

- No horizontal overflow on checked routes.
- No visible small click targets under 40px on checked routes.
- No forbidden user-facing hits for early access, private beta, working product, prototype, waitlist, homepage, or developer.
- No visible image issues on checked routes.
- Homepage plant images loaded from journal-style `plant-art` URLs, with no old specimen SVG image paths.

## Verification

- Focused copy/content tests passed: 5 files, 26 tests.
- Full `npm test` passed: 24 files, 135 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Remaining Limits

- `/app/my-property` rendered the signed-out auth gate in this browser session, so authenticated live-data states remain unverified.
- This pass did not prove real magic-link delivery, successful signed-in data mutation, photo upload, or screen-reader behavior.
