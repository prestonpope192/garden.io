# Iteration 75 Notes

## Focus

Reduce first-run setup friction and remove remaining placeholder-y photo language.

## Current-State Findings

- The first garden setup had already been simplified, but the optional details still read like configuration: `Add region, zone, and season (optional)`, `Region`, and `USDA zone`.
- The example garden name `Thornfield Garden` was evocative but less immediately relatable than a plain everyday garden name.
- Several photo fallbacks still said `No photo yet`, which reads like an internal placeholder when a prospective user hits a missing image.
- The public catalogue serializes full plant-care data into scripts; some plant records naturally mention USDA zones. Visible route scans need to strip scripts before treating copy hits as user-facing page text.

## Changes Implemented

- Rewrote first garden setup labels and placeholders:
  - `Thornfield Garden` -> `Backyard Garden`
  - `Add region, zone, and season (optional)` -> `Add location and season (optional)`
  - `Region` -> `Location or region`
  - `USDA zone` -> `Growing zone`
  - `7a` -> `7a, if you know it`
- Rewrote the garden summary metadata from `USDA Zone 8b` to `Growing zone 8b`.
- Rewrote missing-photo fallbacks from `No photo yet` to `Photo coming soon` in app plant thumbnails, catalogue cards, public catalogue images, and public plant detail pages.
- Updated regression tests for the new first-run setup and missing-photo fallback copy.

## Updated Health

- First garden setup now feels more like a quick start and less like a form-heavy configuration step.
- Missing images no longer present as internal placeholders.
- Public and sample routes remain healthy, use real plant-art image URLs where expected, and do not expose SVG-style plant image sources on the checked routes.

## Evidence

- Focused tests passed: `empty-state-content.test.ts` and `catalogue-format.test.ts`, 2 files, 12 tests.
- Full `npm test` passed: 17 test files, 77 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Visible route scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property` returned `200`.
- The same visible route scan found no visible stale hits for private-link, early-access, waitlist, prototype, `No photo yet`, old catalogue wording, old first-run optional copy, old garden-name placeholder, config jargon, or environment-variable language.
- Image-source scan on checked routes found plant-art images and `0` `.svg` image references:
  - `/`: 24 `plant-art` references
  - `/sample-garden/property`: 3 `plant-art` references
  - `/sample-garden/plants`: 15 `plant-art` references
  - `/sample-garden/calendar`: 3 `plant-art` references
  - `/sample-garden/catalogue`: 12 `plant-art` references
  - `/catalog`: 98 `plant-art` references
  - `/catalog/french-marigold`: 6 `plant-art` references
  - `/app/my-property`: 0 `plant-art` references, expected signed-out gate
- Source scan confirmed old visible fallback strings are removed from app/component source; remaining hits are negative test assertions or internal prompt/data language.

## Evidence Limits

- No new accepted screenshots were captured in this pass. Evidence is route text, image-source scans, source inspection, focused tests, full tests, source formatting, and production build.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
