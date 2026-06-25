# Product Design Audit - Iteration 528

Date: 2026-06-24
Scope: make the Ask save-target picker name the gardener's choice directly.

## Changed
- Changed the expanded Ask save-target label from `Where should this note live?` to `Choose the plant or bed`.
- Updated Ask tests to require the new direct label and reject the older abstract wording.

## Evidence
- Used Product Design critical overrides, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection showed the compact save row already says `Save with`, while the expanded picker still used the more abstract `Where should this note live?`.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `quick-log-content.test.ts`, `sample-garden.test.ts`, and `auth-gate-content.test.ts` - 4 files, 22 tests.

## Verification
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- App/test source scan confirms the expanded Ask save-target picker now uses `Choose the plant or bed` and keeps `Where should this note live?` only as a negative regression guard.

## Limit
- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
