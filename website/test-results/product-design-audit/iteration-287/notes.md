# Iteration 287 - Care Notes, Not Next Steps

Date: 2026-06-24
Preview: http://127.0.0.1:3021

## Objective

Remove remaining public-facing "next step" and task-app language from the homepage and core sample app surfaces so Garden.io reads more like a simple garden journal with helpful care guidance.

## Audit Scope

- Homepage hero and plant story sections.
- Auth gate support copy.
- Sample ask answer copy and saved note text.
- My Plants plant-card care labels.
- Garden Memory/property drawer care label.
- Diagnose panel saved observation text.

## Finding

The homepage had moved to "Your garden, smarter," but several secondary surfaces still said "Next step," "Suggested next steps," or "Optional care tasks." Those phrases are understandable, but they pull the experience toward generic productivity software. The garden-journal direction works better when the visible language says "garden note," "care note," and "care checks."

## Changes

- Homepage lead now focuses on spotting what changed, remembering what worked, and caring with more confidence.
- Homepage hero note changed from "Next step" to "Garden note."
- Homepage plant story copy now says care history stays with the right plant.
- Ask answer notes now save "Try first" instead of "Next step."
- Ask answer action region changed from "Suggested next steps" to "Suggested care checks."
- Optional ask actions changed from "care tasks" to "care checks."
- My Plants cards and the Garden Memory drawer now use "Care note" instead of "Next step."
- Diagnose saved notes now say "Asked for garden guidance" instead of "Asked what to do next."

## Proof

- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `empty-state-content.test.ts`, and `diagnose-panel-content.test.ts` - 6 files, 33 tests.
- Full `npm test` passed: 23 files, 128 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered homepage contains "care with more confidence" and "Garden note: record bloom timing now, then compare it before pruning."
- Rendered sample My Plants route contains `Care note` labels and no matched `Next step` labels in the checked text.

## Evidence Limit

The Product Design Browser tool was not exposed in this environment, and the fallback Playwright path requires explicit permission under the Product Design rules. This pass used rendered HTML, source inspection, and automated tests rather than accepted screenshots.
