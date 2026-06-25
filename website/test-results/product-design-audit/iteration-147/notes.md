# Product Design Audit Iteration 147

Date: 2026-06-22
Surface: sample garden weekly-care view
Preview: http://localhost:3020/sample-garden/calendar

## Finding

The weekly-care right rail still exposed internal suggestion taxonomy. `Worth considering` was vague, and the card-level `From your garden` type badge made the page feel like a product system instead of simple gardening guidance.

## Change

- Renamed the ideas rail to `Ideas for later`.
- Removed visible suggestion type badges from weekly-care idea cards.
- Reworded the empty later-care state to `Nothing planned after this week.`
- Updated tests to expect the new user-facing language and reject the old labels.

## Verification

- `npm test -- sample-garden.test.ts empty-state-content.test.ts garden-suggestions-history.test.ts` passed.
- `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered scan of `/sample-garden/calendar` passed with required copy present and stale labels absent.

## Evidence Limit

No fresh screenshots were captured because Browser/Chrome capture tools are not available in this thread and Playwright requires explicit approval. This iteration is validated through source checks, component tests, production build, and rendered-route visible-text scans.
