# Product Design Audit - Iteration 525

Date: 2026-06-24
Scope: make first-run empty states across the app point to the same simple gardener action.

## Changed
- Changed the Ask no-garden context and panel from `Add one plant to begin.` / `First plant` to `Give one plant a home.` / `Start small`.
- Changed the Ask and sign-in helper text from `Give one plant a bed so notes stay with the right spot.` to `Choose where it grows so notes stay with the right spot.`
- Changed the sign-in, Calendar, and Plant Journal empty states to use `Give one plant a home...` language instead of setup-style `Add one plant to begin` language.
- Updated Ask, auth-gate, empty-state, and sample-garden tests to require the new first-run wording and reject the older setup phrasing.

## Evidence
- Used Product Design critical overrides, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan found the old first-run phrase across Ask, sign-in, Calendar, and Plant Journal; the user-facing source now uses the new home/where-it-grows wording.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `auth-gate-content.test.ts`, `empty-state-content.test.ts`, `sample-garden.test.ts`, and `app-flow-visual-css.test.ts` - 5 files, 38 tests.

## Verification
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- App/component/test source scan confirms the replaced first-run phrases now only appear as negative regression guards.

## Limit
- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
