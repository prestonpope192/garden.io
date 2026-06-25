# Iteration 474 - Homepage Plant Section Copy

Date: 2026-06-24
Surface: `/`

## Product Design Read

The homepage plant section had the right direction, but it repeated `remember what happened` in both the heading and paragraph. That made the section softer and slower than the rest of the simplified homepage.

## Change

- Changed the plant section heading to `See each plant's season in one place.`
- Changed the paragraph to `Save bloom dates, pests, harvests, and what helped as the season changes.`
- Updated homepage content tests to protect the new wording and reject the repeated older copy.

## Evidence

- Route probe saved at `home-route.txt` found `Your garden, smarter.`, `Save what changed. Keep what helped. See what works.`, `See each plant's season in one place.`, and `Save bloom dates, pests, harvests, and what helped as the season changes.`
- Focused tests passed: `npm test -- homepage-content.test.ts homepage-visual-css.test.ts app-flow-visual-css.test.ts` - 3 files, 17 tests.
- Full tests passed: `npm test` - 23 files, 131 tests.
- Build passed: `npm run build`.

## Limit

Browser screenshot capture is still unavailable in this Codex app context, so this pass used route-output probes, source inspection, tests, and build verification instead of new screenshots.
