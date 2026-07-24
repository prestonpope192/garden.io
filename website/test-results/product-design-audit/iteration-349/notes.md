# Iteration 349 - Public Plant Detail Spot Copy

Date: 2026-06-23
Task class: build work
Surface: `/catalog/[slug]`

## Objective

Make the public plant detail page feel calmer and more useful to a prospective gardener by replacing checklist-like planting copy with a simple decision frame: find where the plant belongs before making room for it.

## Product Design Steps

1. Step 1 - Public plant detail source review: healthy.
   - Inspected `website/app/catalog/[slug]/page.tsx`, related public catalogue tests, and the live `/catalog/calendula` route text probe.
2. Step 2 - Copy simplification: healthy.
   - Changed `Before you plant` to `Find the right spot`.
   - Changed `Check the spot first.` to `Match it to your garden.`
   - Changed `Check light, water, soil, and room before it goes in the bed.` to `Check light, water, soil, and room before you make space.`
3. Step 3 - Regression coverage: healthy.
   - Updated public catalogue tests to require the new copy and reject the old phrasing.
4. Step 4 - Live route and build verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the page already avoids most internal product terms and uses real plant imagery when available.
- UX issue addressed: `Before you plant` plus `Check the spot first.` repeated the same instruction and felt more like checklist copy than useful guidance.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection, render tests, and live route HTML probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `homepage-content.test.ts` - 3 files, 26 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/catalog/calendula` contains `Find the right spot`, `Match it to your garden.`, and `Check light, water, soil, and room before you make space.`
- Live `/catalog/calendula` does not contain `Before you plant`, `Check the spot first.`, `Check light, water, soil, and room before it goes in the bed.`, `Plant profile`, `Plant details`, `Find plants`, `early access`, or `private-beta`.
