# Product Design Audit - Iteration 278

Date: 2026-06-23
Scope: sample app flow, with implementation focused on the My Plants default state.
Preview: http://127.0.0.1:3021/sample-garden/plants

## Captured Flow

- `01-desktop-home.png` - desktop homepage
- `02-desktop-ask.png` - desktop Ask
- `03-desktop-property.png` - desktop My Garden
- `04-desktop-calendar.png` - desktop This Week
- `05-desktop-plants.png` - desktop My Plants before this pass
- `06-desktop-catalogue.png` - desktop Find Plants
- `07-mobile-home.png` - mobile homepage
- `08-mobile-ask.png` - mobile Ask
- `09-mobile-property.png` - mobile My Garden
- `10-mobile-calendar.png` - mobile This Week
- `11-mobile-plants.png` - mobile My Plants before this pass
- `12-mobile-catalogue.png` - mobile Find Plants
- `13-desktop-plants-after.png` - desktop My Plants after this pass
- `14-mobile-plants-after.png` - mobile My Plants after this pass

## Finding

The core sample app flow has no horizontal overflow across the captured routes, and the Ask / This Week screens are moving in the right direction. The clearest remaining simplification issue was in My Plants: the default drawer repeated the first care plant and task, then the first plant card repeated the same Bell Pepper / watering information immediately below it.

That made the default My Plants state feel like two summaries before the user reached the actual plant records.

## Change

- Changed the default drawer label from `First plant to check` to `Plant records`.
- Removed the repeated Bell Pepper focus block from the empty/default My Plants drawer.
- Rewrote the drawer summary to: `4 growing plants across 3 beds. The first record is the next plant to check. Open any plant for notes, photos, and history.`
- Removed the unused `.garden-plants2-empty-guide__focus` CSS block.
- Updated regression tests so the duplicated focus panel does not come back.

## Evidence

- Before My Plants metrics:
  - Desktop and mobile had no overflow.
  - Bell Pepper appeared twice in rendered text.
  - `Water deeply before the hot afternoon` appeared twice in rendered text.
  - The old summary `The list starts with the next plant to check.` was present.
- After My Plants metrics:
  - Desktop and mobile still have no overflow.
  - Bell Pepper appears once in rendered text.
  - `Water deeply before the hot afternoon` appears once in rendered text.
  - `.garden-plants2-empty-guide__focus` is absent.
  - `First plant to check` is absent.
  - The new summary is present.

## Verification

- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 30 tests.
- Full `npm test` passed - 23 files, 127 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.

## Accessibility Notes

- The pass removes redundant repeated text from the default My Plants state, which should improve screen-reader scanning.
- Screenshot and DOM checks do not prove complete keyboard or screen-reader behavior. A later pass should test selecting a plant, moving into the drawer tabs, and returning to the list by keyboard.

## Evidence Limits

This pass audited the read-only sample flow and made a scoped shared component change. It did not exercise authenticated editing, filters, plant drawer tabs, or mutation flows.
