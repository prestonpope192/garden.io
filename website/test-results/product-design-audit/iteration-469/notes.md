# Iteration 469 - Homepage and Garden Check Promise Copy

Date: 2026-06-24
Surface: `/`, `/sample-garden/ask`, shared metadata

## Scope

Shift the first-impression copy away from a product-like "get one care step" pitch and toward the simpler gardener habit: save what changed, keep what helped, and see what works over time.

## Changed

- Homepage hero lead now says `Save what changed. Keep what helped. See what works.`
- Homepage tracking loop now uses `Keep what helped` with the explanation `Save useful care with the plant or bed it belongs to.`
- Shared metadata now says `Save garden notes, keep what helped, and see what works over time.`
- Garden Check entry now says `Add a note or photo. Keep what helped with the right plant.`
- Garden Check button now says `Check this change` instead of `Get one care step`.
- Garden Check helper text now says `Save it once. Future checks remember.`
- Garden Check loading text now says `Looking for what may help...`
- Content tests now protect the new wording and reject the older product-like phrasing.

## Evidence

- Live `/` route-output probe found `Your garden, smarter.`, `Save what changed. Keep what helped. See what works.`, and `Keep what helped`.
- Live `/sample-garden/ask` route-output probe found `Your garden, smarter.`, `Add a note or photo. Keep what helped with the right plant.`, `Check this change`, and `Save it once. Future checks remember.`
- Focused tests passed from the website package: `homepage-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 3 files, 23 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. This pass used server-rendered route text plus test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
