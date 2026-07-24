# Iteration 417 - Plant Journal Care Summary

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/sample-garden/plants`

## Scope

Reduce urgency in the Plant Journal empty-state summary while keeping the same weekly care signal.

## Change

- Changed the Plant Journal care summary from `1 plant needs care this week.` / `{n} plants need care this week.` to `1 plant has care this week.` / `{n} plants have care this week.`
- Updated sample and empty-state tests to require the calmer phrasing and reject the old `need care` wording.

## Rationale

`need care this week` made the Plant Journal feel more urgent than the surrounding journal-style copy. `have care this week` keeps the useful status but reads more like a calm weekly summary.

## Evidence

- `npm test -- sample-garden.test.ts empty-state-content.test.ts` passed from the website package: 2 files, 21 tests.
- Live `/sample-garden/plants` route-output probe found `4 plants have care this week.` and did not find `4 plants need care this week.`
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed in this turn, and the only available screenshot-capable app tool has been blocked by safety policy for the Codex app in this session. Playwright fallback requires explicit permission under the Product Design rules.
