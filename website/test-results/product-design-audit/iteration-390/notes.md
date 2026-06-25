# Iteration 390 - Garden Check Copy Tightening

Date: 2026-06-24

## Objective

Make the primary AI checking surface simpler and more user-facing, with copy that promises a concrete gardener outcome instead of sounding like internal product language.

## What Changed

- `website/components/garden-app.tsx`
  - Changed the Garden Check subtitle to `Describe what changed. Save the next care step.`
- `website/components/garden-app-preview.tsx`
  - Matched the sample app subtitle to the signed-in app.
- `website/components/views/garden-ask-view.tsx`
  - Changed the main Garden Check lead to `Describe what changed. Save the next care step.`
  - Changed the composer hint to `Keep it with the plant for next time.`
- `website/tests/sample-garden.test.ts`
  - Updated positive assertions for the new copy.
  - Added negative assertions for the removed phrases.
- `website/tests/ai-first-garden-home.test.tsx`
  - Updated positive assertions for the new copy.
  - Added negative assertions for the removed phrases.

## Evidence

- Focused tests passed from `website`:
  - `npm test -- sample-garden.test.ts ai-first-garden-home.test.tsx`
  - 2 files, 18 tests.
- Live route probe:
  - `/sample-garden/ask` returned `200`.
  - Found `Describe what changed. Save the next care step.`
  - Found `Keep it with the plant for next time.`
  - Did not find `Describe what changed. Get a next step you can save.`
  - Did not find `Save it with the plant for next time.`
- Full verification passed from `website`:
  - `npm test`
  - `npm run build`
  - `git diff --check`

## Remaining Uncertainty

No browser screenshot was captured in this pass. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Action

Continue the cleanup loop with another small, high-signal phrase cluster, likely the remaining sample empty-state labels such as `Start here` or catalogue action wording where they still read like app scaffolding instead of a gardening journal.
