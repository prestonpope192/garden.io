# Iteration 478 - Plant Journal Weekly Count

Date: 2026-06-24
Surface: `/sample-garden/plants`

## Product Design Read

The Plant Journal drawer used `4 plants to check this week`, which was understandable but vague. The calendar now uses clearer gardener-facing language, so Plant Journal should match that pattern.

## Change

- Changed the Plant Journal count from `4 plants to check this week.` to `4 plants need care this week.`
- Updated sample and empty-state tests to protect the new wording and reject the old phrase.

## Evidence

- Route probe saved at `plants-route.txt` found `Plant Journal`, `Open one plant to see what happened and what helped.`, `4 plants in 3 beds. Start with Bell Pepper. Open any plant when you want its notes.`, and `4 plants need care this week.`
- Focused tests passed: `npm test -- sample-garden.test.ts empty-state-content.test.ts` - 2 files, 21 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
