# Iteration 484 - Homepage Plant Card Journal Language

Date: 2026-06-24
Surface: `/`

## Product Design Read

The Borage showcase card used `Track blooms...`, which sounded more like product behavior than a gardener's journal habit. The homepage is trying to sell the simple value of keeping useful garden notes, so the card should use note-taking language.

## Change

- Changed the Borage card note from `Track blooms, reseeding, companion planting, and pollinator visits.` to `Note blooms, reseeding, companion planting, and pollinator visits.`
- Updated homepage content tests to require the new wording and reject the old `Track blooms` copy.

## Evidence

- Live homepage route probe saved at `homepage-route.txt` found `Borage`, `Bees in the borage`, and `Note blooms, reseeding, companion planting, and pollinator visits.`
- The route probe did not find `Track blooms, reseeding, companion planting, and pollinator visits.`
- Focused tests passed: `npm test -- homepage-content.test.ts homepage-visual-css.test.ts app-flow-visual-css.test.ts auth-gate-content.test.ts sample-garden.test.ts` - 5 files, 32 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
