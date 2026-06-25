# Iteration 198 Notes

Date: 2026-06-22
Scope: align public plant pages and homepage navigation with the `Find plants` task language.

## Changed

- Replaced the homepage top-nav `Plants` link with `Find plants`.
- Replaced the public catalogue hero label `Plant guide` with `Find plants`.
- Replaced the public catalogue summary aria label `Plant guide summary` with `Find plants summary`.
- Replaced the plant detail hero label `Plant guide` with `Find plants`.
- Added regression coverage for the public catalogue and homepage labels.

## Why

- The user task is choosing plants that fit, not reading a guide.
- Public and signed-in plant-finding surfaces now use the same language: `Find plants` / `Find Plants`.
- Removing the old `Plant guide` label keeps navigation and page labels simpler and more consistent.

## Verification

- Focused public tests passed from `website/`: `homepage-content.test.ts`, `public-catalogue-content.test.ts`, and `catalogue-format.test.ts`, 3 files, 20 tests.
- Full `npm test` passed from `website/`: 18 files, 95 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Local route checks returned 200 for `/`, `/catalog`, `/catalog/french-marigold`, and `/sample-garden/catalogue`.
- Rendered `/` contained `Find plants` and zero `Plant guide`, zero `Plant Guide`, and zero `href="#plants">Plants` matches.
- Rendered `/catalog` contained `Find plants` and `Find plants summary`; it contained zero `Plant guide` and zero `Plant Guide` matches.
- Rendered `/catalog/french-marigold` contained `Find plants`; it contained zero `Plant guide` and zero `Plant Guide` matches.

## Evidence Limits

- Product Design Browser/Chrome capture tools were not exposed in this thread; Playwright was not used because explicit approval is required.
- Current proof is source, server-rendered/component tests, build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
