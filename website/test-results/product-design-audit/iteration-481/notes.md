# Iteration 481 - Remove Future Checks Remember From Remaining Flows

Date: 2026-06-24
Surfaces: sample save notice, first plant setup, plant diagnosis panel

## Product Design Read

After the Ask and empty-state cleanup, three user-facing flows still used the phrase `future checks remember`. That wording describes the product's memory mechanic instead of the gardener's value. The replacement copy keeps the same intent, but says where the note or care item will live.

## Change

- Changed the sample save notice from `Start your garden so future checks remember it.` to `Start your garden to keep notes and care with the right plant.`
- Changed first-plant setup copy from `Put one plant in that bed so future checks remember where it grows.` to `Put one plant in that bed so notes stay with the right spot.`
- Changed the plant diagnosis helper from `Save it with this plant so future checks remember the place.` to `Save it with this plant so the note stays in the right spot.`
- Updated focused tests to require the new wording and reject the old phrase.

## Evidence

- Route visible-text probe saved at `route-visible-text.txt` scanned `/sample-garden/ask`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/app`, and `/`.
- The route probe found the replacement copy on Ask and `/app`, and no scanned route emitted the old `future checks remember` phrase.
- Focused tests passed: `npm test -- sample-garden.test.ts empty-state-content.test.ts diagnose-panel-content.test.ts ai-first-garden-home.test.tsx auth-gate-content.test.ts` - 5 files, 30 tests.
- Source scan found the old phrase only in negative test guards.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
