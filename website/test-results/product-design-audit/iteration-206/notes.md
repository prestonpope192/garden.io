# Iteration 206 - Entry CTA Consistency

Date: 2026-06-22

## Scope

Make the homepage and sign-in gate use the same plain trial-garden action as the trial garden itself.

## Changed

- Replaced `See it in action` with `Look around` on the homepage hero CTA.
- Replaced the same CTA in the homepage closing CTA.
- Replaced the sign-in gate trial-garden link with `Look around`.
- Updated the unavailable sign-in message to say users can still `look around or find plants that fit`.
- Added regression coverage so `See it in action` does not return to the homepage/auth entry points.

## Why

- `See it in action` is a product-demo phrase.
- `Look around` describes the visitor's immediate action in simpler language.
- The public entry points now match the trial garden header, which already uses `Look around`.

## Verification

- Focused `npm test -- homepage-content.test.ts auth-gate-content.test.ts sample-garden.test.ts` passed from `website/`: 3 files, 15 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Sequential rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, and `/catalog/french-marigold`.
- The same probe confirmed `/`, `/app/my-property`, and `/sample-garden/property` render `Look around`.
- The same probe confirmed visible copy no longer contains `See it in action`.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread, and Computer Use could not attach to a Chrome window in the previous capture attempt.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
