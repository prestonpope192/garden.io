# Iteration 297 - Homepage Plant Plate And Memory Copy

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Goal

Move the homepage farther toward the living botanical notebook direction by using journal-style plant imagery and simpler memory-guided care language.

## What Changed

- Replaced the homepage showcase plants with `Calendula`, `Cilantro`, and `Bell Pepper` from the `plant-art` bucket.
- Changed the hero image framing from a garden note/photo feel to a field-guide plate: `Calendula field-guide plate` and `Calendula botanical plate`.
- Simplified the three-step homepage loop from map/save/ask-with-context to `Place each plant`, `Save the moment`, and `Ask from memory`.
- Changed the section support copy to emphasize memory: `Every note, photo, and harvest gives the next question more memory.`
- Changed the plant section from story/product-ish copy to journal copy: `Each plant keeps its place in the journal.`
- Updated homepage tests to protect the new plant set, plant-art URLs, and simpler user-facing copy.

## Evidence

- Product Design index, audit, user-context, and critical overrides were reread during the pass.
- Product Design user-context preflight ran; no saved product/design entries were available.
- Current-state and style/branding docs were checked; the work follows the `living botanical notebook` direction.
- Focused tests passed: `homepage-content.test.ts`, `homepage-visual-css.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 4 files, 24 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered homepage contains `Calendula field-guide plate`, `Place each plant`, `Save the moment`, `Ask from memory`, `Bloom notes`, `Harvest timing`, and `Water and fruit set`.
- Rendered homepage image URLs include `plant-art%2Fcalendula.jpg`, `plant-art%2Fcilantro.jpg`, and `plant-art%2Fbell-pepper.jpg`.
- The only live `Apple` match was the default Next fallback font stack string `Apple Color Emoji`, not visible homepage plant content.

## Limit

Browser screenshot capture was not used. Browser/Chrome audit tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

Inspect the public catalogue and plant detail pages for the same issue: useful plant content is present, but some labels still feel like app/system framing instead of a field guide connected to a garden notebook.
