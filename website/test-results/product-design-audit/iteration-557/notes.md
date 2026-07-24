# Iteration 557 Notes

Date: 2026-06-24

Scope: normalize first-run and plant-check copy away from `right spot` language toward the broader `where they belong` promise.

Changed:
- Changed homepage tracking copy from `Place each plant` / `Choose the bed once...` to `Give each plant a home` / `Choose where it grows once. Notes and photos stay where they belong.`
- Changed auth and Ask first-run helper copy from `notes stay with the right spot` to `notes stay where they belong`.
- Changed first-run setup and Plant Journal empty-state copy to use `notes stay where they belong`.
- Changed plant Diagnose helper copy to `Keep it with this plant so the note stays where it belongs.`
- Updated homepage, auth, Ask, empty-state, and Diagnose tests to require the new wording and reject the older `right spot` wording.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection showed the first-run path still used `right spot` and bed-specific homepage copy even after the app shifted toward broader note destinations.
- Targeted stale-copy scans found old `right spot` and homepage wording removed from source and present only as negative test assertions.

Verification:
- Focused tests passed from the website package: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, `empty-state-content.test.ts`, and `diagnose-panel-content.test.ts` - 5 files, 22 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Direct browser screenshot capture was not used in this run, so this pass used source/test verification before broader visual checks.
