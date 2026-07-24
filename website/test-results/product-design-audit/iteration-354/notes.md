# Iteration 354 - Ask Promise Simplification

Date: 2026-06-24
Task class: build work
Surface: `/sample-garden/ask`, `GardenAskView`

## Objective

Make the Ask surface easier to understand at a glance by leading with `Your garden, smarter` and describing the actual user action: notice what changed, then save one care step with the plant.

## Product Design Steps

1. Step 1 - Ask source and test review: healthy.
   - Inspected `GardenAskView`, app/sample view titles, homepage copy context, and Ask-focused tests.
2. Step 2 - User-facing copy simplification: healthy.
   - Changed the visible Ask kicker from `One clear next step` to `Your garden, smarter`.
   - Changed the Ask promise from `Describe the change. Get one care step you can save with the plant.` to `Notice what changed, then save one care step with the plant.`
3. Step 3 - Regression coverage: healthy.
   - Updated sample and AI-first Ask tests to require the new copy and reject the older phrasing.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the Ask route already avoids provider/internal language like `AI`, `beta`, and `Garden.io answer`.
- UX issue addressed: the old visible kicker made the surface sound like a task-output machine instead of a calmer garden journal helper.
- Copy rationale: `Your garden, smarter` is short enough for the three-second read and the supporting line keeps the value concrete.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection and will use render tests/live route probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, `homepage-content.test.ts`, and `auth-gate-content.test.ts` - 4 files, 24 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/ask` contains `Your garden, smarter` and `Notice what changed, then save one care step with the plant.`
- Live `/sample-garden/ask` does not contain `One clear next step`, `Describe the change. Get one care step you can save with the plant.`, `Know what to do next`, `Ask your garden`, `Ask Garden.io`, `AI`, `beta`, `early access`, or `Working product`.
