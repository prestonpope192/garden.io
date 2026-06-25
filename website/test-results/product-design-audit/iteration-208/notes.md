# Iteration 208 - Homepage Plant Help Promise

Date: 2026-06-22

## Scope

Make the homepage AI-help promise sell the user's outcome instead of naming the feature.

## Changed

- Replaced the homepage card title `Ask about one plant` with `Ask what to do next`.
- Replaced `When something looks off...` with `When a plant looks off...`.
- Kept the explanation grounded in existing plant context: notes, bed, photo, and season.
- Kept the in-app plant panel label `Ask about this plant`, where the selected plant context is already clear.
- Added regression coverage so the older homepage feature label does not return.

## Why

- `Ask about one plant` describes the feature.
- `Ask what to do next` describes the user's felt need when something looks wrong.
- The homepage now communicates the value in fewer words while preserving the app's actual behavior.

## Verification

- Focused `npm test -- homepage-content.test.ts` passed from `website/`: 1 file, 3 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/sample-garden/property`, `/sample-garden/plants`, `/catalog`, and `/catalog/french-marigold`.
- The same probe confirmed `/` renders `Ask what to do next`.
- The same probe confirmed `/` no longer renders `Ask about one plant`.
- Real-photo HEAD checks returned 200 image/jpeg for the three homepage plant photos: French Marigold, Autumn Sage, and Curry Leaf.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread, and Computer Use could not attach to a Chrome window in the previous capture attempt.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, rendered HTML visible-text probes, and direct image URL checks.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
