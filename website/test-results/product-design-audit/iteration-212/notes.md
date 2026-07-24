# Iteration 212 - Homepage Top Navigation

Date: 2026-06-22

## Scope

Reduce the number of first-visit choices in the homepage header.

## Changed

- Removed the top navigation link `How it works`.
- Kept the direct `Find plants` navigation link.
- Kept the hero CTAs focused on starting a garden, looking around, and finding plants that fit.
- Added regression coverage so the removed navigation label does not return.

## Why

- `How it works` was an explanatory jump link, not a primary user task.
- The homepage already explains the product directly below the hero.
- Removing the extra top-nav choice makes the first screen cleaner and keeps attention on the actions a prospective user is most likely to take.

## Verification

- Focused `npm test -- homepage-content.test.ts` passed from `website/`: 1 file, 3 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered homepage probe returned 200 and confirmed `How it works` is no longer visible.
- Rendered homepage probe confirmed `How it helps`, `Find plants`, `Find plants that fit`, `Start your garden`, and `Look around` remain visible.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- One broad route probe briefly returned 500 for `/catalog`; three direct retries and the final full route probe returned 200, so it was treated as transient dev-server behavior rather than a reproducible route failure.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed for this pass; no new screenshot capture was attempted.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
