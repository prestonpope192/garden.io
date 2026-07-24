# Iteration 234 - App Entry First-Value Cue

Date: 2026-06-22
Destination: local folder
Capture source: current local app at `http://127.0.0.1:3021`
Audit mode: combined UX, responsive, and accessibility-risk pass

## Scope

Continue simplifying the first-run path, focused on the signed-out app entry reached from `Start your garden`. The user goal is to understand what they are starting before entering an email.

## Accepted screenshots

- `screenshots/01-home-desktop.png` - homepage desktop.
- `screenshots/02-home-mobile.png` - homepage mobile.
- `screenshots/03-sample-property-mobile.png` - sample My Garden mobile.
- `screenshots/04-sample-plants-mobile.png` - sample My Plants mobile.
- `screenshots/05-sample-calendar-mobile.png` - sample This Week mobile.
- `screenshots/06-sample-catalogue-mobile.png` - sample Find Plants mobile.
- `screenshots/07-app-my-property-mobile.png` - signed-out app entry before this pass.
- `screenshots/08-app-my-property-desktop.png` - signed-out app entry before this pass.
- `screenshots/09-app-my-property-mobile-final.png` - signed-out app entry mobile after this pass.
- `screenshots/10-app-my-property-desktop-final.png` - signed-out app entry desktop after this pass.

## Finding

The app entry was visually clean and did not overflow, but it asked for an email before explaining the first value path. A prospective user could understand the promise, but not what would happen immediately after opening the app.

## Changed

- Added a compact first-value cue before the email form:
  - `Name your garden.`
  - `Add one bed.`
  - `Add one plant.`
- Kept the framing user-facing: `First, make a place for your garden notes.`
- Added mobile CSS so the steps stack cleanly on phones.
- Added regression tests for the auth-gate copy and mobile layout rules.

## Result

The signed-out entry now explains the smallest useful setup before asking for email. It reduces signup uncertainty without adding a wizard or extra route.

## Evidence

- Focused tests passed: `auth-gate-content.test.ts`, `mobile-layout-css.test.ts`, and `auth-magic-link-route.test.ts`, 3 files, 6 tests.
- Full `npm test` passed: 22 files, 117 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Route probe passed with `200` for `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, and `/app/my-property`.
- Final mobile CDP metrics at 390px: document/body scroll width `390px`, no overflowing elements, first-steps block before form, form before secondary links.
- Final desktop CDP metrics at 1280px: document/body scroll width `1280px`, no overflowing elements, first-steps block before form, form before secondary links.

## Evidence limits

- Screenshots and DOM-order metrics do not prove full keyboard/focus behavior.
- This pass did not send a real magic link.
- Authenticated first-run setup after sign-in still needs a separate interaction pass.

