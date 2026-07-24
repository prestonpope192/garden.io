# Product Design Audit - Iteration 519

Date: 2026-06-24
Scope: make sample-garden preview answers feel more like garden journaling and less like inspection/check copy.

## Changed

- Changed the sample water answer from `Check containers first` to `Feel the containers first`.
- Replaced `direct soil check` with a hands-on soil-feel explanation tied to saved notes.
- Changed `daily checks` to `daily notes` in the sample plant-placement answer.
- Changed the fallback answer from `Start with one close check before changing care` to `Start by looking closely before changing care`.
- Changed the sample garden zone note from `gets checked most often` to `gets looked at most often`.
- Updated sample-garden tests to require the new hands-on language and reject the older check-oriented preview copy.

## Evidence

- Used Product Design critical overrides, Product Design user-context preflight, session budget guidance, orchestratror-mode, current source, focused tests, and Garden.io brand memory.
- Source scan confirms the replaced preview phrases now only appear as negative regression guards.
- Focused tests passed from the website package: `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, `quick-log-content.test.ts`, `homepage-content.test.ts`, and `diagnose-panel-content.test.ts` - 5 files, 27 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
