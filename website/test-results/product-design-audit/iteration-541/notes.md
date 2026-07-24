# Iteration 541 - Journal Warnings And Outcome Copy

Scope: remove remaining storage-flavored `save` / `saved` language from destructive warnings, care empty states, and Plant Journal outcome capture.

Changed:
- Changed area and bed removal warnings from `Notes you already saved stay in your garden.` to `Notes you already kept stay in your garden.`
- Changed plant removal warning from `Notes and care saved with this plant will be removed too.` to `Notes and care kept with this plant will be removed too.`
- Changed the scoped care empty state from `No care saved here right now.` to `No care waiting here right now.`
- Changed Plant Journal outcome submit copy from `Save to plant journal` to `Keep in plant journal.`
- Changed Plant Journal empty copy from `Save a note, photo, harvest, or lesson...` to `Keep a note, photo, harvest, or lesson...`
- Updated Plant Timeline and empty-state tests to require the new journal language and reject the older save/storage wording.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection found the garden map and Plant Journal still had visible `saved` / `save` strings after earlier Quick Log, Ask, homepage, and mutation-message passes had moved to `keep`.
- Focused tests passed from the website package: `plant-timeline-content.test.ts`, `empty-state-content.test.ts`, `sample-garden.test.ts`, `garden-mutation-copy.test.ts`, and `quick-log-content.test.ts` - 5 files, 26 tests.
- Source scan confirms the new `kept` / `keep` strings are present in `property-view.tsx` and `plant-timeline.tsx`; the older strings remain only as negative regression guards in tests.

Verification:
- Focused tests passed from the website package: 5 files, 26 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
