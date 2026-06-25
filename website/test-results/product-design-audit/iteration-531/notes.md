# Product Design Audit - Iteration 531

Date: 2026-06-24
Scope: make destructive garden-map copy plain about what is removed and what is kept.

## Changed
- Changed area and bed removal confirmations from `Notes and care history stay in your garden history.` to `Notes you already saved stay in your garden.`
- Changed plant removal confirmation from `Its notes, care history, and saved history will be removed too.` to `Notes and care saved with this plant will be removed too.`
- Updated the destructive-copy regression test to require the plainer wording and reject the older internal history language.

## Evidence
- Used orchestratror-mode to keep the design decision in the main thread while using bounded source scans as evidence.
- Source scan found the older `care history` / `saved history` wording only in garden-map destructive confirmations and a regression test.
- Focused tests passed from the website package: `empty-state-content.test.ts` and `sample-garden.test.ts` - 2 files, 21 tests.

## Verification
- Focused tests passed from the website package: 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- App/test source scan confirms the destructive garden-map copy now uses plain saved-note language and keeps older `care history` / `saved history` phrases only in audit notes.

## Limit
- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
