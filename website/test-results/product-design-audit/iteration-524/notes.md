# Product Design Audit - Iteration 524

Date: 2026-06-24
Scope: simplify the Ask entry copy so it reads like a garden journal habit instead of abstract answer tracking.

## Changed
- Changed the Ask surface sublead from `Add a note or photo. Keep what helped with the right plant.` to `Add what changed. Keep what helped.`
- Changed the Ask composer helper from `Save it so you remember what helped.` to `Save it with the plant or bed it belongs to.`
- Updated the matching homepage simple-habit line to use the same shorter phrase.
- Updated Ask, homepage, and sample-garden tests to require the new phrasing and reject the older abstract line.

## Evidence
- Used Product Design critical overrides, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan showed the old Ask sublead existed in the Ask view and homepage; both are now replaced.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `homepage-content.test.ts`, `sample-garden.test.ts`, `quick-log-content.test.ts`, and `auth-gate-content.test.ts` - 5 files, 27 tests.

## Verification
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- App/component/test source scan confirms the replaced phrases now only appear as negative regression guards.

## Limit
- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
