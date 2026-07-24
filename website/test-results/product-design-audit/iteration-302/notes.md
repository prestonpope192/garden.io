# Iteration 302 - First Plant Onboarding Copy

Date: 2026-06-23 20:52 CDT
Preview: http://127.0.0.1:3021

## Scope

Make the first garden setup flow feel like a simple gardening action instead of an app workflow.

## Changed

- Changed visible `First plant path` labels to `Start with one plant`.
- Changed the setup step titles from `Add one area`, `Add one bed`, and `Add one plant` to `Name one area`, `Name one bed`, and `Add the plant`.
- Changed the area step body to start from a place the gardener can picture first.
- Changed the bed step body to `Give that plant a clear home...`.
- Changed the plant step body to `Put one plant in that bed so future notes, photos, and care stay in the right place.`
- Changed setup primary actions from `Add first area` / `Add first bed` / `Add first plant` to `Add area` / `Add bed` / `Add plant`.
- Changed the incomplete-property drawer helper from `Follow the path...` to `You can fill in the rest later.`
- Changed the incomplete-property summary to explain that one area, one bed, and one plant give notes a home.

## Evidence

- Product Design audit, user-context preflight, and critical overrides were read during this pass.
- Garden.io memory was checked to preserve the living botanical notebook / useful AI companion tension.
- Focused tests passed: `empty-state-content.test.ts`, `sample-garden.test.ts`, `app-flow-visual-css.test.ts`, and `garden-mutation-copy.test.ts` - 4 files, 32 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Source scan found `First plant path`, `Follow the path`, and `placed cleanly` only in negative test guards.
- Live `/` contains `Your garden, smarter`, `A calm garden notebook`, and `Start with one plant`.
- Live `/sample-garden/property` contains the completed-state `First place to check` and no checked `First plant path` match.
- Live `/sample-garden/ask` contains `Your garden, smarter`, `Garden notes`, `This week`, and `Field guide`.

## Limit

Browser screenshot capture was not used. The required Product Design Browser/Chrome screenshot tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

Continue reducing product-workflow language in plant detail and drawer action states.
