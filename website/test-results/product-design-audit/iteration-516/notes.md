# Product Design Audit - Iteration 516

Date: 2026-06-24
Scope: make the Today/Ask saved-note flow sound more like a garden journal and less like a system check.

## Changed

- Changed saved answer note text from `Checked:` to `Noted:`.
- Changed the save confirmation from `Saved with {place} for next time.` to `Saved with {place}.`
- Changed the answer follow-up button from `Check again` to `Add follow-up`.
- Updated Today-flow tests to require the new note-oriented copy and reject the older check-oriented labels.

## Evidence

- Used Product Design critical overrides, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan confirms old exact strings (`Checked:`, `Check again`, and the exact `for next time` confirmation tail) are gone from the Ask component and now only appear as negative regression guards where relevant.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `auth-gate-content.test.ts`, `public-catalogue-content.test.ts`, and `homepage-content.test.ts` - 5 files, 35 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
