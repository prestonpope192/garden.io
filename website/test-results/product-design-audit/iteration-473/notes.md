# Iteration 473 - Plant Journal Header

Date: 2026-06-24
Surface: `/sample-garden/plants`

## Product Design Read

The Plant Journal surface should feel like a record for remembering each plant, not only another care queue. The previous subtitle, `Start with the plants that need care.`, made the journal sound like a task dashboard and repeated the This Week job too strongly.

## Change

- Changed the Plant Journal subtitle to `Open one plant to see what happened and what helped.`
- Applied the same wording in the preview app shell and the read-only Plants drawer fallback.
- Updated tests to protect the new wording and reject the old care-queue subtitle.

## Evidence

- Route probe saved at `sample-plants-route.txt` found `Plant Journal`, `Open one plant to see what happened and what helped.`, `Bell Pepper`, `4 plants`, `Borage`, and the drawer prompt.
- Focused tests passed: `npm test -- sample-garden.test.ts empty-state-content.test.ts` - 2 files, 21 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
