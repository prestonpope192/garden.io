# Product Design Audit - Iteration 513

Date: 2026-06-24
Scope: make Plant Journal prospective-plant copy feel like a gardener's working list instead of an internal saved/wishlist system.

## Changed

- Renamed the visible wishlist surface from `Saved` / `Saved plants` language to `To try` / `Plants to try`.
- Changed the default wishlist note fallback from `Saved for later` to `Maybe later`.
- Changed the empty wishlist state to `No plants to try yet` with gardener-facing guidance: `Choose plants you might grow later. Plant one when you have a spot for it.`
- Changed selection, clear-filter, table, drawer, and action-helper copy to use `plant to try` language.
- Tightened the no-selection drawer copy from `Pick...` to `Choose...` for consistency with the rest of the Plant Journal.
- Updated content tests to require the new labels and reject the stale saved/wishlist phrasing.

## Evidence

- Used orchestratror-mode, Product Design critical overrides, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan confirms `website/components/views/plants-view.tsx` no longer contains the old visible saved/wishlist phrases.
- Remaining old phrase hits are negative regression guards in tests.
- Focused tests passed from the website package: `empty-state-content.test.ts`, `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, and `homepage-content.test.ts` - 4 files, 31 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used source/test verification before broader checks.
