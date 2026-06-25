# Product Design Audit - Iteration 279

Date: 2026-06-23
Scope: My Garden layout-first mobile pass.
Preview: http://127.0.0.1:3021/sample-garden/property

## Captured Screens

- `01-desktop-property-before.png` - desktop My Garden before this pass
- `02-mobile-property-before.png` - mobile My Garden before this pass
- `03-desktop-property-after.png` - desktop My Garden after this pass
- `04-mobile-property-after.png` - mobile My Garden after this pass

## Finding

My Garden is the place-based memory view, but the mobile screen opened with the care guide before the actual garden layout. The guide ran from about 222px to 491px, and the garden layout did not begin until about 515px.

That made the map feel secondary, even though this route exists to show areas, beds, plants, and notes by place.

## Change

- Moved the garden drawer after the plot in the DOM.
- Removed the mobile `order: -1` override that forced the drawer above the plot.
- Kept the desktop two-column layout intact through the existing grid-column rules.
- Updated tests so `Garden layout` comes before `First place to check`.

## Evidence

- Before mobile metrics:
  - No horizontal overflow.
  - Drawer top: 222px.
  - Guide bottom: 477px.
  - Garden plot top: 515px.
- After mobile metrics:
  - No horizontal overflow.
  - Garden plot top: 222px.
  - Garden layout label top: 222px.
  - Drawer top: 808px.
  - Guide top: 821px.
  - Rendered text order: `Garden layout` before `First place to check`.
- Desktop after screenshot keeps the plot on the left and the guide as right-side marginalia.

## Verification

- Focused tests passed: `sample-garden.test.ts` and `app-flow-visual-css.test.ts` - 2 files, 22 tests.
- Full `npm test` passed - 23 files, 127 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.

## Accessibility Notes

- Moving the layout before the guide improves mobile reading order for the primary task: understand where plants are.
- Screenshot and text-order checks do not prove complete keyboard behavior. A later pass should test selecting an area, bed, and plant by keyboard and verify focus moves into the drawer predictably.

## Evidence Limits

This pass verified the read-only sample My Garden route. It did not exercise authenticated editing, setup wizard actions, or plant-detail drawer tab workflows.
