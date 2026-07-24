# Iteration 511 - Ask Flow Note Language

Date: 2026-06-24

## Scope

Make the Ask result and save path feel more like a garden note a person would keep, and less like system explanation.

## Changed

- Changed the loading line from `Looking for what may help...` to `Looking through your garden notes...`.
- Changed the no-garden result hint from `Start your garden to keep notes and care like this.` to `Start your garden to save notes with the right plant.`
- Changed the result reasoning summary from `See the notes, season, and garden details behind it.` to `See the notes and season behind this step.`
- Changed the fallback result source from `From your notes, season, and garden details.` to `From your notes and season.`

## Evidence

- Source scan confirms the Ask flow now contains the new note/season copy and rejects the older system-ish phrases.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `homepage-content.test.ts`, `auth-gate-content.test.ts`, `diagnose-panel-content.test.ts`, and `diagnose-route-copy.test.ts` - 6 files, 29 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this tool context. This pass used source scans, content tests, full tests, and build verification.
