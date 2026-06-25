# Iteration 379 Notes

Scope: make app count labels describe the garden, not the database state.

## Change

- Changed Garden Check context copy from `1 plant saved in 1 bed` / `4 plants saved in 3 beds` to `1 plant in 1 bed` / `4 plants in 3 beds`.
- Changed My Garden summary copy from `4 plants saved in 3 beds` to `4 plants in 3 beds`.
- Changed Plant Journal drawer copy from `4 saved plants in 3 beds` to `4 plants in 3 beds`.
- Updated focused app-flow tests to require the natural count labels and reject the old `saved` count phrasing.

## Rationale

`Saved` describes app storage. Gardeners care about what is growing and where. Removing `saved` makes the Ask, My Garden, and Plant Journal surfaces feel more like a living garden notebook and less like a database record list.

## Evidence

- Focused tests passed from the website package: `ai-first-garden-home.test.tsx` and `sample-garden.test.ts` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask`, `/sample-garden/property`, and `/sample-garden/plants` returned `200`, contain `4 plants in 3 beds`, and do not contain `4 plants saved in 3 beds` or `4 saved plants in 3 beds`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
