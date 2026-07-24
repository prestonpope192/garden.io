# Iteration 214 - My Garden Care Overview Label

Date: 2026-06-22

## Scope

Make the mature My Garden overview name the user's main question instead of using a generic dashboard label.

## Changed

- Replaced the mature property overview label `Care at a glance` with `What needs care next`.
- Kept first-run setup labels unchanged: `Next: add one area`, `Next: add one bed`, and `Next: add one plant`.
- Kept the counts, place/plant prompt, and next-care task unchanged.
- Added regression coverage so mature gardens show the new outcome label and first-run setup states do not.

## Why

- `Care at a glance` is concise, but it reads like a dashboard section.
- `What needs care next` matches the product promise and the user's reason for opening My Garden.
- This brings the in-app overview closer to the homepage promise: know what needs care next.

## Verification

- Focused `npm test -- sample-garden.test.ts empty-state-content.test.ts` passed from `website/`: 2 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- Rendered `/sample-garden/property` probe confirmed `What needs care next` is visible.
- Rendered `/sample-garden/property` probe confirmed `Care at a glance` is no longer visible.
- Rendered `/sample-garden/property` probe confirmed `Next care: Water deeply before the hot afternoon` and `Pick a place or plant to see its notes and next care.` still render.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed for this pass; no new screenshot capture was attempted.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
