# Iteration 362 - Care Plan Labels

Date: 2026-06-24
Task class: build work
Surface: Garden Home, Property, Calendar, Plant Timeline, Plant Check, mutation feedback

## Objective

Make care actions sound like part of the gardener's ongoing plan instead of a software list.

## Product Design Steps

1. Step 1 - Current care-copy review: healthy.
   - Inspected app source and tests for `care list`, `care plan`, `Add to care list`, and related save/reopen/remove labels.
2. Step 2 - User-facing copy simplification: healthy.
   - Replaced visible `care list` labels with `care plan`, and destructive history copy with `care history`.
3. Step 3 - Regression coverage: healthy.
   - Updated mutation, sample-garden, and empty-state tests to require the new wording and reject the older list wording.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and source/live probes passed.

## Findings

- Strength: the previous pass already established `care plan` as the homepage promise.
- UX issue addressed: action labels still said `care list`, which felt more like task software than a garden notebook.
- Copy change: `Add to care plan` now appears consistently wherever care is saved from checks, suggestions, timelines, and calendar forms.
- Limit: test names may still mention care list as historical wording, but app/components/lib source no longer expose it as product copy.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.

## Verification

- Focused tests passed from the website package: `garden-mutation-copy.test.ts`, `sample-garden.test.ts`, `empty-state-content.test.ts`, `diagnose-panel-content.test.ts`, `plant-timeline-content.test.ts`, and `app-flow-visual-css.test.ts` - 6 files, 36 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/property`, `/sample-garden/calendar`, and `/sample-garden/ask` do not expose `care list`.
- Source contains `Added to your care plan.`, `Back in your care plan.`, `Add to care plan`, `Remove from care plan`, `See care plan`, and `Notes and care history stay in your garden history.`
- App/component/lib source no longer contains `care list` or `Care list`.
- Note: the positive `Add to care plan` buttons are mostly hidden on read-only sample routes, so source and component tests provide the positive label proof.
