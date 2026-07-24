# Product Design Audit - Iteration 522

Date: 2026-06-24
Scope: make first-run setup copy feel like giving one plant a real garden home instead of working through setup labels.

## Changed

- Changed the setup wizard framing from `Start with one plant` to `Give one plant a home`.
- Changed the first setup step title from `Name one area` to `Name where it grows`.
- Changed the bed step title from `Name one bed` to `Name its bed`.
- Changed the bed step body from `Give that plant a clear home...` to `Give your first plant a clear home...`.
- Changed the plant step title from `Add the plant` to `Choose the plant`.
- Updated empty-state tests to require the new setup wording and reject the older repeated setup phrases.

## Evidence

- Used Product Design critical overrides, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan confirms the old setup phrases now only appear as negative regression guards.
- Focused tests passed from the website package: `empty-state-content.test.ts`, `app-flow-visual-css.test.ts`, and `sample-garden.test.ts` - 3 files, 31 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
