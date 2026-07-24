# Iteration 537 - Garden Note Language

Scope: make the app's note capture actions feel like a garden record instead of a storage workflow.

Changed:
- Changed the floating Quick Log dialog from `Save what happened` to `Keep a garden note`.
- Changed the target picker label from `Save with` to `Keep with`.
- Changed note-submit buttons from `Save to garden` to `Keep in garden` in Quick Log, My Plants, and My Garden note forms.
- Changed the Ask save panel support copy from `Save this with...` to `Keep this with...`, and changed its locked sample hint to `Start your garden to keep notes with the right plant.`
- Updated content tests to require the new keep-note wording and reject the older save/storage wording.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection found the note capture surfaces still used storage-flavored language (`Save what happened`, `Save with`, `Save to garden`) while nearby Ask flows had already moved toward `Keep note` / `Kept`.
- Focused tests passed from the website package: `quick-log-content.test.ts`, `ai-first-garden-home.test.tsx`, `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `sample-garden.test.ts` - 5 files, 42 tests.
- Source scan confirms the older save/storage strings are gone from the live Quick Log, Ask, My Plants, and My Garden note-capture code.

Verification:
- Focused tests passed from the website package: 5 files, 42 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
