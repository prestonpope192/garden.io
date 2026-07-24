# Iteration 209 - Garden Link Button Copy

Date: 2026-06-22

## Scope

Simplify the signed-out app entry action so it reads like a direct user action instead of a clunky product-auth phrase.

## Changed

- Replaced the auth gate submit button `Email me my garden link` with `Send my garden link`.
- Kept the surrounding explanation unchanged: `Enter your email and we'll send a link to your garden. No password needed.`
- Added regression coverage so the older button label does not return.

## Why

- `Email me my garden link` is understandable but awkward.
- `Send my garden link` keeps the same meaning in fewer words.
- The form already explains email and passwordless access, so the button can stay simple and action-oriented.

## Verification

- Focused `npm test -- auth-gate-content.test.ts` passed from `website/`: 1 file, 2 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/plants`, `/catalog`, and `/catalog/french-marigold`.
- The same probe confirmed the signed-out app routes render `Send my garden link`.
- The same probe confirmed `/app/my-property` no longer renders `Email me my garden link`.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread, and Computer Use could not attach to a Chrome window in the previous capture attempt.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
