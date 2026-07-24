# Iteration 74 - First-Run Setup Copy

## Flow Steps Checked

1. Signed-in first garden setup
   - Health: improved by source inspection and focused tests.
   - Notes: the first prompt now reassures the user that only a garden name is needed to begin, and areas, beds, plants, and care details can come after they are inside.

2. Empty bed-arranging state
   - Health: improved by source inspection.
   - Notes: the empty bed message now says to add a bed when ready to place plants, instead of referencing a generic `Add` control.

3. Public and sample routes
   - Health: healthy by route text and image-source checks.
   - Notes: checked routes still avoid beta/private/prototype language, stale catalogue language, visible missing-photo text, and SVG image sources.

## Screenshot Capture

- No new accepted screenshots were captured in this pass.
- Evidence is route text, image-source scans, source inspection, focused tests, full tests, and build output.

## Evidence

- Focused tests passed: `empty-state-content.test.ts` and `garden-mutation-copy.test.ts` (2 files, 4 tests).
- Full `npm test` passed: 17 files, 77 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Route scan passed for `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property`.
- Checked routes had no stale hits for private-link, early-access, waitlist, prototype, visible `No photo yet`, old catalogue wording, old first-run structure copy, old no-beds copy, config jargon, or environment-variable language.
- Checked routes had `0` SVG image sources; homepage rendered 4 `plant-art` images, public catalogue rendered 7, French Marigold detail rendered 1, sample Plants rendered 4, and sample Plant Guide rendered 3.
- Source scan confirmed:
  - `Start with a name. Add areas, beds, plants, and care details after you are inside.`
  - `No beds here yet. Add one when you are ready to place plants.`

## Remaining Limits

- Authenticated signed-in visual QA still needs a reliable screenshot path.
- Keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload remain unverified.
