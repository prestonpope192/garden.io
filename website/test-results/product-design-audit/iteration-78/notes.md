# Product Design Audit Iteration 78

Date: 2026-06-21

## Objective

Continue simplifying Garden.io around a prospective user's felt needs by removing internal/botanical language from the visible plant browsing and saved-plant flows.

## Current-State Finding

- The public catalogue and app plant surfaces were cleaner overall, but plant type labels still exposed database taxonomy.
- `forb` was formatted as `Forb`, which is botanically precise but not useful to most gardeners scanning plant cards.
- The same raw type label could appear in public catalogue rows, public plant detail quick facts, in-app catalogue cards, saved plant cards, saved plant list rows, and plant-type filters.

## Changes Implemented

- Added `formatPlantTypeLabel()` in `lib/catalogue-format.ts`.
- Mapped gardener-facing plant type labels, including `forb` -> `Flower`.
- Updated public catalogue feature cards, rows, side preview, and tags to use the new plant type label.
- Updated public plant detail page `Good to know` and taxonomy fallback to use gardener-facing labels.
- Updated the in-app catalogue chip label/fallback behavior so `forb` groups under `Flowers`.
- Updated saved plant cards, saved plant list rows, and plant-type filter options to show clean labels instead of raw codes.
- Added regression coverage for `forb` rendering as `Flower` and for public catalogue markup not showing `Forb`.

## Updated Health

- Plant browsing now reads more like a gardener's guide instead of a database view.
- Public and sample routes no longer expose `Forb`.
- Existing category matching/search still uses the stored codes, so the data model did not need to change.
- The app continues to use real plant image URLs and does not render old SVG plant art paths on checked routes.

## Evidence

- Focused tests passed: `catalogue-format.test.ts`, `public-catalogue-content.test.ts`, and `sample-garden.test.ts`, 3 files, 20 tests.
- Full `npm test` passed: 17 test files, 77 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property` returned `200`.
- The same rendered route scan found no hits for `Forb`, private beta, early access, waitlist, prototype, old product-facing copy, old SVG plant-art paths, or visible photo placeholders.
- Tighter image-source check found no `/art/plants/`, `/art/specimen-`, `.svg`, or `plant-image-placeholder` hits on `/sample-garden/plants`, `/catalog`, or `/catalog/french-marigold`.

## Evidence Limits

- No accepted screenshots were captured in this pass. In-app Browser screenshot capture previously timed out; Chrome fallback is currently unavailable because the Codex Chrome Extension is missing from the selected Chrome profile.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
