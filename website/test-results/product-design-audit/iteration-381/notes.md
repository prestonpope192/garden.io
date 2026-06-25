# Iteration 381 Notes

Scope: make the Plant Journal care summary read like a gardener-facing need, not app state.

## Change

- Changed the Plant Journal empty-guide care summary from `1 plant has care this week.` / `4 plants have care this week.` to `1 plant needs care this week.` / `4 plants need care this week.`
- Updated focused Plant Journal/sample tests to require the new wording and reject the old `has care` phrasing.

## Rationale

`Has care` describes an internal task relationship. `Needs care` maps to what the gardener is trying to decide: which plants need attention this week.

## Evidence

- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/plants` returned `200`, contains `4 plants need care this week.`, and does not contain `4 plants have care this week.`

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
