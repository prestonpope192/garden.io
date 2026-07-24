# Iteration 258 - Ask Result Priority

Date: 2026-06-23

Scope: simplify the first mobile viewport after a gardener receives an Ask answer.

## Screenshots

- `screenshots/01-result-top-before.png` - the previous result top with secondary checks and two `Add` buttons before memory.
- `screenshots/02-result-top-after.png` - the revised result top with one primary action, one follow-up check, and the memory action visible.
- `screenshots/03-more-checks-open.png` - the optional secondary checks after the memory action.

## Finding

- The result had a useful first action, but two secondary `Add` controls appeared before the memory action.
- The save panel started below the first viewport, so the AI-memory value was not visible soon enough.
- The optional explanation also competed with the core flow before the user had saved the answer.

## Changed

- Kept only the primary care action in the main `Do this first` section.
- Moved the `Make future help smarter` save panel above optional reasoning.
- Moved secondary checks into a closed `More checks` detail after the save panel.
- Kept the secondary checks addable when the detail is opened.
- Added regression expectations for the new optional checks placement and shared detail styling.

## Result

- The first mobile viewport now answers the gardener's immediate question: what to do, what to check, and how to remember it for better future help.
- Secondary care tasks remain available without distracting from the primary action.
- The explanation still exists, but it no longer delays the memory action.

## Evidence

- In-app browser capture at `http://127.0.0.1:3021/sample-garden/ask` confirms the memory action appears in the first mobile result viewport.
- DOM verification showed the `More checks` detail is closed by default and opens with two visible addable secondary checks.
- Focused tests passed: `mobile-layout-css.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts`, 3 files, 17 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Evidence Limits

- This pass covered the sample Ask result at a 390px viewport.
- It did not test real authenticated image upload or API-backed diagnosis responses.
- Screenshot inspection does not prove full keyboard or screen-reader behavior for the native detail controls.
