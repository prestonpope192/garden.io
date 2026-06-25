# Iteration 558 Notes

Date: 2026-06-24

Scope: make Ask and plant Diagnose loading states sound like the app is looking at the current garden problem, not merely reading saved notes.

Changed:
- Changed Ask waiting lines from repeated `Reading...` language to `Looking at what changed...`, `Checking your notes and season...`, `Looking through your garden history...`, and `Checking the photo with your garden notes...`.
- Changed the Ask submit loading label from `Reading notes...` to `Looking closely...`.
- Changed plant Diagnose loading labels from `Reading notes...` / `Reading plant notes...` / `Reading notes for {context.name}...` to `Looking closely...` / `Looking over this plant...` / `Looking over {context.name}...`.
- Updated Ask and Diagnose tests to require the new wording and reject the older note-only loading copy.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection showed the core Ask/Diagnose flows accepted notes and photos, but the loading state still said it was only reading notes.
- Targeted stale-copy scans found old `Reading notes` language removed from source and present only as negative test assertions.

Verification:
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx` and `diagnose-panel-content.test.ts` - 2 files, 7 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Direct browser screenshot capture was not used in this run, so this pass used source/test verification before broader visual checks.
