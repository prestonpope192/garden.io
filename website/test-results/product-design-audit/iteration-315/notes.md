# Iteration 315 - Ask Action Copy

Date: 2026-06-23
Surface: sample/app Ask surface and plant question panel
Health: Green

## Goal

Make the primary question actions feel like plain gardener actions instead of generic product or AI guidance labels.

## Changes

- Changed the Ask composer submit label from `Get guidance` to `Ask from your garden`.
- Changed the Ask composer image alt text from `Photo selected for Garden.io` to `Photo added for this question`.
- Changed the plant-question panel action from `Get guidance` to `Check this plant`.
- Updated Ask, sample garden, and DiagnosePanel tests to require the new labels and reject the older product-facing phrases.

## Files

- `website/components/views/garden-ask-view.tsx`
- `website/components/diagnose-panel.tsx`
- `website/tests/ai-first-garden-home.test.tsx`
- `website/tests/sample-garden.test.ts`
- `website/tests/diagnose-panel-content.test.ts`

## Evidence

- Product Design audit, Product Design index, user-context preflight, critical overrides, design-audit framework, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `diagnose-panel-content.test.ts`, and `diagnose-route-copy.test.ts` - 4 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/sample-garden/ask` contains `Your garden, smarter`, `Add a note or photo`, and `Ask from your garden`.
- Live `/sample-garden/ask` did not return the older `Get guidance` or `Photo selected for Garden.io` phrases in the route probe.
- The plant-specific `Check this plant` label is covered by rendered component tests because that panel appears only after opening a plant/question context.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
