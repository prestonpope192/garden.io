# Iteration 485 - Sample Field Guide Observation Language

Date: 2026-06-24
Surface: `/sample-garden/catalogue`

## Product Design Read

The Bell Pepper fit note said `watering and heat notes are easy to track.` That sounded more like product tracking behavior than something a gardener notices in the bed. The Field Guide should stay practical and observational.

## Change

- Changed `Warm containers or bed edges where watering and heat notes are easy to track.` to `Warm containers or bed edges where watering and heat stress are easy to notice.`
- Updated sample garden catalogue tests to require the new wording and reject the old phrase.

## Evidence

- Live `/sample-garden/catalogue` route probe saved at `sample-catalogue-route.txt` found `Field Guide`, `Bell Pepper`, `Warm containers or bed edges where watering and heat stress are easy to notice.`, `Good to remember`, and `Watering, support, harvest, and pests.`
- The route probe did not find `Warm containers or bed edges where watering and heat notes are easy to track.`
- Focused tests passed: `npm test -- sample-garden.test.ts empty-state-content.test.ts public-catalogue-content.test.ts catalogue-format.test.ts` - 4 files, 43 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
