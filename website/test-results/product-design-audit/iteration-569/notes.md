# Product Design Audit Iteration 569

Date: 2026-06-24

## Objective

Second broad simplification pass focused on the actual app flow after the public homepage cleanup. The target user action was: open the app, understand what to do first, and use My Garden / Plant Journal without tiny repeated controls or redundant explanatory copy.

## Evidence Captured

Before screenshots:
- `01-auth-entry.png`
- `02-sample-today.png`
- `03-sample-property.png`
- `04-sample-calendar.png`
- `05-sample-plants.png`
- `06-sample-catalogue.png`

After screenshots:
- `after-property.png`
- `after-plants.png`
- `after-auth.png`

Browser summaries:
- `capture-summary.json`
- `after-capture-summary.json`

## Findings

- My Garden was visually close, but repeated row controls were below comfortable target size:
  - zone buttons rendered around 28px high
  - bed buttons rendered around 25px high
  - plant chips rendered around 24px high
- Plant Journal search was visually large as a wrapper, but the actual input was only around 27px high.
- Signed-out secondary links were around 25px high.
- My Garden copy repeated `Where things grow` in too many places.
- Plant Journal drawer copy carried a redundant plant-count sentence before the useful action.

## Changes Implemented

- Renamed My Garden app header kicker from `Where things grow` to `Garden map`.
- Simplified My Garden subtitle to `Places, beds, and plants in one view.`
- Changed the inner property label to `Your garden` to avoid repeating the page label.
- Increased target sizes:
  - `.garden-zone__head` to 44px min-height
  - `.garden-bed__head` to 40px min-height
  - `.garden-chip` to 34px min-height
  - `.garden-plants-search` to 44px min-height
  - signed-out secondary auth links to 34px min-height
- Simplified Plant Journal subtitle to `Open a plant to see notes and care.`
- Simplified the empty Plant Journal drawer to `Start with Bell Pepper. Open any plant when you need its notes.`
- Updated app-flow tests to protect the larger targets and simpler copy.

## Verification

- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts`, 3 files, 32 tests.
- Full `npm test` passed: 24 files, 133 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Browser after-capture found no horizontal overflow and no small interactive targets on My Garden or Plant Journal.

## Remaining Risk

- The signed-out auth page still reports the visible email label as below 34px, but that is static label text rather than the input target.
- A true OS/browser keyboard traversal pass is still not proven because earlier in-app Tab simulation did not move focus reliably.
- More simplification remains possible in Weekly care and Field Guide, but this pass intentionally stayed focused on the highest-friction repeated controls.
