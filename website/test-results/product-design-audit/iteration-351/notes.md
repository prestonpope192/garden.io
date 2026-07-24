# Iteration 351 - This Week Next Care Check

Date: 2026-06-24
Task class: build work
Surface: `/sample-garden/calendar`, `CalendarView` route title

## Objective

Make the This Week surface explain its value more directly: start with the next care check and let everything else wait.

## Product Design Steps

1. Step 1 - This Week source and live text review: healthy.
   - Inspected the calendar route HTML, `CalendarView`, app/sample view titles, and calendar-focused tests.
2. Step 2 - Copy simplification: healthy.
   - Changed `Start with this week's care. Let the rest wait.` to `Start with the next care check. Let the rest wait.`
3. Step 3 - Regression coverage: healthy.
   - Updated sample calendar tests to require the new subtitle and reject the older wording.
4. Step 4 - Live route and build verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the route already prioritizes the first care check and avoids a dense calendar grid.
- UX issue addressed: the title subtitle described the week generally instead of naming the immediate user action.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection, render tests, and live route HTML probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/calendar` contains `This Week`, `Start with the next care check. Let the rest wait.`, `Care this week`, `Water deeply before the hot afternoon`, and `Coming up`.
- Live `/sample-garden/calendar` does not contain `Start with this week's care. Let the rest wait.`, `care jobs`, `care items`, `Needs attention`, `AI`, `beta`, `early access`, or `Working product`.
