# Iteration 477 - This Week Count Copy

Date: 2026-06-24
Surface: `/sample-garden/calendar`

## Product Design Read

The This Week screen was already simple, but the count line used `care steps this week`, which sounds more like task-product language than how a gardener would scan the week.

## Change

- Changed the count line from `3 care steps this week` to `3 things need care this week`.
- Changed the section aria label from `Care steps this week` to `Things needing care this week`.
- Updated sample garden tests to protect the new wording and reject the old count phrase.

## Evidence

- Route probe saved at `calendar-route.txt` found `This Week`, `Start with what needs care. Let the rest wait.`, `Start here`, `3 things need care this week`, `Today`, `Water deeply before the hot afternoon`, and `Later this week`.
- Focused tests passed: `npm test -- sample-garden.test.ts empty-state-content.test.ts` - 2 files, 21 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
