# Iteration 475 - My Garden Weekly Prompt

Date: 2026-06-24
Surface: `/sample-garden/property`

## Product Design Read

The My Garden drawer had the right information, but the summary line still sounded like app instructions: `Start with care for Bell Pepper. Open the plant if you need its notes.` The task title is already shown directly above, so the summary can be shorter and more natural.

## Change

- Changed the weekly prompt summary to `Start with Bell Pepper. Open it when you want its notes.`
- Updated the sample garden test to protect the new wording and reject the old task-app phrasing.

## Evidence

- Route probe saved at `my-garden-route.txt` found `Where things grow`, `My Garden`, `This week`, `Water deeply before the hot afternoon`, `Container Row · Kitchen Garden`, and `4 plants in 3 beds. Start with Bell Pepper. Open it when you want its notes.`
- Focused tests passed: `npm test -- sample-garden.test.ts empty-state-content.test.ts` - 2 files, 21 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
