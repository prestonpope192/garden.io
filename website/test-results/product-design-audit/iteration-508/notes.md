# Iteration 508 - Plant Check Loading Language

Scope: align the plant-level check panel with the main Ask flow's calmer notebook language.

Changed:
- Changed the plant-check loading button from `Checking...` to `Reading notes...`.
- Changed the loading skeleton aria label from `Checking this plant...` to `Reading plant notes...`.
- Changed the loading skeleton text from `Checking {plant}...` to `Reading notes for {plant}...`.
- Changed the result follow-up label from `Look for:` to `Watch for:`.
- Kept the visible action `Check this plant`, because it still describes the user's immediate task clearly.

Evidence:
- Used Product Design critical overrides, session budget guidance, current source, focused tests, full tests, build verification, and Garden.io brand memory.
- Source scan confirms `Reading notes...`, `Reading plant notes...`, `Reading notes for {context.name}...`, and `Watch for:`.
- Source scan rejects stale `Checking...`, `Checking this plant...`, `Checking {context.name}...`, and `Look for:`.
- Focused tests passed from the website package: `diagnose-panel-content.test.ts`, `diagnose-route-copy.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 4 files, 22 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used source/test/build verification.
- The changed loading/result text appears after client-side interactions; this pass verified the message source and tests rather than live browser interaction.
- `diagnose-panel-content.test.ts` is currently untracked in the broader worktree, so tracked `git diff` output is not available for that test file.
