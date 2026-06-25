# Product Design Audit - Iteration 518

Date: 2026-06-24
Scope: make the plant care-help path sound like asking for garden help instead of running a check.

## Changed

- Changed the plant care panel label from `Check this plant` to `Ask about this plant`.
- Changed the plant care submit button from `Check this plant` to `Get care help`.
- Changed the note handoff action from `Save and check this plant` to `Save and get care help`.
- Changed care-help route and rate-limit messages from `check your garden` language to `ask about your garden`.
- Changed generated care-step schema and prompt copy from `care checks` / `follow-up check` to `care steps` / `one thing to watch or confirm`.
- Changed medium-confidence suggestion copy from `Worth checking` to `Worth a look`.
- Updated regression tests to require the new user-facing language and reject the older check-oriented phrases.

## Evidence

- Used Product Design critical overrides, Product Design user-context preflight, session budget guidance, orchestratror-mode, current source, focused tests, and Garden.io brand memory.
- Source scan confirms the old exact visible phrases now only appear as negative regression guards, except unrelated internal checkboxes/task status classes.
- Focused tests passed from the website package: `diagnose-panel-content.test.ts`, `diagnose-route-copy.test.ts`, `quick-log-content.test.ts`, `plant-timeline-content.test.ts`, `sample-garden.test.ts`, and `ai-first-garden-home.test.tsx` - 6 files, 26 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
