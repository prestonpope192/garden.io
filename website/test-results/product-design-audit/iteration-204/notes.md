# Iteration 204 - Trial Garden Header Copy

Date: 2026-06-22

## Scope

Make the trial garden header feel less like product scaffolding and more like a simple user state.

## Changed

- Replaced the trial garden header status from `Try it first` to `Look around`.
- Kept the primary conversion action as `Start your garden`.
- Added regression coverage so the old `Try it first` phrasing does not return.

## Why

- `Try it first` describes the product experience from the company's point of view.
- `Look around` describes what the visitor can do right now in plain language.
- The header now reads as a lighter browse state plus one clear next action.

## Verification

- Focused `npm test -- sample-garden.test.ts` passed from `website/`: 1 file, 10 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Sequential rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, and `/catalog/french-marigold`.
- The same probe confirmed `/sample-garden/property` renders `Look around` and does not render `Try it first`.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread, and Computer Use could not attach to a Chrome window.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
