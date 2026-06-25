# Iteration 193 Notes

Date: 2026-06-22
Scope: make the public plant-finding path consistently talk about fit, not passive browsing.

## Changed

- Replaced the public catalogue results label `Browse plants` with `Find plants`.
- Replaced the public catalogue page top nav `Browse plants` with `Find plants`.
- Replaced the plant-detail top nav `Browse plants` with `Find plants`.
- Replaced the plant-detail secondary CTA `Browse plants` with `Find another plant`.
- Added catalogue regression coverage to require the new wording and reject `Browse plants` in the audited public catalogue/detail surfaces.

## Why

- A prospective gardener is not just browsing. They are trying to choose a plant that works in their light, water, soil, room, and season.
- `Find plants` and `Find another plant` keep the public path action-oriented without sounding technical or developer-facing.
- This aligns the catalogue with the homepage/auth copy already centered on `Find plants that fit`.

## Verification

- Focused catalogue tests passed from `website/`: `public-catalogue-content.test.ts` and `catalogue-format.test.ts`, 2 files, 15 tests.
- Full `npm test` passed from `website/`: 18 files, 93 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Local route checks returned 200 for `/`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/sample-garden/plants`.
- After restarting the local dev server, rendered `/catalog` contained `Find plants`, `Find plants that fit`, and `Check fit`; it contained zero `Browse plants` and zero `Explore plants` matches.
- Rendered `/catalog/french-marigold` contained `Find plants`, `Find another plant`, and `Choose the right spot`; it contained zero `Browse plants` matches.

## Evidence Limits

- Browser screenshot capture remains unavailable in this thread without explicit Playwright approval; current proof is source, server-rendered/component tests, build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
