# Iteration 350 - Ask Surface Three-Second Loop

Date: 2026-06-24
Task class: build work
Surface: `/sample-garden/ask`, `GardenAskView`

## Objective

Make the Ask surface explain the user value faster: describe what changed, get one care step, and keep the note/photo/care step with the right plant.

## Product Design Steps

1. Step 1 - Ask surface source and live text review: healthy.
   - Inspected `GardenAskView`, app/sample view titles, Ask-focused tests, and live `/sample-garden/ask` HTML.
2. Step 2 - Copy simplification: healthy.
   - Changed the inner Ask label from `Your garden, smarter` to `One clear next step`.
   - Changed the Ask subtitle to `Describe the change. Get one care step you can save with the plant.`
   - Changed the composer hint to `Your note, photo, and care step stay together.`
3. Step 3 - Regression coverage: healthy.
   - Updated Ask and sample-garden tests to require the new loop and reject the older copy.
4. Step 4 - Live route and build verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the Ask screen already avoids beta, early-access, and developer-facing AI/provider language.
- UX issue addressed: the page repeated `Your garden, smarter` and did not state the full save loop as plainly as it could.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection, render tests, and live route HTML probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `quick-log-content.test.ts` - 3 files, 20 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/ask` contains `One clear next step`, `Describe the change. Get one care step you can save with the plant.`, and `Your note, photo, and care step stay together.`
- Live `/sample-garden/ask` does not contain `Describe what changed. Get one clear care step from your garden notes.`, `Save the note so next week is easier.`, `Ask your garden`, `Ask Garden.io`, `Garden.io uses your plant records`, `AI`, `beta`, `early access`, or `Working product`.
