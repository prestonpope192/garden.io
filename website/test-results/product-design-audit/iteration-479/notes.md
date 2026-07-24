# Iteration 479 - This Week First Item Label

Date: 2026-06-24
Surface: `/sample-garden/calendar`

## Product Design Read

The This Week screen used the badge `Start here` above the first care item. It worked, but read like an interface instruction. `First up` is shorter and more natural for a weekly garden list.

## Change

- Changed the first-item badge from `Start here` to `First up`.
- Updated sample garden tests to protect the new wording and reject the old label.

## Evidence

- Route probe saved at `calendar-route.txt` found `This Week`, `Start with what needs care. Let the rest wait.`, `First up`, `3 things need care this week`, `Today`, `Water deeply before the hot afternoon`, and `Later this week`.
- Focused tests passed: `npm test -- sample-garden.test.ts empty-state-content.test.ts ai-first-garden-home.test.tsx public-catalogue-content.test.ts` - 4 files, 36 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
