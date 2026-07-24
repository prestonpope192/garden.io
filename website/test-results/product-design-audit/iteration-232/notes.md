# Iteration 232 - Mobile My Garden Next Step

Date: 2026-06-22
Destination: local folder
Capture source: current local app at http://127.0.0.1:3021
Audit mode: combined UX, responsive, and accessibility-order pass

## Scope

Flow audited:
1. Sample My Garden on desktop.
2. Sample My Plants on desktop.
3. Signed-out app entry on desktop.
4. Sample My Garden, My Plants, This Week, Find Plants, and signed-out app entry on mobile.

User goal:
- See the next useful action before scanning garden structure.
- Understand that the product keeps plants, beds, notes, photos, and next steps connected.
- Try the product on a phone without horizontal clipping or hidden primary actions.

Accessibility target:
- Mobile layout should not horizontally overflow at 390px.
- Visual order and text/DOM order should both put the next-step guide before the garden layout.
- Desktop should preserve the existing plot-left, guide-right layout.

## Accepted Screenshots

Before:
- `screenshots/01-sample-property-desktop.png` - sample My Garden desktop before this pass.
- `screenshots/02-sample-plants-desktop.png` - sample My Plants desktop.
- `screenshots/03-app-entry-desktop.png` - signed-out app entry desktop.
- `screenshots/04-sample-property-mobile.png` - sample My Garden mobile before this pass.
- `screenshots/05-sample-plants-mobile.png` - sample My Plants mobile.
- `screenshots/06-sample-calendar-mobile.png` - sample This Week mobile.
- `screenshots/07-sample-catalogue-mobile.png` - sample Find Plants mobile.
- `screenshots/08-app-entry-mobile.png` - signed-out app entry mobile.

After:
- `screenshots/09-sample-property-mobile-after.png` - sample My Garden mobile after the next-step order fix.
- `screenshots/10-sample-property-desktop-after.png` - sample My Garden desktop after the grid-row fix.

Rejected evidence:
- An intermediate desktop after screenshot showed the plot had dropped into a second grid row after the DOM reorder. That state was rejected and fixed before accepting final evidence.

## Findings

Strengths:
- Mobile app routes no longer overflow horizontally at 390px.
- My Plants, This Week, Find Plants, and the signed-out app entry are compact and readable on phone screens.
- The sample app uses real plant photos and plain navigation labels.

UX risk found:
- On mobile My Garden, the first visible content showed the garden layout before the answer a user likely wants first: what needs care next.

Accessibility risk found:
- A CSS-only order change would have created a mismatch between visual order and text/assistive-technology reading order. The implementation was adjusted so the guide renders first in DOM and visually first on mobile.

## Changes Implemented

- Moved the Garden details drawer before the plot in `PropertyView` DOM order.
- Added desktop grid-column/grid-row placement so the plot still renders left and the guide still renders right on desktop.
- Let tablet/mobile naturally stack the guide before the plot, with tighter drawer spacing on phones.
- Hid the redundant drawer scope line on phone screens to keep the first card focused on the next step.
- Added tests for DOM order and desktop/mobile layout rules.

## Verification

- Focused tests passed: `app-flow-visual-css.test.ts`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts` - 3 files, 21 tests.
- Full `npm test` passed: 22 files, 117 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Route probe passed with `200` for `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, and `/app/my-property`.
- Final mobile CDP metrics at 390px:
  - `docScrollWidth`: 390
  - `bodyScrollWidth`: 390
  - `visualOrder`: `drawer-before-plot`
  - `textOrder`: `guide-before-layout`
  - `overflowing`: []

## Step Health

1. Sample My Garden desktop - healthy after grid-row correction. Plot remains left, guide remains right.
2. Sample My Garden mobile - improved. The first card now answers what needs care next before showing the layout.
3. Sample My Plants mobile - healthy. Compact list, real photos, no overflow.
4. Sample This Week mobile - healthy. Current care list is first and scannable.
5. Sample Find Plants mobile - healthy. Real photos and fit facts are visible.
6. Signed-out app entry mobile - healthy. One clear email action plus browse links, no overflow.

## Remaining Limits

- Screenshots and DOM order metrics do not prove full keyboard/focus behavior.
- Authenticated write flows still need a separate live interaction pass.
- This pass did not test actual task completion toggles or form submissions.
