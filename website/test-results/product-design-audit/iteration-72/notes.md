# Iteration 72 - Plant Guide Value Proposition Cleanup

## Flow Steps Checked

1. Public Plant Guide
   - Health: improved by route text, tests, and build.
   - Notes: the hero now speaks to the gardener's decision: whether a plant fits the garden before buying, planting, or giving it bed space. Count-heavy language was reduced from "plants to compare" to "plants with care notes."

2. Filtered Public Plant Guide
   - Health: healthy by route text and image-source checks.
   - Notes: filtered search still features a real-photo match when available and keeps no-photo matches as clean text rows.

3. Public Plant Detail
   - Health: improved by route text checks.
   - Notes: the closing action no longer implies a one-click save. It now asks the user to start a record when the plant is actually in the garden.

4. Sample Plant Guide
   - Health: improved by route text and regression tests.
   - Notes: sample copy now says "Check care needs and garden fit" and "plants with care notes," avoiding catalogue-style comparison language.

## Screenshot Capture

- No new accepted screenshots were captured in this pass.
- Evidence is route text, image-source scans, source inspection, tests, and build output.

## Evidence

- Focused tests passed: `catalogue-format.test.ts`, `public-catalogue-content.test.ts`, and `sample-garden.test.ts` (3 files, 20 tests).
- Full `npm test` passed: 17 files, 77 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Route scan passed for `/catalog`, `/catalog?q=sage`, `/catalog/french-marigold`, `/sample-garden/catalogue`, and `/app/plant-catalogue`.
- Checked routes had no stale hits for `Find plants that fit.`, `plants to compare`, `Save what fits`, `quick care needs`, `Compare care needs`, `Save this plant to your garden`, `Save it when ready`, old add/save subtitle copy, beta, waitlist, prototype, private-link copy, or visible `No photo yet`.
- Checked routes had `0` SVG image sources; `/catalog` rendered 7 `plant-art` images, `/catalog?q=sage` rendered 3, `/catalog/french-marigold` rendered 1, and `/sample-garden/catalogue` rendered 3.

## Remaining Limits

- Authenticated signed-in visual QA still needs a reliable screenshot path.
- Keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload remain unverified.
