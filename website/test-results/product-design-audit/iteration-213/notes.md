# Iteration 213 - Plant Help Outcome Copy

Date: 2026-06-22

## Scope

Align the in-app plant-help panel with the user's actual question: what should I do next?

## Changed

- Replaced the plant-help panel label `Ask about this plant` with `Ask what to do next`.
- Replaced the saved-note prefix `Asked about this plant` with `Asked what to do next`.
- Kept the existing action button `Get a next step`.
- Added regression coverage so the older feature-like phrasing does not return.

## Why

- `Ask about this plant` describes the feature.
- `Ask what to do next` describes the user's felt need when a plant looks wrong.
- The panel now matches the homepage promise and the button action.

## Verification

- Focused `npm test -- diagnose-panel-content.test.ts diagnose-route-copy.test.ts` passed from `website/`: 2 files, 2 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- Source probe confirmed `website/components/diagnose-panel.tsx` contains `Ask what to do next` and `Asked what to do next`.
- Source probe confirmed `website/components/diagnose-panel.tsx` no longer contains `Ask about this plant` or `Asked about this plant`.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed for this pass; no new screenshot capture was attempted.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
