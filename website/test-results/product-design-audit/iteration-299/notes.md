# Iteration 299 - First Plant Path Language

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Goal

Remove setup/scaffold language from the My Garden first-plant flow so it reads like a simple journal path instead of onboarding machinery.

## What Changed

- Changed the modal label from `Setup guide` to `First plant path`.
- Changed the modal close button from `Close guide` to `Close`.
- Changed the progress aria label from `Garden setup progress` to `First plant path`.
- Changed the property drawer label from `Garden setup` to `First plant path`.
- Changed the drawer helper from setup-guide language to `Follow the path when you want one plant placed cleanly in the journal.`
- Changed the toolbar action from `Setup` to `First plant path`.
- Replaced the plant-step body copy with `Save what is growing in the first bed so notes, photos, and care have a place to gather.`
- Updated tests to guard against `Setup guide`, `Garden setup`, `Garden setup progress`, `Use the setup guide`, and `future suggestions`.

## Evidence

- Product Design index, audit, user-context preflight, and critical overrides were read during the pass.
- Garden.io brand memory was checked to keep the app aligned with botanical notebook / living memory language.
- Focused tests passed: `empty-state-content.test.ts`, `app-flow-visual-css.test.ts`, and `sample-garden.test.ts` - 3 files, 31 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Source and rendered incomplete-state tests confirm the first-plant flow contains `First plant path`, `Save what is growing in the first bed so notes, photos, and care have a place to gather`, and `Follow the path when you want one plant placed cleanly in the journal`.
- Live `/sample-garden/property` still shows the completed-state label `First place to check`, as expected for a sample garden that already has plants.

## Limit

Browser screenshot capture was not used. The required Product Design Browser/Chrome screenshot tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

Continue through the signed-in app shell and reduce remaining system labels in care lists, plant drawers, and save/feedback messages.
