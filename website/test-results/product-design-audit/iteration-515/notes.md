# Product Design Audit - Iteration 515

Date: 2026-06-24
Scope: make the public Field Guide filter panel label direct and task-specific.

## Changed

- Changed the opened Field Guide filter panel accessibility label from `Ways to browse plants` to `Plant kinds`.
- Changed the visible panel stamp from `Ways to browse` to `Plant kinds`.
- Updated public catalogue content tests to require `Plant kinds` and reject the older vague label.

## Evidence

- Used Product Design critical overrides, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan confirms the old `Ways to browse` wording now only appears as a negative regression guard.
- Focused tests passed from the website package: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, `homepage-content.test.ts`, and `sample-garden.test.ts` - 4 files, 40 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
