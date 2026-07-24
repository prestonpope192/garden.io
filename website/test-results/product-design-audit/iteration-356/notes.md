# Iteration 356 - Homepage Plant Record Promise

Date: 2026-06-24
Task class: build work
Surface: `/`, homepage tracking loop

## Objective

Make the homepage's care-guidance promise read like a calm plant-record workflow: notice what changed, then start from the plant's saved place and notes.

## Product Design Steps

1. Step 1 - Homepage source and test review: healthy.
   - Inspected the homepage tracking loop, homepage section intro, and homepage content tests.
2. Step 2 - User-facing copy simplification: healthy.
   - Changed `Know the next care step` to `Care from the plant record`.
   - Changed `When something looks off, ask with the plant and what you already noticed.` to `When something looks off, start with that plant's place and notes.`
   - Changed `Describe what changed...` to `Notice what changed...`
3. Step 3 - Regression coverage: healthy.
   - Updated homepage tests to require the new copy and reject the older know/ask framing.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the homepage already uses the simpler `Your garden, smarter` hero and journal-style plant imagery.
- UX issue addressed: the old loop item still sounded like a generic advice engine instead of a garden notebook that keeps context with each plant.
- Copy rationale: `Care from the plant record` is more concrete and reinforces why saving plant/place/notes matters.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection, render tests, and live route HTML probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `homepage-content.test.ts`, `homepage-visual-css.test.ts`, `auth-gate-content.test.ts`, and `sample-garden.test.ts` - 4 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/` contains `Your garden, smarter.`, `Care from the plant record`, `When something looks off, start with that plant's place and notes.`, and `Notice what changed, then keep the useful care step with the right plant.`
- Live `/` does not contain `Know the next care step`, `When something looks off, ask with the plant and what you already noticed.`, `Describe what changed, then keep the useful care step with the right plant.`, `Know what to do next`, `Ask from your garden`, `AI can use your notes`, `early access`, `Working product`, or `whole product`.
