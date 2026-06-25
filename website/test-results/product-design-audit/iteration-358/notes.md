# Iteration 358 - Plant Check Panel Copy

Date: 2026-06-24
Task class: build work
Surface: `DiagnosePanel`, plant-specific check panel

## Objective

Make the plant-specific check panel feel like part of the garden journal: check what changed on this plant, then keep the check tied to that plant's notes, bed, and season.

## Product Design Steps

1. Step 1 - Plant check source and test review: healthy.
   - Inspected `DiagnosePanel`, its content tests, and the currently rendered sample route behavior.
2. Step 2 - User-facing copy simplification: healthy.
   - Changed `Ask about this plant` to `Check this plant`.
   - Changed the helper line to `Add what changed on {plant}. Its notes, bed, and season stay with this check.`
3. Step 3 - Regression coverage: healthy.
   - Updated DiagnosePanel tests to require the new copy and reject the older ask/narrow wording.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and source/live probes passed.

## Findings

- Strength: the panel already avoids provider and product-internal language.
- UX issue addressed: `Ask about this plant` made the feature feel like a chatbot, while `Check this plant` better matches the user's garden task.
- Limit: the sample route did not SSR this panel in the checked state, so live verification for this specific panel uses component render tests and source inspection.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.

## Verification

- Focused tests passed from the website package: `diagnose-panel-content.test.ts`, `sample-garden.test.ts`, `empty-state-content.test.ts`, and `mobile-layout-css.test.ts` - 4 files, 25 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Source contains `Check this plant` and `Add what changed on {context.name}. Its notes, bed, and season stay with this check.`
- Source no longer contains `Ask about this plant` or `help narrow what to check`.
- Component tests render the new `Autumn Sage` copy and reject the older ask/narrow wording.
- Live `/sample-garden/property` does not expose `Ask about this plant`, `help narrow what to check`, `AI`, or `Working product`.
