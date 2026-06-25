# Iteration 506 - Ask Flow Result Language

Scope: make the Ask flow feel less like diagnostic machinery and more like a garden notebook that reads saved context and gives practical guidance.

Changed:
- Changed loading copy from `Checking your garden...` / `Checking garden...` to `Reading your notes and season...` / `Reading notes...`.
- Changed follow-up result language from `Look for:` to `Watch for:`.
- Updated follow-up cleanup to strip either `look for` or `watch for` if the model includes that prefix.
- Changed the rationale fallback from `Based on what you shared, your season, and recent garden notes.` to `From your notes, season, and garden details.`
- Changed saved care-task provenance from `From this garden check:` to `From this garden note:`.

Evidence:
- Used Product Design audit guidance, Product Design critical overrides, session budget guidance, current source, focused tests, route probe, full tests, build verification, and Garden.io brand memory.
- Source scan confirms `Reading your notes and season...`, `Reading notes...`, `Watch for:`, `From your notes, season, and garden details.`, and `From this garden note:`.
- Source scan rejects stale `Checking garden`, `Checking your garden`, `Look for:`, `Based on what you shared`, and `From this garden check`.
- Route probe of `/sample-garden/ask` confirmed the initial Ask surface still renders correctly with `Today`, `Your garden, smarter.`, `See what helps`, and the suggested prompts.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `diagnose-panel-content.test.ts`, and `garden-mutation-copy.test.ts` - 4 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus source/test/build verification.
- `garden-ask-view.tsx` and `ai-first-garden-home.test.tsx` are currently untracked in the broader worktree, so tracked `git diff` output is not available for these specific files.
