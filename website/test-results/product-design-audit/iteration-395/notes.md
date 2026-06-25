# Iteration 395 - Auth Start Card First Plant Copy

Date: 2026-06-24

## Objective

Align the public sign-in/start card with the simplified first-plant action used in the Ask no-garden state, so new users hear the same starting instruction across entry points.

## What Changed

- `website/components/auth-gate.tsx`
  - Changed the start-card line from `Start with one plant.` to `Add one plant to begin.`
  - Changed `SIGN_IN_SENT_MESSAGE` to `Check your email. Open the garden link, then add one plant to begin.`
- `website/tests/auth-gate-content.test.ts`
  - Updated assertions for the new start-card line.
  - Added guards against the old `Start with one plant` and `Open the garden link, then start with one bed or plant` phrases.

## Evidence

- Focused tests passed from `website`:
  - `npm test -- auth-gate-content.test.ts homepage-content.test.ts ai-first-garden-home.test.tsx`
  - 3 files, 11 tests.
- Live route probe:
  - `/app` returned `200`.
  - Found `Add one plant to begin.`
  - Found `Put it in a bed once. Notes, photos, and care stay connected after that.`
  - Did not find `Start with one plant.`
- Full verification passed from `website`:
  - `npm test`
  - `npm run build`
  - `git diff --check`

## Remaining Uncertainty

No browser screenshot was captured in this pass. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Action

Continue the cleanup loop by inspecting Calendar and Plant Journal empty states for first-plant/setup phrasing, then decide whether the homepage fit note should also adopt the same first-plant wording.
