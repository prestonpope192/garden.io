# Iteration 540 - Public Promise And Plant Drawer Language

Scope: align the homepage, metadata, and Plants drawer with the app's garden-notebook `keep` language.

Changed:
- Changed the homepage hero promise from `Save what changed. Keep what helped. See what works.` to `Note what changed. Keep what helped. See what works.`
- Changed browser/share metadata from `Save garden notes, keep what helped...` to `Keep garden notes, remember what helped...`
- Changed homepage plant-section and plant-card notes from `Save bloom...` / `Save sowing...` to `Keep bloom...` / `Keep sowing...`
- Changed Plants drawer prompts from `Choose a plant to save a note...` to `Choose a plant to keep a note...`
- Updated homepage and sample Plants tests to require the cleaner `note` / `keep` wording and reject the older `save` wording.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection found public-facing homepage copy and Plants drawer prompts still used `save` even though recent app passes moved note actions to `keep`.
- Focused tests passed from the website package: `homepage-content.test.ts`, `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, and `quick-log-content.test.ts` - 4 files, 25 tests.
- Source scan confirms the new `note` / `keep` strings are present in `app/page.tsx`, `app/layout.tsx`, and `plants-view.tsx`; the older strings remain only as negative regression guards in tests.

Verification:
- Focused tests passed from the website package: 4 files, 25 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
