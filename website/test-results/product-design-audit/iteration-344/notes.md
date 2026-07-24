# Iteration 344 Notes

Date: 2026-06-24
Surface: plant-level diagnosis/check panel
Task class: build work
Destination: local audit folder

## Objective

Make the plant-level check flow use the same gardener-facing journal language as the main Ask flow.

## Product Design Steps

1. Plant check prompt
   - Health: Green
   - Output: `website/components/diagnose-panel.tsx`
   - Changed the prompt from `What are you seeing?` to `What changed on this plant?`

2. Saved plant-check note
   - Health: Green
   - Output: `website/components/diagnose-panel.tsx`
   - Changed saved diagnosis notes from `Garden answer` to `Plant check`.

3. Care-list source wording
   - Health: Green
   - Output: `website/components/diagnose-panel.tsx`
   - Changed added care notes from `From asking about...` to `From this plant check: ...`.

4. Regression coverage
   - Health: Green
   - Output: `website/tests/diagnose-panel-content.test.ts`
   - Updated diagnosis-panel tests to require the new phrases and reject the older vague/internal wording.

## Evidence

- Product Design audit, Product Design critical overrides, saved user-context preflight, session-budget guidance, Garden.io memory, current-state docs, and style/branding docs were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo, current app source, and Garden.io memory as grounding.
- Focused tests passed: `diagnose-panel-content.test.ts`, `sample-garden.test.ts`, and `ai-first-garden-home.test.tsx` - 3 files, 20 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source scan confirms the diagnosis panel now uses `What changed on this plant?`, `Plant check`, and `From this plant check:`.
- Source scan confirms the old `What are you seeing?`, `Garden answer`, and `From asking about` phrases are absent from the diagnosis component and only remain as negative test assertions in related tests.
- Live `/sample-garden/garden-memory` and full zone/bed/plant deep link both load cleanly; the diagnosis panel is not included in the server-rendered HTML for those initial states, so component render tests are the authoritative evidence for the diagnosis-panel copy.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture is blocked by safety policy, and Playwright fallback requires explicit permission under the Product Design rules.
