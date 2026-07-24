# Iteration 394 - Ask Empty State First Plant Copy

Date: 2026-06-24

## Objective

Make the Ask view no-garden empty state simpler and more action-oriented, so a new gardener sees one clear next step instead of setup scaffolding.

## What Changed

- `website/components/views/garden-ask-view.tsx`
  - Changed the no-garden context line to `Add one plant to begin.`
  - Changed the empty-state label to `First plant`.
  - Changed the heading to `Add one plant to begin.`
  - Changed the support copy to `Put it in a bed once. Notes, photos, and care stay connected after that.`
  - Changed the CTA to `Add one plant`.
- `website/tests/ai-first-garden-home.test.tsx`
  - Updated no-garden Ask assertions for the new copy.
  - Added guards against `Start here`, `Start with one plant.`, `Start by giving one plant a place.`, and `Add your first plant`.

## Evidence

- Focused tests passed from `website`:
  - `npm test -- ai-first-garden-home.test.tsx sample-garden.test.ts`
  - 2 files, 18 tests.
- Live route probe:
  - `/sample-garden/ask` returned `200`.
  - Found `Garden Check`.
  - Found `Describe what changed. Save the next care step.`
  - Did not find `Start here`.
  - Did not find `Start by giving one plant a place.`
- The no-garden panel does not render on the sample route because the sample garden already has plants; the focused component test renders that state directly.
- Full verification passed from `website`:
  - `npm test`
  - `npm run build`
  - `git diff --check`

## Remaining Uncertainty

No browser screenshot was captured in this pass. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Action

Continue the cleanup loop by aligning the public sign-in/start card with the same first-plant language, then inspect Calendar and Plant Journal empty states for similar setup phrasing.
