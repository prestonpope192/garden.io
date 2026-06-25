# Iteration 353 - Plants Scan And Save Promise

Date: 2026-06-24
Task class: build work
Surface: `/sample-garden/plants`, `PlantsView`

## Objective

Make the Plants surface easier to understand at a glance: see what needs care, then keep notes and photos with the right plant.

## Product Design Steps

1. Step 1 - Plants source and live text review: healthy.
   - Inspected the sample plants route, `PlantsView`, app/sample view titles, and Plants-focused tests.
2. Step 2 - Copy simplification: healthy.
   - Changed `See what needs care and keep every note and photo with the right plant.` to `See what needs care, then keep notes and photos with the right plant.`
3. Step 3 - Regression coverage: healthy.
   - Updated sample and empty-state tests to require the new copy and reject the older wording.
4. Step 4 - Live route and build verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the route already shows plant care notes and avoids beta, AI/provider, and product-internal language.
- UX issue addressed: the previous sentence was a little wordy and less scannable because it bundled the two actions without a clear pause.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection, render tests, and live route HTML probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/plants` contains `Plants`, `Plant journal`, `See what needs care, then keep notes and photos with the right plant.`, `Care note:`, and `4 plants have care this week.`
- Live `/sample-garden/plants` does not contain `See what needs care and keep every note and photo with the right plant.`, `Next care:`, `Plant records`, `AI`, `beta`, `early access`, or `Working product`.
