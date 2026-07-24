# Iteration 434 - Shell And Homepage Value Copy

Date: 2026-06-24
Route focus:
- `/`
- app shell copy in `JournalShell`
- sample save notice copy

## Scope

Continue replacing inventory-style product copy with simple value copy. This pass focused on app-frame and homepage language that still emphasized storing notes/photos/care rather than helping the gardener remember what happened and what to do next.

## Changes

- Changed the signed-in app shell tagline from `Keep plants, notes, photos, and next care in one garden journal.` to `Remember what happened and what to do next.`
- Changed sample save notices from `Start your garden to keep notes and next care with your plants.` to `Start your garden so future checks remember it.`
- Changed the homepage habit card from `Add blooms, pests, harvests, watering, weather, and photos while they are fresh.` to `Save the change while it is fresh, with the plant or bed it belongs to.`

## Evidence

- Focused tests passed from the website package: `homepage-content.test.ts` and `sample-garden.test.ts` - 2 files, 18 tests.
- Live `/` route-output probe found `Save the change while it is fresh, with the plant or bed it belongs to.`
- Source scan found the new shell tagline, sample save notice, and homepage habit copy in source/tests.
- Source scan found the removed phrases only in negative test assertions.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
