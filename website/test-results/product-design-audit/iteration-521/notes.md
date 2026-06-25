# Product Design Audit - Iteration 521

Date: 2026-06-24
Scope: make sample-garden action feedback sound like a finished browse-only product instead of a prototype script.

## Changed

- Changed the reusable sample notice from `{message} Start your garden to keep your own notes...` to `Start your garden to {action}.`
- Replaced repeated `Try...` sample action messages with direct garden-start actions, such as `name one area next`, `save this note with the right plant`, and `add this to weekly care`.
- Changed sample plant-placement answer copy from `Try one small herb planting near the kitchen bed` to `Plant one small herb near the kitchen bed`.
- Updated sample-garden tests to require the new direct start-language and reject `sampleSave("Try...")` regressions.

## Evidence

- Used Product Design critical overrides, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan confirms the old `Try...` sample action prefix is gone from the preview helper and now only appears in negative regression guards or the intentional `plants to try` noun phrase.
- Focused tests passed from the website package: `sample-garden.test.ts`, `quick-log-content.test.ts`, `homepage-content.test.ts`, and `auth-gate-content.test.ts` - 4 files, 22 tests.
- After updating one stale empty-state assertion, affected focused tests passed from the website package: `empty-state-content.test.ts` and `sample-garden.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
