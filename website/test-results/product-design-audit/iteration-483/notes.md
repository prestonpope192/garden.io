# Iteration 483 - Homepage Repeated Promise Cleanup

Date: 2026-06-24
Surface: `/`

## Product Design Read

The homepage habit loop repeated itself: the card title said `Keep what helped`, and the body repeated `Keep what helped with the plant or bed it belongs to.` That made the section feel less polished and less intentional.

## Change

- Kept the card title `Keep what helped`.
- Changed the body copy to `Keep the helpful note with the plant or bed it belongs to.`
- Updated homepage content tests to require the new copy and reject the repeated old line.

## Evidence

- Live homepage route probe saved at `homepage-route.txt` found `Keep what helped` and `Keep the helpful note with the plant or bed it belongs to.`
- The route probe did not find `Keep what helped with the plant or bed it belongs to.` or `Save useful care with the plant or bed it belongs to.`
- Focused tests passed: `npm test -- homepage-content.test.ts homepage-visual-css.test.ts app-flow-visual-css.test.ts auth-gate-content.test.ts sample-garden.test.ts` - 5 files, 32 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
