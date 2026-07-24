# Iteration 359 - Quick Note Plant Check Action

Date: 2026-06-24
Task class: build work
Surface: `PropertyView`, quick note follow-up action

## Objective

Keep the note-to-plant-check flow consistent with the garden-journal language: save the note, then check this plant.

## Product Design Steps

1. Step 1 - Quick note source and test review: healthy.
   - Inspected `QuickLog`, `PropertyView`, `DiagnosePanel`, and quick-log copy tests.
2. Step 2 - User-facing copy simplification: healthy.
   - Changed `Save and ask about this plant` to `Save and check this plant`.
   - Updated related seed comments from ask language to check language.
3. Step 3 - Regression coverage: healthy.
   - Updated quick-log tests to require the new label and reject the older ask wording.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and source/live probes passed.

## Findings

- Strength: the quick-log form already frames capture as saving what happened.
- UX issue addressed: the follow-up action still used `ask`, which conflicted with the cleaner `Check this plant` panel language.
- Limit: the live sample route does not expose this button until a plant note is being composed, so proof uses source inspection plus component tests.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.

## Verification

- Focused tests passed from the website package: `quick-log-content.test.ts`, `diagnose-panel-content.test.ts`, `sample-garden.test.ts`, and `empty-state-content.test.ts` - 4 files, 25 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- `PropertyView` source contains `Save and check this plant` and no longer contains `Save and ask about this plant`.
- `DiagnosePanel` seed comments now use `check the plant` and no longer use `ask about the plant`.
- Quick-log tests require the new label and reject the older ask wording.
- Live `/sample-garden/property` does not expose `Save and ask about this plant`, `Ask about this plant`, `AI`, or `Working product`.
