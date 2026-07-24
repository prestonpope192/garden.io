# Iteration 476 - Today Shortcut Label

Date: 2026-06-24
Surface: `/sample-garden/ask`

## Product Design Read

The Today shortcut row used `See your garden` for the My Garden destination. The label was understandable, but softer and less scannable than the destination name used across the rest of the app.

## Change

- Changed the Today shortcut from `See your garden` to `My Garden`.
- Changed the shortcut aria label from `See your garden` to `Open My Garden`.
- Updated Today and sample garden tests to protect the concrete destination label and reject the old wording.

## Evidence

- Route probe saved at `today-route.txt` found `Your garden, smarter.`, `Add a note or photo. Keep what helped with the right plant.`, `What changed in your garden?`, `My Garden`, `Weekly care`, and `Choose plants`.
- Focused tests passed: `npm test -- ai-first-garden-home.test.tsx sample-garden.test.ts auth-gate-content.test.ts` - 3 files, 20 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
