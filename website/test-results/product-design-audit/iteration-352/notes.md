# Iteration 352 - My Garden Journal Guide Copy

Date: 2026-06-24
Task class: build work
Surface: `/sample-garden/property`, `PropertyView`

## Objective

Keep the My Garden map focused on real garden use: start with the next plant to check, while still making it clear that beds and plants hold notes, photos, and care.

## Product Design Steps

1. Step 1 - My Garden source and live text review: healthy.
   - Inspected the sample property route, `PropertyView`, app/sample view titles, and My Garden tests.
2. Step 2 - Copy simplification: healthy.
   - Changed the next-care guide line to `Start with the next plant to check, or open any bed for notes and photos.`
   - Changed the quiet-state guide line to `Open any bed or plant for notes, photos, and care.`
3. Step 3 - Regression coverage: healthy.
   - Updated sample My Garden tests to require the new copy and reject the older shorter wording.
4. Step 4 - Live route and build verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the route already shows the next plant to check and avoids task-heavy labels like `What needs care next`.
- UX issue addressed: the guide copy over-narrowed the map to notes only, instead of reinforcing that place, notes, photos, and care stay together.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection, render tests, and live route HTML probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/property` contains `My Garden`, `See what grows where, with notes and care in one place.`, and `Start with the next plant to check, or open any bed for notes and photos.`
- Live `/sample-garden/property` does not contain `Start with the next plant to check, or open any bed for notes.`, `Open any bed or plant for notes and photos.`, `What needs care next`, `Next care:`, `AI`, `beta`, `early access`, or `Working product`.
- Source/test coverage confirms the quiet-state guide line is now `Open any bed or plant for notes, photos, and care.`
