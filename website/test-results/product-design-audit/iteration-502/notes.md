# Iteration 502 - Empty Saved Plants CTA

Date: 2026-06-24
Surface: Plant Journal empty saved-list state
Health: Green

## Goal

Keep empty states focused on what the gardener wants to do, not on app navigation or feature names.

## Change

- Changed the empty saved-plants CTA from `Open field guide` to `Choose plants`.
- Updated empty-state regression coverage to require the user-action copy and reject the old navigation-style phrase.

## Files

- `website/components/views/plants-view.tsx`
- `website/tests/empty-state-content.test.ts`

## Evidence

- Product Design critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Source scan confirms `Choose plants` in the empty saved-plants CTA and no `Open field guide` in the checked source/tests.
- Focused tests passed: `empty-state-content.test.ts`, `sample-garden.test.ts`, and `ai-first-garden-home.test.tsx` - 3 files, 26 tests.
- Full `npm test` passed: 23 files, 131 tests.
- `npm run build` passed.
- Route probe of `/sample-garden/plants` found `Plant Journal` and no stale `Open field guide`. The sample route has saved plants, so the empty saved-list state does not render there.
- Route probe of `/app/my-plants` found `Choose plants` and no stale `Open field guide`.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- The exact empty saved-list CTA is covered by component render/source tests rather than the sample route, because the sample garden already has saved plant data.
