# Iteration 195 Notes

Date: 2026-06-22
Scope: remove a dead public catalogue navigation link left behind by the simplified catalogue.

## Changed

- Removed the `/catalog` top-nav `How it works` link because the catalogue page no longer has a matching `#how` section.
- Kept the useful local anchor `Find plants` pointing to the catalogue results.
- Added regression coverage so `/catalog` does not expose `href="#how"` or `How it works` without a real section.

## Why

- Dead anchor links make the simplified page feel unfinished.
- The catalogue already explains the path through the hero, search, filters, plant facts, and `Check fit` actions.
- Removing the unused nav item keeps the public header shorter and more trustworthy.

## Verification

- Focused catalogue tests passed from `website/`: `public-catalogue-content.test.ts` and `catalogue-format.test.ts`, 2 files, 16 tests.
- Full `npm test` passed from `website/`: 18 files, 94 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Local route checks returned 200 for `/catalog`, `/catalog/french-marigold`, and `/sample-garden/property`.
- After restarting the local dev server, rendered `/catalog` contained zero `href="#how"` and zero `How it works` matches; it still contained `href="#browse"` and `Find plants`.

## Evidence Limits

- Browser screenshot capture remains unavailable in this thread without explicit Playwright approval; current proof is source, server-rendered/component tests, build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
