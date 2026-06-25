# Iteration 396 - Calendar And Plant Journal Empty States

Date: 2026-06-24

## Objective

Make no-plant empty states across Calendar and Plant Journal use the same simple first action: add one plant, then let notes and care attach to it.

## What Changed

- `website/components/views/plants-view.tsx`
  - Changed the no-plants message to `Add one plant to a bed. Notes, photos, and care stay connected after that.`
  - Changed the CTA to `Add one plant`.
- `website/components/views/calendar-view.tsx`
  - Changed the no-plants message to `Add one plant to begin. Then watering, pruning, harvests, and care notes have a place to live.`
  - Changed the CTA to `Add one plant`.
- `website/tests/empty-state-content.test.ts`
  - Updated empty-state assertions for the new first-plant copy.
  - Added guards against `Add your first plant` in these states.

## Evidence

- Focused test passed from `website`:
  - `npm test -- empty-state-content.test.ts`
  - 1 file, 8 tests.
- Source scan found the new Plant Journal and Calendar messages in the relevant components.
- Source scan found no remaining `Add your first plant` strings in the Plant Journal or Calendar components.
- Live route probes:
  - `/sample-garden/plants` returned `200` and did not expose `Add your first plant`, `Start here`, or `Start with one plant.`
  - `/sample-garden/calendar` returned `200` and did not expose `Add your first plant`, `Start here`, or `Start with one plant.`
- The exact empty states do not render on sample routes because the sample garden already has plants and care; focused component tests render those states directly.
- Full verification passed from `website`:
  - `npm test`
  - `npm run build`
  - `git diff --check`

## Remaining Uncertainty

No browser screenshot was captured in this pass. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Action

Continue the cleanup loop by revisiting the homepage fit note and any remaining first-plant phrasing, then inspect whether empty-state visual density needs a pass once screenshot capture is available.
