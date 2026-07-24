# Iteration 207 - Plant Fact Label Clarity

Date: 2026-06-22

## Scope

Clarify the plant facts label where the UI combines lifecycle and plant form into one short value.

## Changed

- Replaced `Plant type` with `Plant kind` on the public catalogue feature card.
- Replaced the same label on public plant detail quick facts.
- Replaced the same label in the in-app My Garden plant detail drawer.
- Kept plant-type filters unchanged: `Choose plant type` still labels the filter control where the user is actually choosing a type.
- Added regression coverage for the new label and for preventing the old combined `Plant type` label from returning.

## Why

- The value combines lifecycle and form, such as `Annual · Flower` or `Perennial · Shrub`.
- `Plant type` is too narrow for that combined value.
- `Plant kind` is simpler and better matches how gardeners scan quick facts.

## Verification

- Focused `npm test -- public-catalogue-content.test.ts empty-state-content.test.ts catalogue-format.test.ts` passed from `website/`: 3 files, 25 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/sample-garden/property`, `/sample-garden/plants`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- The same probe confirmed `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf` render `Plant kind`.
- The same probe confirmed old combined labels like `Plant type Annual` and `Plant type Perennial` are not visible on those routes.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread, and Computer Use could not attach to a Chrome window in the previous capture attempt.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
