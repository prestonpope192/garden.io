# Iteration 507 - Example Garden Action Feedback

Scope: make the example garden's action feedback honest about preview behavior while still pointing users toward the real garden setup path.

Changed:
- Changed the reusable preview notice suffix from `Start your garden to keep notes and care with the right plant.` to `Start your garden to keep your own notes with the right plant.`
- Replaced preview action messages that implied real persistence, such as `Your garden is saved`, `Area saved`, `Bed saved`, `Plant saved to your garden`, and `Note saved to your garden`.
- Added try-it language for preview interactions, such as `Try naming one area next.`, `Try naming one area, then one bed.`, `Try saving this note with the right plant.`, and `Try changing this care in your own garden.`
- Updated tests so real app mutation copy can still say `saved`, while the example garden preview uses try-it copy.

Evidence:
- Used Product Design critical overrides, session budget guidance, current source, focused tests, full tests, build verification, and Garden.io brand memory.
- Source scan confirms preview copy now uses `Try...` messages and `Start your garden to keep your own notes with the right plant.`
- Source scan confirms the preview no longer contains stale action feedback such as `Your garden is saved`, `Area saved`, `Bed saved`, `Plant saved to your garden`, `Note saved to your garden`, or `Start your garden to keep notes and care`.
- Focused tests passed from the website package: `sample-garden.test.ts`, `garden-mutation-copy.test.ts`, `ai-first-garden-home.test.tsx`, and `empty-state-content.test.ts` - 4 files, 27 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used source/test/build verification.
- The preview feedback appears after client-side interactions; this pass verified the message source and helper output through tests rather than live browser interaction.
- `garden-app-preview.tsx`, `sample-garden.test.ts`, and `empty-state-content.test.ts` are currently untracked in the broader worktree, so tracked `git diff` output is not available for these specific files.
