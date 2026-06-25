# Iteration 391 - Sample Care List Feedback

Date: 2026-06-24

## Objective

Remove a remaining old `care plan` phrase from the sample app so the public, browseable garden uses the same simple `care list` language as the signed-in app.

## What Changed

- `website/components/garden-app-preview.tsx`
  - Changed the sample care-delete notice from `Care kept in your plan.` to `Care kept on your list.`
- `website/tests/sample-garden.test.ts`
  - Updated the guard test to require the new sample notice.
  - Added a guard against the old `Care kept in your plan.` copy.

## Evidence

- Focused tests passed from `website`:
  - `npm test -- sample-garden.test.ts garden-mutation-copy.test.ts`
  - 2 files, 14 tests.
- Source scan found:
  - `Care kept on your list.` in `website/components/garden-app-preview.tsx`.
  - No remaining `Care kept in your plan.` string.
  - Remaining `care plan` strings are negative test guards.
- Full verification passed from `website`:
  - `npm test`
  - `npm run build`
  - `git diff --check`

## Remaining Uncertainty

No browser screenshot was captured in this pass. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Action

Continue the cleanup loop by reviewing the homepage and sample empty states for any remaining labels that sound like product scaffolding, especially `Start here`, `How it helps`, and public catalogue actions like `See this plant`.
