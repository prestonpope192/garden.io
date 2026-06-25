# Iteration 549 Notes

Date: 2026-06-24

Scope: make the first-run garden structure language more user-facing by replacing exposed `area` setup copy with the simpler `place` language a gardener would naturally understand.

Changed:
- Changed the setup wizard's first step label/action from `Area` / `Add area` to `Place` / `Add place`.
- Changed first-run and map actions from `Add area`, `Add first area`, `New area`, and `Start with one area...` to `place` wording.
- Changed the add-place form copy from `Name this area`, `Area name`, and `Save this area` to `Name this place`, `Place name`, and `Save this place`.
- Changed first-run mutation feedback from `Area added...` / `Area details updated.` / `Area removed.` to `Place...` wording.
- Updated sample garden preview save notices and tree ARIA labels to use `place` wording.
- Updated focused copy tests to require the new language and reject the older `area` setup phrasing.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, orchestratror-mode guidance, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection showed that iteration 548 fixed the empty state headline but left adjacent controls and feedback saying `area`, creating a mismatch in the exact first-run path.
- Targeted stale-copy scans found no remaining exposed `Add area`, `Area added`, `Name this area`, `Save this area`, `Start with one area`, `name one area`, or `areas ·` strings in touched app surfaces, aside from tests that explicitly reject the old copy.

Verification:
- Focused tests passed from the website package: `empty-state-content.test.ts`, `garden-mutation-copy.test.ts`, `sample-garden.test.ts`, and `ai-first-garden-home.test.tsx` - 4 files, 27 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader visual checks.
