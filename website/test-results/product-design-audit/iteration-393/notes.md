# Iteration 393 - Homepage Daily Rhythm Copy

Date: 2026-06-24

## Objective

Make the homepage garden-loop copy sound more like a clear daily garden habit and less like an explanation of product mechanics.

## What Changed

- `website/app/page.tsx`
  - Changed `Field note: save bloom timing now, then compare it before deadheading.` to `Bloom note: compare this week's flowers before deadheading.`
  - Changed `How it helps` to `Daily rhythm`.
  - Changed `See what changed before you act.` to `Notice the change before you act.`
  - Changed `Describe what changed, then save the next step with the right plant.` to `Add a note or photo. Keep the care step with the plant it belongs to.`
- `website/tests/homepage-content.test.ts`
  - Updated positive assertions for the new homepage copy.
  - Added guards against the removed phrases.

## Evidence

- Focused test passed from `website`:
  - `npm test -- homepage-content.test.ts`
  - 1 file, 4 tests.
- Live route probe:
  - `/` returned `200`.
  - Found `Daily rhythm`.
  - Found `Notice the change before you act.`
  - Found `Add a note or photo. Keep the care step with the plant it belongs to.`
  - Did not find `How it helps`.
  - Did not find `Field note: save bloom timing now, then compare it before deadheading.`
  - Did not find `Describe what changed, then save the next step with the right plant.`
- Full verification passed from `website`:
  - `npm test`
  - `npm run build`
  - `git diff --check`

## Remaining Uncertainty

No browser screenshot was captured in this pass. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Action

Continue the cleanup loop with the Ask empty-state `Start here` language and first-plant setup copy, then revisit whether the homepage hero needs another visual-density pass after screenshots are available.
