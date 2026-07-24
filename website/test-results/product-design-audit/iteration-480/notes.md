# Iteration 480 - Remove Future Checks Remember Copy

Date: 2026-06-24
Surfaces: `/sample-garden/ask`, sign-in gate, empty plant state

## Product Design Read

The phrase `Future checks remember` was short, but it made the app sound like it was explaining its own memory system. A gardener needs the practical reason to save a note: next time, the note has context and stays with the right plant or bed.

## Change

- Changed the Ask hint from `Save it once. Future checks remember.` to `Save the note so next time has context.`
- Changed first-plant setup copy from `Give one plant a bed. Future checks remember it.` to `Give one plant a bed so notes stay with the right spot.`
- Changed the empty plant state from `Add one plant to a bed. Future checks remember it.` to `Add one plant to a bed so notes stay with the right spot.`
- Updated content tests to require the new wording and reject the older phrasing.

## Evidence

- Route probe saved at `ask-route.txt` found `Your garden, smarter.`, `Add a note or photo. Keep what helped with the right plant.`, `What changed in your garden?`, `Check this change`, and `Save the note so next time has context.`
- Focused tests passed: `npm test -- ai-first-garden-home.test.tsx sample-garden.test.ts empty-state-content.test.ts auth-gate-content.test.ts` - 4 files, 28 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
