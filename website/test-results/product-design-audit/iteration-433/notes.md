# Iteration 433 - Plant Memory Copy Cleanup

Date: 2026-06-24
Route focus:
- `/`
- `/sample-garden/property`
- first-plant setup state in `PropertyView`
- read-only Plant Journal drawer helper

## Scope

Continue removing content-inventory copy (`notes, photos, care`) from visible app and homepage surfaces, replacing it with the user-facing value: Garden.io remembers what happened, where it happened, and what helped.

## Changes

- Changed the homepage tracking card from `Ask from saved notes` to `Get one care step`.
- Changed homepage plant-section helper from `Notes, photos, harvests, and care stay with the plant they belong to.` to `Each note helps you remember what happened and what helped.`
- Changed first-plant setup copy from `Put one plant in that bed so future notes, photos, and care stay in the right place.` to `Put one plant in that bed so future checks remember where it grows.`
- Changed read-only Plant Journal drawer helper from `Open a plant for its notes, photos, and care.` to `Open a plant to see what happened and what to do next.`

## Evidence

- Focused tests passed from the website package: `homepage-content.test.ts`, `empty-state-content.test.ts`, and `sample-garden.test.ts` - 3 files, 26 tests.
- Live `/` route-output probe found `Get one care step` and `Each note helps you remember what happened and what helped.`
- Live `/sample-garden/property` route-output probe continued to show `See what grows where, and what happened there.` and `Open a bed to see what happened there.`
- Source scan found older inventory phrases only in negative test assertions.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
