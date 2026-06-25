# Product Design Audit - Iteration 517

Date: 2026-06-24
Scope: remove remaining check-oriented assistive and secondary-action labels from the Today note flow.

## Changed

- Changed the uploaded-photo alt text from `Photo added for this plant check` to `Photo added to this garden note`.
- Changed the prompt list aria label from `Suggested garden checks` to `Suggested garden notes`.
- Changed the answer article aria label from `Garden check result` to `Garden note result`.
- Changed the secondary-actions visible label from `More checks` to `More care ideas`.
- Updated Today-flow tests to require the new note/care wording and reject the older check-oriented labels.

## Evidence

- Used Product Design critical overrides, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan confirms the old exact labels now only appear as negative regression guards.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `auth-gate-content.test.ts`, and `homepage-content.test.ts` - 4 files, 25 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
