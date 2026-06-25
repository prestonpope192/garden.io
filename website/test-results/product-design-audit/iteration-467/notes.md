# Iteration 467 - Plant Journal Care Label

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/sample-garden/plants`

## Audit Read

The Plant Journal cards showed care tasks with the label `Next:`. That was short, but it did not say what kind of next item the grower was looking at. Since this screen is about plants that need care, `Care:` is clearer and still compact.

## Change

- Changed the Plant Journal task-row label from `Next:` to `Care:`.
- Updated sample-garden and empty-state tests to protect the clearer care label and keep the generic next label out.

## Evidence

- Live route-output probe for `/sample-garden/plants` found `Plant Journal`, `Care:`, `Water deeply before the hot afternoon`, and `4 plants in 3 beds. Start with Bell Pepper. Open any plant when you want its notes.`
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. This pass used source inspection, server-rendered route text, focused tests, full tests, and build verification.
