# Iteration 313 - Plant Question Copy

Date: 2026-06-23
Surface: plant question panel and Ask answer save flow
Health: Green

## Goal

Make plant-question copy sound like practical garden help instead of the product naming its own AI/guidance layer.

## Changes

- Changed the plant-specific question panel label from `Get garden guidance` to `Ask about this plant`.
- Changed the helper copy from `Its notes, bed, and season help shape a useful answer.` to `Its notes, bed, and season help narrow what to check.`
- Changed saved diagnosis notes from `Asked for garden guidance...` to `Garden answer...`.
- Changed the plant-question save hint from `Keeps this with the plant so you remember what you tried.` to `Kept with this plant so next time starts with what you tried.`
- Changed Ask-flow care-item notes from `From garden guidance...` to `From this garden answer...`.
- Updated ask/diagnose tests to require the new wording and reject the older `garden guidance` phrases.

## Files

- `website/components/diagnose-panel.tsx`
- `website/components/views/garden-ask-view.tsx`
- `website/tests/diagnose-panel-content.test.ts`
- `website/tests/ai-first-garden-home.test.tsx`

## Evidence

- Product Design audit, Product Design index, user-context preflight, critical overrides, and session-budget guidance were read during this pass.
- Product Design saved context preflight returned no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `diagnose-panel-content.test.ts`, `diagnose-route-copy.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 4 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/sample-garden/ask` contains `Your garden, smarter`, `Add a note or photo`, `Garden notes`, `This week`, and `Field guide`.
- Source-backed route check confirmed `Ask about this plant`, `help narrow what to check`, `Garden answer`, and `From this garden answer`.
- The route/source probe did not find the older `Get garden guidance`, `From garden guidance`, or `help shape a useful answer` phrases.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- The plant-specific `DiagnosePanel` appears after selecting/working with a plant, so the exact panel copy is guarded by rendered component tests and source checks rather than the default `/sample-garden/ask` route.
