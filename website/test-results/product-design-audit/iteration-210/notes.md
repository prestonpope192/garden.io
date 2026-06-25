# Iteration 210 - Plant Detail Bed CTA

Date: 2026-06-22

## Scope

Make the public plant-detail CTA describe the user's next action more directly.

## Changed

- Replaced the plant detail heading `Save it with the right bed.` with `Add it to the right bed.`
- Kept the supporting copy: `Choose a bed, then keep notes, photos, weather, and care with this plant.`
- Added regression coverage so the older abstract heading does not return.

## Why

- `Save it with the right bed` is understandable but abstract.
- `Add it to the right bed` matches the action a gardener expects after deciding a plant fits.
- The surrounding copy still explains why the bed matters: future notes, photos, weather, and care stay connected to the plant.

## Verification

- Focused `npm test -- public-catalogue-content.test.ts` passed from `website/`: 1 file, 6 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/plants`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- The same probe confirmed plant detail routes render `Add it to the right bed`.
- The same probe confirmed plant detail routes no longer render `Save it with the right bed`.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread, and Computer Use could not attach to a Chrome window in the previous capture attempt.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
