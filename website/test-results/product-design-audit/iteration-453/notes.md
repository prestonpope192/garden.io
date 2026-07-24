# Iteration 453 - My Garden Section Label

Date: 2026-06-24

Surface focus:
- Sample garden My Garden route
- Shared property route title copy
- Garden plot header

## Scope

Make the My Garden record layer read less like app structure and more like a gardener's mental model.

## Changes

- Changed the shared My Garden kicker from `Beds and areas` to `Where things grow`.
- Changed the garden plot section label from `Beds and areas` to `Where things grow`.
- Updated sample-garden tests to keep the old structural phrase out of the route and shared app title copy.

## Evidence

- Live `/sample-garden/property` route-output probe found `Where things grow` in the page and plot headers and did not show `Beds and areas`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
